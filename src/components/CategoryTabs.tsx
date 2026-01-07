import { cn } from "@/lib/utils";
import { categories } from "@/lib/prompts-data";

interface CategoryTabsProps {
  selected: string;
  onSelect: (category: string) => void;
}

export const CategoryTabs = ({ selected, onSelect }: CategoryTabsProps) => {
  return (
    <div className="flex gap-1 p-1 bg-muted/40 rounded-xl overflow-x-auto scrollbar-hide">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all duration-200",
            "hover:text-foreground",
            selected === category
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground"
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
};
