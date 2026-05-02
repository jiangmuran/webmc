import { describe, it, expect } from 'vitest';
import { parseLevelDat } from './level_dat_fields';

function strBytes(s: string): number[] {
  const enc = new TextEncoder().encode(s);
  return [0, enc.length, ...enc];
}

function i32be(n: number): number[] {
  return [(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff];
}

function i64be(n: bigint): number[] {
  const b = new Uint8Array(8);
  new DataView(b.buffer).setBigInt64(0, n, false);
  return Array.from(b);
}

describe('parseLevelDat', () => {
  it('extracts spawn, time, difficulty from a synthetic level.dat NBT', () => {
    // root: COMPOUND ""
    //   "Data": COMPOUND
    //     "SpawnX": INT 100
    //     "SpawnY": INT 70
    //     "SpawnZ": INT -50
    //     "Time": LONG 24000
    //     "DayTime": LONG 6000
    //     "Difficulty": BYTE 2 (normal)
    //     "hardcore": BYTE 1
    //     "RandomSeed": LONG 42
    //   END
    // END
    const bytes = new Uint8Array([
      10,
      ...strBytes(''),
      10,
      ...strBytes('Data'),
      3,
      ...strBytes('SpawnX'),
      ...i32be(100),
      3,
      ...strBytes('SpawnY'),
      ...i32be(70),
      3,
      ...strBytes('SpawnZ'),
      ...i32be(-50 >>> 0),
      4,
      ...strBytes('Time'),
      ...i64be(24000n),
      4,
      ...strBytes('DayTime'),
      ...i64be(6000n),
      1,
      ...strBytes('Difficulty'),
      2,
      1,
      ...strBytes('hardcore'),
      1,
      4,
      ...strBytes('RandomSeed'),
      ...i64be(42n),
      0, // end Data
      0, // end root
    ]);
    const f = parseLevelDat(bytes);
    expect(f.spawnX).toBe(100);
    expect(f.spawnY).toBe(70);
    expect(f.spawnZ).toBe(-50);
    expect(f.gameTime).toBe(24000);
    expect(f.dayTime).toBe(6000);
    expect(f.difficulty).toBe('normal');
    expect(f.hardcore).toBe(true);
    expect(f.seed).toBe('42');
    expect(f.generatorName).toBe('webmc_default');
  });

  it('falls back to defaults when fields are missing', () => {
    // root: COMPOUND "" with empty Data
    const bytes = new Uint8Array([10, ...strBytes(''), 10, ...strBytes('Data'), 0, 0]);
    const f = parseLevelDat(bytes);
    expect(f.spawnY).toBe(64);
    expect(f.difficulty).toBe('normal');
    expect(f.seed).toBe('0');
  });
});
