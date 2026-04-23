import { describe, it, expect } from 'vitest';
import {
  isNetheriteUpgrade,
  upgradedName,
  preservesEnchantments,
} from './smithing_upgrade_netherite';

describe('smithing netherite upgrade', () => {
  const good = {
    base: 'diamond_sword',
    template: 'netherite_upgrade_smithing_template',
    addition: 'netherite_ingot',
  };

  it('valid upgrade', () => {
    expect(isNetheriteUpgrade(good)).toBe(true);
  });

  it('wrong template fails', () => {
    expect(isNetheriteUpgrade({ ...good, template: 'dune' })).toBe(false);
  });

  it('wrong base fails', () => {
    expect(isNetheriteUpgrade({ ...good, base: 'iron_sword' })).toBe(false);
  });

  it('renamed output', () => {
    expect(upgradedName(good)).toBe('netherite_sword');
  });

  it('preserves enchants', () => {
    expect(preservesEnchantments()).toBe(true);
  });
});
