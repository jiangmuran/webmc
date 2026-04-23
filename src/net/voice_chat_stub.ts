export interface VoicePacket {
  speakerId: string;
  sampleRate: number;
  frameMs: number;
  payload: Uint8Array;
}

export function isValidFrame(p: VoicePacket): boolean {
  if (p.frameMs <= 0 || p.frameMs > 100) return false;
  if (p.sampleRate !== 48000 && p.sampleRate !== 24000) return false;
  if (p.payload.byteLength === 0) return false;
  return true;
}

export function spatialGainForDistance(distance: number, radius: number): number {
  if (distance < 0 || radius <= 0) return 0;
  if (distance >= radius) return 0;
  return 1 - distance / radius;
}
