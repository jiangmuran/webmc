// Jungle pyramid. 12×10×15 mossy-cobblestone temple with two 3-tripwire
// arrow dispensers and a sticky-piston/lever redstone puzzle guarding one
// chest; a second chest is behind the puzzle with the main loot.

export interface JungleTempleLayout {
  size: { width: number; height: number; depth: number };
  chestPositions: readonly { x: number; y: number; z: number }[];
  leverPuzzleSolved: boolean;
  tripwireHooks: number;
  arrowDispensers: number;
}

export function jungleTempleLayout(anchor: {
  x: number;
  y: number;
  z: number;
}): JungleTempleLayout {
  return {
    size: { width: 12, height: 10, depth: 15 },
    chestPositions: [
      { x: anchor.x + 2, y: anchor.y + 1, z: anchor.z + 2 },
      { x: anchor.x + 9, y: anchor.y + 1, z: anchor.z + 13 },
    ],
    leverPuzzleSolved: false,
    tripwireHooks: 2,
    arrowDispensers: 2,
  };
}

export type PuzzleStep = 'lever1_up' | 'lever2_up' | 'lever3_up';

// The lever puzzle requires activating the levers in the order
// [1, 2, 3]. Attempting to toggle in any other order resets the puzzle.
export interface PuzzleState {
  progress: number; // 0..3
}

export function makePuzzle(): PuzzleState {
  return { progress: 0 };
}

const ORDER: readonly PuzzleStep[] = ['lever1_up', 'lever2_up', 'lever3_up'];

export interface PuzzleToggleResult {
  newProgress: number;
  reset: boolean;
  solved: boolean;
}

export function toggleLever(state: PuzzleState, step: PuzzleStep): PuzzleToggleResult {
  if (ORDER[state.progress] === step) {
    state.progress++;
    const solved = state.progress === ORDER.length;
    return { newProgress: state.progress, reset: false, solved };
  }
  state.progress = 0;
  return { newProgress: 0, reset: true, solved: false };
}
