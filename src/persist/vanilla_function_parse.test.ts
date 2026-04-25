import { describe, it, expect } from 'vitest';
import { parseVanillaFunction } from './vanilla_function_parse';

describe('vanilla .mcfunction parser', () => {
  it('strips comments and blank lines, keeping commands in order', () => {
    const f = parseVanillaFunction(`# header
say hello

   # indented comment
gamerule keepInventory true
`);
    expect(f.commands).toEqual(['say hello', 'gamerule keepInventory true']);
    expect(f.lineNumbers).toEqual([2, 5]);
    expect(f.commentLines).toBe(2);
    expect(f.blankLines).toBe(2);
  });

  it('joins backslash line-continuations with a single space', () => {
    const f = parseVanillaFunction(`tellraw @a {"text":"hello \\\nworld"}`);
    expect(f.commands).toEqual(['tellraw @a {"text":"hello world"}']);
    expect(f.lineNumbers).toEqual([1]);
  });

  it('handles trailing pending continuation', () => {
    const f = parseVanillaFunction('say first\\');
    expect(f.commands).toEqual(['say first']);
  });

  it('handles CRLF line endings', () => {
    const f = parseVanillaFunction('say one\r\nsay two\r\n');
    expect(f.commands).toEqual(['say one', 'say two']);
  });

  it('returns empty for empty input', () => {
    const f = parseVanillaFunction('');
    expect(f.commands).toEqual([]);
    expect(f.commentLines).toBe(0);
    expect(f.blankLines).toBe(0);
  });
});
