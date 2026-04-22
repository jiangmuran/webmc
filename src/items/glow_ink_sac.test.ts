import { describe, it, expect } from 'vitest';
import { applyTo, removeWithInk } from './glow_ink_sac';

describe('glow ink sac', () => {
  it('applies to sign', () => {
    expect(applyTo({ target: 'sign', alreadyGlowing: false })).toEqual({ kind: 'applied' });
  });

  it('applies to item frame', () => {
    expect(applyTo({ target: 'item_frame', alreadyGlowing: false })).toEqual({ kind: 'applied' });
  });

  it('rejects other target', () => {
    expect(applyTo({ target: 'other', alreadyGlowing: false })).toEqual({ kind: 'invalid_target' });
  });

  it('already glowing', () => {
    expect(applyTo({ target: 'sign', alreadyGlowing: true })).toEqual({ kind: 'already_glowing' });
  });

  it('ink removes glow', () => {
    expect(removeWithInk(true)).toBe(true);
    expect(removeWithInk(false)).toBe(false);
  });
});
