// Structure block. Technical block used to save / load block templates
// (jigsaw assembly). 4 modes: save, load, corner, data.

export type StructureMode = 'save' | 'load' | 'corner' | 'data';

export interface StructureBlockState {
  mode: StructureMode;
  name: string; // save/load template name
  offset: { x: number; y: number; z: number };
  size: { x: number; y: number; z: number };
  integrity: number; // 0..1 randomness (% of blocks placed)
  includeEntities: boolean;
}

export function makeStructureBlock(mode: StructureMode = 'save'): StructureBlockState {
  return {
    mode,
    name: '',
    offset: { x: 0, y: 0, z: 0 },
    size: { x: 1, y: 1, z: 1 },
    integrity: 1,
    includeEntities: true,
  };
}

export interface StructureBlockPayload {
  blocks: readonly { pos: { x: number; y: number; z: number }; name: string }[];
}

// Sample a template: integrity < 1 skips some blocks.
export function sampleTemplate(
  template: StructureBlockPayload,
  integrity: number,
  rng: () => number = Math.random,
): StructureBlockPayload {
  if (integrity >= 1) return template;
  return {
    blocks: template.blocks.filter(() => rng() < integrity),
  };
}
