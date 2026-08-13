export function encodeJsonField(value: unknown): string {
  return JSON.stringify(value ?? null);
}

export function decodeJsonField<T>(value: unknown, fallback: T): T {
  if (typeof value !== 'string') {
    return value == null ? fallback : (value as T);
  }

  try {
    const parsed = JSON.parse(value);
    return parsed == null ? fallback : (parsed as T);
  } catch {
    return fallback;
  }
}
