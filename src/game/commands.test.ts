import { describe, it, expect } from 'vitest';
import { CommandError, COMMANDS, parseCommand } from './commands';

describe('commands', () => {
  it('rejects non-slash input', () => {
    expect(() => parseCommand('give alice stone')).toThrow(CommandError);
  });

  it('rejects unknown commands', () => {
    expect(() => parseCommand('/zzzz')).toThrow(CommandError);
  });

  it('parses /give', () => {
    const p = parseCommand('/give alice webmc:stone 16');
    expect(p.name).toBe('give');
    expect(p.args).toEqual(['alice', 'webmc:stone', 16]);
  });

  it('parses /tp with numeric coords', () => {
    const p = parseCommand('/tp 10 64 -5');
    expect(p.args).toEqual([10, 64, -5]);
  });

  it('/say collects the rest as a single string', () => {
    const p = parseCommand('/say hello world!');
    expect(p.args).toEqual(['hello world!']);
  });

  it('rejects wrong argument type', () => {
    expect(() => parseCommand('/tp x 64 -5')).toThrow(CommandError);
  });

  it('accepts partial trailing args', () => {
    const p = parseCommand('/give alice webmc:stone');
    expect(p.args).toEqual(['alice', 'webmc:stone']);
  });

  it('has 10+ registered commands', () => {
    expect(COMMANDS.length).toBeGreaterThanOrEqual(10);
  });
});
