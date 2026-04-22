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
import { PlayerState } from './game/PlayerState';
import { MobWorld } from './entities/mob';
import { MobRenderer } from './engine/render/MobRenderer';
import { SpawnSystem } from './entities/spawn';

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

const touch = isTouchDevice() ? new TouchControls() : null;
touch?.attach(appEl);

const chunkRenderer = new ChunkRenderer();
scene.add(chunkRenderer.group);

const mobWorld = new MobWorld();
const mobRenderer = new MobRenderer();
scene.add(mobRenderer.group);
const spawnSystem = new SpawnSystem();

const dayNight = new DayNightCycle({ dayLengthSec: 600 });

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
      const prevState = world.get(bx, by, bz);
      const prevBlockId = stateId(prevState);
      const drops = dropRegistry.drops(prevBlockId, undefined, 99);
      for (const s of drops) inventory.add(s);
      touchWorldEdit(bx, by, bz, 0);
    },
    onPlace: (bx, by, bz) => {
      audio.play3D('place', bx + 0.5, by + 0.5, bz + 0.5);
      const sel = hotbar.selected;
      const blockId = sel ? stateId(sel.state) : 0;
      touchWorldEdit(bx, by, bz, blockId);
    },
  },
);
interaction.attach(canvas);
interaction.selectedBlock = STONE;

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
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    void chunkStore.flush();
    void savePlayerNow();
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
  fp.update(dtSec, { isSolid });
  if (touch?.state.primary) {
    (interaction as unknown as { held: string | null }).held = 'break';
    interaction.tick(now);
    (interaction as unknown as { held: string | null }).held = null;
  }
  if (touch?.state.secondary) {
    (interaction as unknown as { held: string | null }).held = 'place';
    interaction.tick(now);
    (interaction as unknown as { held: string | null }).held = null;
  }

  audio.setListener(fp.position.x, fp.position.y, fp.position.z);
  dayNight.tick(dtSec);
  const uniforms = chunkRenderer.material.uniforms;
  (uniforms['uSunDir'] as { value: THREE.Vector3 }).value.copy(dayNight.sunDir);
  (uniforms['uSkyColor'] as { value: THREE.Color }).value.copy(dayNight.skyColor);
  (uniforms['uAmbient'] as { value: number }).value = dayNight.ambient;
  scene.background = dayNight.skyColor;
  if (scene.fog instanceof THREE.Fog) scene.fog.color.copy(dayNight.fogColor);

  const loaderStats = loader.update(fp.position.x, fp.position.z, onUnload, onLoad);

  const sel = hotbar.selected;
  if (sel) interaction.selectedBlock = sel.state;
  interaction.tick(now);

  flushDirty();

  renderer.render(scene, camera);

  playerState.sprinting = fp.input.sprint;
  playerState.tick(dtSec);

  if (chunkRenderer.meshCount > 20) {
    spawnSystem.tick(dtSec, mobWorld, {
      playerPos: { x: fp.position.x, y: fp.position.y, z: fp.position.z },
      isDay: dayNight.isDay,
      surfaceAt: (x, z) => generator.surfaceAt(x, z),
      isSolid,
    });
  }

  mobWorld.tick(dtSec, {
    isSolid,
    playerPos: { x: fp.position.x, y: fp.position.y, z: fp.position.z },
    damagePlayer: (amt) => {
      playerState.takeDamage({ amount: amt, source: 'mob' });
    },
  });
  mobRenderer.sync(mobWorld.all());

  if (now - lastPlayerSaveAt > 5000) {
    lastPlayerSaveAt = now;
    void savePlayerNow();
  }

  const look = fp.lookVector();
  hud.textContent =
    `webmc M5\n` +
    `${rendererInfo.gl}  ${rendererInfo.rend}\n` +
    `FPS ${stats.fps.toFixed(0).padStart(3)}  frame ${stats.frameMs.toFixed(1)}ms\n` +
    `pos ${fp.position.x.toFixed(1)} ${fp.position.y.toFixed(1)} ${fp.position.z.toFixed(1)}\n` +
    `look ${look.x.toFixed(2)} ${look.y.toFixed(2)} ${look.z.toFixed(2)}\n` +
    `chunks ${chunkRenderer.meshCount}  tris ${chunkRenderer.triangleCount}  pending ${loaderStats.pending}\n` +
    `HP ${playerState.health.toFixed(0)}/20  food ${playerState.hunger.toFixed(0)}/20  items ${inventory.hotbar.filter((s) => s !== null).length}/9  mobs ${mobWorld.size}${roomCode ? `  room ${roomCode}` : ''}\n` +
    `seed ${WORLD_SEED.toString(16)}  ${fp.input.fly ? 'fly' : 'walk'}  ${sel?.name ?? '?'}  save${chunkStore.pendingCount}`;
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

if (import.meta.env.DEV) {
  console.info('[webmc] boot ok', rendererInfo);
}
