import { describe, it, expect } from 'vitest';
import { applyFilter, blockWord, defaultFilter, moderate, unblockWord } from './chat_filter';

describe('chat filter', () => {
  it('default filter is disabled', () => {
    const cfg = defaultFilter();
    expect(applyFilter('hello', cfg).matchCount).toBe(0);
  });

  it('filter redacts blocked words', () => {
    const cfg = defaultFilter();
    cfg.enabled = true;
    blockWord(cfg, 'badword');
    const r = applyFilter('hello badword friend', cfg);
    expect(r.matchCount).toBe(1);
    expect(r.filtered).toContain('****');
  });

  it('case insensitive matches', () => {
    const cfg = defaultFilter();
    cfg.enabled = true;
    blockWord(cfg, 'foo');
    expect(applyFilter('FOO bar', cfg).matchCount).toBe(1);
  });

  it('unblockWord removes', () => {
    const cfg = defaultFilter();
    cfg.enabled = true;
    blockWord(cfg, 'x');
    expect(unblockWord(cfg, 'x')).toBe(true);
    expect(applyFilter('x', cfg).matchCount).toBe(0);
  });
});

describe('moderate', () => {
  it('send when clean', () => {
    const cfg = defaultFilter();
    cfg.enabled = true;
    const r = moderate({ config: cfg, strictness: 'redact', text: 'hi' });
    expect(r.action).toBe('send');
  });

  it('redact when dirty', () => {
    const cfg = defaultFilter();
    cfg.enabled = true;
    blockWord(cfg, 'bad');
    const r = moderate({ config: cfg, strictness: 'redact', text: 'very bad words' });
    expect(r.action).toBe('redact');
  });

  it('drop when strict', () => {
    const cfg = defaultFilter();
    cfg.enabled = true;
    blockWord(cfg, 'bad');
    const r = moderate({ config: cfg, strictness: 'drop', text: 'very bad words' });
    expect(r.action).toBe('drop');
  });
});
