export type Pos = `${number},${number},${number}`;

export function findConnected(
  origin: Pos,
  neighborsOf: (p: Pos) => readonly Pos[],
  isChorus: (p: Pos) => boolean,
): readonly Pos[] {
  const seen = new Set<Pos>();
  const stack: Pos[] = [origin];
  while (stack.length > 0) {
    const top = stack.pop();
    if (top === undefined) break;
    if (seen.has(top)) continue;
    if (!isChorus(top)) continue;
    seen.add(top);
    for (const n of neighborsOf(top)) {
      if (!seen.has(n)) stack.push(n);
    }
  }
  return [...seen];
}

export function breakCascade(
  origin: Pos,
  neighborsOf: (p: Pos) => readonly Pos[],
  isChorus: (p: Pos) => boolean,
  hasGroundSupport: (p: Pos) => boolean,
): readonly Pos[] {
  const connected = findConnected(origin, neighborsOf, isChorus);
  return connected.filter((p) => !hasGroundSupport(p));
}
