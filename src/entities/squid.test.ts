import { describe, it, expect } from 'vitest';
import {
  glowSquidEmitsLight,
  makeSquid,
  onSquidHit,
  SQUID_MAX_HEALTH,
  squidDrops,
  tickSquid,
} from './squid';

describe('squid', () => {
  it('starts at 10 HP', () => {
    expect(makeSquid(1, 'squid', { x: 0, y: 0, z: 0 }).health).toBe(SQUID_MAX_HEALTH);
  });

  it('first hit releases ink', () => {
    const s = makeSquid(1, 'squid', { x: 0, y: 0, z: 0 });
    const r = onSquidHit(s);
    expect(r.inkReleased).toBe(true);
    expect(r.inkKind).toBe('ink_sac');
  });

  it('glow squid releases glow ink', () => {
    const s = makeSquid(1, 'glow_squid', { x: 0, y: 0, z: 0 });
    expect(onSquidHit(s).inkKind).toBe('glow_ink_sac');
  });

  it('cooldown prevents immediate re-ink', () => {
    const s = makeSquid(1, 'squid', { x: 0, y: 0, z: 0 });
    onSquidHit(s);
    expect(onSquidHit(s).inkReleased).toBe(false);
  });

  it('cooldown refills over 100 ticks', () => {
    const s = makeSquid(1, 'squid', { x: 0, y: 0, z: 0 });
    onSquidHit(s);
    for (let i = 0; i < 100; i++) tickSquid(s);
    expect(onSquidHit(s).inkReleased).toBe(true);
  });

  it('glow squid emits light while alive', () => {
    const s = makeSquid(1, 'glow_squid', { x: 0, y: 0, z: 0 });
    expect(glowSquidEmitsLight(s)).toBe(true);
    s.health = 0;
    expect(glowSquidEmitsLight(s)).toBe(false);
  });

  it('drops ink sac items', () => {
    const s = makeSquid(1, 'squid', { x: 0, y: 0, z: 0 });
    const d = squidDrops(s, () => 0.5);
    expect(d[0]?.item).toBe('webmc:ink_sac');
  });
});
