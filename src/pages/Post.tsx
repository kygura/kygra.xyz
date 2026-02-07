import React, { useMemo } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useMarkdownPost } from "../hooks/useMarkdownPosts";
import CodeBlock from "../components/CodeBlock";
import PostImage from "../components/PostImage";
import Alert from "../components/Alert";

const Post = () => {
  const { slug } = useParams();
  const post = useMarkdownPost(slug);

  // Handle post not found
  if (!post) {
    return <Navigate
      to="/writings"
      replace />;
  }

  return (
    <div className="px-6 md:px-12 lg:px-16 py-16 md:py-24 max-w-3xl mx-auto animate-fade-in ">
      <Link
        to="/writings"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300 mb-12"
      >
        <ArrowLeft className="w-5 h-5 hover:scale-110 hover:translate-x-1 " />
        Back to writings
      </Link>

      <article className="prose-minimal">
        <h1 className="text-2xl md:text-5xl font-display font-light mb-6">
          {post.title}
        </h1>

        {(post.date || post.readTime) && (
          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-12">
            {post.date && (
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
            {post.readTime && (
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.readTime} read
              </span>
            )}
          </div>
        )}

        <div className="prose-minimal">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              pre({ children }: any) {
                // Return a fragment or unstyled div to avoid double styling by prose-minimal pre
                return <div className="not-prose my-6">{children}</div>;
              },
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '')

                if (!inline) {
                  return (
                    <CodeBlock
                      language={match ? match[1] : undefined}
                      value={String(children).replace(/\n$/, '')}
                      className={className}
                      {...props}
                    />
                  )
                }

                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              },
              img({ node, ...props }: any) {
                return (
                  <PostImage
                    {...props}
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                );
              },
              blockquote({ children, ...props }: any) {
                // Helper to recursively extract text content from React nodes
                const extractText = (node: any): string => {
                  if (!node) return "";
                  if (typeof node === "string") return node;
                  if (Array.isArray(node)) return node.map(extractText).join("");
                  if (node.props && node.props.children) return extractText(node.props.children);
                  return "";
                };

                const childrenArray = React.Children.toArray(children);

                // Find the first meaningful child (ignore whitespace strings)
                const firstContentIndex = childrenArray.findIndex(child => {
                  if (typeof child === 'string') return child.trim().length > 0;
                  return true; // Elements are content
                });

                if (firstContentIndex !== -1) {
                  const contentChild = childrenArray[firstContentIndex];
                  const textContent = extractText(contentChild);

                  if (textContent) {
                    // Relaxed regex to handle potential leading whitespace or newlines
                    const match = textContent.match(/^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/);
                    if (match) {
                      const type = match[1] as any;
                      const pattern = /^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/;

                      const processChildren = (nodes: React.ReactNode): React.ReactNode => {
                        let found = false;
                        return React.Children.map(nodes, (child) => {
                          if (found) return child;

                          if (typeof child === 'string') {
                            if (child.match(pattern)) {
                              found = true;
                              return child.replace(pattern, '');
                            }
                            return child;
                          }

                          if (React.isValidElement(child) && (child.props as any).children) {
                            const processed = processChildren((child.props as any).children);
                            return React.cloneElement(child, {}, processed);
                          }
                          return child;
                        });
                      };

                      // Transform the specific child that contains the trigger
                      const newContentChild = React.isValidElement(contentChild)
                        ? React.cloneElement(contentChild as React.ReactElement, {}, processChildren(contentChild.props.children))
                        : (typeof contentChild === 'string' ? contentChild.replace(pattern, '') : contentChild);

                      /* 
                         Reconstruct children: 
                         0..firstContentIndex-1 (whitespace)
                         newContentChild (stripped trigger)
                         firstContentIndex+1..end (rest)
                      */
                      const newChildren = [
                        ...childrenArray.slice(0, firstContentIndex),
                        newContentChild,
                        ...childrenArray.slice(firstContentIndex + 1)
                      ];

                      return (
                        <Alert type={type}>
                          {newChildren}
                        </Alert>
                      );
                    }
                  }
                }

                return <blockquote {...props}>{children}</blockquote>;
              }
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
};

export default Post;
