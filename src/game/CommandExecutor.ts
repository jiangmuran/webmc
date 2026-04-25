import type { GameMode } from './GameMode';

export interface CommandContext {
  playerPos: { x: number; y: number; z: number };
  setPlayerPos: (x: number, y: number, z: number) => void;
  gameMode: GameMode;
  setGameMode: (m: GameMode) => void;
  setTimeOfDay: (ticks: number) => void;
  addTimeOfDay?: (ticks: number) => void;
  setWeather: (w: 'clear' | 'rain' | 'thunder') => void;
  giveItem: (name: string, count: number) => boolean;
  broadcast: (line: string, color?: string) => void;
  knownGameModes: readonly GameMode[];
  knownItems: readonly string[];
  heal?: () => void;
  kill?: () => void;
  clearInventory?: () => void;
  setBlock?: (x: number, y: number, z: number, name: string) => boolean;
  fillBlocks?: (x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, name: string) => number;
  save?: () => void;
  showStats?: () => void;
  summon?: (kind: string, x: number, y: number, z: number) => boolean;
  openChest?: () => void;
  teleportSpawn?: () => void;
  seed?: () => number;
  killAllMobs?: () => number;
  particle?: (x: number, y: number, z: number) => void;
  listAchievements?: () => ReadonlyArray<{ title: string; unlocked: boolean }>;
  setDifficulty?: (level: 'peaceful' | 'easy' | 'normal' | 'hard') => void;
  playerName?: string;
  setSpawnHere?: () => void;
  clearChat?: () => void;
  toggleFly?: () => boolean;
  applyEffect?: (id: string, amplifier: number, durationSec: number) => void;
  clearEffects?: () => void;
}

