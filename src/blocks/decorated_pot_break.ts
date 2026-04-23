export interface BreakCtx {
  brokenByTridentOrArrow: boolean;
  sherds: [string, string, string, string];
  withSilkTouch: boolean;
}

export function drops(c: BreakCtx): { item: string; count: number }[] {
  if (c.withSilkTouch) {
    return [{ item: 'decorated_pot', count: 1 }];
  }
  if (c.brokenByTridentOrArrow) {
    return c.sherds.map((s) => ({ item: s, count: 1 }));
  }
  return [{ item: 'decorated_pot', count: 1 }];
}

export function canStoreOneStack(): boolean {
  return true;
}
