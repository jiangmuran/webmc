const COLOR_CODES: Record<string, string> = {
  '0': 'black',
  '1': 'dark_blue',
  '2': 'dark_green',
  '3': 'dark_aqua',
  '4': 'dark_red',
  '5': 'dark_purple',
  '6': 'gold',
  '7': 'gray',
  '8': 'dark_gray',
  '9': 'blue',
  a: 'green',
  b: 'aqua',
  c: 'red',
  d: 'light_purple',
  e: 'yellow',
  f: 'white',
};

const FORMATS: Record<string, string> = {
  l: 'bold',
  m: 'strikethrough',
  n: 'underline',
  o: 'italic',
  r: 'reset',
  k: 'obfuscated',
};

export interface Segment {
  text: string;
  color?: string;
  format: readonly string[];
}

export function parseFormatted(input: string): readonly Segment[] {
  const segs: Segment[] = [];
  let buf = '';
  let color: string | undefined;
  let formats: string[] = [];
  const flush = (): void => {
    if (buf.length === 0) return;
    const s: Segment = { text: buf, format: [...formats] };
    if (color !== undefined) {
      segs.push({ ...s, color });
    } else {
      segs.push(s);
    }
    buf = '';
  };
  for (let i = 0; i < input.length; i++) {
    if (input.charAt(i) === '§' && i + 1 < input.length) {
      flush();
      const code = input.charAt(i + 1).toLowerCase();
      if (COLOR_CODES[code] !== undefined) {
        color = COLOR_CODES[code];
        formats = [];
      } else if (FORMATS[code] !== undefined) {
        if (code === 'r') {
          color = undefined;
          formats = [];
        } else {
          formats.push(FORMATS[code]);
        }
      }
      i++;
    } else {
      buf += input.charAt(i);
    }
  }
  flush();
  return segs;
}

export function stripCodes(input: string): string {
  return input.replace(/§./g, '');
}
