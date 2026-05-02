import { describe, it, expect } from 'vitest';
import { isSniffable, makeSnifferDig, tickSnifferDig } from './sniffer_digging';

describe('sniffer digging', () => {
  it('grass is sniffable', () => {
    expect(isSniffable('webmc:grass_block')).toBe(true);
    expect(isSniffable('webmc:stone')).toBe(false);
  });

  it('mycelium is NOT sniffable per wiki (MC-260259 WAI)', () => {
    // Wiki minecraft.wiki/w/Sniffer: "Sniffers cannot dig on
    // mycelium." Bug report MC-260259 marked WAI.
    expect(isSniffable('webmc:mycelium')).toBe(false);
  });

  it('wandering → sniffing when on diggable', () => {
    const s = makeSnifferDig();
    const r = tickSnifferDig(
      s,
      {
        onDiggableBlock: true,
        playerScared: false,
        dtSec: 0.1,
        position: { x: 0, y: 60, z: 0 },
      },
      () => 0.5,
    );
    expect(s.phase).toBe('sniffing');
    expect(r.phaseChanged).toBe(true);
  });

  it('completes dig and places seed', () => {
    const s = makeSnifferDig();
    const ctx = {
      onDiggableBlock: true,
      playerScared: false,
      dtSec: 1,
      position: { x: 0, y: 60, z: 0 },
    };
    tickSnifferDig(s, ctx, () => 0.5); // → sniffing
    tickSnifferDig(s, { ...ctx, dtSec: 3 }, () => 0.5); // → digging
    const r = tickSnifferDig(s, { ...ctx, dtSec: 6 }, () => 0.5);
    expect(r.seedPlaced).not.toBeNull();
  });

  it('player scare aborts dig', () => {
    const s = makeSnifferDig();
    s.phase = 'digging';
    tickSnifferDig(
      s,
      {
        onDiggableBlock: true,
        playerScared: true,
        dtSec: 0.1,
        position: { x: 0, y: 60, z: 0 },
      },
      () => 0.5,
    );
    expect(s.phase).toBe('wandering');
  });

  it('cooldown blocks new dig', () => {
    const s = makeSnifferDig();
    s.cooldownSec = 60;
    tickSnifferDig(
      s,
      {
        onDiggableBlock: true,
        playerScared: false,
        dtSec: 0.1,
        position: { x: 0, y: 60, z: 0 },
      },
      () => 0.5,
    );
    expect(s.phase).toBe('wandering');
  });
});