export function executeCommand(raw: string, ctx: CommandContext): void {
  const command = raw.startsWith('/') ? raw.slice(1) : raw;
  const tokens = command.split(/\s+/).filter((t) => t.length > 0);
  const head = tokens[0]?.toLowerCase();
  const args = tokens.slice(1);
  if (head === undefined) {
    ctx.broadcast('empty command', '#ff8080');
    return;
  }
  if (head === 'me') {
    const action = args.join(' ');
    if (action) ctx.broadcast(`* ${ctx.playerName ?? 'You'} ${action}`, '#cccccc');
    return;
  }
  if (head === 'list') {
    ctx.broadcast(`Players online: 1 (${ctx.playerName ?? 'Player'})`, '#cccccc');
    return;
  }
  if (head === 'whoami') {
    ctx.broadcast(`You are ${ctx.playerName ?? 'Player'}`, '#cccccc');
    return;
  }
  if (head === 'help') {
    ctx.broadcast('/gamemode <survival|creative|adventure|spectator>', '#cccccc');
    ctx.broadcast('/tp <x> <y> <z>', '#cccccc');
    ctx.broadcast('/time set <day|night|noon|midnight|ticks>', '#cccccc');
    ctx.broadcast('/weather <clear|rain|thunder>', '#cccccc');
    ctx.broadcast('/give <item> [count]', '#cccccc');
    ctx.broadcast('/heal | /kill | /clear', '#cccccc');
    ctx.broadcast('/setblock <x> <y> <z> <block>', '#cccccc');
    ctx.broadcast('/fill <x1> <y1> <z1> <x2> <y2> <z2> <block>', '#cccccc');
    ctx.broadcast('/summon <kind> [x y z]', '#cccccc');
    ctx.broadcast('/chest | /spawn | /seed | /killall', '#cccccc');
    ctx.broadcast('/stats | /save | /setspawn | /clearchat', '#cccccc');
    ctx.broadcast('/me <action> | /list | /whoami | /fly', '#cccccc');
    ctx.broadcast('/effect <id> [s] [amp] | /particle [x y z]', '#cccccc');
    ctx.broadcast('/difficulty <peaceful|easy|normal|hard>', '#cccccc');
    ctx.broadcast('/achievements (/ach)', '#cccccc');
    return;
  }
  if (head === 'heal') {
    ctx.heal?.();
    ctx.broadcast('Healed.', '#80ff80');
    return;
  }
  if (head === 'kill') {
    ctx.kill?.();
    ctx.broadcast('RIP.', '#ff4040');
    return;
  }
  if (head === 'clear') {
    ctx.clearInventory?.();
    ctx.broadcast('Inventory cleared.', '#80ff80');
    return;
  }
  if (head === 'stats') {
    ctx.showStats?.();
    return;
  }
  if (head === 'chest') {
    ctx.openChest?.();
    return;
  }
  if (head === 'spawn') {
    ctx.teleportSpawn?.();
    ctx.broadcast('Teleported to spawn.', '#80ff80');
    return;
  }
  if (head === 'clearchat' || head === 'cc') {
    ctx.clearChat?.();
    return;
  }
  if (head === 'fly') {
    const flying = ctx.toggleFly?.();
    ctx.broadcast(`Fly: ${flying ? 'on' : 'off'}`, '#80ff80');
    return;
  }
  if (head === 'listeffects') {
    const all = ['regeneration', 'poison', 'instant_health', 'instant_damage',
      'night_vision', 'speed', 'slowness', 'jump_boost', 'fire_resistance',
      'water_breathing', 'invisibility', 'strength', 'resistance'];
    ctx.broadcast(`Effects: ${all.join(', ')}`, '#cccccc');
    return;
  }
  if (head === 'effect') {
    const id = args[0];
    if (id === 'clear' || id === 'none') {
      ctx.clearEffects?.();
      ctx.broadcast('All effects cleared.', '#80ff80');
      return;
    }
    const sec = args[1] !== undefined ? Number(args[1]) : 30;
    const amp = args[2] !== undefined ? Number(args[2]) : 0;
    if (!id || !Number.isFinite(sec) || !Number.isFinite(amp)) {
      ctx.broadcast('Usage: /effect <id|clear> [seconds=30] [amplifier=0]', '#ff8080');
      return;
    }
    ctx.applyEffect?.(id, amp, sec);
    ctx.broadcast(`Applied ${id} ${String(amp)} for ${String(sec)}s`, '#80ff80');
    return;
  }
  if (head === 'setspawn') {
    ctx.setSpawnHere?.();
    ctx.broadcast(
      `Spawn set at ${ctx.playerPos.x.toFixed(1)} ${ctx.playerPos.y.toFixed(1)} ${ctx.playerPos.z.toFixed(1)}`,
      '#80ff80',
    );
    return;
  }
  if (head === 'seed') {
    if (ctx.seed) ctx.broadcast(`Seed: ${String(ctx.seed())}`, '#cccccc');
    return;
  }
  if (head === 'killall') {
    const n = ctx.killAllMobs?.() ?? 0;
    ctx.broadcast(`Removed ${String(n)} mobs.`, '#80ff80');
    return;
  }
  if (head === 'difficulty') {
    const level = args[0]?.toLowerCase();
    if (level === 'peaceful' || level === 'easy' || level === 'normal' || level === 'hard') {
      ctx.setDifficulty?.(level);
      ctx.broadcast(`Difficulty: ${level}`, '#80ff80');
    } else {
      ctx.broadcast('Usage: /difficulty <peaceful|easy|normal|hard>', '#ff8080');
    }
    return;
  }
  if (head === 'achievements' || head === 'ach') {
    const list = ctx.listAchievements?.() ?? [];
    for (const a of list) {
      ctx.broadcast(`${a.unlocked ? '✔' : '✗'} ${a.title}`, a.unlocked ? '#80ff80' : '#888888');
    }
    return;
  }
  if (head === 'particle') {
    const x = args[0] !== undefined ? parseCoord(args[0], ctx.playerPos.x) : ctx.playerPos.x;
    const y = args[1] !== undefined ? parseCoord(args[1], ctx.playerPos.y) : ctx.playerPos.y;
    const z = args[2] !== undefined ? parseCoord(args[2], ctx.playerPos.z) : ctx.playerPos.z;
    ctx.particle?.(x, y, z);
    return;
  }
  if (head === 'summon') {
    if (!ctx.summon) return;
    const kind = args[0] ?? '';
    const x = args[1] !== undefined ? parseCoord(args[1], ctx.playerPos.x) : ctx.playerPos.x;
    const y = args[2] !== undefined ? parseCoord(args[2], ctx.playerPos.y) : ctx.playerPos.y;
    const z = args[3] !== undefined ? parseCoord(args[3], ctx.playerPos.z) : ctx.playerPos.z;
    if (!kind || !Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) {
      ctx.broadcast('Usage: /summon <kind> [x y z]', '#ff8080');
      return;
    }
    const ok = ctx.summon(kind, x, y, z);
    if (ok) ctx.broadcast(`Summoned ${kind}`, '#80ff80');
    else ctx.broadcast(`Unknown mob: ${kind}`, '#ff8080');
    return;
  }
  if (head === 'save') {
    ctx.save?.();
    ctx.broadcast('World saved.', '#80a0ff');
    return;
  }
  if (head === 'fill') {
    if (args.length < 7 || !ctx.fillBlocks) {
      ctx.broadcast('Usage: /fill <x1> <y1> <z1> <x2> <y2> <z2> <block>', '#ff8080');
      return;
    }
    const x1 = parseCoord(args[0] ?? '', ctx.playerPos.x);
    const y1 = parseCoord(args[1] ?? '', ctx.playerPos.y);
    const z1 = parseCoord(args[2] ?? '', ctx.playerPos.z);
    const x2 = parseCoord(args[3] ?? '', ctx.playerPos.x);
    const y2 = parseCoord(args[4] ?? '', ctx.playerPos.y);
    const z2 = parseCoord(args[5] ?? '', ctx.playerPos.z);
    const name = args[6] ?? '';
    if (!Number.isFinite(x1) || !Number.isFinite(y1) || !Number.isFinite(z1) ||
        !Number.isFinite(x2) || !Number.isFinite(y2) || !Number.isFinite(z2) || !name) {
      ctx.broadcast('Invalid args', '#ff8080');
      return;
    }
    const total = Math.abs(x2 - x1 + 1) * Math.abs(y2 - y1 + 1) * Math.abs(z2 - z1 + 1);
    if (total > 32768) {
      ctx.broadcast(`Fill volume ${String(total)} exceeds 32768 limit`, '#ff8080');
      return;
    }
    const count = ctx.fillBlocks(
      Math.floor(x1), Math.floor(y1), Math.floor(z1),
      Math.floor(x2), Math.floor(y2), Math.floor(z2),
      name,
    );
    if (count < 0) ctx.broadcast(`Unknown block: ${name}`, '#ff8080');
    else ctx.broadcast(`Filled ${String(count)} blocks.`, '#80ff80');
    return;
  }
  if (head === 'setblock') {
    if (args.length < 4 || !ctx.setBlock) {
      ctx.broadcast('Usage: /setblock <x> <y> <z> <block>', '#ff8080');
      return;
    }
    const x = parseCoord(args[0] ?? '', ctx.playerPos.x);
    const y = parseCoord(args[1] ?? '', ctx.playerPos.y);
    const z = parseCoord(args[2] ?? '', ctx.playerPos.z);
    const name = args[3] ?? '';
    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z) || !name) {
      ctx.broadcast('Invalid args', '#ff8080');
      return;
    }
    const ok = ctx.setBlock(Math.floor(x), Math.floor(y), Math.floor(z), name);
    if (ok) ctx.broadcast(`Set ${name} at ${String(Math.floor(x))} ${String(Math.floor(y))} ${String(Math.floor(z))}`, '#80ff80');
    else ctx.broadcast(`Unknown block: ${name}`, '#ff8080');
    return;
  }
  if (head === 'gamemode' || head === 'gm') {
    const m = args[0]?.toLowerCase() as GameMode | undefined;
    if (m !== undefined && (ctx.knownGameModes as readonly string[]).includes(m)) {
      ctx.setGameMode(m);
      ctx.broadcast(`Gamemode set to ${m}`, '#80ff80');
    } else {
      ctx.broadcast(`Usage: /gamemode <${ctx.knownGameModes.join('|')}>`, '#ff8080');
    }
    return;
  }
  if (head === 'tp' || head === 'teleport') {
    if (args.length < 3) {
      ctx.broadcast('Usage: /tp <x> <y> <z>', '#ff8080');
      return;
    }
    const px = parseCoord(args[0] ?? '', ctx.playerPos.x);
    const py = parseCoord(args[1] ?? '', ctx.playerPos.y);
    const pz = parseCoord(args[2] ?? '', ctx.playerPos.z);
    if (Number.isFinite(px) && Number.isFinite(py) && Number.isFinite(pz)) {
      ctx.setPlayerPos(px, py, pz);
      ctx.broadcast(`Teleported to ${px.toFixed(1)} ${py.toFixed(1)} ${pz.toFixed(1)}`, '#80ff80');
    } else {
      ctx.broadcast('Invalid coordinates', '#ff8080');
    }
    return;
  }
  if (head === 'time') {
    if (args[0]?.toLowerCase() === 'add') {
      const n = Number(args[1] ?? '');
      if (Number.isFinite(n)) {
        ctx.addTimeOfDay?.(n);
        ctx.broadcast(`+${String(n)} ticks`, '#80ff80');
      } else {
        ctx.broadcast('Usage: /time add <ticks>', '#ff8080');
      }
      return;
    }
    if (args[0]?.toLowerCase() !== 'set') {
      ctx.broadcast('Usage: /time set <day|night|noon|midnight|ticks> | /time add <ticks>', '#ff8080');
      return;
    }
    const v = args[1]?.toLowerCase() ?? '';
    const map: Record<string, number> = {
      day: 1000,
      noon: 6000,
      night: 13000,
      midnight: 18000,
      sunrise: 23000,
    };
    const preset = map[v];
    const n = preset !== undefined ? preset : Number(v);
    if (Number.isFinite(n)) {
      ctx.setTimeOfDay(n);
      ctx.broadcast(`Time set to ${n}`, '#80ff80');
    } else {
      ctx.broadcast('Invalid time value', '#ff8080');
    }
    return;
  }
  if (head === 'weather') {
    const w = args[0]?.toLowerCase();
    if (w === 'clear' || w === 'rain' || w === 'thunder') {
      ctx.setWeather(w);
      ctx.broadcast(`Weather set to ${w}`, '#80ff80');
    } else if (w === 'random' || w === 'r') {
      const r = Math.random();
      const pick = r < 0.6 ? 'clear' : r < 0.9 ? 'rain' : 'thunder';
      ctx.setWeather(pick);
      ctx.broadcast(`Weather rolled ${pick}`, '#80ff80');
    } else {
      ctx.broadcast('Usage: /weather <clear|rain|thunder|random>', '#ff8080');
    }
    return;
  }
  if (head === 'give') {
    const name = args[0];
    const count = args[1] !== undefined ? Math.max(1, Math.min(64, parseInt(args[1], 10))) : 1;
    if (name === undefined || Number.isNaN(count)) {
      ctx.broadcast('Usage: /give <item> [count]', '#ff8080');
      return;
    }
    const ok = ctx.giveItem(name, count);
    if (ok) ctx.broadcast(`Gave ${count} × ${name}`, '#80ff80');
    else ctx.broadcast(`Unknown item: ${name}`, '#ff8080');
    return;
  }
  ctx.broadcast(`Unknown command: ${head}`, '#ff8080');
}

function parseCoord(tok: string, rel: number): number {
  if (tok.startsWith('~')) {
    const offset = tok.length > 1 ? Number(tok.slice(1)) : 0;
    return Number.isFinite(offset) ? rel + offset : NaN;
  }
  return Number(tok);
}
