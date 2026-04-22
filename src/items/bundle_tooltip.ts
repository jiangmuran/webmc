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
  // Fractional fill: each item fraction = count / maxStack, total weight capped 64.
  let weight = 0;
  for (const e of q.contents) weight += e.count / e.maxStack;
  const fraction = Math.min(1, weight / 64);
  return {
    slots,
    fillFraction: fraction,
    overfullWarning: weight > 64,
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
