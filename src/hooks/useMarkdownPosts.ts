import { useEffect, useState } from "react";

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  tags: string[];
  content: string;
  readTime: number;
}

interface PostListItem extends Omit<Post, "content"> {
  content?: string;
}

interface UsePostsResult {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

interface UsePostResult {
  post: Post | null;
  loading: boolean;
  error: string | null;
}

function normalizePost(post: PostListItem): Post {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    category: post.category,
    tags: Array.isArray(post.tags) ? post.tags : [],
    content: post.content ?? "",
    readTime: Number(post.readTime) || 10,
  };
}

export const useMarkdownPosts = (): UsePostsResult => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPosts() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/posts");
        if (!response.ok) {
          throw new Error(`Failed to load posts (${response.status})`);
        }

        const data = (await response.json()) as PostListItem[];
        if (cancelled) {
          return;
        }

        const sortedPosts = data
          .map(normalizePost)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setPosts(sortedPosts);
      } catch (caughtError) {
        if (cancelled) {
          return;
        }

        setPosts([]);
        setError(caughtError instanceof Error ? caughtError.message : "Failed to load posts");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadPosts();

    return () => {
      cancelled = true;
    };
  }, []);

  return { posts, loading, error };
};

export const useMarkdownPost = (slug: string | undefined): UsePostResult => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(Boolean(slug));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPost() {
      if (!slug) {
        setPost(null);
        setLoading(false);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/post/${encodeURIComponent(slug)}`);

        if (response.status === 404) {
          if (!cancelled) {
            setPost(null);
          }
          return;
        }

        if (!response.ok) {
          throw new Error(`Failed to load post (${response.status})`);
        }

        const data = (await response.json()) as Post;
        if (!cancelled) {
          setPost(normalizePost(data));
        }
      } catch (caughtError) {
        if (!cancelled) {
          setPost(null);
          setError(caughtError instanceof Error ? caughtError.message : "Failed to load post");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadPost();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { post, loading, error };
};
