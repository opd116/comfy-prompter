import { useState, useMemo } from "react";
import { Sparkles, ArrowLeft } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { TagFilter } from "./TagFilter";
import { CategoryTabs } from "./CategoryTabs";
import { PromptCard } from "./PromptCard";
import { PromptTypeSelector } from "./PromptTypeSelector";
import { samplePrompts, allTags, type Prompt, type PromptType } from "@/lib/prompts-data";
import { cn } from "@/lib/utils";

export const PromptLibrary = () => {
  const [selectedType, setSelectedType] = useState<PromptType | null>(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>(samplePrompts);

  const filteredPrompts = useMemo(() => {
    return prompts.filter((prompt) => {
      // Type filter
      const matchesType = !selectedType || prompt.type === selectedType;

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

      return matchesType && matchesSearch && matchesCategory && matchesTags;
    });
  }, [prompts, selectedType, search, selectedCategory, selectedTags]);

  // Get relevant tags based on selected type
  const relevantTags = useMemo(() => {
    if (!selectedType) return allTags;
    
    const typePrompts = prompts.filter(p => p.type === selectedType);
    const tagNames = new Set(typePrompts.flatMap(p => p.tags));
    return allTags.filter(tag => tagNames.has(tag.name));
  }, [prompts, selectedType]);

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

  const handleBack = () => {
    setSelectedType(null);
    clearFilters();
  };

  const hasFilters = search || selectedCategory !== "All" || selectedTags.length > 0;

  // Show type selector if no type is selected
  if (!selectedType) {
    return <PromptTypeSelector onSelect={setSelectedType} />;
  }

  const typeLabels = {
    text: "Text Prompts",
    image: "Image Prompts",
    video: "Video Prompts",
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        {/* Back button */}
        <button
          onClick={handleBack}
          className={cn(
            "flex items-center gap-2 text-sm text-muted-foreground",
            "hover:text-foreground transition-colors mb-6 group"
          )}
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span>All Prompt Types</span>
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/30 backdrop-blur-sm rounded-full text-accent-foreground text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            <span>{typeLabels[selectedType]}</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Your {typeLabels[selectedType]}
        </h1>
        <p className="text-muted-foreground">
          {selectedType === "text" && "Quick access to your AI writing prompts • Click to copy"}
          {selectedType === "image" && "Visual prompts for stunning AI-generated images • Click to copy"}
          {selectedType === "video" && "Cinematic prompts for video generation • Click to copy"}
        </p>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4 mb-6">
        <SearchBar value={search} onChange={setSearch} />
        <CategoryTabs selected={selectedCategory} onSelect={setSelectedCategory} />
        <TagFilter
          tags={relevantTags}
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
        <div className={cn(
          "grid gap-4",
          selectedType === "text" ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"
        )}>
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
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/30 backdrop-blur-sm flex items-center justify-center">
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
        <div className="flex items-center gap-2 px-4 py-2 bg-card/70 backdrop-blur-xl border border-border/30 rounded-full shadow-lg text-xs text-muted-foreground">
          <kbd className="px-2 py-0.5 bg-muted/50 rounded text-[10px] font-mono">⌘</kbd>
          <span>+</span>
          <kbd className="px-2 py-0.5 bg-muted/50 rounded text-[10px] font-mono">K</kbd>
          <span className="ml-1">to open</span>
        </div>
      </div>
    </div>
  );
};
