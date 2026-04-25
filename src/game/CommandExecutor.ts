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
  giveAllBlocks?: () => number;
  lookupItem?: (name: string) => boolean;
  lookupBlock?: (name: string) => boolean;
  listBlocks?: (filter?: string) => readonly string[];
  listMobKinds?: () => readonly string[];
  uptimeMs?: () => number;
  lookAtBlock?: () => { x: number; y: number; z: number; name: string } | null;
  setMute?: (mute: boolean) => void;
  showTitle?: (text: string, color?: string, durationMs?: number) => void;
  broadcast: (line: string, color?: string) => void;
  knownGameModes: readonly GameMode[];
  knownItems: readonly string[];
  heal?: () => void;
  kill?: () => void;
  clearInventory?: () => void;
  sortInventory?: () => void;
  toggleScoreboard?: () => boolean;
  toggleGyro?: () => boolean;
  setTickFrozen?: (frozen: boolean) => void;
  isTickFrozen?: () => boolean;
  getTpsStats?: () => { tps: number; p50ms: number; p95ms: number; lagging: boolean };
  getLastDeathPos?: () => { x: number; y: number; z: number } | null;
  renameLookedAtMob?: (name: string) => string | null;
  tameLookedAtMob?: () => { kind: string; tamed: boolean; itemUsed: string | null; reason?: string } | null;
  toggleSitLookedAtMob?: () => { kind: string; sitting: boolean } | null;
  feedLookedAtMob?: () => { kind: string; loved: boolean; itemUsed: string | null; reason?: string } | null;
  leashLookedAtMob?: () => { kind: string; leashed: boolean; reason?: string } | null;
  unleashAllMobs?: () => number;
  setWorldBorder?: (diameter: number) => void;
  getWorldBorder?: () => number;
  setHardcore?: (on: boolean) => void;
  isHardcore?: () => boolean;
  loadDatapackDemo?: () => string;
  exportWorldManifest?: () => string;
  equipArmor?: (itemName: string) => string | null;
  giveXp?: (amount: number) => void;
  showBossBar?: (name: string, hp: number, maxHp: number, color: 'pink' | 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'white', style?: 'progress' | 'notched_6' | 'notched_10' | 'notched_12' | 'notched_20') => void;
  hideBossBar?: () => void;
  rollLootTable?: (table: string) => string | null;
  locateStructure?: (kind: string) => { x: number; z: number; dist: number } | null;
  setWaypoint?: (name: string, x: number, y: number, z: number) => void;
  getWaypoint?: (name: string) => { x: number; y: number; z: number } | null;
  listWaypoints?: () => ReadonlyArray<{ name: string; x: number; y: number; z: number }>;
  removeWaypoint?: (name: string) => boolean;
  copyToClipboard?: (text: string) => Promise<boolean>;
  getRoomCode?: () => string | null;
  importWorldFile?: () => void;
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
  setGameRule?: (rule: string, value: boolean) => void;
  listGameRules?: () => Record<string, boolean>;
  biomeAt?: (x: number, z: number) => string;
  findBlock?: (name: string, radius: number) => { x: number; y: number; z: number; dist: number } | null;
  findMob?: (kind: string) => { x: number; y: number; z: number; dist: number } | null;
}

let lastTpFrom: { x: number; y: number; z: number } | null = null;

