import { describe, it, expect } from 'vitest';
import { LanguageRegistry } from './language_pack';

describe('language pack', () => {
  it('returns key when missing', () => {
    const l = new LanguageRegistry();
    expect(l.translate('hello')).toBe('hello');
  });

  it('resolves in current locale', () => {
    const l = new LanguageRegistry();
    l.register('en_us', { hello: 'Hello' });
    l.register('zh_cn', { hello: '你好' });
    expect(l.translate('hello')).toBe('Hello');
    l.setLocale('zh_cn');
    expect(l.translate('hello')).toBe('你好');
  });

  it('falls back to en_us', () => {
    const l = new LanguageRegistry();
    l.register('en_us', { hello: 'Hello' });
    l.setLocale('zh_cn');
    expect(l.translate('hello')).toBe('Hello');
  });

  it('interpolates params', () => {
    const l = new LanguageRegistry();
    l.register('en_us', { welcome: 'Hi, {name}!' });
    expect(l.translate('welcome', { name: 'Steve' })).toBe('Hi, Steve!');
  });

  it('missing param placeholder kept', () => {
    const l = new LanguageRegistry();
    l.register('en_us', { x: 'v={v}' });
    expect(l.translate('x')).toBe('v={v}');
  });
});
