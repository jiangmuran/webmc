# Performance Benchmarks

Per `docs/STANDARDS.md §5`, webmc's perf budgets are CI-enforced. Benchmarks here run deterministic workloads and emit p50/p95/p99 timings as JSON. CI diffs against the previous commit's JSON and fails on > 20 % p95 regression per metric.

Run locally:

```
npm run bench:mesh
```

Writes `tests/perf/mesh-bench.results.json`. Commit results only when they improve; regressions must be explained in the commit body.

Scenarios (all 16³ subchunks):

| Name            | Shape                                   | Purpose                                       |
| --------------- | --------------------------------------- | --------------------------------------------- |
| uniform stone   | 4096 stone voxels                       | Best case: one palette entry, 6 merged quads. |
| half-full solid | Bottom half stone/dirt/grass layered    | Realistic terrain slab with color variety.    |
| scattered       | ~1365 voxels at pseudo-random positions | Worst case: maximum separate quads.           |

Budget (from `docs/STANDARDS.md §5`): p95 ≤ 20 ms per 16³ chunk mesh on desktop. The bench aborts with a non-zero exit if any scenario exceeds budget.
