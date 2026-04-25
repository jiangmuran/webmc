import * as THREE from 'three';
import { FrameTimer } from './engine/time/FrameTimer';
import { DayNightCycle } from './engine/time/DayNightCycle';
import { FirstPersonCamera } from './engine/input/FirstPersonCamera';
import { TouchControls, isTouchDevice } from './engine/input/TouchControls';
import { ChunkRenderer } from './engine/render/ChunkRenderer';
import { type BlockState, AIR, makeState, stateId } from './blocks/state';
import { createDefaultRegistry } from './blocks/registry';
import { World } from './world/World';
import { CHUNK_HEIGHT, type Chunk } from './world/Chunk';
import { WorldGenerator } from './world/generation/WorldGenerator';
import { ChunkLoader } from './world/ChunkLoader';
import { type ChunkLight, buildLight, flatLightForSection } from './world/lighting';
import {
  type BorderOpacity,
  createMesherClient,
  extractBorderFromSubChunk,
} from './world/workers/MesherClient';
import { InteractionController } from './game/Interaction';
import { Hotbar } from './ui/Hotbar';
import { AudioBus } from './engine/audio/AudioBus';
import { openIndexedDB } from './persist/db';
import { ChunkStore } from './persist/ChunkStore';
import { CURRENT_SCHEMA_VERSION, type WorldMeta } from './persist/types';
import { RoomClient } from './net/RoomClient';
import { ItemRegistry } from './items/item';
import { Inventory } from './items/Inventory';
import { BlockDropRegistry } from './items/block-drops';
import { RecipeRegistry } from './items/recipe';
import { registerDefaultRecipes } from './items/default-recipes';
import { PlayerState, xpToNext, BREATH_MAX_SEC } from './game/PlayerState';
import { MobWorld } from './entities/mob';
import { MobRenderer } from './engine/render/MobRenderer';
import { SpawnSystem } from './entities/spawn';
import { DroppedItemWorld } from './entities/DroppedItems';
import { XpOrbWorld } from './entities/XpOrbs';
import { intersectRayAABB } from './physics/raycast_aabb';
import { FluidWorld } from './fluids/FluidWorld';
import { PerfMonitor } from './engine/time/PerfMonitor';
import { MainMenu } from './ui/MainMenu';
import { PauseMenu } from './ui/PauseMenu';
import { ChatInput } from './ui/ChatInput';
import { CreativeInventory } from './ui/CreativeInventory';
import { SurvivalInventory } from './ui/SurvivalInventory';
import { ChestUI } from './ui/ChestUI';
import { ResourcePackLoader } from './ui/ResourcePackLoader';
import { SettingsPanel } from './ui/SettingsPanel';
import { DebugOverlay } from './ui/DebugOverlay';
import { Crosshair } from './ui/Crosshair';
import { SurvivalHud, HurtVignette } from './ui/SurvivalHud';
import { FluidOverlay } from './ui/FluidOverlay';
import { DeathScreen } from './ui/DeathScreen';
import { CompassBar } from './ui/CompassBar';
import { Toast } from './ui/Toast';
import { ControlsHelp } from './ui/ControlsHelp';
import { DamageNumbers } from './ui/DamageNumbers';
import { MinimapView } from './ui/MinimapView';
import { ProceduralSfx } from './engine/audio/ProceduralSfx';
import { RainParticles } from './engine/render/RainParticles';
import { BlockOutline } from './engine/render/BlockOutline';
import { BlockParticles } from './engine/render/BlockParticles';
import { Clouds } from './engine/render/Clouds';
import { FirstPersonHand } from './engine/render/FirstPersonHand';
import { PlayerAvatar } from './engine/render/PlayerAvatar';
import { ScreenShake } from './engine/render/ScreenShake';
import { SkyCelestials } from './engine/render/SkyCelestials';
import { Stars } from './engine/render/Stars';
import { applyPackToRegistry, buildPatternTextureFromPack } from './engine/render/ResourcePackApply';
import { type GameMode, effectsFor, nextGameMode } from './game/GameMode';
import { executeCommand } from './game/CommandExecutor';

const canvas = document.querySelector<HTMLCanvasElement>('#canvas');
const hudEl = document.querySelector<HTMLElement>('#hud');
const appEl = document.querySelector<HTMLElement>('#app');
if (!canvas || !hudEl || !appEl) throw new Error('boot: app elements missing');
const hud: HTMLElement = hudEl;

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: false,
  powerPreference: 'high-performance',
});
if (!renderer.capabilities.isWebGL2) {
  throw new Error('webmc requires WebGL2; this browser only provides WebGL1.');
}
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.setSize(window.innerWidth, window.innerHeight, false);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x8db5f0);
scene.fog = new THREE.Fog(0x8db5f0, 80, 260);

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);

const registry = createDefaultRegistry();
const nameToState = (name: string): BlockState => makeState(registry.byName(name) ?? 1, 0);
const STONE = nameToState('webmc:stone');
const DIRT = nameToState('webmc:dirt');
const GRASS = nameToState('webmc:grass_block');
const COBBLE = nameToState('webmc:cobblestone');
const LOG = nameToState('webmc:oak_log');
const GLASS = nameToState('webmc:glass');
const GLOW = nameToState('webmc:glowstone');
const SAND = nameToState('webmc:sand');
const PLANKS = nameToState('webmc:oak_planks');

const isOpaque = (state: BlockState): boolean => {
  if (state === AIR) return false;
  return registry.get(stateId(state)).opaque;
};
const faceColorsOf = (state: BlockState) => registry.get(stateId(state)).faceColors;
const colorOf = (state: BlockState): readonly [number, number, number] =>
  registry.get(stateId(state)).color;
const isSolid = (x: number, y: number, z: number): boolean =>
  y >= 0 && y < CHUNK_HEIGHT && registry.get(stateId(world.get(x, y, z))).solid;
const ladderId = registry.byName('webmc:ladder');
const isClimbable = (x: number, y: number, z: number): boolean => {
  if (y < 0 || y >= CHUNK_HEIGHT) return false;
  const s = world.get(x, y, z);
  if (s === AIR) return false;
  return ladderId !== undefined && stateId(s) === ladderId;
};

const world = new World();
const DEFAULT_WORLD_ID = 'default-world';
const persistDB = await openIndexedDB();
const lastPlayedId = (await persistDB.getMeta('lastPlayedWorldId')) as string | null;
const activeWorldId = lastPlayedId ?? DEFAULT_WORLD_ID;
let worldMeta = await persistDB.getWorld(activeWorldId);
if (!worldMeta) {
  worldMeta = {
    id: activeWorldId,
    name: 'Default World',
    seed: 0xabc1234,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    schemaVersion: CURRENT_SCHEMA_VERSION,
    spawn: { x: 0.5, y: 80, z: 0.5 },
  } satisfies WorldMeta;
  await persistDB.putWorld(worldMeta);
}
await persistDB.setMeta('lastPlayedWorldId', worldMeta.id);
document.title = `webmc · ${worldMeta.name}`;

const WORLD_SEED = worldMeta.seed;
const generator = new WorldGenerator(WORLD_SEED, registry);
const chunkStore = new ChunkStore(persistDB, { worldId: worldMeta.id });
chunkStore.startAutoFlush();
const loader = new ChunkLoader(world, generator, {
  viewRadius: 6,
  unloadPadding: 2,
  perFrameBudget: 4,
});
const itemRegistry = new ItemRegistry();
const blockToItem = new Map<number, number>();
for (const def of registry.defs) {
  if (def.name === 'webmc:air') continue;
  const blockId = registry.byName(def.name);
  if (blockId === undefined) continue;
  const id = itemRegistry.register({
    name: def.name,
    maxStack: 64,
    durability: 0,
    blockId,
  });
  blockToItem.set(blockId, id);
}
itemRegistry.register({ name: 'webmc:bucket', maxStack: 16, durability: 0 });
itemRegistry.register({ name: 'webmc:water_bucket', maxStack: 1, durability: 0 });
itemRegistry.register({ name: 'webmc:lava_bucket', maxStack: 1, durability: 0 });
itemRegistry.register({ name: 'webmc:rotten_flesh', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:bone', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:arrow', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:feather', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:raw_porkchop', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:raw_beef', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:raw_chicken', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:leather', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:wool', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:gunpowder', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:string', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:spider_eye', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:stick', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:coal', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:iron_ingot', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:gold_ingot', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:diamond', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:wheat', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:cocoa_beans', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:sugar', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:egg', maxStack: 16, durability: 0 });
itemRegistry.register({ name: 'webmc:milk_bucket', maxStack: 1, durability: 0 });
itemRegistry.register({ name: 'webmc:wood_pickaxe', maxStack: 1, durability: 60 });
itemRegistry.register({ name: 'webmc:stone_pickaxe', maxStack: 1, durability: 132 });
itemRegistry.register({ name: 'webmc:iron_pickaxe', maxStack: 1, durability: 251 });
itemRegistry.register({ name: 'webmc:gold_pickaxe', maxStack: 1, durability: 33 });
itemRegistry.register({ name: 'webmc:diamond_pickaxe', maxStack: 1, durability: 1562 });
itemRegistry.register({ name: 'webmc:wood_sword', maxStack: 1, durability: 60 });
itemRegistry.register({ name: 'webmc:stone_sword', maxStack: 1, durability: 132 });
itemRegistry.register({ name: 'webmc:iron_sword', maxStack: 1, durability: 251 });
itemRegistry.register({ name: 'webmc:diamond_sword', maxStack: 1, durability: 1562 });
itemRegistry.register({ name: 'webmc:iron_axe', maxStack: 1, durability: 251 });
itemRegistry.register({ name: 'webmc:iron_shovel', maxStack: 1, durability: 251 });
itemRegistry.register({ name: 'webmc:bread', maxStack: 64, durability: 0, hungerRestore: 5, saturation: 6 });
itemRegistry.register({ name: 'webmc:cookie', maxStack: 64, durability: 0, hungerRestore: 2, saturation: 0.4 });
itemRegistry.register({ name: 'webmc:cake', maxStack: 1, durability: 0 });
itemRegistry.register({ name: 'webmc:cooked_porkchop', maxStack: 64, durability: 0, hungerRestore: 8, saturation: 12.8 });
itemRegistry.register({ name: 'webmc:cooked_beef', maxStack: 64, durability: 0, hungerRestore: 8, saturation: 12.8 });
itemRegistry.register({ name: 'webmc:cooked_chicken', maxStack: 64, durability: 0, hungerRestore: 6, saturation: 7.2 });
itemRegistry.register({ name: 'webmc:apple', maxStack: 64, durability: 0, hungerRestore: 4, saturation: 2.4 });

const recipeRegistry = new RecipeRegistry();
const recipesRegistered = registerDefaultRecipes(itemRegistry, recipeRegistry);
if (import.meta.env.DEV) console.info(`[webmc] recipes: ${String(recipesRegistered)}`);

const dropRegistry = new BlockDropRegistry();
for (const [blockId, itemId] of blockToItem) {
  dropRegistry.register(blockId, [{ itemId, min: 1, max: 1 }]);
}

