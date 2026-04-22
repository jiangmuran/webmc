import { describe, it, expect } from 'vitest';
import { baseMaterialFor, duplicateTemplate } from './template_copy';

describe('template copy', () => {
  it('base material table has all trim templates', () => {
    expect(baseMaterialFor('netherite_upgrade')).toBe('webmc:netherrack');
    expect(baseMaterialFor('silence_trim')).toBe('webmc:cobbled_deepslate');
  });

  it('7 diamonds + correct base → 2 copies', () => {
    const r = duplicateTemplate({
      template: 'vex_trim',
      diamonds: 7,
      baseMaterial: 'webmc:cobblestone',
    });
    expect(r.copiesProduced).toBe(2);
    expect(r.consumesDiamonds).toBe(7);
  });

  it('wrong base material → no copies', () => {
    const r = duplicateTemplate({
      template: 'vex_trim',
      diamonds: 7,
      baseMaterial: 'webmc:netherrack',
    });
    expect(r.copiesProduced).toBe(0);
  });

  it('not enough diamonds → no copies', () => {
    const r = duplicateTemplate({
      template: 'coast_trim',
      diamonds: 3,
      baseMaterial: 'webmc:cobblestone',
    });
    expect(r.copiesProduced).toBe(0);
  });
});
