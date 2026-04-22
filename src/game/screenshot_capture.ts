// Screenshot capture. F2 grabs the current framebuffer, encodes PNG,
// writes to the user's downloads. Filename: YYYY-MM-DD_HH.MM.SS.png.

export function screenshotFilename(date: Date): string {
  const pad = (n: number, w = 2): string => n.toString().padStart(w, '0');
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `_${pad(date.getHours())}.${pad(date.getMinutes())}.${pad(date.getSeconds())}.png`
  );
}

// Collision: if the same filename is produced within the same second,
// append _1, _2, ... to the basename.
export function resolveCollision(name: string, existing: Set<string>): string {
  if (!existing.has(name)) return name;
  const base = name.replace(/\.png$/, '');
  for (let i = 1; i < 1000; i++) {
    const candidate = `${base}_${i}.png`;
    if (!existing.has(candidate)) return candidate;
  }
  return `${base}_${Date.now()}.png`;
}
