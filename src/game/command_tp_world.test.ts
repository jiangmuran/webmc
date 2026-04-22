import { describe, it, expect } from 'vitest';
import { teleport, parseCoordToken } from './command_tp_world';

describe('/tp', () => {
  it('absolute coords', () => {
    const r = teleport({
      targetId: 'S',
      currentPos: { x: 0, y: 0, z: 0 },
      currentDim: 'overworld',
      to: {
        x: { kind: 'abs', value: 10 },
        y: { kind: 'abs', value: 64 },
        z: { kind: 'abs', value: 10 },
      },
    });
    expect(r.newPos).toEqual({ x: 10, y: 64, z: 10 });
  });

  it('relative coords', () => {
    const r = teleport({
      targetId: 'S',
      currentPos: { x: 5, y: 5, z: 5 },
      currentDim: 'overworld',
      to: {
        x: { kind: 'rel', offset: 10 },
        y: { kind: 'rel', offset: 0 },
        z: { kind: 'rel', offset: -3 },
      },
    });
    expect(r.newPos).toEqual({ x: 15, y: 5, z: 2 });
  });

  it('dim change', () => {
    const r = teleport({
      targetId: 'S',
      currentPos: { x: 0, y: 0, z: 0 },
      currentDim: 'overworld',
      to: {
        x: { kind: 'abs', value: 0 },
        y: { kind: 'abs', value: 0 },
        z: { kind: 'abs', value: 0 },
        dim: 'nether',
      },
    });
    expect(r.newDim).toBe('nether');
  });

  it('parse tokens', () => {
    expect(parseCoordToken('10', 0)).toEqual({ kind: 'abs', value: 10 });
    expect(parseCoordToken('~', 0)).toEqual({ kind: 'rel', offset: 0 });
    expect(parseCoordToken('~5', 0)).toEqual({ kind: 'rel', offset: 5 });
    expect(parseCoordToken('abc', 0)).toBeNull();
  });
});