const inventory = new Inventory(itemRegistry);
const playerState = new PlayerState({
  inventory,
  onDeath: () => {
    // Peaceful mode keeps inventory (matches MC); snapshot+restore after respawn clears.
    if (mobDamageMultiplier === 0) {
      const hot = inventory.hotbar.map((s) => (s ? { ...s } : null));
      const main = inventory.main.map((s) => (s ? { ...s } : null));
      queueMicrotask(() => {
        for (let i = 0; i < hot.length; i++) inventory.hotbar[i] = hot[i] ?? null;
        for (let i = 0; i < main.length; i++) inventory.main[i] = main[i] ?? null;
      });
      return;
    }
    const px = fp.position.x;
    const py = fp.position.y;
    const pz = fp.position.z;
    for (const slot of inventory.hotbar) {
      if (!slot) continue;
      const def = itemRegistry.get(slot.itemId);
      const colorRgb = def.blockId !== undefined ? registry.get(def.blockId).color : ([200, 200, 200] as const);
      droppedItems.spawn(px, py, pz, { itemId: slot.itemId, count: slot.count, color: colorRgb }, 3);
    }
    for (const slot of inventory.main) {
      if (!slot) continue;
      const def = itemRegistry.get(slot.itemId);
      const colorRgb = def.blockId !== undefined ? registry.get(def.blockId).color : ([200, 200, 200] as const);
      droppedItems.spawn(px, py, pz, { itemId: slot.itemId, count: slot.count, color: colorRgb }, 3);
    }
  },
  onRespawn: () => {
    if (playerSpawnPoint) {
      fp.position.set(playerSpawnPoint.x, playerSpawnPoint.y, playerSpawnPoint.z);
    } else {
      const s = Math.max(generator.surfaceAt(0, 0), 62) + 4;
      fp.position.set(worldMeta.spawn.x, s, worldMeta.spawn.z);
    }
  },
});

const lightCache = new Map<string, ChunkLight>();
const lightKey = (cx: number, cz: number): string => `${cx.toString()},${cz.toString()}`;
const lightOracle = {
  isOpaque,
  lightEmission: (s: BlockState) => (s === AIR ? 0 : registry.get(stateId(s)).lightEmission),
};

const fp = new FirstPersonCamera(camera);
const savedPlayer = await persistDB.getPlayer(worldMeta.id);
if (savedPlayer) {
  fp.position.set(savedPlayer.position.x, savedPlayer.position.y, savedPlayer.position.z);
  fp.yaw = savedPlayer.yaw;
  fp.pitch = savedPlayer.pitch;
} else {
  const spawnHeight = Math.max(generator.surfaceAt(0, 0), 62) + 4;
  fp.position.set(worldMeta.spawn.x, spawnHeight, worldMeta.spawn.z);
  fp.yaw = 0;
}
fp.input.fly = true;
fp.attach(canvas);
fp.setBaseFov(70);

const touch = isTouchDevice() ? new TouchControls() : null;
touch?.attach(appEl);

const chunkRenderer = new ChunkRenderer();
scene.add(chunkRenderer.group);

const fluidWorld = new FluidWorld({ world, registry });
const waterId = registry.byName('webmc:water');
const lavaId = registry.byName('webmc:lava');
const isFluid = (x: number, y: number, z: number): 'water' | 'lava' | null => {
  const s = world.get(x, y, z);
  if (s === AIR) return null;
  const id = stateId(s);
  if (id === waterId) return 'water';
  if (id === lavaId) return 'lava';
  return null;
};

const mobWorld = new MobWorld();
const mobRenderer = new MobRenderer();
const droppedItems = new DroppedItemWorld();
const xpOrbs = new XpOrbWorld();
scene.add(mobRenderer.group);
scene.add(droppedItems.group);
scene.add(xpOrbs.group);
const spawnSystem = new SpawnSystem();

const dayNight = new DayNightCycle({ dayLengthSec: 600 });

const crosshair = new Crosshair(appEl);
const sfx = new ProceduralSfx();
sfx.attachUnlock(document.body);
const rain = new RainParticles();
scene.add(rain.group);
const blockOutline = new BlockOutline();
scene.add(blockOutline.group);
const blockParticles = new BlockParticles(600);
scene.add(blockParticles.group);
const clouds = new Clouds();
scene.add(clouds.mesh);
const screenShake = new ScreenShake();
const hand = new FirstPersonHand();
camera.add(hand.group);
scene.add(camera);
const playerAvatar = new PlayerAvatar();
playerAvatar.setName('Player');
scene.add(playerAvatar.group);
type CameraMode = 'fp' | 'tp_back' | 'tp_front';
let cameraMode: CameraMode = 'fp';
function cycleCamera(): void {
  cameraMode = cameraMode === 'fp' ? 'tp_back' : cameraMode === 'tp_back' ? 'tp_front' : 'fp';
  hand.group.visible = cameraMode === 'fp';
  playerAvatar.setVisible(cameraMode !== 'fp');
}
let lastTouchPrimary = false;
const sky = new SkyCelestials();
sky.addTo(scene);
const stars = new Stars();
scene.add(stars.points);
let currentWeather: 'clear' | 'rain' | 'thunder' = 'clear';
const tmpSkyColor = new THREE.Color();
const tmpFogColor = new THREE.Color();
let lastEmptyPlaceWarnAt = 0;
let weatherTimer = 120 + Math.random() * 180; // 2–5 min until next weather roll
let autoWeatherEnabled = true;
let minimapVisible = true;
let mobDamageMultiplier = 1;
let currentPlayerName = 'Player';
void persistDB.getMeta('difficulty').then((saved) => {
  if (saved === 'peaceful') mobDamageMultiplier = 0;
  else if (saved === 'easy') mobDamageMultiplier = 0.5;
  else if (saved === 'hard') mobDamageMultiplier = 1.5;
});
let sprintDustAccum = 0;
let lavaEmberAccum = 0;
let torchEmberAccum = 0;
let brightnessMul = 1.0;
const playerStats = {
  blocksBroken: 0,
  blocksPlaced: 0,
  mobsKilled: 0,
  distanceWalked: 0,
  playtimeSec: 0,
};
const achievedSet = new Set<string>();
interface Achievement {
  readonly id: string;
  readonly title: string;
  readonly check: () => boolean;
}
const achievements: readonly Achievement[] = [
  { id: 'first_block', title: 'Hello World', check: () => playerStats.blocksBroken >= 1 },
  { id: 'mason', title: 'Mason (100 blocks placed)', check: () => playerStats.blocksPlaced >= 100 },
  { id: 'miner', title: 'Miner (100 blocks broken)', check: () => playerStats.blocksBroken >= 100 },
  { id: 'slayer', title: 'Slayer (10 mobs killed)', check: () => playerStats.mobsKilled >= 10 },
  { id: 'traveler', title: 'Traveler (500m walked)', check: () => playerStats.distanceWalked >= 500 },
  { id: 'explorer', title: 'Explorer (1 hour played)', check: () => playerStats.playtimeSec >= 3600 },
  { id: 'level_10', title: 'Level 10', check: () => playerState.xpLevel >= 10 },
  { id: 'survivor', title: 'Survivor (day 5)', check: () => dayCounter >= 5 },
  { id: 'marathon', title: 'Marathon (5km walked)', check: () => playerStats.distanceWalked >= 5000 },
  { id: 'architect', title: 'Architect (1000 blocks placed)', check: () => playerStats.blocksPlaced >= 1000 },
];
void persistDB.getMeta('achievements').then((saved) => {
  if (Array.isArray(saved)) {
    for (const id of saved) if (typeof id === 'string') achievedSet.add(id);
  }
});
function checkAchievements(): void {
  for (const a of achievements) {
    if (!achievedSet.has(a.id) && a.check()) {
      achievedSet.add(a.id);
      toast.show(`🏆 ${a.title}`, '#ffd080', 2500);
      chatInput.addLine(`Achievement: ${a.title}`, '#ffd080');
      void persistDB.setMeta('achievements', Array.from(achievedSet));
    }
  }
}
void persistDB.getMeta('playerStats').then((saved) => {
  if (saved && typeof saved === 'object') {
    const s = saved as Record<string, unknown>;
    if (typeof s['blocksBroken'] === 'number') playerStats.blocksBroken = s['blocksBroken'];
    if (typeof s['blocksPlaced'] === 'number') playerStats.blocksPlaced = s['blocksPlaced'];
    if (typeof s['mobsKilled'] === 'number') playerStats.mobsKilled = s['mobsKilled'];
    if (typeof s['distanceWalked'] === 'number') playerStats.distanceWalked = s['distanceWalked'];
    if (typeof s['playtimeSec'] === 'number') playerStats.playtimeSec = s['playtimeSec'];
  }
});
let statsSaveAccum = 0;
let lastStatsPos = { x: 0, y: 0, z: 0 };
let lightningTimer = 15 + Math.random() * 30; // countdown during thunder
function setWeather(w: 'clear' | 'rain' | 'thunder'): void {
  currentWeather = w;
  rain.setActive(w !== 'clear');
  void persistDB.setMeta('weather', w);
}
void persistDB.getMeta('weather').then((saved) => {
  if (saved === 'clear' || saved === 'rain' || saved === 'thunder') setWeather(saved);
});
void persistDB.getMeta('timeOfDay').then((saved) => {
  if (typeof saved === 'number' && Number.isFinite(saved) && saved >= 0 && saved < 1) {
    dayNight.timeOfDay = saved;
  }
});
let timeSaveAccum = 0;

let lightningFlashSec = 0;
function lightningFlash(): void {
  lightningFlashSec = 0.18;
  sfx.play('hit');
  audio.play3D('break', fp.position.x + (Math.random() - 0.5) * 30, fp.position.y, fp.position.z + (Math.random() - 0.5) * 30);
  chatInput.addLine('⚡ Lightning strikes nearby!', '#e0e0ff');
  screenShake.pulse(0.35);
}

const mesherClient = createMesherClient();
const audio = new AudioBus({ masterVolume: 0.35 });
audio.attachUnlock(document.body);

