import { useState, useMemo, useEffect, useCallback } from "react";
import { Sparkles, ArrowLeft, Loader2 } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { TagFilter } from "./TagFilter";
import { CategoryTabs } from "./CategoryTabs";
import { VirtualizedPromptGrid } from "./VirtualizedPromptGrid";
import { PromptTypeSelector } from "./PromptTypeSelector";
import { DataManagement } from "./DataManagement";
import { PerformanceDebugPanel } from "./PerformanceDebugPanel";
import { useLocalData } from "@/hooks/useLocalData";
import { useSearchIndex } from "@/hooks/useSearchIndex";
import { usePerformance } from "@/contexts/PerformanceContext";
import { allTags, type PromptType } from "@/lib/prompts-data";
import { cn } from "@/lib/utils";

export const PromptLibrary = () => {
  const { prompts, tags, loading, reload, toggleFavorite } = useLocalData();
  const { updateMetric } = usePerformance();
  const [selectedType, setSelectedType] = useState<PromptType | null>(null);
  // Store only the debounced search query to prevent excessive re-renders
  const [searchQuery, setSearchQuery] = useState("");
  // Key to force reset of SearchBar internal state
  const [searchResetKey, setSearchResetKey] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Use lightweight search index
  const { search: searchIndex } = useSearchIndex(prompts);

  // Memoized filtered prompts using the search index
  const { filteredPrompts, searchTimeMs } = useMemo(() => {
    const { results, searchTimeMs } = searchIndex({
      search: searchQuery,
      selectedType,
      selectedCategory,
      selectedTags,
    });
    return { filteredPrompts: results, searchTimeMs };
  }, [searchIndex, searchQuery, selectedType, selectedCategory, selectedTags]);

  // Update performance metrics
  useEffect(() => {
    updateMetric("searchTimeMs", searchTimeMs);
  }, [searchTimeMs, updateMetric]);

  // Use local tags or fallback to allTags if empty
  const availableTags = tags.length > 0 ? tags : allTags;

  // Get relevant tags based on selected type
  const relevantTags = useMemo(() => {
    if (!selectedType) return availableTags;
    
    const typePrompts = prompts.filter(p => p.type === selectedType);
    const tagNames = new Set(typePrompts.flatMap(p => p.tags));
    return availableTags.filter(tag => tagNames.has(tag.name));
  }, [prompts, selectedType, availableTags]);

  const handleTagToggle = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }, []);

  const handleToggleFavorite = useCallback((id: string) => {
    toggleFavorite(id);
  }, [toggleFavorite]);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSearchResetKey(prev => prev + 1);
    setSelectedCategory("All");
    setSelectedTags([]);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedType(null);
    clearFilters();
  }, [clearFilters]);

  const hasFilters = searchQuery || selectedCategory !== "All" || selectedTags.length > 0;

  // Loading state
  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">Loading your prompts...</p>
      </div>
    );
  }

  // Show type selector if no type is selected
  if (!selectedType) {
    return (
      <div className="space-y-6">
        <div className="flex justify-end">
          <DataManagement onDataChanged={reload} />
        </div>
        <PromptTypeSelector onSelect={setSelectedType} />
        <PerformanceDebugPanel />
      </div>
    );
  }

  const typeLabels = {
    text: "Text Prompts",
    image: "Image Prompts",
    video: "Video Prompts",
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        {/* Top bar with back and data management */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBack}
            className={cn(
              "flex items-center gap-2 text-sm text-muted-foreground",
              "hover:text-foreground transition-colors group"
            )}
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>All Prompt Types</span>
          </button>
          <DataManagement onDataChanged={reload} />
        </div>

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
        <SearchBar key={searchResetKey} onSearch={setSearchQuery} />
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
        <VirtualizedPromptGrid
          prompts={filteredPrompts}
          promptType={selectedType}
          onToggleFavorite={handleToggleFavorite}
        />
      ) : (
        <div className="text-center py-16">
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
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-2 px-4 py-2 bg-card/70 backdrop-blur-xl border border-border/30 rounded-full shadow-lg text-xs text-muted-foreground">
          <kbd className="px-2 py-0.5 bg-muted/50 rounded text-[10px] font-mono">⌘</kbd>
          <span>+</span>
          <kbd className="px-2 py-0.5 bg-muted/50 rounded text-[10px] font-mono">K</kbd>
          <span className="ml-1">to open</span>
        </div>
      </div>

      <PerformanceDebugPanel />
    </div>
  );
};
