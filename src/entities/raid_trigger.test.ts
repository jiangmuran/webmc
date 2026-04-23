import { describe, it, expect } from 'vitest';
import { shouldStartRaid, omenAmplifierToRaidBadness, consumeBadOmenOnStart } from './raid_trigger';

const base = {
  playerHasBadOmen: true,
  insideVillage: true,
  alreadyRaiding: false,
  dimension: 'overworld',
};

describe('raid trigger', () => {
  it('triggers canonical', () => {
    expect(shouldStartRaid(base)).toBe(true);
  });

  it('no omen no raid', () => {
    expect(shouldStartRaid({ ...base, playerHasBadOmen: false })).toBe(false);
  });

  it('already raiding skip', () => {
    expect(shouldStartRaid({ ...base, alreadyRaiding: true })).toBe(false);
  });

  it('nether no raid', () => {
    expect(shouldStartRaid({ ...base, dimension: 'nether' })).toBe(false);
  });

  it('amplifier to badness', () => {
    expect(omenAmplifierToRaidBadness(3)).toBe(3);
  });

  it('consumes bad omen', () => {
    expect(consumeBadOmenOnStart()).toBe(true);
  });
});
