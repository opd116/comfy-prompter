import { getDB, MAX_BACKUPS, type BackupSnapshot } from "./db";
import { getAllPrompts, getAllTags, saveAllPrompts, saveAllTags, clearFillHistory } from "./prompts-repository";
import type { FillHistoryEntry } from "./db";

export async function createBackup(): Promise<BackupSnapshot> {
  const db = await getDB();
  
  const prompts = await getAllPrompts();
  const tags = await getAllTags();
  const fillHistory = await db.getAll("fillHistory");

  const backup: BackupSnapshot = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    prompts,
    tags,
    fillHistory,
  };

  await db.put("backups", backup);

  // Prune old backups (keep only last MAX_BACKUPS)
  const allBackups = await db.getAllFromIndex("backups", "by-date");
  if (allBackups.length > MAX_BACKUPS) {
    const toDelete = allBackups.slice(0, allBackups.length - MAX_BACKUPS);
    const tx = db.transaction("backups", "readwrite");
    await Promise.all(toDelete.map((b) => tx.store.delete(b.id)));
    await tx.done;
  }

  return backup;
}

export async function getAllBackups(): Promise<BackupSnapshot[]> {
  const db = await getDB();
  const backups = await db.getAllFromIndex("backups", "by-date");
  return backups.reverse(); // Most recent first
}

export async function restoreBackup(backupId: string): Promise<boolean> {
  const db = await getDB();
  const backup = await db.get("backups", backupId);
  
  if (!backup) return false;

  // Clear and restore prompts
  const promptsTx = db.transaction("prompts", "readwrite");
  await promptsTx.store.clear();
  await Promise.all(backup.prompts.map((p) => promptsTx.store.put(p)));
  await promptsTx.done;

  // Clear and restore tags
  const tagsTx = db.transaction("tags", "readwrite");
  await tagsTx.store.clear();
  await Promise.all(backup.tags.map((t) => tagsTx.store.put(t)));
  await tagsTx.done;

  // Clear and restore fill history
  const historyTx = db.transaction("fillHistory", "readwrite");
  await historyTx.store.clear();
  await Promise.all(backup.fillHistory.map((h) => historyTx.store.put(h)));
  await historyTx.done;

  return true;
}

export async function deleteBackup(backupId: string): Promise<void> {
  const db = await getDB();
  await db.delete("backups", backupId);
}
