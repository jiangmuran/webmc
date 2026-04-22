import { describe, it, expect } from 'vitest';
import {
  AXOLOTL_MAX_HEALTH,
  attractedBy,
  damageAxolotl,
  killAssistBuff,
  makeAxolotl,
  tickAxolotl,
} from './axolotl_revive';

describe('axolotl', () => {
  it('starts at max HP in water', () => {
    const a = makeAxolotl(1, { x: 0, y: 0, z: 0 });
    expect(a.health).toBe(AXOLOTL_MAX_HEALTH);
  });

  it('play dead on low roll', () => {
    const a = makeAxolotl(1, { x: 0, y: 0, z: 0 });
    const r = damageAxolotl(a, 5, 0.1);
    expect(r.startedPlayingDead).toBe(true);
    expect(a.playingDead).toBe(true);
  });

  it('no play dead on land', () => {
    const a = makeAxolotl(1, { x: 0, y: 0, z: 0 });
    a.inWater = false;
    const r = damageAxolotl(a, 5, 0.1);
    expect(r.startedPlayingDead).toBe(false);
    expect(a.health).toBe(AXOLOTL_MAX_HEALTH - 5);
  });

  it('play-dead blocks further damage', () => {
    const a = makeAxolotl(1, { x: 0, y: 0, z: 0 });
    a.playingDead = true;
    const r = damageAxolotl(a, 10, 0.5);
    expect(r.damageReceived).toBe(0);
  });

  it('tick regenerates HP while play dead', () => {
    const a = makeAxolotl(1, { x: 0, y: 0, z: 0 });
    a.health = 5;
    a.playingDead = true;
    a.playDeadSecondsLeft = 10;
    tickAxolotl(a, 5);
    expect(a.health).toBeGreaterThan(5);
  });

  it('play dead expires', () => {
    const a = makeAxolotl(1, { x: 0, y: 0, z: 0 });
    a.playingDead = true;
    a.playDeadSecondsLeft = 0.1;
    tickAxolotl(a, 1);
    expect(a.playingDead).toBe(false);
  });

  it('kill assist buff = regen + clear mining fatigue', () => {
    const b = killAssistBuff();
    expect(b.applyRegeneration).toBe(true);
    expect(b.clearMiningFatigue).toBe(true);
  });

  it('tropical fish bucket attracts', () => {
    expect(attractedBy('webmc:tropical_fish_bucket')).toBe(true);
    expect(attractedBy('webmc:salmon')).toBe(false);
  });
});
