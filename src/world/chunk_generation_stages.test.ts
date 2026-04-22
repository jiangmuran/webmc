import { describe, it, expect } from 'vitest';
import {
  isComplete,
  neighborRadiusFor,
  nextStage,
  pickNextStep,
  stageIndex,
  STAGE_ORDER,
  type ChunkStage,
} from './chunk_generation_stages';

describe('chunk generation stages', () => {
  it('stage order starts empty ends full', () => {
    expect(STAGE_ORDER[0]).toBe('empty');
    expect(STAGE_ORDER[STAGE_ORDER.length - 1]).toBe('full');
  });

  it('nextStage advances', () => {
    expect(nextStage('empty')).toBe('structure_starts');
    expect(nextStage('full')).toBeNull();
  });

  it('isComplete only for full', () => {
    expect(isComplete('full')).toBe(true);
    expect(isComplete('spawn')).toBe(false);
  });

  it('neighbor radius for features', () => {
    expect(neighborRadiusFor('features')).toBe(1);
    expect(neighborRadiusFor('noise')).toBe(0);
  });

  it('stage index comparable', () => {
    expect(stageIndex('surface')).toBeGreaterThan(stageIndex('noise'));
  });

  it('scheduler picks ready chunk', () => {
    const stages = new Map<string, ChunkStage>();
    stages.set('0,0', 'noise');
    stages.set('1,0', 'noise');
    stages.set('-1,0', 'noise');
    stages.set('0,1', 'noise');
    stages.set('0,-1', 'noise');
    stages.set('1,1', 'noise');
    stages.set('1,-1', 'noise');
    stages.set('-1,1', 'noise');
    stages.set('-1,-1', 'noise');
    const step = pickNextStep({ stages, origin: { cx: 0, cz: 0 } });
    expect(step?.to).toBe('surface');
  });

  it('scheduler waits for neighbors', () => {
    const stages = new Map<string, ChunkStage>();
    stages.set('0,0', 'surface');
    const step = pickNextStep({ stages, origin: { cx: 0, cz: 0 } });
    // Only single chunk with surface; "carvers" needs radius 1 neighbors at surface.
    expect(step).toBeNull();
  });
});
