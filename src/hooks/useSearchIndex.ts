import { useMemo, useCallback, useRef, useEffect } from "react";
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
  // Cache the previous index map to support incremental updates
  const indexCache = useRef<Map<string, SearchIndex>>(new Map());

  // Build a lightweight search index
  // We return both the list (for searching) and the map (for caching)
  const { index, indexMap } = useMemo(() => {
    const newIndexMap = new Map<string, SearchIndex>();
    const prevIndexMap = indexCache.current;

    const newIndex = prompts.map((prompt) => {
      const cached = prevIndexMap.get(prompt.id);

      // Case 1: Exact same prompt object reference -> Reuse entire index item
      if (cached && cached.prompt === prompt) {
        newIndexMap.set(prompt.id, cached);
        return cached;
      }

      // Case 2: Content hasn't changed -> Reuse searchText string
      if (
        cached &&
        cached.prompt.title === prompt.title &&
        cached.prompt.content === prompt.content &&
        cached.prompt.tags === prompt.tags
      ) {
        const newItem: SearchIndex = {
          id: prompt.id,
          searchText: cached.searchText,
          prompt,
        };
        newIndexMap.set(prompt.id, newItem);
        return newItem;
      }

      // Case 3: Content changed or new prompt -> Recompute
      const newItem: SearchIndex = {
        id: prompt.id,
        searchText: `${prompt.title} ${prompt.tags.join(" ")} ${prompt.content}`.toLowerCase(),
        prompt,
      };
      newIndexMap.set(prompt.id, newItem);
      return newItem;
    });

    return { index: newIndex, indexMap: newIndexMap };
  }, [prompts]);

  // Update the cache in an effect to avoid side effects during render
  useEffect(() => {
    indexCache.current = indexMap;
  }, [indexMap]);

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
