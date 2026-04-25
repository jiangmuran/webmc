#!/usr/bin/env -S node --experimental-strip-types
import { writeFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';
import { resolve } from 'node:path';
import { encodeNbt } from '../../src/persist/nbt_encode';
import { decodeNbt, type NbtRoot } from '../../src/persist/nbt_decode';
import type { NbtValue } from '../../src/persist/nbt_compound';

interface BenchResult {
  name: string;
  iterations: number;
  totalMs: number;
  p50Ms: number;
  p95Ms: number;
  meanMs: number;
  byteSize: number;
}

function pct(samples: number[], p: number): number {
  const sorted = [...samples].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
  return sorted[idx] ?? 0;
}

function runBench(name: string, iters: number, fn: () => number): BenchResult {
  // Warm-up.
  for (let i = 0; i < 8; i++) fn();
  const samples: number[] = [];
  let byteSize = 0;
  const start = performance.now();
  for (let i = 0; i < iters; i++) {
    const t0 = performance.now();
    byteSize = fn();
    samples.push(performance.now() - t0);
  }
  const totalMs = performance.now() - start;
  return {
    name,
    iterations: iters,
    totalMs,
    p50Ms: pct(samples, 50),
    p95Ms: pct(samples, 95),
    meanMs: totalMs / iters,
    byteSize,
  };
}

// Build a "level.dat-shaped" NBT compound: ~30 fields, mix of types.
function makeLevelDatShaped(): NbtRoot {
  const data: Record<string, NbtValue> = {};
  for (let i = 0; i < 12; i++) data[`int${i}`] = { type: 'int', value: i * 7919 };
  for (let i = 0; i < 6; i++) data[`long${i}`] = { type: 'long', value: BigInt(i) * 1234567n };
  for (let i = 0; i < 8; i++) data[`name${i}`] = { type: 'string', value: `webmc:block_${i}` };
  data['Difficulty'] = { type: 'byte', value: 2 };
  data['hardcore'] = { type: 'byte', value: 0 };
  data['DayTime'] = { type: 'long', value: 6000n };
  data['Time'] = { type: 'long', value: 24000n };
  data['SpawnX'] = { type: 'int', value: 100 };
  data['SpawnY'] = { type: 'int', value: 70 };
  data['SpawnZ'] = { type: 'int', value: -50 };
  data['intArr'] = { type: 'intArray', value: Int32Array.from({ length: 64 }, (_, i) => i) };
  data['longArr'] = {
    type: 'longArray',
    value: BigInt64Array.from({ length: 32 }, (_, i) => BigInt(i)),
  };
  return {
    name: '',
    value: { type: 'compound', value: { Data: { type: 'compound', value: data } } },
  };
}

// Build a section-shaped chunk: 16-entry palette compound list + 256-entry longArray.
function makeChunkShaped(): NbtRoot {
  const palette: NbtValue[] = [];
  for (let i = 0; i < 16; i++) {
    palette.push({
      type: 'compound',
      value: { Name: { type: 'string', value: `minecraft:block_${i}` } },
    });
  }
  const data = BigInt64Array.from({ length: 256 }, (_, i) => BigInt(i & 0xff));
  return {
    name: '',
    value: {
      type: 'compound',
      value: {
        sections: {
          type: 'list',
          value: [
            {
              type: 'compound',
              value: {
                Y: { type: 'int', value: 0 },
                block_states: {
                  type: 'compound',
                  value: {
                    palette: { type: 'list', value: palette },
                    data: { type: 'longArray', value: data },
                  },
                },
              },
            },
          ],
        },
      },
    },
  };
}

function main(): void {
  const ITERS = 500;
  const levelRoot = makeLevelDatShaped();
  const levelBytes = encodeNbt(levelRoot);
  const chunkRoot = makeChunkShaped();
  const chunkBytes = encodeNbt(chunkRoot);

  const results: BenchResult[] = [
    runBench('decode level.dat-shaped', ITERS, () => {
      decodeNbt(levelBytes);
      return levelBytes.length;
    }),
    runBench('encode level.dat-shaped', ITERS, () => {
      const out = encodeNbt(levelRoot);
      return out.length;
    }),
    runBench('decode chunk-shaped', ITERS, () => {
      decodeNbt(chunkBytes);
      return chunkBytes.length;
    }),
    runBench('encode chunk-shaped', ITERS, () => {
      const out = encodeNbt(chunkRoot);
      return out.length;
    }),
  ];

  console.log('NBT bench results');
  console.log('-----------------');
  for (const r of results) {
    console.log(
      `${r.name}: p50=${r.p50Ms.toFixed(3)}ms p95=${r.p95Ms.toFixed(3)}ms mean=${r.meanMs.toFixed(3)}ms (${String(r.byteSize)} bytes)`,
    );
  }
  const out = resolve(import.meta.dirname, 'nbt-bench.results.json');
  writeFileSync(
    out,
    JSON.stringify({ timestampISO: new Date().toISOString(), iters: ITERS, results }, null, 2),
  );
  console.log(`Wrote ${out}`);
}

main();
