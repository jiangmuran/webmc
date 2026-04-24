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
import { ResourcePackLoader } from './ui/ResourcePackLoader';
import { SettingsPanel } from './ui/SettingsPanel';
import { DebugOverlay } from './ui/DebugOverlay';
import { Crosshair } from './ui/Crosshair';
import { SurvivalHud, HurtVignette } from './ui/SurvivalHud';
import { FluidOverlay } from './ui/FluidOverlay';
import { DeathScreen } from './ui/DeathScreen';
import { CompassBar } from './ui/CompassBar';
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
itemRegistry.register({ name: 'webmc:torch', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:crafting_table', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:furnace', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:chest', maxStack: 64, durability: 0 });

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
  onRespawn: () => {
    const s = generator.surfaceAt(0, 0) + 4;
    fp.position.set(worldMeta.spawn.x, s, worldMeta.spawn.z);
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
  const spawnHeight = generator.surfaceAt(0, 0) + 4;
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
function setWeather(w: 'clear' | 'rain' | 'thunder'): void {
  currentWeather = w;
  rain.setActive(w !== 'clear');
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
    },
    canPlace: () => {
      if (gameMode === 'creative') return true;
      const sel = hotbar.selected;
      if (!sel) return false;
      const def = registry.get(stateId(sel.state));
      const itemId = itemRegistry.byName(def.name);
      if (itemId === undefined) return false;
      return countInventoryItem(itemId) > 0;
    },
    onInteract: (bx, by, bz) => {
      const state = world.get(bx, by, bz);
      if (state === AIR) return false;
      const id = stateId(state);
      const def = registry.get(id);
      // Doors and trapdoors: toggle open-flag bit in the props word.
      if (def.name.endsWith('_door') || def.name.endsWith('_trapdoor')) {
        const props = (state >>> 16) ^ 1;
        world.set(bx, by, bz, makeState(id, props));
        sfx.play('click');
        touchWorldEdit(bx, by, bz, id);
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
    const result = mobWorld.damage(bestId, 2);
    sfx.play('hit');
    interaction.setHeld(null);
    screenShake.pulse(0.15);
    hand.swing();
    if (result?.killed) {
      spawnMobDrops(result.kind, result.position);
      for (let k = 0; k < 3; k++) xpOrbs.spawn(result.position.x, result.position.y + 0.8, result.position.z, 1);
    }
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
deathScreen.setOnRespawn(() => {
  fp.inputBlocked = false;
  void canvas.requestPointerLock();
});
survivalHud.setVisible(false);
let lastPlayerHealth = 20;
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

const mainMenu = new MainMenu(appEl, {
  onPlay: () => {
    fp.inputBlocked = false;
    applyGameMode(gameMode);
    void canvas.requestPointerLock();
  },
  onOpenSettings: () => { settingsPanel.show(); },
  onOpenResourcePacks: () => { resourcePackLoader.show(); },
});
fp.inputBlocked = true;
applyGameMode(gameMode);

const survivalInv = new SurvivalInventory(appEl, inventory, itemRegistry, {
  onClose: () => {
    fp.inputBlocked = false;
    void canvas.requestPointerLock();
  },
  onEat: (_id, hungerRestore, saturation) => {
    playerState.eat(hungerRestore, saturation);
    sfx.play('click');
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
    if (e.code === 'KeyQ') {
      e.preventDefault();
      const sel = hotbar.selected;
      if (sel && (gameMode === 'survival' || gameMode === 'adventure')) {
        const def = registry.get(stateId(sel.state));
        const itemId = itemRegistry.byName(def.name);
        if (itemId !== undefined) {
          const look = fp.lookVector();
          droppedItems.spawn(fp.position.x + look.x * 1.2, fp.position.y, fp.position.z + look.z * 1.2, {
            itemId,
            count: 1,
            color: def.color,
          }, 1.5);
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
    if (!mainMenu.isVisible() && !pauseMenu.isVisible() && !chatInput.isOpen() && !settingsPanel.isVisible() && !resourcePackLoader.isVisible() && !creativeInv.isVisible() && !survivalInv.isVisible()) {
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
  const cx = Math.floor(bx / 16);
  const cz = Math.floor(bz / 16);
  const chunk = world.getChunk(cx, cz);
  if (chunk) {
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
  fp.update(dtSec, { isSolid, isFluid });
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
  clouds.update(dtSec, fp.position.x, fp.position.z, currentWeather);
  sky.update(fp.position, dayNight.sunDir);
  stars.update(fp.position, dayNight.sunDir.y);
  const horizSpeed = Math.hypot(fp.velocity.x, fp.velocity.z);
  sfx.footstepIfMoving(fp.onGround && horizSpeed > 1.2 && !fp.input.fly, dtSec);
  dayNight.tick(dtSec);
  const weatherDimming = currentWeather === 'thunder' ? 0.5 : currentWeather === 'rain' ? 0.7 : 1.0;
  const skyColor = dayNight.skyColor.clone().multiplyScalar(weatherDimming);
  const fogColor = dayNight.fogColor.clone().multiplyScalar(weatherDimming);
  const uniforms = chunkRenderer.material.uniforms;
  (uniforms['uSunDir'] as { value: THREE.Vector3 }).value.copy(dayNight.sunDir);
  (uniforms['uSkyColor'] as { value: THREE.Color }).value.copy(skyColor);
  (uniforms['uAmbient'] as { value: number }).value = dayNight.ambient * weatherDimming;
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
  playerState.tick(dtSec, { inFluid: fp.inFluid });

  if (fp.lastLandFallBlocks > 3 && (gameMode === 'survival' || gameMode === 'adventure')) {
    const dmg = fp.lastLandFallBlocks - 3;
    playerState.takeDamage({ amount: dmg, source: 'fall' });
  }
  fp.lastLandFallBlocks = 0;

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

  if (chunkRenderer.meshCount > 20) {
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
      playerState.takeDamage({ amount: amt, source: 'mob' });
    },
  });
  mobRenderer.sync(mobWorld.all());

  droppedItems.tick(dtSec, isSolid, fp.position, (out) => {
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
    });
    hud.textContent = '';
  } else {
    const hour = Math.floor(((dayNight.timeOfDay + 0.25) * 24) % 24);
    const minute = Math.floor((((dayNight.timeOfDay + 0.25) * 24) % 1) * 60);
    const clock = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    hud.textContent =
      `webmc — F3 debug · F5 cam\n` +
      `FPS ${stats.fps.toFixed(0).padStart(3)}  frame ${stats.frameMs.toFixed(1)}ms  ${clock}\n` +
      `pos ${fp.position.x.toFixed(1)} ${fp.position.y.toFixed(1)} ${fp.position.z.toFixed(1)}\n` +
      `HP ${playerState.health.toFixed(0)}/20  food ${playerState.hunger.toFixed(0)}/20  mobs ${mobWorld.size}${roomCode ? `  room ${roomCode}` : ''}\n` +
      `${gameMode} · ${sel?.name ?? '?'} · chunks ${chunkRenderer.meshCount}`;
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

if (import.meta.env.DEV) {
  console.info('[webmc] boot ok', rendererInfo);
}
