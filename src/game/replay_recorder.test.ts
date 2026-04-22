import { describe, it, expect } from 'vitest';
import {
  decodeReplay,
  encodeReplay,
  ReplayRecorder,
  sliceLast,
  type ReplayFrame,
} from './replay_recorder';

function frame(tsMs: number): ReplayFrame {
  return {
    tsMs,
    playerPos: { x: 0, y: 64, z: 0 },
    playerYaw: 0,
    playerPitch: 0,
    currentHealth: 20,
    heldItem: null,
    action: 'idle',
  };
}

describe('replay recorder', () => {
  it('respects sample interval', () => {
    const r = new ReplayRecorder({ bufferSec: 10, sampleHz: 10 });
    r.observe(frame(0));
    r.observe(frame(50)); // within 100ms → skipped
    expect(r.size).toBe(1);
  });

  it('drops old frames past buffer', () => {
    const r = new ReplayRecorder({ bufferSec: 1, sampleHz: 10 });
    for (let i = 0; i < 50; i++) r.observe(frame(i * 100));
    expect(r.size).toBeLessThanOrEqual(10);
  });

  it('pause/resume', () => {
    const r = new ReplayRecorder({ bufferSec: 10, sampleHz: 10 });
    r.pause();
    expect(r.observe(frame(0))).toBe(false);
    r.resume();
    expect(r.observe(frame(1000))).toBe(true);
  });

  it('sliceLast filters by time window', () => {
    const frames = [frame(0), frame(5000), frame(10_000), frame(20_000)];
    const clip = sliceLast(frames, 20_000, 15);
    expect(clip.length).toBe(3);
  });

  it('encode/decode round-trips', () => {
    const f = frame(100);
    const bytes = encodeReplay([f]);
    expect(decodeReplay(bytes)).toEqual([f]);
  });

  it('decode garbage = empty', () => {
    expect(decodeReplay('not json')).toEqual([]);
  });
});
