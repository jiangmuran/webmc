export interface FangSummonInput {
  casterX: number;
  casterZ: number;
  targetX: number;
  targetZ: number;
  patternLength: number;
}

export interface FangPos {
  x: number;
  z: number;
  delayTicks: number;
}

export function fangLine(i: FangSummonInput): readonly FangPos[] {
  const dx = i.targetX - i.casterX;
  const dz = i.targetZ - i.casterZ;
  const len = Math.hypot(dx, dz) || 1;
  const stepX = dx / len;
  const stepZ = dz / len;
  const fangs: FangPos[] = [];
  for (let k = 0; k < i.patternLength; k++) {
    fangs.push({
      x: i.casterX + stepX * k * 0.5,
      z: i.casterZ + stepZ * k * 0.5,
      delayTicks: k * 2,
    });
  }
  return fangs;
}

export function fangCircle(i: FangSummonInput, count = 12): readonly FangPos[] {
  const fangs: FangPos[] = [];
  for (let k = 0; k < count; k++) {
    const angle = (k / count) * Math.PI * 2;
    fangs.push({
      x: i.casterX + Math.cos(angle) * 2,
      z: i.casterZ + Math.sin(angle) * 2,
      delayTicks: 0,
    });
  }
  return fangs;
}
