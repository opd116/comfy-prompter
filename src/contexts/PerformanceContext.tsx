import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface PerformanceMetrics {
  searchTimeMs: number;
  listRenderTimeMs: number;
  imageLoadCount: number;
}

interface PerformanceContextType {
  debugEnabled: boolean;
  toggleDebug: () => void;
  metrics: PerformanceMetrics;
  updateMetric: <K extends keyof PerformanceMetrics>(key: K, value: PerformanceMetrics[K]) => void;
  incrementImageLoads: () => void;
}

const PerformanceContext = createContext<PerformanceContextType | null>(null);

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

  return (
    <PerformanceContext.Provider
      value={{ debugEnabled, toggleDebug, metrics, updateMetric, incrementImageLoads }}
    >
      {children}
    </PerformanceContext.Provider>
  );
}

export function usePerformance() {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error("usePerformance must be used within a PerformanceProvider");
  }
  return context;
}
