import { describe, it, expect } from 'vitest';
import { parseCommand } from './command_parse';

describe('command parse', () => {
  it('simple', () => {
    const r = parseCommand('/give Steve diamond 64');
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.parsed.name).toBe('give');
      expect(r.parsed.args).toEqual(['Steve', 'diamond', '64']);
    }
  });

  it('quoted args', () => {
    const r = parseCommand('/say "hello world"');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.parsed.args).toEqual(['hello world']);
  });

  it('escaped quote', () => {
    const r = parseCommand('/say "He said \\"hi\\""');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.parsed.args[0]).toBe('He said "hi"');
  });

  it('unterminated quote', () => {
    const r = parseCommand('/say "oops');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBe('unterminated_quote');
  });

  it('not a command', () => {
    const r = parseCommand('hello');
    expect(r.ok).toBe(false);
  });

  it('empty command', () => {
    const r = parseCommand('/');
    expect(r.ok).toBe(false);
  });
});
