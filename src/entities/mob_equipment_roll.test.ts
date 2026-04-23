import { describe, it, expect } from 'vitest';
import { rollEquipment } from './mob_equipment_roll';

describe('mob equipment roll', () => {
  it('low difficulty mostly empty', () => {
    const r = rollEquipment({
      localDifficulty: 0,
      rand: () => 0.9,
      isBaby: false,
      mobType: 'zombie',
    });
    for (const s of Object.values(r)) expect(s).toBeNull();
  });

  it('high difficulty equips', () => {
    const r = rollEquipment({
      localDifficulty: 6,
      rand: () => 0,
      isBaby: false,
      mobType: 'zombie',
    });
    expect(r.mainhand).toBeTruthy();
  });

  it('mainhand tier varies by difficulty', () => {
    const high = rollEquipment({
      localDifficulty: 6,
      rand: () => 0,
      isBaby: false,
      mobType: 'zombie',
    });
    const low = rollEquipment({
      localDifficulty: 0,
      rand: () => 0,
      isBaby: false,
      mobType: 'zombie',
    });
    expect(high.mainhand).not.toBe(low.mainhand);
  });
});
