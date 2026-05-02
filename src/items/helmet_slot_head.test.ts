import { describe, it, expect } from 'vitest';
import { isHeadWearable, protectionFromHelmet, conduitWaterBreathing } from './helmet_slot_head';

describe('helmet slot head', () => {
  it('leather helmet wearable', () => {
    expect(isHeadWearable('leather_helmet')).toBe(true);
  });

  it('pumpkin as head', () => {
    expect(isHeadWearable('carved_pumpkin')).toBe(true);
  });

  it('sword not head', () => {
    expect(isHeadWearable('diamond_sword')).toBe(false);
  });

  it('diamond better protection', () => {
    expect(protectionFromHelmet('diamond_helmet')).toBeGreaterThan(
      protectionFromHelmet('leather_helmet'),
    );
  });

  it('non-helmet zero protection', () => {
    expect(protectionFromHelmet('carved_pumpkin')).toBe(0);
  });

  it('turtle grants water breathing', () => {
    expect(conduitWaterBreathing('turtle_helmet')).toBe(true);
  });

  it('turtle_shell (webmc registry name) also wearable + WB', () => {
    // Wiki: Java ID is turtle_helmet, Bedrock ID is turtle_shell;
    // webmc main.ts registers `webmc:turtle_shell` so both spellings
    // must resolve. Head slot + protection + water-breathing all need
    // to accept the registry name.
    expect(isHeadWearable('turtle_shell')).toBe(true);
    expect(protectionFromHelmet('turtle_shell')).toBe(2);
    expect(conduitWaterBreathing('turtle_shell')).toBe(true);
  });
});
