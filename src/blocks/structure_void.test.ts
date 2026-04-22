import { describe, it, expect } from 'vitest';
import {
  applyTemplateBlock,
  inferSaveBlock,
  isVisibleToPlayer,
  STRUCTURE_VOID_ID,
} from './structure_void';

describe('structure void', () => {
  it('void keeps existing world block', () => {
    const d = applyTemplateBlock({
      templateBlock: STRUCTURE_VOID_ID,
      existingWorldBlock: 'webmc:stone',
      integrity: 1,
      rng: () => 0,
    });
    expect(d.kind).toBe('keep');
    if (d.kind === 'keep') expect(d.block).toBe('webmc:stone');
  });

  it('normal block places', () => {
    const d = applyTemplateBlock({
      templateBlock: 'webmc:diamond_block',
      existingWorldBlock: 'webmc:stone',
      integrity: 1,
      rng: () => 0,
    });
    expect(d.kind).toBe('place');
  });

  it('integrity below 1 sometimes skips', () => {
    const d = applyTemplateBlock({
      templateBlock: 'webmc:diamond_block',
      existingWorldBlock: 'webmc:stone',
      integrity: 0.5,
      rng: () => 0.9,
    });
    expect(d.kind).toBe('keep');
  });

  it('integrity high keeps placement', () => {
    const d = applyTemplateBlock({
      templateBlock: 'webmc:diamond_block',
      existingWorldBlock: 'webmc:stone',
      integrity: 0.5,
      rng: () => 0.1,
    });
    expect(d.kind).toBe('place');
  });

  it('inferSaveBlock uses void when matching', () => {
    expect(inferSaveBlock('webmc:stone', 'webmc:stone', true)).toBe(STRUCTURE_VOID_ID);
    expect(inferSaveBlock('webmc:stone', 'webmc:dirt', true)).toBe('webmc:stone');
    expect(inferSaveBlock('webmc:stone', 'webmc:stone', false)).toBe('webmc:stone');
  });

  it('only creative sees void', () => {
    expect(isVisibleToPlayer('creative')).toBe(true);
    expect(isVisibleToPlayer('survival')).toBe(false);
  });
});
