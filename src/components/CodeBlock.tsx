import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  language?: string;
  value: string;
  className?: string;
}

const CodeBlock = ({ language, value, className }: CodeBlockProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
      toast.success("Code copied to clipboard");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy code");
    }
  };

  return (
    <div className={cn("relative group rounded-lg overflow-hidden my-6 border border-border bg-[#1e1e1e]", className)}>
      <div className="absolute right-4 top-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={handleCopy}
          className="p-2 rounded-md bg-secondary/10 hover:bg-secondary/20 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Copy code"
        >
          {isCopied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
      <div className="pt-2 pl-4 text-xs text-muted-foreground select-none uppercase tracking-wider font-mono">
        {language || "text"}
      </div>
      <SyntaxHighlighter
        language={language || "text"}
        style={vscDarkPlus}
        PreTag="div"
        codeTagProps={{
          style: {
            backgroundColor: "transparent",
            fontFamily: "inherit",
          }
        }}
        customStyle={{
          margin: 0,
          padding: "1.5rem",
          background: "transparent",
          fontSize: "0.875rem",
          lineHeight: "1.6",
        }}
        showLineNumbers={true}
        lineNumberStyle={{
          minWidth: "2.5em",
          paddingRight: "1em",
          color: "#6e7681",
          textAlign: "right",
        }}
        wrapLines={true}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
