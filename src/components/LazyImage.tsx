import { useState, useEffect, useRef, memo } from "react";
import { usePerformance } from "@/contexts/PerformanceContext";
import { cn } from "@/lib/utils";

// Simple in-memory cache for loaded images
const imageCache = new Set<string>();

// Shared observer pattern for better performance
// We only need one observer for all lazy images instead of one per image
const listeners = new Map<Element, () => void>();
let observer: IntersectionObserver | null = null;

function getObserver() {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const listener = listeners.get(entry.target);
            if (listener) {
              listener();
            }
            // Once intersected, we stop observing this specific element
            if (observer && entry.target) {
              observer.unobserve(entry.target);
              listeners.delete(entry.target);
            }
          }
        });
      },
      { rootMargin: "100px" }
    );
  }
  return observer;
}

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const LazyImage = memo(function LazyImage({ src, alt, className }: LazyImageProps) {
  const [loaded, setLoaded] = useState(() => imageCache.has(src));
  const [inView, setInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);
  const { incrementImageLoads } = usePerformance();

  // Intersection Observer for lazy loading
  useEffect(() => {
    // If already in view or loaded (from cache), no need to observe
    if (inView || loaded) {
      if (!inView) setInView(true);
      return;
    }

    const element = imgRef.current;
    if (!element) return;

    const observer = getObserver();

    // Register listener
    listeners.set(element, () => {
      setInView(true);
    });

    observer.observe(element);

    return () => {
      if (observer) {
        observer.unobserve(element);
        listeners.delete(element);
      }
    };
  }, [inView, loaded]);

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
