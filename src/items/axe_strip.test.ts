import { describe, it, expect } from 'vitest';
import { useAxe } from './axe_strip';

describe('axe', () => {
  it('strips oak log', () => {
    const r = useAxe('webmc:oak_log');
    expect(r.kind).toBe('strip');
    if (r.kind === 'strip') expect(r.newBlock).toBe('webmc:stripped_oak_log');
  });

  it('unwaxes waxed copper', () => {
    const r = useAxe('webmc:waxed_copper_block');
    expect(r.kind).toBe('unwax');
    if (r.kind === 'unwax') expect(r.newBlock).toBe('webmc:copper_block');
  });

  it('scrapes oxidized copper one tier', () => {
    const r = useAxe('webmc:oxidized_copper');
    expect(r.kind).toBe('scrape');
    if (r.kind === 'scrape') expect(r.newBlock).toBe('webmc:weathered_copper');
  });

  it('stone → none', () => {
    expect(useAxe('webmc:stone').kind).toBe('none');
  });

  it('stripped already → none', () => {
    expect(useAxe('webmc:stripped_oak_log').kind).toBe('none');
  });

  it('unwaxes all cut copper variants (wiki: full coverage)', () => {
    // Each of cut copper / cut copper stairs / cut copper slab /
    // chiseled copper has 4 oxidation levels; all 16 should unwax.
    const variants = [
      'cut_copper',
      'exposed_cut_copper',
      'weathered_cut_copper',
      'oxidized_cut_copper',
      'cut_copper_stairs',
      'exposed_cut_copper_stairs',
      'weathered_cut_copper_stairs',
      'oxidized_cut_copper_stairs',
      'cut_copper_slab',
      'exposed_cut_copper_slab',
      'weathered_cut_copper_slab',
      'oxidized_cut_copper_slab',
      'chiseled_copper',
      'exposed_chiseled_copper',
      'weathered_chiseled_copper',
      'oxidized_chiseled_copper',
    ];
    for (const v of variants) {
      const r = useAxe(`webmc:waxed_${v}`);
      expect(r.kind).toBe('unwax');
      if (r.kind === 'unwax') expect(r.newBlock).toBe(`webmc:${v}`);
    }
  });

  it('scrapes oxidation off cut copper variants', () => {
    // Each oxidation level of cut copper / cut copper stairs / cut
    // copper slab / chiseled copper should scrape one tier back.
    const r1 = useAxe('webmc:oxidized_cut_copper');
    expect(r1.kind).toBe('scrape');
    if (r1.kind === 'scrape') expect(r1.newBlock).toBe('webmc:weathered_cut_copper');
    const r2 = useAxe('webmc:weathered_chiseled_copper');
    expect(r2.kind).toBe('scrape');
    if (r2.kind === 'scrape') expect(r2.newBlock).toBe('webmc:exposed_chiseled_copper');
  });
});
