// Bundle tooltip UI state. A hover tooltip shows the items inside a
// bundle as a 4×3 grid preview with the fraction full visible at the
// bottom. Separate from bundle.ts's actual container state (which is
// tested in bundle.test.ts).

export interface BundleSlotPreview {
  item: string | null;
  count: number;
}

export interface BundleTooltipQuery {
  contents: readonly { item: string; count: number; maxStack: number }[];
}

export interface BundleTooltipResult {
  slots: readonly BundleSlotPreview[];
  fillFraction: number; // 0..1
  overfullWarning: boolean;
}

const PREVIEW_SLOTS = 12;

export function bundleTooltip(q: BundleTooltipQuery): BundleTooltipResult {
  const previewContents = q.contents.slice(0, PREVIEW_SLOTS);
  const slots: BundleSlotPreview[] = [];
  for (let i = 0; i < PREVIEW_SLOTS; i++) {
    const e = previewContents[i];
    slots.push(e ? { item: e.item, count: e.count } : { item: null, count: 0 });
  }
  // Wiki (minecraft.wiki/w/Bundle): "A bundle has 64 'capacity slots'.
  // Each item takes `64 / max_stack_size` slots, so 64 stone (max 64),
  // 16 ender pearls (max 16), or 1 saddle (max 1) all fill the
  // bundle. fillFraction = sum(count / maxStack), clamped to [0, 1]."
  // Old code divided by an extra 64 — 32 stone reported 0.78% full
  // instead of 50%, and the overfull warning required weight > 64
  // (i.e. 4096 stones, 64× the wiki cap).
  let weight = 0;
  for (const e of q.contents) weight += e.count / e.maxStack;
  return {
    slots,
    fillFraction: Math.min(1, weight),
    overfullWarning: weight > 1,
  };
}

// Cycling item view: when a bundle is hovered and scrolled, the tooltip
// can rotate through overflow items (for bundles with more than 12
// distinct stacks).
export function cycleTooltipWindow(q: BundleTooltipQuery, offset: number): BundleTooltipResult {
  const total = q.contents.length;
  if (total <= PREVIEW_SLOTS) return bundleTooltip(q);
  const effectiveOffset = ((offset % total) + total) % total;
  const rotated = [...q.contents.slice(effectiveOffset), ...q.contents.slice(0, effectiveOffset)];
  return bundleTooltip({ contents: rotated });
}
