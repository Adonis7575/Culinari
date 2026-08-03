"use client";

import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useMemo,
  useSyncExternalStore,
} from "react";

const memoryStore = new Map<string, string>();

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readValue<T>(snapshot: string | null, fallback: T): T {
  if (!snapshot) return fallback;

  try {
    const parsed: unknown = JSON.parse(snapshot);
    const compatible = Array.isArray(fallback)
      ? Array.isArray(parsed)
      : typeof fallback === "object" && fallback !== null
        ? isRecord(parsed)
        : typeof parsed === typeof fallback;

    return compatible ? parsed as T : fallback;
  } catch {
    return fallback;
  }
}

export function usePersistentState<T>(key: string, fallback: T) {
  const eventName = `culina-storage:${key}`;

  const getSnapshot = useCallback(() => {
    try {
      return window.localStorage.getItem(key) ?? memoryStore.get(key) ?? null;
    } catch {
      return memoryStore.get(key) ?? null;
    }
  }, [key]);

  const subscribe = useCallback((onStoreChange: () => void) => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === key || event.key === null) onStoreChange();
    };
    const handleLocalChange = () => onStoreChange();

    window.addEventListener("storage", handleStorage);
    window.addEventListener(eventName, handleLocalChange);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(eventName, handleLocalChange);
    };
  }, [eventName, key]);

  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => null);
  const value = useMemo(
    () => readValue(snapshot, fallback),
    [fallback, snapshot]
  );

  const setValue = useCallback<Dispatch<SetStateAction<T>>>((update) => {
    const current = readValue(getSnapshot(), fallback);
    const next = typeof update === "function"
      ? (update as (previous: T) => T)(current)
      : update;
    const serialized = JSON.stringify(next);

    memoryStore.set(key, serialized);
    try {
      window.localStorage.setItem(key, serialized);
    } catch {
      // The in-memory store keeps the app usable when storage is restricted.
    }
    window.dispatchEvent(new Event(eventName));
  }, [eventName, fallback, getSnapshot, key]);

  return [value, setValue] as const;
}
