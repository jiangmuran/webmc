import { describe, it, expect } from 'vitest';
import { defaultsFor, frenchZQSD } from './language_keymap';

describe('language keymap', () => {
  it('english WASD', () => {
    expect(defaultsFor('en_us').forward).toBe('KeyW');
  });

  it('all locales return defaults', () => {
    for (const l of ['zh_cn', 'ja_jp', 'ru_ru', 'de_de'] as const) {
      expect(defaultsFor(l).forward).toBeTruthy();
    }
  });

  it('french alt', () => {
    expect(frenchZQSD().forward).toBe('KeyZ');
  });
});
