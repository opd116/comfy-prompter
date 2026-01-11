import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo } from "react";

interface PerformanceMetrics {
  searchTimeMs: number;
  listRenderTimeMs: number;
  imageLoadCount: number;
}

interface PerformanceState {
  debugEnabled: boolean;
  metrics: PerformanceMetrics;
}

interface PerformanceActions {
  toggleDebug: () => void;
  updateMetric: <K extends keyof PerformanceMetrics>(key: K, value: PerformanceMetrics[K]) => void;
  incrementImageLoads: () => void;
}

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

  const actions = useMemo(() => ({
    toggleDebug,
    updateMetric,
    incrementImageLoads
  }), [toggleDebug, updateMetric, incrementImageLoads]);

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

// Compatibility hook
export function usePerformance() {
  const state = usePerformanceState();
  const actions = usePerformanceActions();
  return useMemo(() => ({ ...state, ...actions }), [state, actions]);
}
