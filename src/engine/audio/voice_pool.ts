// Audio voice pool. Fixed max simultaneous voices; when exhausted,
// the lowest-priority voice is stolen.

export interface Voice {
  id: number;
  priority: number; // higher = more important
  startedAtMs: number;
  key: string; // e.g. 'footstep:grass'
}

export interface VoicePool {
  voices: Voice[];
  maxVoices: number;
  nextId: number;
}

export function makePool(maxVoices = 32): VoicePool {
  return { voices: [], maxVoices, nextId: 1 };
}

export function play(p: VoicePool, priority: number, key: string, nowMs: number): Voice | null {
  if (p.voices.length >= p.maxVoices) {
    const stealable = p.voices.filter((v) => v.priority <= priority);
    if (stealable.length === 0) return null;
    // steal the oldest with lowest priority
    const victim = [...stealable].sort(
      (a, b) => a.priority - b.priority || a.startedAtMs - b.startedAtMs,
    )[0];
    if (!victim) return null;
    p.voices = p.voices.filter((v) => v.id !== victim.id);
  }
  const voice: Voice = { id: p.nextId++, priority, startedAtMs: nowMs, key };
  p.voices.push(voice);
  return voice;
}

export function stop(p: VoicePool, id: number): boolean {
  const before = p.voices.length;
  p.voices = p.voices.filter((v) => v.id !== id);
  return p.voices.length < before;
}

export function activeCount(p: VoicePool): number {
  return p.voices.length;
}
