import { describe, it, expect } from 'vitest';
import { makeLocales, registerLocale, setActive, t, availableLocales } from './locale_translate';

describe('locale translate', () => {
  it('returns key when missing', () => {
    const l = makeLocales();
    expect(t(l, 'menu.start')).toBe('menu.start');
  });

  it('translates active', () => {
    const l = makeLocales();
    registerLocale(l, 'en-US', { 'menu.start': 'Start' });
    expect(t(l, 'menu.start')).toBe('Start');
  });

  it('falls back when missing in active', () => {
    const l = makeLocales();
    registerLocale(l, 'en-US', { hi: 'Hello' });
    registerLocale(l, 'zh-CN', {});
    setActive(l, 'zh-CN');
    expect(t(l, 'hi')).toBe('Hello');
  });

  it('placeholder substitution', () => {
    const l = makeLocales();
    registerLocale(l, 'en-US', { greet: 'Hi %s, you have %s hearts' });
    expect(t(l, 'greet', 'Steve', 10)).toBe('Hi Steve, you have 10 hearts');
  });

  it('lists available', () => {
    const l = makeLocales();
    registerLocale(l, 'en-US', {});
    registerLocale(l, 'zh-CN', {});
    expect(availableLocales(l).sort()).toEqual(['en-US', 'zh-CN']);
  });
});