export function executeCommands(raw: string, ctx: CommandContext): void {
  for (const part of raw.split(';').map((s) => s.trim()).filter((s) => s.length > 0)) {
    executeCommand(part, ctx);
  }
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
  if (head === 'repeat') {
    const n = parseInt(args[0] ?? '', 10);
    if (!Number.isFinite(n) || n <= 0 || n > 100) {
      ctx.broadcast('Usage: /repeat <1-100> <command>', '#ff8080');
      return;
    }
    const inner = args.slice(1).join(' ');
    if (!inner) {
      ctx.broadcast('Empty inner command', '#ff8080');
      return;
    }
    for (let i = 0; i < n; i++) executeCommand(inner, ctx);
    return;
  }
  if (head === 'me') {
    const action = args.join(' ');
    if (action) ctx.broadcast(`* ${ctx.playerName ?? 'You'} ${action}`, '#cccccc');
    return;
  }
  if (head === 'echo') {
    const text = args.join(' ');
    ctx.broadcast(text, '#ffffff');
    return;
  }
  if (head === '8ball' || head === 'magic8' || head === 'eight') {
    const ANS: readonly string[] = [
      'It is certain.',
      'Without a doubt.',
      'Yes — definitely.',
      'You may rely on it.',
      'Most likely.',
      'Outlook good.',
      'Yes.',
      'Signs point to yes.',
      'Reply hazy, try again.',
      'Ask again later.',
      'Better not tell you now.',
      'Cannot predict now.',
      'Concentrate and ask again.',
      "Don't count on it.",
      'My reply is no.',
      'My sources say no.',
      'Outlook not so good.',
      'Very doubtful.',
    ];
    const idx = Math.floor(Math.random() * ANS.length);
    ctx.broadcast(`🎱 ${ANS[idx] ?? '?'}`, '#cccccc');
    return;
  }
  if (head === 'coin' || head === 'flip') {
    ctx.broadcast(Math.random() < 0.5 ? '🪙 Heads' : '🪙 Tails', '#cccccc');
    return;
  }
  if (head === 'random' || head === 'roll') {
    const max = args[0] !== undefined ? Math.max(1, Math.floor(Number(args[0]))) : 100;
    if (!Number.isFinite(max)) {
      ctx.broadcast('Usage: /random [max=100]', '#ff8080');
      return;
    }
    const r = 1 + Math.floor(Math.random() * max);
    ctx.broadcast(`🎲 ${String(r)} (1-${String(max)})`, '#cccccc');
    return;
  }
  if (head === 'list') {
    ctx.broadcast(`Players online: 1 (${ctx.playerName ?? 'Player'})`, '#cccccc');
    return;
  }
  if (head === 'version' || head === 'v') {
    ctx.broadcast('webmc · clean-room AGPL-3.0 voxel · session build', '#cccccc');
    return;
  }
  if (head === 'ping') {
    ctx.broadcast('pong (0ms, single-player)', '#cccccc');
    return;
  }
  if (head === 'title') {
    const text = args.join(' ');
    if (!text) {
      ctx.broadcast('Usage: /title <text>', '#ff8080');
      return;
    }
    ctx.showTitle?.(text, '#ffffff', 2000);
    return;
  }
  if (head === 'destroy') {
    const hit = ctx.lookAtBlock?.();
    if (!hit || !ctx.setBlock) {
      ctx.broadcast('Nothing in reach.', '#ff8080');
      return;
    }
    ctx.setBlock(hit.x, hit.y, hit.z, 'webmc:air');
    ctx.broadcast(`Destroyed ${hit.name}`, '#80ff80');
    return;
  }
  if (head === 'mute') {
    ctx.setMute?.(true);
    ctx.broadcast('Muted.', '#cccccc');
    return;
  }
  if (head === 'unmute') {
    ctx.setMute?.(false);
    ctx.broadcast('Unmuted.', '#cccccc');
    return;
  }
  if (head === 'lookat') {
    const hit = ctx.lookAtBlock?.();
    if (hit) {
      ctx.broadcast(
        `Looking at ${hit.name} @ ${String(hit.x)} ${String(hit.y)} ${String(hit.z)}`,
        '#cccccc',
      );
    } else {
      ctx.broadcast('Nothing in reach.', '#cccccc');
    }
    return;
  }
  if (head === 'uptime') {
    const ms = ctx.uptimeMs?.() ?? 0;
    const sec = Math.floor(ms / 1000);
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    ctx.broadcast(`Uptime: ${String(m)}m ${String(s)}s`, '#cccccc');
    return;
  }
  if (head === 'whoami') {
    ctx.broadcast(`You are ${ctx.playerName ?? 'Player'}`, '#cccccc');
    return;
  }
  if (head === 'pos' || head === 'where') {
    ctx.broadcast(
      `Pos ${ctx.playerPos.x.toFixed(2)} ${ctx.playerPos.y.toFixed(2)} ${ctx.playerPos.z.toFixed(2)}`,
      '#cccccc',
    );
    return;
  }
  if (head === 'findmob') {
    const kind = args[0];
    if (!kind || !ctx.findMob) {
      ctx.broadcast('Usage: /findmob <kind>', '#ff8080');
      return;
    }
    const hit = ctx.findMob(kind);
    if (hit) {
      ctx.broadcast(
        `Nearest ${kind}: ${hit.x.toFixed(0)} ${hit.y.toFixed(0)} ${hit.z.toFixed(0)} (${hit.dist.toFixed(1)}m)`,
        '#80ff80',
      );
    } else {
      ctx.broadcast(`No ${kind} loaded`, '#ff8080');
    }
    return;
  }
  if (head === 'find') {
    const name = args[0];
    const r = args[1] !== undefined ? Math.min(64, Math.max(4, parseInt(args[1], 10))) : 32;
    if (!name || !Number.isFinite(r) || !ctx.findBlock) {
      ctx.broadcast('Usage: /find <block> [radius=32, max 64]', '#ff8080');
      return;
    }
    const hit = ctx.findBlock(name, r);
    if (hit) {
      ctx.broadcast(
        `Nearest ${name}: ${String(hit.x)} ${String(hit.y)} ${String(hit.z)} (${hit.dist.toFixed(1)}m)`,
        '#80ff80',
      );
    } else {
      ctx.broadcast(`No ${name} within ${String(r)}m`, '#ff8080');
    }
    return;
  }
  if (head === 'biome') {
    const b = ctx.biomeAt?.(Math.floor(ctx.playerPos.x), Math.floor(ctx.playerPos.z)) ?? 'unknown';
    ctx.broadcast(`Biome: ${b}`, '#cccccc');
    return;
  }
  if (head === 'help') {
    if (args[0]) {
      const topic = args[0].toLowerCase();
      const HELP: Record<string, string> = {
        gamemode: '/gamemode <survival|creative|adventure|spectator> — switch mode',
        tp: '/tp <x> <y> <z> — teleport (use ~ for relative)',
        time: '/time set <day|night|noon|midnight|ticks> | /time add <ticks>',
        weather: '/weather <clear|rain|thunder|random>',
        give: '/give <item> [count] | /give all',
        find: '/find <block> [radius=32] — locate nearest matching block',
        findmob: '/findmob <kind> — locate nearest mob of kind',
        effect: '/effect <id|clear> [seconds=30] [amplifier=0]',
        gamerule: '/gamerule [rule] [true|false]',
        difficulty: '/difficulty <peaceful|easy|normal|hard>',
        spawn: '/spawn — teleport to spawn point',
        setspawn: '/setspawn — save current pos as spawn',
        title: '/title <text> — flash text on screen',
      };
      const line = HELP[topic];
      if (line) ctx.broadcast(line, '#cccccc');
      else ctx.broadcast(`No help for '${topic}'.`, '#ff8080');
      return;
    }
    ctx.broadcast('/gamemode <survival|creative|adventure|spectator>', '#cccccc');
    ctx.broadcast('/tp <x> <y> <z>', '#cccccc');
    ctx.broadcast('/time set <day|night|noon|midnight|ticks>', '#cccccc');
    ctx.broadcast('/weather <clear|rain|thunder>', '#cccccc');
    ctx.broadcast('/give <item> [count]', '#cccccc');
    ctx.broadcast('/heal | /kill | /clear | /sort', '#cccccc');
    ctx.broadcast('/setblock <x> <y> <z> <block>', '#cccccc');
    ctx.broadcast('/fill <x1> <y1> <z1> <x2> <y2> <z2> <block>', '#cccccc');
    ctx.broadcast('/summon <kind> [x y z]', '#cccccc');
    ctx.broadcast('/chest | /spawn | /seed | /killall', '#cccccc');
    ctx.broadcast('/stats | /save | /setspawn | /clearchat', '#cccccc');
    ctx.broadcast('/me <action> | /list | /whoami | /fly | /pos | /biome', '#cccccc');
    ctx.broadcast('/effect <id> [s] [amp] | /listeffects | /particle [x y z]', '#cccccc');
    ctx.broadcast('/difficulty <peaceful|easy|normal|hard>', '#cccccc');
    ctx.broadcast('/achievements (/ach)', '#cccccc');
    ctx.broadcast('/find <block> | /findmob <kind> | /lookup <name>', '#cccccc');
    ctx.broadcast('/listblocks [filter] | /listmobs | /lookat | /destroy', '#cccccc');
    ctx.broadcast('/back | /freeze | /unfreeze | /mute | /unmute', '#cccccc');
    ctx.broadcast('/title <text> | /echo <text> | /repeat <n> <cmd>', '#cccccc');
    ctx.broadcast('/random [max] | /coin | /8ball', '#cccccc');
    ctx.broadcast('/day | /night | /noon | /midnight', '#cccccc');
    ctx.broadcast('/up [n] | /down [n] | /distance | /spawnpoint', '#cccccc');
    ctx.broadcast('/uptime | /version | /ping', '#cccccc');
    ctx.broadcast('Use ; to chain: /heal; /spawn', '#cccccc');
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
  if (head === 'sort') {
    ctx.sortInventory?.();
    ctx.broadcast('Inventory sorted.', '#80ff80');
    return;
  }
  if (head === 'milk') {
    ctx.clearEffects?.();
    ctx.broadcast('🥛 Drank milk; all effects cleared.', '#ffffff');
    return;
  }
  if (head === 'tick') {
    const sub = (args[0] ?? '').toLowerCase();
    if (sub === 'freeze') {
      ctx.setTickFrozen?.(true);
      ctx.broadcast('Tick frozen.', '#80a0ff');
    } else if (sub === 'unfreeze' || sub === 'resume') {
      ctx.setTickFrozen?.(false);
      ctx.broadcast('Tick resumed.', '#80ff80');
    } else if (sub === 'status') {
      ctx.broadcast(`Tick: ${ctx.isTickFrozen?.() ? 'frozen' : 'running'}`, '#cccccc');
    } else {
      ctx.broadcast('Usage: /tick <freeze|unfreeze|status>', '#ff8080');
    }
    return;
  }
  if (head === 'deathloc' || head === 'lastdeath') {
    const p = ctx.getLastDeathPos?.() ?? null;
    if (!p) {
      ctx.broadcast('No death recorded yet.', '#ff8080');
      return;
    }
    if (args[0] === 'tp') {
      lastTpFrom = { x: ctx.playerPos.x, y: ctx.playerPos.y, z: ctx.playerPos.z };
      ctx.setPlayerPos(p.x, p.y, p.z);
      ctx.broadcast(`Teleported to last death @ ${p.x.toFixed(1)} ${p.y.toFixed(1)} ${p.z.toFixed(1)}`, '#80ff80');
    } else {
      ctx.broadcast(`Last death: ${p.x.toFixed(1)} ${p.y.toFixed(1)} ${p.z.toFixed(1)} (use /deathloc tp to go)`, '#cccccc');
    }
    return;
  }
  if (head === 'waypoint' || head === 'wp') {
    if (args[0] === 'set') {
      const name = args[1] ?? 'home';
      ctx.setWaypoint?.(name, ctx.playerPos.x, ctx.playerPos.y, ctx.playerPos.z);
      ctx.broadcast(`Waypoint "${name}" set @ ${ctx.playerPos.x.toFixed(1)} ${ctx.playerPos.y.toFixed(1)} ${ctx.playerPos.z.toFixed(1)}`, '#80ff80');
      return;
    }
    if (args[0] === 'list') {
      const list = ctx.listWaypoints?.() ?? [];
      if (list.length === 0) {
        ctx.broadcast('No waypoints. Use /wp set <name>.', '#cccccc');
      } else {
        for (const wp of list) ctx.broadcast(`${wp.name}: ${wp.x.toFixed(1)} ${wp.y.toFixed(1)} ${wp.z.toFixed(1)}`, '#cccccc');
      }
      return;
    }
    if (args[0] === 'tp') {
      const name = args[1] ?? 'home';
      const wp = ctx.getWaypoint?.(name);
      if (!wp) {
        ctx.broadcast(`No waypoint "${name}"`, '#ff8080');
        return;
      }
      lastTpFrom = { x: ctx.playerPos.x, y: ctx.playerPos.y, z: ctx.playerPos.z };
      ctx.setPlayerPos(wp.x, wp.y, wp.z);
      ctx.broadcast(`Teleported to "${name}"`, '#80ff80');
      return;
    }
    if (args[0] === 'remove' || args[0] === 'rm') {
      const name = args[1] ?? '';
      const ok = ctx.removeWaypoint?.(name) ?? false;
      ctx.broadcast(ok ? `Removed waypoint "${name}"` : `No waypoint "${name}"`, ok ? '#80ff80' : '#ff8080');
      return;
    }
    ctx.broadcast('Usage: /wp <set|list|tp|remove> [name]', '#ff8080');
    return;
  }
  if (head === 'locate') {
    const kind = (args[0] ?? 'stronghold').toLowerCase();
    if (!ctx.locateStructure) {
      ctx.broadcast('Locate unavailable.', '#ff8080');
      return;
    }
    const hit = ctx.locateStructure(kind);
    if (!hit) {
      ctx.broadcast(`Unknown structure: ${kind}. Try: stronghold`, '#ff8080');
      return;
    }
    ctx.broadcast(`Nearest ${kind}: ${String(hit.x)} ~ ${String(hit.z)} (${hit.dist.toFixed(0)}m)`, '#80ff80');
    return;
  }
  if (head === 'loot') {
    const table = (args[0] ?? 'desert').toLowerCase();
    if (!ctx.rollLootTable) {
      ctx.broadcast('Loot tables unavailable.', '#ff8080');
      return;
    }
    const item = ctx.rollLootTable(table);
    if (!item) {
      ctx.broadcast(`Unknown loot table: ${table}. Try: desert, dungeon, mineshaft`, '#ff8080');
      return;
    }
    if (ctx.giveItem(item, 1)) {
      ctx.broadcast(`Rolled ${item} from ${table} table`, '#80ff80');
    } else {
      ctx.broadcast(`Rolled ${item} but couldn't add to inventory.`, '#ffd080');
    }
    return;
  }
  if (head === 'bossbar') {
    const sub = (args[0] ?? '').toLowerCase();
    if (sub === 'hide') {
      ctx.hideBossBar?.();
      ctx.broadcast('Boss bar hidden.', '#cccccc');
      return;
    }
    if (sub === 'show') {
      const COLORS = ['pink', 'blue', 'red', 'green', 'yellow', 'purple', 'white'] as const;
      const STYLES = ['progress', 'notched_6', 'notched_10', 'notched_12', 'notched_20'] as const;
      let color: typeof COLORS[number] = COLORS[Math.floor(Math.random() * COLORS.length)] ?? 'purple';
      let style: typeof STYLES[number] = 'progress';
      const rest: string[] = [];
      for (const a of args.slice(1)) {
        const lo = a.toLowerCase();
        if ((COLORS as readonly string[]).includes(lo)) color = lo as typeof COLORS[number];
        else if ((STYLES as readonly string[]).includes(lo)) style = lo as typeof STYLES[number];
        else rest.push(a);
      }
      const name = rest.join(' ') || 'Test Boss';
      ctx.showBossBar?.(name, 100, 100, color, style);
      ctx.broadcast(`Boss bar shown: ${name} (${color}, ${style})`, '#80ff80');
      return;
    }
    ctx.broadcast('Usage: /bossbar <show [name] [color] [style] | hide>  styles: progress, notched_6/10/12/20', '#ff8080');
    return;
  }
  if (head === 'xp' || head === 'experience') {
    const amount = args[0] !== undefined ? Math.floor(Number(args[0])) : 1;
    if (!Number.isFinite(amount) || amount === 0) {
      ctx.broadcast('Usage: /xp <amount>', '#ff8080');
      return;
    }
    ctx.giveXp?.(amount);
    ctx.broadcast(`+${String(amount)} XP`, amount > 0 ? '#80ff80' : '#ffd080');
    return;
  }
  if (head === 'equip') {
    const name = (args[0] ?? '').toLowerCase();
    if (!name || !ctx.equipArmor) {
      ctx.broadcast('Usage: /equip <item> (e.g. iron_helmet)', '#ff8080');
      return;
    }
    const slot = ctx.equipArmor(name);
    if (slot) {
      ctx.broadcast(`Equipped ${name} in ${slot} slot`, '#80ff80');
    } else {
      ctx.broadcast(`No ${name} in inventory or not armor`, '#ff8080');
    }
    return;
  }
  if (head === 'export') {
    const manifest = ctx.exportWorldManifest?.() ?? '';
    if (!manifest) {
      ctx.broadcast('Export unavailable.', '#ff8080');
      return;
    }
    ctx.broadcast('World manifest:', '#cccccc');
    for (const line of manifest.split('\n')) ctx.broadcast(line, '#cccccc');
    ctx.broadcast('Use Main Menu → Export to download a .webmc file.', '#cccccc');
    return;
  }
  if (head === 'datapack' || head === 'dp') {
    const sub = (args[0] ?? 'help').toLowerCase();
    if (sub === 'demo') {
      const report = ctx.loadDatapackDemo?.() ?? 'datapack support unavailable';
      ctx.broadcast(`Datapack demo: ${report}`, '#80c8ff');
    } else {
      ctx.broadcast('Usage: /datapack demo (loads a built-in test datapack)', '#cccccc');
    }
    return;
  }
  if (head === 'hardcore') {
    const sub = (args[0] ?? '').toLowerCase();
    if (sub === 'on') {
      ctx.setHardcore?.(true);
      ctx.broadcast('☠ Hardcore mode ON. Death = spectator forever.', '#ff5050');
    } else if (sub === 'off') {
      ctx.setHardcore?.(false);
      ctx.broadcast('Hardcore mode OFF.', '#80ff80');
    } else {
      ctx.broadcast(`Hardcore: ${ctx.isHardcore?.() ? 'ON' : 'OFF'} — usage: /hardcore <on|off>`, '#cccccc');
    }
    return;
  }
  if (head === 'worldborder' || head === 'wb') {
    if (args.length === 0) {
      const cur = ctx.getWorldBorder?.() ?? 0;
      ctx.broadcast(`World border: ${cur.toLocaleString()} blocks diameter`, '#cccccc');
      return;
    }
    const d = Number(args[0]);
    if (!Number.isFinite(d) || d < 4) {
      ctx.broadcast('Usage: /worldborder <diameter>', '#ff8080');
      return;
    }
    ctx.setWorldBorder?.(d);
    ctx.broadcast(`World border set to ${d.toLocaleString()} blocks`, '#80ff80');
    return;
  }
  if (head === 'tame') {
    if (!ctx.tameLookedAtMob) {
      ctx.broadcast('Tame not available.', '#ff8080');
      return;
    }
    const r = ctx.tameLookedAtMob();
    if (!r) {
      ctx.broadcast('No mob in reach. Aim at a wolf, cat, parrot, horse or llama.', '#ff8080');
      return;
    }
    if (r.reason === 'untameable') {
      ctx.broadcast(`${r.kind} is not tameable.`, '#ff8080');
    } else if (r.reason === 'already_tamed') {
      ctx.broadcast(`${r.kind} is already tamed.`, '#ffd080');
    } else if (r.reason === 'wrong_item') {
      ctx.broadcast(`Hold the right item: wolf=bone, cat=raw_fish/raw_salmon, parrot=seeds.`, '#ffd080');
    } else if (r.tamed) {
      ctx.broadcast(`Tamed ${r.kind}! ♥`, '#80ff80');
    } else {
      ctx.broadcast(`${r.kind} ate the ${r.itemUsed} but resisted taming. Try again.`, '#ffd080');
    }
    return;
  }
  if (head === 'leash') {
    if (!ctx.leashLookedAtMob) {
      ctx.broadcast('Leash not available.', '#ff8080');
      return;
    }
    const r = ctx.leashLookedAtMob();
    if (!r) {
      ctx.broadcast('No mob in reach.', '#ff8080');
      return;
    }
    if (r.reason === 'unleashable') {
      ctx.broadcast(`${r.kind} cannot be leashed.`, '#ff8080');
    } else if (r.reason === 'already_leashed') {
      ctx.broadcast(`${r.kind} is already leashed.`, '#ffd080');
    } else if (r.leashed) {
      ctx.broadcast(`Leashed ${r.kind}. Walk away — it follows.`, '#80ff80');
    }
    return;
  }
  if (head === 'unleash') {
    const n = ctx.unleashAllMobs?.() ?? 0;
    ctx.broadcast(n > 0 ? `Unleashed ${n} mob(s).` : 'No leashed mobs.', n > 0 ? '#80ff80' : '#ffd080');
    return;
  }
  if (head === 'feed' || head === 'breed') {
    if (!ctx.feedLookedAtMob) {
      ctx.broadcast('Feed not available.', '#ff8080');
      return;
    }
    const r = ctx.feedLookedAtMob();
    if (!r) {
      ctx.broadcast('No animal in reach.', '#ff8080');
      return;
    }
    if (r.reason === 'wrong_item') {
      ctx.broadcast(`${r.kind} doesn't want that. Try: cow/sheep=wheat, pig=carrot, chicken=seeds, rabbit=carrot.`, '#ffd080');
    } else if (r.reason === 'cooldown') {
      ctx.broadcast(`${r.kind} is on breed cooldown.`, '#ffd080');
    } else if (r.reason === 'not_breedable') {
      ctx.broadcast(`${r.kind} can't be bred.`, '#ff8080');
    } else if (r.loved) {
      ctx.broadcast(`${r.kind} entered love mode ♥`, '#ff80c0');
    }
    return;
  }
  if (head === 'sit' || head === 'stand') {
    if (!ctx.toggleSitLookedAtMob) {
      ctx.broadcast('Sit not available.', '#ff8080');
      return;
    }
    const r = ctx.toggleSitLookedAtMob();
    if (!r) {
      ctx.broadcast('No tamed pet in reach.', '#ff8080');
      return;
    }
    ctx.broadcast(`${r.kind} ${r.sitting ? 'sat down' : 'stood up'}.`, '#80ff80');
    return;
  }
  if (head === 'rename' || head === 'nametag') {
    const name = args.join(' ').trim();
    if (!name || !ctx.renameLookedAtMob) {
      ctx.broadcast('Usage: /rename <name> (look at a mob)', '#ff8080');
      return;
    }
    const kind = ctx.renameLookedAtMob(name);
    if (kind) {
      ctx.broadcast(`Renamed ${kind} to "${name}"`, '#80ff80');
    } else {
      ctx.broadcast('No mob in reach.', '#ff8080');
    }
    return;
  }
  if (head === 'tps') {
    const s = ctx.getTpsStats?.();
    if (!s) {
      ctx.broadcast('TPS unavailable.', '#ff8080');
      return;
    }
    const color = s.lagging ? '#ff8080' : '#80ff80';
    ctx.broadcast(
      `TPS ${s.tps.toFixed(1)} (target 20)  MSPT p50=${s.p50ms.toFixed(1)} p95=${s.p95ms.toFixed(1)}${s.lagging ? '  ⚠ lagging' : ''}`,
      color,
    );
    return;
  }
  if (head === 'scoreboard' || head === 'sb') {
    const on = ctx.toggleScoreboard?.() ?? false;
    ctx.broadcast(`Scoreboard ${on ? 'shown' : 'hidden'}`, '#80ff80');
    return;
  }
  if (head === 'gyro' || head === 'tilt') {
    const on = ctx.toggleGyro?.() ?? false;
    ctx.broadcast(`Gyro look ${on ? 'on' : 'off'}`, '#80ff80');
    return;
  }
  if (head === 'import') {
    if (!ctx.importWorldFile) {
      ctx.broadcast('Import not available.', '#ff8080');
      return;
    }
    ctx.importWorldFile();
    return;
  }
  if (head === 'copy') {
    const what = (args[0] ?? 'pos').toLowerCase();
    let text: string | null = null;
    if (what === 'pos' || what === 'xyz') {
      text = `${ctx.playerPos.x.toFixed(2)} ${ctx.playerPos.y.toFixed(2)} ${ctx.playerPos.z.toFixed(2)}`;
    } else if (what === 'seed' && ctx.seed) {
      text = String(ctx.seed());
    } else if (what === 'room' && ctx.getRoomCode) {
      text = ctx.getRoomCode();
    } else if (what === 'name' && ctx.playerName) {
      text = ctx.playerName;
    }
    if (text === null) {
      ctx.broadcast('Usage: /copy <pos|seed|room|name>', '#ff8080');
      return;
    }
    void (ctx.copyToClipboard?.(text) ?? Promise.resolve(false)).then((ok) => {
      ctx.broadcast(ok ? `Copied: ${text}` : 'Copy failed (clipboard blocked)', ok ? '#80ff80' : '#ff8080');
    });
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
    lastTpFrom = { x: ctx.playerPos.x, y: ctx.playerPos.y, z: ctx.playerPos.z };
    ctx.teleportSpawn?.();
    ctx.broadcast('Teleported to spawn.', '#80ff80');
    return;
  }
  if (head === 'day' || head === 'sun') {
    ctx.setTimeOfDay(1000);
    ctx.broadcast('☀ Day.', '#ffeb80');
    return;
  }
  if (head === 'night' || head === 'moon') {
    ctx.setTimeOfDay(13000);
    ctx.broadcast('🌙 Night.', '#80a0ff');
    return;
  }
  if (head === 'noon') {
    ctx.setTimeOfDay(6000);
    ctx.broadcast('☀ Noon.', '#ffeb80');
    return;
  }
  if (head === 'midnight') {
    ctx.setTimeOfDay(18000);
    ctx.broadcast('🌑 Midnight.', '#404060');
    return;
  }
  if (head === 'up') {
    const n = args[0] !== undefined ? Math.max(1, Math.min(64, Number(args[0]))) : 10;
    if (!Number.isFinite(n)) {
      ctx.broadcast('Usage: /up [blocks=10]', '#ff8080');
      return;
    }
    lastTpFrom = { x: ctx.playerPos.x, y: ctx.playerPos.y, z: ctx.playerPos.z };
    ctx.setPlayerPos(ctx.playerPos.x, ctx.playerPos.y + n, ctx.playerPos.z);
    ctx.broadcast(`↑ ${String(n)}m`, '#80ff80');
    return;
  }
  if (head === 'down') {
    const n = args[0] !== undefined ? Math.max(1, Math.min(64, Number(args[0]))) : 10;
    if (!Number.isFinite(n)) {
      ctx.broadcast('Usage: /down [blocks=10]', '#ff8080');
      return;
    }
    lastTpFrom = { x: ctx.playerPos.x, y: ctx.playerPos.y, z: ctx.playerPos.z };
    ctx.setPlayerPos(ctx.playerPos.x, ctx.playerPos.y - n, ctx.playerPos.z);
    ctx.broadcast(`↓ ${String(n)}m`, '#80ff80');
    return;
  }
  if (head === 'spawnpoint' || head === 'setworldspawn') {
    ctx.setSpawnHere?.();
    ctx.broadcast(
      `Spawn set at ${ctx.playerPos.x.toFixed(1)} ${ctx.playerPos.y.toFixed(1)} ${ctx.playerPos.z.toFixed(1)}`,
      '#80ff80',
    );
    return;
  }
  if (head === 'distance' || head === 'dist') {
    const dx = ctx.playerPos.x;
    const dz = ctx.playerPos.z;
    const d = Math.hypot(dx, dz);
    ctx.broadcast(`Distance from origin: ${d.toFixed(1)}m (Δx ${dx.toFixed(1)}, Δz ${dz.toFixed(1)})`, '#cccccc');
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
  if (head === 'gamerule') {
    const rule = args[0];
    const v = args[1];
    if (!rule) {
      const rules = ctx.listGameRules?.() ?? {};
      ctx.broadcast('Usage: /gamerule <rule> <true|false>', '#ff8080');
      for (const [k, val] of Object.entries(rules)) {
        ctx.broadcast(`${k} = ${String(val)}`, '#cccccc');
      }
      return;
    }
    if (v !== 'true' && v !== 'false') {
      ctx.broadcast('Usage: /gamerule <rule> <true|false>', '#ff8080');
      return;
    }
    ctx.setGameRule?.(rule, v === 'true');
    ctx.broadcast(`${rule} = ${v}`, '#80ff80');
    return;
  }
  if (head === 'listeffects') {
    const all = ['regeneration', 'poison', 'instant_health', 'instant_damage',
      'night_vision', 'speed', 'slowness', 'jump_boost', 'fire_resistance',
      'water_breathing', 'invisibility', 'strength', 'resistance',
      'slow_falling', 'haste', 'mining_fatigue', 'absorption', 'glowing',
      'levitation', 'luck', 'unluck', 'wither', 'dolphins_grace', 'blindness',
      'nausea', 'hunger', 'weakness'];
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
  if (head === 'roof') {
    if (!ctx.fillBlocks || !ctx.setBlock) return;
    const r = parseInt(args[0] ?? '6', 10);
    const block = args[1] ?? 'oak_planks';
    if (!Number.isFinite(r) || r < 2 || r > 24) {
      ctx.broadcast('Usage: /roof <half-size=6> [block=oak_planks]', '#ff8080');
      return;
    }
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y) + 4;
    const pz = Math.floor(ctx.playerPos.z);
    for (let h = 0; h < r; h++) {
      ctx.fillBlocks(px - r + h, py + h, pz - r + h, px + r - h, py + h, pz + r - h, block);
    }
    ctx.broadcast(`Built a ${String(r)}-step pyramid roof of ${block}`, '#80ff80');
    return;
  }
  if (head === 'wall') {
    if (!ctx.fillBlocks) return;
    const len = parseInt(args[0] ?? '8', 10);
    const height = parseInt(args[1] ?? '4', 10);
    const block = args[2] ?? 'cobblestone';
    if (!Number.isFinite(len) || len < 1 || len > 64 || !Number.isFinite(height) || height < 1 || height > 32) {
      ctx.broadcast('Usage: /wall <len=8> <h=4> [block=cobblestone]', '#ff8080');
      return;
    }
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    const n = ctx.fillBlocks(px, py, pz, px + len - 1, py + height - 1, pz, block);
    ctx.broadcast(`Wall ${String(len)}×${String(height)} of ${block} (${String(n)} blocks)`, '#80ff80');
    return;
  }
  if (head === 'bridge') {
    if (!ctx.fillBlocks) return;
    const len = parseInt(args[0] ?? '12', 10);
    const block = args[1] ?? 'oak_planks';
    if (!Number.isFinite(len) || len < 1 || len > 128) {
      ctx.broadcast('Usage: /bridge <len=12> [block=oak_planks]', '#ff8080');
      return;
    }
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y) - 1;
    const pz = Math.floor(ctx.playerPos.z);
    const n = ctx.fillBlocks(px - 1, py, pz, px + 1, py, pz + len - 1, block);
    ctx.broadcast(`Bridge ${String(len)} long of ${block} (${String(n)} blocks)`, '#80ff80');
    return;
  }
  if (head === 'pillar') {
    if (!ctx.fillBlocks) return;
    const h = parseInt(args[0] ?? '32', 10);
    const block = args[1] ?? 'glowstone';
    if (!Number.isFinite(h) || h < 1 || h > 256) {
      ctx.broadcast('Usage: /pillar <height=32> [block=glowstone]', '#ff8080');
      return;
    }
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    const n = ctx.fillBlocks(px, py, pz, px, py + h - 1, pz, block);
    ctx.broadcast(`Pillar ${String(h)} of ${block} (${String(n)} blocks)`, '#80ff80');
    return;
  }
  if (head === 'sphere') {
    if (!ctx.fillBlocks || !ctx.setBlock) return;
    const r = parseInt(args[0] ?? '5', 10);
    const block = args[1] ?? 'stone';
    if (!Number.isFinite(r) || r < 1 || r > 32) {
      ctx.broadcast('Usage: /sphere <radius=5> [block=stone]', '#ff8080');
      return;
    }
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    let n = 0;
    for (let dy = -r; dy <= r; dy++) {
      for (let dz = -r; dz <= r; dz++) {
        for (let dx = -r; dx <= r; dx++) {
          if (dx * dx + dy * dy + dz * dz <= r * r) {
            if (ctx.setBlock(px + dx, py + dy, pz + dz, block)) n++;
          }
        }
      }
    }
    ctx.broadcast(`Sphere of ${block} radius ${String(r)} (${String(n)} blocks)`, '#80ff80');
    return;
  }
  if (head === 'cube') {
    if (!ctx.fillBlocks) return;
    const r = parseInt(args[0] ?? '5', 10);
    const block = args[1] ?? 'stone';
    if (!Number.isFinite(r) || r < 1 || r > 32) {
      ctx.broadcast('Usage: /cube <half-size=5> [block=stone]', '#ff8080');
      return;
    }
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    const n = ctx.fillBlocks(px - r, py - r, pz - r, px + r, py + r, pz + r, block);
    ctx.broadcast(`Cube of ${block} half=${String(r)} (${String(n)} blocks)`, '#80ff80');
    return;
  }
  if (head === 'platform') {
    if (!ctx.fillBlocks) return;
    const r = parseInt(args[0] ?? '8', 10);
    const block = args[1] ?? 'stone';
    if (!Number.isFinite(r) || r < 1 || r > 64) {
      ctx.broadcast('Usage: /platform <half-size=8> [block=stone]', '#ff8080');
      return;
    }
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y) - 1;
    const pz = Math.floor(ctx.playerPos.z);
    const n = ctx.fillBlocks(px - r, py, pz - r, px + r, py, pz + r, block);
    ctx.broadcast(`Platform of ${block} (${String(n)} blocks)`, '#80ff80');
    return;
  }
  if (head === 'portal' || head === 'netherportal') {
    if (!ctx.setBlock) return;
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    // 4-wide × 5-tall obsidian frame on +Z, fill with nether_portal blocks.
    for (let h = 0; h < 5; h++) {
      ctx.setBlock(px, py + h, pz, 'obsidian');
      ctx.setBlock(px + 3, py + h, pz, 'obsidian');
    }
    for (let w = 0; w < 4; w++) {
      ctx.setBlock(px + w, py, pz, 'obsidian');
      ctx.setBlock(px + w, py + 4, pz, 'obsidian');
    }
    for (let h = 1; h < 4; h++) {
      for (let w = 1; w < 3; w++) {
        ctx.setBlock(px + w, py + h, pz, 'nether_portal');
      }
    }
    ctx.broadcast('Nether portal frame built (lit).', '#80ff80');
    return;
  }
  if (head === 'tower') {
    if (!ctx.fillBlocks) return;
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    const HEIGHT = 16;
    const RADIUS = 2;
    // Cobble shell with hollow interior + ladder column.
    for (let h = 0; h < HEIGHT; h++) {
      ctx.fillBlocks(px - RADIUS, py + h, pz - RADIUS, px + RADIUS, py + h, pz + RADIUS, 'cobblestone');
    }
    ctx.fillBlocks(px - RADIUS + 1, py + 1, pz - RADIUS + 1, px + RADIUS - 1, py + HEIGHT - 1, pz + RADIUS - 1, 'air');
    // Ladder column on -Z wall (player can climb).
    for (let h = 1; h < HEIGHT - 1; h++) ctx.setBlock?.(px, py + h, pz - RADIUS + 1, 'oak_log');
    // Top crenellations + torch.
    ctx.setBlock?.(px, py + HEIGHT, pz, 'torch');
    ctx.broadcast(`Built a ${HEIGHT}-block cobblestone tower`, '#80ff80');
    return;
  }
  if (head === 'pyramid') {
    if (!ctx.fillBlocks) return;
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    const SIZE = 9;
    for (let h = 0; h < SIZE; h++) {
      ctx.fillBlocks(px - SIZE + h, py + h, pz - SIZE + h, px + SIZE - h, py + h, pz + SIZE - h, 'sandstone');
    }
    ctx.broadcast(`Built a ${SIZE}-step sandstone pyramid`, '#80ff80');
    return;
  }
  if (head === 'dungeon') {
    if (!ctx.fillBlocks) return;
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    // 7×4×7 mossy cobblestone room with dirt floor + monster spawner stub (chest at center).
    ctx.fillBlocks(px - 3, py - 1, pz - 3, px + 3, py + 3, pz + 3, 'mossy_cobblestone');
    ctx.fillBlocks(px - 2, py, pz - 2, px + 2, py + 2, pz + 2, 'air');
    ctx.setBlock?.(px, py, pz, 'chest');
    ctx.setBlock?.(px - 2, py + 1, pz - 2, 'torch');
    ctx.setBlock?.(px + 2, py + 1, pz + 2, 'torch');
    ctx.broadcast(`Built a 7×4×7 mossy-cobblestone dungeon`, '#80ff80');
    return;
  }
  if (head === 'village' || head === 'house') {
    if (!ctx.fillBlocks) {
      ctx.broadcast('Fill not available.', '#ff8080');
      return;
    }
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    // 5×5 floor of oak_planks + 4-block walls + flat roof.
    ctx.fillBlocks(px, py - 1, pz, px + 4, py - 1, pz + 4, 'oak_planks');
    ctx.fillBlocks(px, py, pz, px + 4, py + 3, pz, 'oak_planks');
    ctx.fillBlocks(px, py, pz + 4, px + 4, py + 3, pz + 4, 'oak_planks');
    ctx.fillBlocks(px, py, pz, px, py + 3, pz + 4, 'oak_planks');
    ctx.fillBlocks(px + 4, py, pz, px + 4, py + 3, pz + 4, 'oak_planks');
    ctx.fillBlocks(px, py + 4, pz, px + 4, py + 4, pz + 4, 'oak_planks');
    // Hollow interior.
    ctx.fillBlocks(px + 1, py, pz + 1, px + 3, py + 2, pz + 3, 'air');
    // Doorway (front wall: 2-block opening).
    ctx.fillBlocks(px + 2, py, pz, px + 2, py + 1, pz, 'air');
    // Window in back wall.
    ctx.fillBlocks(px + 2, py + 2, pz + 4, px + 2, py + 2, pz + 4, 'glass');
    // Bed inside.
    ctx.setBlock?.(px + 1, py, pz + 3, 'bed');
    // Crafting table + furnace + chest.
    ctx.setBlock?.(px + 3, py, pz + 1, 'crafting_table');
    ctx.setBlock?.(px + 3, py, pz + 2, 'furnace');
    ctx.setBlock?.(px + 3, py, pz + 3, 'chest');
    // Torch outside the door.
    ctx.setBlock?.(px + 2, py + 2, pz - 1, 'torch');
    ctx.broadcast(`Built a 5×5 wooden house at (${px}, ${py}, ${pz})`, '#80ff80');
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
      lastTpFrom = { x: ctx.playerPos.x, y: ctx.playerPos.y, z: ctx.playerPos.z };
      ctx.setPlayerPos(px, py, pz);
      ctx.broadcast(`Teleported to ${px.toFixed(1)} ${py.toFixed(1)} ${pz.toFixed(1)}`, '#80ff80');
    } else {
      ctx.broadcast('Invalid coordinates', '#ff8080');
    }
    return;
  }
  if (head === 'back') {
    if (!lastTpFrom) {
      ctx.broadcast('No previous teleport.', '#ff8080');
      return;
    }
    const p = lastTpFrom;
    lastTpFrom = { x: ctx.playerPos.x, y: ctx.playerPos.y, z: ctx.playerPos.z };
    ctx.setPlayerPos(p.x, p.y, p.z);
    ctx.broadcast(`Back to ${p.x.toFixed(1)} ${p.y.toFixed(1)} ${p.z.toFixed(1)}`, '#80ff80');
    return;
  }
  if (head === 'freeze') {
    ctx.setGameRule?.('doDaylightCycle', false);
    ctx.broadcast('Time frozen.', '#80ff80');
    return;
  }
  if (head === 'unfreeze') {
    ctx.setGameRule?.('doDaylightCycle', true);
    ctx.broadcast('Time resumed.', '#80ff80');
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
  if (head === 'listmobs') {
    const list = ctx.listMobKinds?.() ?? [];
    ctx.broadcast(`Mob kinds (${String(list.length)}): ${list.join(', ')}`, '#cccccc');
    return;
  }
  if (head === 'listblocks') {
    const list = ctx.listBlocks?.(args[0]) ?? [];
    if (list.length === 0) {
      ctx.broadcast(args[0] ? `No blocks match "${args[0]}"` : 'No blocks loaded', '#ff8080');
      return;
    }
    const shown = list.slice(0, 20);
    ctx.broadcast(`Blocks (${String(list.length)}): ${shown.join(', ')}${list.length > 20 ? '…' : ''}`, '#cccccc');
    return;
  }
  if (head === 'lookup') {
    const name = args[0];
    if (!name) {
      ctx.broadcast('Usage: /lookup <name>', '#ff8080');
      return;
    }
    const isItem = ctx.lookupItem?.(name) ?? false;
    const isBlock = ctx.lookupBlock?.(name) ?? false;
    ctx.broadcast(`${name}: item=${String(isItem)}, block=${String(isBlock)}`, '#cccccc');
    return;
  }
  if (head === 'give') {
    const name = args[0];
    if (name === 'all') {
      const n = ctx.giveAllBlocks?.() ?? 0;
      ctx.broadcast(`Gave 1 of ${String(n)} block items`, '#80ff80');
      return;
    }
    const count = args[1] !== undefined ? Math.max(1, Math.min(64, parseInt(args[1], 10))) : 1;
    if (name === undefined || Number.isNaN(count)) {
      ctx.broadcast('Usage: /give <item> [count] | /give all', '#ff8080');
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
