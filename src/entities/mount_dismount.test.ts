import { describe, it, expect } from 'vitest';
import { mount, dismount, currentRider, canSteer, type Mountable } from './mount_dismount';

function mk(): Mountable {
  return { id: 'horse1', canMount: true, riderId: null, saddled: true, requiresSaddle: true };
}

describe('mount dismount', () => {
  it('mount sets rider', () => {
    const m = mk();
    expect(mount(m, 'p1')).toBe(true);
    expect(currentRider(m)).toBe('p1');
  });

  it('cannot double-mount', () => {
    const m = mk();
    mount(m, 'p1');
    expect(mount(m, 'p2')).toBe(false);
  });

  it('needs saddle when required', () => {
    const m = { ...mk(), saddled: false };
    expect(mount(m, 'p1')).toBe(false);
  });

  it('dismount by rider', () => {
    const m = mk();
    mount(m, 'p1');
    expect(dismount(m, 'p1')).toBe(true);
    expect(currentRider(m)).toBeNull();
  });

  it('dismount rejects wrong player', () => {
    const m = mk();
    mount(m, 'p1');
    expect(dismount(m, 'p2')).toBe(false);
  });

  it('canSteer requires rider + saddle', () => {
    const m = mk();
    mount(m, 'p1');
    expect(canSteer(m, 'p1')).toBe(true);
    expect(canSteer(m, 'p2')).toBe(false);
  });
});
