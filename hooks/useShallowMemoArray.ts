import { useRef } from "react";

export function useShallowMemoArray<T>(array: T[]): T[] {
  const prev = useRef<T[]>(array);

  const isShallowEqual =
    array.length === prev.current.length &&
    array.every((item, i) => item === prev.current[i]);

  if (!isShallowEqual) {
    prev.current = array;
  }

  return prev.current;
}
