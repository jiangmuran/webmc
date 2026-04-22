// Background music DJ. Picks tracks appropriate to the player's current
// context (overworld-daytime, overworld-night, nether, end, menu,
// underwater). Tracks have cooldowns so the same one doesn't repeat in
// a short window.

export type MusicContext =
  | 'menu'
  | 'creative'
  | 'overworld_day'
  | 'overworld_night'
  | 'nether'
  | 'end'
  | 'underwater'
  | 'end_dragon_fight'
  | 'wither_fight';

export interface MusicTrack {
  readonly id: string;
  readonly contexts: readonly MusicContext[];
  readonly durationSec: number;
  readonly minGapSec: number; // per-track gap before repeat
}

export interface DjState {
  currentTrackId: string | null;
  currentTrackStartedSec: number;
  nextTrackAtSec: number;
  lastPlayedSec: Map<string, number>;
}

export function makeDjState(): DjState {
  return {
    currentTrackId: null,
    currentTrackStartedSec: 0,
    nextTrackAtSec: 0,
    lastPlayedSec: new Map(),
  };
}

export interface DjTickCtx {
  context: MusicContext;
  nowSec: number;
  rng: () => number;
  library: readonly MusicTrack[];
}

export interface DjPlayDecision {
  startTrackId: string | null;
  fadeOutCurrent: boolean;
}

export function tickDj(state: DjState, ctx: DjTickCtx): DjPlayDecision {
  // If current track finished + gap elapsed, pick a new one.
  if (ctx.nowSec >= state.nextTrackAtSec) {
    const candidates = ctx.library.filter((t) => t.contexts.includes(ctx.context));
    if (candidates.length === 0) return { startTrackId: null, fadeOutCurrent: false };
    // Filter out recently-played.
    const fresh = candidates.filter((t) => {
      const last = state.lastPlayedSec.get(t.id);
      if (last === undefined) return true;
      return ctx.nowSec - last >= t.minGapSec;
    });
    const pool = fresh.length > 0 ? fresh : candidates;
    const track = pool[Math.floor(ctx.rng() * pool.length)];
    if (!track) return { startTrackId: null, fadeOutCurrent: false };
    const fadeOut = state.currentTrackId !== null && state.currentTrackId !== track.id;
    state.currentTrackId = track.id;
    state.currentTrackStartedSec = ctx.nowSec;
    state.nextTrackAtSec = ctx.nowSec + track.durationSec + 30 + ctx.rng() * 120;
    state.lastPlayedSec.set(track.id, ctx.nowSec);
    return { startTrackId: track.id, fadeOutCurrent: fadeOut };
  }
  return { startTrackId: null, fadeOutCurrent: false };
}

// Context switch interrupts current track with fade-out (e.g. walking
// into the nether).
export function onContextChange(state: DjState, ctx: DjTickCtx): DjPlayDecision {
  if (state.currentTrackId !== null) {
    state.currentTrackId = null;
    state.nextTrackAtSec = ctx.nowSec;
    return { startTrackId: null, fadeOutCurrent: true };
  }
  return { startTrackId: null, fadeOutCurrent: false };
}
