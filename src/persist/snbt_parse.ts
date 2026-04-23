// Stringified NBT (SNBT) parser. Minimal subset: compound {}, list [],
// int/long/short/byte/float/double/string. Used when importing commands.

export type SnbtValue =
  | { kind: 'byte'; value: number }
  | { kind: 'short'; value: number }
  | { kind: 'int'; value: number }
  | { kind: 'long'; value: bigint }
  | { kind: 'float'; value: number }
  | { kind: 'double'; value: number }
  | { kind: 'string'; value: string }
  | { kind: 'list'; items: SnbtValue[] }
  | { kind: 'compound'; entries: Record<string, SnbtValue> };

export function parseSnbt(src: string): SnbtValue {
  let i = 0;
  const at = (n: number): string => src.charAt(n);
  function skip(): void {
    while (i < src.length && /\s/.test(at(i))) i++;
  }
  function parseValue(): SnbtValue {
    skip();
    const c = at(i);
    if (c === '{') return parseCompound();
    if (c === '[') return parseList();
    if (c === '"' || c === "'") return parseString();
    return parseScalar();
  }
  function parseCompound(): SnbtValue {
    i++;
    skip();
    const entries: Record<string, SnbtValue> = {};
    if (at(i) === '}') {
      i++;
      return { kind: 'compound', entries };
    }
    while (i < src.length) {
      skip();
      const key = parseKey();
      skip();
      if (at(i) !== ':') throw new Error('expected :');
      i++;
      entries[key] = parseValue();
      skip();
      if (at(i) === ',') {
        i++;
        continue;
      }
      if (at(i) === '}') {
        i++;
        return { kind: 'compound', entries };
      }
      throw new Error('expected , or }');
    }
    throw new Error('unterminated compound');
  }
  function parseKey(): string {
    skip();
    if (at(i) === '"' || at(i) === "'") {
      const r = parseString();
      return r.kind === 'string' ? r.value : '';
    }
    let s = '';
    while (i < src.length && /[A-Za-z0-9_]/.test(at(i))) {
      s += at(i);
      i++;
    }
    return s;
  }
  function parseString(): SnbtValue {
    const q = at(i);
    i++;
    let s = '';
    while (i < src.length && at(i) !== q) {
      if (at(i) === '\\') {
        i++;
        s += at(i);
        i++;
      } else {
        s += at(i);
        i++;
      }
    }
    i++;
    return { kind: 'string', value: s };
  }
  function parseList(): SnbtValue {
    i++;
    const items: SnbtValue[] = [];
    skip();
    if (at(i) === ']') {
      i++;
      return { kind: 'list', items };
    }
    while (i < src.length) {
      items.push(parseValue());
      skip();
      if (at(i) === ',') {
        i++;
        continue;
      }
      if (at(i) === ']') {
        i++;
        return { kind: 'list', items };
      }
      throw new Error('expected , or ]');
    }
    throw new Error('unterminated list');
  }
  function parseScalar(): SnbtValue {
    let s = '';
    while (i < src.length && /[0-9A-Za-z.\-+]/.test(at(i))) {
      s += at(i);
      i++;
    }
    const suffix = s.slice(-1);
    if (suffix === 'b') return { kind: 'byte', value: parseInt(s.slice(0, -1), 10) };
    if (suffix === 's') return { kind: 'short', value: parseInt(s.slice(0, -1), 10) };
    if (suffix === 'l' || suffix === 'L') return { kind: 'long', value: BigInt(s.slice(0, -1)) };
    if (suffix === 'f') return { kind: 'float', value: parseFloat(s.slice(0, -1)) };
    if (suffix === 'd') return { kind: 'double', value: parseFloat(s.slice(0, -1)) };
    if (s.includes('.')) return { kind: 'double', value: parseFloat(s) };
    return { kind: 'int', value: parseInt(s, 10) };
  }
  return parseValue();
}
