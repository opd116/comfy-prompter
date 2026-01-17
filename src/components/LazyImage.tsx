import { useState, useEffect, useRef, memo } from "react";
import { usePerformance } from "@/contexts/PerformanceContext";
import { cn } from "@/lib/utils";

// Simple in-memory cache for loaded images
const imageCache = new Set<string>();

// Shared Observer implementation to reduce memory overhead
class ImageObserver {
  private observer: IntersectionObserver | null = null;
  private callbacks = new Map<Element, () => void>();

  private getObserver() {
    if (!this.observer) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const callback = this.callbacks.get(entry.target);
              if (callback) {
                callback();
                this.unobserve(entry.target);
              }
            }
          });
        },
        { rootMargin: "100px" }
      );
    }
    return this.observer;
  }

  observe(element: Element, callback: () => void) {
    this.callbacks.set(element, callback);
    this.getObserver().observe(element);
  }

  unobserve(element: Element) {
    this.callbacks.delete(element);
    this.observer?.unobserve(element);
  }
}

const sharedObserver = new ImageObserver();

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

  // Shared Intersection Observer for lazy loading
  useEffect(() => {
    const element = imgRef.current;
    if (!element || inView) return;

    sharedObserver.observe(element, () => {
      setInView(true);
    });

    return () => {
      sharedObserver.unobserve(element);
    };
  }, [inView]);

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
