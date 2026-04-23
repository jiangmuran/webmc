import { describe, it, expect } from 'vitest';
import {
  criterionMet,
  isComplete,
  type PlayerFlags,
  type Advancement,
} from './advancement_requirements_eval';

const empty: PlayerFlags = {
  kills: new Set(),
  obtained: new Set(),
  crafted: new Set(),
  dimensionsEntered: new Set(),
  biomesVisited: new Set(),
};

describe('advancement requirements eval', () => {
  it('kill criterion checks kills set', () => {
    expect(
      criterionMet(
        { kind: 'kill', entityId: 'zombie' },
        {
          ...empty,
          kills: new Set(['zombie']),
        },
      ),
    ).toBe(true);
  });

  it('obtain missing fails', () => {
    expect(criterionMet({ kind: 'obtain', itemId: 'diamond' }, empty)).toBe(false);
  });

  it('any requires one', () => {
    const a: Advancement = {
      id: 'a',
      any: true,
      criteria: [
        { kind: 'obtain', itemId: 'diamond' },
        { kind: 'obtain', itemId: 'apple' },
      ],
    };
    expect(isComplete(a, { ...empty, obtained: new Set(['apple']) })).toBe(true);
  });

  it('all requires every criterion', () => {
    const a: Advancement = {
      id: 'a',
      any: false,
      criteria: [
        { kind: 'obtain', itemId: 'diamond' },
        { kind: 'obtain', itemId: 'apple' },
      ],
    };
    expect(isComplete(a, { ...empty, obtained: new Set(['apple']) })).toBe(false);
    expect(isComplete(a, { ...empty, obtained: new Set(['apple', 'diamond']) })).toBe(true);
  });

  it('no criteria never complete', () => {
    expect(isComplete({ id: 'x', any: false, criteria: [] }, empty)).toBe(false);
  });

  it('dimension check', () => {
    expect(
      criterionMet(
        { kind: 'enter_dim', dim: 'nether' },
        {
          ...empty,
          dimensionsEntered: new Set(['nether']),
        },
      ),
    ).toBe(true);
  });
});
