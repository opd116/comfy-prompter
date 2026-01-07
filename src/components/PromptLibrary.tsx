import { useState, useMemo } from "react";
import { Sparkles } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { TagFilter } from "./TagFilter";
import { CategoryTabs } from "./CategoryTabs";
import { PromptCard } from "./PromptCard";
import { samplePrompts, allTags, type Prompt } from "@/lib/prompts-data";

export const PromptLibrary = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>(samplePrompts);

  const filteredPrompts = useMemo(() => {
    return prompts.filter((prompt) => {
      // Search filter
      const matchesSearch =
        search === "" ||
        prompt.title.toLowerCase().includes(search.toLowerCase()) ||
        prompt.content.toLowerCase().includes(search.toLowerCase()) ||
        prompt.tags.some((tag) =>
          tag.toLowerCase().includes(search.toLowerCase())
        );

      // Category filter
      const matchesCategory =
        selectedCategory === "All" || prompt.category === selectedCategory;

      // Tags filter
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => prompt.tags.includes(tag));

      return matchesSearch && matchesCategory && matchesTags;
    });
  }, [prompts, search, selectedCategory, selectedTags]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleToggleFavorite = (id: string) => {
    setPrompts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, favorite: !p.favorite } : p))
    );
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSelectedTags([]);
  };

  const hasFilters = search || selectedCategory !== "All" || selectedTags.length > 0;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/50 rounded-full text-accent-foreground text-sm font-medium mb-4">
          <Sparkles className="h-4 w-4" />
          <span>Prompt Library</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Your AI Prompts
        </h1>
        <p className="text-muted-foreground">
          Quick access to your favorite prompts • Click to copy
        </p>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4 mb-6">
        <SearchBar value={search} onChange={setSearch} />
        <CategoryTabs selected={selectedCategory} onSelect={setSelectedCategory} />
        <TagFilter
          tags={allTags}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
        />
      </div>

      {/* Results info */}
      <div className="flex items-center justify-between mb-4 text-sm">
        <span className="text-muted-foreground">
          {filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? "s" : ""} found
        </span>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-primary hover:underline font-medium"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Prompts Grid */}
      {filteredPrompts.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredPrompts.map((prompt, index) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              index={index}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mb-2">No prompts found</p>
          <button
            onClick={clearFilters}
            className="text-sm text-primary hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Shortcut hint */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 animate-fade-in">
        <div className="flex items-center gap-2 px-4 py-2 bg-card/80 backdrop-blur-sm border border-border/50 rounded-full shadow-lg text-xs text-muted-foreground">
          <kbd className="px-2 py-0.5 bg-muted rounded text-[10px] font-mono">⌘</kbd>
          <span>+</span>
          <kbd className="px-2 py-0.5 bg-muted rounded text-[10px] font-mono">K</kbd>
          <span className="ml-1">to open</span>
        </div>
      </div>
    </div>
  );
};
