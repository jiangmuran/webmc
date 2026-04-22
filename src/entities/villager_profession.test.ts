import { describe, it, expect } from 'vitest';
import { makeVillager, tryClaim, unemploy, professionForSite } from './villager_profession';

describe('villager profession', () => {
  it('claims a farm', () => {
    const v = makeVillager();
    const ok = tryClaim(v, {
      siteBlockId: 'webmc:composter',
      sitePos: { x: 1, y: 64, z: 2 },
      siteAlreadyClaimed: false,
    });
    expect(ok).toBe(true);
    expect(v.profession).toBe('farmer');
  });

  it('nitwit never claims', () => {
    const v = makeVillager(true);
    const ok = tryClaim(v, {
      siteBlockId: 'webmc:composter',
      sitePos: { x: 0, y: 0, z: 0 },
      siteAlreadyClaimed: false,
    });
    expect(ok).toBe(false);
    expect(v.profession).toBe('nitwit');
  });

  it('already-employed cannot claim another', () => {
    const v = makeVillager();
    tryClaim(v, {
      siteBlockId: 'webmc:composter',
      sitePos: { x: 0, y: 0, z: 0 },
      siteAlreadyClaimed: false,
    });
    const ok = tryClaim(v, {
      siteBlockId: 'webmc:lectern',
      sitePos: { x: 5, y: 0, z: 0 },
      siteAlreadyClaimed: false,
    });
    expect(ok).toBe(false);
  });

  it('unemploy clears', () => {
    const v = makeVillager();
    tryClaim(v, {
      siteBlockId: 'webmc:lectern',
      sitePos: { x: 0, y: 0, z: 0 },
      siteAlreadyClaimed: false,
    });
    unemploy(v);
    expect(v.profession).toBe('unemployed');
    expect(v.claimedSite).toBeNull();
  });

  it('unemploy does not demote nitwit', () => {
    const v = makeVillager(true);
    unemploy(v);
    expect(v.profession).toBe('nitwit');
  });

  it('unknown site = null', () => {
    expect(professionForSite('webmc:stone')).toBeNull();
  });
});
