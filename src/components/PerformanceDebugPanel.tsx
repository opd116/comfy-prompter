import { usePerformanceActions, usePerformanceState } from "@/contexts/PerformanceContext";
import { Bug } from "lucide-react";
import { cn } from "@/lib/utils";

export const PerformanceDebugPanel = () => {
  const { debugEnabled, metrics } = usePerformanceState();
  const { toggleDebug } = usePerformanceActions();

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={toggleDebug}
        className={cn(
          "fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg transition-all",
          "bg-card border border-border hover:border-primary/50",
          debugEnabled && "bg-primary text-primary-foreground"
        )}
        title="Toggle Performance Debug"
      >
        <Bug className="h-4 w-4" />
      </button>

      {/* Debug panel */}
      {debugEnabled && (
        <div className="fixed bottom-20 right-6 z-50 p-4 rounded-xl bg-card/95 backdrop-blur-xl border border-border shadow-xl text-sm space-y-2 min-w-[200px]">
          <div className="font-medium text-foreground mb-3">Performance</div>
          <div className="flex justify-between text-muted-foreground">
            <span>Search time:</span>
            <span className="font-mono text-foreground">{metrics.searchTimeMs.toFixed(2)}ms</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>List render:</span>
            <span className="font-mono text-foreground">{metrics.listRenderTimeMs.toFixed(2)}ms</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Images loaded:</span>
            <span className="font-mono text-foreground">{metrics.imageLoadCount}</span>
          </div>
        </div>
      )}
    </>
  );
};
