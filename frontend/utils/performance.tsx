import React, { useState, useEffect, ReactNode, forwardRef, ForwardedRef, RefObject, UIEvent } from 'react';
export const measureRenderTime = (componentName: string) => {
  const startTime = performance.now();

  return () => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    console.log(`${componentName} render time: ${duration.toFixed(2)}ms`);
    return duration;
  };
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: number;

  return (...args: Parameters<T>) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => func(...args), delay);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  let lastResult: ReturnType<T>;

  return (...args: Parameters<T>): ReturnType<T> => {
    if (!inThrottle) {
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
      lastResult = func(...args);
    }
    return lastResult;
  };
};

export const memoize = <T extends (...args: any[]) => any>(func: T): T => {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key) as ReturnType<T>;
    }

    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

export const useLazyImage = (url: string) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setLoaded(true);
    img.onerror = () => setError(true);
    img.src = url;
  }, [url]);

  return { loaded, error };
};

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => ReactNode;
  overscan?: number;
}

export const VirtualList = forwardRef<
  HTMLDivElement,
  VirtualListProps<any>
>(
  (
    props: VirtualListProps<any>,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const {
      items,
      itemHeight,
      containerHeight,
      renderItem,
      overscan = 3,
    } = props;
    
    const [scrollTop, setScrollTop] = useState(0);

    const visibleRange = {
      start: Math.max(0, Math.floor(scrollTop / itemHeight) - overscan),
      end: Math.min(
        items.length,
        Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
      ),
    };

    const offsetY = visibleRange.start * itemHeight;
    const visibleItems = items.slice(visibleRange.start, visibleRange.end);

    const handleScroll = (e: UIEvent<HTMLDivElement>) => {
      setScrollTop((e.target as HTMLDivElement).scrollTop);
    };

    return (
      <div
        ref={ref}
        onScroll={handleScroll}
        style={{
          height: containerHeight,
          overflow: 'auto',
        }}
      >
        <div style={{ height: items.length * itemHeight, position: 'relative' }}>
          <div style={{ 
            transform: `translateY(${offsetY}px)`, 
            position: 'absolute', 
            width: '100%' 
          }}>
            {visibleItems.map((item: any, index: number) => (
              <div key={visibleRange.start + index}>
                {renderItem(item, visibleRange.start + index)}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

VirtualList.displayName = 'VirtualList';

export const monitorMemoryUsage = () => {
  if (!('memory' in performance)) {
    console.warn('Memory monitoring not available');
    return null;
  }

  const memory = (performance as any).memory;
  return {
    usedJSHeapSize: (memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
    totalJSHeapSize: (memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
    jsHeapSizeLimit: (memory.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB',
  };
};

class PerformanceTimeline {
  private marks: Map<string, number> = new Map();

  mark(label: string) {
    this.marks.set(label, performance.now());
  }

  measure(label: string, startMark: string, endMark?: string) {
    const start = this.marks.get(startMark);
    const end = endMark ? this.marks.get(endMark) : performance.now();

    if (!start || !end) {
      console.warn(`Missing mark: ${startMark} or ${endMark}`);
      return null;
    }

    const duration = end - start;
    console.log(`${label}: ${duration.toFixed(2)}ms`);
    return duration;
  }

  clear() {
    this.marks.clear();
  }
}

export const performanceTimeline = new PerformanceTimeline();

export const batchDOMUpdates = (
  updates: Array<() => void>,
  callback?: () => void
) => {
  requestAnimationFrame(() => {
    updates.forEach((update) => update());
    callback?.();
  });
};

export const useIntersectionObserver = (
  ref: RefObject<HTMLElement>,
  callback: (isVisible: boolean) => void,
  options?: IntersectionObserverInit
) => {
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      callback(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, callback, options]);
};

export const scheduleIdleCallback = (callback: () => void) => {
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(callback);
  } else {
    setTimeout(callback, 1);
  }
};

export const deepEqual = (obj1: any, obj2: any): boolean => {
  if (obj1 === obj2) return true;
  if (obj1 == null || typeof obj1 !== 'object' || obj2 == null || typeof obj2 !== 'object') {
    return false;
  }

  if (Array.isArray(obj1) !== Array.isArray(obj2)) return false;

  if (Array.isArray(obj1)) {
    if (obj1.length !== obj2.length) return false;
    for (let i = 0; i < obj1.length; i++) {
      if (!deepEqual(obj1[i], obj2[i])) return false;
    }
    return true;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
};

export default {
  measureRenderTime,
  debounce,
  throttle,
  memoize,
  useLazyImage,
  VirtualList,
  monitorMemoryUsage,
  performanceTimeline,
  batchDOMUpdates,
  useIntersectionObserver,
  scheduleIdleCallback,
  deepEqual,
};