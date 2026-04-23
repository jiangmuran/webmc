import { describe, it, expect } from 'vitest';
import { effectiveMode, canStartSingleplayer, shouldPromptOfflineMessage } from './offline_mode';

describe('offline mode', () => {
  it('online if available', () => {
    expect(
      effectiveMode({ networkAvailable: true, userPreferOffline: false, hasLocalWorld: true }),
    ).toBe('online');
  });

  it('offline if user wants', () => {
    expect(
      effectiveMode({ networkAvailable: true, userPreferOffline: true, hasLocalWorld: true }),
    ).toBe('offline');
  });

  it('unavailable without world or net', () => {
    expect(
      effectiveMode({ networkAvailable: false, userPreferOffline: false, hasLocalWorld: false }),
    ).toBe('unavailable');
  });

  it('singleplayer needs world', () => {
    expect(
      canStartSingleplayer({
        networkAvailable: false,
        userPreferOffline: false,
        hasLocalWorld: false,
      }),
    ).toBe(false);
  });

  it('prompt when stuck', () => {
    expect(
      shouldPromptOfflineMessage({
        networkAvailable: false,
        userPreferOffline: false,
        hasLocalWorld: false,
      }),
    ).toBe(true);
  });
});
