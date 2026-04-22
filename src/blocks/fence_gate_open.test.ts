import { describe, it, expect } from 'vitest';
import {
  openGateManually,
  closeGateManually,
  onRedstoneUpdate,
  renderHeight,
} from './fence_gate_open';

describe('fence gate', () => {
  it('manual open', () => {
    const g = { facing: 'north' as const, open: false, poweredByRedstone: false, inWall: false };
    openGateManually(g, 'south');
    expect(g.open).toBe(true);
    expect(g.facing).toBe('south');
  });

  it('close', () => {
    const g = { facing: 'north' as const, open: true, poweredByRedstone: false, inWall: false };
    closeGateManually(g);
    expect(g.open).toBe(false);
  });

  it('redstone opens and closes', () => {
    const g = { facing: 'north' as const, open: false, poweredByRedstone: false, inWall: false };
    onRedstoneUpdate(g, true);
    expect(g.open).toBe(true);
    onRedstoneUpdate(g, false);
    expect(g.open).toBe(false);
  });

  it('in-wall render height', () => {
    expect(
      renderHeight({ facing: 'north', open: false, poweredByRedstone: false, inWall: true }),
    ).toBe(1);
    expect(
      renderHeight({ facing: 'north', open: false, poweredByRedstone: false, inWall: false }),
    ).toBe(1.5);
  });
});
