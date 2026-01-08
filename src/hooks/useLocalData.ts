import { useState, useEffect, useCallback } from "react";
import type { Prompt, TagData } from "@/lib/prompts-data";
import {
  initializeData,
  getAllPrompts,
  getAllTags,
  savePrompt,
  toggleFavorite as toggleFavoriteRepo,
  addFillHistory,
  createBackup,
} from "@/data";

export function useLocalData() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [tags, setTags] = useState<TagData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize data from IndexedDB
  useEffect(() => {
    const init = async () => {
      try {
        const { prompts, tags } = await initializeData();
        setPrompts(prompts);
        setTags(tags);
        
        // Create initial backup after first load
        await createBackup();
      } catch (err) {
        console.error("Failed to initialize data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Reload data from DB
  const reload = useCallback(async () => {
    try {
      const [loadedPrompts, loadedTags] = await Promise.all([
        getAllPrompts(),
        getAllTags(),
      ]);
      setPrompts(loadedPrompts);
      setTags(loadedTags);
    } catch (err) {
      console.error("Failed to reload data:", err);
    }
  }, []);

  // Toggle favorite
  const toggleFavorite = useCallback(async (id: string) => {
    const updated = await toggleFavoriteRepo(id);
    if (updated) {
      setPrompts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, favorite: updated.favorite } : p))
      );
    }
  }, []);

  // Save a prompt (create or update)
  const updatePrompt = useCallback(async (prompt: Prompt) => {
    await savePrompt(prompt);
    setPrompts((prev) => {
      const exists = prev.find((p) => p.id === prompt.id);
      if (exists) {
        return prev.map((p) => (p.id === prompt.id ? prompt : p));
      }
      return [...prev, prompt];
    });
  }, []);

  // Record fill history
  const recordFill = useCallback(
    async (promptId: string, filledContent: string, answers: Record<string, string>) => {
      await addFillHistory({ promptId, filledContent, answers });
    },
    []
  );

  return {
    prompts,
    tags,
    loading,
    error,
    reload,
    toggleFavorite,
    updatePrompt,
    recordFill,
  };
}
