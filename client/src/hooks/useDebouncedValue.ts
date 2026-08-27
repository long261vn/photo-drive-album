import { useEffect, useState } from "react";

/** Defers expensive archive filtering until the visitor pauses typing briefly. */
export function useDebouncedValue<T>(value: T, delay = 260) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
