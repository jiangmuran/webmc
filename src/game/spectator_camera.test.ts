import { describe, it, expect } from 'vitest';
import { makeCamera, cycleCamera, viewEntity, stopViewing, isNoclip } from './spectator_camera';

describe('spectator camera', () => {
  it('cycle goes 1st → 3rd back → 3rd front → 1st', () => {
    const c = makeCamera();
    cycleCamera(c);
    expect(c.mode).toBe('third_back');
    cycleCamera(c);
    expect(c.mode).toBe('third_front');
    cycleCamera(c);
    expect(c.mode).toBe('first_person');
  });

  it('view entity sets follow', () => {
    const c = makeCamera();
    viewEntity(c, 'cow1');
    expect(c.followEntityId).toBe('cow1');
  });

  it('stop viewing free', () => {
    const c = makeCamera();
    viewEntity(c, 'cow1');
    stopViewing(c);
    expect(c.mode).toBe('spectator_free');
    expect(c.followEntityId).toBeNull();
  });

  it('noclip modes', () => {
    expect(isNoclip('spectator_free')).toBe(true);
    expect(isNoclip('first_person')).toBe(false);
  });
});
