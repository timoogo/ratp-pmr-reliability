import { useRef } from "react";

export function useShallowMemoObject<T extends Record<string, any>>(obj: T): T {
  const prev = useRef<T>(obj);

  const isShallowEqual =
    Object.keys(obj).length === Object.keys(prev.current).length &&
    Object.keys(obj).every((key) => obj[key] === prev.current[key]);

  if (!isShallowEqual) {
    prev.current = obj;
  }

  return prev.current;
}