const interaction = new InteractionController(
  camera,
  () => {
    const l = fp.lookVector();
    return { x: l.x, y: l.y, z: l.z };
  },
  world,
  isSolid,
  {
    onBreak: (bx, by, bz) => {
      audio.play3D('break', bx + 0.5, by + 0.5, bz + 0.5);
      sfx.play('break');
      const prevState = world.get(bx, by, bz);
      const prevBlockId = stateId(prevState);
      const def = registry.get(prevBlockId);
      blockParticles.emitBreak(bx, by, bz, def.color);
      // Mining XP for ores (matches MC: coal 0-2, iron 0 via smelt, diamond 3-7, redstone 1-5, lapis 2-5, emerald 3-7).
      if (gameMode === 'survival' || gameMode === 'adventure') {
        const xp = oreXp(def.name);
        if (xp > 0) xpOrbs.spawn(bx + 0.5, by + 0.5, bz + 0.5, xp);
      }
      const drops = dropRegistry.drops(prevBlockId, undefined, 99);
      if (gameMode === 'survival' || gameMode === 'adventure') {
        for (const s of drops) {
          droppedItems.spawn(bx + 0.5, by + 0.5, bz + 0.5, {
            itemId: s.itemId,
            count: s.count,
            color: def.color,
          });
        }
      } else {
        for (const s of drops) inventory.add(s);
      }
      touchWorldEdit(bx, by, bz, 0);
      hand.swing();
      playerStats.blocksBroken++;
    },
    onPlace: (bx, by, bz) => {
      audio.play3D('place', bx + 0.5, by + 0.5, bz + 0.5);
      sfx.play('place');
      const sel = hotbar.selected;
      const blockId = sel ? stateId(sel.state) : 0;
      if (sel) {
        const def = registry.get(stateId(sel.state));
        blockParticles.emitPlace(bx, by, bz, def.color);
        if (gameMode === 'survival' || gameMode === 'adventure') {
          const itemId = itemRegistry.byName(def.name);
          if (itemId !== undefined) consumeInventoryItem(itemId, 1);
        }
      }
      touchWorldEdit(bx, by, bz, blockId);
      hand.swing();
      playerStats.blocksPlaced++;
    },
    canPlace: () => {
      if (gameMode === 'creative') return true;
      const sel = hotbar.selected;
      if (!sel) return false;
      const def = registry.get(stateId(sel.state));
      const itemId = itemRegistry.byName(def.name);
      if (itemId === undefined) return false;
      const ok = countInventoryItem(itemId) > 0;
      if (!ok && performance.now() - lastEmptyPlaceWarnAt > 800) {
        lastEmptyPlaceWarnAt = performance.now();
        chatInput.addLine(`No ${def.name.replace(/^webmc:/, '')} in inventory`, '#ffb080');
      }
      return ok;
    },
    onInteract: (bx, by, bz) => {
      const state = world.get(bx, by, bz);
      if (state === AIR) return false;
      const id = stateId(state);
      const def = registry.get(id);
      // Doors / trapdoors / levers / buttons: toggle the "powered/open" bit.
      const interactable =
        def.name.endsWith('_door') ||
        def.name.endsWith('_trapdoor') ||
        def.name.endsWith('_button') ||
        def.name.endsWith('_pressure_plate') ||
        def.name === 'webmc:lever';
      if (interactable) {
        const props = (state >>> 16) ^ 1;
        world.set(bx, by, bz, makeState(id, props));
        sfx.play('click');
        touchWorldEdit(bx, by, bz, id);
        return true;
      }
      if (def.name === 'webmc:chest') {
        chestUI.show();
        fp.inputBlocked = true;
        document.exitPointerLock();
        sfx.play('click');
        return true;
      }
      if (def.name === 'webmc:tnt') {
        igniteTnt(bx, by, bz);
        return true;
      }
      if (def.name === 'webmc:bed') {
        playerSpawnPoint = { x: bx + 0.5, y: by + 1, z: bz + 0.5 };
        void persistDB.setMeta('playerSpawnPoint', playerSpawnPoint);
        if (!dayNight.isDay) {
          dayNight.setTimeOfDayTicks(1000);
          toast.show(`Spawn set. Day ${String(++dayCounter)}`, '#ffb0c0');
          chatInput.addLine('You sleep. Dawn arrives.', '#d0d0ff');
        } else {
          toast.show('Spawn set', '#ffb0c0', 1200);
        }
        sfx.play('click');
        return true;
      }
      if (def.name === 'webmc:crafting_table' || def.name === 'webmc:furnace') {
        if (gameMode === 'survival' || gameMode === 'adventure') survivalInv.show();
        else creativeInv.show();
        fp.inputBlocked = true;
        document.exitPointerLock();
        sfx.play('click');
        return true;
      }
      return false;
    },
  },
);

function countInventoryItem(itemId: number): number {
  let total = 0;
  for (const s of inventory.hotbar) if (s?.itemId === itemId) total += s.count;
  for (const s of inventory.main) if (s?.itemId === itemId) total += s.count;
  return total;
}

function consumeInventoryItem(itemId: number, count: number): boolean {
  let remaining = count;
  const go = (slots: (typeof inventory.hotbar)[number][]): void => {
    for (let i = 0; i < slots.length && remaining > 0; i++) {
      const s = slots[i];
      if (s?.itemId !== itemId) continue;
      const take = Math.min(s.count, remaining);
      const after = s.count - take;
      slots[i] = after <= 0 ? null : { ...s, count: after };
      remaining -= take;
    }
  };
  go(inventory.hotbar);
  if (remaining > 0) go(inventory.main);
  return remaining === 0;
}
interaction.attach(canvas);
interaction.selectedBlock = STONE;

let lastPlayerAttackAt = 0;
canvas.addEventListener('mousedown', (e) => {
  if (document.pointerLockElement !== canvas) return;
  if (e.button === 1) {
    e.preventDefault();
    const hit = interaction.castRay();
    if (hit) {
      const pickedState = world.get(hit.bx, hit.by, hit.bz);
      const pickedId = stateId(pickedState);
      const def = registry.get(pickedId);
      hotbar.setEntry(hotbar.selectedIndex, {
        state: pickedState,
        name: def.name.replace(/^webmc:/, ''),
        color: def.color,
      });
      interaction.selectedBlock = pickedState;
      chatInput.addLine(`Picked ${def.name.replace(/^webmc:/, '')}`, '#80d080');
    }
    return;
  }
  if (e.button !== 0) return;
  const origin = camera.position;
  const look = fp.lookVector();
  const reach = 5;
  let bestId: number | null = null;
  let bestDist = Infinity;
  for (const mob of mobWorld.all()) {
    const box = {
      minX: mob.position.x - mob.def.aabb.halfX,
      minY: mob.position.y - mob.def.aabb.halfY,
      minZ: mob.position.z - mob.def.aabb.halfZ,
      maxX: mob.position.x + mob.def.aabb.halfX,
      maxY: mob.position.y + mob.def.aabb.halfY,
      maxZ: mob.position.z + mob.def.aabb.halfZ,
    };
    const hit = intersectRayAABB(origin, look, box, reach);
    if (hit && hit.tMin < bestDist) {
      bestDist = hit.tMin;
      bestId = mob.id;
    }
  }
  if (bestId !== null) {
    const nowMs = performance.now();
    if (nowMs - lastPlayerAttackAt < 400) return;
    lastPlayerAttackAt = nowMs;
    const result = mobWorld.damage(bestId, 2);
    sfx.play('hit');
    interaction.setHeld(null);
    screenShake.pulse(0.15);
    hand.swing();
    if (result) damageNumbers.spawn(result.position.x, result.position.y + 0.8, result.position.z, 2);
    // Knockback: push mob away from player along horizontal look vector.
    const mobHit = Array.from(mobWorld.all()).find((m) => m.id === bestId);
    if (mobHit) {
      const look = fp.lookVector();
      const kbMag = 5;
      mobHit.velocity.x += look.x * kbMag;
      mobHit.velocity.z += look.z * kbMag;
      mobHit.velocity.y = Math.max(mobHit.velocity.y, 3);
    }
    if (result?.killed) {
      spawnMobDrops(result.kind, result.position);
      for (let k = 0; k < 3; k++) xpOrbs.spawn(result.position.x, result.position.y + 0.8, result.position.z, 1);
      blockParticles.emitBreak(
        Math.floor(result.position.x),
        Math.floor(result.position.y),
        Math.floor(result.position.z),
        [180, 40, 40],
      );
      playerStats.mobsKilled++;
    }
  } else {
    // Air swing — play the hand animation even when we miss
    hand.swing();
  }
});

const hotbar = new Hotbar(appEl, registry, [
  { state: STONE, name: 'stone', color: colorOf(STONE) },
  { state: DIRT, name: 'dirt', color: colorOf(DIRT) },
  { state: GRASS, name: 'grass', color: colorOf(GRASS) },
  { state: COBBLE, name: 'cobble', color: colorOf(COBBLE) },
  { state: LOG, name: 'oak log', color: colorOf(LOG) },
  { state: PLANKS, name: 'planks', color: colorOf(PLANKS) },
  { state: GLASS, name: 'glass', color: colorOf(GLASS) },
  { state: SAND, name: 'sand', color: colorOf(SAND) },
  { state: GLOW, name: 'glow', color: colorOf(GLOW) },
]);

let gameMode: GameMode = 'creative';
function applyGameMode(m: GameMode): void {
  gameMode = m;
  const eff = effectsFor(m);
  fp.input.fly = eff.canFly;
  fp.canFly = eff.canFly;
  fp.passThroughBlocks = eff.passThroughBlocks;
  playerState.invulnerable = eff.invulnerable;
  survivalHud.setVisible(m === 'survival' || m === 'adventure');
  interaction.breakDurationSec = m === 'creative' ? 0.001 : 0.4;
}

const survivalHud = new SurvivalHud(appEl);
const hurtVignette = new HurtVignette(appEl);
const fluidOverlay = new FluidOverlay(appEl);
const deathScreen = new DeathScreen(appEl);
const compassBar = new CompassBar(appEl);
const toast = new Toast(appEl);
const controlsHelp = new ControlsHelp(appEl);
const damageNumbers = new DamageNumbers(appEl);
const minimap = new MinimapView(appEl);
void persistDB.getMeta('minimapRange').then((saved) => {
  if (typeof saved !== 'number') return;
  while (minimap.currentRange > saved && minimap.currentRange > 16) minimap.zoomIn();
  while (minimap.currentRange < saved && minimap.currentRange < 256) minimap.zoomOut();
});
deathScreen.setOnRespawn(() => {
  fp.inputBlocked = false;
  void canvas.requestPointerLock();
  toast.show('Respawned', '#80ffa0', 1200);
});
survivalHud.setVisible(false);
let lastPlayerHealth = 20;
let starvingShown = false;
let lastXpLevel = 0;
let lastIsDay = true;
let dayCounter = 1;
void persistDB.getMeta('dayCounter').then((saved) => {
  if (typeof saved === 'number' && Number.isFinite(saved)) dayCounter = saved;
});
let playerSpawnPoint: { x: number; y: number; z: number } | null = null;
void persistDB.getMeta('playerSpawnPoint').then((saved) => {
  if (saved && typeof saved === 'object' && 'x' in saved && 'y' in saved && 'z' in saved) {
    const p = saved as { x: unknown; y: unknown; z: unknown };
    if (typeof p.x === 'number' && typeof p.y === 'number' && typeof p.z === 'number') {
      playerSpawnPoint = { x: p.x, y: p.y, z: p.z };
    }
  }
});
let lastInFluid: 'water' | 'lava' | null = null;

