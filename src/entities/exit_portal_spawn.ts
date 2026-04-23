export interface Platform {
  centerX: number;
  centerY: number;
  centerZ: number;
  bedrockFrameSize: number;
  endPortalInside: boolean;
}

export const CLASSIC_FRAME_SIZE = 5;

export function platformAt(): Platform {
  return {
    centerX: 0,
    centerY: 63,
    centerZ: 0,
    bedrockFrameSize: CLASSIC_FRAME_SIZE,
    endPortalInside: true,
  };
}

export function unlocksAfterFirstDragonKill(): boolean {
  return true;
}
