import { describe, it, expect } from 'vitest';
import { renderHearts, renderHunger } from './hud_hearts_render';

describe('hearts hud', () => {
  it('full hp = 10 full hearts', () => {
    const h = renderHearts({ hp: 20, maxHp: 20, absorptionHp: 0 });
    expect(h.filter((x) => x === 'full').length).toBe(10);
  });

  it('half heart', () => {
    const h = renderHearts({ hp: 19, maxHp: 20, absorptionHp: 0 });
    expect(h.filter((x) => x === 'half').length).toBe(1);
    expect(h.filter((x) => x === 'full').length).toBe(9);
  });

  it('absorption appended', () => {
    const h = renderHearts({ hp: 20, maxHp: 20, absorptionHp: 3 });
    expect(h.filter((x) => x === 'absorption_full').length).toBe(1);
    expect(h.filter((x) => x === 'absorption_half').length).toBe(1);
  });

  it('hunger bar', () => {
    const h = renderHunger(20);
    expect(h.every((x) => x === 'full')).toBe(true);
  });

  it('hunger half', () => {
    expect(renderHunger(1).filter((x) => x === 'half').length).toBe(1);
  });
});
