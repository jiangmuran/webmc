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
  tameLookedAtMob?: () => {
    kind: string;
    tamed: boolean;
    itemUsed: string | null;
    reason?: string;
  } | null;
  toggleSitLookedAtMob?: () => { kind: string; sitting: boolean } | null;
  toggleZoom?: (factor: number) => void;
  setWalkSpeed?: (mul: number) => void;
  applyVelocity?: (dx: number, dy: number, dz: number) => void;
  surfaceAt?: (x: number, z: number) => number;
  repairHeld?: () => boolean;
  heldDurability?: () => { name: string; current: number; max: number } | null;
  markRegionPoint?: (point: 'a' | 'b') => void;
  fillRegion?: (block: string) => number;
  screenshot?: () => void;
  setFov?: (deg: number) => void;
  entityStats?: () => {
    mobs: number;
    hostile: number;
    passive: number;
    neutral: number;
    drops: number;
    xpOrbs: number;
    byKind: { kind: string; count: number }[];
  };
  chunkStats?: () => { loaded: number; pending: number; meshes: number; triangles: number };
  openCreativeInventory?: () => void;
  saveLoadout?: (name: string) => void;
  loadLoadout?: (name: string) => boolean;
  listLoadouts?: () => string[];
  setTickRate?: (tps: number) => void;
  cycleCamera?: () => string;
  toggleMinimap?: () => boolean;
  minimapZoom?: (dir: 'in' | 'out') => void;
  heldItemInfo?: () => {
    name: string;
    count: number;
    maxStack: number;
    durability?: { current: number; max: number };
    food?: { hunger: number; saturation: number };
    tags?: string[];
  } | null;
  inventoryStats?: () => {
    filledSlots: number;
    totalSlots: number;
    totalItems: number;
    uniqueTypes: number;
    topItems: { name: string; count: number }[];
  };
  dropAllItems?: () => number;
  setPlayerName?: (name: string) => void;
  remeshAllChunks?: () => number;
  setHealth?: (hp: number) => void;
  setHunger?: (h: number) => void;
  setSaturation?: (s: number) => void;
  setBreath?: (b: number) => void;
  setXpLevel?: (lvl: number) => void;
  killMobsNear?: (radius: number) => number;
  healMobsNear?: (radius: number) => number;
  saveStateInfo?: () => { dirtyChunks: number; lastSaveSec: number };
  tpAllMobsTo?: () => number;
  unequipAll?: () => number;
  gpuInfo?: () => { gl: string; vendor: string; renderer: string };
  feedLookedAtMob?: () => {
    kind: string;
    loved: boolean;
    itemUsed: string | null;
    reason?: string;
  } | null;
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
  showBossBar?: (
    name: string,
    hp: number,
    maxHp: number,
    color: 'pink' | 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'white',
    style?: 'progress' | 'notched_6' | 'notched_10' | 'notched_12' | 'notched_20',
  ) => void;
  hideBossBar?: () => void;
  rollLootTable?: (table: string) => string | null;
  locateStructure?: (kind: string) => { x: number; z: number; dist: number } | null;
  setWaypoint?: (name: string, x: number, y: number, z: number) => void;
  getWaypoint?: (name: string) => { x: number; y: number; z: number } | null;
  listWaypoints?: () => readonly { name: string; x: number; y: number; z: number }[];
  removeWaypoint?: (name: string) => boolean;
  copyToClipboard?: (text: string) => Promise<boolean>;
  getRoomCode?: () => string | null;
  importWorldFile?: () => void;
  setBlock?: (x: number, y: number, z: number, name: string) => boolean;
  fillBlocks?: (
    x1: number,
    y1: number,
    z1: number,
    x2: number,
    y2: number,
    z2: number,
    name: string,
  ) => number;
  save?: () => void;
  showStats?: () => void;
  summon?: (kind: string, x: number, y: number, z: number) => boolean;
  openChest?: () => void;
  teleportSpawn?: () => void;
  seed?: () => number;
  killAllMobs?: () => number;
  particle?: (x: number, y: number, z: number) => void;
  listAchievements?: () => readonly { title: string; unlocked: boolean }[];
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
  findBlock?: (
    name: string,
    radius: number,
  ) => { x: number; y: number; z: number; dist: number } | null;
  findMob?: (kind: string) => { x: number; y: number; z: number; dist: number } | null;
}

let lastTpFrom: { x: number; y: number; z: number } | null = null;

