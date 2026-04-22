import { describe, it, expect } from 'vitest';
import { bindPOI, hasProfession, makeVillagerBindings, onBlockBroken } from './villager_poi';

describe('villager POI', () => {
  it('binds workstation → profession', () => {
    const v = makeVillagerBindings();
    bindPOI(v, { kind: 'workstation', pos: { x: 0, y: 64, z: 0 }, blockName: 'webmc:lectern' });
    expect(hasProfession(v)).toBe(true);
  });

  it('breaking workstation removes profession', () => {
    const v = makeVillagerBindings();
    bindPOI(v, { kind: 'workstation', pos: { x: 0, y: 64, z: 0 }, blockName: 'webmc:lectern' });
    onBlockBroken(v, { x: 0, y: 64, z: 0 });
    expect(hasProfession(v)).toBe(false);
  });

  it('breaking bed clears only bed', () => {
    const v = makeVillagerBindings();
    bindPOI(v, { kind: 'bed', pos: { x: 5, y: 64, z: 5 }, blockName: 'webmc:bed' });
    bindPOI(v, {
      kind: 'workstation',
      pos: { x: 0, y: 64, z: 0 },
      blockName: 'webmc:lectern',
    });
    onBlockBroken(v, { x: 5, y: 64, z: 5 });
    expect(v.bed).toBeNull();
    expect(v.workstation).not.toBeNull();
  });
});
