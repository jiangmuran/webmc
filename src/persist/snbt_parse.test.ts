import { describe, it, expect } from 'vitest';
import { parseSnbt } from './snbt_parse';

describe('snbt parse', () => {
  it('int scalar', () => {
    expect(parseSnbt('42')).toEqual({ kind: 'int', value: 42 });
  });

  it('byte suffix', () => {
    expect(parseSnbt('1b')).toEqual({ kind: 'byte', value: 1 });
  });

  it('double', () => {
    expect(parseSnbt('3.14')).toEqual({ kind: 'double', value: 3.14 });
  });

  it('long', () => {
    const r = parseSnbt('1234L');
    expect(r).toEqual({ kind: 'long', value: 1234n });
  });

  it('quoted string', () => {
    expect(parseSnbt('"hello"')).toEqual({ kind: 'string', value: 'hello' });
  });

  it('empty compound', () => {
    expect(parseSnbt('{}')).toEqual({ kind: 'compound', entries: {} });
  });

  it('compound fields', () => {
    const r = parseSnbt('{x:1,y:2b}');
    if (r.kind !== 'compound') throw new Error('fail');
    expect(r.entries['x']).toEqual({ kind: 'int', value: 1 });
    expect(r.entries['y']).toEqual({ kind: 'byte', value: 2 });
  });

  it('list', () => {
    const r = parseSnbt('[1,2,3]');
    if (r.kind !== 'list') throw new Error('fail');
    expect(r.items.length).toBe(3);
  });
});
