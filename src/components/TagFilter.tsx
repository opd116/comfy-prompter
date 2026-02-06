import { memo } from "react";
import { cn } from "@/lib/utils";
import type { TagData } from "@/lib/prompts-data";

interface TagFilterProps {
  tags: TagData[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

// Memoized to efficiently handle large lists of tags without re-rendering on search typing
export const TagFilter = memo(({ tags, selectedTags, onTagToggle }: TagFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => {
        const isSelected = selectedTags.includes(tag.name);
        return (
          <button
            key={tag.name}
            onClick={() => onTagToggle(tag.name)}
            style={{ animationDelay: `${index * 30}ms` }}
            className={cn(
              "group flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium",
              "transition-all duration-200 animate-fade-in border",
              "hover:scale-105 active:scale-95",
              isSelected
                ? "bg-primary text-primary-foreground border-primary shadow-md"
                : "bg-card/60 text-muted-foreground border-border/50 hover:border-primary/30 hover:bg-card/80"
            )}
          >
            {tag.image && (
              <img
                src={tag.image}
                alt={tag.name}
                className={cn(
                  "w-5 h-5 rounded-full object-cover",
                  "ring-1 ring-border/50",
                  isSelected && "ring-primary-foreground/30"
                )}
              />
            )}
            <span>{tag.name}</span>
          </button>
        );
      })}
    </div>
  );
});

TagFilter.displayName = "TagFilter";
