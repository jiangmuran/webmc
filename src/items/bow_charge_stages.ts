export type PullStage = 'none' | 'pulling_0' | 'pulling_1' | 'pulling_2';

export const STAGE_1_TICKS = 0;
export const STAGE_2_TICKS = 4;
export const STAGE_3_TICKS = 13;

export function stageFor(holdTicks: number, pulling: boolean): PullStage {
  if (!pulling) return 'none';
  if (holdTicks >= STAGE_3_TICKS) return 'pulling_2';
  if (holdTicks >= STAGE_2_TICKS) return 'pulling_1';
  return 'pulling_0';
}

export function animationFrame(s: PullStage): number {
  switch (s) {
    case 'none':
      return 0;
    case 'pulling_0':
      return 1;
    case 'pulling_1':
      return 2;
    case 'pulling_2':
      return 3;
  }
}
