export interface PredictedInput {
  seq: number;
  tick: number;
  dx: number;
  dz: number;
}

export interface ClientState {
  serverX: number;
  serverZ: number;
  localX: number;
  localZ: number;
  unacked: PredictedInput[];
}

export function applyServerPos(
  c: ClientState,
  serverX: number,
  serverZ: number,
  ackedSeq: number,
): ClientState {
  const remaining = c.unacked.filter((u) => u.seq > ackedSeq);
  const simX = remaining.reduce((a, b) => a + b.dx, serverX);
  const simZ = remaining.reduce((a, b) => a + b.dz, serverZ);
  return {
    serverX,
    serverZ,
    localX: simX,
    localZ: simZ,
    unacked: remaining,
  };
}

export function pushInput(c: ClientState, input: PredictedInput): ClientState {
  return {
    ...c,
    unacked: [...c.unacked, input],
    localX: c.localX + input.dx,
    localZ: c.localZ + input.dz,
  };
}
