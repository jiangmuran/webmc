export interface FoxFamily {
  trustedPlayers: string[];
  bornFromTame: boolean;
}

export function inheritsTrust(parents: FoxFamily[], child: FoxFamily): FoxFamily {
  const merged = new Set<string>();
  for (const p of parents) for (const id of p.trustedPlayers) merged.add(id);
  return { ...child, trustedPlayers: Array.from(merged), bornFromTame: true };
}

export function willNotFleeFrom(fox: FoxFamily, playerId: string): boolean {
  return fox.trustedPlayers.includes(playerId);
}
