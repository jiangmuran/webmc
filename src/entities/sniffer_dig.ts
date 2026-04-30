// Sniffer. Occasionally sniffs, then digs up an ancient seed (torchflower
// or pitcher plant) from a valid grass/dirt block. Dig takes 8s.

export type SnifferPhase = 'idle' | 'sniffing' | 'digging';

export interface Sniffer {
  phase: SnifferPhase;
  phaseEndTick: number;
}

export const SNIFF_TICKS = 400; // 20s
export const DIG_TICKS = 160; // 8s
// Wiki (minecraft.wiki/w/Sniffer): "After sniffing out seeds, an
// eight-minute cooldown is activated before it can search again."
// 8 min = 9600 ticks. Old constant was 1200 (1 min) — 8× too short.
export const SNIFF_COOLDOWN_TICKS = 9600;

export function makeSniffer(): Sniffer {
  return { phase: 'idle', phaseEndTick: 0 };
}

export interface TickQuery {
  nowTick: number;
  onValidSoil: boolean;
  rand: () => number;
}

export interface TickResult {
  startedSniff: boolean;
  dugSeed: 'webmc:torchflower_seeds' | 'webmc:pitcher_pod' | null;
}

export function tickSniffer(s: Sniffer, q: TickQuery): TickResult {
  if (s.phase === 'idle') {
    if (q.onValidSoil && q.rand() < 0.001) {
      s.phase = 'sniffing';
      s.phaseEndTick = q.nowTick + SNIFF_TICKS;
      return { startedSniff: true, dugSeed: null };
    }
  } else if (s.phase === 'sniffing') {
    if (q.nowTick >= s.phaseEndTick) {
      s.phase = 'digging';
      s.phaseEndTick = q.nowTick + DIG_TICKS;
    }
  } else {
    if (q.nowTick >= s.phaseEndTick) {
      s.phase = 'idle';
      const seed: 'webmc:torchflower_seeds' | 'webmc:pitcher_pod' =
        q.rand() < 0.5 ? 'webmc:torchflower_seeds' : 'webmc:pitcher_pod';
      return { startedSniff: false, dugSeed: seed };
    }
  }
  return { startedSniff: false, dugSeed: null };
}
