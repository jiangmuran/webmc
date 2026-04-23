export interface Inventory {
  hotbar: (string | null)[];
  main: (string | null)[][];
}

export const HOTBAR_SIZE = 9;

export function swapHotbarSlot(inv: Inventory, from: number, to: number): Inventory {
  if (from < 0 || from >= HOTBAR_SIZE || to < 0 || to >= HOTBAR_SIZE) return inv;
  const hotbar = [...inv.hotbar];
  const tmp = hotbar[from];
  hotbar[from] = hotbar[to] ?? null;
  hotbar[to] = tmp ?? null;
  return { ...inv, hotbar };
}

export function swapFromMain(
  inv: Inventory,
  hotbarIdx: number,
  mainRow: number,
  mainCol: number,
): Inventory {
  const hotbar = [...inv.hotbar];
  const main = inv.main.map((r) => [...r]);
  const hotItem = hotbar[hotbarIdx] ?? null;
  const row = main[mainRow];
  if (!row) return inv;
  const mainItem = row[mainCol] ?? null;
  hotbar[hotbarIdx] = mainItem;
  row[mainCol] = hotItem;
  return { ...inv, hotbar, main };
}
