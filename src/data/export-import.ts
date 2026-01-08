import { getAllPrompts, getAllTags, saveAllPrompts, saveAllTags, clearAllData } from "./prompts-repository";
import { getDB, type AppData, type FillHistoryEntry } from "./db";
import { createBackup } from "./backup-repository";
import type { Prompt, TagData } from "@/lib/prompts-data";

const EXPORT_VERSION = 1;

export interface ExportData {
  version: number;
  exportedAt: string;
  prompts: Prompt[];
  tags: TagData[];
  fillHistory: FillHistoryEntry[];
}

function validatePrompt(p: unknown): p is Prompt {
  if (typeof p !== "object" || p === null) return false;
  const obj = p as Record<string, unknown>;
  return (
    typeof obj.id === "string" &&
    typeof obj.title === "string" &&
    typeof obj.content === "string" &&
    Array.isArray(obj.tags) &&
    typeof obj.category === "string" &&
    (obj.type === "text" || obj.type === "image" || obj.type === "video")
  );
}

function validateTag(t: unknown): t is TagData {
  if (typeof t !== "object" || t === null) return false;
  const obj = t as Record<string, unknown>;
  return typeof obj.name === "string";
}

function validateFillHistory(h: unknown): h is FillHistoryEntry {
  if (typeof h !== "object" || h === null) return false;
  const obj = h as Record<string, unknown>;
  return (
    typeof obj.id === "string" &&
    typeof obj.promptId === "string" &&
    typeof obj.filledContent === "string" &&
    typeof obj.createdAt === "string"
  );
}

export function validateExportData(data: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (typeof data !== "object" || data === null) {
    return { valid: false, errors: ["Invalid data format"] };
  }

  const obj = data as Record<string, unknown>;

  if (typeof obj.version !== "number") {
    errors.push("Missing or invalid version");
  }

  if (!Array.isArray(obj.prompts)) {
    errors.push("Missing prompts array");
  } else {
    obj.prompts.forEach((p, i) => {
      if (!validatePrompt(p)) {
        errors.push(`Invalid prompt at index ${i}`);
      }
    });
  }

  if (!Array.isArray(obj.tags)) {
    errors.push("Missing tags array");
  } else {
    obj.tags.forEach((t, i) => {
      if (!validateTag(t)) {
        errors.push(`Invalid tag at index ${i}`);
      }
    });
  }

  if (obj.fillHistory !== undefined && !Array.isArray(obj.fillHistory)) {
    errors.push("Invalid fillHistory format");
  }

  return { valid: errors.length === 0, errors };
}

export async function exportData(): Promise<ExportData> {
  const db = await getDB();
  const prompts = await getAllPrompts();
  const tags = await getAllTags();
  const fillHistory = await db.getAll("fillHistory");

  return {
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    prompts,
    tags,
    fillHistory,
  };
}

export function downloadExport(data: ExportData): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement("a");
  a.href = url;
  a.download = `prompt-library-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function importData(data: ExportData): Promise<void> {
  const db = await getDB();

  // Create backup before import
  await createBackup();

  // Clear existing data
  await clearAllData();

  // Import prompts
  await saveAllPrompts(data.prompts);

  // Import tags
  await saveAllTags(data.tags);

  // Import fill history if present
  if (data.fillHistory && Array.isArray(data.fillHistory)) {
    const tx = db.transaction("fillHistory", "readwrite");
    await Promise.all(
      data.fillHistory
        .filter(validateFillHistory)
        .map((h) => tx.store.put(h))
    );
    await tx.done;
  }
}

export function readFileAsJSON(file: File): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        resolve(data);
      } catch {
        reject(new Error("Invalid JSON file"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}
