import { describe, it, expect } from 'vitest';
import { makePhantom, tickPhantom } from './phantom_circle_path';

describe('phantom flight', () => {
  it('starts circling', () => {
    const p = makePhantom({ x: 20, y: 80, z: 20 }, { x: 0, y: 60, z: 0 });
    expect(p.phase).toBe('circling');
  });

  it('circles above player', () => {
    const p = makePhantom({ x: 20, y: 80, z: 20 }, { x: 0, y: 60, z: 0 });
    p.swoopCooldownSec = 100; // prevent swoop
    tickPhantom(p, { playerPos: { x: 0, y: 60, z: 0 }, dtSec: 0.1 });
    expect(p.position.y).toBeGreaterThan(60);
  });

  it('starts swoop when cooldown elapses', () => {
    const p = makePhantom({ x: 20, y: 80, z: 20 }, { x: 0, y: 60, z: 0 });
    const r = tickPhantom(p, { playerPos: { x: 0, y: 60, z: 0 }, dtSec: 5 });
    expect(r.swoopStarted).toBe(true);
    expect(p.phase).toBe('swooping');
  });

  it('retreats after reaching target', () => {
    const p = makePhantom({ x: 0, y: 60.5, z: 0 }, { x: 0, y: 60, z: 0 });
    p.phase = 'swooping';
    p.targetPos = { x: 0, y: 60, z: 0 };
    tickPhantom(p, { playerPos: { x: 0, y: 60, z: 0 }, dtSec: 0.1 });
    expect(p.phase).toBe('retreating');
  });

  it('no player = no change', () => {
    const p = makePhantom({ x: 20, y: 80, z: 20 }, { x: 0, y: 60, z: 0 });
    const r = tickPhantom(p, { playerPos: null, dtSec: 1 });
    expect(r.swoopStarted).toBe(false);
  });
});
