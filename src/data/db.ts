import { openDB, DBSchema, IDBPDatabase } from "idb";
import type { Prompt, TagData } from "@/lib/prompts-data";

export interface FillHistoryEntry {
  id: string;
  promptId: string;
  filledContent: string;
  answers: Record<string, string>;
  createdAt: string;
}

export interface BackupSnapshot {
  id: string;
  createdAt: string;
  prompts: Prompt[];
  tags: TagData[];
  fillHistory: FillHistoryEntry[];
}

export interface AppData {
  prompts: Prompt[];
  tags: TagData[];
  fillHistory: FillHistoryEntry[];
  version: number;
}

interface PromptLibraryDB extends DBSchema {
  prompts: {
    key: string;
    value: Prompt;
    indexes: { "by-type": string; "by-category": string };
  };
  tags: {
    key: string;
    value: TagData;
  };
  fillHistory: {
    key: string;
    value: FillHistoryEntry;
    indexes: { "by-promptId": string; "by-date": string };
  };
  backups: {
    key: string;
    value: BackupSnapshot;
    indexes: { "by-date": string };
  };
  meta: {
    key: string;
    value: { initialized: boolean; lastBackup: string };
  };
}

const DB_NAME = "prompt-library";
const DB_VERSION = 1;
const MAX_BACKUPS = 5;

let dbInstance: IDBPDatabase<PromptLibraryDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<PromptLibraryDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<PromptLibraryDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Prompts store
      if (!db.objectStoreNames.contains("prompts")) {
        const promptStore = db.createObjectStore("prompts", { keyPath: "id" });
        promptStore.createIndex("by-type", "type");
        promptStore.createIndex("by-category", "category");
      }

      // Tags store
      if (!db.objectStoreNames.contains("tags")) {
        db.createObjectStore("tags", { keyPath: "name" });
      }

      // Fill history store
      if (!db.objectStoreNames.contains("fillHistory")) {
        const historyStore = db.createObjectStore("fillHistory", { keyPath: "id" });
        historyStore.createIndex("by-promptId", "promptId");
        historyStore.createIndex("by-date", "createdAt");
      }

      // Backups store
      if (!db.objectStoreNames.contains("backups")) {
        const backupStore = db.createObjectStore("backups", { keyPath: "id" });
        backupStore.createIndex("by-date", "createdAt");
      }

      // Meta store
      if (!db.objectStoreNames.contains("meta")) {
        db.createObjectStore("meta");
      }
    },
  });

  return dbInstance;
}

export async function isInitialized(): Promise<boolean> {
  const db = await getDB();
  const meta = await db.get("meta", "app");
  return meta?.initialized ?? false;
}

export async function setInitialized(): Promise<void> {
  const db = await getDB();
  await db.put("meta", { initialized: true, lastBackup: new Date().toISOString() }, "app");
}

export { MAX_BACKUPS };
