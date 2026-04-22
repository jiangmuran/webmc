import { describe, it, expect } from 'vitest';
import { availableLanguages, hasTranslation, registerLanguage, translate } from './language_keys';

describe('translations', () => {
  it('en_us has default entries', () => {
    expect(translate({ key: 'key.forward', langCode: 'en_us' })).toBe('Walk Forward');
  });

  it('unknown key returns the key', () => {
    expect(translate({ key: 'no.such.key', langCode: 'en_us' })).toBe('no.such.key');
  });

  it('falls back to en_us for missing locale', () => {
    expect(translate({ key: 'menu.quit', langCode: 'nonexistent' })).toBe('Quit');
  });

  it('placeholders substituted', () => {
    const msg = translate({
      key: 'death.fell.accident.generic',
      langCode: 'en_us',
      placeholders: ['alice'],
    });
    expect(msg).toContain('alice');
  });

  it('register + translate custom lang', () => {
    registerLanguage('zh_cn', { 'menu.quit': '退出' });
    expect(translate({ key: 'menu.quit', langCode: 'zh_cn' })).toBe('退出');
  });

  it('hasTranslation', () => {
    expect(hasTranslation('en_us', 'menu.quit')).toBe(true);
    expect(hasTranslation('en_us', 'no.such')).toBe(false);
  });

  it('availableLanguages lists registered', () => {
    expect(availableLanguages()).toContain('en_us');
  });
});
