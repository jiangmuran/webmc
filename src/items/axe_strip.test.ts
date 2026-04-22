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
});
