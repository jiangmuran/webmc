export interface ContainerView {
  id: 'player' | 'chest' | 'furnace' | 'crafting';
  slots: (number | null)[];
}

export function shiftClickTarget(
  sourceContainer: ContainerView,
  sourceSlot: number,
  linkedContainer: ContainerView | undefined,
): { container: 'player' | 'chest' | 'furnace' | 'crafting'; hotbarFirst: boolean } {
  if (linkedContainer === undefined) {
    const isHotbar = sourceSlot < 9;
    return { container: 'player', hotbarFirst: !isHotbar };
  }
  if (sourceContainer.id === 'player') {
    return { container: linkedContainer.id, hotbarFirst: false };
  }
  return { container: 'player', hotbarFirst: true };
}
