import { describe, it, expect } from 'vitest';
import { saddle, unsaddle, mount, dismount, effectiveSpeed, canSaddle } from './saddle_and_mount';

describe('saddle + mount', () => {
  it('saddleable kinds', () => {
    expect(canSaddle({ kind: 'horse', saddled: false, speedAttribute: 0.2, riderId: null })).toBe(
      true,
    );
  });

  it('saddle once', () => {
    const m = { kind: 'horse' as const, saddled: false, speedAttribute: 0.2, riderId: null };
    expect(saddle(m)).toBe(true);
    expect(saddle(m)).toBe(false);
  });

  it('unsaddle', () => {
    const m = { kind: 'horse' as const, saddled: true, speedAttribute: 0.2, riderId: null };
    expect(unsaddle(m)).toBe(true);
  });

  it('mount requires saddle (except horse)', () => {
    const pig = { kind: 'pig' as const, saddled: false, speedAttribute: 0.3, riderId: null };
    expect(mount(pig, 'Steve')).toBe(false);
    saddle(pig);
    expect(mount(pig, 'Steve')).toBe(true);
  });

  it('cannot double-mount', () => {
    const h = { kind: 'horse' as const, saddled: true, speedAttribute: 0.2, riderId: null };
    mount(h, 'A');
    expect(mount(h, 'B')).toBe(false);
  });

  it('dismount clears rider', () => {
    const h = { kind: 'horse' as const, saddled: true, speedAttribute: 0.2, riderId: 'Steve' };
    expect(dismount(h)).toBe('Steve');
    expect(h.riderId).toBeNull();
  });

  it('pig without carrot slow', () => {
    const pig = { kind: 'pig' as const, saddled: true, speedAttribute: 0.4, riderId: null };
    expect(effectiveSpeed(pig, false)).toBeLessThan(effectiveSpeed(pig, true));
  });
});
