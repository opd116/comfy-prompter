import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo } from "react";

interface PerformanceMetrics {
  searchTimeMs: number;
  listRenderTimeMs: number;
  imageLoadCount: number;
}

interface PerformanceActions {
  toggleDebug: () => void;
  updateMetric: <K extends keyof PerformanceMetrics>(key: K, value: PerformanceMetrics[K]) => void;
  incrementImageLoads: () => void;
}

interface PerformanceState {
  debugEnabled: boolean;
  metrics: PerformanceMetrics;
}

// Split context into State and Actions to prevent unnecessary re-renders.
// Components that only need to dispatch actions (like LazyImage) won't re-render
// when metrics update, improving performance during high-frequency updates.
const PerformanceStateContext = createContext<PerformanceState | null>(null);
const PerformanceActionsContext = createContext<PerformanceActions | null>(null);

export function PerformanceProvider({ children }: { children: ReactNode }) {
  const [debugEnabled, setDebugEnabled] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    searchTimeMs: 0,
    listRenderTimeMs: 0,
    imageLoadCount: 0,
  });

  const toggleDebug = useCallback(() => setDebugEnabled((prev) => !prev), []);

  const updateMetric = useCallback(
    <K extends keyof PerformanceMetrics>(key: K, value: PerformanceMetrics[K]) => {
      setMetrics((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const incrementImageLoads = useCallback(() => {
    setMetrics((prev) => ({ ...prev, imageLoadCount: prev.imageLoadCount + 1 }));
  }, []);

  const state = useMemo(() => ({ debugEnabled, metrics }), [debugEnabled, metrics]);
  const actions = useMemo(() => ({ toggleDebug, updateMetric, incrementImageLoads }), [toggleDebug, updateMetric, incrementImageLoads]);

  return (
    <PerformanceActionsContext.Provider value={actions}>
      <PerformanceStateContext.Provider value={state}>
        {children}
      </PerformanceStateContext.Provider>
    </PerformanceActionsContext.Provider>
  );
}

export function usePerformanceState() {
  const context = useContext(PerformanceStateContext);
  if (!context) {
    throw new Error("usePerformanceState must be used within a PerformanceProvider");
  }
  return context;
}

export function usePerformanceActions() {
  const context = useContext(PerformanceActionsContext);
  if (!context) {
    throw new Error("usePerformanceActions must be used within a PerformanceProvider");
  }
  return context;
}

// Deprecated: use usePerformanceState or usePerformanceActions instead
export function usePerformance() {
  const state = usePerformanceState();
  const actions = usePerformanceActions();
  return { ...state, ...actions };
}
