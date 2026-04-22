import { describe, it, expect } from 'vitest';
import { makeSnifferState, plantGrowthTick, rollAncientSeed, tickSniffer } from './sniffer';

describe('sniffer', () => {
  it('rolls torchflower seeds more often than pitcher pods', () => {
    let torch = 0;
    for (let i = 0; i < 500; i++) {
      if (rollAncientSeed() === 'torchflower_seeds') torch++;
    }
    expect(torch).toBeGreaterThan(250);
  });

  it('phase progression: idle → sniffing → digging → cooldown → idle', () => {
    const s = makeSnifferState();
    tickSniffer(s, 11, { diggableBelow: true, rng: () => 0.1 });
    expect(s.phase).toBe('sniffing');
    tickSniffer(s, 11, { diggableBelow: true, rng: () => 0.1 });
    expect(s.phase).toBe('digging');
    const r = tickSniffer(s, 7, { diggableBelow: true, rng: () => 0.1 });
    expect(s.phase).toBe('cooldown');
    expect(r.producedSeed).toBe('torchflower_seeds');
    tickSniffer(s, 31, { diggableBelow: true, rng: () => 0.1 });
    expect(s.phase).toBe('idle');
  });

  it('skips digging when ground is not diggable', () => {
    const s = makeSnifferState();
    s.phase = 'sniffing';
    s.phaseSec = 11;
    tickSniffer(s, 0, { diggableBelow: false, rng: () => 0.1 });
    expect(s.phase).toBe('cooldown');
  });

  it('plant grows toward maxStage', () => {
    const p = { stage: 0, maxStage: 3 };
    for (let i = 0; i < 100; i++) plantGrowthTick(p, () => 0.01, 0.1);
    expect(p.stage).toBe(3);
  });
});
