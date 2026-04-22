// Curse of Vanishing. Item disappears instead of dropping on player death.
// Applies to weapons, tools, armor.

export function vanishesOnDeath(hasCurse: boolean): boolean {
  return hasCurse;
}

export function droppedOnDeath(hasCurse: boolean): boolean {
  return !hasCurse;
}

// Curse cannot be removed via grindstone.
export function removableByGrindstone(): boolean {
  return false;
}

// Curse is preserved during anvil combination (always).
export function preservedByAnvil(): boolean {
  return true;
}
