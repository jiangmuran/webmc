import { describe, it, expect } from 'vitest';
import {
  itemId,
  dropsContentsOnBreak,
  explodesOnBreak,
  creativeOnlyKind,
} from './minecart_drop_on_break';

describe('minecart drop on break', () => {
  it('item id mirrors kind', () => {
    expect(itemId('minecart')).toBe('minecart');
  });

  it('chest cart drops contents', () => {
    expect(dropsContentsOnBreak('chest_minecart')).toBe(true);
  });

  it('plain cart no contents', () => {
    expect(dropsContentsOnBreak('minecart')).toBe(false);
  });

  it('TNT cart explodes only when powered', () => {
    expect(explodesOnBreak('tnt_minecart', true)).toBe(true);
    expect(explodesOnBreak('tnt_minecart', false)).toBe(false);
  });

  it('command block creative', () => {
    expect(creativeOnlyKind('command_block_minecart')).toBe(true);
    expect(creativeOnlyKind('minecart')).toBe(false);
  });
});
