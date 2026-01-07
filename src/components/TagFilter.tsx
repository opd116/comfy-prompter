import { cn } from "@/lib/utils";

interface TagFilterProps {
  tags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

export const TagFilter = ({ tags, selectedTags, onTagToggle }: TagFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => {
        const isSelected = selectedTags.includes(tag);
        return (
          <button
            key={tag}
            onClick={() => onTagToggle(tag)}
            style={{ animationDelay: `${index * 30}ms` }}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 animate-fade-in",
              "hover:scale-105 active:scale-95",
              isSelected
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
};
