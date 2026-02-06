import { useState, useEffect, memo } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchBarProps {
  onSearch: (value: string) => void;
  placeholder?: string;
  initialValue?: string;
}

export const SearchBar = memo(({ onSearch, placeholder = "Search prompts...", initialValue = "" }: SearchBarProps) => {
  // Use internal state to prevent parent re-renders on every keystroke
  const [value, setValue] = useState(initialValue);
  const debouncedValue = useDebounce(value, 300);

  // Only notify parent when search term is stable
  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  return (
    <div className="relative group">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="pl-11 pr-10 h-12 bg-card border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-xl"
      />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setValue("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-muted rounded-lg"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
});

SearchBar.displayName = "SearchBar";
