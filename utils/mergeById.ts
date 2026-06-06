export function mergeById<T extends { id: number }>(
  existing: T[],
  incoming: T[],
  replace = false,
): T[] {
  const base = replace ? [] : existing;
  const seen = new Set(base.map((item) => item.id));
  const merged = [...base];

  for (const item of incoming) {
    if (!seen.has(item.id)) {
      seen.add(item.id);
      merged.push(item);
    }
  }

  return merged;
}