const chatInput = new ChatInput(appEl, {
  onSubmit: (text) => {
    if (text.startsWith('/')) {
      executeCommand(text, {
        playerPos: { x: fp.position.x, y: fp.position.y, z: fp.position.z },
        setPlayerPos: (x, y, z) => fp.position.set(x, y, z),
        gameMode,
        setGameMode: (m) => { applyGameMode(m); },
        setTimeOfDay: (t) => { dayNight.setTimeOfDayTicks(t); },
        addTimeOfDay: (n) => { dayNight.setTimeOfDayTicks(Math.floor(dayNight.timeOfDay * 24000) + n); },
        setWeather: (w) => { setWeather(w); },
        giveItem: (name, count) => {
          const candidates = [name, `webmc:${name}`, `webmc:${name}_block`];
          let id: number | undefined;
          for (const c of candidates) {
            id = itemRegistry.byName(c);
            if (id !== undefined) break;
          }
          if (id === undefined) return false;
          const leftover = inventory.add({ itemId: id, count, damage: 0 });
          return leftover < count;
        },
        broadcast: (line, color) => { chatInput.addLine(line, color); },
        knownGameModes: ['survival', 'creative', 'adventure', 'spectator'] as const,
        knownItems: [],
        playerName: currentPlayerName,
        heal: () => {
          playerState.heal(20);
          playerState.eat(20, 5);
        },
        kill: () => {
          playerState.takeDamage({ amount: 1000, source: 'command' });
        },
        clearInventory: () => {
          inventory.clear();
        },
        setBlock: (x, y, z, name) => {
          const full = name.startsWith('webmc:') ? name : `webmc:${name}`;
          const id = registry.byName(full);
          if (id === undefined) return false;
          world.set(x, y, z, makeState(id, 0));
          touchWorldEdit(x, y, z, id);
          return true;
        },
        fillBlocks: (x1, y1, z1, x2, y2, z2, name) => {
          const full = name.startsWith('webmc:') ? name : `webmc:${name}`;
          const id = registry.byName(full);
          if (id === undefined) return -1;
          const state = makeState(id, 0);
          const sx = Math.min(x1, x2), ex = Math.max(x1, x2);
          const sy = Math.min(y1, y2), ey = Math.max(y1, y2);
          const sz = Math.min(z1, z2), ez = Math.max(z1, z2);
          let count = 0;
          const chunksTouched = new Set<string>();
          for (let y = sy; y <= ey; y++) {
            for (let z = sz; z <= ez; z++) {
              for (let x = sx; x <= ex; x++) {
                if (y < 0 || y >= CHUNK_HEIGHT) continue;
                world.set(x, y, z, state);
                count++;
                chunksTouched.add(`${String(Math.floor(x / 16))},${String(Math.floor(z / 16))}`);
              }
            }
          }
          for (const k of chunksTouched) {
            const [cxS, czS] = k.split(',');
            const cxN = Number(cxS), czN = Number(czS);
            const chunk = world.getChunk(cxN, czN);
            if (chunk) {
              const light = lightCache.get(lightKey(cxN, czN)) ?? null;
              chunkStore.markDirty(chunk, light);
              const newLight = buildLight(chunk, lightOracle);
              lightCache.set(lightKey(cxN, czN), newLight);
              markChunkAllDirty(chunk);
            }
          }
          return count;
        },
        save: () => {
          void savePlayerNow();
          void chunkStore.flush();
        },
        summon: (kind, x, y, z) => {
          try {
            mobWorld.spawn(kind as Parameters<typeof mobWorld.spawn>[0], { x, y, z });
            return true;
          } catch {
            return false;
          }
        },
        openChest: () => {
          chestUI.show();
          fp.inputBlocked = true;
          document.exitPointerLock();
        },
        teleportSpawn: () => {
          if (playerSpawnPoint) {
            fp.position.set(playerSpawnPoint.x, playerSpawnPoint.y, playerSpawnPoint.z);
            chatInput.addLine(
              `Spawn at ${playerSpawnPoint.x.toFixed(1)} ${playerSpawnPoint.y.toFixed(1)} ${playerSpawnPoint.z.toFixed(1)}`,
              '#cccccc',
            );
          } else {
            const s = Math.max(generator.surfaceAt(0, 0), 62) + 4;
            fp.position.set(worldMeta.spawn.x, s, worldMeta.spawn.z);
            chatInput.addLine(
              `World spawn at ${worldMeta.spawn.x.toFixed(1)} ${s.toFixed(1)} ${worldMeta.spawn.z.toFixed(1)}`,
              '#cccccc',
            );
          }
        },
        seed: () => WORLD_SEED,
        setSpawnHere: () => {
          playerSpawnPoint = { x: fp.position.x, y: fp.position.y, z: fp.position.z };
          void persistDB.setMeta('playerSpawnPoint', playerSpawnPoint);
        },
        clearChat: () => { chatInput.clearLog(); },
        toggleFly: () => {
          fp.toggleFly();
          return fp.input.fly;
        },
        applyEffect: (id, amp, sec) => {
          playerState.applyEffect(id, amp, sec);
        },
        clearEffects: () => {
          playerState.effects.clear();
        },
        killAllMobs: () => {
          const ids: number[] = [];
          for (const m of mobWorld.all()) ids.push(m.id);
          for (const id of ids) mobWorld.remove(id);
          return ids.length;
        },
        particle: (x, y, z) => {
          blockParticles.emitBreak(Math.floor(x), Math.floor(y), Math.floor(z), [255, 220, 100]);
        },
        listAchievements: () =>
          achievements.map((a) => ({ title: a.title, unlocked: achievedSet.has(a.id) })),
        setDifficulty: (level) => {
          mobDamageMultiplier = level === 'peaceful' ? 0 : level === 'easy' ? 0.5 : level === 'hard' ? 1.5 : 1;
          if (level === 'peaceful') {
            // Despawn all hostile mobs.
            const ids: number[] = [];
            for (const m of mobWorld.all()) {
              if (m.def.behavior === 'hostile' || m.def.behavior === 'creeper') ids.push(m.id);
            }
            for (const id of ids) mobWorld.remove(id);
          }
          void persistDB.setMeta('difficulty', level);
        },
        showStats: () => {
          chatInput.addLine(`Playtime: ${(playerStats.playtimeSec / 60).toFixed(1)} min`, '#cccccc');
          chatInput.addLine(`Blocks broken: ${String(playerStats.blocksBroken)}  placed: ${String(playerStats.blocksPlaced)}`, '#cccccc');
          chatInput.addLine(`Mobs killed: ${String(playerStats.mobsKilled)}`, '#cccccc');
          chatInput.addLine(`Distance walked: ${playerStats.distanceWalked.toFixed(1)} m`, '#cccccc');
        },
      });
    } else {
      chatInput.addLine(`<You> ${text}`);
    }
  },
  onOpenChanged: (open) => {
    fp.inputBlocked = open;
    if (open) {
      fp.input.forward = 0;
      fp.input.strafe = 0;
      fp.input.vertical = 0;
      fp.input.sprint = false;
      fp.input.jump = false;
      document.exitPointerLock();
    }
  },
});

const pauseMenu = new PauseMenu(appEl, {
  onResume: () => {
    pauseMenu.hide();
    fp.inputBlocked = false;
    void canvas.requestPointerLock();
  },
  onQuit: () => {
    pauseMenu.hide();
    mainMenu.show();
    fp.inputBlocked = true;
    document.exitPointerLock();
    void savePlayerNow();
    void chunkStore.flush();
  },
  onOpenSettings: () => { settingsPanel.show(); },
});

const resourcePackLoader = new ResourcePackLoader(appEl, {
  onLoaded: (pack) => {
    const result = applyPackToRegistry(registry, pack);
    const newPattern = buildPatternTextureFromPack(pack);
    if (newPattern) {
      const oldTex = (chunkRenderer.material.uniforms['uPattern'] as { value: THREE.Texture | null }).value;
      if (oldTex) oldTex.dispose();
      (chunkRenderer.material.uniforms['uPattern'] as { value: THREE.Texture }).value = newPattern;
      (chunkRenderer.material.uniforms['uPatternStrength'] as { value: number }).value = 0.9;
    }
    for (const chunk of world.chunks()) markChunkAllDirty(chunk);
    chatInput.addLine(
      `Pack loaded: ${pack.packName} · ${pack.blockTextures.size} block PNGs · ${String(result.blocksRecolored)} blocks recolored${newPattern ? ' + pattern atlas' : ''}`,
      '#80ff80',
    );
    if (result.missingTextures.length > 0) {
      chatInput.addLine(
        `Missing textures for ${String(result.missingTextures.length)} blocks: ${result.missingTextures.slice(0, 6).join(', ')}…`,
        '#ffd080',
      );
    }
  },
});

const settingsPanel = new SettingsPanel(appEl, {
  onChange: (v) => {
    fp.setBaseFov(v.fov);
    loader.setViewRadius(v.viewDistance);
    (fp as unknown as { opts: { lookSensitivity: number } }).opts.lookSensitivity = v.mouseSensitivity;
    fp.invertY = v.invertY;
    fp.sprintToggle = v.sprintToggle;
    brightnessMul = v.brightness;
    if (v.showCrosshair) crosshair.show(); else crosshair.hide();
    currentPlayerName = v.playerName.trim() || 'Player';
    playerAvatar.setName(currentPlayerName);
    document.title = `webmc · ${worldMeta.name} · ${currentPlayerName}`;
    audio.setMasterVolume(v.masterVolume);
    sfx.setMasterVolume(v.masterVolume);
    loader.setPerFrameBudget(v.chunkUploadBudget);
    const far = v.viewDistance * 16;
    (chunkRenderer.material.uniforms['uFogFar'] as { value: number }).value = far;
    (chunkRenderer.material.uniforms['uFogNear'] as { value: number }).value = far * 0.6;
    if (scene.fog instanceof THREE.Fog) {
      scene.fog.near = far * 0.6;
      scene.fog.far = far;
    }
  },
});

const TIPS: readonly string[] = [
  'Tip: Press E for inventory',
  'Tip: Press F4 to cycle game modes',
  'Tip: Press F5 for third-person',
  'Tip: Press T for chat, / for commands',
  'Tip: Press B to sleep through the night',
  'Tip: Press F2 for a screenshot',
  'Tip: Double-tap W to sprint',
  'Tip: Right-click TNT to prime it',
  'Tip: Middle-click copies the block you look at',
  'Tip: Press Q to drop the held block',
];

const mainMenu = new MainMenu(appEl, {
  onPlay: () => {
    fp.inputBlocked = false;
    applyGameMode(gameMode);
    void canvas.requestPointerLock();
    const tip = TIPS[Math.floor(Math.random() * TIPS.length)] ?? TIPS[0];
    if (tip) toast.show(tip, '#eef3ff', 3000);
  },
  onOpenSettings: () => { settingsPanel.show(); },
  onOpenResourcePacks: () => { resourcePackLoader.show(); },
});
fp.inputBlocked = true;
applyGameMode(gameMode);

const chestUI = new ChestUI(appEl, inventory, itemRegistry, {
  onClose: () => {
    fp.inputBlocked = false;
    void canvas.requestPointerLock();
    void persistDB.setMeta('chestStorage', chestUI.storage);
  },
});
void persistDB.getMeta('chestStorage').then((saved) => {
  if (!Array.isArray(saved)) return;
  for (let i = 0; i < Math.min(27, saved.length); i++) {
    const v = saved[i];
    chestUI.storage[i] = (v && typeof v === 'object') ? v as typeof chestUI.storage[number] : null;
  }
});

const survivalInv = new SurvivalInventory(appEl, inventory, itemRegistry, {
  onClose: () => {
    fp.inputBlocked = false;
    void canvas.requestPointerLock();
  },
  onEat: (_id, hungerRestore, saturation) => {
    playerState.eat(hungerRestore, saturation);
    sfx.play('click');
    // Small burst of brownish particles in front of player.
    const look = fp.lookVector();
    blockParticles.emitPlace(
      fp.position.x + look.x * 0.6,
      fp.position.y + look.y * 0.5,
      fp.position.z + look.z * 0.6,
      [180, 140, 80],
    );
  },
}, recipeRegistry);

const creativeInv = new CreativeInventory(appEl, registry, {
  onPick: (entry) => {
    hotbar.setEntry(hotbar.selectedIndex, {
      state: entry.state,
      name: entry.shortName,
      color: entry.color,
    });
    interaction.selectedBlock = entry.state;
    chatInput.addLine(`Picked ${entry.shortName}`, '#80d080');
  },
});

