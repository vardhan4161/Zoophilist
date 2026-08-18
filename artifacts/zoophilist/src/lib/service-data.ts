/**
 * Guarantees a renderable service list while the public API is loading or
 * temporarily unavailable. The fallback is copied so consumers cannot mutate
 * the shared static catalog.
 */
export function normaliseServiceList<T>(value: unknown, fallback: readonly T[]): T[] {
  return Array.isArray(value) && value.length > 0 ? (value as T[]) : [...fallback];
}
