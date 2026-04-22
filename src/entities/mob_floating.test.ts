import { describe, it, expect } from 'vitest';
import { drowns, floatBehaviorOf, waterTickImpulseY } from './mob_floating';

describe('mob floating', () => {
  it('cow floats', () => {
    expect(floatBehaviorOf('cow')).toBe('float');
  });

  it('zombie sinks', () => {
    expect(floatBehaviorOf('zombie')).toBe('sink');
  });

  it('dolphin swims', () => {
    expect(floatBehaviorOf('dolphin')).toBe('swim');
  });

  it('cod is aquatic only', () => {
    expect(floatBehaviorOf('cod')).toBe('aquatic_only');
  });

  it('float has positive impulse', () => {
    expect(waterTickImpulseY('float')).toBeGreaterThan(0);
  });

  it('sink has zero impulse', () => {
    expect(waterTickImpulseY('sink')).toBe(0);
  });

  it('only float/sink drowns', () => {
    expect(drowns('cow')).toBe(true);
    expect(drowns('zombie')).toBe(true);
    expect(drowns('dolphin')).toBe(false);
    expect(drowns('cod')).toBe(false);
  });
});