document.addEventListener(
  'keydown',
  (e) => {
    // Top-priority modals: ESC always closes them, regardless of main menu state.
    if (settingsPanel.isVisible()) {
      if (e.code === 'Escape') {
        e.preventDefault();
        settingsPanel.hide();
      }
      return;
    }
    if (resourcePackLoader.isVisible()) {
      if (e.code === 'Escape') {
        e.preventDefault();
        resourcePackLoader.hide();
      }
      return;
    }
    if (mainMenu.isVisible()) return;
    if (chatInput.isOpen()) return;
    if (creativeInv.isVisible()) {
      if (e.code === 'Escape' || e.code === 'KeyE') {
        e.preventDefault();
        creativeInv.hide();
        fp.inputBlocked = false;
        void canvas.requestPointerLock();
      }
      return;
    }
    if (survivalInv.isVisible()) {
      if (e.code === 'Escape' || e.code === 'KeyE') {
        e.preventDefault();
        survivalInv.hide();
      }
      return;
    }
    if (chestUI.isVisible()) {
      if (e.code === 'Escape' || e.code === 'KeyE') {
        e.preventDefault();
        chestUI.hide();
      }
      return;
    }
    if (e.code === 'KeyE') {
      e.preventDefault();
      if (gameMode === 'creative') {
        creativeInv.show();
      } else {
        survivalInv.show();
      }
      fp.inputBlocked = true;
      document.exitPointerLock();
      return;
    }
    if (e.code === 'Escape') {
      e.preventDefault();
      if (pauseMenu.isVisible()) {
        pauseMenu.hide();
        fp.inputBlocked = false;
        void canvas.requestPointerLock();
      } else {
        pauseMenu.show();
        fp.inputBlocked = true;
        document.exitPointerLock();
      }
      return;
    }
    if (e.code === 'KeyT') {
      e.preventDefault();
      chatInput.openChat();
      return;
    }
    if (e.code === 'Slash') {
      e.preventDefault();
      chatInput.openChat('/');
      return;
    }
    if (e.code === 'F4') {
      e.preventDefault();
      applyGameMode(nextGameMode(gameMode));
      chatInput.addLine(`Gamemode: ${gameMode}`, '#ffd080');
      toast.show(gameMode.toUpperCase(), '#ffd080');
    }
    if (e.code === 'F3') {
      e.preventDefault();
      debugOverlay.toggle();
      hud.style.display = debugOverlay.isEnabled() ? 'none' : 'block';
    }
    if (e.code === 'F5') {
      e.preventDefault();
      cycleCamera();
    }
    if (e.code === 'F6') {
      e.preventDefault();
      fp.bobEnabled = !fp.bobEnabled;
      toast.show(`View bob: ${fp.bobEnabled ? 'on' : 'off'}`, '#cccccc', 1200);
    }
    if (e.code === 'F7') {
      e.preventDefault();
      autoWeatherEnabled = !autoWeatherEnabled;
      toast.show(`Auto weather: ${autoWeatherEnabled ? 'on' : 'off'}`, '#a0d0ff', 1200);
    }
    if (e.code === 'KeyM') {
      e.preventDefault();
      minimapVisible = !minimapVisible;
      minimap.setVisible(minimapVisible);
      toast.show(`Minimap: ${minimapVisible ? 'on' : 'off'}`, '#cccccc', 1000);
    }
    if (e.code === 'Equal' || e.code === 'NumpadAdd') {
      e.preventDefault();
      minimap.zoomIn();
      void persistDB.setMeta('minimapRange', minimap.currentRange);
      toast.show(`Minimap zoom ±${String(minimap.currentRange)}m`, '#cccccc', 800);
    }
    if (e.code === 'Minus' || e.code === 'NumpadSubtract') {
      e.preventDefault();
      minimap.zoomOut();
      void persistDB.setMeta('minimapRange', minimap.currentRange);
      toast.show(`Minimap zoom ±${String(minimap.currentRange)}m`, '#cccccc', 800);
    }
    if (e.code === 'F1') {
      e.preventDefault();
      controlsHelp.toggle();
    }
    if (e.code === 'F2') {
      e.preventDefault();
      renderer.render(scene, camera);
      const data = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = data;
      const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const safeName = currentPlayerName.replace(/[^A-Za-z0-9_-]/g, '_');
      a.download = `webmc-${safeName}-${ts}.png`;
      a.click();
      chatInput.addLine('Screenshot saved.', '#d0ff80');
    }
    if (e.code === 'KeyB') {
      e.preventDefault();
      if (!dayNight.isDay) {
        dayNight.setTimeOfDayTicks(1000);
        chatInput.addLine('You slept through the night.', '#d0d0ff');
        sfx.play('click');
      } else {
        chatInput.addLine('You can only sleep at night.', '#ffd080');
      }
      return;
    }
    if (e.code === 'KeyQ') {
      e.preventDefault();
      const sel = hotbar.selected;
      if (sel && (gameMode === 'survival' || gameMode === 'adventure')) {
        const def = registry.get(stateId(sel.state));
        const itemId = itemRegistry.byName(def.name);
        if (itemId !== undefined && countInventoryItem(itemId) > 0) {
          consumeInventoryItem(itemId, 1);
          const look = fp.lookVector();
          droppedItems.spawn(fp.position.x + look.x * 1.2, fp.position.y, fp.position.z + look.z * 1.2, {
            itemId,
            count: 1,
            color: def.color,
          }, 1.5);
          sfx.play('click');
        }
      }
    }
  },
  true,
);

const debugOverlay = new DebugOverlay(appEl);

document.addEventListener('pointerlockchange', () => {
  if (document.pointerLockElement !== canvas) {
    crosshair.hide();
    if (!mainMenu.isVisible() && !pauseMenu.isVisible() && !chatInput.isOpen() && !settingsPanel.isVisible() && !resourcePackLoader.isVisible() && !creativeInv.isVisible() && !survivalInv.isVisible() && !chestUI.isVisible()) {
      pauseMenu.show();
      fp.inputBlocked = true;
    }
  } else {
    crosshair.show();
  }
});

function borderFor(cx: number, cy: number, cz: number): BorderOpacity {
  const b: BorderOpacity = {
    nx: null,
    px: null,
    ny: null,
    py: null,
    nz: null,
    pz: null,
  };
  const here = world.getChunk(cx, cz);
  if (!here) return b;

  const nxChunk = world.getChunk(cx - 1, cz);
  const nxSection = nxChunk?.section(cy) ?? null;
  if (nxSection) b.nx = extractBorderFromSubChunk(nxSection, 'nx', isOpaque);

  const pxChunk = world.getChunk(cx + 1, cz);
  const pxSection = pxChunk?.section(cy) ?? null;
  if (pxSection) b.px = extractBorderFromSubChunk(pxSection, 'px', isOpaque);

  const nySection = here.section(cy - 1);
  if (nySection) b.ny = extractBorderFromSubChunk(nySection, 'ny', isOpaque);

  const pySection = here.section(cy + 1);
  if (pySection) b.py = extractBorderFromSubChunk(pySection, 'py', isOpaque);

  const nzChunk = world.getChunk(cx, cz - 1);
  const nzSection = nzChunk?.section(cy) ?? null;
  if (nzSection) b.nz = extractBorderFromSubChunk(nzSection, 'nz', isOpaque);

  const pzChunk = world.getChunk(cx, cz + 1);
  const pzSection = pzChunk?.section(cy) ?? null;
  if (pzSection) b.pz = extractBorderFromSubChunk(pzSection, 'pz', isOpaque);

  return b;
}

function markChunkAllDirty(chunk: Chunk): void {
  for (let cy = 0; cy < 24; cy++) {
    if (chunk.section(cy)) chunk.markMeshDirty(cy);
  }
}

function flushDirty(): void {
  for (const chunk of world.chunks()) {
    if (chunk.meshDirty.size === 0) continue;
    const dirty = Array.from(chunk.meshDirty);
    chunk.clearMeshDirty();
    for (const cy of dirty) {
      const section = chunk.section(cy);
      if (!section) {
        chunkRenderer.remove(chunk.cx, cy, chunk.cz);
        continue;
      }
      const borders = borderFor(chunk.cx, cy, chunk.cz);
      const light = lightCache.get(lightKey(chunk.cx, chunk.cz));
      const lightSlice = light ? flatLightForSection(light, cy) : { sky: null, block: null };
      void mesherClient
        .mesh(chunk.cx, cy, chunk.cz, section, isOpaque, faceColorsOf, borders, {
          flatSkyLight: lightSlice.sky,
          flatBlockLight: lightSlice.block,
        })
        .then((response) => {
          chunkRenderer.apply(response);
        });
    }
  }
}

const onUnload = (cx: number, cz: number): void => {
  for (let cy = 0; cy < 24; cy++) chunkRenderer.remove(cx, cy, cz);
  lightCache.delete(lightKey(cx, cz));
};

async function savePlayerNow(): Promise<void> {
  if (!worldMeta) return;
  await persistDB.putPlayer({
    worldId: worldMeta.id,
    position: { x: fp.position.x, y: fp.position.y, z: fp.position.z },
    yaw: fp.yaw,
    pitch: fp.pitch,
    hotbarSlots: [],
    selectedSlot: 0,
    updatedAt: Date.now(),
  });
}

let lastPlayerSaveAt = performance.now();
let fluidTickAccum = 0;
const FLUID_TICK_SEC = 0.25;
const fallableIds = new Set<number>();
for (const name of ['webmc:sand', 'webmc:gravel', 'webmc:red_sand']) {
  const id = registry.byName(name);
  if (id !== undefined) fallableIds.add(id);
}

// Cascading falling-block check: called from touchWorldEdit when a block
// below a fallable-block column is removed. Drops the column one step and
// recursively checks the block above.
function cascadeFalling(bx: number, by: number, bz: number): void {
  let y = by + 1;
  while (y < CHUNK_HEIGHT) {
    const s = world.get(bx, y, bz);
    if (s === AIR) break;
    if (!fallableIds.has(stateId(s))) break;
    if (world.get(bx, y - 1, bz) !== AIR) break;
    world.set(bx, y - 1, bz, s);
    world.set(bx, y, bz, AIR);
    y++;
  }
}

const perfMonitor = new PerfMonitor({
  startQuality: 6,
  minQuality: 2,
  maxQuality: 12,
  upShiftThresholdSec: 0.033,
  downShiftThresholdSec: 0.022,
  windowSec: 3,
  holdSec: 3,
});
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    void chunkStore.flush();
    void savePlayerNow();
    void persistDB.setMeta('chestStorage', chestUI.storage);
    void persistDB.setMeta('playerStats', playerStats);
    void persistDB.setMeta('timeOfDay', dayNight.timeOfDay);
    void persistDB.setMeta('dayCounter', dayCounter);
    if (!mainMenu.isVisible() && !pauseMenu.isVisible()) {
      pauseMenu.show();
      fp.inputBlocked = true;
      document.exitPointerLock();
    }
  }
});
window.addEventListener('beforeunload', () => {
  void chunkStore.flush();
  void savePlayerNow();
  void persistDB.setMeta('chestStorage', chestUI.storage);
  void persistDB.setMeta('playerStats', playerStats);
  void persistDB.setMeta('timeOfDay', dayNight.timeOfDay);
  void persistDB.setMeta('dayCounter', dayCounter);
});

const urlParams = new URLSearchParams(window.location.search);
const mpMode = urlParams.get('mp');
const signalingUrl =
  urlParams.get('signaling') ??
  (window.location.protocol === 'https:' ? 'wss://localhost:7777' : 'ws://localhost:7777');
let roomClient: RoomClient | null = null;
let roomCode: string | null = null;

async function initMultiplayer(): Promise<void> {
  if (!mpMode) return;
  const client = new RoomClient({
    signalingUrl,
    world,
    name: 'Player',
    onRoom: (code) => {
      roomCode = code;
    },
    onError: (msg) => {
      console.warn('[webmc] mp error:', msg);
    },
    onChat: (from, text) => {
      console.log(`[chat ${from}]`, text);
    },
  });
  try {
    if (mpMode === 'create') await client.createRoom();
    else await client.joinRoom(mpMode.toUpperCase());
    roomClient = client;
  } catch (err) {
    console.warn('[webmc] multiplayer init failed', err);
  }
}
void initMultiplayer();

