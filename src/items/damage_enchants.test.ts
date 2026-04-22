import { describe, it, expect } from 'vitest';
import { applyEnchant, type Enchanted } from './enchantment';
import { mitigatedDamage, thornsReflection } from './damage_enchants';

function chest(enchant?: [string, number]): Enchanted {
  let e: Enchanted = { itemId: 1, count: 1, damage: 0 };
  if (enchant) e = applyEnchant(e, enchant[0], enchant[1]);
  return e;
}

describe('damage reduction enchants', () => {
  it('plain armor = no reduction', () => {
    expect(mitigatedDamage({ incomingDamage: 10, kind: 'generic', armor: [] })).toBe(10);
  });

  it('protection level reduces generic damage', () => {
    const out = mitigatedDamage({
      incomingDamage: 10,
      kind: 'generic',
      armor: [{ stack: chest(['protection', 4]) }],
    });
    expect(out).toBeLessThan(10);
  });

  it('fire_protection applies only to fire', () => {
    const fire = mitigatedDamage({
      incomingDamage: 10,
      kind: 'fire',
      armor: [{ stack: chest(['fire_protection', 2]) }],
    });
    const generic = mitigatedDamage({
      incomingDamage: 10,
      kind: 'generic',
      armor: [{ stack: chest(['fire_protection', 2]) }],
    });
    expect(fire).toBeLessThan(10);
    expect(generic).toBe(10);
  });

  it('cap at 80% total reduction', () => {
    const pieces = [
      { stack: chest(['protection', 4]) },
      { stack: chest(['fire_protection', 4]) },
      { stack: chest(['blast_protection', 4]) },
      { stack: chest(['projectile_protection', 4]) },
    ];
    const out = mitigatedDamage({ incomingDamage: 100, kind: 'fire', armor: pieces });
    expect(out).toBeGreaterThanOrEqual(20);
  });

  it('thorns reflects damage with a chance', () => {
    let reflected = 0;
    for (let i = 0; i < 100; i++) {
      reflected += thornsReflection({
        armor: [{ stack: chest(['thorns', 3]) }],
        rng: Math.random,
      });
    }
    expect(reflected).toBeGreaterThan(0);
  });

  it('no thorns → no reflection', () => {
    expect(thornsReflection({ armor: [{ stack: chest() }], rng: () => 0 })).toBe(0);
  });
});
