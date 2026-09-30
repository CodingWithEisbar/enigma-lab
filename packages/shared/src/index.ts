export type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

export function attempt<T>(operation: () => T): Result<T> {
  try {
    return { ok: true, value: operation() };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error : new Error(String(error)) };
  }
}

export function exhaustive(value: never): never {
  throw new Error(`Giá trị chưa được xử lý: ${String(value)}`);
}
