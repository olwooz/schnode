import { useState, useEffect, useRef } from 'react';

export function useLocalFormState<T>(
  initialValue: T,
  onChange: (value: T) => void,
  debounceMs = 300
) {
  const [localValue, setLocalValue] = useState<T>(initialValue);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  function handleChange(value: T) {
    setLocalValue(value);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      onChange(value);
      debounceTimerRef.current = null;
    }, debounceMs);
  }

  useEffect(() => {
    setLocalValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    return () => {
      if (!debounceTimerRef.current) {
        return;
      }

      clearTimeout(debounceTimerRef.current);
    };
  }, []);

  return {
    value: localValue,
    setValue: handleChange,
  };
}
