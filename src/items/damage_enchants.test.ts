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

  it('thorns damage range 1..5 (wiki)', () => {
    // Wiki (minecraft.wiki/w/Thorns): "1 to 5 damage." Old code
    // rolled 1..4 and excluded the upper end of the wiki range.
    let saw5 = false;
    const seq: number[] = [];
    for (let i = 0; i < 50; i++) seq.push(0, 0.99); // chance hit, then dmg roll
    let idx = 0;
    const rng = () => seq[idx++ % seq.length] ?? 0;
    for (let i = 0; i < 25; i++) {
      const d = thornsReflection({
        armor: [{ stack: chest(['thorns', 3]) }],
        rng,
      });
      if (d === 5) saw5 = true;
    }
    expect(saw5).toBe(true);
  });

  it('multiple thorns pieces roll independently (wiki)', () => {
    // Wiki: "Each piece independently has a Level × 15% chance...
    // Multiple worn armor items with the Thorns enchantment do
    // stack." With 4 pieces all rolling the chance check, even when
    // the per-piece chance would be small, multi-piece arrangements
    // increase the total chance of at least one trigger. Old code
    // only looked at the best piece's chance.
    const four = [
      { stack: chest(['thorns', 3]) },
      { stack: chest(['thorns', 3]) },
      { stack: chest(['thorns', 3]) },
      { stack: chest(['thorns', 3]) },
    ];
    // Sequence: alternating activate/dmg rolls that pass the 0.45 chance
    // check on every piece.
    let idx = 0;
    const seq = [0.0, 0.5, 0.0, 0.5, 0.0, 0.5, 0.0, 0.5];
    const rng = (): number => seq[idx++ % seq.length] ?? 0;
    expect(thornsReflection({ armor: four, rng })).toBeGreaterThan(0);
  });
});
