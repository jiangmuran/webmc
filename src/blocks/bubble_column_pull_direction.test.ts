import { describe, it, expect } from 'vitest';
import { pushDirection, drags, drownsEntity } from './bubble_column_pull_direction';

describe('bubble column pull direction', () => {
  it('magma pulls down', () => {
    expect(pushDirection('magma_block')).toBe('down');
  });

  it('soul sand pushes up', () => {
    expect(pushDirection('soul_sand')).toBe('up');
  });

  it('drags boats on magma', () => {
    expect(drags('magma_block', 'boat')).toBe(true);
  });

  it('magma drowns player', () => {
    expect(drownsEntity('magma_block', 'player')).toBe(true);
    expect(drownsEntity('soul_sand', 'player')).toBe(false);
  });
});
