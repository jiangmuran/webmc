import { describe, it, expect } from 'vitest';
import { makePiston, tickPiston, EXTEND_TICKS, RETRACT_TICKS } from './piston_extend_sequence';

describe('piston sequence', () => {
  it('full extend cycle', () => {
    const p = makePiston();
    expect(tickPiston(p, { powered: true })).toBe('begin_extend');
    for (let i = 1; i < EXTEND_TICKS; i++) tickPiston(p, { powered: true });
    expect(tickPiston(p, { powered: true })).toBe('finish_extend');
    expect(p.phase).toBe('extended');
  });

  it('retract on power off', () => {
    const p = makePiston();
    tickPiston(p, { powered: true });
    for (let i = 0; i < EXTEND_TICKS; i++) tickPiston(p, { powered: true });
    expect(tickPiston(p, { powered: false })).toBe('begin_retract');
    for (let i = 1; i < RETRACT_TICKS; i++) tickPiston(p, { powered: false });
    expect(tickPiston(p, { powered: false })).toBe('finish_retract');
    expect(p.phase).toBe('idle');
  });

  it('idle stays idle without power', () => {
    const p = makePiston();
    expect(tickPiston(p, { powered: false })).toBe('none');
    expect(p.phase).toBe('idle');
  });
});
