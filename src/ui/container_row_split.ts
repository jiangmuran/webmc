export interface Stack {
  id: string;
  count: number;
}

export function splitStackInHalf(s: Stack): [Stack | undefined, Stack | undefined] {
  if (s.count <= 1) return [s, undefined];
  const half = Math.floor(s.count / 2);
  return [
    { id: s.id, count: s.count - half },
    { id: s.id, count: half },
  ];
}

export function takeOneFromStack(s: Stack): [Stack | undefined, Stack] {
  if (s.count <= 1) return [undefined, { id: s.id, count: 1 }];
  return [
    { id: s.id, count: s.count - 1 },
    { id: s.id, count: 1 },
  ];
}
