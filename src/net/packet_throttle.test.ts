import { describe, it, expect } from 'vitest';
import { DEFAULT_THROTTLE, makeBytesBucket, PacketThrottle, tryConsume } from './packet_throttle';

describe('bytes bucket', () => {
  it('starts at burst capacity', () => {
    const b = makeBytesBucket({ bytesPerSec: 100, burstCapacityBytes: 500 });
    expect(b.bytesAvailable).toBe(500);
  });

  it('consume fails past capacity', () => {
    const b = makeBytesBucket({ bytesPerSec: 100, burstCapacityBytes: 50 }, 0);
    tryConsume(b, 50, 0);
    expect(tryConsume(b, 1, 0)).toBe(false);
  });

  it('refills over time', () => {
    const b = makeBytesBucket({ bytesPerSec: 100, burstCapacityBytes: 100 }, 0);
    tryConsume(b, 100, 0);
    tryConsume(b, 0, 0.5); // just refill
    expect(b.bytesAvailable).toBe(50);
  });
});

describe('packet throttle', () => {
  it('allows under budget', () => {
    const t = new PacketThrottle(DEFAULT_THROTTLE);
    expect(t.allowSend('p1', 1024, 0)).toBe(true);
  });

  it('rejects over budget', () => {
    const t = new PacketThrottle({ bytesPerSec: 10, burstCapacityBytes: 10 });
    t.allowSend('p1', 10, 0);
    expect(t.allowSend('p1', 1, 0)).toBe(false);
  });

  it('forget peer clears', () => {
    const t = new PacketThrottle({ bytesPerSec: 100, burstCapacityBytes: 100 });
    t.allowSend('p1', 50, 0);
    t.forget('p1');
    expect(t.availableFor('p1', 0)).toBe(100);
  });
});
