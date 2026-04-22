import { describe, it, expect } from 'vitest';
import { applyBannerToShield, shieldHasBanner, stripShieldBanner } from './banner_shield';

const BANNER = { baseColor: 'white', layers: [{ id: 'cross' as const, color: 'red' }] };

describe('shield banner', () => {
  it('applies to empty shield', () => {
    const shield = { banner: null, durability: 336, disabledTicks: 0 };
    const r = applyBannerToShield({ shield, banner: BANNER });
    expect(r.accepted).toBe(true);
    expect(shieldHasBanner(shield)).toBe(true);
  });

  it('rejects double-apply', () => {
    const shield = { banner: BANNER, durability: 336, disabledTicks: 0 };
    const r = applyBannerToShield({ shield, banner: BANNER });
    expect(r.accepted).toBe(false);
  });

  it('strip returns banner + clears', () => {
    const shield = { banner: BANNER, durability: 336, disabledTicks: 0 };
    const r = stripShieldBanner(shield);
    expect(r.stripped).toBe(true);
    expect(r.returnedBanner).toEqual(BANNER);
    expect(shieldHasBanner(shield)).toBe(false);
  });

  it('strip no-op on plain shield', () => {
    const shield = { banner: null, durability: 336, disabledTicks: 0 };
    expect(stripShieldBanner(shield).stripped).toBe(false);
  });
});
