// Sniffer digging behavior. The sniffer wanders; when its AI decides to
// dig (cooldown-gated), it animates a dig over ~6 seconds and then
// places a random seed at the dig location. Torchflower seeds are
// primary; pitcher pod is rarer.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export type DigPhase = 'wandering' | 'sniffing' | 'digging' | 'rising';

export interface SnifferDigState {
  phase: DigPhase;
  phaseElapsedSec: number;
  cooldownSec: number;
  digCenter: Vec3 | null;
}

export function makeSnifferDig(): SnifferDigState {
  return {
    phase: 'wandering',
    phaseElapsedSec: 0,
    cooldownSec: 0,
    digCenter: null,
  };
}

const SNIFF_SEC = 3;
const DIG_SEC = 6;
const RISE_SEC = 1;
// Wiki (minecraft.wiki/w/Sniffer): "After sniffing out seeds, an
// eight-minute cooldown is activated before it can search again."
// Old constant 120 s (2 min) was 4× too short.
const COOLDOWN_SEC = 480;

export interface SnifferTickCtx {
  onDiggableBlock: boolean;
  playerScared: boolean;
  dtSec: number;
  position: Vec3;
}

export interface SnifferTickResult {
  phaseChanged: boolean;
  seedPlaced: 'webmc:torchflower_seeds' | 'webmc:pitcher_pod' | null;
  seedPos: Vec3 | null;
  rng?: () => number;
}

export function tickSnifferDig(
  state: SnifferDigState,
  ctx: SnifferTickCtx,
  rng: () => number,
): SnifferTickResult {
  state.cooldownSec = Math.max(0, state.cooldownSec - ctx.dtSec);
  state.phaseElapsedSec += ctx.dtSec;

  if (ctx.playerScared && state.phase !== 'wandering') {
    state.phase = 'wandering';
    state.phaseElapsedSec = 0;
    state.digCenter = null;
    return { phaseChanged: true, seedPlaced: null, seedPos: null };
  }

  switch (state.phase) {
    case 'wandering': {
      if (state.cooldownSec > 0 || !ctx.onDiggableBlock) {
        return { phaseChanged: false, seedPlaced: null, seedPos: null };
      }
      state.phase = 'sniffing';
      state.phaseElapsedSec = 0;
      return { phaseChanged: true, seedPlaced: null, seedPos: null };
    }
    case 'sniffing': {
      if (state.phaseElapsedSec >= SNIFF_SEC) {
        state.phase = 'digging';
        state.phaseElapsedSec = 0;
        state.digCenter = { ...ctx.position };
        return { phaseChanged: true, seedPlaced: null, seedPos: null };
      }
      return { phaseChanged: false, seedPlaced: null, seedPos: null };
    }
    case 'digging': {
      if (state.phaseElapsedSec >= DIG_SEC) {
        state.phase = 'rising';
        state.phaseElapsedSec = 0;
        // Wiki: "with an equal chance of digging up either one"
        // (torchflower seeds vs pitcher pod). Old code used 15/85
        // pitcher-rare split, but the wiki says 50/50.
        const seed = rng() < 0.5 ? 'webmc:pitcher_pod' : 'webmc:torchflower_seeds';
        const pos = state.digCenter;
        state.digCenter = null;
        return { phaseChanged: true, seedPlaced: seed, seedPos: pos };
      }
      return { phaseChanged: false, seedPlaced: null, seedPos: null };
    }
    case 'rising': {
      if (state.phaseElapsedSec >= RISE_SEC) {
        state.phase = 'wandering';
        state.phaseElapsedSec = 0;
        state.cooldownSec = COOLDOWN_SEC;
        return { phaseChanged: true, seedPlaced: null, seedPos: null };
      }
      return { phaseChanged: false, seedPlaced: null, seedPos: null };
    }
  }
}

// Sniffable surfaces: grass_block, podzol, dirt, coarse_dirt, mycelium,
// rooted_dirt, moss_block.
const SNIFFABLE = new Set<string>([
  'webmc:grass_block',
  'webmc:podzol',
  'webmc:dirt',
  'webmc:coarse_dirt',
  'webmc:mycelium',
  'webmc:rooted_dirt',
  'webmc:moss_block',
]);

export function isSniffable(blockId: string): boolean {
  return SNIFFABLE.has(blockId);
}
