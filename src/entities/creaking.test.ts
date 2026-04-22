import { describe, it, expect } from 'vitest';
import { forwardDamageToHeart, makeCreaking, onHeartDestroyed, updateStance } from './creaking';

describe('creaking', () => {
  it('is frozen while watched', () => {
    const c = makeCreaking(1, { x: 0, y: 0, z: 0 }, { x: 10, y: 0, z: 10 });
    updateStance(c, { anyPlayerWatching: true, dtSec: 0.1 });
    expect(c.stance).toBe('frozen');
  });

  it('moves when not watched', () => {
    const c = makeCreaking(1, { x: 0, y: 0, z: 0 }, { x: 10, y: 0, z: 10 });
    updateStance(c, { anyPlayerWatching: false, dtSec: 0.1 });
    expect(c.stance).toBe('moving');
  });

  it('damage forwards to heart', () => {
    const c = makeCreaking(1, { x: 0, y: 0, z: 0 }, { x: 10, y: 0, z: 10 });
    expect(forwardDamageToHeart(c, 7).damageToHeart).toBe(7);
  });

  it('no damage forwarded after heart dies', () => {
    const c = makeCreaking(1, { x: 0, y: 0, z: 0 }, { x: 10, y: 0, z: 10 });
    onHeartDestroyed(c);
    expect(forwardDamageToHeart(c, 100).damageToHeart).toBe(0);
  });

  it('despawns after heart destroyed', () => {
    const c = makeCreaking(1, { x: 0, y: 0, z: 0 }, { x: 10, y: 0, z: 10 });
    onHeartDestroyed(c);
    expect(c.stance).toBe('despawning');
    updateStance(c, { anyPlayerWatching: false, dtSec: 0.1 });
    expect(c.stance).toBe('despawning');
  });
});
