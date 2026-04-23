export interface Slot {
  id: string;
  count: number;
}

export function stackTogether(slots: Slot[], maxStack = 64): Slot[] {
  const buckets = new Map<string, number>();
  for (const s of slots) {
    buckets.set(s.id, (buckets.get(s.id) ?? 0) + s.count);
  }
  const out: Slot[] = [];
  for (const [id, total] of buckets) {
    let remaining = total;
    while (remaining > 0) {
      const take = Math.min(remaining, maxStack);
      out.push({ id, count: take });
      remaining -= take;
    }
  }
  return out;
}

export function sortAlphabetical(slots: Slot[]): Slot[] {
  return [...slots].sort((a, b) => a.id.localeCompare(b.id));
}
