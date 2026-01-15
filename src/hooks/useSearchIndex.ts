import { useMemo, useCallback, useRef } from "react";
import type { Prompt, PromptType } from "@/lib/prompts-data";

interface SearchIndex {
  id: string;
  searchText: string; // Pre-computed lowercase searchable text
  prompt: Prompt;
}

interface FilterOptions {
  search: string;
  selectedType: PromptType | null;
  selectedCategory: string;
  selectedTags: string[];
}

export function useSearchIndex(prompts: Prompt[]) {
  // Cache for search text to avoid recomputing on every render
  const cacheRef = useRef<Map<string, { searchText: string, prompt: Prompt }>>(new Map());

  // Build a lightweight search index
  const index = useMemo<SearchIndex[]>(() => {
    const cache = cacheRef.current;

    return prompts.map((prompt) => {
      const cached = cache.get(prompt.id);

      // Optimization: Reuse cached searchText if content hasn't changed.
      // This avoids expensive string operations when only 'favorite' or other non-search fields change.
      // We assume tags array reference is stable if content hasn't changed (which is true for useLocalData updates).
      if (
        cached &&
        cached.prompt.title === prompt.title &&
        cached.prompt.content === prompt.content &&
        cached.prompt.tags === prompt.tags
      ) {
        // Update cache with new prompt reference so future comparisons work correctly
        cache.set(prompt.id, { searchText: cached.searchText, prompt });

        return {
          id: prompt.id,
          searchText: cached.searchText,
          prompt,
        };
      }

      // Compute new search text
      const searchText = `${prompt.title} ${prompt.tags.join(" ")} ${prompt.content}`.toLowerCase();

      // Update cache
      cache.set(prompt.id, { searchText, prompt });

      return {
        id: prompt.id,
        searchText,
        prompt,
      };
    });
  }, [prompts]);

  // Fast search function
  const search = useCallback(
    (options: FilterOptions): { results: Prompt[]; searchTimeMs: number } => {
      const start = performance.now();
      const { search, selectedType, selectedCategory, selectedTags } = options;
      const searchLower = search.toLowerCase();

      const results = index
        .filter((item) => {
          // Type filter
          if (selectedType && item.prompt.type !== selectedType) return false;

          // Category filter
          if (selectedCategory !== "All" && item.prompt.category !== selectedCategory) return false;

          // Tags filter
          if (selectedTags.length > 0 && !selectedTags.some((tag) => item.prompt.tags.includes(tag))) {
            return false;
          }

          // Search filter (uses pre-computed searchText)
          if (searchLower && !item.searchText.includes(searchLower)) return false;

          return true;
        })
        .map((item) => item.prompt);

      const searchTimeMs = performance.now() - start;
      return { results, searchTimeMs };
    },
    [index]
  );

  return { search };
}
