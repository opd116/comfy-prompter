import { getDB, isInitialized, setInitialized, type FillHistoryEntry } from "./db";
import { samplePrompts, allTags, type Prompt, type TagData } from "@/lib/prompts-data";

// ============ Prompts ============

export async function getAllPrompts(): Promise<Prompt[]> {
  const db = await getDB();
  return db.getAll("prompts");
}

export async function getPromptById(id: string): Promise<Prompt | undefined> {
  const db = await getDB();
  return db.get("prompts", id);
}

export async function savePrompt(prompt: Prompt): Promise<void> {
  const db = await getDB();
  await db.put("prompts", prompt);
}

export async function saveAllPrompts(prompts: Prompt[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction("prompts", "readwrite");
  await Promise.all(prompts.map((p) => tx.store.put(p)));
  await tx.done;
}

export async function deletePrompt(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("prompts", id);
}

export async function toggleFavorite(id: string): Promise<Prompt | undefined> {
  const db = await getDB();
  const prompt = await db.get("prompts", id);
  if (prompt) {
    prompt.favorite = !prompt.favorite;
    await db.put("prompts", prompt);
    return prompt;
  }
  return undefined;
}

// ============ Tags ============

export async function getAllTags(): Promise<TagData[]> {
  const db = await getDB();
  return db.getAll("tags");
}

export async function saveAllTags(tags: TagData[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction("tags", "readwrite");
  await tx.store.clear();
  await Promise.all(tags.map((t) => tx.store.put(t)));
  await tx.done;
}

// ============ Fill History ============

export async function getFillHistory(): Promise<FillHistoryEntry[]> {
  const db = await getDB();
  return db.getAll("fillHistory");
}

export async function addFillHistory(entry: Omit<FillHistoryEntry, "id" | "createdAt">): Promise<FillHistoryEntry> {
  const db = await getDB();
  const newEntry: FillHistoryEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  await db.put("fillHistory", newEntry);
  return newEntry;
}

export async function clearFillHistory(): Promise<void> {
  const db = await getDB();
  const tx = db.transaction("fillHistory", "readwrite");
  await tx.store.clear();
  await tx.done;
}

// ============ Initialization ============

export async function initializeData(): Promise<{ prompts: Prompt[]; tags: TagData[] }> {
  const initialized = await isInitialized();
  
  if (!initialized) {
    // First time: seed with sample data
    await saveAllPrompts(samplePrompts);
    await saveAllTags(allTags);
    await setInitialized();
    return { prompts: samplePrompts, tags: allTags };
  }

  // Load existing data
  const prompts = await getAllPrompts();
  const tags = await getAllTags();
  
  return { prompts, tags };
}

// ============ Clear All ============

export async function clearAllData(): Promise<void> {
  const db = await getDB();
  const tx1 = db.transaction("prompts", "readwrite");
  await tx1.store.clear();
  await tx1.done;

  const tx2 = db.transaction("tags", "readwrite");
  await tx2.store.clear();
  await tx2.done;

  const tx3 = db.transaction("fillHistory", "readwrite");
  await tx3.store.clear();
  await tx3.done;
}
