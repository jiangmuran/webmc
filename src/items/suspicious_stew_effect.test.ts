import { describe, it, expect } from 'vitest';
import { effectFromSource } from './suspicious_stew_effect';

describe('suspicious stew effect', () => {
  it('dandelion gives saturation', () => {
    expect(effectFromSource('dandelion').id).toBe('saturation');
  });

  it('wither rose gives wither', () => {
    expect(effectFromSource('wither_rose').id).toBe('wither');
  });

  it('all effects have positive duration', () => {
    expect(effectFromSource('poppy').durationTicks).toBeGreaterThan(0);
  });

  it('weakness duration is 140 ticks per wiki 24w45a', () => {
    expect(effectFromSource('tulip').durationTicks).toBe(140);
  });

  it('blindness duration is 220 ticks per wiki 24w45a', () => {
    expect(effectFromSource('azure_bluet').durationTicks).toBe(220);
  });

  it('poison duration is 220 ticks per wiki 24w45a', () => {
    expect(effectFromSource('lily_of_the_valley').durationTicks).toBe(220);
  });

  it('fire_resistance is 60 ticks per wiki 24w45a', () => {
    expect(effectFromSource('allium').durationTicks).toBe(60);
  });

  it('torchflower → night_vision (1.20 addition)', () => {
    // Wiki minecraft.wiki/w/Suspicious_Stew History 23w12a:
    // Torchflower added as a stew flower with the night-vision
    // effect (matching poppy).
    expect(effectFromSource('torchflower').id).toBe('night_vision');
  });

  it('open_eyeblossom → blindness, 220 ticks per wiki 24w46a', () => {
    expect(effectFromSource('open_eyeblossom').id).toBe('blindness');
    expect(effectFromSource('open_eyeblossom').durationTicks).toBe(220);
  });

  it('closed_eyeblossom → nausea (1.21.4 addition)', () => {
    expect(effectFromSource('closed_eyeblossom').id).toBe('nausea');
  });
});
