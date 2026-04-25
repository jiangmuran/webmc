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
