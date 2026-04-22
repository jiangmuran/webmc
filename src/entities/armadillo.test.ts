import { describe, it, expect } from 'vitest';
import {
  damageWolfArmor,
  dyeWolfArmor,
  equipWolfArmor,
  makeArmadilloState,
  makeWolfArmor,
  tickArmadillo,
} from './armadillo';

describe('armadillo', () => {
  it('rolls up when a scary source is within 3 blocks', () => {
    const s = makeArmadilloState();
    tickArmadillo(s, { nearbyScarySources: [{ distanceSq: 4 }], dtSec: 0.1 });
    expect(s.rolled).toBe(true);
  });

  it('drops a scute periodically when not rolled', () => {
    const s = makeArmadilloState();
    const r = tickArmadillo(s, { nearbyScarySources: [], dtSec: 0.1 });
    expect(r.droppedScute).toBe(true);
    // Next tick: still on cooldown.
    const r2 = tickArmadillo(s, { nearbyScarySources: [], dtSec: 0.1 });
    expect(r2.droppedScute).toBe(false);
  });

  it('does not drop a scute while rolled', () => {
    const s = makeArmadilloState();
    s.scuteCooldownSec = 0;
    const r = tickArmadillo(s, {
      nearbyScarySources: [{ distanceSq: 1 }],
      dtSec: 0.1,
    });
    expect(r.droppedScute).toBe(false);
  });
});

describe('wolf armor', () => {
  it('equip fills durability', () => {
    const a = makeWolfArmor();
    equipWolfArmor(a);
    expect(a.equipped).toBe(true);
    expect(a.durability).toBe(a.maxDurability);
  });

  it('damage reduces durability until 0 and then unequips', () => {
    const a = makeWolfArmor();
    equipWolfArmor(a);
    damageWolfArmor(a, 100);
    expect(a.durability).toBe(0);
    expect(a.equipped).toBe(false);
  });

  it('dye changes color', () => {
    const a = makeWolfArmor();
    dyeWolfArmor(a, '#ff0000');
    expect(a.color).toBe('#ff0000');
  });
});
