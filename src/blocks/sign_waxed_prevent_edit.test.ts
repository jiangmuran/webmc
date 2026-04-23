import { describe, it, expect } from 'vitest';
import { canEdit, applyWax, honeycombUsed, dyeApplied } from './sign_waxed_prevent_edit';

const base = { text: ['', '', '', ''], color: 'black', glowing: false, waxed: false };

describe('sign waxed prevent edit', () => {
  it('unwaxed editable', () => {
    expect(canEdit(base)).toBe(true);
  });

  it('waxed locks', () => {
    expect(canEdit(applyWax(base))).toBe(false);
  });

  it('honeycomb detected', () => {
    expect(honeycombUsed('honeycomb')).toBe(true);
    expect(honeycombUsed('stick')).toBe(false);
  });

  it('dye applies when unwaxed', () => {
    expect(dyeApplied(base, 'red').color).toBe('red');
  });

  it('waxed preserves color', () => {
    expect(dyeApplied(applyWax(base), 'red').color).toBe('black');
  });
});
