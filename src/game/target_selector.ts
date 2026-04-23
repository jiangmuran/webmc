// Command target selector. @p/@a/@e/@s/@r + filters.

export type SelectorPrefix = '@p' | '@a' | '@e' | '@s' | '@r';

export interface SelectorFilters {
  limit?: number;
  distance?: { min?: number; max?: number };
  type?: string;
  tags?: string[];
  sort?: 'nearest' | 'furthest' | 'random' | 'arbitrary';
}

export interface Selector {
  prefix: SelectorPrefix;
  filters: SelectorFilters;
}

export function parseSelector(input: string): Selector | null {
  const m = /^(@[paser])(?:\[([^\]]*)\])?$/.exec(input);
  if (!m) return null;
  const prefix = m[1] as SelectorPrefix;
  const filterStr = m[2];
  const filters: SelectorFilters = {};
  if (filterStr) {
    for (const pair of filterStr.split(',')) {
      const [k, v] = pair.split('=');
      if (!k || !v) continue;
      if (k === 'limit') filters.limit = Number(v);
      else if (k === 'type') filters.type = v;
      else if (k === 'tag') filters.tags = [...(filters.tags ?? []), v];
      else if (
        k === 'sort' &&
        (v === 'nearest' || v === 'furthest' || v === 'random' || v === 'arbitrary')
      )
        filters.sort = v;
    }
  }
  return { prefix, filters };
}

export function defaultLimit(prefix: SelectorPrefix): number {
  if (prefix === '@p' || prefix === '@s' || prefix === '@r') return 1;
  return Infinity;
}
