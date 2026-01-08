import { useRef, useEffect, memo, useCallback } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { PromptCard } from "./PromptCard";
import { usePerformance } from "@/contexts/PerformanceContext";
import type { Prompt, PromptType } from "@/lib/prompts-data";
import { cn } from "@/lib/utils";

interface VirtualizedPromptGridProps {
  prompts: Prompt[];
  promptType: PromptType;
  onToggleFavorite: (id: string) => void;
}

// Use virtualization only when list is large
const VIRTUALIZATION_THRESHOLD = 50;

export const VirtualizedPromptGrid = memo(function VirtualizedPromptGrid({
  prompts,
  promptType,
  onToggleFavorite,
}: VirtualizedPromptGridProps) {
  const { updateMetric } = usePerformance();
  const parentRef = useRef<HTMLDivElement>(null);
  const renderStartRef = useRef<number>(0);

  // Track render time
  useEffect(() => {
    renderStartRef.current = performance.now();
  });

  useEffect(() => {
    const renderTime = performance.now() - renderStartRef.current;
    updateMetric("listRenderTimeMs", renderTime);
  });

  const columns = promptType === "text" ? 2 : 3;
  const rowCount = Math.ceil(prompts.length / columns);
  const estimateHeight = promptType === "text" ? 200 : 320;

  // Stable callback
  const handleToggleFavorite = useCallback((id: string) => {
    onToggleFavorite(id);
  }, [onToggleFavorite]);

  // Use virtualization only for large lists
  const useVirtual = prompts.length > VIRTUALIZATION_THRESHOLD;

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => (useVirtual ? parentRef.current : null),
    estimateSize: () => estimateHeight,
    overscan: 3,
  });

  // For small lists, render normally
  if (!useVirtual) {
    return (
      <div
        className={cn(
          "grid gap-4",
          promptType === "text" ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"
        )}
      >
        {prompts.map((prompt) => (
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>
    );
  }

  // For large lists, use virtualization
  return (
    <div
      ref={parentRef}
      className="h-[calc(100vh-400px)] min-h-[400px] overflow-auto"
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const startIndex = virtualRow.index * columns;
          const rowPrompts = prompts.slice(startIndex, startIndex + columns);

          return (
            <div
              key={virtualRow.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <div
                className={cn(
                  "grid gap-4 h-full",
                  promptType === "text" ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"
                )}
              >
                {rowPrompts.map((prompt) => (
                  <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
