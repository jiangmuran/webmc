// Offline / LAN mode. Skips online signaling; allows local-only
// singleplayer worlds without network.

export interface OfflineCtx {
  networkAvailable: boolean;
  userPreferOffline: boolean;
  hasLocalWorld: boolean;
}

export function effectiveMode(c: OfflineCtx): 'offline' | 'online' | 'unavailable' {
  if (c.userPreferOffline) return 'offline';
  if (!c.networkAvailable) return c.hasLocalWorld ? 'offline' : 'unavailable';
  return 'online';
}

export function canStartSingleplayer(c: OfflineCtx): boolean {
  return c.hasLocalWorld;
}

export function shouldPromptOfflineMessage(c: OfflineCtx): boolean {
  return !c.networkAvailable && !c.hasLocalWorld;
}
