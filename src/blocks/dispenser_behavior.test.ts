import { describe, it, expect } from 'vitest';
import { actionFor, registerBehavior } from './dispenser_behavior';

describe('dispenser behavior', () => {
  it('arrow is projectile', () => {
    expect(actionFor('webmc:arrow').kind).toBe('projectile');
  });

  it('tnt places block', () => {
    const a = actionFor('webmc:tnt');
    expect(a.kind).toBe('place_block');
  });

  it('bone meal action', () => {
    expect(actionFor('webmc:bone_meal').kind).toBe('bone_meal');
  });

  it('spawn egg infers mob', () => {
    const a = actionFor('webmc:zombie_spawn_egg');
    if (a.kind !== 'spawn_mob') throw new Error();
    expect(a.mob).toBe('zombie');
  });

  it('unknown item = default drop', () => {
    expect(actionFor('webmc:stone').kind).toBe('default_drop');
  });

  it('registerBehavior extends table', () => {
    registerBehavior('webmc:test', { kind: 'shear' });
    expect(actionFor('webmc:test').kind).toBe('shear');
  });
});
