import { useState } from "react";
import { Copy, Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Prompt } from "@/lib/prompts-data";
import { toast } from "sonner";

interface PromptCardProps {
  prompt: Prompt;
  index: number;
  onToggleFavorite: (id: string) => void;
}

export const PromptCard = ({ prompt, index, onToggleFavorite }: PromptCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt.content);
    setCopied(true);
    toast.success("Copied to clipboard!", {
      duration: 1500,
      className: "bg-card border-border",
    });
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      style={{ animationDelay: `${index * 50}ms` }}
      className={cn(
        "group relative p-5 bg-card rounded-2xl border border-border/50",
        "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
        "transition-all duration-300 animate-slide-up cursor-pointer"
      )}
      onClick={handleCopy}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {prompt.title}
        </h3>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(prompt.id);
            }}
            className={cn(
              "p-1.5 rounded-lg transition-all duration-200",
              "hover:bg-accent/50",
              prompt.favorite ? "text-accent-foreground" : "text-muted-foreground opacity-0 group-hover:opacity-100"
            )}
          >
            <Star
              className={cn("h-4 w-4", prompt.favorite && "fill-current")}
            />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
            className={cn(
              "p-1.5 rounded-lg transition-all duration-200",
              "hover:bg-muted text-muted-foreground hover:text-foreground",
              copied && "text-green-600 bg-green-50"
            )}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Content */}
      <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
        {prompt.content}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {prompt.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 text-[10px] font-medium bg-secondary/60 text-secondary-foreground rounded-md"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Copy hint */}
      <div className="absolute inset-0 flex items-center justify-center bg-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <span className="text-xs font-medium text-primary bg-card/90 px-3 py-1.5 rounded-full shadow-sm">
          Click to copy
        </span>
      </div>
    </div>
  );
};
