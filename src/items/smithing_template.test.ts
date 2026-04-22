import { describe, it, expect } from 'vitest';
import { TEMPLATE_DUPLICATION_DIAMONDS, trySmith } from './smithing_template';

describe('smithing template', () => {
  it('netherite upgrade diamond → netherite', () => {
    const r = trySmith({
      template: 'webmc:netherite_upgrade',
      base: 'webmc:diamond_chestplate',
      materialItem: 'webmc:netherite_ingot',
    });
    expect(r.output?.item).toBe('webmc:netherite_chestplate');
  });

  it('netherite upgrade refuses wrong base', () => {
    const r = trySmith({
      template: 'webmc:netherite_upgrade',
      base: 'webmc:iron_chestplate',
      materialItem: 'webmc:netherite_ingot',
    });
    expect(r.output).toBeNull();
  });

  it('trim applies with material', () => {
    const r = trySmith({
      template: 'webmc:coast_armor_trim_template',
      base: 'webmc:diamond_chestplate',
      materialItem: 'webmc:gold_ingot',
    });
    expect(r.output?.trim?.material).toBe('gold');
  });

  it('trim refuses non-armor base', () => {
    const r = trySmith({
      template: 'webmc:coast_armor_trim_template',
      base: 'webmc:diamond_sword',
      materialItem: 'webmc:gold_ingot',
    });
    expect(r.output).toBeNull();
  });

  it('trim refuses unknown material', () => {
    const r = trySmith({
      template: 'webmc:coast_armor_trim_template',
      base: 'webmc:diamond_chestplate',
      materialItem: 'webmc:stick',
    });
    expect(r.output).toBeNull();
  });

  it('duplication costs 7 diamonds', () => {
    expect(TEMPLATE_DUPLICATION_DIAMONDS).toBe(7);
  });
});
