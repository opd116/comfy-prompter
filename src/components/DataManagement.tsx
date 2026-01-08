import { useState, useRef } from "react";
import { Download, Upload, History, AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  exportData,
  downloadExport,
  importData,
  readFileAsJSON,
  validateExportData,
  getAllBackups,
  restoreBackup,
  createBackup,
  type BackupSnapshot,
} from "@/data";

interface DataManagementProps {
  onDataChanged: () => void;
}

export function DataManagement({ onDataChanged }: DataManagementProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [backups, setBackups] = useState<BackupSnapshot[]>([]);
  const [backupsOpen, setBackupsOpen] = useState(false);
  const [confirmImport, setConfirmImport] = useState(false);
  const [pendingImportData, setPendingImportData] = useState<unknown>(null);
  const [importErrors, setImportErrors] = useState<string[]>([]);

  const handleExport = async () => {
    try {
      const data = await exportData();
      downloadExport(data);
      toast({
        title: "Export successful",
        description: "Your data has been downloaded as JSON.",
      });
    } catch {
      toast({
        title: "Export failed",
        description: "Could not export your data.",
        variant: "destructive",
      });
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await readFileAsJSON(file);
      const validation = validateExportData(data);

      if (!validation.valid) {
        setImportErrors(validation.errors);
        setPendingImportData(null);
        setConfirmImport(true);
      } else {
        setImportErrors([]);
        setPendingImportData(data);
        setConfirmImport(true);
      }
    } catch {
      toast({
        title: "Invalid file",
        description: "Could not read the JSON file.",
        variant: "destructive",
      });
    }

    // Reset input
    e.target.value = "";
  };

  const confirmImportAction = async () => {
    if (!pendingImportData) return;

    try {
      await importData(pendingImportData as any);
      onDataChanged();
      toast({
        title: "Import successful",
        description: "Your data has been imported. A backup was created first.",
      });
    } catch {
      toast({
        title: "Import failed",
        description: "Could not import your data.",
        variant: "destructive",
      });
    }

    setConfirmImport(false);
    setPendingImportData(null);
  };

  const loadBackups = async () => {
    const allBackups = await getAllBackups();
    setBackups(allBackups);
    setBackupsOpen(true);
  };

  const handleRestore = async (backupId: string) => {
    const success = await restoreBackup(backupId);
    if (success) {
      onDataChanged();
      setBackupsOpen(false);
      toast({
        title: "Restore successful",
        description: "Your data has been restored from the backup.",
      });
    } else {
      toast({
        title: "Restore failed",
        description: "Could not restore from backup.",
        variant: "destructive",
      });
    }
  };

  const handleCreateBackup = async () => {
    await createBackup();
    await loadBackups();
    toast({
      title: "Backup created",
      description: "A new backup snapshot has been saved.",
    });
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString();
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>

        <Button variant="outline" size="sm" onClick={handleImportClick}>
          <Upload className="h-4 w-4 mr-2" />
          Import
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleFileChange}
        />

        <Dialog open={backupsOpen} onOpenChange={setBackupsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" onClick={loadBackups}>
              <History className="h-4 w-4 mr-2" />
              Backups
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Local Backups</DialogTitle>
              <DialogDescription>
                Restore from a previous snapshot. Last 5 backups are kept.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2 mt-4">
              <Button variant="secondary" size="sm" onClick={handleCreateBackup} className="w-full">
                Create Backup Now
              </Button>

              {backups.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No backups yet.
                </p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {backups.map((backup) => (
                    <div
                      key={backup.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50"
                    >
                      <div>
                        <p className="text-sm font-medium">{formatDate(backup.createdAt)}</p>
                        <p className="text-xs text-muted-foreground">
                          {backup.prompts.length} prompts, {backup.tags.length} tags
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRestore(backup.id)}
                      >
                        Restore
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Import confirmation dialog */}
      <AlertDialog open={confirmImport} onOpenChange={setConfirmImport}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {importErrors.length > 0 ? (
                <span className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-5 w-5" />
                  Validation Errors
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  Confirm Import
                </span>
              )}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {importErrors.length > 0 ? (
                <div className="space-y-2">
                  <p>The file has the following issues:</p>
                  <ul className="list-disc list-inside text-sm">
                    {importErrors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>
                  This will replace all your current data. A backup will be created
                  automatically before importing.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingImportData(null)}>
              Cancel
            </AlertDialogCancel>
            {importErrors.length === 0 && (
              <AlertDialogAction onClick={confirmImportAction}>
                Import
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
