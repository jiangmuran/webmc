import { describe, it, expect } from 'vitest';
import { hitByAxe, tick, canRaise, AXE_DISABLE_TICKS } from './shield_cooldown';

describe('shield cooldown', () => {
  it('axe disables', () => {
    const s = hitByAxe({ raised: true, disabledTicksRemaining: 0, raiseCooldownTicks: 0 }, false);
    expect(s.disabledTicksRemaining).toBe(AXE_DISABLE_TICKS);
    expect(s.raised).toBe(false);
  });

  it('critical axe hits more', () => {
    const s = hitByAxe({ raised: true, disabledTicksRemaining: 0, raiseCooldownTicks: 0 }, true);
    expect(s.disabledTicksRemaining).toBeGreaterThan(AXE_DISABLE_TICKS);
  });

  it('tick decrements', () => {
    const s = tick({ raised: false, disabledTicksRemaining: 10, raiseCooldownTicks: 3 });
    expect(s.disabledTicksRemaining).toBe(9);
    expect(s.raiseCooldownTicks).toBe(2);
  });

  it('cannot raise while disabled', () => {
    expect(canRaise({ raised: false, disabledTicksRemaining: 5, raiseCooldownTicks: 0 })).toBe(
      false,
    );
  });

  it('can raise when cooldown clear', () => {
    expect(canRaise({ raised: false, disabledTicksRemaining: 0, raiseCooldownTicks: 0 })).toBe(
      true,
    );
  });
});
