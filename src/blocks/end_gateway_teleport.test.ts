import { describe, it, expect } from 'vitest';
import {
  targetFor,
  canUse,
  use,
  GATEWAY_COOLDOWN_TICKS,
  OUTER_THRESHOLD,
} from './end_gateway_teleport';

describe('end gateway', () => {
  it('inner projects outward', () => {
    const t = targetFor({ centerX: 0, centerZ: 0, throwerX: 10, throwerZ: 0 });
    expect(t.x).toBe(1024);
  });

  it('beyond threshold returns home', () => {
    const t = targetFor({
      centerX: 0,
      centerZ: 0,
      throwerX: OUTER_THRESHOLD + 10,
      throwerZ: 0,
    });
    expect(t.x).toBe(0);
  });

  it('cooldown gate', () => {
    const s = { lastUseTick: 0 };
    use(s, 0);
    expect(canUse(s, 10)).toBe(false);
    expect(canUse(s, GATEWAY_COOLDOWN_TICKS + 1)).toBe(true);
  });
});
