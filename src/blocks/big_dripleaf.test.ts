import { describe, it, expect } from 'vitest';
import { onSteppedOn, tick, isWalkable, type BigDripleafState } from './big_dripleaf';

describe('big dripleaf', () => {
  it('step begins unstable', () => {
    expect(onSteppedOn({ tilt: 'none', ticksInTiltState: 0 }).tilt).toBe('unstable');
  });

  it('unstable → partial', () => {
    let s: BigDripleafState = { tilt: 'unstable', ticksInTiltState: 0 };
    for (let i = 0; i < 10; i++) s = tick(s);
    expect(s.tilt).toBe('partial');
  });

  it('partial → full', () => {
    let s: BigDripleafState = { tilt: 'partial', ticksInTiltState: 0 };
    for (let i = 0; i < 10; i++) s = tick(s);
    expect(s.tilt).toBe('full');
  });

  it('full → none after long delay', () => {
    let s: BigDripleafState = { tilt: 'full', ticksInTiltState: 0 };
    for (let i = 0; i < 100; i++) s = tick(s);
    expect(s.tilt).toBe('none');
  });

  it('full not walkable', () => {
    expect(isWalkable({ tilt: 'full', ticksInTiltState: 0 })).toBe(false);
  });

  it('partial walkable', () => {
    expect(isWalkable({ tilt: 'partial', ticksInTiltState: 0 })).toBe(true);
  });
});