interface PrimedTnt {
  bx: number;
  by: number;
  bz: number;
  remainingSec: number;
}
const primedTnt: PrimedTnt[] = [];
function igniteTnt(bx: number, by: number, bz: number): void {
  const state = world.get(bx, by, bz);
  if (state === AIR) return;
  const id = stateId(state);
  const def = registry.get(id);
  if (def.name !== 'webmc:tnt') return;
  world.set(bx, by, bz, AIR);
  const cx = Math.floor(bx / 16);
  const cz = Math.floor(bz / 16);
  const chunk = world.getChunk(cx, cz);
  if (chunk) {
    const light = lightCache.get(lightKey(cx, cz)) ?? null;
    chunkStore.markDirty(chunk, light);
  }
  primedTnt.push({ bx, by, bz, remainingSec: 1.5 });
  chatInput.addLine(`TNT primed!`, '#ff8040');
  sfx.play('click');
}

let tntSmokeAccum = 0;
function tickTnt(dtSec: number): void {
  tntSmokeAccum += dtSec;
  const emitNow = tntSmokeAccum > 0.1;
  if (emitNow) tntSmokeAccum = 0;
  for (let i = primedTnt.length - 1; i >= 0; i--) {
    const t = primedTnt[i]!;
    t.remainingSec -= dtSec;
    if (emitNow) {
      blockParticles.emitPlace(t.bx + 0.5, t.by + 0.8, t.bz + 0.5, [90, 90, 90]);
    }
    if (t.remainingSec <= 0) {
      explodeAt(t.bx, t.by, t.bz, 4);
      primedTnt.splice(i, 1);
    }
  }
}

function explodeAt(bx: number, by: number, bz: number, radius: number): void {
  const r2 = radius * radius;
  const airState = AIR;
  const changedChunks = new Set<string>();
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dz = -radius; dz <= radius; dz++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const dSq = dx * dx + dy * dy + dz * dz;
        if (dSq > r2) continue;
        const x = bx + dx;
        const y = by + dy;
        const z = bz + dz;
        if (y < 0 || y >= CHUNK_HEIGHT) continue;
        const s = world.get(x, y, z);
        if (s === AIR) continue;
        const id2 = stateId(s);
        const def2 = registry.get(id2);
        if (def2.hardness < 0) continue; // bedrock/unbreakable
        if (def2.name === 'webmc:tnt' && !(x === bx && y === by && z === bz)) {
          // Cascading TNT: remove as block, schedule fuse with random delay.
          world.set(x, y, z, airState);
          primedTnt.push({ bx: x, by: y, bz: z, remainingSec: 0.3 + Math.random() * 0.6 });
          changedChunks.add(`${String(Math.floor(x / 16))},${String(Math.floor(z / 16))}`);
          continue;
        }
        const falloff = 1 - dSq / r2;
        if (Math.random() > falloff * 0.9) continue;
        world.set(x, y, z, airState);
        if (Math.random() < 0.25) {
          blockParticles.emitBreak(x, y, z, def2.color);
          const itemId = itemRegistry.byName(def2.name);
          if (itemId !== undefined) {
            droppedItems.spawn(x + 0.5, y + 0.5, z + 0.5, {
              itemId,
              count: 1,
              color: def2.color,
            }, 3);
          }
        }
        changedChunks.add(`${String(Math.floor(x / 16))},${String(Math.floor(z / 16))}`);
      }
    }
  }
  for (const k of changedChunks) {
    const [cxS, czS] = k.split(',');
    const cx = Number(cxS);
    const cz = Number(czS);
    const chunk = world.getChunk(cx, cz);
    if (chunk) {
      const light = lightCache.get(lightKey(cx, cz)) ?? null;
      chunkStore.markDirty(chunk, light);
    }
  }
  screenShake.pulse(0.8);
  sfx.play('hit');
  sfx.play('break');
  audio.play3D('break', bx + 0.5, by + 0.5, bz + 0.5);
  chatInput.addLine(`💥 BOOM`, '#ff6040');
}

function oreXp(blockName: string): number {
  switch (blockName) {
    case 'webmc:coal_ore':
      return 1 + Math.floor(Math.random() * 2);
    case 'webmc:diamond_ore':
      return 3 + Math.floor(Math.random() * 5);
    case 'webmc:redstone_ore':
      return 1 + Math.floor(Math.random() * 5);
    case 'webmc:lapis_ore':
      return 2 + Math.floor(Math.random() * 4);
    case 'webmc:emerald_ore':
      return 3 + Math.floor(Math.random() * 5);
    default:
      return 0;
  }
}

function spawnMobDrops(kind: string, pos: { x: number; y: number; z: number }): void {
  const lookup = (name: string): number | undefined => itemRegistry.byName(`webmc:${name}`);
  const dropTables: Record<string, readonly { name: string; min: number; max: number; color: readonly [number, number, number] }[]> = {
    zombie: [{ name: 'rotten_flesh', min: 0, max: 2, color: [110, 80, 60] }],
    skeleton: [
      { name: 'bone', min: 0, max: 2, color: [230, 225, 210] },
      { name: 'arrow', min: 0, max: 2, color: [200, 190, 160] },
    ],
    creeper: [{ name: 'gunpowder', min: 0, max: 2, color: [90, 90, 90] }],
    spider: [
      { name: 'string', min: 0, max: 2, color: [230, 230, 230] },
      { name: 'spider_eye', min: 0, max: 1, color: [120, 30, 30] },
    ],
    pig: [{ name: 'raw_porkchop', min: 1, max: 3, color: [240, 170, 160] }],
    cow: [
      { name: 'raw_beef', min: 1, max: 3, color: [180, 60, 60] },
      { name: 'leather', min: 0, max: 2, color: [130, 90, 60] },
    ],
    sheep: [{ name: 'wool', min: 1, max: 1, color: [240, 240, 240] }],
    chicken: [
      { name: 'raw_chicken', min: 1, max: 1, color: [240, 210, 180] },
      { name: 'feather', min: 0, max: 1, color: [250, 250, 250] },
    ],
  };
  const table = dropTables[kind];
  if (!table) return;
  for (const entry of table) {
    const count = entry.min + Math.floor(Math.random() * (entry.max - entry.min + 1));
    if (count <= 0) continue;
    const itemId = lookup(entry.name);
    if (itemId === undefined) continue;
    droppedItems.spawn(pos.x, pos.y + 0.5, pos.z, { itemId, count, color: entry.color });
  }
}

const touchWorldEdit = (bx: number, by: number, bz: number, block: number): void => {
  // Cascade fallable-block stacks above the edited cell.
  cascadeFalling(bx, by, bz);
  // If the edited cell itself is fallable, cascade starting one below it.
  const selfState = world.get(bx, by, bz);
  if (selfState !== AIR && fallableIds.has(stateId(selfState)) && by > 0) {
    cascadeFalling(bx, by - 1, bz);
  }
  const cx = Math.floor(bx / 16);
  const cz = Math.floor(bz / 16);
  const chunk = world.getChunk(cx, cz);
  if (chunk) {
    // Decide scope: neighbor rebuild only if the block emits light or we're
    // breaking (block=0, might have removed a light source). Keeps common
    // placements cheap (1 chunk rebuild instead of 5).
    const emitsNew = block !== 0 && registry.get(block).lightEmission > 0;
    const wasBreak = block === 0;
    const affected: { cx: number; cz: number }[] = emitsNew || wasBreak
      ? [
          { cx, cz },
          { cx: cx - 1, cz },
          { cx: cx + 1, cz },
          { cx, cz: cz - 1 },
          { cx, cz: cz + 1 },
        ]
      : [{ cx, cz }];
    for (const a of affected) {
      const c = world.getChunk(a.cx, a.cz);
      if (!c) continue;
      const newLight = buildLight(c, lightOracle);
      lightCache.set(lightKey(a.cx, a.cz), newLight);
      markChunkAllDirty(c);
    }
    const light = lightCache.get(lightKey(cx, cz)) ?? null;
    chunkStore.markDirty(chunk, light);
  }
  roomClient?.applyLocalBlockEdit({ x: bx, y: by, z: bz, block, meta: 0 });
};

window.addEventListener('resize', () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
});

const timer = new FrameTimer();
const rendererInfo = ((): { gl: string; rend: string } => {
  const gl = renderer.getContext();
  const dbg = gl.getExtension('WEBGL_debug_renderer_info');
  const api = gl instanceof WebGL2RenderingContext ? 'WebGL2' : 'WebGL1';
  const rend = dbg ? (gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) as string) : 'unknown';
  return { gl: api, rend };
})();

loader.setPopulate(async (chunk) => {
  const saved = await chunkStore.load(chunk.cx, chunk.cz);
  if (saved) {
    for (let cy = 0; cy < 24; cy++) {
      const src = saved.chunk.section(cy);
      if (!src) continue;
      for (let y = 0; y < 16; y++) {
        for (let z = 0; z < 16; z++) {
          for (let x = 0; x < 16; x++) {
            const state = src.get(x, y, z);
            if (state !== AIR) chunk.set(x, cy * 16 + y, z, state);
          }
        }
      }
    }
  } else {
    generator.generateChunk(chunk);
    const light = buildLight(chunk, lightOracle);
    chunkStore.markDirty(chunk, light);
  }
});

const onLoad = (cx: number, cz: number): void => {
  const chunk = world.getChunk(cx, cz);
  if (!chunk) return;
  lightCache.set(lightKey(cx, cz), buildLight(chunk, lightOracle));
  markChunkAllDirty(chunk);
  for (const [ncx, ncz] of [
    [cx - 1, cz],
    [cx + 1, cz],
    [cx, cz - 1],
    [cx, cz + 1],
  ] as const) {
    const neighbor = world.getChunk(ncx, ncz);
    if (neighbor) markChunkAllDirty(neighbor);
  }
};

