export type StatCategory =
  | 'mined'
  | 'crafted'
  | 'used'
  | 'broken'
  | 'picked_up'
  | 'dropped'
  | 'killed'
  | 'killed_by'
  | 'custom';

export interface StatRecord {
  category: StatCategory;
  id: string;
  value: number;
}

export class StatTracker {
  private data = new Map<string, number>();
  private key(c: StatCategory, id: string): string {
    return `${c}:${id}`;
  }

  increment(c: StatCategory, id: string, by = 1): void {
    this.data.set(this.key(c, id), (this.data.get(this.key(c, id)) ?? 0) + by);
  }

  get(c: StatCategory, id: string): number {
    return this.data.get(this.key(c, id)) ?? 0;
  }

  topN(c: StatCategory, n: number): readonly StatRecord[] {
    const out: StatRecord[] = [];
    for (const [k, v] of this.data.entries()) {
      if (k.startsWith(`${c}:`)) {
        out.push({ category: c, id: k.slice(c.length + 1), value: v });
      }
    }
    return out.sort((a, b) => b.value - a.value).slice(0, n);
  }

  serialize(): Record<string, number> {
    return Object.fromEntries(this.data);
  }
}
