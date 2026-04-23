export interface ServerList {
  stun: string[];
  turn: { url: string; username: string; credential: string }[];
}

export function iceServers(
  list: ServerList,
): { urls: string | string[]; username?: string; credential?: string }[] {
  const out: { urls: string | string[]; username?: string; credential?: string }[] = [];
  for (const s of list.stun) out.push({ urls: s });
  for (const t of list.turn) {
    out.push({ urls: t.url, username: t.username, credential: t.credential });
  }
  return out;
}

export function hasTurnCredentials(list: ServerList): boolean {
  return list.turn.length > 0;
}
