export function formatScore(score: number): string {
  if (score >= 1_000_000) return `${(score / 1_000_000).toFixed(1)}M`;
  if (score >= 1_000) return `${(score / 1_000).toFixed(1)}k`;
  return score.toString();
}

export function abbreviated(n: number): string {
  return formatScore(Math.max(0, Math.floor(n)));
}

export function colorForRank(rank: number): string {
  if (rank === 1) return 'gold';
  if (rank === 2) return 'silver';
  if (rank === 3) return 'bronze';
  return 'gray';
}
