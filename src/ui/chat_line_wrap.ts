export function wrap(line: string, maxChars: number): string[] {
  if (maxChars <= 0) return [line];
  const words = line.split(/\s+/);
  const out: string[] = [];
  let current = '';
  for (const w of words) {
    if (!w) continue;
    if ((current.length === 0 ? 0 : current.length + 1) + w.length > maxChars) {
      if (current.length > 0) out.push(current);
      current = w.slice(0, maxChars);
    } else {
      current = current.length === 0 ? w : `${current} ${w}`;
    }
  }
  if (current.length > 0) out.push(current);
  return out;
}

export function maxLinesShown(): number {
  return 10;
}
