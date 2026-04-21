#!/usr/bin/env -S node --experimental-strip-types
import { writeFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';
import { resolve } from 'node:path';
import { AIR, makeState } from '../../src/blocks/state';
import { SUBCHUNK_DIM, SUBCHUNK_VOLUME, SubChunk } from '../../src/world/SubChunk';
import { EMPTY_NEIGHBORS, meshSubChunk } from '../../src/world/meshing/greedy';

interface BenchResult {
  name: string;
  iterations: number;
  totalMs: number;
  p50Ms: number;
  p95Ms: number;
  p99Ms: number;
  meanMs: number;
  quadCount: number;
}

const STONE = makeState(1, 0);
const DIRT = makeState(2, 0);
const GRASS = makeState(3, 0);

const isOpaque = (s: number): boolean => s !== AIR;
const colorByState = (s: number): readonly [number, number, number] =>
  s === STONE ? [128, 128, 128] : s === DIRT ? [134, 96, 67] : [91, 153, 73];
const faceColorsByState = (s: number) => {
  const c = colorByState(s);
  return { top: c, bottom: c, side: c };
};

function uniformStone(): SubChunk {
  return new SubChunk(STONE);
}

function halfFullSolid(): SubChunk {
  const sc = new SubChunk();
  for (let y = 0; y < SUBCHUNK_DIM / 2; y++) {
    for (let z = 0; z < SUBCHUNK_DIM; z++) {
      for (let x = 0; x < SUBCHUNK_DIM; x++) {
        sc.set(x, y, z, y < 4 ? STONE : y < 6 ? DIRT : GRASS);
      }
    }
  }
  return sc;
}

function scattered(): SubChunk {
  const sc = new SubChunk();
  for (let i = 0; i < SUBCHUNK_VOLUME / 3; i++) {
    const x = (i * 7) & 0xf;
    const y = (i * 13) & 0xf;
    const z = (i * 19) & 0xf;
    sc.set(x, y, z, [STONE, DIRT, GRASS][i % 3] ?? STONE);
  }
  return sc;
}

function measure(name: string, make: () => SubChunk, iterations = 100): BenchResult {
  const timings: number[] = [];
  let lastQuadCount = 0;
  for (let i = 0; i < iterations; i++) {
    const sc = make();
    const t0 = performance.now();
    const out = meshSubChunk({
      self: sc,
      neighbors: EMPTY_NEIGHBORS,
      isOpaque,
      faceColorsOf: faceColorsByState,
    });
    const t1 = performance.now();
    timings.push(t1 - t0);
    lastQuadCount = out.quadCount;
  }
  timings.sort((a, b) => a - b);
  const totalMs = timings.reduce((s, v) => s + v, 0);
  const p = (q: number): number =>
    timings[Math.min(timings.length - 1, Math.floor(q * timings.length))] ?? 0;
  return {
    name,
    iterations,
    totalMs,
    p50Ms: p(0.5),
    p95Ms: p(0.95),
    p99Ms: p(0.99),
    meanMs: totalMs / iterations,
    quadCount: lastQuadCount,
  };
}

function run(): void {
  const results: BenchResult[] = [
    measure('uniform stone', uniformStone),
    measure('half-full solid', halfFullSolid),
    measure('scattered', scattered),
  ];
  console.log('mesh bench results:');
  for (const r of results) {
    console.log(
      `  ${r.name.padEnd(18)}  p50=${r.p50Ms.toFixed(2)}ms  p95=${r.p95Ms.toFixed(2)}ms  ` +
        `p99=${r.p99Ms.toFixed(2)}ms  mean=${r.meanMs.toFixed(2)}ms  quads=${r.quadCount.toString()}`,
    );
  }
  const outPath = resolve(process.cwd(), 'tests/perf/mesh-bench.results.json');
  writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`wrote ${outPath}`);

  const failed = results.filter((r) => r.p95Ms > 20);
  if (failed.length > 0) {
    console.error(
      `FAIL: ${failed.length.toString()} scenario(s) exceeded 20ms p95 budget: ${failed.map((r) => r.name).join(', ')}`,
    );
    process.exit(1);
  }
}

run();
