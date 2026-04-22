import { describe, it, expect } from 'vitest';
import { transformationFor, shouldIgniteStruckBlock } from './pig_lightning_zombify';

describe('lightning transformations', () => {
  it('pig → zpiglin', () => {
    expect(transformationFor('pig')?.toMobType).toBe('webmc:zombified_piglin');
  });

  it('villager → witch', () => {
    expect(transformationFor('villager')?.toMobType).toBe('webmc:witch');
  });

  it('creeper → charged', () => {
    expect(transformationFor('creeper')?.toMobType).toBe('webmc:charged_creeper');
  });

  it('mooshroom flips', () => {
    expect(transformationFor('mooshroom')?.toMobType).toBe('webmc:brown_mooshroom');
  });

  it('turtle unchanged', () => {
    expect(transformationFor('turtle')).toBeNull();
  });

  it('flammable blocks ignite', () => {
    expect(shouldIgniteStruckBlock('webmc:oak_log')).toBe(true);
    expect(shouldIgniteStruckBlock('webmc:stone')).toBe(false);
  });
});
