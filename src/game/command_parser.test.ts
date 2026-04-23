import { describe, it, expect } from 'vitest';
import { parseSlash, isKnownCommand } from './command_parser';

describe('command parser', () => {
  it('parses /tp', () => {
    const p = parseSlash('/tp Steve 10 64 10');
    expect(p?.name).toBe('tp');
    expect(p?.args).toEqual(['Steve', '10', '64', '10']);
  });

  it('no slash → undefined', () => {
    expect(parseSlash('hello')).toBeUndefined();
  });

  it('empty slash rejected', () => {
    expect(parseSlash('/')).toBeUndefined();
  });

  it('known commands', () => {
    expect(isKnownCommand({ name: 'tp', args: [] })).toBe(true);
    expect(isKnownCommand({ name: 'xyz', args: [] })).toBe(false);
  });
});
