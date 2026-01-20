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
  // Cache for search index entries to avoid recomputing for unchanged prompts
  const cacheRef = useRef(new WeakMap<Prompt, SearchIndex>());

  // Build a lightweight search index
  const index = useMemo<SearchIndex[]>(() => {
    const cache = cacheRef.current;

    return prompts.map((prompt) => {
      // Reuse cached index entry if the prompt object reference hasn't changed
      if (cache.has(prompt)) {
        return cache.get(prompt)!;
      }

      const entry = {
        id: prompt.id,
        searchText: `${prompt.title} ${prompt.tags.join(" ")} ${prompt.content}`.toLowerCase(),
        prompt,
      };
      cache.set(prompt, entry);
      return entry;
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