export function executeCommands(raw: string, ctx: CommandContext): void {
  for (const part of raw
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)) {
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
    ctx.broadcast('Builders: /village /house /tower /pyramid /dungeon', '#cccccc');
    ctx.broadcast('  /sphere /cube /platform /portal /roof /wall /bridge /pillar /tree', '#cccccc');
    ctx.broadcast('Mob: /tame /sit /stand /feed /breed /leash /unleash /rename', '#cccccc');
    ctx.broadcast('  /army <kind> <n> /dragon /wither', '#cccccc');
    ctx.broadcast('XP/Boss: /xp <n> /bossbar /enchant', '#cccccc');
    ctx.broadcast('Misc: /equip /datapack /export /import /hardcore /worldborder', '#cccccc');
    ctx.broadcast('  /waypoint /locate /milk /tps /tick /loot /scoreboard /sb', '#cccccc');
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
      ctx.broadcast(
        `Teleported to last death @ ${p.x.toFixed(1)} ${p.y.toFixed(1)} ${p.z.toFixed(1)}`,
        '#80ff80',
      );
    } else {
      ctx.broadcast(
        `Last death: ${p.x.toFixed(1)} ${p.y.toFixed(1)} ${p.z.toFixed(1)} (use /deathloc tp to go)`,
        '#cccccc',
      );
    }
    return;
  }
  if (head === 'waypoint' || head === 'wp') {
    if (args[0] === 'set') {
      const name = args[1] ?? 'home';
      ctx.setWaypoint?.(name, ctx.playerPos.x, ctx.playerPos.y, ctx.playerPos.z);
      ctx.broadcast(
        `Waypoint "${name}" set @ ${ctx.playerPos.x.toFixed(1)} ${ctx.playerPos.y.toFixed(1)} ${ctx.playerPos.z.toFixed(1)}`,
        '#80ff80',
      );
      return;
    }
    if (args[0] === 'list') {
      const list = ctx.listWaypoints?.() ?? [];
      if (list.length === 0) {
        ctx.broadcast('No waypoints. Use /wp set <name>.', '#cccccc');
      } else {
        for (const wp of list)
          ctx.broadcast(
            `${wp.name}: ${wp.x.toFixed(1)} ${wp.y.toFixed(1)} ${wp.z.toFixed(1)}`,
            '#cccccc',
          );
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
      ctx.broadcast(
        ok ? `Removed waypoint "${name}"` : `No waypoint "${name}"`,
        ok ? '#80ff80' : '#ff8080',
      );
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
    ctx.broadcast(
      `Nearest ${kind}: ${String(hit.x)} ~ ${String(hit.z)} (${hit.dist.toFixed(0)}m)`,
      '#80ff80',
    );
    // Auto-create a waypoint so the minimap marks the structure.
    if (ctx.setWaypoint) {
      const wpName = `loc_${kind}`;
      ctx.setWaypoint(wpName, hit.x, ctx.playerPos.y, hit.z);
      ctx.broadcast(`Waypoint '${wpName}' set — see minimap`, '#80c0ff');
    }
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
      let color: (typeof COLORS)[number] =
        COLORS[Math.floor(Math.random() * COLORS.length)] ?? 'purple';
      let style: (typeof STYLES)[number] = 'progress';
      const rest: string[] = [];
      for (const a of args.slice(1)) {
        const lo = a.toLowerCase();
        if ((COLORS as readonly string[]).includes(lo)) color = lo as (typeof COLORS)[number];
        else if ((STYLES as readonly string[]).includes(lo)) style = lo as (typeof STYLES)[number];
        else rest.push(a);
      }
      const name = rest.join(' ') || 'Test Boss';
      ctx.showBossBar?.(name, 100, 100, color, style);
      ctx.broadcast(`Boss bar shown: ${name} (${color}, ${style})`, '#80ff80');
      return;
    }
    ctx.broadcast(
      'Usage: /bossbar <show [name] [color] [style] | hide>  styles: progress, notched_6/10/12/20',
      '#ff8080',
    );
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
      ctx.broadcast(
        `Hardcore: ${ctx.isHardcore?.() ? 'ON' : 'OFF'} — usage: /hardcore <on|off>`,
        '#cccccc',
      );
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
      ctx.broadcast(
        `Hold the right item: wolf=bone, cat=raw_fish/raw_salmon, parrot=seeds.`,
        '#ffd080',
      );
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
    ctx.broadcast(
      n > 0 ? `Unleashed ${n} mob(s).` : 'No leashed mobs.',
      n > 0 ? '#80ff80' : '#ffd080',
    );
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
      ctx.broadcast(
        `${r.kind} doesn't want that. Try: cow/sheep=wheat, pig=carrot, chicken=seeds, rabbit=carrot.`,
        '#ffd080',
      );
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
      ctx.broadcast(
        ok ? `Copied: ${text}` : 'Copy failed (clipboard blocked)',
        ok ? '#80ff80' : '#ff8080',
      );
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
    ctx.broadcast(
      `Distance from origin: ${d.toFixed(1)}m (Δx ${dx.toFixed(1)}, Δz ${dz.toFixed(1)})`,
      '#cccccc',
    );
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
    const all = [
      'regeneration',
      'poison',
      'instant_health',
      'instant_damage',
      'night_vision',
      'speed',
      'slowness',
      'jump_boost',
      'fire_resistance',
      'water_breathing',
      'invisibility',
      'strength',
      'resistance',
      'slow_falling',
      'haste',
      'mining_fatigue',
      'absorption',
      'glowing',
      'levitation',
      'luck',
      'unluck',
      'wither',
      'dolphins_grace',
      'blindness',
      'nausea',
      'hunger',
      'weakness',
    ];
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
  if (head === 'about' || head === 'credits') {
    ctx.broadcast('— webmc —', '#ffd080');
    ctx.broadcast('Browser-native Minecraft-Java-Edition-equivalent voxel game', '#cccccc');
    ctx.broadcast('Clean-room AGPL-3.0 reimplementation. NOT affiliated with Mojang.', '#cccccc');
    ctx.broadcast(
      'Built with Three.js + TypeScript + Vite. Mobile + multiplayer ready.',
      '#cccccc',
    );
    ctx.broadcast('https://github.com/anthropics/claude-code  ·  /tutorial /help', '#a0a0ff');
    return;
  }
  if (head === 'commands' || head === 'cmds') {
    ctx.broadcast('— Command categories — type /help for full list —', '#ffd080');
    ctx.broadcast(
      'Movement: /tp /back /up /down /spawn /home /jump /launch /speed /zoom',
      '#cccccc',
    );
    ctx.broadcast(
      'World: /time /weather /day /night /sun /rain /storm /seed /biome /world',
      '#cccccc',
    );
    ctx.broadcast(
      'Builders: /village /house /tower /pyramid /dungeon /sphere /cube /portal',
      '#cccccc',
    );
    ctx.broadcast('  /roof /wall /bridge /pillar /tree /platform /clear area /replace', '#cccccc');
    ctx.broadcast(
      'Player: /heal /kill /clear /sort /fly /effect /milk /xp /equip /kit /starter',
      '#cccccc',
    );
    ctx.broadcast('  /nv /invis /god /glow', '#cccccc');
    ctx.broadcast(
      'Mobs: /summon /army /dragon /wither /tame /sit /feed /breed /leash /rename',
      '#cccccc',
    );
    ctx.broadcast('  /killall', '#cccccc');
    ctx.broadcast('Items: /give /craft /cook /find /lookup /listblocks /listmobs', '#cccccc');
    ctx.broadcast(
      'UI: /chest /scoreboard /title /particle /firework /bossbar /achievements',
      '#cccccc',
    );
    ctx.broadcast(
      'Save: /save /export /import /worldborder /hardcore /datapack /waypoint',
      '#cccccc',
    );
    ctx.broadcast('Debug: /tps /perf /tick /freeze /unfreeze /spawnpoint /version', '#cccccc');
    return;
  }
  if (head === 'test' || head === 'sanitycheck') {
    let pass = 0,
      fail = 0;
    const check = (label: string, ok: boolean): void => {
      if (ok) {
        pass++;
        ctx.broadcast(`✔ ${label}`, '#80ff80');
      } else {
        fail++;
        ctx.broadcast(`✘ ${label}`, '#ff8080');
      }
    };
    check('giveItem stone', ctx.giveItem('stone', 1));
    check('lookupItem oak_planks', ctx.lookupItem?.('oak_planks') ?? false);
    check('lookupBlock cobblestone', ctx.lookupBlock?.('cobblestone') ?? false);
    check('listBlocks > 100', (ctx.listBlocks?.()?.length ?? 0) > 100);
    check('listMobKinds > 30', (ctx.listMobKinds?.()?.length ?? 0) > 30);
    check('uptimeMs > 0', (ctx.uptimeMs?.() ?? 0) > 0);
    check('biomeAt 0,0 valid', !!ctx.biomeAt?.(0, 0));
    check('seed positive', (ctx.seed?.() ?? 0) > 0);
    check('TPS available', ctx.getTpsStats !== undefined);
    check('giveAllBlocks reachable', ctx.giveAllBlocks !== undefined);
    ctx.broadcast(
      `Sanity: ${String(pass)} ✔  ${String(fail)} ✘`,
      fail === 0 ? '#80ff80' : '#ff8080',
    );
    return;
  }
  if (head === 'reset' && args[0] === 'gamerules') {
    if (!ctx.setGameRule || !ctx.listGameRules) return;
    const DEFAULTS: Record<string, boolean> = {
      doDaylightCycle: true,
      doMobSpawning: true,
      doMobLoot: true,
      doTileDrops: true,
      keepInventory: false,
      mobGriefing: true,
      naturalRegeneration: true,
      fallDamage: true,
      drowningDamage: true,
      fireDamage: true,
      freezeDamage: true,
      doImmediateRespawn: false,
      pvp: true,
    };
    for (const [k, v] of Object.entries(DEFAULTS)) ctx.setGameRule(k, v);
    ctx.broadcast('All game rules reset to defaults', '#80ff80');
    return;
  }
  if (head === 'mute_chat') {
    if (!ctx.setMute) return;
    ctx.setMute(true);
    ctx.broadcast('Chat muted (use /unmute)', '#cccccc');
    return;
  }
  if (head === 'broadcast' && args.length > 0) {
    if (!ctx.showTitle) return;
    const text = args.join(' ');
    ctx.showTitle(text, '#ffd080', 3000);
    ctx.broadcast(`📢 ${text}`, '#ffd080');
    return;
  }
  if (head === 'cdoff' || head === 'noregen') {
    ctx.setGameRule?.('naturalRegeneration', false);
    ctx.broadcast('Natural HP regen disabled (PvP-style).', '#80ff80');
    return;
  }
  if (head === 'cdon' || head === 'regen_on') {
    ctx.setGameRule?.('naturalRegeneration', true);
    ctx.broadcast('Natural HP regen enabled.', '#80ff80');
    return;
  }
  if (head === 'zoo') {
    if (!ctx.fillBlocks || !ctx.summon) return;
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    const KINDS = [
      'pig',
      'cow',
      'sheep',
      'chicken',
      'wolf',
      'horse',
      'cat',
      'rabbit',
      'goat',
      'fox',
      'bee',
      'parrot',
    ];
    for (let i = 0; i < KINDS.length; i++) {
      const ox = (i % 4) * 8;
      const oz = Math.floor(i / 4) * 8;
      // Fenced 6×6 enclosure.
      for (let dx = 0; dx <= 5; dx++) {
        ctx.setBlock?.(px + ox + dx, py, pz + oz, 'oak_fence');
        ctx.setBlock?.(px + ox + dx, py, pz + oz + 5, 'oak_fence');
      }
      for (let dz = 0; dz <= 5; dz++) {
        ctx.setBlock?.(px + ox, py, pz + oz + dz, 'oak_fence');
        ctx.setBlock?.(px + ox + 5, py, pz + oz + dz, 'oak_fence');
      }
      ctx.fillBlocks(
        px + ox + 1,
        py - 1,
        pz + oz + 1,
        px + ox + 4,
        py - 1,
        pz + oz + 4,
        'grass_block',
      );
      const kind = KINDS[i] ?? 'pig';
      for (let m = 0; m < 2; m++) ctx.summon(kind, px + ox + 2.5, py, pz + oz + 2.5);
    }
    ctx.broadcast(`Built zoo with ${String(KINDS.length)} enclosures`, '#80ff80');
    return;
  }
  if (head === 'parkour') {
    if (!ctx.setBlock) return;
    const len = parseInt(args[0] ?? '20', 10);
    if (!Number.isFinite(len) || len < 4 || len > 64) {
      ctx.broadcast('Usage: /parkour <length=20>', '#ff8080');
      return;
    }
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    let cy = py;
    for (let i = 0; i < len; i++) {
      const dz = i * 3;
      const dx = (i % 3) - 1;
      cy = py + Math.floor(Math.sin(i * 0.5) * 3);
      ctx.setBlock(px + dx, cy, pz + dz, 'oak_planks');
    }
    ctx.broadcast(`Parkour course: ${String(len)} jumps along +Z`, '#80ff80');
    return;
  }
  if (head === 'lighthouse') {
    if (!ctx.fillBlocks || !ctx.setBlock) return;
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    // 5×5 stone_brick base, 3×3 hollow tower 16 high, glass top + sea_lantern beacon.
    ctx.fillBlocks(px - 2, py, pz - 2, px + 2, py, pz + 2, 'stone_bricks');
    for (let h = 1; h <= 16; h++) {
      ctx.fillBlocks(px - 1, py + h, pz - 1, px + 1, py + h, pz + 1, 'stone_bricks');
      ctx.setBlock(px, py + h, pz, 'air');
    }
    // Hollow top room with glass walls.
    ctx.fillBlocks(px - 2, py + 17, pz - 2, px + 2, py + 19, pz + 2, 'glass');
    ctx.fillBlocks(px - 1, py + 17, pz - 1, px + 1, py + 19, pz + 1, 'air');
    ctx.setBlock(px, py + 18, pz, 'sea_lantern');
    // Cap and door.
    ctx.fillBlocks(px - 2, py + 20, pz - 2, px + 2, py + 20, pz + 2, 'stone_bricks');
    ctx.setBlock(px, py + 1, pz - 2, 'air');
    ctx.setBlock(px, py + 2, pz - 2, 'air');
    ctx.broadcast('Built lighthouse (20 high) with sea_lantern beacon', '#80ff80');
    return;
  }
  if (head === 'igloo') {
    if (!ctx.fillBlocks || !ctx.setBlock) return;
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    // 7×7 ice/snow dome.
    const r = 3;
    for (let dy = 0; dy <= r; dy++) {
      const ringR = Math.floor(Math.sqrt(r * r - dy * dy) + 0.5);
      for (let dx = -ringR; dx <= ringR; dx++) {
        for (let dz = -ringR; dz <= ringR; dz++) {
          const d = Math.round(Math.sqrt(dx * dx + dy * dy + dz * dz));
          if (d === ringR && dy === r && (dx !== 0 || dz !== 0)) continue;
          if (Math.abs(d - r) <= 0.6) {
            const block = dy < r - 1 ? 'snow_block' : 'ice';
            ctx.setBlock(px + dx, py + dy, pz + dz, block);
          }
        }
      }
    }
    // Hollow interior.
    ctx.fillBlocks(px - 2, py, pz - 2, px + 2, py + 2, pz + 2, 'air');
    // Floor + door + furnace + bed.
    ctx.fillBlocks(px - 2, py - 1, pz - 2, px + 2, py - 1, pz + 2, 'snow_block');
    ctx.setBlock(px, py, pz - 3, 'air');
    ctx.setBlock(px, py + 1, pz - 3, 'air');
    ctx.setBlock(px - 1, py, pz + 1, 'red_bed');
    ctx.setBlock(px + 1, py, pz - 1, 'furnace');
    ctx.setBlock(px, py + 2, pz, 'lantern');
    ctx.broadcast('Built igloo with bed, furnace and lantern', '#80ff80');
    return;
  }
  if (head === 'skyscraper') {
    if (!ctx.fillBlocks || !ctx.setBlock) return;
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    const floors = Math.max(2, Math.min(20, parseInt(args[0] ?? '8', 10)));
    const w = 7;
    // Build floors of glass walls + iron pillar corners + smooth_stone floors.
    for (let f = 0; f < floors; f++) {
      const y = py + f * 4;
      ctx.fillBlocks(px - w, y, pz - w, px + w, y, pz + w, 'smooth_stone');
      // 4 walls of glass at each floor.
      for (let h = 1; h <= 3; h++) {
        ctx.fillBlocks(px - w, y + h, pz - w, px + w, y + h, pz - w, 'glass');
        ctx.fillBlocks(px - w, y + h, pz + w, px + w, y + h, pz + w, 'glass');
        ctx.fillBlocks(px - w, y + h, pz - w, px - w, y + h, pz + w, 'glass');
        ctx.fillBlocks(px + w, y + h, pz - w, px + w, y + h, pz + w, 'glass');
      }
      // Corner iron pillars.
      for (let h = 0; h <= 3; h++) {
        ctx.setBlock(px - w, y + h, pz - w, 'iron_block');
        ctx.setBlock(px + w, y + h, pz - w, 'iron_block');
        ctx.setBlock(px - w, y + h, pz + w, 'iron_block');
        ctx.setBlock(px + w, y + h, pz + w, 'iron_block');
      }
    }
    ctx.fillBlocks(
      px - w,
      py + floors * 4,
      pz - w,
      px + w,
      py + floors * 4,
      pz + w,
      'smooth_stone',
    );
    // Door at base.
    ctx.setBlock(px, py + 1, pz - w, 'air');
    ctx.setBlock(px, py + 2, pz - w, 'air');
    ctx.broadcast(`Built ${String(floors)}-floor skyscraper`, '#80ff80');
    return;
  }
  if (head === 'treehouse') {
    if (!ctx.fillBlocks || !ctx.setBlock) return;
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    // Tree trunk 8 high, spruce-like crown, then 5×5 oak_planks platform inside.
    for (let h = 0; h < 12; h++) ctx.setBlock(px, py + h, pz, 'oak_log');
    // Leaf canopy at top.
    for (let dx = -3; dx <= 3; dx++) {
      for (let dz = -3; dz <= 3; dz++) {
        for (let dy = 0; dy <= 3; dy++) {
          if (dx * dx + dz * dz + dy * dy <= 12) {
            ctx.setBlock(px + dx, py + 9 + dy, pz + dz, 'oak_leaves');
          }
        }
      }
    }
    // Platform at h=6.
    ctx.fillBlocks(px - 2, py + 6, pz - 2, px + 2, py + 6, pz + 2, 'oak_planks');
    ctx.fillBlocks(px - 2, py + 7, pz - 2, px + 2, py + 9, pz + 2, 'air');
    ctx.setBlock(px, py + 6, pz, 'oak_log');
    // Walls + door + roof.
    for (let h = 7; h <= 8; h++) {
      ctx.setBlock(px - 2, py + h, pz - 2, 'oak_planks');
      ctx.setBlock(px + 2, py + h, pz - 2, 'oak_planks');
      ctx.setBlock(px - 2, py + h, pz + 2, 'oak_planks');
      ctx.setBlock(px + 2, py + h, pz + 2, 'oak_planks');
    }
    ctx.fillBlocks(px - 2, py + 9, pz - 2, px + 2, py + 9, pz + 2, 'oak_planks');
    // Ladder up trunk.
    for (let h = 0; h < 6; h++) ctx.setBlock(px + 1, py + h, pz, 'ladder');
    ctx.setBlock(px + 1, py + 6, pz, 'air'); // entrance
    ctx.broadcast('Built treehouse with ladder and leaf crown', '#80ff80');
    return;
  }
  if (head === 'windmill') {
    if (!ctx.fillBlocks || !ctx.setBlock) return;
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    // Stone base (4×4) + oak shaft 8 high + 4 wool blades.
    ctx.fillBlocks(px - 2, py, pz - 2, px + 1, py + 2, pz + 1, 'stone_bricks');
    ctx.fillBlocks(px - 1, py, pz - 1, px, py + 1, pz, 'air');
    for (let h = 3; h <= 10; h++) ctx.setBlock(px, py + h, pz, 'oak_log');
    // 4 blades extending from hub.
    for (let i = 1; i <= 4; i++) {
      ctx.setBlock(px + i, py + 10, pz, 'wool_white');
      ctx.setBlock(px - i, py + 10, pz, 'wool_white');
      ctx.setBlock(px, py + 10, pz + i, 'wool_white');
      ctx.setBlock(px, py + 10, pz - i, 'wool_white');
    }
    ctx.setBlock(px, py + 1, pz - 2, 'air'); // door
    ctx.setBlock(px, py + 2, pz - 2, 'air');
    ctx.broadcast('Built windmill (stone base + oak shaft + wool blades)', '#80ff80');
    return;
  }
  if (head === 'bridge') {
    if (!ctx.fillBlocks || !ctx.setBlock) return;
    const len = Math.max(4, Math.min(80, parseInt(args[0] ?? '20', 10)));
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    // Stone slab walkway 3 wide along +Z, oak fence rails.
    ctx.fillBlocks(px - 1, py - 1, pz, px + 1, py - 1, pz + len - 1, 'stone_bricks');
    ctx.fillBlocks(px - 1, py, pz, px + 1, py, pz + len - 1, 'air');
    for (let i = 0; i < len; i += 3) {
      ctx.setBlock(px - 2, py, pz + i, 'oak_fence');
      ctx.setBlock(px + 2, py, pz + i, 'oak_fence');
      if (i % 6 === 0) {
        ctx.setBlock(px - 2, py + 1, pz + i, 'lantern');
        ctx.setBlock(px + 2, py + 1, pz + i, 'lantern');
      }
    }
    ctx.broadcast(`Built ${String(len)}-block bridge along +Z`, '#80ff80');
    return;
  }
  if (head === 'pillar') {
    if (!ctx.setBlock) return;
    const h = Math.max(2, Math.min(64, parseInt(args[0] ?? '10', 10)));
    const block = args[1] ?? 'stone_bricks';
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    for (let i = 0; i < h; i++) ctx.setBlock(px, py + i, pz, block);
    ctx.broadcast(`Pillar of ${String(h)} ${block}`, '#80ff80');
    return;
  }
  if (head === 'road') {
    if (!ctx.fillBlocks || !ctx.setBlock) return;
    const len = Math.max(4, Math.min(120, parseInt(args[0] ?? '40', 10)));
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    // Gravel path 3 wide with grass shoulder.
    ctx.fillBlocks(px - 1, py - 1, pz, px + 1, py - 1, pz + len - 1, 'gravel');
    ctx.fillBlocks(px - 2, py - 1, pz, px - 2, py - 1, pz + len - 1, 'grass_block');
    ctx.fillBlocks(px + 2, py - 1, pz, px + 2, py - 1, pz + len - 1, 'grass_block');
    // Lantern posts every 8 blocks.
    for (let i = 4; i < len; i += 8) {
      ctx.setBlock(px - 3, py, pz + i, 'oak_fence');
      ctx.setBlock(px - 3, py + 1, pz + i, 'lantern');
      ctx.setBlock(px + 3, py, pz + i, 'oak_fence');
      ctx.setBlock(px + 3, py + 1, pz + i, 'lantern');
    }
    ctx.broadcast(`Built ${String(len)}-block road along +Z`, '#80ff80');
    return;
  }
  if (head === 'tunnel') {
    if (!ctx.fillBlocks || !ctx.setBlock) return;
    const len = Math.max(4, Math.min(120, parseInt(args[0] ?? '40', 10)));
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    // 3 wide × 3 tall opening with torch every 6 blocks.
    ctx.fillBlocks(px - 1, py, pz, px + 1, py + 2, pz + len - 1, 'air');
    ctx.fillBlocks(px - 1, py - 1, pz, px + 1, py - 1, pz + len - 1, 'cobblestone');
    for (let i = 2; i < len; i += 6) ctx.setBlock(px - 1, py + 2, pz + i, 'torch');
    ctx.broadcast(`Cleared ${String(len)}-block tunnel along +Z`, '#80ff80');
    return;
  }
  if (head === 'aquarium') {
    if (!ctx.fillBlocks || !ctx.setBlock) return;
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    // 7×5×7 glass tank filled with water + a few coral.
    ctx.fillBlocks(px - 3, py, pz - 3, px + 3, py + 4, pz + 3, 'glass');
    ctx.fillBlocks(px - 2, py + 1, pz - 2, px + 2, py + 3, pz + 2, 'water');
    ctx.fillBlocks(px - 2, py, pz - 2, px + 2, py, pz + 2, 'sand');
    if (ctx.summon) {
      for (let i = 0; i < 4; i++) ctx.summon('cod', px - 1 + i, py + 2, pz);
    }
    ctx.setBlock(px - 1, py, pz - 1, 'tube_coral_block');
    ctx.setBlock(px + 1, py, pz + 1, 'fire_coral_block');
    ctx.setBlock(px + 1, py, pz - 1, 'horn_coral_block');
    ctx.setBlock(px - 1, py, pz + 1, 'brain_coral_block');
    ctx.broadcast('Built 7×5×7 aquarium with sand and coral', '#80ff80');
    return;
  }
  if (head === 'spiralstaircase' || head === 'spiral') {
    if (!ctx.setBlock) return;
    const turns = Math.max(1, Math.min(10, parseInt(args[0] ?? '3', 10)));
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    const r = 3;
    let h = 0;
    for (let t = 0; t < turns; t++) {
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2;
        const x = px + Math.round(Math.cos(a) * r);
        const z = pz + Math.round(Math.sin(a) * r);
        ctx.setBlock(x, py + h, z, 'stone_bricks');
        ctx.setBlock(x, py + h + 1, z, 'air');
        ctx.setBlock(x, py + h + 2, z, 'air');
        h++;
      }
    }
    ctx.broadcast(`Spiral staircase: ${String(turns)} turns up`, '#80ff80');
    return;
  }
  if (head === 'platform') {
    if (!ctx.setBlock) return;
    const r = Math.max(2, Math.min(20, parseInt(args[0] ?? '5', 10)));
    const block = args[1] ?? 'stone_bricks';
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    let n = 0;
    for (let dx = -r; dx <= r; dx++) {
      for (let dz = -r; dz <= r; dz++) {
        if (dx * dx + dz * dz <= r * r) {
          ctx.setBlock(px + dx, py - 1, pz + dz, block);
          n++;
        }
      }
    }
    ctx.broadcast(`Platform: ${String(n)} ${block} blocks (r=${String(r)})`, '#80ff80');
    return;
  }
  if (head === 'clearfloor') {
    if (!ctx.fillBlocks) return;
    const r = Math.max(2, Math.min(16, parseInt(args[0] ?? '6', 10)));
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    // Flatten the floor and clear up 3 blocks.
    let n = 0;
    for (let dx = -r; dx <= r; dx++) {
      for (let dz = -r; dz <= r; dz++) {
        if (dx * dx + dz * dz <= r * r) {
          ctx.setBlock?.(px + dx, py - 1, pz + dz, 'grass_block');
          for (let h = 0; h < 3; h++) ctx.setBlock?.(px + dx, py + h, pz + dz, 'air');
          n++;
        }
      }
    }
    ctx.broadcast(`Cleared floor (r=${String(r)}, ${String(n)} cells)`, '#80ff80');
    return;
  }
  if (head === 'wall') {
    if (!ctx.fillBlocks) return;
    const len = Math.max(2, Math.min(80, parseInt(args[0] ?? '20', 10)));
    const h = Math.max(2, Math.min(20, parseInt(args[1] ?? '4', 10)));
    const block = args[2] ?? 'cobblestone';
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    ctx.fillBlocks(px, py, pz, px, py + h - 1, pz + len - 1, block);
    ctx.broadcast(`Wall: ${String(len)}×${String(h)} ${block} along +Z`, '#80ff80');
    return;
  }
  if (head === 'dome') {
    if (!ctx.setBlock) return;
    const r = Math.max(3, Math.min(16, parseInt(args[0] ?? '6', 10)));
    const block = args[1] ?? 'glass';
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    let n = 0;
    for (let dy = 0; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        for (let dz = -r; dz <= r; dz++) {
          const d = dx * dx + dy * dy + dz * dz;
          if (d <= r * r && d >= (r - 1) * (r - 1)) {
            ctx.setBlock(px + dx, py + dy, pz + dz, block);
            n++;
          }
        }
      }
    }
    ctx.broadcast(`Dome: r=${String(r)} ${block} (${String(n)} cells)`, '#80ff80');
    return;
  }
  if (head === 'barn') {
    if (!ctx.fillBlocks || !ctx.setBlock || !ctx.summon) return;
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    // 9×7 oak barn with hay loft + 4 stalls + animals.
    ctx.fillBlocks(px - 4, py, pz - 3, px + 4, py + 5, pz + 3, 'oak_planks');
    ctx.fillBlocks(px - 3, py, pz - 2, px + 3, py + 3, pz + 2, 'air'); // hollow ground floor
    ctx.fillBlocks(px - 3, py + 4, pz - 2, px + 3, py + 4, pz + 2, 'oak_planks'); // loft floor
    ctx.fillBlocks(px - 3, py + 5, pz - 2, px + 3, py + 5, pz + 2, 'air'); // loft space
    // Hay loft.
    ctx.fillBlocks(px - 3, py + 5, pz + 1, px + 3, py + 5, pz + 2, 'hay_block');
    // Stall fences.
    for (let i = -3; i <= 3; i += 2) {
      ctx.setBlock(px + i, py + 1, pz - 1, 'oak_fence');
      ctx.setBlock(px + i, py + 2, pz - 1, 'oak_fence');
    }
    // Door.
    ctx.setBlock(px, py + 1, pz - 3, 'air');
    ctx.setBlock(px, py + 2, pz - 3, 'air');
    // Roof gable.
    for (let i = 0; i <= 3; i++) {
      ctx.fillBlocks(px - 4 + i, py + 6 + i, pz - 3, px + 4 - i, py + 6 + i, pz + 3, 'oak_planks');
    }
    // Animals.
    const ANIMALS = ['cow', 'pig', 'sheep', 'chicken'];
    for (let i = 0; i < ANIMALS.length; i++) {
      const a = ANIMALS[i] ?? 'cow';
      ctx.summon(a, px - 2 + i * 2, py + 1, pz);
    }
    ctx.broadcast('Built barn with hay loft and 4 animals', '#80ff80');
    return;
  }
  if (head === 'watchtower') {
    if (!ctx.fillBlocks || !ctx.setBlock) return;
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    // 5×5 cobblestone tower 12 high with 4 archery slits + crenellations + ladder.
    ctx.fillBlocks(px - 2, py, pz - 2, px + 2, py + 11, pz + 2, 'cobblestone');
    ctx.fillBlocks(px - 1, py, pz - 1, px + 1, py + 11, pz + 1, 'air');
    // Archery slits.
    for (let h = 8; h <= 9; h++) {
      ctx.setBlock(px - 2, py + h, pz, 'air');
      ctx.setBlock(px + 2, py + h, pz, 'air');
      ctx.setBlock(px, py + h, pz - 2, 'air');
      ctx.setBlock(px, py + h, pz + 2, 'air');
    }
    // Crenellated top.
    for (let i = -2; i <= 2; i++) {
      if ((i + 2) % 2 === 0) continue;
      ctx.setBlock(px + i, py + 12, pz - 2, 'cobblestone');
      ctx.setBlock(px + i, py + 12, pz + 2, 'cobblestone');
      ctx.setBlock(px - 2, py + 12, pz + i, 'cobblestone');
      ctx.setBlock(px + 2, py + 12, pz + i, 'cobblestone');
    }
    // Door + ladder.
    ctx.setBlock(px, py + 1, pz - 2, 'air');
    ctx.setBlock(px, py + 2, pz - 2, 'air');
    for (let h = 0; h < 11; h++) ctx.setBlock(px, py + h, pz + 1, 'ladder');
    ctx.broadcast('Built watchtower with archery slits and crenellations', '#80ff80');
    return;
  }
  if (head === 'rainbow_path' || head === 'rainbowpath') {
    if (!ctx.setBlock) return;
    const len = Math.max(7, Math.min(56, parseInt(args[0] ?? '14', 10)));
    const COLORS = [
      'wool_red',
      'wool_orange',
      'wool_yellow',
      'wool_lime',
      'wool_cyan',
      'wool_blue',
      'wool_magenta',
    ];
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    for (let i = 0; i < len; i++) {
      const c = COLORS[i % COLORS.length] ?? 'wool_white';
      ctx.setBlock(px, py - 1, pz + i, c);
    }
    ctx.broadcast(`Rainbow path: ${String(len)} wool blocks`, '#80ff80');
    return;
  }
  if (head === 'test_blocks' || head === 'blockgrid') {
    if (!ctx.setBlock || !ctx.listBlocks) return;
    const blocks = ctx.listBlocks();
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    const SIDE = Math.ceil(Math.sqrt(blocks.length));
    let placed = 0;
    for (let i = 0; i < blocks.length; i++) {
      const dx = i % SIDE;
      const dz = Math.floor(i / SIDE);
      const name = blocks[i] ?? 'stone';
      if (ctx.setBlock(px + dx, py - 1, pz + dz, name)) placed++;
    }
    ctx.broadcast(
      `Block grid: ${String(placed)}/${String(blocks.length)} placed (${String(SIDE)}×${String(SIDE)})`,
      '#80ff80',
    );
    return;
  }
  if (head === 'panic') {
    if (!ctx.summon) return;
    const n = Math.max(1, Math.min(40, parseInt(args[0] ?? '12', 10)));
    const px = ctx.playerPos.x;
    const py = Math.floor(ctx.playerPos.y);
    const pz = ctx.playerPos.z;
    let summoned = 0;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const r = 6;
      if (ctx.summon('zombie', px + Math.cos(a) * r, py, pz + Math.sin(a) * r)) summoned++;
    }
    ctx.broadcast(`PANIC: ${String(summoned)} zombies surround you`, '#ff6060');
    return;
  }
  if (head === 'pets' || head === 'kittens') {
    if (!ctx.summon) return;
    const n = Math.max(1, Math.min(20, parseInt(args[0] ?? '8', 10)));
    const px = ctx.playerPos.x;
    const py = Math.floor(ctx.playerPos.y);
    const pz = ctx.playerPos.z;
    const KINDS = ['cat', 'wolf', 'parrot', 'fox'];
    let summoned = 0;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const r = 3;
      const kind = KINDS[i % KINDS.length] ?? 'cat';
      if (ctx.summon(kind, px + Math.cos(a) * r, py, pz + Math.sin(a) * r)) summoned++;
    }
    ctx.broadcast(`Pet circle: ${String(summoned)} (cat/wolf/parrot/fox)`, '#80ff80');
    return;
  }
  if (head === 'carnival') {
    if (!ctx.fillBlocks || !ctx.setBlock) return;
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    // Ring of colored wool (8 segments) + center jack_o_lantern.
    const COLORS = [
      'wool_red',
      'wool_orange',
      'wool_yellow',
      'wool_lime',
      'wool_cyan',
      'wool_blue',
      'wool_magenta',
      'wool_white',
    ];
    const r = 6;
    for (let i = 0; i < 32; i++) {
      const a = (i / 32) * Math.PI * 2;
      const x = px + Math.round(Math.cos(a) * r);
      const z = pz + Math.round(Math.sin(a) * r);
      const c = COLORS[Math.floor((i / 32) * COLORS.length)] ?? 'wool_white';
      ctx.setBlock(x, py, z, c);
      ctx.setBlock(x, py + 1, z, c);
    }
    ctx.setBlock(px, py, pz, 'jack_o_lantern');
    ctx.setBlock(px, py + 1, pz, 'jack_o_lantern');
    ctx.setBlock(px, py + 2, pz, 'jack_o_lantern');
    ctx.broadcast('Built carnival ring with jack_o_lantern column', '#80ff80');
    return;
  }
  if (head === 'sky_island' || head === 'skyisland') {
    if (!ctx.setBlock) return;
    const r = Math.max(4, Math.min(16, parseInt(args[0] ?? '8', 10)));
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    let cells = 0;
    // Ellipsoid stone underbelly + grass top + 1 oak tree.
    for (let dy = -3; dy <= 0; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        for (let dz = -r; dz <= r; dz++) {
          const norm = (dx * dx + dz * dz) / (r * r) + (dy * dy) / 9;
          if (norm <= 1) {
            const block = dy === 0 ? 'grass_block' : dy <= -2 ? 'stone' : 'dirt';
            ctx.setBlock(px + dx, py - 4 + dy, pz + dz, block);
            cells++;
          }
        }
      }
    }
    // Mini oak tree on top.
    for (let h = 0; h < 5; h++) ctx.setBlock(px, py - 3 + h, pz, 'oak_log');
    for (let dx = -2; dx <= 2; dx++) {
      for (let dz = -2; dz <= 2; dz++) {
        for (let dy = 0; dy < 3; dy++) {
          if (dx * dx + dz * dz + dy * dy <= 7) {
            ctx.setBlock(px + dx, py + 1 + dy, pz + dz, 'oak_leaves');
          }
        }
      }
    }
    ctx.broadcast(`Sky island: r=${String(r)} (${String(cells)} cells) with oak tree`, '#80ff80');
    return;
  }
  if (head === 'forge') {
    if (!ctx.setBlock || !ctx.fillBlocks) return;
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    // 5×5 stone_brick floor + anvil + furnace + crafting_table + chest.
    ctx.fillBlocks(px - 2, py - 1, pz - 2, px + 2, py - 1, pz + 2, 'stone_bricks');
    ctx.setBlock(px - 1, py, pz, 'anvil');
    ctx.setBlock(px + 1, py, pz, 'furnace');
    ctx.setBlock(px, py, pz - 1, 'crafting_table');
    ctx.setBlock(px, py, pz + 1, 'chest');
    ctx.setBlock(px - 2, py, pz - 2, 'lantern');
    ctx.setBlock(px + 2, py, pz + 2, 'lantern');
    ctx.broadcast('Built forge: anvil + furnace + crafting_table + chest', '#80ff80');
    return;
  }
  if (head === 'kitchen') {
    if (!ctx.setBlock || !ctx.fillBlocks) return;
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    ctx.fillBlocks(px - 2, py - 1, pz - 2, px + 2, py - 1, pz + 2, 'oak_planks');
    ctx.setBlock(px, py, pz - 2, 'smoker');
    ctx.setBlock(px - 2, py, pz, 'cauldron');
    ctx.setBlock(px + 2, py, pz, 'blast_furnace');
    ctx.setBlock(px - 2, py, pz - 2, 'barrel');
    ctx.setBlock(px + 2, py, pz - 2, 'barrel');
    ctx.setBlock(px - 1, py, pz + 2, 'chest');
    ctx.setBlock(px + 1, py, pz + 2, 'chest');
    ctx.setBlock(px, py, pz, 'crafting_table');
    ctx.broadcast('Built kitchen: smoker, blast_furnace, cauldron, barrels, chests', '#80ff80');
    return;
  }
  if (head === 'stable') {
    if (!ctx.fillBlocks || !ctx.setBlock || !ctx.summon) return;
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    // 11×7 oak stable with 4 stalls + 4 horses + hay_block troughs.
    ctx.fillBlocks(px - 5, py, pz - 3, px + 5, py + 4, pz + 3, 'oak_planks');
    ctx.fillBlocks(px - 4, py, pz - 2, px + 4, py + 3, pz + 2, 'air');
    // 4 stalls, fence dividers every 2 blocks.
    for (let i = -3; i <= 3; i += 2) {
      ctx.setBlock(px + i, py + 1, pz - 1, 'oak_fence');
      ctx.setBlock(px + i, py + 2, pz - 1, 'oak_fence');
      ctx.setBlock(px + i, py + 1, pz + 1, 'oak_fence');
    }
    // Hay troughs.
    for (let i = -3; i <= 3; i += 2) ctx.setBlock(px + i, py, pz, 'hay_block');
    // Horses.
    for (let i = -3; i <= 3; i += 2) ctx.summon('horse', px + i + 1, py + 1, pz);
    // Door.
    ctx.setBlock(px, py + 1, pz - 3, 'air');
    ctx.setBlock(px, py + 2, pz - 3, 'air');
    ctx.broadcast('Built stable: 4 stalls, 4 horses, hay troughs', '#80ff80');
    return;
  }
  if (head === 'tavern' || head === 'inn') {
    if (!ctx.fillBlocks || !ctx.setBlock) return;
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    // 9×9 oak tavern with bar counter, stools, fireplace, chest, lanterns.
    ctx.fillBlocks(px - 4, py, pz - 4, px + 4, py + 4, pz + 4, 'oak_planks');
    ctx.fillBlocks(px - 3, py, pz - 3, px + 3, py + 3, pz + 3, 'air');
    ctx.fillBlocks(px - 4, py - 1, pz - 4, px + 4, py - 1, pz + 4, 'oak_planks');
    // Bar counter line.
    ctx.fillBlocks(px - 3, py, pz + 1, px + 3, py, pz + 1, 'spruce_planks');
    // Stools (oak slabs).
    for (let i = -3; i <= 3; i += 2) ctx.setBlock(px + i, py, pz - 1, 'oak_slab');
    // Fireplace.
    ctx.setBlock(px - 3, py, pz + 3, 'campfire');
    ctx.setBlock(px - 3, py + 1, pz + 3, 'air');
    // Chest.
    ctx.setBlock(px + 3, py, pz + 3, 'chest');
    // Lanterns.
    ctx.setBlock(px - 3, py + 3, pz - 3, 'lantern');
    ctx.setBlock(px + 3, py + 3, pz - 3, 'lantern');
    ctx.setBlock(px - 3, py + 3, pz + 3, 'lantern');
    ctx.setBlock(px + 3, py + 3, pz + 3, 'lantern');
    // Door.
    ctx.setBlock(px, py + 1, pz - 4, 'air');
    ctx.setBlock(px, py + 2, pz - 4, 'air');
    ctx.broadcast('Built tavern: bar, stools, fireplace, chest', '#80ff80');
    return;
  }
  if (head === 'shop' || head === 'tradinghouse') {
    if (!ctx.fillBlocks || !ctx.setBlock || !ctx.summon) return;
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    // Small 7×5 shop with villager + counter + 3 chests + lectern.
    ctx.fillBlocks(px - 3, py, pz - 2, px + 3, py + 3, pz + 2, 'oak_planks');
    ctx.fillBlocks(px - 2, py, pz - 1, px + 2, py + 2, pz + 1, 'air');
    ctx.fillBlocks(px - 3, py - 1, pz - 2, px + 3, py - 1, pz + 2, 'oak_planks');
    // Counter.
    ctx.fillBlocks(px - 2, py, pz, px + 2, py, pz, 'spruce_planks');
    // Chests behind counter.
    for (let i = -2; i <= 2; i += 2) ctx.setBlock(px + i, py, pz + 1, 'chest');
    // Lectern.
    ctx.setBlock(px, py + 1, pz, 'lectern');
    // Villager.
    ctx.summon('villager', px, py + 1, pz + 1);
    // Door.
    ctx.setBlock(px, py + 1, pz - 2, 'air');
    ctx.setBlock(px, py + 2, pz - 2, 'air');
    ctx.broadcast('Built shop: 3 chests, lectern, villager', '#80ff80');
    return;
  }
  if (head === 'library') {
    if (!ctx.fillBlocks || !ctx.setBlock) return;
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    // 9×9 stone_brick library with bookshelf walls + enchanting table + lectern.
    ctx.fillBlocks(px - 4, py, pz - 4, px + 4, py + 4, pz + 4, 'stone_bricks');
    ctx.fillBlocks(px - 3, py, pz - 3, px + 3, py + 3, pz + 3, 'air');
    ctx.fillBlocks(px - 4, py - 1, pz - 4, px + 4, py - 1, pz + 4, 'oak_planks');
    // Bookshelf walls (15-block enchanting power radius).
    ctx.fillBlocks(px - 3, py, pz - 3, px + 3, py + 1, pz - 3, 'bookshelf');
    ctx.fillBlocks(px - 3, py, pz + 3, px + 3, py + 1, pz + 3, 'bookshelf');
    ctx.fillBlocks(px - 3, py, pz - 2, px - 3, py + 1, pz + 2, 'bookshelf');
    ctx.fillBlocks(px + 3, py, pz - 2, px + 3, py + 1, pz + 2, 'bookshelf');
    // Center enchanting table.
    ctx.setBlock(px, py, pz, 'enchanting_table');
    // Lectern at corner.
    ctx.setBlock(px - 3, py, pz + 3, 'lectern');
    ctx.setBlock(px + 3, py, pz + 3, 'lectern');
    // Lanterns.
    ctx.setBlock(px, py + 3, pz, 'lantern');
    // Door.
    ctx.setBlock(px, py + 1, pz - 4, 'air');
    ctx.setBlock(px, py + 2, pz - 4, 'air');
    ctx.broadcast('Built library: enchanting table + bookshelf walls + lectern', '#80ff80');
    return;
  }
  if (head === 'brewery' || head === 'apothecary') {
    if (!ctx.fillBlocks || !ctx.setBlock) return;
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    // 5×5 stone room with 3 brewing_stands + 1 cauldron + chest.
    ctx.fillBlocks(px - 2, py - 1, pz - 2, px + 2, py - 1, pz + 2, 'stone_bricks');
    ctx.fillBlocks(px - 2, py, pz - 2, px + 2, py + 3, pz + 2, 'stone_bricks');
    ctx.fillBlocks(px - 1, py, pz - 1, px + 1, py + 2, pz + 1, 'air');
    ctx.setBlock(px - 1, py, pz + 2, 'air');
    ctx.setBlock(px - 1, py + 1, pz + 2, 'air');
    ctx.setBlock(px - 1, py, pz, 'brewing_stand');
    ctx.setBlock(px, py, pz, 'brewing_stand');
    ctx.setBlock(px + 1, py, pz, 'brewing_stand');
    ctx.setBlock(px - 1, py, pz - 1, 'cauldron');
    ctx.setBlock(px + 1, py, pz - 1, 'chest');
    ctx.setBlock(px, py + 3, pz, 'lantern');
    ctx.broadcast('Built brewery: 3 brewing_stands + cauldron + chest', '#80ff80');
    return;
  }
  if (head === 'observatory') {
    if (!ctx.fillBlocks || !ctx.setBlock) return;
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    // 7×7 stone_brick base, 5 high tower, glass dome on top.
    ctx.fillBlocks(px - 3, py, pz - 3, px + 3, py + 4, pz + 3, 'stone_bricks');
    ctx.fillBlocks(px - 2, py, pz - 2, px + 2, py + 3, pz + 2, 'air');
    // Glass dome.
    for (let dy = 0; dy <= 3; dy++) {
      for (let dx = -3; dx <= 3; dx++) {
        for (let dz = -3; dz <= 3; dz++) {
          const d2 = dx * dx + dy * dy + dz * dz;
          if (d2 <= 9 && d2 >= 7) ctx.setBlock(px + dx, py + 5 + dy, pz + dz, 'glass');
        }
      }
    }
    // Telescope (anvil + chain pillar).
    ctx.setBlock(px, py + 1, pz, 'anvil');
    ctx.setBlock(px, py + 2, pz, 'iron_block');
    // Lanterns + door.
    ctx.setBlock(px - 3, py + 4, pz - 3, 'lantern');
    ctx.setBlock(px + 3, py + 4, pz + 3, 'lantern');
    ctx.setBlock(px, py + 1, pz - 3, 'air');
    ctx.setBlock(px, py + 2, pz - 3, 'air');
    ctx.broadcast('Built observatory: stone tower + glass dome + telescope', '#80ff80');
    return;
  }
  if (head === 'oasis') {
    if (!ctx.setBlock || !ctx.fillBlocks) return;
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    // Sand around with small water pond and palm-like trees.
    for (let dx = -8; dx <= 8; dx++) {
      for (let dz = -8; dz <= 8; dz++) {
        const d2 = dx * dx + dz * dz;
        if (d2 <= 64) ctx.setBlock(px + dx, py - 1, pz + dz, 'sand');
      }
    }
    // Pond.
    for (let dx = -3; dx <= 3; dx++) {
      for (let dz = -3; dz <= 3; dz++) {
        if (dx * dx + dz * dz <= 9) {
          ctx.setBlock(px + dx, py - 1, pz + dz, 'water');
          ctx.setBlock(px + dx, py - 2, pz + dz, 'sand');
        }
      }
    }
    // Palm trees.
    for (const [tx, tz] of [
      [-7, 0],
      [7, 0],
      [0, -7],
      [0, 7],
      [-5, -5],
      [5, 5],
    ] as [number, number][]) {
      for (let h = 0; h < 5; h++) ctx.setBlock(px + tx, py + h, pz + tz, 'jungle_log');
      // Leaf crown.
      for (let dx = -2; dx <= 2; dx++) {
        for (let dz = -2; dz <= 2; dz++) {
          if (dx * dx + dz * dz <= 4) {
            ctx.setBlock(px + tx + dx, py + 5, pz + tz + dz, 'jungle_leaves');
          }
        }
      }
    }
    ctx.broadcast('Built oasis: sand circle, pond, 6 palm trees', '#80ff80');
    return;
  }
  if (head === 'desert_temple' || head === 'sandtemple') {
    if (!ctx.fillBlocks || !ctx.setBlock) return;
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    // Sandstone pyramid 9×9 base × 5 high with 4 chest niches.
    for (let h = 0; h < 5; h++) {
      const r = 4 - h;
      ctx.fillBlocks(px - r, py + h, pz - r, px + r, py + h, pz + r, 'sandstone');
    }
    // Hollow center 1×3 chamber under the apex.
    ctx.fillBlocks(px, py, pz, px, py + 2, pz, 'air');
    // 4 chest niches around base.
    for (const [cx, cz] of [
      [-3, 0],
      [3, 0],
      [0, -3],
      [0, 3],
    ] as [number, number][]) {
      ctx.setBlock(px + cx, py, pz + cz, 'chest');
    }
    ctx.setBlock(px, py + 4, pz, 'gold_block');
    ctx.broadcast('Built desert_temple: 9×9 sandstone pyramid + 4 chests + gold apex', '#80ff80');
    return;
  }
  if (head === 'pale_garden' || head === 'palegarden') {
    if (!ctx.setBlock) return;
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    // 4 pale_oak trees with creaking_heart core + scattered eyeblossom and firefly_bush.
    const TREES: [number, number][] = [
      [-6, -6],
      [6, -6],
      [-6, 6],
      [6, 6],
    ];
    for (const [tx, tz] of TREES) {
      // Trunk.
      for (let h = 0; h < 8; h++) ctx.setBlock(px + tx, py + h, pz + tz, 'pale_oak_log');
      // Creaking heart at base.
      ctx.setBlock(px + tx + 1, py, pz + tz, 'creaking_heart');
      // Leaf cap.
      for (let dx = -3; dx <= 3; dx++) {
        for (let dz = -3; dz <= 3; dz++) {
          for (let dy = 0; dy <= 2; dy++) {
            if (dx * dx + dz * dz + dy * dy <= 10) {
              ctx.setBlock(px + tx + dx, py + 7 + dy, pz + tz + dz, 'pale_oak_leaves');
            }
          }
        }
      }
    }
    // Floor of eyeblossom + firefly_bush patches.
    const flowers = ['eyeblossom', 'closed_eyeblossom', 'firefly_bush', 'pink_petals'];
    for (let i = 0; i < 24; i++) {
      const dx = Math.floor((Math.sin(i * 1.7) + 1) * 7) - 7;
      const dz = Math.floor((Math.cos(i * 2.1) + 1) * 7) - 7;
      const f = flowers[i % flowers.length] ?? 'eyeblossom';
      ctx.setBlock(px + dx, py, pz + dz, f);
    }
    ctx.broadcast('Built pale_garden: 4 pale_oak trees + creaking hearts + flowers', '#80ff80');
    return;
  }
  if (head === 'trial_chamber' || head === 'trialchamber') {
    if (!ctx.fillBlocks || !ctx.setBlock) return;
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    // 11×7×11 tuff_brick chamber with trial_spawner center, vault corners, copper_bulb lights.
    ctx.fillBlocks(px - 5, py, pz - 5, px + 5, py + 6, pz + 5, 'tuff_bricks');
    ctx.fillBlocks(px - 4, py + 1, pz - 4, px + 4, py + 5, pz + 4, 'air');
    ctx.fillBlocks(px - 5, py, pz - 5, px + 5, py, pz + 5, 'polished_tuff');
    // Center trial_spawner.
    ctx.setBlock(px, py + 1, pz, 'trial_spawner');
    // 4 vault corners.
    for (const [cx, cz] of [
      [-4, -4],
      [4, -4],
      [-4, 4],
      [4, 4],
    ] as [number, number][]) {
      ctx.setBlock(px + cx, py + 1, pz + cz, 'vault');
    }
    // Copper_bulb lights overhead.
    for (const [cx, cz] of [
      [-3, 0],
      [3, 0],
      [0, -3],
      [0, 3],
    ] as [number, number][]) {
      ctx.setBlock(px + cx, py + 5, pz + cz, 'copper_bulb');
    }
    // Door.
    ctx.setBlock(px, py + 1, pz - 5, 'air');
    ctx.setBlock(px, py + 2, pz - 5, 'air');
    ctx.broadcast('Built trial_chamber: trial_spawner + 4 vaults + copper bulbs', '#80ff80');
    return;
  }
  if (head === 'chess' || head === 'checkerboard') {
    if (!ctx.setBlock) return;
    const r = Math.max(2, Math.min(12, parseInt(args[0] ?? '4', 10)));
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    let n = 0;
    for (let dx = -r; dx <= r; dx++) {
      for (let dz = -r; dz <= r; dz++) {
        const c = ((dx + dz) % 2 === 0 ? 'wool_white' : 'wool_black') as string;
        ctx.setBlock(px + dx, py - 1, pz + dz, c);
        n++;
      }
    }
    ctx.broadcast(`Chessboard: ${String((2 * r + 1) ** 2)} cells (${String(n)} placed)`, '#80ff80');
    return;
  }
  if (head === 'fortress' || head === 'castle_walls') {
    if (!ctx.fillBlocks || !ctx.setBlock) return;
    const r = Math.max(6, Math.min(20, parseInt(args[0] ?? '12', 10)));
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    // Square cobblestone walls 5 high with crenellations.
    for (let dx = -r; dx <= r; dx++) {
      ctx.fillBlocks(px + dx, py, pz - r, px + dx, py + 4, pz - r, 'cobblestone');
      ctx.fillBlocks(px + dx, py, pz + r, px + dx, py + 4, pz + r, 'cobblestone');
    }
    for (let dz = -r; dz <= r; dz++) {
      ctx.fillBlocks(px - r, py, pz + dz, px - r, py + 4, pz + dz, 'cobblestone');
      ctx.fillBlocks(px + r, py, pz + dz, px + r, py + 4, pz + dz, 'cobblestone');
    }
    // Crenellations every 2 blocks.
    for (let i = -r; i <= r; i += 2) {
      ctx.setBlock(px + i, py + 5, pz - r, 'cobblestone');
      ctx.setBlock(px + i, py + 5, pz + r, 'cobblestone');
      ctx.setBlock(px - r, py + 5, pz + i, 'cobblestone');
      ctx.setBlock(px + r, py + 5, pz + i, 'cobblestone');
    }
    // 4 corner watchtowers.
    for (const [cx, cz] of [
      [-r, -r],
      [r, -r],
      [-r, r],
      [r, r],
    ] as [number, number][]) {
      ctx.fillBlocks(px + cx - 1, py, pz + cz - 1, px + cx + 1, py + 7, pz + cz + 1, 'cobblestone');
      ctx.fillBlocks(px + cx, py, pz + cz, px + cx, py + 6, pz + cz, 'air');
      ctx.setBlock(px + cx, py + 7, pz + cz, 'lantern');
    }
    // Gate at -Z.
    ctx.fillBlocks(px - 1, py, pz - r, px + 1, py + 2, pz - r, 'air');
    ctx.broadcast(
      `Built fortress: ${String(2 * r + 1)}×${String(2 * r + 1)} walls + 4 towers`,
      '#80ff80',
    );
    return;
  }
  if (head === 'beacon_pyramid' || head === 'beaconbase') {
    if (!ctx.fillBlocks) return;
    const tier = parseInt(args[0] ?? '4', 10);
    if (!Number.isFinite(tier) || tier < 1 || tier > 4) {
      ctx.broadcast('Usage: /beacon_pyramid <tier=4>', '#ff8080');
      return;
    }
    const block = args[1] ?? 'iron_block';
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    for (let t = 0; t < tier; t++) {
      const r = tier - t;
      ctx.fillBlocks(px - r, py - tier + t, pz - r, px + r, py - tier + t, pz + r, block);
    }
    ctx.setBlock?.(px, py, pz, 'beacon');
    ctx.broadcast(`Beacon tier ${String(tier)} pyramid + beacon on top`, '#80ffff');
    return;
  }
  if (head === 'campfire_circle' || head === 'cfc') {
    if (!ctx.setBlock) return;
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    ctx.setBlock(px, py, pz, 'campfire');
    for (let i = 0; i < 8; i++) {
      const ang = (i / 8) * Math.PI * 2;
      const r = 3;
      const cx = px + Math.round(Math.cos(ang) * r);
      const cz = pz + Math.round(Math.sin(ang) * r);
      ctx.setBlock(cx, py, cz, 'oak_log');
    }
    ctx.broadcast('Campfire circle: campfire center + 8 log seats', '#ff8080');
    return;
  }
  if (head === 'animalpen' || head === 'pen') {
    if (!ctx.fillBlocks || !ctx.summon) return;
    const kind = args[0] ?? 'cow';
    const r = parseInt(args[1] ?? '4', 10);
    if (!Number.isFinite(r) || r < 2 || r > 8) {
      ctx.broadcast('Usage: /pen <kind=cow> <r=4>', '#ff8080');
      return;
    }
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    // Fence ring + grass interior.
    for (let dx = -r; dx <= r; dx++) {
      ctx.setBlock?.(px + dx, py, pz - r, 'oak_fence');
      ctx.setBlock?.(px + dx, py, pz + r, 'oak_fence');
    }
    for (let dz = -r; dz <= r; dz++) {
      ctx.setBlock?.(px - r, py, pz + dz, 'oak_fence');
      ctx.setBlock?.(px + r, py, pz + dz, 'oak_fence');
    }
    ctx.fillBlocks(px - r + 1, py - 1, pz - r + 1, px + r - 1, py - 1, pz + r - 1, 'grass_block');
    let n = 0;
    for (let i = 0; i < 4; i++) {
      if (
        ctx.summon(
          kind,
          px + (Math.random() - 0.5) * (r * 2),
          py,
          pz + (Math.random() - 0.5) * (r * 2),
        )
      )
        n++;
    }
    ctx.broadcast(`Built ${kind} pen: r=${String(r)} fence + ${String(n)} ${kind}`, '#80ff80');
    return;
  }
  if (head === 'cropfields' || head === 'allfields') {
    if (!ctx.fillBlocks || !ctx.setBlock) return;
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    const CROPS = ['wheat', 'carrots', 'potatoes', 'beetroots'];
    const SIZE = 5;
    for (let i = 0; i < 4; i++) {
      const ox = (i % 2) * (SIZE + 1);
      const oz = Math.floor(i / 2) * (SIZE + 1);
      ctx.fillBlocks(
        px + ox,
        py - 1,
        pz + oz,
        px + ox + SIZE - 1,
        py - 1,
        pz + oz + SIZE - 1,
        'farmland',
      );
      const crop = CROPS[i] ?? 'wheat';
      for (let dx = 0; dx < SIZE; dx++) {
        for (let dz = 0; dz < SIZE; dz++) {
          ctx.setBlock(px + ox + dx, py, pz + oz + dz, crop);
        }
      }
    }
    ctx.broadcast('4 crop fields planted (wheat / carrots / potatoes / beetroots)', '#80ff80');
    return;
  }
  if (head === 'monument' || head === 'oceanmonument') {
    if (!ctx.fillBlocks) return;
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    // 10×10×10 prismarine monument structure.
    ctx.fillBlocks(px, py, pz, px + 9, py + 9, pz + 9, 'prismarine');
    ctx.fillBlocks(px + 1, py + 1, pz + 1, px + 8, py + 8, pz + 8, 'prismarine_bricks');
    ctx.fillBlocks(px + 2, py + 2, pz + 2, px + 7, py + 7, pz + 7, 'air');
    ctx.fillBlocks(px + 4, py + 4, pz + 4, px + 5, py + 5, pz + 5, 'sea_lantern');
    ctx.broadcast('Ocean monument: 10×10×10 prismarine + sea_lantern core', '#80c0ff');
    return;
  }
  if (head === 'stronghold') {
    if (!ctx.fillBlocks) return;
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    // Cobble end-portal frame (3×3 ring) on stone_bricks plaza.
    ctx.fillBlocks(px - 3, py - 1, pz - 3, px + 3, py - 1, pz + 3, 'stone_bricks');
    // Frame: 12 end_portal_frame blocks ringing 3×3 hollow.
    for (let dx = -1; dx <= 1; dx++) {
      ctx.setBlock?.(px + dx, py, pz - 1, 'end_portal_frame');
      ctx.setBlock?.(px + dx, py, pz + 1, 'end_portal_frame');
    }
    for (let dz = -1; dz <= 1; dz++) {
      ctx.setBlock?.(px - 1, py, pz + dz, 'end_portal_frame');
      ctx.setBlock?.(px + 1, py, pz + dz, 'end_portal_frame');
    }
    ctx.fillBlocks(px, py, pz, px, py, pz, 'end_portal');
    ctx.broadcast('Stronghold portal room: 3×3 frame + end_portal core', '#a060ff');
    return;
  }
  if (head === 'cherry_world' || head === 'sakura') {
    if (!ctx.fillBlocks || !ctx.setBlock) return;
    const r = parseInt(args[0] ?? '20', 10);
    if (!Number.isFinite(r) || r < 4 || r > 64) return;
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    ctx.fillBlocks(px - r, py - 1, pz - r, px + r, py - 1, pz + r, 'grass_block');
    for (let i = 0; i < 14; i++) {
      const cx = px + Math.floor((Math.random() - 0.5) * 2 * r);
      const cz = pz + Math.floor((Math.random() - 0.5) * 2 * r);
      const trunkH = 5 + Math.floor(Math.random() * 3);
      for (let h = 0; h < trunkH; h++) ctx.setBlock(cx, py + h, cz, 'cherry_log');
      for (let dx = -3; dx <= 3; dx++) {
        for (let dz = -3; dz <= 3; dz++) {
          if (Math.abs(dx) + Math.abs(dz) > 4) continue;
          if (Math.random() < 0.7) ctx.setBlock(cx + dx, py + trunkH, cz + dz, 'cherry_leaves');
        }
      }
    }
    ctx.broadcast('🌸 Cherry blossom biome with 14 cherry trees', '#ff80c0');
    return;
  }
  if (head === 'amethyst_geode' || head === 'geode') {
    if (!ctx.fillBlocks) return;
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    // 9³ outer smooth_basalt → 7³ calcite → 5³ amethyst_block + 3 budding_amethyst.
    ctx.fillBlocks(px - 4, py - 4, pz - 4, px + 4, py + 4, pz + 4, 'smooth_basalt');
    ctx.fillBlocks(px - 3, py - 3, pz - 3, px + 3, py + 3, pz + 3, 'calcite');
    ctx.fillBlocks(px - 2, py - 2, pz - 2, px + 2, py + 2, pz + 2, 'amethyst_block');
    for (let i = 0; i < 3; i++) {
      const dx = Math.floor((Math.random() - 0.5) * 4);
      const dy = Math.floor((Math.random() - 0.5) * 4);
      const dz = Math.floor((Math.random() - 0.5) * 4);
      ctx.setBlock?.(px + dx, py + dy, pz + dz, 'budding_amethyst');
    }
    ctx.fillBlocks(px - 1, py - 1, pz - 1, px + 1, py + 1, pz + 1, 'air');
    ctx.broadcast('💎 Amethyst geode (9³ smooth_basalt → calcite → amethyst hollow)', '#a060ff');
    return;
  }
  if (head === 'end_world' || head === 'end_island') {
    if (!ctx.fillBlocks || !ctx.setBlock) return;
    const r = parseInt(args[0] ?? '24', 10);
    if (!Number.isFinite(r) || r < 4 || r > 64) return;
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    ctx.fillBlocks(px - r, py - 1, pz - r, px + r, py - 1, pz + r, 'end_stone');
    for (const [dx, dz] of [
      [-r + 4, -r + 4],
      [r - 4, -r + 4],
      [-r + 4, r - 4],
      [r - 4, r - 4],
    ] as const) {
      for (let h = 0; h < 12; h++) ctx.setBlock(px + dx, py + h, pz + dz, 'obsidian');
      ctx.setBlock(px + dx, py + 12, pz + dz, 'end_crystal');
    }
    ctx.broadcast('End island with 4 obsidian pillars + crystals', '#a060ff');
    return;
  }
  if (head === 'mushroom_world' || head === 'mushroomland') {
    if (!ctx.fillBlocks || !ctx.setBlock) return;
    const r = parseInt(args[0] ?? '20', 10);
    if (!Number.isFinite(r) || r < 4 || r > 64) return;
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    ctx.fillBlocks(px - r, py - 1, pz - r, px + r, py - 1, pz + r, 'mycelium');
    for (let i = 0; i < 16; i++) {
      const cx = px + Math.floor((Math.random() - 0.5) * 2 * r);
      const cz = pz + Math.floor((Math.random() - 0.5) * 2 * r);
      const trunkH = 3 + Math.floor(Math.random() * 3);
      for (let h = 0; h < trunkH; h++) ctx.setBlock(cx, py + h, cz, 'mushroom_stem');
      const cap = Math.random() < 0.5 ? 'red_mushroom_block' : 'brown_mushroom_block';
      for (let dx = -1; dx <= 1; dx++) {
        for (let dz = -1; dz <= 1; dz++) {
          ctx.setBlock(cx + dx, py + trunkH, cz + dz, cap);
        }
      }
    }
    ctx.broadcast('Mushroom biome with 16 giant mushrooms', '#ff80c0');
    return;
  }
  if (head === 'nether_world' || head === 'nether') {
    if (!ctx.fillBlocks) return;
    const r = parseInt(args[0] ?? '20', 10);
    if (!Number.isFinite(r) || r < 4 || r > 64) return;
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    ctx.fillBlocks(px - r, py - 1, pz - r, px + r, py - 1, pz + r, 'netherrack');
    for (let i = 0; i < 6; i++) {
      const cx = px + Math.floor((Math.random() - 0.5) * 2 * r);
      const cz = pz + Math.floor((Math.random() - 0.5) * 2 * r);
      ctx.setBlock?.(cx, py - 1, cz, 'lava');
    }
    for (let i = 0; i < 4; i++) {
      const cx = px + Math.floor((Math.random() - 0.5) * 2 * r);
      const cz = pz + Math.floor((Math.random() - 0.5) * 2 * r);
      ctx.setBlock?.(cx, py - 1, cz, 'soul_sand');
      ctx.setBlock?.(cx, py, cz, 'fire');
    }
    ctx.broadcast(`Nether biome with lava lakes + soul fires`, '#ff8080');
    return;
  }
  if (head === 'jungle_world' || head === 'jungle') {
    if (!ctx.fillBlocks || !ctx.setBlock) return;
    const r = parseInt(args[0] ?? '20', 10);
    if (!Number.isFinite(r) || r < 4 || r > 64) return;
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    ctx.fillBlocks(px - r, py - 1, pz - r, px + r, py - 1, pz + r, 'grass_block');
    for (let i = 0; i < 18; i++) {
      const cx = px + Math.floor((Math.random() - 0.5) * 2 * r);
      const cz = pz + Math.floor((Math.random() - 0.5) * 2 * r);
      const trunkH = 8 + Math.floor(Math.random() * 4);
      for (let h = 0; h < trunkH; h++) ctx.setBlock(cx, py + h, cz, 'jungle_log');
      for (let dx = -3; dx <= 3; dx++) {
        for (let dz = -3; dz <= 3; dz++) {
          if (Math.abs(dx) + Math.abs(dz) > 4) continue;
          if (Math.random() < 0.7) ctx.setBlock(cx + dx, py + trunkH, cz + dz, 'jungle_leaves');
        }
      }
    }
    ctx.broadcast(`Jungle biome with 18 tall jungle trees`, '#80ff80');
    return;
  }
  if (head === 'snow_world' || head === 'icy') {
    if (!ctx.fillBlocks) return;
    const r = parseInt(args[0] ?? '24', 10);
    if (!Number.isFinite(r) || r < 4 || r > 64) return;
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    ctx.fillBlocks(px - r, py - 1, pz - r, px + r, py - 1, pz + r, 'snow_block');
    for (let i = 0; i < 6; i++) {
      const cx = px + Math.floor((Math.random() - 0.5) * 2 * r);
      const cz = pz + Math.floor((Math.random() - 0.5) * 2 * r);
      ctx.fillBlocks(cx - 2, py - 1, cz - 2, cx + 2, py - 1, cz + 2, 'ice');
    }
    ctx.broadcast(`Snow biome ${String((r * 2 + 1) ** 2)} tiles + 6 ice patches`, '#80c0ff');
    return;
  }
  if (head === 'forest_world' || head === 'forest') {
    if (!ctx.fillBlocks || !ctx.setBlock) return;
    const r = parseInt(args[0] ?? '24', 10);
    if (!Number.isFinite(r) || r < 4 || r > 64) return;
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    ctx.fillBlocks(px - r, py - 1, pz - r, px + r, py - 1, pz + r, 'grass_block');
    for (let i = 0; i < 12; i++) {
      const cx = px + Math.floor((Math.random() - 0.5) * 2 * r);
      const cz = pz + Math.floor((Math.random() - 0.5) * 2 * r);
      const trunkH = 4 + Math.floor(Math.random() * 3);
      for (let h = 0; h < trunkH; h++) ctx.setBlock(cx, py + h, cz, 'oak_log');
      for (let dx = -2; dx <= 2; dx++) {
        for (let dz = -2; dz <= 2; dz++) {
          for (let dy = trunkH - 2; dy <= trunkH; dy++) {
            if (Math.abs(dx) + Math.abs(dz) > 3) continue;
            if (dx === 0 && dz === 0 && dy < trunkH) continue;
            if (Math.random() < 0.85) ctx.setBlock(cx + dx, py + dy, cz + dz, 'oak_leaves');
          }
        }
      }
    }
    ctx.broadcast(`Forest biome with 12 trees`, '#80ff80');
    return;
  }
  if (head === 'sea' || head === 'flood') {
    if (!ctx.fillBlocks) return;
    const r = parseInt(args[0] ?? '12', 10);
    const fluid = (args[1] ?? 'water').toLowerCase();
    if (!Number.isFinite(r) || r < 4 || r > 64) {
      ctx.broadcast('Usage: /sea <r=12> [water|lava]', '#ff8080');
      return;
    }
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    const n = ctx.fillBlocks(
      px - r,
      py,
      pz - r,
      px + r,
      py,
      pz + r,
      fluid === 'lava' ? 'lava' : 'water',
    );
    ctx.broadcast(
      `Flooded with ${fluid}: ${String(n)} blocks`,
      fluid === 'lava' ? '#ff8080' : '#80a0ff',
    );
    return;
  }
  if (head === 'desert_world' || head === 'sand') {
    if (!ctx.fillBlocks) return;
    const r = parseInt(args[0] ?? '24', 10);
    if (!Number.isFinite(r) || r < 4 || r > 64) return;
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    ctx.fillBlocks(px - r, py - 1, pz - r, px + r, py - 1, pz + r, 'sand');
    for (let i = 0; i < 8; i++) {
      const x = px + Math.floor((Math.random() - 0.5) * 2 * r);
      const z = pz + Math.floor((Math.random() - 0.5) * 2 * r);
      ctx.setBlock?.(x, py, z, 'cactus');
    }
    ctx.broadcast(`Desert biome ${String((r * 2 + 1) ** 2)} tiles + 8 cactus`, '#ffd080');
    return;
  }
  if (head === 'lookuprich' || head === 'lr') {
    const name = (args[0] ?? '').toLowerCase();
    if (!name) {
      ctx.broadcast('Usage: /lookuprich <name>', '#ff8080');
      return;
    }
    const isBlock = ctx.lookupBlock?.(name) ?? false;
    const isItem = ctx.lookupItem?.(name) ?? false;
    if (!isBlock && !isItem) {
      ctx.broadcast(`✘ ${name}: not found`, '#ff8080');
      return;
    }
    ctx.broadcast(`${isBlock ? '🟧 block ' : ''}${isItem ? '🎒 item ' : ''}${name}`, '#80ff80');
    return;
  }
  if (head === 'gridmark') {
    if (!ctx.fillBlocks) return;
    const r = parseInt(args[0] ?? '32', 10);
    const block = args[1] ?? 'glowstone';
    const step = parseInt(args[2] ?? '8', 10);
    if (!Number.isFinite(r) || r < 4 || r > 64 || !Number.isFinite(step) || step < 2 || step > 32) {
      ctx.broadcast('Usage: /gridmark <r=32> [block=glowstone] [step=8]', '#ff8080');
      return;
    }
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    let n = 0;
    for (let dx = -r; dx <= r; dx += step) {
      for (let dz = -r; dz <= r; dz += step) {
        ctx.setBlock?.(px + dx, py - 1, pz + dz, block);
        n++;
      }
    }
    ctx.broadcast(`Grid markers: ${String(n)} ${block} at every ${String(step)}`, '#80ff80');
    return;
  }
  if (head === 'wisdom' || head === 'fortune') {
    const SAYINGS = [
      'A diamond is a piece of coal that handled stress well.',
      'In Minecraft, the sun rises every 20 minutes — make it count.',
      'The best time to plant a tree was 20 minutes ago. The next best time is now.',
      'Creepers respect personal space. Give them yours.',
      'Build like nobody is watching. Mine like everyone is.',
      'The cave is dark and full of terrors.',
      'Survival starts at the second cobblestone.',
      'Sleep when the sun sets, dig when the sun rises.',
      'Every redstone circuit is a story untold.',
      'The world is your sandbox.',
    ];
    const s = SAYINGS[Math.floor(Math.random() * SAYINGS.length)] ?? '';
    ctx.broadcast(`🥠 ${s}`, '#ffd080');
    return;
  }
  if (head === 'compliment') {
    const C = [
      'You are a master builder.',
      'Your aim is legendary.',
      'You smell like victory.',
      'Your mining technique is poetry.',
      'You are tougher than netherite.',
    ];
    ctx.broadcast(`✨ ${C[Math.floor(Math.random() * C.length)] ?? ''}`, '#ff80c0');
    return;
  }
  if (head === 'salute' || head === 'gg') {
    if (ctx.showTitle) ctx.showTitle('GG!', '#80ff80', 1500);
    ctx.broadcast('🫡 GG', '#80ff80');
    return;
  }
  if (head === 'note' || head === 'memo') {
    const text = args.join(' ').trim();
    if (!text) {
      ctx.broadcast('Usage: /note <text>', '#ff8080');
      return;
    }
    ctx.broadcast(`📝 ${text}`, '#ffd080');
    if (ctx.copyToClipboard) {
      void ctx.copyToClipboard(text).then((ok) => {
        if (ok) ctx.broadcast('(also copied to clipboard)', '#cccccc');
      });
    }
    return;
  }
  if (head === 'time_quick' || head === 'tq') {
    const v = (args[0] ?? '').toLowerCase();
    const map: Record<string, number> = {
      dawn: 0,
      sunrise: 0,
      morning: 1500,
      noon: 6000,
      afternoon: 9000,
      dusk: 12000,
      sunset: 12000,
      night: 14000,
      midnight: 18000,
      latenight: 21000,
    };
    if (v in map) {
      ctx.setTimeOfDay(map[v]!);
      ctx.broadcast(`Time → ${v}`, '#ffd080');
      return;
    }
    ctx.broadcast(`Usage: /time_quick <${Object.keys(map).join('|')}>`, '#ff8080');
    return;
  }
  if (head === 'highlight' || head === 'mark_block') {
    if (!ctx.lookAtBlock) return;
    const hit = ctx.lookAtBlock();
    if (!hit) {
      ctx.broadcast('Nothing in reach.', '#ffd080');
      return;
    }
    ctx.setWaypoint?.('marked', hit.x, hit.y, hit.z);
    ctx.broadcast(
      `Marked ${hit.name} @ ${String(hit.x)} ${String(hit.y)} ${String(hit.z)} as 'marked' waypoint`,
      '#80ff80',
    );
    return;
  }
  if (head === 'gotomark' || head === 'tpmark') {
    if (!ctx.getWaypoint) return;
    const wp = ctx.getWaypoint('marked');
    if (!wp) {
      ctx.broadcast('No marked block. Use /highlight first.', '#ff8080');
      return;
    }
    lastTpFrom = { x: ctx.playerPos.x, y: ctx.playerPos.y, z: ctx.playerPos.z };
    ctx.setPlayerPos(wp.x + 0.5, wp.y + 1, wp.z + 0.5);
    ctx.broadcast('Teleported to mark', '#80ff80');
    return;
  }
  if (head === 'lookreport' || head === 'aim_info') {
    if (!ctx.lookAtBlock) return;
    const hit = ctx.lookAtBlock();
    if (!hit) {
      ctx.broadcast('Nothing in reach.', '#ffd080');
      return;
    }
    const dx = hit.x + 0.5 - ctx.playerPos.x;
    const dy = hit.y + 0.5 - ctx.playerPos.y;
    const dz = hit.z + 0.5 - ctx.playerPos.z;
    const d = Math.hypot(dx, dy, dz);
    ctx.broadcast(
      `${hit.name} @ ${String(hit.x)} ${String(hit.y)} ${String(hit.z)}  ${d.toFixed(2)}m`,
      '#cccccc',
    );
    return;
  }
  if (head === 'unpause' || head === 'play') {
    if (ctx.setTickFrozen) ctx.setTickFrozen(false);
    ctx.broadcast('▶ Game un-paused.', '#80ff80');
    return;
  }
  if (head === 'pausegame') {
    if (ctx.setTickFrozen) ctx.setTickFrozen(true);
    ctx.broadcast('⏸ Game paused (tick frozen).', '#ffd080');
    return;
  }
  if (head === 'tpall' || head === 'tpmobs') {
    if (!ctx.tpAllMobsTo) {
      ctx.broadcast('TP-mobs unavailable.', '#ff8080');
      return;
    }
    const n = ctx.tpAllMobsTo();
    ctx.broadcast(`Teleported ${String(n)} mobs to your position`, '#80ff80');
    return;
  }
  if (head === 'levelup' || head === 'lvlup') {
    ctx.giveXp?.(50);
    if (ctx.showTitle) ctx.showTitle('LEVEL UP', '#80ff80', 1500);
    ctx.broadcast('+50 XP', '#80ff80');
    return;
  }
  if (head === 'tankmode' || head === 'tank') {
    if (!ctx.applyEffect) return;
    ctx.applyEffect('resistance', 4, 600);
    ctx.applyEffect('absorption', 3, 600);
    ctx.applyEffect('regeneration', 1, 600);
    ctx.broadcast('Tank: RES V + ABS IV + REGEN II for 10min', '#80a0ff');
    return;
  }
  if (head === 'speedrun_pro' || head === 'srpro') {
    if (!ctx.applyEffect) return;
    ctx.applyEffect('speed', 4, 600);
    ctx.applyEffect('jump_boost', 3, 600);
    ctx.applyEffect('saturation', 9, 600);
    ctx.applyEffect('regeneration', 1, 600);
    ctx.broadcast('Speedrun: SPEED V + JUMP IV + SATURATION + REGEN for 10min', '#80ff80');
    return;
  }
  if (head === 'showcase' || head === 'demoworld') {
    if (!ctx.fillBlocks) return;
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    // Showcase platform: 64×64 of various blocks in a checker grid.
    const PALETTE = [
      'cobblestone',
      'oak_planks',
      'spruce_planks',
      'birch_planks',
      'sandstone',
      'red_sandstone',
      'stone_bricks',
      'mossy_cobblestone',
      'bricks',
      'andesite',
      'diorite',
      'granite',
      'glass',
      'glowstone',
      'lapis_block',
      'iron_block',
      'gold_block',
      'diamond_block',
      'quartz_block',
      'purpur_block',
      'wool_white',
      'wool_red',
      'wool_blue',
      'wool_green',
      'terracotta',
      'concrete',
      'amethyst_block',
      'crying_obsidian',
      'sea_lantern',
      'shroomlight',
      'sponge',
      'hay_block',
    ];
    let i = 0;
    for (let dz = 0; dz < 8; dz++) {
      for (let dx = 0; dx < 4; dx++) {
        const block = PALETTE[i++ % PALETTE.length] ?? 'stone';
        ctx.fillBlocks(
          px + dx * 8,
          py - 1,
          pz + dz * 8,
          px + dx * 8 + 7,
          py - 1,
          pz + dz * 8 + 7,
          block,
        );
      }
    }
    ctx.broadcast(
      `Showcase platform: 32×64 with ${String(PALETTE.length)} block samples`,
      '#80ff80',
    );
    return;
  }
  if (head === 'rainbow') {
    if (!ctx.fillBlocks) return;
    const len = parseInt(args[0] ?? '32', 10);
    if (!Number.isFinite(len) || len < 1 || len > 256) {
      ctx.broadcast('Usage: /rainbow <length=32>', '#ff8080');
      return;
    }
    const COLORS = [
      'wool_red',
      'wool_orange',
      'wool_yellow',
      'wool_green',
      'wool_blue',
      'wool_purple',
      'wool_pink',
    ];
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y) + 5;
    const pz = Math.floor(ctx.playerPos.z);
    for (let i = 0; i < COLORS.length; i++) {
      ctx.fillBlocks(px - i, py + i, pz, px - i, py + i, pz + len - 1, COLORS[i] ?? 'wool_white');
    }
    ctx.broadcast(`Rainbow stripe ${String(len)} long`, '#80ff80');
    return;
  }
  if (head === 'wave' || head === 'crowd') {
    if (!ctx.summon) return;
    const count = parseInt(args[0] ?? '20', 10);
    if (!Number.isFinite(count) || count < 1 || count > 100) {
      ctx.broadcast('Usage: /wave <count=20>', '#ff8080');
      return;
    }
    const KINDS = ['zombie', 'skeleton', 'spider', 'creeper', 'enderman'];
    let n = 0;
    for (let i = 0; i < count; i++) {
      const kind = KINDS[Math.floor(Math.random() * KINDS.length)] ?? 'zombie';
      const ang = (i / count) * Math.PI * 2;
      const r = 6 + Math.random() * 6;
      const x = ctx.playerPos.x + Math.cos(ang) * r;
      const z = ctx.playerPos.z + Math.sin(ang) * r;
      if (ctx.summon(kind, x, ctx.playerPos.y + 1, z)) n++;
    }
    if (ctx.showTitle) ctx.showTitle(`Wave incoming! ${String(n)} mobs`, '#ff8080', 2500);
    ctx.broadcast(`⚔ Wave: ${String(n)} mixed hostile mobs spawned in a ring`, '#ff8080');
    return;
  }
  if (head === 'rampage') {
    if (!ctx.applyEffect) return;
    ctx.applyEffect('strength', 4, 60);
    ctx.applyEffect('speed', 2, 60);
    ctx.applyEffect('resistance', 2, 60);
    if (ctx.showTitle) ctx.showTitle('RAMPAGE', '#ff8080', 2000);
    ctx.broadcast('Rampage: STR V + SPEED III + RES III for 60s', '#ff8080');
    return;
  }
  if (head === 'timer') {
    const sec = parseInt(args[0] ?? '60', 10);
    if (!Number.isFinite(sec) || sec < 1 || sec > 3600) {
      ctx.broadcast('Usage: /timer <seconds=60>', '#ff8080');
      return;
    }
    ctx.broadcast(`⏰ Timer set: ${String(sec)}s`, '#80ff80');
    setTimeout(() => {
      if (ctx.showTitle) ctx.showTitle('⏰ Time!', '#ffd080', 3000);
      ctx.broadcast('⏰ Timer finished', '#ffd080');
    }, sec * 1000);
    return;
  }
  if (head === 'countdown' || head === 'cd') {
    const sec = parseInt(args[0] ?? '5', 10);
    if (!Number.isFinite(sec) || sec < 1 || sec > 30) {
      ctx.broadcast('Usage: /countdown <1-30>', '#ff8080');
      return;
    }
    for (let i = sec; i > 0; i--) {
      setTimeout(
        () => {
          if (ctx.showTitle) ctx.showTitle(String(i), '#ffd080', 900);
        },
        (sec - i) * 1000,
      );
    }
    setTimeout(() => {
      if (ctx.showTitle) ctx.showTitle('GO!', '#80ff80', 1200);
    }, sec * 1000);
    ctx.broadcast(`Countdown ${String(sec)}s started`, '#80ff80');
    return;
  }
  if (head === 'redstone_demo' || head === 'rsdemo') {
    if (!ctx.setBlock) return;
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    // Lever -> redstone -> redstone_lamp.
    ctx.setBlock(px, py, pz, 'lever');
    for (let i = 1; i <= 5; i++) ctx.setBlock(px, py - 1, pz + i, 'redstone_wire');
    ctx.setBlock(px, py - 1, pz + 6, 'redstone_lamp');
    ctx.broadcast('Redstone demo: lever → 5 wire → lamp', '#80ff80');
    return;
  }
  if (head === 'pixelart' && args.length >= 1) {
    if (!ctx.setBlock) return;
    const text = args.join(' ').toUpperCase();
    if (text.length > 12) {
      ctx.broadcast('Usage: /pixelart <text up to 12 chars>', '#ff8080');
      return;
    }
    const FONT: Record<string, string[]> = {
      A: ['.X.', 'XXX', 'X.X'],
      B: ['XX.', 'XXX', 'XX.'],
      C: ['XXX', 'X..', 'XXX'],
      D: ['XX.', 'X.X', 'XX.'],
      E: ['XXX', 'XX.', 'XXX'],
      F: ['XXX', 'XX.', 'X..'],
      G: ['XXX', 'X.X', 'XXX'],
      H: ['X.X', 'XXX', 'X.X'],
      I: ['XXX', '.X.', 'XXX'],
      L: ['X..', 'X..', 'XXX'],
      M: ['X.X', 'XXX', 'X.X'],
      N: ['XX.', 'X.X', '.XX'],
      O: ['XXX', 'X.X', 'XXX'],
      P: ['XXX', 'XX.', 'X..'],
      R: ['XX.', 'X.X', 'X.X'],
      S: ['XXX', '.X.', 'XXX'],
      T: ['XXX', '.X.', '.X.'],
      U: ['X.X', 'X.X', 'XXX'],
      W: ['X.X', 'XXX', 'X.X'],
      Y: ['X.X', '.X.', '.X.'],
      ' ': ['...', '...', '...'],
    };
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    let dx = 0;
    for (const ch of text) {
      const glyph = FONT[ch] ?? FONT[' ']!;
      for (let row = 0; row < 3; row++) {
        const r = glyph[row]!;
        for (let col = 0; col < 3; col++) {
          if (r[col] === 'X') ctx.setBlock(px + dx + col, py + (2 - row), pz, 'glowstone');
        }
      }
      dx += 4;
    }
    ctx.broadcast(`Wrote "${text}" (${String(dx)} wide × 3 tall, glowstone)`, '#80ff80');
    return;
  }
  if (head === 'mineshaft') {
    if (!ctx.fillBlocks) return;
    const len = parseInt(args[0] ?? '32', 10);
    if (!Number.isFinite(len) || len < 4 || len > 128) {
      ctx.broadcast('Usage: /mineshaft <length=32>', '#ff8080');
      return;
    }
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    // 3x3 stripped tunnel into +Z, oak supports every 4 blocks, torches.
    ctx.fillBlocks(px - 1, py, pz, px + 1, py + 2, pz + len - 1, 'air');
    for (let i = 0; i < len; i += 4) {
      ctx.setBlock?.(px - 1, py, pz + i, 'oak_log');
      ctx.setBlock?.(px - 1, py + 2, pz + i, 'oak_log');
      ctx.setBlock?.(px + 1, py, pz + i, 'oak_log');
      ctx.setBlock?.(px + 1, py + 2, pz + i, 'oak_log');
      ctx.setBlock?.(px - 1, py + 1, pz + i, 'oak_planks');
      ctx.setBlock?.(px + 1, py + 1, pz + i, 'oak_planks');
      ctx.setBlock?.(px, py + 2, pz + i + 2, 'torch');
    }
    ctx.broadcast(`Mineshaft ${String(len)} long (oak supports + torches)`, '#80ff80');
    return;
  }
  if (head === 'staircase') {
    if (!ctx.setBlock) return;
    const len = parseInt(args[0] ?? '20', 10);
    const dir = (args[1] ?? 'up').toLowerCase();
    if (!Number.isFinite(len) || len < 1 || len > 128) {
      ctx.broadcast('Usage: /staircase <length=20> [up|down]', '#ff8080');
      return;
    }
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    const sign = dir === 'down' ? -1 : 1;
    for (let i = 0; i < len; i++) {
      ctx.setBlock(px, py + i * sign, pz + i, 'cobblestone');
      ctx.setBlock(px, py + i * sign + 1, pz + i, 'air');
      ctx.setBlock(px, py + i * sign + 2, pz + i, 'air');
    }
    ctx.broadcast(`${dir} staircase ${String(len)} long`, '#80ff80');
    return;
  }
  if (head === 'arena') {
    if (!ctx.fillBlocks) return;
    const r = parseInt(args[0] ?? '12', 10);
    if (!Number.isFinite(r) || r < 4 || r > 32) {
      ctx.broadcast('Usage: /arena <r=12>', '#ff8080');
      return;
    }
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    ctx.fillBlocks(px - r, py - 1, pz - r, px + r, py - 1, pz + r, 'sand');
    ctx.fillBlocks(px - r, py, pz - r, px + r, py + 5, pz - r, 'cobblestone');
    ctx.fillBlocks(px - r, py, pz + r, px + r, py + 5, pz + r, 'cobblestone');
    ctx.fillBlocks(px - r, py, pz - r, px - r, py + 5, pz + r, 'cobblestone');
    ctx.fillBlocks(px + r, py, pz - r, px + r, py + 5, pz + r, 'cobblestone');
    for (let i = -r + 4; i <= r - 4; i += 4) {
      ctx.setBlock?.(px - r, py + 4, pz + i, 'glowstone');
      ctx.setBlock?.(px + r, py + 4, pz + i, 'glowstone');
      ctx.setBlock?.(px + i, py + 4, pz - r, 'glowstone');
      ctx.setBlock?.(px + i, py + 4, pz + r, 'glowstone');
    }
    ctx.broadcast(`Arena r=${String(r)}`, '#80ff80');
    return;
  }
  if (head === 'castle') {
    if (!ctx.fillBlocks) return;
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    ctx.fillBlocks(px, py, pz, px + 10, py + 5, pz, 'stone_bricks');
    ctx.fillBlocks(px, py, pz + 10, px + 10, py + 5, pz + 10, 'stone_bricks');
    ctx.fillBlocks(px, py, pz, px, py + 5, pz + 10, 'stone_bricks');
    ctx.fillBlocks(px + 10, py, pz, px + 10, py + 5, pz + 10, 'stone_bricks');
    ctx.fillBlocks(px + 1, py, pz + 1, px + 9, py + 5, pz + 9, 'air');
    for (const [cx, cz] of [
      [0, 0],
      [10, 0],
      [0, 10],
      [10, 10],
    ] as const) {
      ctx.fillBlocks(
        px + cx - 1,
        py,
        pz + cz - 1,
        px + cx + 1,
        py + 8,
        pz + cz + 1,
        'stone_bricks',
      );
      ctx.fillBlocks(px + cx, py, pz + cz, px + cx, py + 7, pz + cz, 'air');
      ctx.setBlock?.(px + cx, py + 8, pz + cz, 'torch');
    }
    ctx.fillBlocks(px + 5, py, pz, px + 5, py + 1, pz, 'air');
    ctx.broadcast('Built a stone castle (11×11×6 + 4 towers)', '#80ff80');
    return;
  }
  if (head === 'spawnvillage' || head === 'autotown') {
    if (!ctx.fillBlocks) return;
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    // 3×3 grid of cabins around a central well.
    const SPACING = 7;
    let n = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        const cx = px + i * SPACING;
        const cz = pz + j * SPACING;
        ctx.fillBlocks(cx, py - 1, cz, cx + 2, py - 1, cz + 2, 'oak_planks');
        ctx.fillBlocks(cx, py, cz, cx + 2, py + 2, cz, 'oak_planks');
        ctx.fillBlocks(cx, py, cz + 2, cx + 2, py + 2, cz + 2, 'oak_planks');
        ctx.fillBlocks(cx, py, cz, cx, py + 2, cz + 2, 'oak_planks');
        ctx.fillBlocks(cx + 2, py, cz, cx + 2, py + 2, cz + 2, 'oak_planks');
        ctx.fillBlocks(cx, py + 3, cz, cx + 2, py + 3, cz + 2, 'oak_planks');
        ctx.fillBlocks(cx + 1, py, cz, cx + 1, py + 1, cz, 'air');
        ctx.setBlock?.(cx + 1, py + 2, cz - 1, 'torch');
        n++;
      }
    }
    // Central well.
    ctx.fillBlocks(px - 1, py, pz - 1, px + 1, py + 1, pz + 1, 'cobblestone');
    ctx.setBlock?.(px, py, pz, 'water');
    ctx.broadcast(`Built a village (${String(n)} cabins + well)`, '#80ff80');
    return;
  }
  if (head === 'maze') {
    if (!ctx.fillBlocks) return;
    const size = parseInt(args[0] ?? '15', 10);
    if (!Number.isFinite(size) || size < 5 || size > 64) {
      ctx.broadcast('Usage: /maze <size=15>', '#ff8080');
      return;
    }
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    // Outer wall.
    ctx.fillBlocks(px, py, pz, px + size - 1, py + 2, pz + size - 1, 'cobblestone');
    ctx.fillBlocks(px + 1, py, pz + 1, px + size - 2, py + 2, pz + size - 2, 'air');
    // Random interior walls (~30% density).
    for (let z = 1; z < size - 1; z++) {
      for (let x = 1; x < size - 1; x++) {
        if ((x ^ z) % 3 === 0 && Math.random() < 0.5) {
          ctx.setBlock?.(px + x, py, pz + z, 'cobblestone');
          ctx.setBlock?.(px + x, py + 1, pz + z, 'cobblestone');
        }
      }
    }
    ctx.broadcast(`Maze ${String(size)}×${String(size)}`, '#80ff80');
    return;
  }
  if (head === 'fountain') {
    if (!ctx.fillBlocks) return;
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    // 5×5 stone base + 3×3 hollow stone bowl + center water source.
    ctx.fillBlocks(px - 2, py - 1, pz - 2, px + 2, py - 1, pz + 2, 'stone_brick_slab');
    ctx.fillBlocks(px - 1, py, pz - 1, px + 1, py, pz + 1, 'stone_bricks');
    ctx.fillBlocks(px, py, pz, px, py, pz, 'water');
    ctx.setBlock?.(px, py + 1, pz, 'water');
    ctx.setBlock?.(px - 2, py, pz - 2, 'lantern');
    ctx.setBlock?.(px + 2, py, pz + 2, 'lantern');
    ctx.setBlock?.(px - 2, py, pz + 2, 'lantern');
    ctx.setBlock?.(px + 2, py, pz - 2, 'lantern');
    ctx.broadcast('Built decorative fountain', '#80ff80');
    return;
  }
  if (head === 'gardenshed' || head === 'shed') {
    if (!ctx.fillBlocks) return;
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    // 3×3×3 oak shed.
    ctx.fillBlocks(px, py, pz, px + 2, py + 2, pz + 2, 'oak_planks');
    ctx.fillBlocks(px + 1, py, pz + 1, px + 1, py + 1, pz + 1, 'air'); // hollow
    ctx.setBlock?.(px + 1, py, pz, 'air');
    ctx.setBlock?.(px + 1, py + 1, pz, 'air');
    ctx.setBlock?.(px + 1, py + 1, pz + 1, 'crafting_table');
    ctx.broadcast('Built a 3×3 garden shed', '#80ff80');
    return;
  }
  if (head === 'graveyard') {
    if (!ctx.fillBlocks || !ctx.setBlock) return;
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    // 8×8 mossy_cobblestone perimeter wall, 4 graves.
    ctx.fillBlocks(px - 4, py, pz - 4, px + 4, py + 1, pz + 4, 'cobblestone');
    ctx.fillBlocks(px - 3, py, pz - 3, px + 3, py + 1, pz + 3, 'air');
    for (let i = -2; i <= 2; i += 2) {
      ctx.setBlock(px + i, py, pz - 2, 'cobblestone');
      ctx.setBlock(px + i, py + 1, pz - 2, 'cobblestone_wall');
    }
    ctx.setBlock(px, py + 1, pz + 3, 'torch');
    ctx.broadcast('Built a graveyard', '#80ff80');
    return;
  }
  if (head === 'lake') {
    if (!ctx.fillBlocks) return;
    const r = parseInt(args[0] ?? '6', 10);
    if (!Number.isFinite(r) || r < 2 || r > 32) {
      ctx.broadcast('Usage: /lake <r=6>', '#ff8080');
      return;
    }
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    for (let dy = 0; dy < 4; dy++) {
      const lr = r - dy;
      ctx.fillBlocks(px - lr, py - dy - 1, pz - lr, px + lr, py - dy - 1, pz + lr, 'water');
    }
    for (let dx = -r; dx <= r; dx++) {
      for (let dz = -r; dz <= r; dz++) {
        const d = Math.sqrt(dx * dx + dz * dz);
        if (d > r - 1 && d <= r) ctx.setBlock?.(px + dx, py - 1, pz + dz, 'sand');
      }
    }
    ctx.broadcast(`Lake r=${String(r)} dug + filled`, '#80ff80');
    return;
  }
  if (head === 'road') {
    if (!ctx.fillBlocks) return;
    const len = parseInt(args[0] ?? '32', 10);
    const block = args[1] ?? 'gravel';
    if (!Number.isFinite(len) || len < 1 || len > 256) {
      ctx.broadcast('Usage: /road <length=32> [block=gravel]', '#ff8080');
      return;
    }
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y) - 1;
    const pz = Math.floor(ctx.playerPos.z);
    ctx.fillBlocks(px - 1, py, pz, px + 1, py, pz + len - 1, block);
    for (let i = 4; i < len; i += 8) {
      ctx.setBlock?.(px - 2, py + 1, pz + i, 'oak_fence');
      ctx.setBlock?.(px - 2, py + 2, pz + i, 'oak_fence');
      ctx.setBlock?.(px - 2, py + 3, pz + i, 'lantern');
    }
    ctx.broadcast(`Road ${String(len)} long, lit every 8 blocks`, '#80ff80');
    return;
  }
  if (head === 'island') {
    if (!ctx.fillBlocks) return;
    const r = parseInt(args[0] ?? '8', 10);
    if (!Number.isFinite(r) || r < 2 || r > 32) {
      ctx.broadcast('Usage: /island <r=8>', '#ff8080');
      return;
    }
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    // Stone hemisphere underwater + sand top + grass cap.
    for (let h = 0; h < r; h++) {
      const layerR = r - h;
      const block = h < r - 2 ? 'stone' : h < r - 1 ? 'sand' : 'grass_block';
      ctx.fillBlocks(
        px - layerR,
        py - r + h,
        pz - layerR,
        px + layerR,
        py - r + h,
        pz + layerR,
        block,
      );
    }
    ctx.broadcast(`Built a r=${String(r)} island`, '#80ff80');
    return;
  }
  if (head === 'mountain') {
    if (!ctx.fillBlocks) return;
    const r = parseInt(args[0] ?? '12', 10);
    if (!Number.isFinite(r) || r < 4 || r > 48) {
      ctx.broadcast('Usage: /mountain <r=12>', '#ff8080');
      return;
    }
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    for (let h = 0; h < r; h++) {
      const layerR = r - h;
      const block = h < 2 ? 'dirt' : h < r - 3 ? 'stone' : 'snow_block';
      ctx.fillBlocks(px - layerR, py + h, pz - layerR, px + layerR, py + h, pz + layerR, block);
    }
    ctx.broadcast(`Mountain r=${String(r)}`, '#80ff80');
    return;
  }
  if (head === 'pool') {
    if (!ctx.fillBlocks) return;
    const r = parseInt(args[0] ?? '4', 10);
    const fluid = (args[1] ?? 'water').toLowerCase();
    if (!Number.isFinite(r) || r < 1 || r > 16) {
      ctx.broadcast('Usage: /pool <r=4> [water|lava]', '#ff8080');
      return;
    }
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y) - 1;
    const pz = Math.floor(ctx.playerPos.z);
    ctx.fillBlocks(px - r, py - 1, pz - r, px + r, py - 1, pz + r, 'stone');
    ctx.fillBlocks(px - r, py, pz - r, px + r, py, pz + r, 'stone');
    ctx.fillBlocks(
      px - r + 1,
      py,
      pz - r + 1,
      px + r - 1,
      py,
      pz + r - 1,
      fluid === 'lava' ? 'lava' : 'water',
    );
    ctx.broadcast(`Built ${String((r * 2 - 1) ** 2)}-tile ${fluid} pool`, '#80ff80');
    return;
  }
  if (head === 'sky' || head === 'flightpath') {
    if (!ctx.setPlayerPos) return;
    ctx.setPlayerPos(ctx.playerPos.x, 200, ctx.playerPos.z);
    ctx.broadcast('Teleported to y=200 (sky)', '#80a0ff');
    return;
  }
  if (head === 'underground' || head === 'caves') {
    if (!ctx.setPlayerPos) return;
    ctx.setPlayerPos(ctx.playerPos.x, 16, ctx.playerPos.z);
    ctx.broadcast('Teleported to y=16 (cave layer)', '#cccccc');
    return;
  }
  if (head === 'farm') {
    if (!ctx.fillBlocks || !ctx.setBlock) return;
    const r = parseInt(args[0] ?? '4', 10);
    if (!Number.isFinite(r) || r < 1 || r > 16) {
      ctx.broadcast('Usage: /farm <half-size=4>', '#ff8080');
      return;
    }
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    // Tilled farmland surrounded by water canal.
    ctx.fillBlocks(px - r, py - 1, pz - r, px + r, py - 1, pz + r, 'farmland');
    // Water down the centerline.
    ctx.fillBlocks(px, py - 1, pz - r, px, py - 1, pz + r, 'water');
    // Plant wheat over the surface.
    for (let dx = -r; dx <= r; dx++) {
      for (let dz = -r; dz <= r; dz++) {
        if (dx === 0) continue; // skip water column
        ctx.setBlock(px + dx, py, pz + dz, 'wheat');
      }
    }
    ctx.broadcast(
      `Built ${String((r * 2 + 1) * (r * 2 + 1))}-tile wheat farm with center water canal`,
      '#80ff80',
    );
    return;
  }
  if (head === 'cabin') {
    if (!ctx.fillBlocks || !ctx.setBlock) return;
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    // 3×3×3 cozy wood cabin with door.
    ctx.fillBlocks(px, py - 1, pz, px + 2, py - 1, pz + 2, 'spruce_planks');
    ctx.fillBlocks(px, py, pz, px + 2, py + 2, pz, 'spruce_planks');
    ctx.fillBlocks(px, py, pz + 2, px + 2, py + 2, pz + 2, 'spruce_planks');
    ctx.fillBlocks(px, py, pz, px, py + 2, pz + 2, 'spruce_planks');
    ctx.fillBlocks(px + 2, py, pz, px + 2, py + 2, pz + 2, 'spruce_planks');
    ctx.fillBlocks(px, py + 3, pz, px + 2, py + 3, pz + 2, 'spruce_planks');
    ctx.fillBlocks(px + 1, py, pz, px + 1, py + 1, pz, 'air'); // door opening
    ctx.setBlock(px + 1, py, pz + 1, 'bed');
    ctx.setBlock(px + 2, py + 2, pz + 1, 'glass'); // window
    ctx.setBlock(px + 1, py + 2, pz - 1, 'torch');
    ctx.broadcast('Built a 3×3×3 spruce cabin', '#80ff80');
    return;
  }
  if (head === 'randomblock' || head === 'rb') {
    if (!ctx.listBlocks || !ctx.giveItem) return;
    const blocks = ctx.listBlocks();
    if (blocks.length === 0) return;
    const pick = blocks[Math.floor(Math.random() * blocks.length)];
    if (!pick) return;
    const ok = ctx.giveItem(pick.replace(/^webmc:/, ''), 1);
    if (ok) ctx.broadcast(`🎲 Got ${pick}`, '#80ff80');
    return;
  }
  if (head === 'randommob' || head === 'rmob') {
    if (!ctx.summon || !ctx.listMobKinds) return;
    const list = ctx.listMobKinds();
    const pick = list[Math.floor(Math.random() * list.length)] ?? 'pig';
    const ok = ctx.summon(pick, ctx.playerPos.x + 2, ctx.playerPos.y, ctx.playerPos.z + 2);
    if (ok) ctx.broadcast(`🎲 Spawned ${pick}`, '#80ff80');
    return;
  }
  if (head === 'mobcount' || head === 'mc') {
    if (!ctx.entityStats) return;
    const s = ctx.entityStats();
    ctx.broadcast(
      `Mobs: ${String(s.mobs)} (${String(s.hostile)} hostile / ${String(s.passive)} passive / ${String(s.neutral)} neutral)`,
      '#cccccc',
    );
    return;
  }
  if (head === 'chunk' || head === 'currentchunk') {
    const cx = Math.floor(ctx.playerPos.x / 16);
    const cz = Math.floor(ctx.playerPos.z / 16);
    const cy = Math.floor(ctx.playerPos.y / 16);
    ctx.broadcast(
      `Chunk (${String(cx)}, ${String(cz)}) · sub-chunk y=${String(cy)} · pos within ${(ctx.playerPos.x - cx * 16).toFixed(1)},${(ctx.playerPos.y - cy * 16).toFixed(1)},${(ctx.playerPos.z - cz * 16).toFixed(1)}`,
      '#cccccc',
    );
    return;
  }
  if (head === 'gpu' || head === 'renderer') {
    if (!ctx.gpuInfo) return;
    const g = ctx.gpuInfo();
    ctx.broadcast(`GPU: ${g.gl} / ${g.vendor} / ${g.renderer}`, '#cccccc');
    return;
  }
  if (head === 'devmode' || head === 'dev') {
    if (!ctx.setGameMode || !ctx.applyEffect) return;
    ctx.setGameMode('creative');
    ctx.applyEffect('night_vision', 0, 9999);
    ctx.applyEffect('saturation', 9, 9999);
    ctx.applyEffect('regeneration', 4, 9999);
    ctx.giveAllBlocks?.();
    if (ctx.toggleFly) ctx.toggleFly();
    if (ctx.setWalkSpeed) ctx.setWalkSpeed(2.5);
    ctx.broadcast(
      'Dev mode: creative + night vision + regen + fly + 2.5× speed + all blocks',
      '#80ff80',
    );
    return;
  }
  if (head === 'speedrun') {
    if (!ctx.setGameMode || !ctx.giveItem) return;
    ctx.setGameMode('survival');
    if (ctx.heal) ctx.heal();
    const KIT = [
      'diamond_sword',
      'diamond_pickaxe',
      'diamond_axe',
      'diamond_shovel',
      'cooked_beef',
      'enchanted_golden_apple',
      'ender_pearl',
      'flint_and_steel',
    ];
    for (const k of KIT) ctx.giveItem(k, k === 'cooked_beef' ? 16 : k === 'ender_pearl' ? 16 : 1);
    ctx.broadcast(
      'Speedrun kit: diamond tools + ender_pearls + golden_apple + flint_and_steel',
      '#80ff80',
    );
    return;
  }
  if (head === 'creator' || head === 'authorinfo') {
    ctx.broadcast('webmc: clean-room AGPL-3.0 reimplementation of MC by jmr + AI agent', '#ffd080');
    ctx.broadcast('GitHub: jiangmuran/webmc · Pages: jiangmuran.github.io/webmc/', '#cccccc');
    return;
  }
  if (head === 'goals' || head === 'objectives') {
    ctx.broadcast('— Suggested goals —', '#80ffff');
    ctx.broadcast('1. Punch trees → 4 oak_planks → /craft crafting_table', '#cccccc');
    ctx.broadcast('2. Make wooden tools → mine 8 cobblestone → stone tools', '#cccccc');
    ctx.broadcast('3. Find iron at y<60 → smelt 3 iron_ingot → iron pickaxe', '#cccccc');
    ctx.broadcast('4. Build shelter at /sethome before nightfall', '#cccccc');
    ctx.broadcast('5. Mine 10 redstone, 5 diamond → power circuits', '#cccccc');
    ctx.broadcast('6. /portal to nether (need flint_and_steel)', '#cccccc');
    ctx.broadcast('7. /dragon for endgame', '#cccccc');
    return;
  }
  if (head === 'achievements_progress' || head === 'progress') {
    if (!ctx.listAchievements) return;
    const list = ctx.listAchievements();
    const got = list.filter((a) => a.unlocked).length;
    ctx.broadcast(
      `Progress: ${String(got)}/${String(list.length)} achievements`,
      got === list.length ? '#80ff80' : '#cccccc',
    );
    return;
  }
  if (head === 'recipes' || head === 'recipebook') {
    ctx.broadcast(
      'Recipes: open inventory (E) and use the crafting grid; auto-suggest depends on held materials.',
      '#cccccc',
    );
    return;
  }
  if (head === 'totem' || head === 'undying') {
    if (!ctx.giveItem) return;
    ctx.giveItem('totem_of_undying', 1);
    ctx.broadcast('Totem of Undying given (held = revive on lethal damage)', '#80ff80');
    return;
  }
  if (head === 'meme' || head === 'noob') {
    const memes = [
      '⛏ Mining diamonds at y=12 with stone pickaxe',
      '🐺 Why is your wolf staring at me',
      '💀 Creeper landed in your house. Sorry.',
      '🐉 Just punch it harder',
      '🌋 Lava bucket = portable hot tub',
      '🎣 Fishing rod = best mob mover',
    ];
    const m = memes[Math.floor(Math.random() * memes.length)] ?? '';
    ctx.broadcast(m, '#ffd080');
    return;
  }
  if (head === 'tipoftheday' || head === 'tip') {
    const TIPS = [
      'Press F3 to see coordinates and chunk info.',
      'Right-click a sapling with bone meal to grow a tree instantly.',
      'Walk away from a lit jukebox to silence the music.',
      'Use /village to drop a starter house anywhere.',
      'Trident with rain or water = riptide propulsion.',
      'Sponge sucks up water in a 5×5×5 cube.',
      'Bone meal on grass spawns flowers + tall grass.',
      'Pressing B at night sleeps through to dawn.',
      'Splash potions hit mobs in a 4-block AoE.',
      'Type /test to run a 10-check sanity scan.',
    ];
    ctx.broadcast(`💡 ${TIPS[Math.floor(Math.random() * TIPS.length)] ?? ''}`, '#80a0ff');
    return;
  }
  if (head === 'kits' || head === 'listkits') {
    ctx.broadcast('Kits: starter, iron, diamond, netherite, mage, builder', '#cccccc');
    ctx.broadcast('Use /kit <name> to get one.', '#cccccc');
    return;
  }
  if (head === 'modes' || head === 'gamemodes') {
    ctx.broadcast('Modes: survival, creative, adventure, spectator', '#cccccc');
    ctx.broadcast('Switch with /gamemode <name> or /gmc to cycle.', '#cccccc');
    return;
  }
  if (head === 'enchants' || head === 'enchantments') {
    ctx.broadcast(
      'Enchantments registered: protection, sharpness, fortune, mending, unbreaking, infinity, fire_aspect, knockback, flame, power, sweeping, looting (visual-only IDs).',
      '#cccccc',
    );
    return;
  }
  if (head === 'effects' || head === 'allbuffs') {
    if (!ctx.applyEffect) return;
    const buffs = [
      'speed',
      'jump_boost',
      'strength',
      'regeneration',
      'resistance',
      'fire_resistance',
      'water_breathing',
      'night_vision',
      'haste',
      'absorption',
      'saturation',
    ];
    for (const b of buffs) ctx.applyEffect(b, 1, 600);
    ctx.broadcast(`Applied 11 buffs (10min)`, '#80ff80');
    return;
  }
  if (head === 'maxlevel' || head === 'maxxp') {
    ctx.setXpLevel?.(100);
    ctx.broadcast('XP level set to 100', '#80ff80');
    return;
  }
  if (head === 'godxp' || head === 'infinitexp') {
    ctx.giveXp?.(10000);
    ctx.broadcast('+10000 XP (level up flood)', '#80ff80');
    return;
  }
  if (head === 'naked' || head === 'unequip') {
    if (!ctx.unequipAll) return;
    const n = ctx.unequipAll();
    ctx.broadcast(`Unequipped ${String(n)} armor pieces (back to inventory)`, '#80ff80');
    return;
  }
  if (head === 'fastnight' || head === 'speednight') {
    ctx.setGameRule?.('doDaylightCycle', true);
    ctx.addTimeOfDay?.(12000);
    ctx.broadcast('Time fast-forward to night (+10 hours)', '#80a0ff');
    return;
  }
  if (head === 'biomename' || head === 'bn') {
    if (!ctx.biomeAt) return;
    const b = ctx.biomeAt(ctx.playerPos.x, ctx.playerPos.z);
    ctx.broadcast(`Biome here: ${b}`, '#cccccc');
    return;
  }
  if (head === 'distancetraveled' || head === 'dt') {
    if (!ctx.showStats) return;
    ctx.showStats();
    return;
  }
  if (head === 'fastday' || head === 'speedday') {
    ctx.setGameRule?.('doDaylightCycle', true);
    ctx.addTimeOfDay?.(2400);
    ctx.broadcast('Time fast-forward 2 hours', '#ffd080');
    return;
  }
  if (head === 'gamemode_cycle' || head === 'gmc') {
    if (!ctx.setGameMode) return;
    const order = ['survival', 'creative', 'adventure', 'spectator'] as const;
    const idx = order.indexOf(ctx.gameMode as (typeof order)[number]);
    const next = order[(idx + 1) % order.length] ?? 'survival';
    ctx.setGameMode(next);
    ctx.broadcast(`Mode: ${next}`, '#80ff80');
    return;
  }
  if (head === 'keys' || head === 'keybinds') {
    ctx.broadcast('— Keyboard —', '#80ffff');
    ctx.broadcast('WASD move · Space jump · Shift sneak · Ctrl/2×W sprint', '#cccccc');
    ctx.broadcast('Mouse: L=mine · R=place · M=pick · Wheel=hotbar', '#cccccc');
    ctx.broadcast('1-9 hotbar slots · Q drop · E inventory · T/⏎ chat · / commands', '#cccccc');
    ctx.broadcast('F1 hide HUD · F2 screenshot · F3 debug · F5 camera', '#cccccc');
    ctx.broadcast('B sleep · ESC pause · M minimap · K controls help', '#cccccc');
    return;
  }
  if (head === 'controls') {
    ctx.broadcast(
      'Type /keys for keyboard bindings, /tutorial for game basics, /commands for command list',
      '#cccccc',
    );
    return;
  }
  if (head === 'savestate' || head === 'savestatus') {
    if (!ctx.saveStateInfo) return;
    const s = ctx.saveStateInfo();
    ctx.broadcast(
      `Save: ${String(s.dirtyChunks)} dirty chunks · ${s.lastSaveSec.toFixed(0)}s ago`,
      '#cccccc',
    );
    return;
  }
  if (head === 'savenow' || head === 'forcesave') {
    if (ctx.save) {
      ctx.save();
      ctx.broadcast('World saved.', '#80ff80');
    }
    return;
  }
  if (head === 'healmobs' || head === 'healall') {
    if (!ctx.healMobsNear) return;
    const r = parseFloat(args[0] ?? '32');
    if (!Number.isFinite(r) || r < 1 || r > 256) {
      ctx.broadcast('Usage: /healmobs [radius=32]', '#ff8080');
      return;
    }
    const n = ctx.healMobsNear(r);
    ctx.broadcast(`Healed ${String(n)} mobs within ${r.toFixed(0)}m`, '#80ff80');
    return;
  }
  if (head === 'clearmobs' || head === 'killnear') {
    if (!ctx.killMobsNear) return;
    const r = parseFloat(args[0] ?? '32');
    if (!Number.isFinite(r) || r < 1 || r > 256) {
      ctx.broadcast('Usage: /clearmobs [radius=32]', '#ff8080');
      return;
    }
    const n = ctx.killMobsNear(r);
    ctx.broadcast(`Killed ${String(n)} mobs within ${r.toFixed(0)}m`, '#80ff80');
    return;
  }
  if (head === 'saturation' || head === 'sat') {
    if (!ctx.setSaturation) return;
    const v = parseFloat(args[0] ?? '20');
    if (!Number.isFinite(v) || v < 0 || v > 20) {
      ctx.broadcast('Usage: /saturation <0-20>', '#ff8080');
      return;
    }
    ctx.setSaturation(v);
    ctx.broadcast(`Saturation ${v.toFixed(1)}`, '#80ff80');
    return;
  }
  if (head === 'breath' || head === 'air') {
    if (!ctx.setBreath) return;
    const v = parseFloat(args[0] ?? '15');
    if (!Number.isFinite(v) || v < 0 || v > 15) {
      ctx.broadcast('Usage: /breath <0-15>', '#ff8080');
      return;
    }
    ctx.setBreath(v);
    ctx.broadcast(`Breath ${v.toFixed(1)}s`, '#80ff80');
    return;
  }
  if (head === 'level' || head === 'xplevel') {
    if (!ctx.setXpLevel) return;
    const v = parseInt(args[0] ?? '0', 10);
    if (!Number.isFinite(v) || v < 0 || v > 200) {
      ctx.broadcast('Usage: /level <0-200>', '#ff8080');
      return;
    }
    ctx.setXpLevel(v);
    ctx.broadcast(`Level ${String(v)}`, '#80ff80');
    return;
  }
  if (head === 'health' || head === 'hp') {
    if (!ctx.setHealth) return;
    const v = parseFloat(args[0] ?? '20');
    if (!Number.isFinite(v) || v < 0 || v > 200) {
      ctx.broadcast('Usage: /health <0-200>', '#ff8080');
      return;
    }
    ctx.setHealth(v);
    ctx.broadcast(`HP set to ${v.toFixed(0)}`, '#80ff80');
    return;
  }
  if (head === 'hunger' || head === 'food') {
    if (!ctx.setHunger) return;
    const v = parseFloat(args[0] ?? '20');
    if (!Number.isFinite(v) || v < 0 || v > 20) {
      ctx.broadcast('Usage: /hunger <0-20>', '#ff8080');
      return;
    }
    ctx.setHunger(v);
    ctx.broadcast(`Hunger set to ${v.toFixed(0)}`, '#80ff80');
    return;
  }
  if (head === 'reload' || head === 'remesh') {
    if (!ctx.remeshAllChunks) return;
    const n = ctx.remeshAllChunks();
    ctx.broadcast(`Re-meshed ${String(n)} chunks`, '#80ff80');
    return;
  }
  if (head === 'name' || head === 'rename_self') {
    const newName = args.join(' ').trim();
    if (!newName || newName.length > 24) {
      ctx.broadcast(
        `Current name: ${ctx.playerName ?? '(unset)'}  · usage: /name <new_name>`,
        '#cccccc',
      );
      return;
    }
    if (ctx.setPlayerName) {
      ctx.setPlayerName(newName);
      ctx.broadcast(`Renamed to ${newName}`, '#80ff80');
    }
    return;
  }
  if (head === 'count' || head === 'commandcount') {
    ctx.broadcast(`webmc has 167+ chat commands. Try /commands for categories.`, '#80a0ff');
    return;
  }
  if (head === 'pick' && args.length > 0) {
    const choice = args[Math.floor(Math.random() * args.length)] ?? '';
    ctx.broadcast(`🎯 ${choice}`, '#80ff80');
    return;
  }
  if (head === 'dropall') {
    if (!ctx.dropAllItems) return;
    const n = ctx.dropAllItems();
    ctx.broadcast(`Dropped ${String(n)} stacks at your feet`, '#80ff80');
    return;
  }
  if (head === 'inventory' || head === 'inv') {
    if (!ctx.inventoryStats) return;
    const s = ctx.inventoryStats();
    ctx.broadcast(
      `Inventory: ${String(s.filledSlots)}/${String(s.totalSlots)} slots · ${String(s.totalItems)} items · ${String(s.uniqueTypes)} unique`,
      '#cccccc',
    );
    if (s.topItems?.length) {
      const list = s.topItems
        .slice(0, 5)
        .map((t) => `${t.name}×${String(t.count)}`)
        .join(', ');
      ctx.broadcast(`Top: ${list}`, '#cccccc');
    }
    return;
  }
  if (head === 'item' || head === 'itemstats') {
    if (!ctx.heldItemInfo) {
      ctx.broadcast('Held-item info unavailable.', '#ff8080');
      return;
    }
    const info = ctx.heldItemInfo();
    if (!info) {
      ctx.broadcast('Hand empty.', '#cccccc');
      return;
    }
    ctx.broadcast(`— ${info.name} ×${String(info.count)} —`, '#ffd080');
    ctx.broadcast(
      `stack ${String(info.maxStack)}  · dura ${info.durability ? `${String(info.durability.current)}/${String(info.durability.max)}` : 'n/a'}  · food ${info.food ? `+${String(info.food.hunger)} (${info.food.saturation.toFixed(1)})` : 'n/a'}`,
      '#cccccc',
    );
    if (info.tags?.length) ctx.broadcast(`tags: ${info.tags.join(', ')}`, '#cccccc');
    return;
  }
  if (head === 'minimapzoom') {
    if (!ctx.minimapZoom) return;
    const dir = (args[0] ?? 'in').toLowerCase();
    if (dir !== 'in' && dir !== 'out') {
      ctx.broadcast('Usage: /minimapzoom <in|out>', '#ff8080');
      return;
    }
    ctx.minimapZoom(dir);
    ctx.broadcast(`Minimap zoom ${dir}`, '#80ff80');
    return;
  }
  if (head === 'cyclecam' || head === 'cyclecamera') {
    if (!ctx.cycleCamera) return;
    const next = ctx.cycleCamera();
    ctx.broadcast(`Camera: ${next}`, '#80ff80');
    return;
  }
  if (head === 'minimap') {
    if (!ctx.toggleMinimap) return;
    const on = ctx.toggleMinimap();
    ctx.broadcast(`Minimap ${on ? 'on' : 'off'}`, '#80ff80');
    return;
  }
  if (head === 'tps_target' || head === 'tickrate') {
    if (!ctx.setTickRate) {
      ctx.broadcast('Tick-rate adjustment unavailable.', '#ff8080');
      return;
    }
    const v = parseFloat(args[0] ?? '20');
    if (!Number.isFinite(v) || v < 1 || v > 100) {
      ctx.broadcast('Usage: /tickrate <1-100>', '#ff8080');
      return;
    }
    ctx.setTickRate(v);
    ctx.broadcast(`Target TPS ${v.toFixed(0)}`, '#80ff80');
    return;
  }
  if (head === 'loadout') {
    if (!ctx.saveLoadout || !ctx.loadLoadout) return;
    const sub = (args[0] ?? 'list').toLowerCase();
    const name = args[1] ?? 'default';
    if (sub === 'save') {
      ctx.saveLoadout(name);
      ctx.broadcast(`Loadout '${name}' saved`, '#80ff80');
      return;
    }
    if (sub === 'load' || sub === 'restore') {
      const ok = ctx.loadLoadout(name);
      if (ok) ctx.broadcast(`Loadout '${name}' restored`, '#80ff80');
      else ctx.broadcast(`No loadout '${name}'`, '#ff8080');
      return;
    }
    if (sub === 'list') {
      const list = ctx.listLoadouts?.() ?? [];
      if (list.length === 0) ctx.broadcast('No loadouts. Use /loadout save <name>.', '#cccccc');
      else ctx.broadcast(`Loadouts: ${list.join(', ')}`, '#cccccc');
      return;
    }
    ctx.broadcast('Usage: /loadout <save|load|list> [name=default]', '#ff8080');
    return;
  }
  if (head === 'freezemobs') {
    ctx.setGameRule?.('doMobSpawning', false);
    if (ctx.killAllMobs) {
      const n = ctx.killAllMobs();
      ctx.broadcast(`Mob spawning off + cleared ${String(n)} mobs`, '#80ff80');
    }
    return;
  }
  if (head === 'safezone') {
    ctx.setGameRule?.('doMobSpawning', false);
    if (ctx.applyEffect) {
      ctx.applyEffect('regeneration', 1, 600);
      ctx.applyEffect('saturation', 9, 600);
    }
    if (ctx.killAllMobs) ctx.killAllMobs();
    if (ctx.heal) ctx.heal();
    ctx.broadcast('Safe zone: spawning off + regen + saturation 10min', '#80ff80');
    return;
  }
  if (head === 'difficultypeaceful' || head === 'peaceful') {
    if (ctx.setDifficulty) ctx.setDifficulty('peaceful');
    if (ctx.killAllMobs) ctx.killAllMobs();
    ctx.broadcast('Difficulty: peaceful · all hostile mobs cleared', '#80ff80');
    return;
  }
  if (head === 'lighting') {
    if (!ctx.applyEffect) return;
    ctx.applyEffect('night_vision', 0, 9999);
    ctx.broadcast('Bright lighting (night_vision ~∞)', '#80ff80');
    return;
  }
  if (head === 'creative_inventory' || head === 'ci') {
    if (!ctx.openCreativeInventory) {
      ctx.broadcast('Creative inventory unavailable.', '#ff8080');
      return;
    }
    ctx.openCreativeInventory();
    return;
  }
  if (head === 'spread' || head === 'spreadplayers') {
    if (!ctx.summon) return;
    const kind = args[0] ?? 'pig';
    const count = parseInt(args[1] ?? '20', 10);
    const range = parseFloat(args[2] ?? '32');
    if (
      !Number.isFinite(count) ||
      count < 1 ||
      count > 200 ||
      !Number.isFinite(range) ||
      range < 1 ||
      range > 256
    ) {
      ctx.broadcast('Usage: /spread <kind=pig> <count=20> <range=32>', '#ff8080');
      return;
    }
    let n = 0;
    for (let i = 0; i < count; i++) {
      const ang = Math.random() * Math.PI * 2;
      const r = Math.random() * range;
      const x = ctx.playerPos.x + Math.cos(ang) * r;
      const z = ctx.playerPos.z + Math.sin(ang) * r;
      if (ctx.summon(kind, x, ctx.playerPos.y + 1, z)) n++;
    }
    ctx.broadcast(`Spread ${String(n)} ${kind} within ${String(range)}m`, '#80ff80');
    return;
  }
  if (head === 'entities' || head === 'mobs') {
    if (!ctx.entityStats) {
      ctx.broadcast('Entity stats unavailable.', '#ff8080');
      return;
    }
    const s = ctx.entityStats();
    ctx.broadcast(
      `mobs ${String(s.mobs)} (h${String(s.hostile)}/p${String(s.passive)}/n${String(s.neutral)}) drops ${String(s.drops)} xp ${String(s.xpOrbs)}`,
      '#cccccc',
    );
    if (s.byKind.length > 0) {
      ctx.broadcast(
        s.byKind
          .slice(0, 8)
          .map((k) => `${k.kind}:${String(k.count)}`)
          .join('  '),
        '#cccccc',
      );
    }
    return;
  }
  if (head === 'chunkstats' || head === 'chunks') {
    if (!ctx.chunkStats) return;
    const s = ctx.chunkStats();
    ctx.broadcast(
      `chunks loaded ${String(s.loaded)} pending ${String(s.pending)}  meshes ${String(s.meshes)}  tris ${s.triangles.toLocaleString()}`,
      '#cccccc',
    );
    return;
  }
  if (head === 'screenshot' || head === 'snap') {
    if (!ctx.screenshot) {
      ctx.broadcast('Screenshot unavailable.', '#ff8080');
      return;
    }
    ctx.screenshot();
    ctx.broadcast('Screenshot saved.', '#80ff80');
    return;
  }
  if (head === 'fov') {
    if (!ctx.setFov) return;
    const v = parseFloat(args[0] ?? '70');
    if (!Number.isFinite(v) || v < 30 || v > 120) {
      ctx.broadcast('Usage: /fov <30-120>', '#ff8080');
      return;
    }
    ctx.setFov(v);
    ctx.broadcast(`FOV ${v.toFixed(0)}°`, '#80ff80');
    return;
  }
  if (head === 'time' && (args[0] === 'now' || args[0] === 'query')) {
    const sub = args[0];
    if (sub === 'now') ctx.broadcast('Time queried (use F3 for live time)', '#cccccc');
    else ctx.broadcast(`Day ${String(Math.floor(Date.now() / 86400000) % 1000000)}`, '#cccccc');
    return;
  }
  if (head === 'where') {
    ctx.broadcast(
      `Position: ${ctx.playerPos.x.toFixed(2)} ${ctx.playerPos.y.toFixed(2)} ${ctx.playerPos.z.toFixed(2)}`,
      '#cccccc',
    );
    if (ctx.biomeAt)
      ctx.broadcast(`Biome: ${ctx.biomeAt(ctx.playerPos.x, ctx.playerPos.z)}`, '#cccccc');
    return;
  }
  if (head === 'distance' && args[0]) {
    const target = args[0].toLowerCase();
    if (target === 'spawn') {
      const d = Math.hypot(ctx.playerPos.x, ctx.playerPos.z);
      ctx.broadcast(`${d.toFixed(1)}m to spawn`, '#cccccc');
      return;
    }
    if (target === 'home' && ctx.getWaypoint) {
      const wp = ctx.getWaypoint('home');
      if (!wp) {
        ctx.broadcast('No home set.', '#ff8080');
        return;
      }
      const d = Math.hypot(wp.x - ctx.playerPos.x, wp.z - ctx.playerPos.z);
      ctx.broadcast(`${d.toFixed(1)}m to home`, '#cccccc');
      return;
    }
  }
  if (head === 'respawn' || head === 'rs') {
    if (!ctx.kill) return;
    ctx.kill();
    ctx.broadcast('Respawning…', '#cccccc');
    return;
  }
  if (head === 'fullness') {
    if (!ctx.heal || !ctx.giveItem) return;
    ctx.heal();
    ctx.broadcast('Health + hunger maxed', '#80ff80');
    return;
  }
  if (head === 'noclip') {
    if (!ctx.toggleFly) return;
    const on = ctx.toggleFly();
    ctx.broadcast(`Fly ${on ? 'on' : 'off'}`, '#80ff80');
    return;
  }
  if (head === 'mark') {
    if (!ctx.markRegionPoint) return;
    const p = (args[0] ?? 'a').toLowerCase();
    if (p !== 'a' && p !== 'b') {
      ctx.broadcast('Usage: /mark <a|b>', '#ff8080');
      return;
    }
    ctx.markRegionPoint(p);
    ctx.broadcast(
      `Region point ${p.toUpperCase()} = ${ctx.playerPos.x.toFixed(0)} ${ctx.playerPos.y.toFixed(0)} ${ctx.playerPos.z.toFixed(0)}`,
      '#80ff80',
    );
    return;
  }
  if (head === 'paste' || head === 'fillregion') {
    if (!ctx.fillRegion) return;
    const block = args[0] ?? 'stone';
    const n = ctx.fillRegion(block);
    if (n < 0) ctx.broadcast('Use /mark a then /mark b first.', '#ff8080');
    else ctx.broadcast(`Filled region with ${block} (${String(n)} blocks)`, '#80ff80');
    return;
  }
  if (head === 'wipe') {
    if (!ctx.fillRegion) return;
    const n = ctx.fillRegion('air');
    if (n < 0) ctx.broadcast('Use /mark a then /mark b first.', '#ff8080');
    else ctx.broadcast(`Wiped ${String(n)} blocks`, '#80ff80');
    return;
  }
  if (head === 'repair') {
    if (!ctx.repairHeld) {
      ctx.broadcast('Repair unavailable.', '#ff8080');
      return;
    }
    const ok = ctx.repairHeld();
    if (ok) ctx.broadcast('Held item fully repaired.', '#80ff80');
    else ctx.broadcast('Held item is not damageable.', '#ffd080');
    return;
  }
  if (head === 'durability' || head === 'dura') {
    if (!ctx.heldDurability) return;
    const d = ctx.heldDurability();
    if (!d) {
      ctx.broadcast('Held item has no durability.', '#cccccc');
      return;
    }
    const pct = Math.round((d.current / d.max) * 100);
    const color = pct > 50 ? '#80ff80' : pct > 20 ? '#ffd080' : '#ff8080';
    ctx.broadcast(`${d.name}: ${String(d.current)}/${String(d.max)} (${String(pct)}%)`, color);
    return;
  }
  if (head === 'confetti' || head === 'celebrate') {
    if (!ctx.particle) return;
    const px = ctx.playerPos.x,
      py = ctx.playerPos.y,
      pz = ctx.playerPos.z;
    for (let i = 0; i < 200; i++) {
      const ang = Math.random() * Math.PI * 2;
      const r = 0.5 + Math.random() * 6;
      ctx.particle(px + Math.cos(ang) * r, py + Math.random() * 4, pz + Math.sin(ang) * r);
    }
    if (ctx.showTitle) ctx.showTitle('🎉 GG!', '#ffd080', 1500);
    return;
  }
  if (head === 'panic') {
    if (ctx.killAllMobs) {
      const n = ctx.killAllMobs();
      ctx.broadcast(`Killed ${String(n)} mobs`, '#ff8080');
    }
    if (ctx.heal) ctx.heal();
    return;
  }
  if (head === 'buildmode' || head === 'build') {
    if (ctx.setGameMode) ctx.setGameMode('creative');
    if (ctx.applyEffect) ctx.applyEffect('night_vision', 0, 600);
    if (ctx.toggleFly?.() === false) ctx.toggleFly?.();
    if (ctx.giveAllBlocks) ctx.giveAllBlocks();
    ctx.broadcast('Build mode: creative + night vision + fly + all-blocks', '#80ff80');
    return;
  }
  if (head === 'survivalmode' || head === 'sm') {
    if (ctx.setGameMode) ctx.setGameMode('survival');
    if (ctx.clearInventory) ctx.clearInventory();
    if (ctx.heal) ctx.heal();
    ctx.broadcast('Survival mode reset', '#80ff80');
    return;
  }
  if (head === 'spectate' || head === 'sp') {
    if (!ctx.setGameMode) return;
    ctx.setGameMode('spectator');
    ctx.broadcast('Spectator mode', '#80ff80');
    return;
  }
  if (head === 'rtp' || head === 'randomtp') {
    const r = parseInt(args[0] ?? '500', 10);
    if (!Number.isFinite(r) || r < 50 || r > 50000) {
      ctx.broadcast('Usage: /rtp [radius=500] (50–50000)', '#ff8080');
      return;
    }
    const ang = Math.random() * Math.PI * 2;
    const dist = 50 + Math.random() * (r - 50);
    const tx = ctx.playerPos.x + Math.cos(ang) * dist;
    const tz = ctx.playerPos.z + Math.sin(ang) * dist;
    lastTpFrom = { x: ctx.playerPos.x, y: ctx.playerPos.y, z: ctx.playerPos.z };
    ctx.setPlayerPos(tx, ctx.playerPos.y + 100, tz);
    ctx.broadcast(
      `Random TP → ${tx.toFixed(0)} ?? ${tz.toFixed(0)} (~${dist.toFixed(0)}m)`,
      '#80ff80',
    );
    return;
  }
  if (head === 'safetp' || head === 'safe') {
    const surface = ctx.surfaceAt?.(Math.floor(ctx.playerPos.x), Math.floor(ctx.playerPos.z));
    if (surface === undefined) {
      ctx.broadcast('Surface lookup unavailable.', '#ff8080');
      return;
    }
    lastTpFrom = { x: ctx.playerPos.x, y: ctx.playerPos.y, z: ctx.playerPos.z };
    ctx.setPlayerPos(ctx.playerPos.x, surface + 2, ctx.playerPos.z);
    ctx.broadcast(`Snapped to surface y=${String(surface + 2)}`, '#80ff80');
    return;
  }
  if (head === 'home' || head === 'sethome') {
    if (head === 'sethome') {
      ctx.setWaypoint?.('home', ctx.playerPos.x, ctx.playerPos.y, ctx.playerPos.z);
      ctx.broadcast(
        `Home set @ ${ctx.playerPos.x.toFixed(1)} ${ctx.playerPos.y.toFixed(1)} ${ctx.playerPos.z.toFixed(1)}`,
        '#80ff80',
      );
      return;
    }
    const name = args[0] ?? 'home';
    if (name === 'set') {
      ctx.setWaypoint?.('home', ctx.playerPos.x, ctx.playerPos.y, ctx.playerPos.z);
      ctx.broadcast(`Home set`, '#80ff80');
      return;
    }
    if (name === 'list') {
      const list = ctx.listWaypoints?.() ?? [];
      if (list.length === 0) ctx.broadcast('No homes. Use /sethome.', '#cccccc');
      else
        for (const wp of list)
          ctx.broadcast(
            `${wp.name}: ${wp.x.toFixed(1)} ${wp.y.toFixed(1)} ${wp.z.toFixed(1)}`,
            '#cccccc',
          );
      return;
    }
    const wp = ctx.getWaypoint?.(name);
    if (!wp) {
      ctx.broadcast(`No home '${name}'. Use /sethome or /home set.`, '#ff8080');
      return;
    }
    lastTpFrom = { x: ctx.playerPos.x, y: ctx.playerPos.y, z: ctx.playerPos.z };
    ctx.setPlayerPos(wp.x, wp.y, wp.z);
    ctx.broadcast(`Home '${name}'`, '#80ff80');
    return;
  }
  if (head === 'jump') {
    if (!ctx.applyVelocity) return;
    const power = parseFloat(args[0] ?? '12');
    if (!Number.isFinite(power) || power < 0 || power > 50) {
      ctx.broadcast('Usage: /jump [power=12]', '#ff8080');
      return;
    }
    ctx.applyVelocity(0, power, 0);
    ctx.broadcast(`Boosted ${power.toFixed(0)} m/s up`, '#80ff80');
    return;
  }
  if (head === 'launch') {
    if (!ctx.applyVelocity) return;
    const fwd = parseFloat(args[0] ?? '20');
    const up = parseFloat(args[1] ?? '15');
    if (!Number.isFinite(fwd) || !Number.isFinite(up)) {
      ctx.broadcast('Usage: /launch [fwd=20] [up=15]', '#ff8080');
      return;
    }
    ctx.applyVelocity(fwd, up, 0);
    ctx.broadcast(`Launched ${fwd.toFixed(0)} fwd, ${up.toFixed(0)} up`, '#80ff80');
    return;
  }
  if (head === 'nv' || head === 'nightvision') {
    if (!ctx.applyEffect) return;
    ctx.applyEffect('night_vision', 0, 600);
    ctx.broadcast('Night vision 10min', '#80ff80');
    return;
  }
  if (head === 'invis' || head === 'invisible') {
    if (!ctx.applyEffect) return;
    const sec = parseInt(args[0] ?? '120', 10);
    ctx.applyEffect(
      'invisibility',
      0,
      Math.max(1, Math.min(600, Number.isFinite(sec) ? sec : 120)),
    );
    ctx.broadcast(`Invisible ${String(sec)}s`, '#80ff80');
    return;
  }
  if (head === 'god' || head === 'godmode') {
    if (!ctx.applyEffect) return;
    ctx.applyEffect('resistance', 4, 600);
    ctx.applyEffect('regeneration', 4, 600);
    ctx.applyEffect('saturation', 9, 600);
    ctx.applyEffect('water_breathing', 0, 600);
    ctx.applyEffect('fire_resistance', 0, 600);
    ctx.broadcast('God mode for 10min (resist 5 + regen 5 + sat + water + fire)', '#80ff80');
    return;
  }
  if (head === 'zoom') {
    if (!ctx.toggleZoom) return;
    const factor = parseFloat(args[0] ?? '0.5');
    if (!Number.isFinite(factor) || factor < 0.1 || factor > 1) {
      ctx.broadcast('Usage: /zoom [factor=0.5] (0.1-1.0; off = /zoom 1)', '#ff8080');
      return;
    }
    ctx.toggleZoom(factor);
    ctx.broadcast(factor >= 0.99 ? 'Zoom off' : `Zoom ×${(1 / factor).toFixed(1)}`, '#80ff80');
    return;
  }
  if (head === 'speed') {
    if (!ctx.setWalkSpeed) {
      ctx.broadcast('Speed-mod unavailable.', '#ff8080');
      return;
    }
    const mul = parseFloat(args[0] ?? '1');
    if (!Number.isFinite(mul) || mul < 0.1 || mul > 8) {
      ctx.broadcast('Usage: /speed <0.1-8.0>', '#ff8080');
      return;
    }
    ctx.setWalkSpeed(mul);
    ctx.broadcast(`Walk speed ×${mul.toFixed(1)}`, '#80ff80');
    return;
  }
  if (head === 'perf' || head === 'benchmark') {
    if (!ctx.getTpsStats) {
      ctx.broadcast('Perf stats unavailable.', '#ff8080');
      return;
    }
    const s = ctx.getTpsStats();
    const grade =
      s.tps >= 19.5 ? 'S' : s.tps >= 18 ? 'A' : s.tps >= 15 ? 'B' : s.tps >= 10 ? 'C' : 'D';
    const color = s.tps >= 18 ? '#80ff80' : s.tps >= 12 ? '#ffd080' : '#ff8080';
    ctx.broadcast(`— Performance ${grade} —`, color);
    ctx.broadcast(
      `tps ${s.tps.toFixed(1)}/20 · mspt p50 ${s.p50ms.toFixed(1)} · p95 ${s.p95ms.toFixed(1)}`,
      color,
    );
    ctx.broadcast(
      s.lagging
        ? '⚠ Lagging — try /gamerule doMobSpawning false or smaller view distance'
        : 'Smooth.',
      '#cccccc',
    );
    return;
  }
  if (head === 'world' || head === 'info') {
    ctx.broadcast('— World info —', '#80ffff');
    ctx.broadcast(
      `pos ${ctx.playerPos.x.toFixed(1)} ${ctx.playerPos.y.toFixed(1)} ${ctx.playerPos.z.toFixed(1)}`,
      '#cccccc',
    );
    if (ctx.seed) ctx.broadcast(`seed ${String(ctx.seed())}`, '#cccccc');
    if (ctx.biomeAt)
      ctx.broadcast(`biome ${ctx.biomeAt(ctx.playerPos.x, ctx.playerPos.z)}`, '#cccccc');
    if (ctx.getRoomCode) {
      const code = ctx.getRoomCode();
      if (code) ctx.broadcast(`room ${code}`, '#cccccc');
    }
    if (ctx.uptimeMs) ctx.broadcast(`uptime ${(ctx.uptimeMs() / 60000).toFixed(1)}min`, '#cccccc');
    if (ctx.getTpsStats) {
      const s = ctx.getTpsStats();
      ctx.broadcast(
        `tps ${s.tps.toFixed(1)} mspt ${s.p50ms.toFixed(1)}/p95 ${s.p95ms.toFixed(1)}`,
        s.lagging ? '#ff8080' : '#80ff80',
      );
    }
    if (ctx.getWorldBorder)
      ctx.broadcast(`border ${ctx.getWorldBorder().toLocaleString()} blocks`, '#cccccc');
    if (ctx.isHardcore) ctx.broadcast(`hardcore ${ctx.isHardcore() ? 'on' : 'off'}`, '#cccccc');
    return;
  }
  if (head === 'craft') {
    if (!ctx.giveItem) return;
    const item = args[0];
    if (!item) {
      ctx.broadcast('Usage: /craft <item> — bypass crafting grid in creative-style', '#ff8080');
      return;
    }
    const count = parseInt(args[1] ?? '1', 10);
    const ok = ctx.giveItem(item, Math.max(1, Math.min(64, Number.isFinite(count) ? count : 1)));
    if (ok) ctx.broadcast(`Crafted ${item} ×${String(count)}`, '#80ff80');
    else ctx.broadcast(`Unknown item: ${item}`, '#ff8080');
    return;
  }
  if (head === 'cook' || head === 'smelt') {
    if (!ctx.giveItem) return;
    const item = args[0];
    if (!item) {
      ctx.broadcast('Usage: /cook <item> [count] — smelt instantly', '#ff8080');
      return;
    }
    const SMELT: Record<string, string> = {
      raw_iron: 'iron_ingot',
      raw_gold: 'gold_ingot',
      raw_copper: 'copper_ingot',
      iron_ore: 'iron_ingot',
      gold_ore: 'gold_ingot',
      copper_ore: 'copper_ingot',
      ancient_debris: 'netherite_scrap',
      sand: 'glass',
      cobblestone: 'stone',
      stone: 'smooth_stone',
      clay_ball: 'brick',
      netherrack: 'nether_brick_item',
      raw_beef: 'cooked_beef',
      raw_porkchop: 'cooked_porkchop',
      raw_chicken: 'cooked_chicken',
      raw_mutton: 'cooked_mutton',
      raw_rabbit: 'cooked_rabbit',
      cod: 'cooked_cod',
      salmon: 'cooked_salmon',
      potato: 'baked_potato',
      kelp: 'dried_kelp',
      cactus: 'green_dye',
      nether_quartz_ore: 'nether_quartz',
      oak_log: 'charcoal',
    };
    const out = SMELT[item];
    if (!out) {
      ctx.broadcast(`Cannot smelt: ${item}`, '#ff8080');
      return;
    }
    const count = parseInt(args[1] ?? '1', 10);
    const c = Math.max(1, Math.min(64, Number.isFinite(count) ? count : 1));
    ctx.giveItem(out, c);
    ctx.broadcast(`Smelted ${item} → ${out} ×${String(c)}`, '#80ff80');
    return;
  }
  if (head === 'tutorial' || head === 'guide') {
    ctx.broadcast('— webmc quick guide —', '#80ffff');
    ctx.broadcast('Move: WASD · Sprint: Ctrl or 2× W · Jump: Space · Sneak: Shift', '#cccccc');
    ctx.broadcast(
      'Mine: hold left-click · Place: right-click · Pick block: middle-click',
      '#cccccc',
    );
    ctx.broadcast('Hotbar: 1-9 keys or scroll · Inventory: E · Chat: T or /', '#cccccc');
    ctx.broadcast('F1=hide HUD · F3=debug · F5=camera · B=sleep at night', '#cccccc');
    ctx.broadcast('Try: /give all · /tree · /village · /tame (with bone)', '#cccccc');
    ctx.broadcast(
      'Mob right-click: feed (food), tame (tame-item), leash (lead), saddle (saddle)',
      '#cccccc',
    );
    ctx.broadcast(
      'Survival: get wood → craft pickaxe → mine stone → coal → iron → build shelter',
      '#cccccc',
    );
    ctx.broadcast('Type /help for command list', '#a0a0ff');
    return;
  }
  if (head === 'starter') {
    if (!ctx.giveItem) return;
    const KIT = [
      'oak_planks',
      'crafting_table',
      'wooden_pickaxe',
      'wooden_sword',
      'wooden_axe',
      'wooden_shovel',
      'bread',
      'torch',
      'oak_log',
      'cobblestone',
    ];
    let n = 0;
    for (const item of KIT) {
      if (
        ctx.giveItem(
          item,
          item === 'bread'
            ? 8
            : item === 'oak_log'
              ? 16
              : item === 'oak_planks'
                ? 32
                : item === 'cobblestone'
                  ? 32
                  : item === 'torch'
                    ? 16
                    : 1,
        )
      )
        n++;
    }
    ctx.broadcast(`Starter kit (${String(n)} items)`, '#80ff80');
    return;
  }
  if (head === 'kit') {
    if (!ctx.giveItem) return;
    const which = (args[0] ?? 'iron').toLowerCase();
    const KITS: Record<string, string[]> = {
      iron: [
        'iron_pickaxe',
        'iron_sword',
        'iron_axe',
        'iron_shovel',
        'iron_helmet',
        'iron_chestplate',
        'iron_leggings',
        'iron_boots',
        'cooked_beef',
        'shield',
      ],
      diamond: [
        'diamond_pickaxe',
        'diamond_sword',
        'diamond_axe',
        'diamond_shovel',
        'diamond_helmet',
        'diamond_chestplate',
        'diamond_leggings',
        'diamond_boots',
        'cooked_beef',
        'shield',
      ],
      netherite: [
        'netherite_pickaxe',
        'netherite_sword',
        'netherite_axe',
        'netherite_shovel',
        'cooked_beef',
        'enchanted_golden_apple',
      ],
      mage: [
        'ender_pearl',
        'experience_bottle',
        'splash_potion_healing',
        'potion_swiftness',
        'potion_strength',
        'potion_fire_resistance',
        'glowstone',
      ],
      builder: [
        'cobblestone',
        'stone',
        'oak_planks',
        'glass',
        'glowstone',
        'wool_white',
        'crafting_table',
      ],
    };
    const kit = KITS[which];
    if (!kit) {
      ctx.broadcast(`Usage: /kit <iron|diamond|netherite|mage|builder>`, '#ff8080');
      return;
    }
    let n = 0;
    for (const item of kit) {
      if (
        ctx.giveItem(
          item,
          item === 'cooked_beef'
            ? 16
            : item.includes('cobblestone') ||
                item.includes('stone') ||
                item.includes('plank') ||
                item.includes('glass') ||
                item === 'wool_white'
              ? 64
              : 1,
        )
      )
        n++;
    }
    ctx.broadcast(`${which} kit (${String(n)} items)`, '#80ff80');
    return;
  }
  if (head === 'firework' || head === 'fw') {
    if (!ctx.particle) return;
    const px = ctx.playerPos.x;
    const py = ctx.playerPos.y;
    const pz = ctx.playerPos.z;
    const burstY = py + 12;
    for (let h = 0; h < 12; h++) {
      ctx.particle(px, py + h, pz);
    }
    for (let i = 0; i < 80; i++) {
      const ang = Math.random() * Math.PI * 2;
      const r = 1 + Math.random() * 5;
      ctx.particle(
        px + Math.cos(ang) * r,
        burstY + (Math.random() - 0.5) * 4,
        pz + Math.sin(ang) * r,
      );
    }
    ctx.broadcast('🎆 Firework!', '#ffd080');
    return;
  }
  if (head === 'rain') {
    ctx.setWeather('rain');
    ctx.broadcast('Weather: rain', '#80a0ff');
    return;
  }
  if (head === 'storm' || head === 'thunder') {
    ctx.setWeather('thunder');
    ctx.broadcast('Weather: thunder', '#80a0ff');
    return;
  }
  if (head === 'sun') {
    ctx.setWeather('clear');
    ctx.broadcast('Weather: clear', '#80a0ff');
    return;
  }
  if (head === 'dragon' || head === 'enderdragon') {
    if (!ctx.summon) return;
    const ok = ctx.summon('ender_dragon', ctx.playerPos.x, ctx.playerPos.y + 30, ctx.playerPos.z);
    if (ok) ctx.broadcast('Ender Dragon summoned!', '#a060ff');
    else ctx.broadcast('Could not summon dragon', '#ff8080');
    return;
  }
  if (head === 'wither' || head === 'witherboss') {
    if (!ctx.summon) return;
    const ok = ctx.summon('wither', ctx.playerPos.x, ctx.playerPos.y + 5, ctx.playerPos.z);
    if (ok) ctx.broadcast('Wither summoned!', '#404040');
    else ctx.broadcast('Could not summon wither', '#ff8080');
    return;
  }
  if (head === 'army') {
    if (!ctx.summon) return;
    const kind = args[0] ?? 'zombie';
    const count = parseInt(args[1] ?? '8', 10);
    if (!Number.isFinite(count) || count < 1 || count > 32) {
      ctx.broadcast('Usage: /army <kind=zombie> <count=8>', '#ff8080');
      return;
    }
    let n = 0;
    for (let i = 0; i < count; i++) {
      const ang = (i / count) * Math.PI * 2;
      const r = 4;
      const x = ctx.playerPos.x + Math.cos(ang) * r;
      const z = ctx.playerPos.z + Math.sin(ang) * r;
      if (ctx.summon(kind, x, ctx.playerPos.y, z)) n++;
    }
    ctx.broadcast(`Spawned ${String(n)} ${kind} in a ring`, '#80ff80');
    return;
  }
  if (head === 'clear' && args[0]?.toLowerCase() === 'area') {
    if (!ctx.fillBlocks) return;
    const r = parseInt(args[1] ?? '8', 10);
    if (!Number.isFinite(r) || r < 1 || r > 64) {
      ctx.broadcast('Usage: /clear area <radius=8>', '#ff8080');
      return;
    }
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    const n = ctx.fillBlocks(px - r, py, pz - r, px + r, py + r, pz + r, 'air');
    ctx.broadcast(`Cleared ${String(n)} blocks within ${String(r)} of player`, '#80ff80');
    return;
  }
  if (head === 'tree') {
    if (!ctx.setBlock) return;
    const wood = (args[0] ?? 'oak').toLowerCase();
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    const trunkH = 5 + Math.floor(Math.random() * 3);
    for (let h = 0; h < trunkH; h++) ctx.setBlock(px, py + h, pz, `${wood}_log`);
    for (let dx = -2; dx <= 2; dx++) {
      for (let dz = -2; dz <= 2; dz++) {
        for (let dy = trunkH - 2; dy <= trunkH; dy++) {
          if (dx === 0 && dz === 0 && dy < trunkH) continue;
          if (Math.abs(dx) + Math.abs(dz) > 3) continue;
          if (Math.random() < 0.85) ctx.setBlock(px + dx, py + dy, pz + dz, `${wood}_leaves`);
        }
      }
    }
    ctx.broadcast(`Planted ${wood} tree`, '#80ff80');
    return;
  }
  if (head === 'replace') {
    if (args.length < 2 || !ctx.fillBlocks) {
      ctx.broadcast('Usage: /replace <fromBlock> <toBlock> [radius=8]', '#ff8080');
      return;
    }
    // Without per-block iteration, just fill the cube area with the target block.
    const radius = parseInt(args[2] ?? '8', 10);
    if (!Number.isFinite(radius) || radius < 1 || radius > 32) {
      ctx.broadcast('Usage: /replace <from> <to> [radius=8]', '#ff8080');
      return;
    }
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    const n = ctx.fillBlocks(
      px - radius,
      py - radius,
      pz - radius,
      px + radius,
      py + radius,
      pz + radius,
      args[1] ?? 'stone',
    );
    ctx.broadcast(`Filled ${String(n)} blocks (replace approximation)`, '#80ff80');
    return;
  }
  if (head === 'glow') {
    if (!ctx.applyEffect) return;
    ctx.applyEffect('glowing', 0, 60);
    ctx.broadcast('Glowing for 60s', '#80ff80');
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
    if (
      !Number.isFinite(len) ||
      len < 1 ||
      len > 64 ||
      !Number.isFinite(height) ||
      height < 1 ||
      height > 32
    ) {
      ctx.broadcast('Usage: /wall <len=8> <h=4> [block=cobblestone]', '#ff8080');
      return;
    }
    const px = Math.floor(ctx.playerPos.x);
    const py = Math.floor(ctx.playerPos.y);
    const pz = Math.floor(ctx.playerPos.z);
    const n = ctx.fillBlocks(px, py, pz, px + len - 1, py + height - 1, pz, block);
    ctx.broadcast(
      `Wall ${String(len)}×${String(height)} of ${block} (${String(n)} blocks)`,
      '#80ff80',
    );
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
      ctx.fillBlocks(
        px - RADIUS,
        py + h,
        pz - RADIUS,
        px + RADIUS,
        py + h,
        pz + RADIUS,
        'cobblestone',
      );
    }
    ctx.fillBlocks(
      px - RADIUS + 1,
      py + 1,
      pz - RADIUS + 1,
      px + RADIUS - 1,
      py + HEIGHT - 1,
      pz + RADIUS - 1,
      'air',
    );
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
      ctx.fillBlocks(
        px - SIZE + h,
        py + h,
        pz - SIZE + h,
        px + SIZE - h,
        py + h,
        pz + SIZE - h,
        'sandstone',
      );
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
    if (
      !Number.isFinite(x1) ||
      !Number.isFinite(y1) ||
      !Number.isFinite(z1) ||
      !Number.isFinite(x2) ||
      !Number.isFinite(y2) ||
      !Number.isFinite(z2) ||
      !name
    ) {
      ctx.broadcast('Invalid args', '#ff8080');
      return;
    }
    const total = Math.abs(x2 - x1 + 1) * Math.abs(y2 - y1 + 1) * Math.abs(z2 - z1 + 1);
    if (total > 32768) {
      ctx.broadcast(`Fill volume ${String(total)} exceeds 32768 limit`, '#ff8080');
      return;
    }
    const count = ctx.fillBlocks(
      Math.floor(x1),
      Math.floor(y1),
      Math.floor(z1),
      Math.floor(x2),
      Math.floor(y2),
      Math.floor(z2),
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
    if (ok)
      ctx.broadcast(
        `Set ${name} at ${String(Math.floor(x))} ${String(Math.floor(y))} ${String(Math.floor(z))}`,
        '#80ff80',
      );
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
      ctx.broadcast(
        'Usage: /time set <day|night|noon|midnight|ticks> | /time add <ticks>',
        '#ff8080',
      );
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
    ctx.broadcast(
      `Blocks (${String(list.length)}): ${shown.join(', ')}${list.length > 20 ? '…' : ''}`,
      '#cccccc',
    );
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
