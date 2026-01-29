import { useState, memo, useCallback } from "react";
import { Copy, Check, Star, Play, Images } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Prompt } from "@/lib/prompts-data";
import { toast } from "sonner";
import { PromptFillDialog } from "./PromptFillDialog";
import { ImageResultsDialog } from "./ImageResultsDialog";
import { LazyImage } from "./LazyImage";

interface PromptCardProps {
  prompt: Prompt;
  onToggleFavorite: (id: string) => void;
}

// Check if prompt has placeholders
const hasPlaceholders = (content: string): boolean => {
  return /\[([^\]]+)\]/.test(content);
};

export const PromptCard = memo(function PromptCard({ prompt, onToggleFavorite }: PromptCardProps) {
  const [copied, setCopied] = useState(false);
  const [showFillDialog, setShowFillDialog] = useState(false);
  const [showImageResults, setShowImageResults] = useState(false);

  // Lazy load dialogs to improve list performance
  const [fillDialogMounted, setFillDialogMounted] = useState(false);
  const [resultsDialogMounted, setResultsDialogMounted] = useState(false);

  const hasVisualPreview = prompt.type === "image" || prompt.type === "video";
  const promptHasPlaceholders = hasPlaceholders(prompt.content);
  const hasGeneratedImages = prompt.generatedImages && prompt.generatedImages.length > 0;

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(prompt.content);
    setCopied(true);
    toast.success("Copied to clipboard!", {
      duration: 1500,
      className: "bg-card/90 backdrop-blur-sm border-border",
    });
    setTimeout(() => setCopied(false), 1500);
  }, [prompt.content]);

  const handleCardClick = useCallback(() => {
    if (promptHasPlaceholders) {
      setFillDialogMounted(true);
      setShowFillDialog(true);
    } else {
      handleCopy();
    }
  }, [promptHasPlaceholders, handleCopy]);

  const handleViewResults = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setResultsDialogMounted(true);
    setShowImageResults(true);
  }, []);

  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(prompt.id);
  }, [onToggleFavorite, prompt.id]);

  const handleCopyClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    handleCopy();
  }, [handleCopy]);

  return (
    <>
      <div
        className={cn(
          "group relative rounded-2xl border border-border/30 overflow-hidden",
          "bg-card/60 backdrop-blur-xl",
          "hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5",
          "transition-all duration-300 cursor-pointer"
        )}
        onClick={handleCardClick}
      >
        {/* Visual Preview for Image/Video */}
        {hasVisualPreview && prompt.previewImage && (
          <div className="relative aspect-video overflow-hidden">
            <LazyImage
              src={prompt.previewImage}
              alt={prompt.title}
              className="w-full h-full transition-transform duration-500 group-hover:scale-105"
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
            <div className="absolute top-3 left-3 flex gap-2">
              <span className={cn(
                "px-2 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-md",
                "bg-card/80 backdrop-blur-sm text-foreground"
              )}>
                {prompt.type}
              </span>
              {hasGeneratedImages && (
                <button
                  onClick={handleViewResults}
                  className={cn(
                    "px-2 py-1 text-[10px] font-semibold rounded-md",
                    "bg-primary/80 backdrop-blur-sm text-primary-foreground",
                    "flex items-center gap-1 hover:bg-primary transition-colors"
                  )}
                >
                  <Images className="h-3 w-3" />
                  {prompt.generatedImages?.length}
                </button>
              )}
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
                onClick={handleFavoriteClick}
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
                onClick={handleCopyClick}
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
            {promptHasPlaceholders ? "Click to fill prompt" : "Click to copy prompt"}
          </span>
        </div>
      </div>

      {/* Prompt Fill Dialog */}
      {(fillDialogMounted || showFillDialog) && (
        <PromptFillDialog
          open={showFillDialog}
          onOpenChange={setShowFillDialog}
          promptTitle={prompt.title}
          promptContent={prompt.content}
        />
      )}

      {/* Image Results Dialog */}
      {prompt.type === "image" && (resultsDialogMounted || showImageResults) && (
        <ImageResultsDialog
          open={showImageResults}
          onOpenChange={setShowImageResults}
          promptTitle={prompt.title}
          promptContent={prompt.content}
          images={prompt.generatedImages || []}
          onCopyPrompt={handleCopy}
        />
      )}
    </>
  );
});
