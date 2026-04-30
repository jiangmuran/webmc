import { describe, it, expect } from 'vitest';
import { onSupportRemoved, onWaterContact, placeTorch, torchLight } from './torch_placement';

describe('torch placement', () => {
  it('floor placement on top', () => {
    const r = placeTorch('torch', {
      clickedFace: 'top',
      supportingBlockSolid: true,
    });
    expect(r.ok).toBe(true);
    expect(r.facing).toBe('floor');
    expect(r.blockId).toBe('webmc:torch');
  });

  it('wall placement on side', () => {
    const r = placeTorch('soul_torch', {
      clickedFace: 'north',
      supportingBlockSolid: true,
    });
    expect(r.blockId).toBe('webmc:wall_soul_torch');
    expect(r.facing).toBe('north');
  });

  it('bottom rejects', () => {
    const r = placeTorch('torch', {
      clickedFace: 'bottom',
      supportingBlockSolid: true,
    });
    expect(r.ok).toBe(false);
  });

  it('air support rejects', () => {
    const r = placeTorch('torch', {
      clickedFace: 'top',
      supportingBlockSolid: false,
    });
    expect(r.ok).toBe(false);
  });

  it('drops item on support removed', () => {
    expect(onSupportRemoved('torch')[0]?.item).toBe('webmc:torch');
  });

  it('water destroys both torch variants without drop (wiki)', () => {
    expect(onWaterContact('torch').dropped).toBe(false);
    expect(onWaterContact('soul_torch').dropped).toBe(false);
    expect(onWaterContact('redstone_torch').dropped).toBe(false);
    expect(onWaterContact('torch').extinguished).toBe(true);
    expect(onWaterContact('soul_torch').extinguished).toBe(true);
  });

  it('light levels', () => {
    expect(torchLight('torch')).toBe(14);
    expect(torchLight('soul_torch')).toBe(10);
    expect(torchLight('redstone_torch')).toBe(7);
  });
});
