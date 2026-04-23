import { describe, it, expect } from 'vitest';
import { canApply } from './enchant_applicable_to';

describe('enchant applicable to', () => {
  it('sharpness on sword', () => {
    expect(canApply('sharpness', 'sword')).toBe(true);
  });

  it('sharpness on bow no', () => {
    expect(canApply('sharpness', 'bow')).toBe(false);
  });

  it('feather falling boots only', () => {
    expect(canApply('feather_falling', 'boots')).toBe(true);
    expect(canApply('feather_falling', 'helmet')).toBe(false);
  });

  it('swift sneak only leggings', () => {
    expect(canApply('swift_sneak', 'leggings')).toBe(true);
    expect(canApply('swift_sneak', 'helmet')).toBe(false);
  });

  it('mending universal tools', () => {
    expect(canApply('mending', 'sword')).toBe(true);
    expect(canApply('mending', 'boots')).toBe(true);
  });

  it('curse of binding armor only', () => {
    expect(canApply('curse_of_binding', 'helmet')).toBe(true);
    expect(canApply('curse_of_binding', 'sword')).toBe(false);
  });

  it('unknown enchant rejected', () => {
    expect(canApply('fake_enchant', 'sword')).toBe(false);
  });
});
