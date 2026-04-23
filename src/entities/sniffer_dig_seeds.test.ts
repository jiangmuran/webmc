import { describe, it, expect } from 'vitest';
import { shouldStartDigging, dropsOnComplete } from './sniffer_dig_seeds';

describe('sniffer dig seeds', () => {
  it('sniffing digs with luck', () => {
    expect(shouldStartDigging({ currentTask: 'sniff', taskTicks: 0 }, () => 0)).toBe(true);
  });

  it('idle does not dig', () => {
    expect(shouldStartDigging({ currentTask: 'idle', taskTicks: 0 }, () => 0)).toBe(false);
  });

  it('drops known seed', () => {
    expect(['torchflower_seeds', 'pitcher_pod']).toContain(dropsOnComplete(() => 0.5));
  });
});
