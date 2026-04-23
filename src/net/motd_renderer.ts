// MOTD rendering. Supports limited markup: `&c` color codes, `&l` bold.

const COLOR_CODES: Record<string, string> = {
  '0': '#000000',
  '1': '#0000aa',
  '2': '#00aa00',
  '3': '#00aaaa',
  '4': '#aa0000',
  '5': '#aa00aa',
  '6': '#ffaa00',
  '7': '#aaaaaa',
  '8': '#555555',
  '9': '#5555ff',
  a: '#55ff55',
  b: '#55ffff',
  c: '#ff5555',
  d: '#ff55ff',
  e: '#ffff55',
  f: '#ffffff',
};

export interface RenderedSegment {
  text: string;
  color: string;
  bold: boolean;
  italic: boolean;
}

export function renderMotd(raw: string): RenderedSegment[] {
  const out: RenderedSegment[] = [];
  let color = '#ffffff';
  let bold = false;
  let italic = false;
  let buf = '';
  const flush = (): void => {
    if (buf) out.push({ text: buf, color, bold, italic });
    buf = '';
  };
  for (let i = 0; i < raw.length; i++) {
    if (raw[i] === '&' && i + 1 < raw.length) {
      flush();
      const code = raw.charAt(i + 1);
      if (code === 'l') bold = true;
      else if (code === 'o') italic = true;
      else if (code === 'r') {
        color = '#ffffff';
        bold = false;
        italic = false;
      } else if (COLOR_CODES[code]) color = COLOR_CODES[code];
      i++;
    } else {
      buf += raw.charAt(i);
    }
  }
  flush();
  return out;
}

export function stripCodes(raw: string): string {
  return raw.replace(/&[0-9a-frlo]/g, '');
}
