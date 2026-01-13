
type ObserverCallback = () => void;

class IntersectionObserverManager {
  private observer: IntersectionObserver | null = null;
  private callbacks = new Map<Element, ObserverCallback>();

  private getObserver(): IntersectionObserver {
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

  observe(element: Element, callback: ObserverCallback) {
    this.callbacks.set(element, callback);
    this.getObserver().observe(element);
  }

  unobserve(element: Element) {
    this.callbacks.delete(element);
    if (this.observer) {
      this.observer.unobserve(element);
    }
  }
}

export const lazyImageObserver = new IntersectionObserverManager();
