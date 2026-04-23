import { describe, it, expect } from 'vitest';
import { platformAt, unlocksAfterFirstDragonKill, CLASSIC_FRAME_SIZE } from './exit_portal_spawn';

describe('exit portal spawn', () => {
  it('platform centered at origin', () => {
    const p = platformAt();
    expect(p.centerX).toBe(0);
    expect(p.centerZ).toBe(0);
  });

  it('frame size 5', () => {
    expect(platformAt().bedrockFrameSize).toBe(CLASSIC_FRAME_SIZE);
  });

  it('portal inside', () => {
    expect(platformAt().endPortalInside).toBe(true);
  });

  it('active after first kill', () => {
    expect(unlocksAfterFirstDragonKill()).toBe(true);
  });
});
