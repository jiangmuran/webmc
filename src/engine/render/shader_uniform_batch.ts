export interface Uniform {
  name: string;
  value: number | number[];
}

export interface Batch {
  uniforms: Record<string, number | number[]>;
}

export function apply(batch: Batch, u: Uniform): Batch {
  const existing = batch.uniforms[u.name];
  if (
    existing !== undefined &&
    JSON.stringify(existing) === JSON.stringify(u.value)
  ) {
    return batch;
  }
  return { uniforms: { ...batch.uniforms, [u.name]: u.value } };
}

export function clear(): Batch {
  return { uniforms: {} };
}

export function diffCount(prev: Batch, next: Batch): number {
  let d = 0;
  for (const k of Object.keys(next.uniforms)) {
    if (JSON.stringify(prev.uniforms[k]) !== JSON.stringify(next.uniforms[k])) d++;
  }
  return d;
}
