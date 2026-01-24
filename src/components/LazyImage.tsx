import { useState, useEffect, useRef, memo } from "react";
import { usePerformanceActions } from "@/contexts/PerformanceContext";
import { cn } from "@/lib/utils";

// Simple in-memory cache for loaded images
const imageCache = new Set<string>();

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const LazyImage = memo(function LazyImage({ src, alt, className }: LazyImageProps) {
  const [loaded, setLoaded] = useState(() => imageCache.has(src));
  const [inView, setInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);
  const { incrementImageLoads, debugEnabled } = usePerformanceActions();

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" }
    );

    observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    if (!imageCache.has(src)) {
      imageCache.add(src);
      incrementImageLoads();
    }
    setLoaded(true);
  };

  return (
    <div ref={imgRef} className={cn("relative overflow-hidden bg-muted/30", className)}>
      {/* Placeholder skeleton */}
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30" />
      )}

      {/* Actual image - only render when in view */}
      {inView && (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            loaded ? "opacity-100" : "opacity-0"
          )}
        />
      )}
    </div>
  );
});
