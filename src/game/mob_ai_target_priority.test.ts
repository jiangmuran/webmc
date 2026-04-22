import { describe, it, expect } from 'vitest';
import {
  scoreCandidate,
  pickTarget,
  shouldForget,
  FORGET_THRESHOLD_MS,
} from './mob_ai_target_priority';

const base = {
  id: 'x',
  distance: 5,
  lastSeenMsAgo: 0,
  isHostileToMe: false,
  isOwnerOfMe: false,
  hasAttackedMeRecently: false,
};

describe('target priority', () => {
  it('attacker wins', () => {
    const t = pickTarget([
      { ...base, id: 'a' },
      { ...base, id: 'b', hasAttackedMeRecently: true },
    ]);
    expect(t?.id).toBe('b');
  });

  it('owner never picked', () => {
    const t = pickTarget([
      { ...base, id: 'owner', isOwnerOfMe: true, hasAttackedMeRecently: true },
    ]);
    expect(scoreCandidate({ ...base, id: 'owner', isOwnerOfMe: true })).toBeLessThan(0);
    expect(t?.id).toBe('owner'); // only candidate
  });

  it('closer preferred when tied', () => {
    const t = pickTarget([
      { ...base, id: 'far', distance: 20 },
      { ...base, id: 'near', distance: 2 },
    ]);
    expect(t?.id).toBe('near');
  });

  it('forget threshold', () => {
    expect(shouldForget({ ...base, lastSeenMsAgo: FORGET_THRESHOLD_MS + 1 })).toBe(true);
    expect(shouldForget({ ...base, lastSeenMsAgo: 100 })).toBe(false);
  });
});
