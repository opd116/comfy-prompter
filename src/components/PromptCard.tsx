import { useState } from "react";
import { Copy, Check, Star, Play } from "lucide-react";
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
      className: "bg-card/90 backdrop-blur-sm border-border",
    });
    setTimeout(() => setCopied(false), 1500);
  };

  const hasVisualPreview = prompt.type === "image" || prompt.type === "video";

  return (
    <div
      style={{ animationDelay: `${index * 50}ms` }}
      className={cn(
        "group relative rounded-2xl border border-border/30 overflow-hidden",
        "bg-card/60 backdrop-blur-xl",
        "hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5",
        "transition-all duration-300 animate-slide-up cursor-pointer"
      )}
      onClick={handleCopy}
    >
      {/* Visual Preview for Image/Video */}
      {hasVisualPreview && prompt.previewImage && (
        <div className="relative aspect-video overflow-hidden">
          <img
            src={prompt.previewImage}
            alt={prompt.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/20 to-transparent" />
          
          {/* Video play indicator */}
          {prompt.type === "video" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="h-5 w-5 text-foreground ml-0.5" />
              </div>
            </div>
          )}

          {/* Type badge */}
          <div className="absolute top-3 left-3">
            <span className={cn(
              "px-2 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-md",
              "bg-card/80 backdrop-blur-sm text-foreground"
            )}>
              {prompt.type}
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-5">
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
                copied && "text-accent-foreground bg-accent/50"
              )}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Content preview */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
          {prompt.content}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {prompt.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-[10px] font-medium bg-secondary/40 text-secondary-foreground rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Copy hint overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-primary/5 backdrop-blur-[2px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <span className="text-xs font-medium text-primary bg-card/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-border/50">
          Click to copy prompt
        </span>
      </div>
    </div>
  );
};