function frame(): void {
  const stats = timer.tick();
  const now = performance.now();
  const dtSec = Math.min(stats.frameMs / 1000, 0.1);
  if (perfMonitor.tick(dtSec)) {
    loader.setViewRadius(perfMonitor.quality);
    const lowTier = perfMonitor.quality < 4;
    clouds.mesh.visible = !lowTier;
    stars.points.visible = !lowTier;
    if (lowTier && rain.isActive()) rain.setActive(false);
    const basePx = Math.min(window.devicePixelRatio, 1.5);
    const targetPx = lowTier ? Math.min(basePx, 1.0) : basePx;
    if (Math.abs(renderer.getPixelRatio() - targetPx) > 0.01) renderer.setPixelRatio(targetPx);
  }

  if (touch) {
    const look = touch.consumeLook();
    if (look.dx !== 0 || look.dy !== 0) {
      fp.yaw -= look.dx;
      fp.pitch -= look.dy;
      fp.pitch = Math.max(-Math.PI / 2 + 0.001, Math.min(Math.PI / 2 - 0.001, fp.pitch));
    }
    if (touch.state.moveForward !== 0 || touch.state.moveStrafe !== 0) {
      fp.input.forward = touch.state.moveForward;
      fp.input.strafe = touch.state.moveStrafe;
    }
    if (touch.state.jump) fp.input.jump = true;
  }
  fp.update(dtSec, { isSolid, isFluid, isClimbable });
  if (touch) {
    if (touch.state.primary) {
      if (!lastTouchPrimary) {
        const origin = camera.position;
        const look = fp.lookVector();
        let bestId: number | null = null;
        let bestDist = Infinity;
        for (const mob of mobWorld.all()) {
          const box = {
            minX: mob.position.x - mob.def.aabb.halfX,
            minY: mob.position.y - mob.def.aabb.halfY,
            minZ: mob.position.z - mob.def.aabb.halfZ,
            maxX: mob.position.x + mob.def.aabb.halfX,
            maxY: mob.position.y + mob.def.aabb.halfY,
            maxZ: mob.position.z + mob.def.aabb.halfZ,
          };
          const hit = intersectRayAABB(origin, look, box, 5);
          if (hit && hit.tMin < bestDist) {
            bestDist = hit.tMin;
            bestId = mob.id;
          }
        }
        if (bestId !== null) {
          const result = mobWorld.damage(bestId, 2);
          sfx.play('hit');
          screenShake.pulse(0.15);
          if (result?.killed) {
            spawnMobDrops(result.kind, result.position);
            for (let k = 0; k < 3; k++) xpOrbs.spawn(result.position.x, result.position.y + 0.8, result.position.z, 1);
            blockParticles.emitBreak(
              Math.floor(result.position.x),
              Math.floor(result.position.y),
              Math.floor(result.position.z),
              [180, 40, 40],
            );
          }
        } else {
          interaction.setHeld('break');
        }
      } else {
        interaction.setHeld('break');
      }
    } else if (touch.state.secondary) interaction.setHeld('place');
    else interaction.setHeld(null);
    lastTouchPrimary = touch.state.primary;
  }

  audio.setListener(fp.position.x, fp.position.y, fp.position.z);
  rain.update(dtSec, fp.position.x, fp.position.y, fp.position.z);
  blockParticles.tick(dtSec);
  tickTnt(dtSec);
  // Torch flame flicker: scan for torch/glowstone in 5x3x5 and emit tiny yellow sparks.
  torchEmberAccum += dtSec;
  if (torchEmberAccum > 0.3) {
    torchEmberAccum = 0;
    const torchId = registry.byName('webmc:torch');
    const glowId = registry.byName('webmc:glowstone');
    if (torchId !== undefined || glowId !== undefined) {
      const px = Math.floor(fp.position.x);
      const py = Math.floor(fp.position.y);
      const pz = Math.floor(fp.position.z);
      let emitted = 0;
      for (let dx = -3; dx <= 3 && emitted < 2; dx++) {
        for (let dz = -3; dz <= 3 && emitted < 2; dz++) {
          for (let dy = -2; dy <= 2 && emitted < 2; dy++) {
            const s = world.get(px + dx, py + dy, pz + dz);
            if (s === AIR) continue;
            const id = stateId(s);
            if (id !== torchId && id !== glowId) continue;
            if (Math.random() > 0.12) continue;
            blockParticles.emitPlace(
              px + dx + 0.5,
              py + dy + 0.9,
              pz + dz + 0.5,
              [255, 235, 140],
            );
            emitted++;
          }
        }
      }
    }
  }
  // Lava ember: scan nearby (5×3×5) for lava and emit drifting orange embers.
  lavaEmberAccum += dtSec;
  if (lavaEmberAccum > 0.18) {
    lavaEmberAccum = 0;
    const lavaId = registry.byName('webmc:lava');
    if (lavaId !== undefined) {
      const px = Math.floor(fp.position.x);
      const py = Math.floor(fp.position.y);
      const pz = Math.floor(fp.position.z);
      let emitted = 0;
      for (let dx = -3; dx <= 3 && emitted < 2; dx++) {
        for (let dz = -3; dz <= 3 && emitted < 2; dz++) {
          for (let dy = -2; dy <= 2 && emitted < 2; dy++) {
            const s = world.get(px + dx, py + dy, pz + dz);
            if (s === AIR) continue;
            if (stateId(s) !== lavaId) continue;
            if (Math.random() > 0.05) continue;
            blockParticles.emitPlace(px + dx + 0.5, py + dy + 1.1, pz + dz + 0.5, [255, 160, 60]);
            emitted++;
          }
        }
      }
    }
  }
  if (autoWeatherEnabled) {
    weatherTimer -= dtSec;
    if (weatherTimer <= 0) {
      const r = Math.random();
      const next: 'clear' | 'rain' | 'thunder' = r < 0.6 ? 'clear' : r < 0.9 ? 'rain' : 'thunder';
      if (next !== currentWeather) {
        setWeather(next);
        toast.show(next === 'clear' ? 'Weather clears' : next === 'rain' ? 'Rain begins' : 'Thunderstorm', '#a0d0ff', 1500);
      }
      weatherTimer = 180 + Math.random() * 240;
    }
  }
  if (currentWeather === 'thunder') {
    lightningTimer -= dtSec;
    if (lightningTimer <= 0) {
      lightningFlash();
      lightningTimer = 20 + Math.random() * 40;
    }
  } else {
    lightningTimer = 15 + Math.random() * 30;
  }
  clouds.update(dtSec, fp.position.x, fp.position.z, currentWeather);
  sky.update(fp.position, dayNight.sunDir);
  stars.update(fp.position, dayNight.sunDir.y);
  const horizSpeed = Math.hypot(fp.velocity.x, fp.velocity.z);
  sfx.footstepIfMoving(fp.onGround && horizSpeed > 1.2 && !fp.input.fly, dtSec);
  {
    const dpx = fp.position.x - lastStatsPos.x;
    const dpz = fp.position.z - lastStatsPos.z;
    if (fp.onGround && !fp.input.fly) {
      const moved = Math.hypot(dpx, dpz);
      if (moved > 0 && moved < 2) playerStats.distanceWalked += moved;
    }
    lastStatsPos = { x: fp.position.x, y: fp.position.y, z: fp.position.z };
    playerStats.playtimeSec += dtSec;
    statsSaveAccum += dtSec;
    if (statsSaveAccum > 30) {
      statsSaveAccum = 0;
      void persistDB.setMeta('playerStats', playerStats);
    }
  }
  checkAchievements();
  // Sprint dust particles
  if (fp.input.sprint && fp.onGround && !fp.input.fly && horizSpeed > 3) {
    sprintDustAccum += dtSec;
    if (sprintDustAccum > 0.15) {
      sprintDustAccum = 0;
      const groundY = Math.floor(fp.position.y - 0.95);
      const groundBlock = world.get(Math.floor(fp.position.x), groundY, Math.floor(fp.position.z));
      if (groundBlock !== AIR) {
        const gDef = registry.get(stateId(groundBlock));
        blockParticles.emitPlace(fp.position.x, fp.position.y - 0.85, fp.position.z, gDef.color);
      }
    }
  }
  dayNight.tick(dtSec);
  timeSaveAccum += dtSec;
  if (timeSaveAccum > 10) {
    timeSaveAccum = 0;
    void persistDB.setMeta('timeOfDay', dayNight.timeOfDay);
  }
  if (lightningFlashSec > 0) lightningFlashSec = Math.max(0, lightningFlashSec - dtSec);
  const flashBoost = lightningFlashSec > 0 ? Math.min(1, lightningFlashSec / 0.18) * 0.7 : 0;
  const weatherDimming = (currentWeather === 'thunder' ? 0.5 : currentWeather === 'rain' ? 0.7 : 1.0) + flashBoost;
  tmpSkyColor.copy(dayNight.skyColor).multiplyScalar(weatherDimming);
  tmpFogColor.copy(dayNight.fogColor).multiplyScalar(weatherDimming);
  // Biome fog tint: forest gets a hint of green. Use fp.position so sampling is cheap.
  const biomeId = generator.biomeAt(Math.floor(fp.position.x), Math.floor(fp.position.z));
  if (biomeId === 1) {
    tmpFogColor.multiplyScalar(0.97);
    tmpFogColor.g = Math.min(1, tmpFogColor.g + 0.03);
  }
  const skyColor = tmpSkyColor;
  const fogColor = tmpFogColor;
  const uniforms = chunkRenderer.material.uniforms;
  (uniforms['uSunDir'] as { value: THREE.Vector3 }).value.copy(dayNight.sunDir);
  (uniforms['uSkyColor'] as { value: THREE.Color }).value.copy(skyColor);
  const nightVision = playerState.effects.has('night_vision') ? 0.5 : 0;
  (uniforms['uAmbient'] as { value: number }).value = (dayNight.ambient + nightVision) * weatherDimming * brightnessMul;
  (uniforms['uFogColor'] as { value: THREE.Color }).value.copy(fogColor);
  (uniforms['uCameraPosW'] as { value: THREE.Vector3 }).value.copy(fp.position);
  scene.background = skyColor;
  if (scene.fog instanceof THREE.Fog) scene.fog.color.copy(fogColor);

  const loaderStats = loader.update(fp.position.x, fp.position.z, onUnload, onLoad);

  const sel = hotbar.selected;
  if (sel) {
    interaction.selectedBlock = sel.state;
    hand.setHeldBlockColor(sel.color);
  }
  hand.update(dtSec);
  interaction.tick(now);

  if (gameMode === 'creative') {
    hotbar.setCounts([], 'infinite');
  } else {
    const counts: number[] = [];
    for (let i = 0; i < 9; i++) {
      const entry = hotbar.getEntry(i);
      if (!entry) { counts.push(0); continue; }
      const def = registry.get(stateId(entry.state));
      const itemId = itemRegistry.byName(def.name);
      counts.push(itemId === undefined ? 0 : countInventoryItem(itemId));
    }
    hotbar.setCounts(counts);
  }

  interaction.tickBreak(dtSec);
  if (interaction.breaking && !hand.isSwinging) hand.swing();

  // Crosshair tint: red when aiming at a mob in range
  {
    const originP = camera.position;
    const lookP = fp.lookVector();
    let hitMob = false;
    for (const mob of mobWorld.all()) {
      const box = {
        minX: mob.position.x - mob.def.aabb.halfX,
        minY: mob.position.y - mob.def.aabb.halfY,
        minZ: mob.position.z - mob.def.aabb.halfZ,
        maxX: mob.position.x + mob.def.aabb.halfX,
        maxY: mob.position.y + mob.def.aabb.halfY,
        maxZ: mob.position.z + mob.def.aabb.halfZ,
      };
      if (intersectRayAABB(originP, lookP, box, 5)) {
        hitMob = true;
        break;
      }
    }
    crosshair.setTint(hitMob ? '#ff6060cc' : null);
  }
  const aim = interaction.castRay();
  if (aim && aim.distance > 0) {
    const progress =
      interaction.breaking?.bx === aim.bx &&
      interaction.breaking.by === aim.by &&
      interaction.breaking.bz === aim.bz
        ? interaction.breaking.progress01
        : 0;
    blockOutline.setHit(aim.bx, aim.by, aim.bz, progress);
  } else {
    blockOutline.hide();
  }

  flushDirty();

  // Third-person camera modes orbit around the player's eye position.
  // Avatar group center + 0.18 puts its feet (y=-1.08 local) at fp.position.y - 0.9.
  playerAvatar.setPose(fp.position.x, fp.position.y + 0.18, fp.position.z, fp.yaw + Math.PI);
  const avatarSpeed = Math.hypot(fp.velocity.x, fp.velocity.z);
  playerAvatar.animate(dtSec, fp.onGround && !fp.input.fly ? avatarSpeed : 0);
  if (cameraMode !== 'fp') {
    const look = fp.lookVector();
    const back = cameraMode === 'tp_back' ? -3 : 3;
    camera.position.x += look.x * back;
    camera.position.y += look.y * back;
    camera.position.z += look.z * back;
    if (cameraMode === 'tp_front') {
      camera.rotation.set(-fp.pitch, fp.yaw + Math.PI, 0, 'YXZ');
    }
  }

  screenShake.apply(camera, dtSec);
  renderer.render(scene, camera);

  playerState.sprinting = fp.input.sprint;
  if (mobDamageMultiplier === 0) {
    // Peaceful: auto-regen HP + hunger, no starvation.
    if (playerState.health < 20) playerState.heal(1 * dtSec);
    if (playerState.hunger < 20) playerState.eat(1 * dtSec, 0.1 * dtSec);
  }
  playerState.tick(dtSec, { inFluid: fp.inFluid });

  if (fp.lastLandFallBlocks > 3 && (gameMode === 'survival' || gameMode === 'adventure')) {
    const dmg = fp.lastLandFallBlocks - 3;
    playerState.takeDamage({ amount: dmg, source: 'fall' });
  }
  fp.lastLandFallBlocks = 0;

  if (playerState.hunger <= 0 && (gameMode === 'survival' || gameMode === 'adventure')) {
    if (!starvingShown) {
      starvingShown = true;
      toast.show('Starving!', '#ff6060', 2000);
    }
  } else {
    starvingShown = false;
  }
  if (playerState.justDied && !deathScreen.isVisible() && !playerState.invulnerable) {
    deathScreen.show();
    fp.inputBlocked = true;
    document.exitPointerLock();
    playerState.justDied = false;
  }

  if (playerState.health < lastPlayerHealth - 0.05) {
    const delta = lastPlayerHealth - playerState.health;
    hurtVignette.pulse(Math.min(0.95, 0.35 + delta * 0.08));
    screenShake.pulse(Math.min(1, 0.2 + delta * 0.1));
    sfx.play('hit');
  }
  lastPlayerHealth = playerState.health;
  hurtVignette.tick(dtSec);
  fluidOverlay.set(fp.inFluid);
  // Drowning feedback: breath < 2s → slight hurt vignette pulse
  if (fp.inFluid === 'water' && playerState.breath < 2) {
    hurtVignette.pulse(0.15);
  }
  // Residual lava fire: orange vignette while burning outside lava
  if (playerState.fireRemainingSec > 0 && fp.inFluid !== 'lava') {
    hurtVignette.pulse(Math.min(0.4, playerState.fireRemainingSec * 0.08));
  }
  if (fp.inFluid !== lastInFluid) {
    if (fp.inFluid === 'water') sfx.play('step');
    else if (fp.inFluid === 'lava') sfx.play('hit');
    lastInFluid = fp.inFluid;
  }
  compassBar.setYaw(fp.yaw);
  if (gameMode === 'survival' || gameMode === 'adventure') {
    survivalHud.render({
      health: playerState.health,
      maxHealth: 20,
      hunger: playerState.hunger,
      maxHunger: 20,
      breathSec: playerState.breath,
      maxBreathSec: BREATH_MAX_SEC,
      underwater: fp.inFluid === 'water',
      xpLevel: playerState.xpLevel,
      xpProgress: playerState.xpProgress,
      xpToNext: xpToNext(playerState.xpLevel),
    });
  }

  if (chunkRenderer.meshCount > 20 && mobDamageMultiplier > 0) {
    spawnSystem.tick(dtSec, mobWorld, {
      playerPos: { x: fp.position.x, y: fp.position.y, z: fp.position.z },
      isDay: dayNight.isDay,
      surfaceAt: (x, z) => generator.surfaceAt(x, z),
      isSolid,
    });
  }

  fluidTickAccum += dtSec;
  while (fluidTickAccum >= FLUID_TICK_SEC) {
    fluidTickAccum -= FLUID_TICK_SEC;
    const { changed } = fluidWorld.tick();
    for (const p of changed) {
      const cx = Math.floor(p.x / 16);
      const cz = Math.floor(p.z / 16);
      const chunk = world.getChunk(cx, cz);
      if (chunk) {
        const light = lightCache.get(lightKey(cx, cz)) ?? null;
        chunkStore.markDirty(chunk, light);
      }
    }
  }

  mobWorld.tick(dtSec, {
    isSolid,
    playerPos: { x: fp.position.x, y: fp.position.y, z: fp.position.z },
    damagePlayer: (amt) => {
      const scaled = amt * mobDamageMultiplier;
      if (scaled > 0) playerState.takeDamage({ amount: scaled, source: 'mob' });
      if (!playerState.invulnerable && scaled > 0) sfx.play('hit');
    },
    onCreeperExplode: (x, y, z) => {
      explodeAt(Math.floor(x), Math.floor(y), Math.floor(z), 3);
    },
    isSunlit: (x, y, z) => {
      if (!dayNight.isDay) return false;
      if (currentWeather === 'thunder') return false;
      // Check nothing opaque above the mob's head out to the top of the world.
      const bx = Math.floor(x);
      const bz = Math.floor(z);
      const startY = Math.floor(y + 0.5);
      for (let yy = startY; yy < CHUNK_HEIGHT; yy++) {
        const s = world.get(bx, yy, bz);
        if (s === AIR) continue;
        if (registry.get(stateId(s)).opaque) return false;
      }
      return true;
    },
  });
  mobRenderer.sync(mobWorld.all());

  damageNumbers.tick(dtSec, (wx, wy, wz) => {
    const v = new THREE.Vector3(wx, wy, wz);
    v.project(camera);
    if (v.z > 1) return { sx: 0, sy: 0, visible: false };
    const sx = (v.x + 1) * 0.5 * window.innerWidth;
    const sy = (-v.y + 1) * 0.5 * window.innerHeight;
    return { sx, sy, visible: true };
  });

  const markers: { x: number; z: number; color: string; size?: number }[] = [];
  for (const m of mobWorld.all()) {
    const isHostile = m.def.behavior === 'hostile' || m.def.behavior === 'creeper';
    markers.push({ x: m.position.x, z: m.position.z, color: isHostile ? '#ff5050' : '#a0ffa0' });
  }
  for (const p of droppedItems.positions()) {
    markers.push({ x: p.x, z: p.z, color: '#e0e0a0', size: 1 });
  }
  for (const p of xpOrbs.positions()) {
    markers.push({ x: p.x, z: p.z, color: '#80ff40', size: 1 });
  }
  if (playerSpawnPoint) {
    markers.push({ x: playerSpawnPoint.x, z: playerSpawnPoint.z, color: '#ffc0e0', size: 4 });
  }
  minimap.tick(dtSec, fp.position.x, fp.position.z, world, registry, generator, markers);
  droppedItems.tick(dtSec, isSolid, fp.input.sneak ? { x: -9999, y: 0, z: 0 } : fp.position, (out) => {
    inventory.add({ itemId: out.itemId, count: out.count, damage: 0 });
    sfx.play('click');
    const def = itemRegistry.get(out.itemId);
    chatInput.addLine(
      `+ ${String(out.count)} ${def.name.replace(/^webmc:/, '')}`,
      '#d2ff80',
    );
  });
  xpOrbs.tick(dtSec, isSolid, fp.position, (xp) => {
    playerState.addXP(xp);
    sfx.play('click');
  });
  if (playerState.xpLevel > lastXpLevel) {
    sfx.play('place');
    chatInput.addLine(`Level up! Level ${String(playerState.xpLevel)}`, '#80ffa0');
    toast.show(`LV ${String(playerState.xpLevel)}`, '#80ffa0', 900);
    lastXpLevel = playerState.xpLevel;
  } else if (playerState.xpLevel < lastXpLevel) {
    lastXpLevel = playerState.xpLevel;
  }
  if (dayNight.isDay !== lastIsDay) {
    lastIsDay = dayNight.isDay;
    if (dayNight.isDay) {
      dayCounter++;
      void persistDB.setMeta('dayCounter', dayCounter);
    }
    toast.show(dayNight.isDay ? `Day ${String(dayCounter)}` : 'Night falls', dayNight.isDay ? '#ffd080' : '#80a0ff', 1500);
  }

  if (now - lastPlayerSaveAt > 30000) {
    lastPlayerSaveAt = now;
    void savePlayerNow().then(() => {
      chatInput.addLine('World saved.', '#80a0ff');
    });
  }

  if (debugOverlay.isEnabled()) {
    debugOverlay.render({
      fps: stats.fps,
      frameMs: stats.frameMs,
      position: { x: fp.position.x, y: fp.position.y, z: fp.position.z },
      look: { yaw: fp.yaw, pitch: fp.pitch },
      chunkPos: { cx: Math.floor(fp.position.x / 16), cz: Math.floor(fp.position.z / 16) },
      meshCount: chunkRenderer.meshCount,
      triangles: chunkRenderer.triangleCount,
      pendingChunks: loaderStats.pending,
      gameMode,
      timeOfDay: dayNight.timeOfDay,
      health: playerState.health,
      hunger: playerState.hunger,
      fly: fp.input.fly,
      onGround: fp.onGround,
      fluid: fp.inFluid,
      viewDistance: loader.viewRadius,
      rendererName: `${rendererInfo.gl}  ${rendererInfo.rend}`,
      mobs: mobWorld.size,
      hostile: (() => { let n = 0; for (const m of mobWorld.all()) if (m.def.behavior === 'hostile' || m.def.behavior === 'creeper') n++; return n; })(),
      passive: (() => { let n = 0; for (const m of mobWorld.all()) if (m.def.behavior === 'passive') n++; return n; })(),
      drops: droppedItems.size,
      xpOrbs: xpOrbs.size,
      seed: WORLD_SEED,
      biome: generator.biomeAt(Math.floor(fp.position.x), Math.floor(fp.position.z)) === 1 ? 'forest' : 'plains',
    });
    hud.textContent = '';
  } else {
    const hour = Math.floor(((dayNight.timeOfDay + 0.25) * 24) % 24);
    const minute = Math.floor((((dayNight.timeOfDay + 0.25) * 24) % 1) * 60);
    const clock = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    const aimedBlock = aim
      ? registry.get(stateId(world.get(aim.bx, aim.by, aim.bz))).name.replace(/^webmc:/, '')
      : '';
    let effectStr = '';
    for (const [id, eff] of playerState.effects) {
      effectStr += ` ${id}${eff.amplifier > 0 ? `+${String(eff.amplifier)}` : ''}(${eff.remainingSec.toFixed(0)}s)`;
    }
    hud.textContent =
      `webmc — F3 debug · F5 cam · F1 help\n` +
      `FPS ${stats.fps.toFixed(0).padStart(3)}  frame ${stats.frameMs.toFixed(1)}ms  ${clock}  d${String(dayCounter)}\n` +
      `pos ${fp.position.x.toFixed(1)} ${fp.position.y.toFixed(1)} ${fp.position.z.toFixed(1)}\n` +
      `HP ${playerState.health.toFixed(0)}/20  food ${playerState.hunger.toFixed(0)}/20  mobs ${mobWorld.size}${roomCode ? `  room ${roomCode}` : ''}\n` +
      `${gameMode} · ${sel?.name ?? '?'} · chunks ${chunkRenderer.meshCount}${aimedBlock ? `  → ${aimedBlock}` : ''}${effectStr ? `\nfx${effectStr}` : ''}`;
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

if (import.meta.env.DEV) {
  console.info('[webmc] boot ok', rendererInfo);
}
