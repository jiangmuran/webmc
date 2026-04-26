import * as THREE from 'three';
import { FrameTimer } from './engine/time/FrameTimer';
import { DayNightCycle } from './engine/time/DayNightCycle';
import { FirstPersonCamera } from './engine/input/FirstPersonCamera';
import { TouchControls, isTouchDevice } from './engine/input/TouchControls';
import { ChunkRenderer } from './engine/render/ChunkRenderer';
import { type BlockState, AIR, makeState, stateId, stateProps } from './blocks/state';
import { createDefaultRegistry } from './blocks/registry';
import { World } from './world/World';
import { CHUNK_HEIGHT, type Chunk } from './world/Chunk';
import { WorldGenerator } from './world/generation/WorldGenerator';
import { ChunkLoader } from './world/ChunkLoader';
import { type ChunkLight, buildLight, flatLightForSection, getLightByte } from './world/lighting';
import {
  type BorderOpacity,
  createMesherClient,
  extractBorderFromSubChunk,
} from './world/workers/MesherClient';
import { InteractionController } from './game/Interaction';
import { Hotbar } from './ui/Hotbar';
import { SubtitleView } from './ui/SubtitleView';
import { BossBarView } from './ui/BossBarView';
import { ScoreboardSidebarView } from './ui/ScoreboardSidebarView';
import { AchievementToastView } from './ui/AchievementToastView';
import { LoadingOverlay } from './ui/LoadingOverlay';
import { ActiveEffectsHud } from './ui/ActiveEffectsHud';
import { AudioBus } from './engine/audio/AudioBus';
import { openIndexedDB } from './persist/db';
import { ChunkStore } from './persist/ChunkStore';
import {
  CURRENT_SCHEMA_VERSION,
  type WorldMeta,
  type PersistedInventory,
  type PersistedItemStack,
  type PersistedVitals,
} from './persist/types';
import { RoomClient } from './net/RoomClient';
import { ItemRegistry, type ItemStack } from './items/item';
import { Inventory } from './items/Inventory';
import { ARMOR_DEFS } from './items/armor';
import { reducedDamage as armorReducedDamage } from './game/armor_damage_formula';
import { isAfk } from './game/afk_idle_kick';
import {
  type EatState,
  cancelEating,
  makeEatState,
  startEating,
  tickEating,
} from './game/eat_animation';
import { critMultiplier, sweepingAttack } from './game/critical_hit';
import { smashDamage } from './items/mace_combat';
import { computeKnockback } from './game/combat_knockback';
import { xpForOre } from './game/mining_xp_ore';
import { WORLD_CAPS as WORLD_MOB_CAPS } from './game/mob_cap_global';
import { randomTick as cropRandomTick, type CropQuery } from './blocks/crop_growth_random_tick';
import { randomTick as saplingRandomTick } from './blocks/sapling_growth';
import { randomTick as caneRandomTick, MAX_HEIGHT as CANE_MAX_H } from './blocks/sugar_cane_grow';
import { rollXp as rollMobXp } from './game/experience_gain';
import { splitXp } from './entities/xp_orb_merge';
import { phaseOfDay } from './game/time_format_day_count';
import { moonPhase } from './items/clock_item';
import { screenshotFilename } from './game/screenshot_capture';
import { TpsTracker } from './game/server_tps_metric';
import { sanitize as sanitizePlayerName } from './game/player_name_sanitize';

const MOON_GLYPHS = ['🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔'];
import { TutorialState, type HintId } from './game/tutorial_first_night';
import { makeMoodState, tickMood } from './game/daytime_mood';
import {
  tickUnderwater,
  type AmbientState as UnderwaterAmbientState,
} from './engine/audio/ambient_underwater';
import { BROWSER_CLIPBOARD } from './game/clipboard_util';
import { canSpawnPhantom } from './entities/phantom_day_despawn';
import { Weather as WeatherCycle } from './world/weather';
import {
  checkPosition as checkWorldBorder,
  makeWorldBorder,
  setSize as setBorderSize,
} from './world/world_border';
import { generateStrongholdPositions as strongholdsInRing } from './world/stronghold_locate';
import { frictionFor as blockFriction } from './physics/ice_slip_friction';
import { requiredLevelFor as requiredMiningLevel } from './items/tool_tier';
import { loadPack as loadDatapack, type DataPack } from './datapack/DataPack';
import { createManifest as createExportManifest } from './persist/webmc_export_zip';
import {
  beginSave,
  endSave,
  makeSaveState,
  markDirty as markSaveDirty,
  shouldSave,
} from './game/autosave_debounce';
import { ticksToBreak as breakTicksFor } from './game/break_speed';
import { searchRespawnSpot } from './game/bed_obstructed';
import { classify as classifyGpu, recommendedChunkRadius } from './engine/gpu_tier_detect';
import { maxRenderDistanceChunks, shouldPauseRender } from './engine/power_budget';
import { inThermalThrottle } from './engine/chunk_unload_strategy_thermal';
import { kindFor as kindForWeather } from './engine/weather_particles';
import { adjustedTemperature } from './world/biome_precipitation';
import { skyOf } from './world/sky_color';
import { bedlessRespawn } from './world/spawn_safety';
import { useAxe } from './items/axe_strip';
import { useShovel } from './items/shovel_path';
import { useHoe } from './items/hoe_till';
import { applyBoneMeal } from './items/bone_meal';
import { pickTrial, CHORUS_MAX_ATTEMPTS } from './items/chorus_fruit_teleport';
import { makeStats as makeFpsStats, onFrame as fpsFrame, p95Fps } from './engine/fps_counter';
import { pressureLevel as memPressureLevel } from './engine/memory_pressure';
import { toIntent as gamepadToIntent } from './engine/input/gamepad_mapping';
import { rumbleForDamage } from './engine/input/gamepad_rumble';
import {
  init as initGyro,
  onSample as onGyroSample,
  setEnabled as setGyroEnabled,
  type GyroSmoothed,
} from './engine/input/gyro_assist';
import { startPinch, updateFov, type PinchState } from './engine/input/touch_pinch_zoom';
import { BlockDropRegistry } from './items/block-drops';
import { RecipeRegistry } from './items/recipe';
import { registerDefaultRecipes } from './items/default-recipes';
import { PlayerState, xpToNext, BREATH_MAX_SEC } from './game/PlayerState';
import { MobWorld, MOB_DEFS } from './entities/mob';
import {
  makeTameable,
  toggleSit,
  tryTame,
  type TameableKind,
  type TameableState,
} from './entities/tameable';
import {
  feed as animalFeed,
  isInLove,
  onBreedComplete,
  canBreed,
  type AnimalLove,
} from './entities/animal_breed_love';
import { canLeash, tensionStep } from './entities/leash_tether';
import { tick as babyTick, growFraction, type BabyState } from './game/baby_grow_speedup';
import { damageTiltAngle } from './game/player_damage_tilt_direction';
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
import {
  applyPackToRegistry,
  buildPatternTextureFromPack,
} from './engine/render/ResourcePackApply';
import { type GameMode, effectsFor, nextGameMode } from './game/GameMode';
import { executeCommand, executeCommands } from './game/CommandExecutor';

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

const detectedGpuTier = ((): 'low' | 'mid' | 'high' => {
  try {
    const gl = renderer.getContext();
    const debugInfo = (gl as WebGL2RenderingContext).getExtension('WEBGL_debug_renderer_info');
    let rendererName = '';
    if (debugInfo) {
      rendererName = String(
        (gl as WebGL2RenderingContext).getParameter(
          (debugInfo as { UNMASKED_RENDERER_WEBGL: number }).UNMASKED_RENDERER_WEBGL,
        ) ?? '',
      );
    }
    const maxTextureSize = (gl as WebGL2RenderingContext).getParameter(
      gl.MAX_TEXTURE_SIZE,
    ) as number;
    return classifyGpu({
      rendererName,
      maxTextureSize,
      webgpuAvailable: 'gpu' in navigator,
      instancedArrays: true,
    });
  } catch {
    return 'mid';
  }
})();

const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

let gyroState: GyroSmoothed = initGyro();
let gyroYawAccum = 0;
if (isMobileDevice) {
  window.addEventListener('deviceorientation', (e) => {
    if (typeof e.alpha !== 'number') return;
    const result = onGyroSample(gyroState, {
      alpha: e.alpha,
      beta: e.beta ?? 0,
      gamma: e.gamma ?? 0,
    });
    gyroState = result.state;
    gyroYawAccum += result.yawDelta * 0.0035;
  });

  let pinch: PinchState | null = null;
  window.addEventListener(
    'touchstart',
    (e) => {
      if (e.touches.length === 2) {
        const t0 = e.touches[0]!;
        const t1 = e.touches[1]!;
        const d = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
        pinch = startPinch(fp.camera.fov, d);
      }
    },
    { passive: true },
  );
  window.addEventListener(
    'touchmove',
    (e) => {
      if (e.touches.length === 2 && pinch) {
        const t0 = e.touches[0]!;
        const t1 = e.touches[1]!;
        const d = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
        pinch = updateFov(pinch, d);
        fp.setBaseFov(pinch.currentFov);
      }
    },
    { passive: true },
  );
  window.addEventListener(
    'touchend',
    () => {
      if (pinch) pinch = null;
    },
    { passive: true },
  );
}

if (localStorage.getItem('webmc:settings') === null) {
  const recVD = recommendedChunkRadius(detectedGpuTier, !isMobileDevice);
  try {
    localStorage.setItem(
      'webmc:settings',
      JSON.stringify({
        viewDistance: recVD,
        chunkUploadBudget: detectedGpuTier === 'low' ? 1 : detectedGpuTier === 'mid' ? 3 : 6,
      }),
    );
  } catch {
    /* non-fatal */
  }
}

interface BatteryManager {
  level: number;
  charging: boolean;
  addEventListener: (type: 'levelchange' | 'chargingchange', cb: () => void) => void;
}
type NavWithBattery = Navigator & { getBattery?: () => Promise<BatteryManager> };
const powerState = { batteryLevel: 1, charging: true };
void (async (): Promise<void> => {
  const nav = navigator as NavWithBattery;
  if (typeof nav.getBattery !== 'function') return;
  try {
    const b = await nav.getBattery();
    const update = (): void => {
      powerState.batteryLevel = b.level;
      powerState.charging = b.charging;
    };
    update();
    b.addEventListener('levelchange', update);
    b.addEventListener('chargingchange', update);
  } catch {
    /* Battery API unavailable — non-fatal */
  }
})();

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
const vineId = registry.byName('webmc:vine');
const scaffoldingId = registry.byName('webmc:scaffolding');
const twistingVinesId = registry.byName('webmc:twisting_vines');
const weepingVinesId = registry.byName('webmc:weeping_vines');
const climbableIds = new Set<number>();
for (const id of [ladderId, vineId, scaffoldingId, twistingVinesId, weepingVinesId]) {
  if (id !== undefined) climbableIds.add(id);
}
const isClimbable = (x: number, y: number, z: number): boolean => {
  if (y < 0 || y >= CHUNK_HEIGHT) return false;
  const s = world.get(x, y, z);
  if (s === AIR) return false;
  // Was ladder-only — vines, scaffolding, twisting/weeping vines are
  // also climbable in vanilla. Without this you couldn't climb out of
  // jungles or use scaffolding for builds.
  return climbableIds.has(stateId(s));
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
    // Random seed per fresh world — was always 0xabc1234 so every new
    // player got the same flat-default landscape and identical /seed.
    seed: ((Math.random() * 0x7fffffff) | 0) >>> 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    schemaVersion: CURRENT_SCHEMA_VERSION,
    spawn: { x: 0.5, y: 80, z: 0.5 },
  } satisfies WorldMeta;
  await persistDB.putWorld(worldMeta);
}
await persistDB.setMeta('lastPlayedWorldId', worldMeta.id);
document.title = `webmc · ${worldMeta.name}`;
const worldNameForUI = worldMeta.name;

const WORLD_SEED = worldMeta.seed;
const generator = new WorldGenerator(WORLD_SEED, registry);
const chunkStore = new ChunkStore(persistDB, { worldId: worldMeta.id });
chunkStore.startAutoFlush();
// Initial view radius — perfMonitor will adapt up/down based on FPS, but
// starting too low (was 6) makes the first 3s of gameplay feel cramped.
// Desktop opens at 8 (~128 block sight); mobile keeps 4 to be kind to
// thermals. The dynamic loop in perfMonitor takes over after ~3s.
const loader = new ChunkLoader(world, generator, {
  viewRadius: isMobileDevice ? 4 : 8,
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
// Mob buckets — same physical 'bucket of <fish>' shape vanilla uses for
// catching aquatic mobs. Required for axolotl breeding (BREED_FOOD lists
// tropical_fish_bucket) and the catch-fish-in-bucket interaction.
itemRegistry.register({ name: 'webmc:tropical_fish_bucket', maxStack: 1, durability: 0 });
itemRegistry.register({ name: 'webmc:cod_bucket', maxStack: 1, durability: 0 });
itemRegistry.register({ name: 'webmc:salmon_bucket', maxStack: 1, durability: 0 });
itemRegistry.register({ name: 'webmc:pufferfish_bucket', maxStack: 1, durability: 0 });
itemRegistry.register({ name: 'webmc:axolotl_bucket', maxStack: 1, durability: 0 });
itemRegistry.register({ name: 'webmc:bone', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:arrow', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:feather', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:raw_porkchop', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:raw_beef', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:raw_chicken', maxStack: 64, durability: 0 });
// Was missing: raw_mutton, raw_rabbit. Sheep/rabbit drops referenced
// these names but the items didn't exist — drops silently failed.
itemRegistry.register({ name: 'webmc:raw_mutton', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:raw_rabbit', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:leather', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:wool', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:gunpowder', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:string', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:stick', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:coal', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:charcoal', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:iron_ingot', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:gold_ingot', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:copper_ingot', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:netherite_ingot', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:netherite_scrap', maxStack: 64, durability: 0 });
// Raw ore items (1.17+ — ores drop these instead of the block, then smelt
// to ingots). DROP_OVERRIDES + smelt panel both reference these names but
// they were never registered, so iron/gold/copper ore mining fell back to
// the default block-item drop and the smelt list silently dropped 6 entries.
itemRegistry.register({ name: 'webmc:raw_iron', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:raw_gold', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:raw_copper', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:diamond', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:wheat', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:cocoa_beans', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:sugar', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:egg', maxStack: 16, durability: 0 });
itemRegistry.register({ name: 'webmc:snowball', maxStack: 16, durability: 0 });
itemRegistry.register({ name: 'webmc:milk_bucket', maxStack: 1, durability: 0 });
// Tool tier table. Vanilla durability values per tier.
const TOOL_DURABILITY: Record<string, number> = {
  wood: 60,
  stone: 132,
  iron: 251,
  gold: 33,
  diamond: 1562,
  netherite: 2032,
};
// Generated tool registrations. Was hand-rolled and patchy: only iron
// had axe + shovel registered, no hoes existed at all, several tiers
// missing for sword (gold/netherite). Loop covers every (tier, kind).
for (const tier of Object.keys(TOOL_DURABILITY) as (keyof typeof TOOL_DURABILITY)[]) {
  const dur = TOOL_DURABILITY[tier]!;
  for (const kind of ['pickaxe', 'sword', 'axe', 'shovel', 'hoe'] as const) {
    itemRegistry.register({ name: `webmc:${tier}_${kind}`, maxStack: 1, durability: dur });
  }
}
itemRegistry.register({
  name: 'webmc:bread',
  maxStack: 64,
  durability: 0,
  hungerRestore: 5,
  saturation: 6,
});
itemRegistry.register({
  name: 'webmc:cookie',
  maxStack: 64,
  durability: 0,
  hungerRestore: 2,
  saturation: 0.4,
});
itemRegistry.register({ name: 'webmc:cake', maxStack: 1, durability: 0 });
itemRegistry.register({
  name: 'webmc:cooked_porkchop',
  maxStack: 64,
  durability: 0,
  hungerRestore: 8,
  saturation: 12.8,
});
itemRegistry.register({
  name: 'webmc:cooked_beef',
  maxStack: 64,
  durability: 0,
  hungerRestore: 8,
  saturation: 12.8,
});
itemRegistry.register({
  name: 'webmc:cooked_chicken',
  maxStack: 64,
  durability: 0,
  hungerRestore: 6,
  saturation: 7.2,
});
itemRegistry.register({
  name: 'webmc:apple',
  maxStack: 64,
  durability: 0,
  hungerRestore: 4,
  saturation: 2.4,
});
// Extended food set from food_nutrition_table — every standard MC food.
itemRegistry.register({
  name: 'webmc:carrot',
  maxStack: 64,
  durability: 0,
  hungerRestore: 3,
  saturation: 3.6,
});
itemRegistry.register({
  name: 'webmc:golden_apple',
  maxStack: 64,
  durability: 0,
  hungerRestore: 4,
  saturation: 9.6,
});
itemRegistry.register({
  name: 'webmc:enchanted_golden_apple',
  maxStack: 64,
  durability: 0,
  hungerRestore: 4,
  saturation: 9.6,
});
itemRegistry.register({
  name: 'webmc:golden_carrot',
  maxStack: 64,
  durability: 0,
  hungerRestore: 6,
  saturation: 14.4,
});
itemRegistry.register({
  name: 'webmc:honey_bottle',
  maxStack: 16,
  durability: 0,
  hungerRestore: 6,
  saturation: 1.2,
});
itemRegistry.register({
  name: 'webmc:mushroom_stew',
  maxStack: 1,
  durability: 0,
  hungerRestore: 6,
  saturation: 7.2,
});
itemRegistry.register({
  name: 'webmc:rabbit_stew',
  maxStack: 1,
  durability: 0,
  hungerRestore: 10,
  saturation: 12,
});
itemRegistry.register({
  name: 'webmc:pumpkin_pie',
  maxStack: 64,
  durability: 0,
  hungerRestore: 8,
  saturation: 4.8,
});
itemRegistry.register({
  name: 'webmc:rotten_flesh',
  maxStack: 64,
  durability: 0,
  hungerRestore: 4,
  saturation: 0.8,
});
itemRegistry.register({
  name: 'webmc:potato',
  maxStack: 64,
  durability: 0,
  hungerRestore: 1,
  saturation: 0.6,
});
itemRegistry.register({
  name: 'webmc:baked_potato',
  maxStack: 64,
  durability: 0,
  hungerRestore: 5,
  saturation: 6,
});
itemRegistry.register({
  name: 'webmc:poisonous_potato',
  maxStack: 64,
  durability: 0,
  hungerRestore: 2,
  saturation: 1.2,
});
itemRegistry.register({
  name: 'webmc:spider_eye',
  maxStack: 64,
  durability: 0,
  hungerRestore: 2,
  saturation: 3.2,
});
itemRegistry.register({
  name: 'webmc:chorus_fruit',
  maxStack: 64,
  durability: 0,
  hungerRestore: 4,
  saturation: 2.4,
});
itemRegistry.register({
  name: 'webmc:beetroot_soup',
  maxStack: 1,
  durability: 0,
  hungerRestore: 6,
  saturation: 7.2,
});
itemRegistry.register({
  name: 'webmc:sweet_berries',
  maxStack: 64,
  durability: 0,
  hungerRestore: 2,
  saturation: 0.4,
});
itemRegistry.register({
  name: 'webmc:glow_berries',
  maxStack: 64,
  durability: 0,
  hungerRestore: 2,
  saturation: 0.4,
});
itemRegistry.register({
  name: 'webmc:cooked_mutton',
  maxStack: 64,
  durability: 0,
  hungerRestore: 6,
  saturation: 9.6,
});
itemRegistry.register({
  name: 'webmc:cooked_rabbit',
  maxStack: 64,
  durability: 0,
  hungerRestore: 5,
  saturation: 6,
});
itemRegistry.register({
  name: 'webmc:cooked_cod',
  maxStack: 64,
  durability: 0,
  hungerRestore: 5,
  saturation: 6,
});
itemRegistry.register({
  name: 'webmc:cooked_salmon',
  maxStack: 64,
  durability: 0,
  hungerRestore: 6,
  saturation: 9.6,
});
// 16 vanilla dyes — enables future dye-related recipes/crafting.
for (const dye of [
  'white_dye',
  'orange_dye',
  'magenta_dye',
  'light_blue_dye',
  'yellow_dye',
  'lime_dye',
  'pink_dye',
  'gray_dye',
  'light_gray_dye',
  'cyan_dye',
  'purple_dye',
  'blue_dye',
  'brown_dye',
  'green_dye',
  'red_dye',
  'black_dye',
]) {
  itemRegistry.register({ name: `webmc:${dye}`, maxStack: 64, durability: 0 });
}
// Common drops/materials.
itemRegistry.register({ name: 'webmc:slime_ball', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:ender_pearl', maxStack: 16, durability: 0 });
itemRegistry.register({ name: 'webmc:blaze_rod', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:blaze_powder', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:nether_star', maxStack: 1, durability: 0 });
itemRegistry.register({ name: 'webmc:emerald', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:lapis_lazuli', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:redstone', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:glow_ink_sac', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:ink_sac', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:bone_meal', maxStack: 64, durability: 0 });
// Common crafting ingredients required by default-recipes.
itemRegistry.register({ name: 'webmc:iron_nugget', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:gold_nugget', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:paper', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:book', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:sugar_cane', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:flint', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:nether_wart', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:ghast_tear', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:magma_cream', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:fermented_spider_eye', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:glistering_melon_slice', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:rabbit_foot', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:rabbit_hide', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:phantom_membrane', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:turtle_shell', maxStack: 1, durability: 275 });
itemRegistry.register({ name: 'webmc:glass_bottle', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:glowstone_dust', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:bow', maxStack: 1, durability: 384 });
itemRegistry.register({ name: 'webmc:crossbow', maxStack: 1, durability: 465 });
itemRegistry.register({ name: 'webmc:shield', maxStack: 1, durability: 336 });
itemRegistry.register({ name: 'webmc:fishing_rod', maxStack: 1, durability: 64 });
itemRegistry.register({ name: 'webmc:flint_and_steel', maxStack: 1, durability: 64 });
itemRegistry.register({ name: 'webmc:fire_charge', maxStack: 64, durability: 0 });
const SPAWN_EGG_MOBS = [
  'pig',
  'cow',
  'sheep',
  'chicken',
  'wolf',
  'fox',
  'cat',
  'rabbit',
  'goat',
  'horse',
  'parrot',
  'bee',
  'panda',
  'frog',
  'axolotl',
  'zombie',
  'skeleton',
  'creeper',
  'spider',
  'enderman',
  'pillager',
  'vindicator',
  'evoker',
  'piglin',
  'wither_skeleton',
  'blaze',
  'ghast',
  'shulker',
];
for (const mob of SPAWN_EGG_MOBS) {
  itemRegistry.register({ name: `webmc:${mob}_spawn_egg`, maxStack: 64, durability: 0 });
}
itemRegistry.register({ name: 'webmc:compass', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:clock', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:totem_of_undying', maxStack: 1, durability: 0 });
// Potions — drinkable in inventory, apply effect.
const POTION_TYPES: { name: string; effect: string; amplifier: number; durSec: number }[] = [
  { name: 'webmc:potion_healing', effect: 'instant_health', amplifier: 0, durSec: 0 },
  { name: 'webmc:potion_swiftness', effect: 'speed', amplifier: 0, durSec: 180 },
  { name: 'webmc:potion_strength', effect: 'strength', amplifier: 0, durSec: 180 },
  { name: 'webmc:potion_regeneration', effect: 'regeneration', amplifier: 0, durSec: 45 },
  { name: 'webmc:potion_fire_resistance', effect: 'fire_resistance', amplifier: 0, durSec: 180 },
  { name: 'webmc:potion_water_breathing', effect: 'water_breathing', amplifier: 0, durSec: 180 },
  { name: 'webmc:potion_night_vision', effect: 'night_vision', amplifier: 0, durSec: 180 },
  { name: 'webmc:potion_invisibility', effect: 'invisibility', amplifier: 0, durSec: 180 },
  { name: 'webmc:potion_leaping', effect: 'jump_boost', amplifier: 0, durSec: 180 },
  { name: 'webmc:potion_slow_falling', effect: 'slow_falling', amplifier: 0, durSec: 90 },
  { name: 'webmc:potion_poison', effect: 'poison', amplifier: 0, durSec: 45 },
  { name: 'webmc:potion_weakness', effect: 'weakness', amplifier: 0, durSec: 90 },
  { name: 'webmc:potion_harming', effect: 'instant_damage', amplifier: 0, durSec: 0 },
  { name: 'webmc:potion_slowness', effect: 'slowness', amplifier: 0, durSec: 90 },
];
for (const p of POTION_TYPES) {
  itemRegistry.register({ name: p.name, maxStack: 1, durability: 0 });
}
itemRegistry.register({ name: 'webmc:glass_bottle', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:water_bottle', maxStack: 1, durability: 0 });
itemRegistry.register({ name: 'webmc:awkward_potion', maxStack: 1, durability: 0 });
itemRegistry.register({ name: 'webmc:blaze_powder', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:nether_wart', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:fermented_spider_eye', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:gunpowder', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:dragon_breath', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:ghast_tear', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:magma_cream', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:rabbit_foot', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:turtle_helmet_scute', maxStack: 64, durability: 0 });
// Splash + lingering potion variants (drinkable as area-effect on use).
const SPLASH_POTIONS: { name: string; effect: string; amplifier: number; durSec: number }[] = [
  { name: 'webmc:splash_potion_healing', effect: 'instant_health', amplifier: 0, durSec: 0 },
  { name: 'webmc:splash_potion_harming', effect: 'instant_damage', amplifier: 0, durSec: 0 },
  { name: 'webmc:splash_potion_poison', effect: 'poison', amplifier: 0, durSec: 30 },
  { name: 'webmc:splash_potion_slowness', effect: 'slowness', amplifier: 0, durSec: 60 },
  { name: 'webmc:splash_potion_swiftness', effect: 'speed', amplifier: 0, durSec: 135 },
  { name: 'webmc:splash_potion_strength', effect: 'strength', amplifier: 0, durSec: 135 },
  { name: 'webmc:splash_potion_weakness', effect: 'weakness', amplifier: 0, durSec: 70 },
];
for (const p of SPLASH_POTIONS) {
  itemRegistry.register({ name: p.name, maxStack: 1, durability: 0 });
}
// MC 1.21+ items.
itemRegistry.register({ name: 'webmc:experience_bottle', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:saddle', maxStack: 1, durability: 0 });
itemRegistry.register({ name: 'webmc:name_tag', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:lead', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:rail', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:elytra', maxStack: 1, durability: 432 });
// Dyes — 16 colors.
const DYE_COLORS = [
  'white',
  'orange',
  'magenta',
  'light_blue',
  'yellow',
  'lime',
  'pink',
  'gray',
  'light_gray',
  'cyan',
  'purple',
  'blue',
  'brown',
  'green',
  'red',
  'black',
];
for (const c of DYE_COLORS)
  itemRegistry.register({ name: `webmc:${c}_dye`, maxStack: 64, durability: 0 });
// Maps + signs + utility items.
itemRegistry.register({ name: 'webmc:map', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:filled_map', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:writable_book', maxStack: 1, durability: 0 });
itemRegistry.register({ name: 'webmc:written_book', maxStack: 16, durability: 0 });
itemRegistry.register({ name: 'webmc:knowledge_book', maxStack: 1, durability: 0 });
itemRegistry.register({ name: 'webmc:enchanted_book', maxStack: 1, durability: 0 });
itemRegistry.register({ name: 'webmc:book', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:paper', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:scute', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:armadillo_scute', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:wolf_armor', maxStack: 1, durability: 64 });
const TEMPLATES = [
  'netherite_upgrade',
  'sentry_armor_trim',
  'vex_armor_trim',
  'wild_armor_trim',
  'coast_armor_trim',
  'dune_armor_trim',
  'wayfinder_armor_trim',
  'raiser_armor_trim',
  'shaper_armor_trim',
  'host_armor_trim',
  'ward_armor_trim',
  'silence_armor_trim',
  'tide_armor_trim',
  'snout_armor_trim',
  'rib_armor_trim',
  'eye_armor_trim',
  'spire_armor_trim',
  'flow_armor_trim',
  'bolt_armor_trim',
];
for (const t of TEMPLATES)
  itemRegistry.register({ name: `webmc:${t}_smithing_template`, maxStack: 64, durability: 0 });
// Crafted misc.
itemRegistry.register({ name: 'webmc:bowl', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:string', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:stick', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:bone', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:slime_ball', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:phantom_membrane', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:rabbit_hide', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:leather', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:feather', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:clay_ball', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:brick', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:popped_chorus_fruit', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:prismarine_shard', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:prismarine_crystals', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:heart_of_the_sea', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:nether_star', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:dragon_scale', maxStack: 64, durability: 0 });
// Boats / minecarts / signs.
const WOODS = [
  'oak',
  'spruce',
  'birch',
  'jungle',
  'acacia',
  'dark_oak',
  'mangrove',
  'cherry',
  'bamboo',
];
for (const w of WOODS) {
  itemRegistry.register({ name: `webmc:${w}_boat`, maxStack: 1, durability: 0 });
  itemRegistry.register({ name: `webmc:${w}_chest_boat`, maxStack: 1, durability: 0 });
  itemRegistry.register({ name: `webmc:${w}_sign`, maxStack: 16, durability: 0 });
  itemRegistry.register({ name: `webmc:${w}_hanging_sign`, maxStack: 16, durability: 0 });
}
itemRegistry.register({ name: 'webmc:minecart', maxStack: 1, durability: 0 });
itemRegistry.register({ name: 'webmc:chest_minecart', maxStack: 1, durability: 0 });
itemRegistry.register({ name: 'webmc:furnace_minecart', maxStack: 1, durability: 0 });
itemRegistry.register({ name: 'webmc:hopper_minecart', maxStack: 1, durability: 0 });
itemRegistry.register({ name: 'webmc:tnt_minecart', maxStack: 1, durability: 0 });
// Seeds + crops.
itemRegistry.register({ name: 'webmc:wheat_seeds', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:beetroot_seeds', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:melon_seeds', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:pumpkin_seeds', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:torchflower_seeds', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:pitcher_pod', maxStack: 64, durability: 0 });
itemRegistry.register({
  name: 'webmc:beetroot',
  maxStack: 64,
  durability: 0,
  hungerRestore: 1,
  saturation: 1.2,
});
itemRegistry.register({
  name: 'webmc:beetroot_soup',
  maxStack: 1,
  durability: 0,
  hungerRestore: 6,
  saturation: 7.2,
});
itemRegistry.register({
  name: 'webmc:melon_slice',
  maxStack: 64,
  durability: 0,
  hungerRestore: 2,
  saturation: 1.2,
});
itemRegistry.register({ name: 'webmc:glistering_melon_slice', maxStack: 64, durability: 0 });
itemRegistry.register({
  name: 'webmc:sweet_berries',
  maxStack: 64,
  durability: 0,
  hungerRestore: 2,
  saturation: 0.4,
});
itemRegistry.register({
  name: 'webmc:glow_berries',
  maxStack: 64,
  durability: 0,
  hungerRestore: 2,
  saturation: 0.4,
});
itemRegistry.register({
  name: 'webmc:dried_kelp',
  maxStack: 64,
  durability: 0,
  hungerRestore: 1,
  saturation: 0.6,
});
// Materials referenced by mob drops + recipes.
itemRegistry.register({ name: 'webmc:copper_ingot', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:netherite_ingot', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:netherite_scrap', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:gold_ingot', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:lapis_lazuli', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:diamond', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:amethyst_shard', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:wool', maxStack: 64, durability: 0 });
itemRegistry.register({
  name: 'webmc:salmon',
  maxStack: 64,
  durability: 0,
  hungerRestore: 2,
  saturation: 0.4,
});
itemRegistry.register({
  name: 'webmc:cod',
  maxStack: 64,
  durability: 0,
  hungerRestore: 2,
  saturation: 0.4,
});
itemRegistry.register({
  name: 'webmc:tropical_fish',
  maxStack: 64,
  durability: 0,
  hungerRestore: 1,
  saturation: 0.2,
});
itemRegistry.register({
  name: 'webmc:pufferfish',
  maxStack: 64,
  durability: 0,
  hungerRestore: 1,
  saturation: 0.2,
});
itemRegistry.register({
  name: 'webmc:cooked_cod',
  maxStack: 64,
  durability: 0,
  hungerRestore: 5,
  saturation: 6,
});
itemRegistry.register({
  name: 'webmc:cooked_salmon',
  maxStack: 64,
  durability: 0,
  hungerRestore: 6,
  saturation: 9.6,
});
itemRegistry.register({
  name: 'webmc:rabbit',
  maxStack: 64,
  durability: 0,
  hungerRestore: 3,
  saturation: 1.8,
});
itemRegistry.register({
  name: 'webmc:cooked_rabbit',
  maxStack: 64,
  durability: 0,
  hungerRestore: 5,
  saturation: 6,
});
itemRegistry.register({
  name: 'webmc:rabbit_stew',
  maxStack: 1,
  durability: 0,
  hungerRestore: 10,
  saturation: 12,
});
itemRegistry.register({
  name: 'webmc:beef',
  maxStack: 64,
  durability: 0,
  hungerRestore: 3,
  saturation: 1.8,
});
itemRegistry.register({
  name: 'webmc:porkchop',
  maxStack: 64,
  durability: 0,
  hungerRestore: 3,
  saturation: 1.8,
});
itemRegistry.register({
  name: 'webmc:mutton',
  maxStack: 64,
  durability: 0,
  hungerRestore: 2,
  saturation: 1.2,
});
itemRegistry.register({
  name: 'webmc:chicken',
  maxStack: 64,
  durability: 0,
  hungerRestore: 2,
  saturation: 1.2,
});
itemRegistry.register({ name: 'webmc:poppy', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:dandelion', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:blue_orchid', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:allium', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:azure_bluet', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:oxeye_daisy', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:cornflower', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:lily_of_the_valley', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:wither_rose', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:trident', maxStack: 1, durability: 250 });
itemRegistry.register({ name: 'webmc:music_disc_13', maxStack: 1, durability: 0 });
itemRegistry.register({ name: 'webmc:firework_rocket', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:firework_star', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:end_crystal', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:nautilus_shell', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:heart_of_the_sea', maxStack: 1, durability: 0 });
itemRegistry.register({ name: 'webmc:scute', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:armadillo_scute', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:wind_charge', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:breeze_rod', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:echo_shard', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:goat_horn', maxStack: 1, durability: 0 });
itemRegistry.register({ name: 'webmc:disc_fragment_5', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:trial_key', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:ominous_trial_key', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:wolf_armor', maxStack: 1, durability: 64 });
itemRegistry.register({ name: 'webmc:mace', maxStack: 1, durability: 500 });
// Armor pieces. ARMOR_DEFS is the source of truth (defense / toughness /
// durability), but every entry needs to be in itemRegistry too so /give,
// crafting recipes, the survival inventory equip-on-click, and droppers
// can refer to them by item id. Without this loop, leather_helmet etc.
// existed as armor metadata but `itemRegistry.byName('webmc:leather_helmet')`
// returned undefined — equipArmor command silently no-op'd, recipe outputs
// failed to register, mob death drops referencing helmets dropped nothing.
for (const armorDef of Object.values(ARMOR_DEFS)) {
  itemRegistry.register({ name: armorDef.name, maxStack: 1, durability: armorDef.durability });
}
// Spawn eggs for every mob kind. The right-click handler at the top of
// main.ts checks `heldName.endsWith('_spawn_egg')` and uses the prefix
// as the kind — but no spawn eggs were ever registered as items, so
// /give @s zombie_spawn_egg always failed and the egg path never fired.
for (const kind of Object.keys(MOB_DEFS) as (keyof typeof MOB_DEFS)[]) {
  itemRegistry.register({ name: `webmc:${kind}_spawn_egg`, maxStack: 64, durability: 0 });
}

const recipeRegistry = new RecipeRegistry();
const recipesRegistered = registerDefaultRecipes(itemRegistry, recipeRegistry);
if (import.meta.env.DEV) console.info(`[webmc] recipes: ${String(recipesRegistered)}`);

const dropRegistry = new BlockDropRegistry();
for (const [blockId, itemId] of blockToItem) {
  dropRegistry.register(blockId, [{ itemId, min: 1, max: 1 }]);
}
// Vanilla overrides for blocks that drop something other than themselves
// without silk touch. Without these, mining stone gave you stone-block
// item (which can't be smelted, can't be used as a building primitive in
// the same way) instead of cobblestone — broke the canonical wood→stone
// pickaxe progression. Same story for ore blocks dropping the raw item.
const DROP_OVERRIDES: Record<string, { drop: string; min?: number; max?: number }[]> = {
  'webmc:stone': [{ drop: 'webmc:cobblestone' }],
  'webmc:grass_block': [{ drop: 'webmc:dirt' }],
  'webmc:gravel': [{ drop: 'webmc:gravel' }],
  'webmc:coal_ore': [{ drop: 'webmc:coal' }],
  'webmc:deepslate_coal_ore': [{ drop: 'webmc:coal' }],
  'webmc:iron_ore': [{ drop: 'webmc:raw_iron' }],
  'webmc:deepslate_iron_ore': [{ drop: 'webmc:raw_iron' }],
  'webmc:gold_ore': [{ drop: 'webmc:raw_gold' }],
  'webmc:deepslate_gold_ore': [{ drop: 'webmc:raw_gold' }],
  'webmc:diamond_ore': [{ drop: 'webmc:diamond' }],
  'webmc:deepslate_diamond_ore': [{ drop: 'webmc:diamond' }],
  'webmc:emerald_ore': [{ drop: 'webmc:emerald' }],
  'webmc:deepslate_emerald_ore': [{ drop: 'webmc:emerald' }],
  'webmc:redstone_ore': [{ drop: 'webmc:redstone', min: 4, max: 5 }],
  'webmc:deepslate_redstone_ore': [{ drop: 'webmc:redstone', min: 4, max: 5 }],
  'webmc:lapis_ore': [{ drop: 'webmc:lapis_lazuli', min: 4, max: 9 }],
  'webmc:deepslate_lapis_ore': [{ drop: 'webmc:lapis_lazuli', min: 4, max: 9 }],
  'webmc:nether_quartz_ore': [{ drop: 'webmc:quartz' }],
  'webmc:nether_gold_ore': [{ drop: 'webmc:gold_nugget', min: 2, max: 6 }],
  'webmc:ancient_debris': [{ drop: 'webmc:ancient_debris' }],
  'webmc:copper_ore': [{ drop: 'webmc:raw_copper', min: 2, max: 3 }],
  'webmc:deepslate_copper_ore': [{ drop: 'webmc:raw_copper', min: 2, max: 3 }],
  'webmc:glowstone': [{ drop: 'webmc:glowstone_dust', min: 2, max: 4 }],
  'webmc:snow': [{ drop: 'webmc:snowball', min: 1, max: 1 }],
  'webmc:snow_block': [{ drop: 'webmc:snowball', min: 4, max: 4 }],
  'webmc:melon': [{ drop: 'webmc:melon_slice', min: 3, max: 7 }],
  'webmc:bookshelf': [{ drop: 'webmc:book', min: 3, max: 3 }],
};
// Blocks that drop nothing without silk touch (which we don't track yet,
// so they always drop nothing). Vanilla list — without these, breaking
// glass / ice / similar gave you the block-item back, which trivially
// converts mid-game ice/glass farming into infinite supply.
const DROP_NOTHING: readonly string[] = [
  'webmc:glass',
  'webmc:tinted_glass',
  'webmc:white_stained_glass',
  'webmc:orange_stained_glass',
  'webmc:magenta_stained_glass',
  'webmc:light_blue_stained_glass',
  'webmc:yellow_stained_glass',
  'webmc:lime_stained_glass',
  'webmc:pink_stained_glass',
  'webmc:gray_stained_glass',
  'webmc:light_gray_stained_glass',
  'webmc:cyan_stained_glass',
  'webmc:purple_stained_glass',
  'webmc:blue_stained_glass',
  'webmc:brown_stained_glass',
  'webmc:green_stained_glass',
  'webmc:red_stained_glass',
  'webmc:black_stained_glass',
  'webmc:glass_pane',
  'webmc:ice',
  'webmc:packed_ice',
  'webmc:blue_ice',
  'webmc:frosted_ice',
  'webmc:turtle_egg',
  'webmc:sea_lantern',
  'webmc:cake',
  'webmc:cobweb',
];
for (const [blockName, drops] of Object.entries(DROP_OVERRIDES)) {
  const blockId = registry.byName(blockName);
  if (blockId === undefined) continue;
  const resolved: { itemId: number; min: number; max: number }[] = [];
  for (const d of drops) {
    const dropItemId = itemRegistry.byName(d.drop);
    if (dropItemId === undefined) continue;
    resolved.push({ itemId: dropItemId, min: d.min ?? 1, max: d.max ?? 1 });
  }
  if (resolved.length > 0) dropRegistry.register(blockId, resolved);
}
for (const blockName of DROP_NOTHING) {
  const blockId = registry.byName(blockName);
  if (blockId === undefined) continue;
  dropRegistry.register(blockId, []);
}

const inventory = new Inventory(itemRegistry);
const playerState = new PlayerState({
  inventory,
  onDeath: () => {
    // Peaceful mode (or keepInventory=true) keeps inventory; snapshot+restore.
    // Armor + offhand were missing from the snapshot, so peaceful death wiped
    // them silently — players woke up unarmored even though their hotbar
    // came back. Now snapshots all four slot groups.
    // Creative + spectator are also "keepInventory" modes per vanilla:
    // /kill or void death in creative used to wipe a builder's hotbar.
    const keepOnDeath =
      mobDamageMultiplier === 0 ||
      gameRules.keepInventory ||
      gameMode === 'creative' ||
      gameMode === 'spectator';
    if (keepOnDeath) {
      const hot = inventory.hotbar.map((s) => (s ? { ...s } : null));
      const main = inventory.main.map((s) => (s ? { ...s } : null));
      const armor = inventory.armor.map((s) => (s ? { ...s } : null));
      const offhand = inventory.offhand ? { ...inventory.offhand } : null;
      queueMicrotask(() => {
        for (let i = 0; i < hot.length; i++) inventory.hotbar[i] = hot[i] ?? null;
        for (let i = 0; i < main.length; i++) inventory.main[i] = main[i] ?? null;
        for (let i = 0; i < armor.length; i++) inventory.armor[i] = armor[i] ?? null;
        inventory.offhand = offhand;
      });
      return;
    }
    const px = fp.position.x;
    const py = fp.position.y;
    const pz = fp.position.z;
    for (const slot of inventory.hotbar) {
      if (!slot) continue;
      const def = itemRegistry.get(slot.itemId);
      const colorRgb =
        def.blockId !== undefined ? registry.get(def.blockId).color : ([200, 200, 200] as const);
      droppedItems.spawn(
        px,
        py,
        pz,
        { itemId: slot.itemId, count: slot.count, color: colorRgb, damage: slot.damage },
        3,
      );
    }
    for (const slot of inventory.main) {
      if (!slot) continue;
      const def = itemRegistry.get(slot.itemId);
      const colorRgb =
        def.blockId !== undefined ? registry.get(def.blockId).color : ([200, 200, 200] as const);
      droppedItems.spawn(
        px,
        py,
        pz,
        { itemId: slot.itemId, count: slot.count, color: colorRgb, damage: slot.damage },
        3,
      );
    }
    // Armor and offhand were silently lost on death — drop them too.
    for (const slot of inventory.armor) {
      if (!slot) continue;
      const def = itemRegistry.get(slot.itemId);
      const colorRgb =
        def.blockId !== undefined ? registry.get(def.blockId).color : ([200, 200, 200] as const);
      droppedItems.spawn(
        px,
        py,
        pz,
        { itemId: slot.itemId, count: slot.count, color: colorRgb, damage: slot.damage },
        3,
      );
    }
    if (inventory.offhand) {
      const def = itemRegistry.get(inventory.offhand.itemId);
      const colorRgb =
        def.blockId !== undefined ? registry.get(def.blockId).color : ([200, 200, 200] as const);
      droppedItems.spawn(
        px,
        py,
        pz,
        {
          itemId: inventory.offhand.itemId,
          count: inventory.offhand.count,
          color: colorRgb,
          damage: inventory.offhand.damage,
        },
        3,
      );
    }
    // XP drops as orbs (vanilla: 7 per level capped at 100). PlayerState.respawn
    // will then reset xpLevel/xpProgress; we capture here pre-reset.
    const xpToDrop = Math.min(
      100,
      playerState.xpLevel * 7 + Math.floor(playerState.xpProgress * 7),
    );
    if (xpToDrop > 0) {
      // Spawn a few orbs spread out so they're easier to pick up.
      let remaining = xpToDrop;
      while (remaining > 0) {
        const chunkXp = Math.min(remaining, 7);
        xpOrbs.spawn(px, py, pz, chunkXp);
        remaining -= chunkXp;
      }
    }
  },
  onRespawn: () => {
    // Always reset velocity on respawn — same teleport-velocity-leak fix
    // pattern as /tp, /spawn, chorus, ender_pearl. Respawning into a bed
    // mid-fall would otherwise carry the death's downward velocity into
    // the new life and tank fall damage immediately.
    fp.velocity.set(0, 0, 0);
    if (playerSpawnPoint) {
      const safe = findSafeRespawnNear(playerSpawnPoint.x, playerSpawnPoint.y, playerSpawnPoint.z);
      if (safe) {
        fp.position.set(safe.x, safe.y, safe.z);
        return;
      }
      chatInput.addLine('Your home bed was missing or obstructed.', '#ffd080');
    }
    const ws = bedlessRespawn(
      { x: worldMeta.spawn.x, y: worldMeta.spawn.y, z: worldMeta.spawn.z },
      {
        topSolidY: (x, z) => {
          const y = generator.surfaceAt(x, z);
          return Number.isFinite(y) ? y : null;
        },
        blockAt: (x, y, z) => {
          const s = world.get(x, y, z);
          if (s === AIR) return 'webmc:air';
          return registry.get(stateId(s)).name;
        },
        isOpaque: (x, y, z) => {
          const s = world.get(x, y, z);
          if (s === AIR) return false;
          return registry.get(stateId(s)).opaque;
        },
      },
      Math.random,
      20,
    );
    fp.position.set(ws.x, ws.y + 1, ws.z);
  },
});

const lightCache = new Map<string, ChunkLight>();
const lightKey = (cx: number, cz: number): string => `${cx.toString()},${cz.toString()}`;
const lightOracle = {
  isOpaque,
  lightEmission: (s: BlockState) => (s === AIR ? 0 : registry.get(stateId(s)).lightEmission),
};

const fp = new FirstPersonCamera(camera);
function restoreStack(p: PersistedItemStack | null): ItemStack | null {
  if (!p) return null;
  const id = itemRegistry.byName(p.name);
  if (id === undefined) return null; // item no longer exists in registry
  return { itemId: id, count: Math.max(1, p.count), damage: Math.max(0, p.damage) };
}
function restoreInventory(snap: PersistedInventory): void {
  for (let i = 0; i < inventory.hotbar.length; i++) {
    inventory.hotbar[i] = i < snap.hotbar.length ? restoreStack(snap.hotbar[i] ?? null) : null;
  }
  for (let i = 0; i < inventory.main.length; i++) {
    inventory.main[i] = i < snap.main.length ? restoreStack(snap.main[i] ?? null) : null;
  }
  for (let i = 0; i < inventory.armor.length; i++) {
    inventory.armor[i] = i < snap.armor.length ? restoreStack(snap.armor[i] ?? null) : null;
  }
  inventory.offhand = restoreStack(snap.offhand);
  if (
    Number.isFinite(snap.selectedHotbar) &&
    snap.selectedHotbar >= 0 &&
    snap.selectedHotbar < inventory.hotbar.length
  ) {
    inventory.selectedHotbar = snap.selectedHotbar;
  }
}
function restoreVitals(v: PersistedVitals): void {
  if (Number.isFinite(v.health)) playerState.health = Math.max(0, Math.min(20, v.health));
  if (Number.isFinite(v.hunger)) playerState.hunger = Math.max(0, Math.min(20, v.hunger));
  if (Number.isFinite(v.saturation)) playerState.saturation = Math.max(0, v.saturation);
  if (Number.isFinite(v.breath)) playerState.breath = Math.max(0, v.breath);
  if (Number.isFinite(v.xpLevel)) playerState.xpLevel = Math.max(0, Math.trunc(v.xpLevel));
  if (Number.isFinite(v.xpProgress)) playerState.xpProgress = Math.max(0, v.xpProgress);
  if (Number.isFinite(v.exhaustion)) playerState.exhaustion = Math.max(0, v.exhaustion);
  if (Number.isFinite(v.absorption)) playerState.absorption = Math.max(0, v.absorption);
  if (Number.isFinite(v.fireRemainingSec))
    playerState.fireRemainingSec = Math.max(0, v.fireRemainingSec);
  playerState.effects.clear();
  if (Array.isArray(v.effects)) {
    for (const e of v.effects) {
      if (typeof e?.id === 'string' && e.remainingSec > 0) {
        playerState.effects.set(e.id, {
          amplifier: Math.max(0, Math.trunc(e.amplifier ?? 0)),
          remainingSec: e.remainingSec,
        });
      }
    }
  }
}
const savedPlayer = await persistDB.getPlayer(worldMeta.id);
if (savedPlayer) {
  fp.position.set(savedPlayer.position.x, savedPlayer.position.y, savedPlayer.position.z);
  fp.yaw = savedPlayer.yaw;
  fp.pitch = savedPlayer.pitch;
  if (savedPlayer.inventory) restoreInventory(savedPlayer.inventory);
  if (savedPlayer.vitals) restoreVitals(savedPlayer.vitals);
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
// Lazy-register fluid blocks (sea water from worldgen, loaded saves)
// as FluidWorld sources when the player opens up an adjacent cell. Cheap
// 6-neighbour scan; idempotent because FluidWorld uses a Map keyed by
// position so re-setting an existing cell just overwrites it.
const registerFluidNeighbors = (bx: number, by: number, bz: number): void => {
  const checkCell = (x: number, y: number, z: number): void => {
    if (y < 0 || y >= CHUNK_HEIGHT) return;
    const s = world.get(x, y, z);
    if (s === AIR) return;
    const id = stateId(s);
    if (id !== waterId && id !== lavaId) return;
    if (fluidWorld.get(x, y, z)) return;
    fluidWorld.setSource(x, y, z, id === waterId ? 'water' : 'lava');
  };
  checkCell(bx + 1, by, bz);
  checkCell(bx - 1, by, bz);
  checkCell(bx, by + 1, bz);
  checkCell(bx, by - 1, bz);
  checkCell(bx, by, bz + 1);
  checkCell(bx, by, bz - 1);
};
// FluidWorld.cells (the source/level/falling map) was never persisted —
// bucket-placed water survived chunk unload as a static block but lost
// its FluidWorld registration so it stopped flowing forever. Persist
// the cell list via setMeta + deferred deserialize after chunks load.
const pendingFluidCells: ReturnType<typeof fluidWorld.serialize> = [];
void persistDB.getMeta('fluidCells').then((saved) => {
  if (Array.isArray(saved)) pendingFluidCells.push(...(saved as typeof pendingFluidCells));
});
let fluidRestoreAccum = 0;
let fluidSaveAccum = 0;
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
const tamedMobs = new Map<number, TameableState>();
const TAMEABLE_KINDS: ReadonlySet<string> = new Set([
  'wolf',
  'cat',
  'parrot',
  'horse',
  'donkey',
  'mule',
  'llama',
]);
const lovingMobs = new Map<number, AnimalLove>();
const leashedMobs = new Set<number>();
const saddledMobs = new Set<number>();
const babyMobs = new Map<number, BabyState>();
let worldTick = 0;
const eatState: EatState = makeEatState();
let rightClickHeldForEat = false;

// Per-block-position chest storage. Old code shared one global 27-slot array
// across every chest in the world (the comment in ChestUI flagged this as
// "simplified ender chest" until per-block landed). Now: ender chests share
// one shared store across positions (vanilla behaviour); regular chests,
// trapped chests, barrels, and shulker boxes are keyed by (x,y,z).
const enderChestStorage: (ItemStack | null)[] = new Array(27).fill(null);
const chestStoragesByPos = new Map<string, (ItemStack | null)[]>();
function chestKey(x: number, y: number, z: number): string {
  return `${x},${y},${z}`;
}
function getChestStorage(blockName: string, x: number, y: number, z: number): (ItemStack | null)[] {
  if (blockName === 'webmc:ender_chest') return enderChestStorage;
  const k = chestKey(x, y, z);
  let s = chestStoragesByPos.get(k);
  if (!s) {
    s = new Array<ItemStack | null>(27).fill(null);
    chestStoragesByPos.set(k, s);
  }
  return s;
}
const BREED_FOOD: Record<string, readonly string[]> = {
  cow: ['webmc:wheat'],
  sheep: ['webmc:wheat'],
  pig: ['webmc:carrot', 'webmc:potato', 'webmc:beetroot'],
  chicken: [
    'webmc:wheat_seeds',
    'webmc:melon_seeds',
    'webmc:pumpkin_seeds',
    'webmc:beetroot_seeds',
  ],
  rabbit: ['webmc:carrot', 'webmc:dandelion'],
  wolf: [
    // Raw + cooked meats. The mob-drop tables emit raw_* (e.g. cow drops
    // raw_beef), so without the raw_* entries here, players couldn't
    // feed the meat they actually had to wolves.
    'webmc:raw_beef',
    'webmc:beef',
    'webmc:cooked_beef',
    'webmc:raw_porkchop',
    'webmc:porkchop',
    'webmc:cooked_porkchop',
    'webmc:raw_chicken',
    'webmc:chicken',
    'webmc:cooked_chicken',
    'webmc:raw_mutton',
    'webmc:mutton',
    'webmc:cooked_mutton',
    'webmc:raw_rabbit',
    'webmc:rabbit',
    'webmc:cooked_rabbit',
    'webmc:rotten_flesh',
  ],
  // 1.13+ renamed raw_fish→cod and raw_salmon→salmon — both legacy names
  // were never registered in this project. cod/salmon are.
  cat: ['webmc:cod', 'webmc:salmon'],
  fox: ['webmc:sweet_berries', 'webmc:glow_berries'],
  goat: ['webmc:wheat'],
  bee: ['webmc:dandelion', 'webmc:poppy'],
  panda: ['webmc:bamboo'],
  axolotl: ['webmc:tropical_fish_bucket'],
  frog: ['webmc:slime_ball'],
  turtle: ['webmc:seagrass'],
  hoglin: ['webmc:crimson_fungus'],
  strider: ['webmc:warped_fungus'],
  llama: ['webmc:hay_block'],
  horse: ['webmc:golden_apple', 'webmc:golden_carrot'],
  donkey: ['webmc:golden_apple', 'webmc:golden_carrot'],
  mule: ['webmc:golden_apple', 'webmc:golden_carrot'],
};
const droppedItems = new DroppedItemWorld();
const xpOrbs = new XpOrbWorld();
scene.add(mobRenderer.group);
scene.add(droppedItems.group);
scene.add(xpOrbs.group);
const spawnSystem = new SpawnSystem();

const dayNight = new DayNightCycle({ dayLengthSec: 600 });

const crosshair = new Crosshair(appEl);
const subtitles = new SubtitleView(appEl);
const bossBar = new BossBarView(appEl);
const scoreboard = new ScoreboardSidebarView(appEl);
const achievementToast = new AchievementToastView(appEl);
const loadingOverlay = new LoadingOverlay(appEl);
loadingOverlay.set('init', 0.5);
const activeEffectsHud = new ActiveEffectsHud(appEl);
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
function refreshHandVisibility(): void {
  // FP hand visible only in first-person AND not spectator. Spectators
  // have no body in vanilla, including no held-item / hand model.
  hand.group.visible = cameraMode === 'fp' && gameMode !== 'spectator';
}
function cycleCamera(): void {
  cameraMode = cameraMode === 'fp' ? 'tp_back' : cameraMode === 'tp_back' ? 'tp_front' : 'fp';
  refreshHandVisibility();
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
// (removed weatherTimer + autoWeatherEnabled — the inline 2nd weather
//  picker that raced with weatherCycle. F7 now toggles gameRules.doWeatherCycle.)
let minimapVisible = true;
let compassBarVisible = true;
let zoomHeld = false;
const SETTINGS_FOV_KEY = 'webmc:settings';
function readSavedFov(): number {
  try {
    const raw = localStorage.getItem(SETTINGS_FOV_KEY);
    if (!raw) return 70;
    const parsed = JSON.parse(raw) as { fov?: unknown };
    return typeof parsed.fov === 'number' ? parsed.fov : 70;
  } catch {
    return 70;
  }
}
window.addEventListener('keyup', (e) => {
  if (e.code === 'KeyC' && zoomHeld) {
    zoomHeld = false;
    fp.setBaseFov(readSavedFov());
  }
});
let mobDamageMultiplier = 1;
const gameRules = {
  keepInventory: false,
  doDaylightCycle: true,
  doMobSpawning: true,
  doImmediateRespawn: false,
  doWeatherCycle: true,
  naturalRegeneration: true,
  mobGriefing: true,
  fallDamage: true,
  fireDamage: true,
  drowningDamage: true,
  doTileDrops: true,
  showDeathMessages: true,
  doEntityDrops: true,
};
void persistDB.getMeta('gameRules').then((saved) => {
  if (saved && typeof saved === 'object') {
    const g = saved as Record<string, unknown>;
    for (const k of Object.keys(gameRules) as (keyof typeof gameRules)[]) {
      const v = g[k];
      if (typeof v === 'boolean') gameRules[k] = v;
    }
  }
});
let currentPlayerName = 'Player';
void persistDB.getMeta('difficulty').then((saved) => {
  if (saved === 'peaceful') mobDamageMultiplier = 0;
  else if (saved === 'easy') mobDamageMultiplier = 0.5;
  else if (saved === 'hard') mobDamageMultiplier = 1.5;
});
let sprintDustAccum = 0;
let prevOnGround = true;
let prevInWater = false;
let maceFallStartY = 0;
let isGliding = false;
let tickRateMultiplier = 1;
const regionPoints: {
  a: { x: number; y: number; z: number } | null;
  b: { x: number; y: number; z: number } | null;
} = { a: null, b: null };
interface LoadoutSnap {
  hotbar: (PersistedItemStack | null)[];
  main: (PersistedItemStack | null)[];
  armor: (PersistedItemStack | null)[];
}
const loadouts = new Map<string, LoadoutSnap>();
void persistDB.getMeta('loadouts').then((saved) => {
  if (saved && typeof saved === 'object') {
    for (const [name, raw] of Object.entries(saved as Record<string, unknown>)) {
      if (!raw || typeof raw !== 'object') continue;
      const r = raw as { hotbar?: unknown; main?: unknown; armor?: unknown };
      // Migrate legacy numeric-id snapshots: look up name from the registry.
      const migrate = (arr: unknown): (PersistedItemStack | null)[] => {
        if (!Array.isArray(arr)) return [];
        return arr.map((s) => {
          if (!s || typeof s !== 'object') return null;
          const o = s as { name?: unknown; itemId?: unknown; count?: unknown; damage?: unknown };
          if (typeof o.name === 'string' && typeof o.count === 'number') {
            return {
              name: o.name,
              count: o.count,
              damage: typeof o.damage === 'number' ? o.damage : 0,
            };
          }
          if (typeof o.itemId === 'number') {
            const def = itemRegistry.get(o.itemId);
            if (!def) return null;
            return {
              name: def.name,
              count: typeof o.count === 'number' ? o.count : 1,
              damage: typeof o.damage === 'number' ? o.damage : 0,
            };
          }
          return null;
        });
      };
      loadouts.set(name, {
        hotbar: migrate(r.hotbar),
        main: migrate(r.main),
        armor: migrate(r.armor),
      });
    }
  }
});
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
  {
    id: 'traveler',
    title: 'Traveler (500m walked)',
    check: () => playerStats.distanceWalked >= 500,
  },
  {
    id: 'explorer',
    title: 'Explorer (1 hour played)',
    check: () => playerStats.playtimeSec >= 3600,
  },
  { id: 'level_10', title: 'Level 10', check: () => playerState.xpLevel >= 10 },
  { id: 'survivor', title: 'Survivor (day 5)', check: () => dayCounter >= 5 },
  {
    id: 'marathon',
    title: 'Marathon (5km walked)',
    check: () => playerStats.distanceWalked >= 5000,
  },
  {
    id: 'architect',
    title: 'Architect (1000 blocks placed)',
    check: () => playerStats.blocksPlaced >= 1000,
  },
  { id: 'mountain', title: 'Above Sea Level (y > 100)', check: () => fp.position.y >= 100 },
  { id: 'caver', title: 'Spelunker (y < 30)', check: () => fp.position.y <= 30 },
  { id: 'hunter', title: 'Hunter (50 mobs killed)', check: () => playerStats.mobsKilled >= 50 },
  {
    id: 'demolisher',
    title: 'Demolisher (1000 blocks broken)',
    check: () => playerStats.blocksBroken >= 1000,
  },
  {
    id: 'iron_age',
    title: 'Iron Age',
    check: () => inventory.count(itemRegistry.byName('webmc:iron_ingot') ?? -1) >= 1,
  },
  {
    id: 'diamond_hunter',
    title: 'Diamond Hunter',
    check: () => inventory.count(itemRegistry.byName('webmc:diamond') ?? -1) >= 1,
  },
  { id: 'level_30', title: 'Level 30 (max enchant)', check: () => playerState.xpLevel >= 30 },
  { id: 'two_weeks', title: 'Two Weeks (day 14)', check: () => dayCounter >= 14 },
  { id: 'sky_walker', title: 'Sky Walker (y > 200)', check: () => fp.position.y >= 200 },
  { id: 'bedrock_diver', title: 'Bedrock Diver (y < 5)', check: () => fp.position.y <= 5 },
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
      achievementToast.push('advancement_task', a.title);
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
const weatherCycle = new WeatherCycle(Math.random, {
  clearMinSec: 600,
  clearMaxSec: 1500,
  rainMinSec: 120,
  rainMaxSec: 300,
  thunderMinSec: 30,
  thunderMaxSec: 90,
});
const fpsStats = makeFpsStats(120);
const tpsTracker = new TpsTracker(100);
const worldBorder = makeWorldBorder(60_000_000);
let lastMemoryWarnAt = 0;
const tutorial = new TutorialState();
const moodState = makeMoodState();
let underwaterAmbient: UnderwaterAmbientState = {
  submerged: false,
  ticksUntilNextLoop: 200,
  ticksUntilNextRare: 1000,
};
const autosaveState = makeSaveState();
const TUTORIAL_TEXT: Record<HintId, string> = {
  welcome: 'Welcome to webmc! Use WASD to move, mouse to look. Press E for inventory.',
  break_tree: 'Tip: Hold left-click on a tree to chop wood.',
  craft_planks: 'Tip: Open inventory (E) to craft planks from logs.',
  craft_sticks: 'Tip: Two planks → 4 sticks.',
  craft_crafting_table: 'Tip: Place a crafting table for 3×3 recipes.',
  make_pickaxe: 'Tip: 3 planks + 2 sticks = wooden pickaxe.',
  mine_stone: 'Tip: With a pickaxe, mine stone for cobblestone.',
  build_shelter: 'Tip: Build walls before night — zombies are coming!',
  fight_mobs: 'Tip: Sword damages mobs faster. Hold attack to charge.',
};
function fireTutorial(event: string): void {
  for (const id of tutorial.fire(event)) {
    const text = TUTORIAL_TEXT[id];
    if (text) chatInput.addLine(`📘 ${text}`, '#80c8ff');
  }
}
let lastInputTick = 0;
let currentTickCount = 0;

const afkBadge = (() => {
  const el = document.createElement('div');
  el.setAttribute('data-testid', 'afk-badge');
  el.textContent = 'AFK';
  el.style.cssText = [
    'position:fixed',
    'left:50%',
    'top:14px',
    'transform:translateX(-50%)',
    'padding:3px 14px',
    'background:rgba(60,40,20,0.85)',
    'color:#ffd080',
    'border:1px solid rgba(255,180,80,0.5)',
    'border-radius:3px',
    'font-family:sans-serif',
    'font-size:12px',
    'pointer-events:none',
    'z-index:530',
    'display:none',
  ].join(';');
  document.body.appendChild(el);
  return el;
})();

window.addEventListener(
  'mousemove',
  () => {
    lastInputTick = currentTickCount;
  },
  { passive: true },
);
window.addEventListener(
  'keydown',
  () => {
    lastInputTick = currentTickCount;
  },
  { passive: true },
);
window.addEventListener(
  'touchstart',
  () => {
    lastInputTick = currentTickCount;
  },
  { passive: true },
);
function setWeather(w: 'clear' | 'rain' | 'thunder'): void {
  currentWeather = w;
  if (w === 'clear') {
    rain.setActive(false);
  } else {
    const biomeId = generator.biomeAt(Math.floor(fp.position.x), Math.floor(fp.position.z));
    const biomeName = biomeId === 1 ? 'forest' : 'plains';
    const baseTemp = biomeTemperature(biomeName);
    // Altitude lowers temperature (MC: 0.00166 per block above Y=64).
    const adjTemp = adjustedTemperature(
      { baseTemperature: baseTemp, hasPrecipitation: true },
      fp.position.y,
    );
    const kind = kindForWeather({ raining: true, intensity: 1, biomeTemperature: adjTemp });
    if (kind === 'none') {
      rain.setActive(false);
    } else {
      rain.setKind(kind);
      rain.setActive(true);
    }
  }
  void persistDB.setMeta('weather', w);
}

function biomeTemperature(biome: string): number {
  if (biome.includes('desert') || biome.includes('savanna')) return 1.6;
  if (
    biome.includes('snow') ||
    biome.includes('frozen') ||
    biome.includes('ice') ||
    biome.includes('taiga')
  )
    return 0.05;
  if (biome.includes('jungle') || biome.includes('swamp')) return 0.95;
  return 0.7;
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
  audio.play3D(
    'break',
    fp.position.x + (Math.random() - 0.5) * 30,
    fp.position.y,
    fp.position.z + (Math.random() - 0.5) * 30,
  );
  chatInput.addLine('⚡ Lightning strikes nearby!', '#e0e0ff');
  screenShake.pulse(0.35);
}

const mesherClient = createMesherClient();
const audio = new AudioBus({ masterVolume: 0.35 });
audio.attachUnlock(document.body);

function findSafeRespawnNear(
  x: number,
  y: number,
  z: number,
): { x: number; y: number; z: number } | null {
  const candidates: {
    x: number;
    y: number;
    z: number;
    solidBelow: boolean;
    airAt: boolean;
    airAbove: boolean;
  }[] = [];
  const RADIUS = 3;
  for (let dy = 0; dy <= 1; dy++) {
    for (let dx = -RADIUS; dx <= RADIUS; dx++) {
      for (let dz = -RADIUS; dz <= RADIUS; dz++) {
        const cx = Math.floor(x) + dx;
        const cy = Math.floor(y) + dy;
        const cz = Math.floor(z) + dz;
        candidates.push({
          x: cx + 0.5,
          y: cy,
          z: cz + 0.5,
          solidBelow: isSolid(cx, cy - 1, cz),
          airAt: !isSolid(cx, cy, cz),
          airAbove: !isSolid(cx, cy + 1, cz),
        });
      }
    }
  }
  const safe = searchRespawnSpot(candidates);
  return safe ? { x: safe.x, y: safe.y, z: safe.z } : null;
}

function computeArmorPoints(): number {
  let pts = 0;
  for (const slot of inventory.armor) {
    if (!slot) continue;
    const def = itemRegistry.get(slot.itemId);
    const armorDef = ARMOR_DEFS[def.name.replace(/^webmc:/, '')];
    if (armorDef) pts += armorDef.defense;
  }
  return pts;
}

// Lowercased name of what the player is *actually* holding. Prefers the
// inventory hotbar slot (real items: pickaxes, foods, tools) and falls
// back to the canned Hotbar-UI entry (creative-mode block selector).
// Strips the webmc: prefix so the existing `.includes('diamond')` etc.
// checks keep working.
function heldNameLower(): string {
  const stack = inventory.hotbar[inventory.selectedHotbar];
  if (stack) {
    const def = itemRegistry.get(stack.itemId);
    if (def) return def.name.replace(/^webmc:/, '').toLowerCase();
  }
  return hotbar.selected?.name.toLowerCase() ?? '';
}

// Vanilla weapon-tier base damage. Touch attack handler reused a hard-coded
// `2` and ignored the held tool entirely, so an iron sword tap dealt the
// same damage as a bare-hand tap. Now both code paths read this table.
function weaponBaseDamageFor(heldName: string): number {
  if (heldName.includes('sword')) {
    if (heldName.includes('netherite')) return 8;
    if (heldName.includes('diamond')) return 7;
    if (heldName.includes('iron')) return 6;
    if (heldName.includes('stone')) return 5;
    return 4; // wood/gold
  }
  if (heldName.includes('pickaxe')) {
    if (heldName.includes('netherite')) return 6;
    if (heldName.includes('diamond')) return 5;
    if (heldName.includes('iron')) return 4;
    if (heldName.includes('stone')) return 3;
    return 2; // wood/gold
  }
  if (heldName.includes('shovel')) {
    if (heldName.includes('netherite')) return 7;
    if (heldName.includes('diamond')) return 6;
    if (heldName.includes('iron')) return 5;
    if (heldName.includes('stone')) return 4;
    return 3; // wood/gold
  }
  if (heldName.includes('axe')) {
    if (heldName.includes('netherite')) return 10;
    if (heldName.includes('iron') || heldName.includes('stone') || heldName.includes('diamond'))
      return 9;
    return 7;
  }
  if (heldName.includes('mace')) return 6;
  if (heldName.includes('trident')) return 9;
  return 1; // fist
}

// Resolves the BlockState the player is about to place from hotbar slot `i`.
// In survival/adventure this comes from the inventory hotbar slot (the item
// must have a blockId — swords/foods are non-placeable). In creative it
// comes from the canned UI Hotbar entry (the creative quick-pick selector).
// Returns null if the slot holds nothing placeable.
function placeableFromSlot(
  i: number,
): { state: BlockState; blockId: number; itemId: number | null } | null {
  if (gameMode === 'creative') {
    const entry = hotbar.getEntry(i);
    if (!entry) return null;
    return { state: entry.state, blockId: stateId(entry.state), itemId: null };
  }
  const stack = inventory.hotbar[i];
  if (!stack) return null;
  const itemDef = itemRegistry.get(stack.itemId);
  if (itemDef.blockId === undefined) return null;
  return { state: makeState(itemDef.blockId, 0), blockId: itemDef.blockId, itemId: stack.itemId };
}

// Mirror inventory.hotbar into the visible Hotbar UI in survival/adventure.
// Without this the player saw 9 hardcoded creative blocks (stone/dirt/...)
// regardless of what they actually had — meaning they could only ever place
// blocks that happened to be on the canned list. Now picking up sandstone
// puts sandstone in the visible hotbar and lets you place it. Skips no-op
// updates so we don't thrash the DOM each frame.
function syncVisibleHotbarFromInventory(): void {
  if (gameMode !== 'survival' && gameMode !== 'adventure') return;
  for (let i = 0; i < 9; i++) {
    const stack = inventory.hotbar[i];
    const cur = hotbar.getEntry(i);
    if (!stack) {
      if (cur && stateId(cur.state) === 0 && cur.name === '(empty)') continue;
      hotbar.setEntry(i, { state: AIR, name: '(empty)', color: [40, 44, 52] });
      continue;
    }
    const itemDef = itemRegistry.get(stack.itemId);
    if (itemDef.blockId !== undefined) {
      if (cur && stateId(cur.state) === itemDef.blockId) continue;
      const blockDef = registry.get(itemDef.blockId);
      hotbar.setEntry(i, {
        state: makeState(itemDef.blockId, 0),
        name: blockDef.name.replace(/^webmc:/, ''),
        color: blockDef.color,
      });
    } else {
      const itemShortName = itemDef.name.replace(/^webmc:/, '');
      if (cur && cur.name === itemShortName && stateId(cur.state) === 0) continue;
      hotbar.setEntry(i, { state: AIR, name: itemShortName, color: [120, 100, 80] });
    }
  }
}

// Apply hunger/saturation + item-specific side effects (potions, golden apple
// regen, rotten flesh hunger, chorus warp, ...) for one food item. Both the
// survival inventory UI and the right-click hold-to-eat path go through here
// so the effects stay consistent. Caller is responsible for consuming the
// item from inventory and starting/animating the eat — this just applies
// the gameplay payload.
function consumeFoodItem(id: number, hungerRestore: number, saturation: number): void {
  playerState.eat(hungerRestore, saturation);
  sfx.play('click');
  const itemName = itemRegistry.get(id).name;
  if (itemName.includes('potion_') || itemName === 'webmc:awkward_potion') {
    const ptype = POTION_TYPES.find((p) => p.name === itemName);
    if (ptype) {
      if (ptype.effect === 'instant_health') playerState.heal(4);
      else if (ptype.effect === 'instant_damage')
        playerState.takeDamage({ amount: 6, source: 'harming' });
      else playerState.applyEffect(ptype.effect, ptype.amplifier, ptype.durSec);
      const glassId = itemRegistry.byName('webmc:glass_bottle');
      if (glassId !== undefined) inventory.add({ itemId: glassId, count: 1, damage: 0 });
      subtitles.push(`Drank ${itemName.replace('webmc:potion_', '').replace(/_/g, ' ')}`);
    }
    return;
  }
  if (itemName === 'webmc:honey_bottle') {
    playerState.effects.delete('poison');
  } else if (itemName === 'webmc:milk_bucket') {
    // Vanilla MC: drinking milk clears all status effects (positive AND
    // negative). Replace the bucket with an empty bucket. Without this
    // wired, milk was inert — players had no way to cure poison/wither.
    playerState.effects.clear();
    const bucketId = itemRegistry.byName('webmc:bucket');
    if (bucketId !== undefined) inventory.add({ itemId: bucketId, count: 1, damage: 0 });
    subtitles.push('Drank milk');
  } else if (itemName === 'webmc:rotten_flesh' && Math.random() < 0.8) {
    playerState.applyEffect('hunger', 0, 30);
  } else if (itemName === 'webmc:poisonous_potato' && Math.random() < 0.6) {
    playerState.applyEffect('poison', 0, 5);
  } else if (itemName === 'webmc:spider_eye') {
    playerState.applyEffect('poison', 0, 4);
  } else if (itemName === 'webmc:golden_apple') {
    playerState.applyEffect('regeneration', 1, 5);
    playerState.applyEffect('absorption', 0, 120);
  } else if (itemName === 'webmc:enchanted_golden_apple') {
    playerState.applyEffect('regeneration', 1, 20);
    playerState.applyEffect('absorption', 3, 120);
    playerState.applyEffect('fire_resistance', 0, 300);
    playerState.applyEffect('resistance', 0, 300);
  } else if (itemName === 'webmc:chorus_fruit') {
    let placed = false;
    for (let attempt = 0; attempt < CHORUS_MAX_ATTEMPTS; attempt++) {
      const trial = pickTrial(fp.position, Math.random);
      const tx = Math.floor(trial.x);
      const ty = Math.floor(trial.y);
      const tz = Math.floor(trial.z);
      const here = world.get(tx, ty, tz);
      const above = world.get(tx, ty + 1, tz);
      const below = world.get(tx, ty - 1, tz);
      const isAirHere = here === AIR || !registry.get(stateId(here)).solid;
      const isAirAbove = above === AIR || !registry.get(stateId(above)).solid;
      const solidBelow = below !== AIR && registry.get(stateId(below)).solid;
      if (isAirHere && isAirAbove && solidBelow) {
        fp.position.set(tx + 0.5, ty, tz + 0.5);
        // Zero velocity on teleport so the player doesn't keep any
        // momentum / fall speed from before the warp. Without this,
        // chorus-fruiting mid-fall left you accelerating downward into
        // the new spot — vanilla resets motion.
        fp.velocity.set(0, 0, 0);
        subtitles.push('Chorus warp');
        placed = true;
        break;
      }
    }
    if (!placed) subtitles.push('Chorus fizzle');
  }
  const look = fp.lookVector();
  blockParticles.emitPlace(
    fp.position.x + look.x * 0.6,
    fp.position.y + look.y * 0.5,
    fp.position.z + look.z * 0.6,
    [180, 140, 80],
  );
}

function consumeHeldToolDurability(amount = 1): void {
  if (gameMode === 'creative') return;
  const sel = inventory.hotbar[inventory.selectedHotbar];
  if (!sel) return;
  const def = itemRegistry.get(sel.itemId);
  if (def.durability <= 0) return; // not a tool
  const newDamage = sel.damage + amount;
  if (newDamage >= def.durability) {
    inventory.hotbar[inventory.selectedHotbar] = null;
    chatInput.addLine(`${def.name.replace(/^webmc:/, '')} broke!`, '#ff8080');
  } else {
    inventory.hotbar[inventory.selectedHotbar] = { ...sel, damage: newDamage };
  }
}

function consumeArmorDurability(damageAmount: number): void {
  // Vanilla parity: creative armor doesn't degrade. Without this gate,
  // creative players accumulated durability damage on every hit and
  // their cosmetic armor could break / disappear.
  if (gameMode === 'creative') return;
  const cost = Math.max(1, Math.floor(damageAmount / 4));
  for (let i = 0; i < inventory.armor.length; i++) {
    const slot = inventory.armor[i];
    if (!slot) continue;
    const def = itemRegistry.get(slot.itemId);
    const armorDef = ARMOR_DEFS[def.name.replace(/^webmc:/, '')];
    if (!armorDef) continue;
    const newDamage = slot.damage + cost;
    if (newDamage >= armorDef.durability) {
      inventory.armor[i] = null;
      chatInput.addLine(`${def.name.replace(/^webmc:/, '')} broke!`, '#ff8080');
    } else {
      inventory.armor[i] = { ...slot, damage: newDamage };
    }
  }
}

function computeArmorToughness(): number {
  let t = 0;
  for (const slot of inventory.armor) {
    if (!slot) continue;
    const def = itemRegistry.get(slot.itemId);
    const armorDef = ARMOR_DEFS[def.name.replace(/^webmc:/, '')];
    if (armorDef) t += armorDef.toughness;
  }
  return t;
}

function directionFromPlayer(sourceX: number, sourceZ: number): 'left' | 'right' | 'center' {
  const dx = sourceX - fp.position.x;
  const dz = sourceZ - fp.position.z;
  if (dx * dx + dz * dz < 0.5) return 'center';
  const worldAngle = Math.atan2(dz, dx);
  // fp.yaw is the camera yaw; relative angle in [-π, π]
  let rel = worldAngle - fp.yaw;
  while (rel > Math.PI) rel -= 2 * Math.PI;
  while (rel < -Math.PI) rel += 2 * Math.PI;
  if (rel > 0.4) return 'right';
  if (rel < -0.4) return 'left';
  return 'center';
}

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
      subtitles.push(
        `Block broken: ${def.name.replace(/^webmc:/, '')}`,
        directionFromPlayer(bx + 0.5, bz + 0.5),
      );
      blockParticles.emitBreak(bx, by, bz, def.color);
      // Mining XP for ores (matches MC: coal 0-2, iron 0 via smelt, diamond 3-7, redstone 1-5, lapis 2-5, emerald 3-7).
      if (gameMode === 'survival' || gameMode === 'adventure') {
        const xp = oreXp(def.name);
        if (xp > 0) xpOrbs.spawn(bx + 0.5, by + 0.5, bz + 0.5, xp);
      }
      // Tool tier check: ores require correct mining level or no drops.
      const blockShortName = def.name.replace(/^webmc:/, '');
      const requiredLevel = requiredMiningLevel(blockShortName);
      let toolLevel = 1;
      const heldNameForTool = heldNameLower();
      if (heldNameForTool.includes('netherite')) toolLevel = 5;
      else if (heldNameForTool.includes('diamond')) toolLevel = 4;
      else if (heldNameForTool.includes('iron')) toolLevel = 3;
      else if (heldNameForTool.includes('stone')) toolLevel = 2;
      else if (heldNameForTool.includes('wood') || heldNameForTool.includes('gold')) toolLevel = 1;
      else toolLevel = 0; // bare hand
      const dropsAllowed = gameMode === 'creative' || toolLevel >= requiredLevel;
      // Crop drops: when a mature crop block is broken, drop the harvest items instead of the crop block.
      const CROP_DROP: Record<string, { id: string; min: number; max: number }[]> = {
        'webmc:wheat': [
          { id: 'webmc:wheat', min: 1, max: 1 },
          { id: 'webmc:wheat_seeds', min: 0, max: 3 },
        ],
        'webmc:carrots': [{ id: 'webmc:carrot', min: 1, max: 4 }],
        'webmc:potatoes': [{ id: 'webmc:potato', min: 1, max: 4 }],
        'webmc:beetroots': [
          { id: 'webmc:beetroot', min: 1, max: 1 },
          { id: 'webmc:beetroot_seeds', min: 1, max: 3 },
        ],
        'webmc:short_grass': [{ id: 'webmc:wheat_seeds', min: 0, max: 1 }],
        'webmc:tall_grass': [{ id: 'webmc:wheat_seeds', min: 0, max: 1 }],
        'webmc:sweet_berry_bush': [{ id: 'webmc:sweet_berries', min: 0, max: 2 }],
        'webmc:cocoa': [{ id: 'webmc:cocoa_beans', min: 1, max: 3 }],
        'webmc:melon': [{ id: 'webmc:melon_slice', min: 3, max: 7 }],
        'webmc:pumpkin': [{ id: 'webmc:pumpkin_seeds', min: 1, max: 4 }],
        'webmc:torchflower_crop': [{ id: 'webmc:torchflower_seeds', min: 1, max: 1 }],
        'webmc:pitcher_crop': [{ id: 'webmc:pitcher_pod', min: 1, max: 1 }],
        'webmc:bamboo': [{ id: 'webmc:bamboo', min: 1, max: 1 }],
        'webmc:sugar_cane': [{ id: 'webmc:sugar_cane', min: 1, max: 1 }],
      };
      // Leaf drops: 5% chance for sapling matching wood, 2% sticks, 0.5% apple (oak only).
      const LEAF_TO_SAPLING: Record<string, string> = {
        'webmc:oak_leaves': 'webmc:oak_sapling',
        'webmc:spruce_leaves': 'webmc:spruce_sapling',
        'webmc:birch_leaves': 'webmc:birch_sapling',
        'webmc:jungle_leaves': 'webmc:jungle_sapling',
        'webmc:acacia_leaves': 'webmc:acacia_sapling',
        'webmc:dark_oak_leaves': 'webmc:dark_oak_sapling',
        'webmc:cherry_leaves': 'webmc:cherry_sapling',
        'webmc:azalea_leaves': 'webmc:azalea',
      };
      let leafDrops: { itemId: number; count: number; damage: number }[] | null = null;
      const sapName = LEAF_TO_SAPLING[def.name];
      if (sapName !== undefined && dropsAllowed) {
        leafDrops = [];
        if (Math.random() < 0.05) {
          const sId = itemRegistry.byName(sapName);
          if (sId !== undefined) leafDrops.push({ itemId: sId, count: 1, damage: 0 });
        }
        if (Math.random() < 0.02) {
          const stickId = itemRegistry.byName('webmc:stick');
          if (stickId !== undefined) leafDrops.push({ itemId: stickId, count: 1, damage: 0 });
        }
        if (def.name === 'webmc:oak_leaves' && Math.random() < 0.005) {
          const aId = itemRegistry.byName('webmc:apple');
          if (aId !== undefined) leafDrops.push({ itemId: aId, count: 1, damage: 0 });
        }
      }
      const cropDrop = CROP_DROP[def.name];
      const drops =
        leafDrops !== null
          ? leafDrops
          : cropDrop && dropsAllowed
            ? cropDrop.flatMap((d) => {
                const id = itemRegistry.byName(d.id);
                if (id === undefined) return [];
                const c = d.min + Math.floor(Math.random() * (d.max - d.min + 1));
                return c > 0 ? [{ itemId: id, count: c, damage: 0 }] : [];
              })
            : gameRules.doTileDrops && dropsAllowed
              ? dropRegistry.drops(prevBlockId, undefined, 99)
              : [];
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
      // Chest-style block broken with stored items: dump the contents into
      // the world so the player can pick them up. Without this, breaking a
      // full chest silently destroyed every item inside — the storage
      // entry stayed in chestStoragesByPos but became unreachable because
      // there was no chest block left to right-click.
      const isChestBlock =
        def.name === 'webmc:chest' ||
        def.name === 'webmc:trapped_chest' ||
        def.name === 'webmc:barrel' ||
        def.name.endsWith('_shulker_box') ||
        def.name === 'webmc:shulker_box';
      if (isChestBlock) {
        const k = chestKey(bx, by, bz);
        const slots = chestStoragesByPos.get(k);
        if (slots) {
          for (const stk of slots) {
            if (!stk || stk.count <= 0) continue;
            const itemDef = itemRegistry.get(stk.itemId);
            const colorRgb =
              itemDef.blockId !== undefined
                ? registry.get(itemDef.blockId).color
                : ([200, 200, 200] as const);
            droppedItems.spawn(
              bx + 0.5,
              by + 0.5,
              bz + 0.5,
              { itemId: stk.itemId, count: stk.count, color: colorRgb, damage: stk.damage },
              2.5,
            );
          }
          chestStoragesByPos.delete(k);
          // Persist the now-empty storage state so the dropped items don't
          // resurrect on reload as ghost contents of an empty position.
          void saveAllChestStorages();
        }
      }
      touchWorldEdit(bx, by, bz, 0);
      // After breaking a block, any adjacent water/lava that wasn't yet
      // tracked by FluidWorld (e.g. sea water generated by worldgen, or
      // loaded from a chunk save) should now flow into the new opening.
      // Register the 6 neighbours as source cells so the next tick picks
      // them up.
      registerFluidNeighbors(bx, by, bz);
      hand.swing();
      playerStats.blocksBroken++;
      markSaveDirty(autosaveState);
      if (gameMode === 'survival' || gameMode === 'adventure') {
        playerState.addExhaustion(0.005);
        consumeHeldToolDurability(1);
      }
      if (def.name === 'webmc:oak_log') fireTutorial('collected_log');
      if (def.name === 'webmc:cobblestone' || def.name === 'webmc:cobble')
        fireTutorial('collected_cobblestone');
    },
    onPlace: (bx, by, bz) => {
      audio.play3D('place', bx + 0.5, by + 0.5, bz + 0.5);
      sfx.play('place');
      const placeable = placeableFromSlot(hotbar.selectedIndex);
      if (!placeable) return;
      const def = registry.get(placeable.blockId);
      subtitles.push(
        `Block placed: ${def.name.replace(/^webmc:/, '')}`,
        directionFromPlayer(bx + 0.5, bz + 0.5),
      );
      blockParticles.emitPlace(bx, by, bz, def.color);
      // Sponge soak: dry water in 5×5×5 area, convert to wet_sponge.
      if (def.name === 'webmc:sponge') {
        const waterId = registry.byName('webmc:water');
        const wetSpongeId = registry.byName('webmc:wet_sponge');
        if (waterId !== undefined && wetSpongeId !== undefined) {
          let absorbed = 0;
          for (let dy = -2; dy <= 2; dy++) {
            for (let dz = -2; dz <= 2; dz++) {
              for (let dx = -2; dx <= 2; dx++) {
                const s = world.get(bx + dx, by + dy, bz + dz);
                if (s !== AIR && stateId(s) === waterId) {
                  world.set(bx + dx, by + dy, bz + dz, AIR);
                  touchWorldEdit(bx + dx, by + dy, bz + dz, 0);
                  absorbed++;
                }
              }
            }
          }
          if (absorbed > 0) {
            world.set(bx, by, bz, makeState(wetSpongeId, 0));
            touchWorldEdit(bx, by, bz, wetSpongeId);
            subtitles.push(`Sponge absorbed ${absorbed} water`);
          }
        }
      }
      if ((gameMode === 'survival' || gameMode === 'adventure') && placeable.itemId !== null) {
        consumeInventoryItem(placeable.itemId, 1);
      }
      touchWorldEdit(bx, by, bz, placeable.blockId);
      hand.swing();
      playerStats.blocksPlaced++;
      markSaveDirty(autosaveState);
    },
    canPlace: () => {
      if (gameMode === 'spectator') return false;
      if (gameMode === 'creative') return true;
      const placeable = placeableFromSlot(hotbar.selectedIndex);
      if (placeable) return true;
      if (performance.now() - lastEmptyPlaceWarnAt > 800) {
        lastEmptyPlaceWarnAt = performance.now();
        const stk = inventory.hotbar[hotbar.selectedIndex];
        const msg = stk
          ? `${itemRegistry.get(stk.itemId).name.replace(/^webmc:/, '')} can't be placed`
          : 'Nothing in hand';
        chatInput.addLine(msg, '#ffb080');
      }
      return false;
    },
    isReplaceable: (bx, by, bz) => {
      const s = world.get(bx, by, bz);
      if (s === AIR) return true;
      const def = registry.get(stateId(s));
      // Vanilla MC replaceable blocks: fluids (water, lava), tall_grass,
      // short_grass, fern, dead_bush, fire, snow_layer (depth 0). Without
      // these, underwater building is impossible and you can't place a
      // block over tall grass / fire.
      const REPLACEABLE_NAMES = new Set([
        'webmc:water',
        'webmc:lava',
        'webmc:short_grass',
        'webmc:tall_grass',
        'webmc:fern',
        'webmc:large_fern',
        'webmc:dead_bush',
        'webmc:fire',
        'webmc:soul_fire',
        'webmc:snow',
        'webmc:vine',
      ]);
      return REPLACEABLE_NAMES.has(def.name);
    },
    canBreak: (bx, by, bz) => {
      // Spectator: ghost mode, no block edits at all (vanilla parity).
      if (gameMode === 'spectator') return false;
      // Bedrock and other indestructible blocks (hardness < 0) are
      // breakable in creative only — vanilla parity. Without this gate
      // bedrock could be punched through after the standard 0.4s timer
      // because nothing was checking hardness in tickBreak.
      if (gameMode === 'creative') return true;
      const s = world.get(bx, by, bz);
      if (s === AIR) return false;
      const def = registry.get(stateId(s));
      return def.hardness >= 0;
    },
    getBreakDurationSec: (bx, by, bz) => {
      // Vanilla MC formula: timeSec = 1.5 × hardness / toolSpeed when the
      // tool can harvest, 5 × hardness / toolSpeed otherwise. Tool speed
      // is 1 (hand), 2 (wood), 4 (stone), 6 (iron), 8 (diamond), 9
      // (netherite), 12 (gold). Without this, every block took the flat
      // 0.4s default — mining stone and dirt with bare hands felt
      // identical, and netherite blocks broke as fast as wool.
      if (gameMode === 'creative') return 0.001;
      const s = world.get(bx, by, bz);
      if (s === AIR) return 0.4;
      const def = registry.get(stateId(s));
      const hardness = Math.max(0, def.hardness);
      if (hardness === 0) return 0.05; // wool / leaves / flowers / instant blocks
      const heldName = heldNameLower();
      // Tool kind matching: pickaxe for stone/ore, axe for wood/log, shovel
      // for dirt/sand/gravel/snow, sword for cobwebs. Anything else is hand.
      const blockShortName = def.name.replace(/^webmc:/, '');
      const isStoneLike =
        blockShortName.includes('stone') ||
        blockShortName.includes('ore') ||
        blockShortName.includes('cobble') ||
        blockShortName.includes('brick') ||
        blockShortName.includes('basalt') ||
        blockShortName === 'obsidian' ||
        blockShortName === 'crying_obsidian' ||
        blockShortName === 'glowstone' ||
        blockShortName === 'iron_block' ||
        blockShortName === 'gold_block' ||
        blockShortName === 'diamond_block' ||
        blockShortName === 'netherite_block' ||
        blockShortName === 'lapis_block' ||
        blockShortName === 'redstone_block' ||
        blockShortName === 'emerald_block' ||
        blockShortName === 'coal_block' ||
        blockShortName === 'ancient_debris';
      const isWoodLike =
        blockShortName.endsWith('_log') ||
        blockShortName.endsWith('_planks') ||
        blockShortName.endsWith('_wood') ||
        blockShortName === 'oak_log' ||
        blockShortName === 'crafting_table' ||
        blockShortName.endsWith('_door') ||
        blockShortName.endsWith('_fence') ||
        blockShortName.endsWith('_trapdoor');
      const isDirtLike =
        blockShortName === 'dirt' ||
        blockShortName === 'grass_block' ||
        blockShortName === 'sand' ||
        blockShortName === 'gravel' ||
        blockShortName === 'snow' ||
        blockShortName === 'soul_sand' ||
        blockShortName === 'soul_soil' ||
        blockShortName === 'farmland' ||
        blockShortName === 'mycelium' ||
        blockShortName === 'podzol' ||
        blockShortName === 'clay';
      const correctTool =
        (isStoneLike && heldName.includes('pickaxe')) ||
        (isWoodLike && heldName.includes('axe') && !heldName.includes('pickaxe')) ||
        (isDirtLike && heldName.includes('shovel'));
      let toolSpeed = 1;
      if (heldName.includes('netherite')) toolSpeed = 9;
      else if (heldName.includes('diamond')) toolSpeed = 8;
      else if (heldName.includes('gold')) toolSpeed = 12;
      else if (heldName.includes('iron')) toolSpeed = 6;
      else if (heldName.includes('stone')) toolSpeed = 4;
      else if (heldName.includes('wood')) toolSpeed = 2;
      // Tool only contributes its speed when it's the correct kind.
      const speed = correctTool ? toolSpeed : 1;
      // Tool tier requirement: if the player can't harvest this block at
      // all (e.g. wood pickaxe on diamond), use the slow no-harvest formula.
      const requiredLevel = requiredMiningLevel(blockShortName);
      let toolLevel = 0;
      if (heldName.includes('netherite')) toolLevel = 5;
      else if (heldName.includes('diamond')) toolLevel = 4;
      else if (heldName.includes('iron')) toolLevel = 3;
      else if (heldName.includes('stone')) toolLevel = 2;
      else if (heldName.includes('wood') || heldName.includes('gold')) toolLevel = 1;
      const canHarvest = correctTool && toolLevel >= requiredLevel;
      const factor = canHarvest ? 1.5 : 5;
      let durationSec = (hardness * factor) / speed;
      // Vanilla mining-speed penalties:
      //   Underwater × 5 (no aqua affinity yet)
      //   Mid-air × 5 (not on ground)
      //   Haste / mining fatigue effects (not yet)
      // Without these the player could mine just as fast while swimming
      // or jumping straight up, then place blocks normally — easy iron
      // farming abuse.
      if (fp.inFluidEyes === 'water') durationSec *= 5;
      if (!fp.onGround) durationSec *= 5;
      const haste = playerState.effects.get('haste');
      if (haste) durationSec /= 1 + 0.2 * (haste.amplifier + 1);
      const fatigue = playerState.effects.get('mining_fatigue');
      if (fatigue) durationSec *= 1 + 0.3 * (fatigue.amplifier + 1) * 10;
      return durationSec;
    },
    onInteract: (bx, by, bz) => {
      // Spectator: no block interactions at all (vanilla parity).
      // Without this gate, spectators could toggle doors, light TNT,
      // strip logs, place water, ignite fires, set spawn at beds, etc. —
      // anything in the long onInteract chain below.
      if (gameMode === 'spectator') return false;
      const state = world.get(bx, by, bz);
      if (state === AIR) return false;
      const id = stateId(state);
      const def = registry.get(id);
      // Axe / Shovel / Hoe: tool-on-block interactions.
      const heldName = heldNameLower();
      const airAbove = world.get(bx, by + 1, bz) === AIR;
      if (heldName.includes('axe') && !heldName.includes('pickaxe')) {
        const result = useAxe(def.name);
        if (result.kind !== 'none') {
          const newId = registry.byName(result.newBlock);
          if (newId !== undefined) {
            world.set(bx, by, bz, makeState(newId, 0));
            touchWorldEdit(bx, by, bz, newId);
            consumeHeldToolDurability(1);
            sfx.play('break');
            // Hand swing for tool-on-block interactions (strip / unwax /
            // scrape / make path / till). Vanilla MC swings the hand on
            // every right-click that consumes durability; without it,
            // axe-stripping a log gave no animation feedback.
            hand.swing();
            blockParticles.emitBreak(bx, by, bz, registry.get(newId).color);
            const verb =
              result.kind === 'strip'
                ? 'Stripped'
                : result.kind === 'unwax'
                  ? 'Un-waxed'
                  : 'Scraped';
            subtitles.push(verb);
            return true;
          }
        }
      }
      if (heldName.includes('shovel') && airAbove) {
        const result = useShovel({ targetBlockName: def.name, airAbove: true, campfireLit: false });
        if (result.kind === 'place_path') {
          const newId = registry.byName(result.newBlock);
          if (newId !== undefined) {
            world.set(bx, by, bz, makeState(newId, 0));
            touchWorldEdit(bx, by, bz, newId);
            consumeHeldToolDurability(1);
            sfx.play('break');
            hand.swing();
            blockParticles.emitBreak(bx, by, bz, registry.get(newId).color);
            subtitles.push('Made path');
            return true;
          }
        }
      }
      if (heldName.includes('hoe') && airAbove) {
        const result = useHoe({ targetBlockName: def.name, airAbove: true });
        if (result.tilled) {
          const newName = result.tilled === 'farmland' ? 'webmc:farmland' : 'webmc:dirt';
          const newId = registry.byName(newName);
          if (newId !== undefined) {
            world.set(bx, by, bz, makeState(newId, 0));
            touchWorldEdit(bx, by, bz, newId);
            consumeHeldToolDurability(result.durabilityCost);
            sfx.play('break');
            hand.swing();
            blockParticles.emitBreak(bx, by, bz, registry.get(newId).color);
            subtitles.push(result.tilled === 'farmland' ? 'Tilled farmland' : 'Loosened soil');
            return true;
          }
        }
      }
      // End crystal: place hovering crystal that explodes on hit (visual only — no projectile path).
      if (heldName === 'end_crystal' && def.name === 'webmc:obsidian' && airAbove) {
        const cx = bx + 0.5,
          cy = by + 1,
          cz = bz + 0.5;
        // Hovering visual: pillar of magenta particles, then a "primed" subtitle.
        for (let h = 0; h < 12; h++) {
          for (let i = 0; i < 4; i++)
            blockParticles.emitPlace(
              cx + (Math.random() - 0.5) * 0.8,
              cy + h * 0.2,
              cz + (Math.random() - 0.5) * 0.8,
              [220, 100, 220],
            );
        }
        if (gameMode === 'survival' || gameMode === 'adventure') {
          const eId = itemRegistry.byName('webmc:end_crystal');
          if (eId !== undefined) consumeInventoryItem(eId, 1);
        }
        sfx.play('click');
        hand.swing();
        subtitles.push('End crystal placed');
        return true;
      }
      // Echo shard: ping subtitles + radial blue particles (warden / sculk audio cue).
      if (heldName === 'echo_shard') {
        const cx = bx + 0.5,
          cy = by + 1,
          cz = bz + 0.5;
        for (let i = 0; i < 32; i++) {
          const ang = Math.random() * Math.PI * 2;
          const r = 1 + Math.random() * 5;
          blockParticles.emitPlace(
            cx + Math.cos(ang) * r,
            cy + (Math.random() - 0.5) * 2,
            cz + Math.sin(ang) * r,
            [80, 200, 220],
          );
        }
        sfx.play('break');
        subtitles.push('Echo ping…');
        return true;
      }
      // Bottle o' enchanting: spawn 3-11 XP orbs at hit point.
      if (heldName === 'experience_bottle') {
        const cx = bx + 0.5,
          cy = by + 1,
          cz = bz + 0.5;
        const total = 3 + Math.floor(Math.random() * 9);
        let remaining = total;
        while (remaining > 0) {
          const chunk = Math.min(remaining, 1 + Math.floor(Math.random() * 5));
          xpOrbs.spawn(
            cx + (Math.random() - 0.5) * 1.5,
            cy + Math.random(),
            cz + (Math.random() - 0.5) * 1.5,
            chunk,
          );
          remaining -= chunk;
        }
        for (let i = 0; i < 16; i++)
          blockParticles.emitPlace(
            cx + (Math.random() - 0.5),
            cy + Math.random(),
            cz + (Math.random() - 0.5),
            [220, 230, 80],
          );
        if (gameMode === 'survival' || gameMode === 'adventure') {
          const xbId = itemRegistry.byName('webmc:experience_bottle');
          if (xbId !== undefined) consumeInventoryItem(xbId, 1);
        }
        sfx.play('click');
        hand.swing();
        subtitles.push(`Bottle o' enchanting (+${total} XP)`);
        return true;
      }
      // Fishing rod: cast at water; on water-block target, roll a fish drop after 5-30s wait.
      if (heldName === 'fishing_rod' && def.name === 'webmc:water') {
        consumeHeldToolDurability(1);
        for (let i = 0; i < 12; i++)
          blockParticles.emitPlace(
            bx + 0.5 + (Math.random() - 0.5),
            by + 1,
            bz + 0.5 + (Math.random() - 0.5),
            [200, 220, 240],
          );
        sfx.play('click');
        // Cast was silent on the arm — every other right-click consume in
        // this file swings the hand; fishing-rod was the holdout.
        hand.swing();
        subtitles.push('Cast line');
        // Schedule a fish drop in 5-30s.
        const waitMs = 5000 + Math.random() * 25000;
        setTimeout(() => {
          if (gameMode !== 'survival' && gameMode !== 'adventure') return;
          // Vanilla 1.13+ fishing pool: cod, salmon, pufferfish, tropical_fish.
          // 'webmc:raw_fish' was a 1.12 legacy name that was never registered
          // here, so 25% of fishing rolls dropped nothing silently.
          const FISH = ['webmc:cod', 'webmc:salmon', 'webmc:pufferfish', 'webmc:tropical_fish'];
          const treasure = [
            'webmc:bow',
            'webmc:enchanted_book',
            'webmc:fishing_rod',
            'webmc:nautilus_shell',
          ];
          const useTreasure = Math.random() < 0.05;
          const pool = (useTreasure ? treasure : FISH).filter(
            (n) => itemRegistry.byName(n) !== undefined,
          );
          if (pool.length === 0) return;
          const pickName = pool[Math.floor(Math.random() * pool.length)] ?? 'webmc:cod';
          const itemId = itemRegistry.byName(pickName);
          if (itemId !== undefined) {
            inventory.add({ itemId, count: 1, damage: 0 });
            const def2 = itemRegistry.get(itemId);
            chatInput.addLine(`Caught ${def2.name.replace(/^webmc:/, '')}`, '#a0e0ff');
            sfx.play('click');
            playerState.addXP(1 + Math.floor(Math.random() * 6));
          }
        }, waitMs);
        return true;
      }
      // Goat horn: blow a long droning note + ripple particles.
      if (heldName === 'goat_horn') {
        sfx.play('break');
        for (let i = 0; i < 30; i++) {
          const ang = Math.random() * Math.PI * 2;
          const r = 1 + Math.random() * 6;
          blockParticles.emitPlace(
            fp.position.x + Math.cos(ang) * r,
            fp.position.y + 0.5 + (Math.random() - 0.5) * 1.2,
            fp.position.z + Math.sin(ang) * r,
            [220, 200, 130],
          );
        }
        subtitles.push('Goat horn sounds');
        return true;
      }
      // Music disc on jukebox block: emit notes + subtitle.
      if (heldName.startsWith('music_disc_') && def.name === 'webmc:jukebox') {
        sfx.play('break');
        const NOTES = ['♩', '♪', '♫', '♬'];
        for (let i = 0; i < 36; i++) {
          const ang = Math.random() * Math.PI * 2;
          const r = 0.5 + Math.random() * 4;
          blockParticles.emitPlace(
            bx + 0.5 + Math.cos(ang) * r,
            by + 0.5 + Math.random() * 3,
            bz + 0.5 + Math.sin(ang) * r,
            [180, 80, 220],
          );
        }
        const note = NOTES[Math.floor(Math.random() * NOTES.length)] ?? '♪';
        chatInput.addLine(
          `${note} Now playing: ${heldName.replace('music_disc_', 'C418 - ')}`,
          '#d0a0ff',
        );
        if (gameMode === 'survival' || gameMode === 'adventure') {
          const dId = itemRegistry.byName(`webmc:${heldName}`);
          if (dId !== undefined) consumeInventoryItem(dId, 1);
        }
        return true;
      }
      // Music disc: short particle play; placed-on-jukebox not yet wired.
      if (heldName.startsWith('music_disc_')) {
        sfx.play('click');
        for (let i = 0; i < 18; i++)
          blockParticles.emitPlace(
            bx + 0.5 + (Math.random() - 0.5),
            by + 1 + Math.random(),
            bz + 0.5 + (Math.random() - 0.5),
            [180, 120, 220],
          );
        subtitles.push(`Now playing: ${heldName.replace('music_disc_', '')}`);
        return true;
      }
      // Wind charge: right-click block → AOE knockback in 3-block radius (MC 1.21+ Breeze drop).
      if (heldName === 'wind_charge') {
        const cx = bx + 0.5,
          cy = by + 1,
          cz = bz + 0.5;
        for (let i = 0; i < 24; i++)
          blockParticles.emitPlace(
            cx + (Math.random() - 0.5) * 3,
            cy + Math.random() * 2,
            cz + (Math.random() - 0.5) * 3,
            [200, 220, 255],
          );
        for (const m of mobWorld.all()) {
          const dx = m.position.x - cx;
          const dy = m.position.y - cy;
          const dz = m.position.z - cz;
          const d2 = dx * dx + dy * dy + dz * dz;
          if (d2 > 9) continue;
          const len = Math.max(0.001, Math.sqrt(d2));
          m.velocity.x += (dx / len) * 8;
          m.velocity.y += 5;
          m.velocity.z += (dz / len) * 8;
        }
        // Player gets pushed away too.
        const pdx = fp.position.x - cx;
        const pdz = fp.position.z - cz;
        const pd2 = pdx * pdx + pdz * pdz;
        if (pd2 < 9) {
          const len = Math.max(0.001, Math.sqrt(pd2));
          fp.velocity.x += (pdx / len) * 6;
          fp.velocity.y += 4;
          fp.velocity.z += (pdz / len) * 6;
        }
        if (gameMode === 'survival' || gameMode === 'adventure') {
          const wcId = itemRegistry.byName('webmc:wind_charge');
          if (wcId !== undefined) consumeInventoryItem(wcId, 1);
        }
        sfx.play('break');
        hand.swing();
        subtitles.push('Wind charge!');
        return true;
      }
      // Trident with Riptide (active when player is in water OR rain): propel forward.
      if (
        heldName === 'trident' &&
        (fp.inFluid === 'water' || currentWeather === 'rain' || currentWeather === 'thunder')
      ) {
        const look = fp.lookVector();
        const power = 18;
        fp.velocity.x += look.x * power;
        fp.velocity.y += look.y * power;
        fp.velocity.z += look.z * power;
        consumeHeldToolDurability(1);
        for (let i = 0; i < 24; i++)
          blockParticles.emitPlace(
            fp.position.x + (Math.random() - 0.5),
            fp.position.y + Math.random() * 2,
            fp.position.z + (Math.random() - 0.5),
            [180, 220, 255],
          );
        sfx.play('break');
        hand.swing();
        subtitles.push('Riptide!');
        return true;
      }
      if (heldName === 'bow' || heldName === 'crossbow') {
        return fireBowOrCrossbow();
      }
      // Snowball / egg: small visual hit at target, no projectile arc.
      if (heldName === 'snowball' || heldName === 'egg') {
        const cx = bx + 0.5,
          cy = by + 1,
          cz = bz + 0.5;
        const burstColor: [number, number, number] =
          heldName === 'snowball' ? [240, 250, 255] : [240, 220, 180];
        for (let i = 0; i < 16; i++)
          blockParticles.emitPlace(
            cx + (Math.random() - 0.5) * 1.5,
            cy + Math.random(),
            cz + (Math.random() - 0.5) * 1.5,
            burstColor,
          );
        // Knockback nearest mob within 2 blocks of impact (~1 dmg if egg, snowballs do 0 to most mobs but knock blaze/dragon).
        for (const m of mobWorld.all()) {
          const dx = m.position.x - cx;
          const dy = m.position.y - cy;
          const dz = m.position.z - cz;
          if (dx * dx + dy * dy + dz * dz > 4) continue;
          if (
            heldName === 'snowball' &&
            (m.def.kind === 'blaze' || m.def.kind === 'ender_dragon')
          ) {
            mobWorld.damage(m.id, 3);
          } else {
            // Just knockback.
            const len = Math.max(0.001, Math.hypot(dx, dz));
            m.velocity.x += (dx / len) * 4;
            m.velocity.z += (dz / len) * 4;
            m.velocity.y += 2;
          }
        }
        // Egg: 12.5% chance to hatch a chicken at impact.
        if (heldName === 'egg' && Math.random() < 0.125) {
          try {
            mobWorld.spawn('chicken', { x: cx, y: cy, z: cz });
          } catch {
            /* ignore */
          }
          subtitles.push('Egg hatched!');
        }
        if (gameMode === 'survival' || gameMode === 'adventure') {
          const itemId = itemRegistry.byName(`webmc:${heldName}`);
          if (itemId !== undefined) consumeInventoryItem(itemId, 1);
        }
        sfx.play('click');
        // Hand swing for projectile-style throws (snowball / egg). Vanilla
        // animates the throw arm; was missing here so throws looked like
        // teleporting particles with no avatar feedback.
        hand.swing();
        return true;
      }
      // Firework rocket while gliding → forward thrust boost.
      if (heldName === 'firework_rocket' && isGliding) {
        const look = fp.lookVector();
        const power = 18;
        fp.velocity.x += look.x * power;
        fp.velocity.y += look.y * power * 0.6;
        fp.velocity.z += look.z * power;
        if (gameMode === 'survival' || gameMode === 'adventure') {
          const fwId = itemRegistry.byName('webmc:firework_rocket');
          if (fwId !== undefined) consumeInventoryItem(fwId, 1);
        }
        for (let i = 0; i < 18; i++)
          blockParticles.emitPlace(
            fp.position.x + (Math.random() - 0.5),
            fp.position.y - 0.5 + Math.random() * 0.5,
            fp.position.z + (Math.random() - 0.5),
            [255, 200, 100],
          );
        sfx.play('break');
        hand.swing();
        subtitles.push('Firework boost!');
        return true;
      }
      // Firework rocket: launch upward with a colored particle burst.
      if (heldName === 'firework_rocket') {
        const px = bx + 0.5;
        const pz = bz + 0.5;
        for (let h = 0; h < 8; h++) {
          for (let i = 0; i < 3; i++)
            blockParticles.emitPlace(
              px + (Math.random() - 0.5) * 0.5,
              by + h,
              pz + (Math.random() - 0.5) * 0.5,
              [255, 220, 80],
            );
        }
        const COLORS: [number, number, number][] = [
          [255, 80, 80],
          [80, 255, 80],
          [80, 80, 255],
          [255, 255, 80],
          [255, 80, 255],
          [80, 255, 255],
        ];
        const color = COLORS[Math.floor(Math.random() * COLORS.length)] ?? [255, 220, 80];
        const burstY = by + 8;
        for (let i = 0; i < 60; i++) {
          const ang = Math.random() * Math.PI * 2;
          const r = 1 + Math.random() * 4;
          blockParticles.emitPlace(
            px + Math.cos(ang) * r,
            burstY + (Math.random() - 0.5) * 4,
            pz + Math.sin(ang) * r,
            color,
          );
        }
        if (gameMode === 'survival' || gameMode === 'adventure') {
          const fwId = itemRegistry.byName('webmc:firework_rocket');
          if (fwId !== undefined) consumeInventoryItem(fwId, 1);
        }
        sfx.play('break');
        hand.swing();
        subtitles.push('Firework!');
        return true;
      }
      // Splash potion: hit target with effect AOE.
      if (heldName.startsWith('splash_potion_')) {
        const ptype = SPLASH_POTIONS.find((p) => p.name === `webmc:${heldName}`);
        if (ptype) {
          const cx = bx + 0.5,
            cy = by + 0.5,
            cz = bz + 0.5;
          let affected = 0;
          for (const m of mobWorld.all()) {
            const dx = m.position.x - cx;
            const dy = m.position.y - cy;
            const dz = m.position.z - cz;
            if (dx * dx + dy * dy + dz * dz > 16) continue;
            if (ptype.effect === 'instant_damage') mobWorld.damage(m.id, 6);
            else if (ptype.effect === 'instant_health') mobWorld.damage(m.id, -4);
            // Persistent effects on mobs not modeled; visual only.
            affected++;
          }
          // Also affect player if in radius.
          const pdx = fp.position.x - cx;
          const pdy = fp.position.y - cy;
          const pdz = fp.position.z - cz;
          if (pdx * pdx + pdy * pdy + pdz * pdz <= 16) {
            if (ptype.effect === 'instant_health') playerState.heal(4);
            else if (ptype.effect === 'instant_damage')
              playerState.takeDamage({ amount: 6, source: 'harming' });
            else
              playerState.applyEffect(
                ptype.effect,
                ptype.amplifier,
                Math.floor(ptype.durSec * 0.75),
              );
          }
          for (let i = 0; i < 24; i++)
            blockParticles.emitPlace(
              cx + (Math.random() - 0.5) * 4,
              cy + Math.random() * 2,
              cz + (Math.random() - 0.5) * 4,
              [180, 100, 220],
            );
          if (gameMode === 'survival' || gameMode === 'adventure') {
            const sId = itemRegistry.byName(`webmc:${heldName}`);
            if (sId !== undefined) consumeInventoryItem(sId, 1);
          }
          subtitles.push(`Splash potion (${affected})`);
          sfx.play('break');
          hand.swing();
          return true;
        }
      }
      // Spawn egg: spawn matching mob above target block.
      if (heldName.endsWith('_spawn_egg') && airAbove) {
        const mobKind = heldName.replace(/_spawn_egg$/, '');
        try {
          mobWorld.spawn(mobKind as Parameters<typeof mobWorld.spawn>[0], {
            x: bx + 0.5,
            y: by + 1,
            z: bz + 0.5,
          });
          if (gameMode === 'survival' || gameMode === 'adventure') {
            const eggId = itemRegistry.byName(`webmc:${heldName}`);
            if (eggId !== undefined) consumeInventoryItem(eggId, 1);
          }
          subtitles.push(`Spawned ${mobKind}`);
          sfx.play('click');
          hand.swing();
          return true;
        } catch {
          /* unknown mob kind */
        }
      }
      // Ender pearl: teleport to hit block surface, take 5 damage.
      if (heldName === 'ender_pearl') {
        if (airAbove) {
          fp.position.set(bx + 0.5, by + 1, bz + 0.5);
          // Vanilla zeros velocity on pearl teleport — without this the
          // player kept their pre-throw fall speed and started instantly
          // taking fall damage at the destination.
          fp.velocity.set(0, 0, 0);
          if (gameMode === 'survival' || gameMode === 'adventure') {
            playerState.takeDamage({ amount: 5, source: 'pearl' });
            const pearlId = itemRegistry.byName('webmc:ender_pearl');
            if (pearlId !== undefined) consumeInventoryItem(pearlId, 1);
          }
          for (let i = 0; i < 16; i++)
            blockParticles.emitPlace(
              bx + (Math.random() - 0.5),
              by + 1 + Math.random() * 2,
              bz + (Math.random() - 0.5),
              [60, 200, 180],
            );
          sfx.play('click');
          hand.swing();
          subtitles.push('Pearl warped');
          return true;
        }
      }
      // Flint and steel: ignite block above with fire.
      if (heldName === 'flint_and_steel' && airAbove) {
        const fireId = registry.byName('webmc:fire');
        if (fireId !== undefined) {
          world.set(bx, by + 1, bz, makeState(fireId, 0));
          touchWorldEdit(bx, by + 1, bz, fireId);
          consumeHeldToolDurability(1);
          sfx.play('click');
          hand.swing();
          subtitles.push('Ignited');
          return true;
        }
      }
      // Fire charge: same as flint+steel, consumes the item.
      if (heldName === 'fire_charge' && airAbove) {
        const fireId = registry.byName('webmc:fire');
        const fcId = itemRegistry.byName('webmc:fire_charge');
        if (fireId !== undefined) {
          world.set(bx, by + 1, bz, makeState(fireId, 0));
          touchWorldEdit(bx, by + 1, bz, fireId);
          if (fcId !== undefined && (gameMode === 'survival' || gameMode === 'adventure'))
            consumeInventoryItem(fcId, 1);
          sfx.play('click');
          hand.swing();
          subtitles.push('Ignited');
          return true;
        }
      }
      // Bucket fill: right-click water/lava with empty bucket.
      if (heldName === 'bucket' && (def.name === 'webmc:water' || def.name === 'webmc:lava')) {
        const filled = def.name === 'webmc:water' ? 'webmc:water_bucket' : 'webmc:lava_bucket';
        const filledItemId = itemRegistry.byName(filled);
        const emptyItemId = itemRegistry.byName('webmc:bucket');
        if (filledItemId !== undefined && emptyItemId !== undefined) {
          if (gameMode === 'survival' || gameMode === 'adventure') {
            consumeInventoryItem(emptyItemId, 1);
            inventory.add({ itemId: filledItemId, count: 1, damage: 0 });
          }
          // Drop fluid registration so the cell stops ticking + flowing.
          fluidWorld.clear(bx, by, bz);
          touchWorldEdit(bx, by, bz, 0);
          sfx.play('click');
          hand.swing();
          subtitles.push(def.name === 'webmc:water' ? 'Filled water bucket' : 'Filled lava bucket');
          return true;
        }
      }
      // Water bucket on fire: extinguish.
      if (heldName === 'water_bucket' && def.name === 'webmc:fire') {
        world.set(bx, by, bz, AIR);
        touchWorldEdit(bx, by, bz, 0);
        if (gameMode === 'survival' || gameMode === 'adventure') {
          const wbId = itemRegistry.byName('webmc:water_bucket');
          const eId = itemRegistry.byName('webmc:bucket');
          if (wbId !== undefined && eId !== undefined) {
            consumeInventoryItem(wbId, 1);
            inventory.add({ itemId: eId, count: 1, damage: 0 });
          }
        }
        sfx.play('break');
        hand.swing();
        subtitles.push('Extinguished fire');
        return true;
      }
      // Bucket empty: right-click block with water/lava bucket places fluid in adjacent air space above.
      if ((heldName === 'water_bucket' || heldName === 'lava_bucket') && airAbove) {
        const fluidName = heldName === 'water_bucket' ? 'webmc:water' : 'webmc:lava';
        const fluidId = registry.byName(fluidName);
        if (fluidId !== undefined) {
          // Register source with FluidWorld so it actually flows on tick
          // (setSource itself writes the world cell). Skipping this step
          // was the long-standing bug where bucketed water sat still.
          fluidWorld.setSource(bx, by + 1, bz, heldName === 'water_bucket' ? 'water' : 'lava');
          touchWorldEdit(bx, by + 1, bz, fluidId);
          if (gameMode === 'survival' || gameMode === 'adventure') {
            const heldItemId = itemRegistry.byName(`webmc:${heldName}`);
            const emptyId = itemRegistry.byName('webmc:bucket');
            if (heldItemId !== undefined && emptyId !== undefined) {
              consumeInventoryItem(heldItemId, 1);
              inventory.add({ itemId: emptyId, count: 1, damage: 0 });
            }
          }
          sfx.play('place');
          hand.swing();
          subtitles.push(heldName === 'water_bucket' ? 'Placed water' : 'Placed lava');
          return true;
        }
      }
      // Eat cake: right-click cake block → +2 hunger per slice (7 slices).
      if (def.name === 'webmc:cake' && playerState.hunger < 20) {
        const props = (state >>> 16) + 1;
        if (props >= 7) {
          world.set(bx, by, bz, AIR);
          touchWorldEdit(bx, by, bz, 0);
        } else {
          world.set(bx, by, bz, makeState(id, props));
        }
        playerState.eat(2, 0.4);
        sfx.play('click');
        hand.swing();
        subtitles.push('Ate cake slice');
        return true;
      }
      // Composter: right-click with compostable food/plant → fill chance per item.
      if (def.name === 'webmc:composter') {
        const COMPOSTABLES: Record<string, number> = {
          wheat: 0.65,
          wheat_seeds: 0.3,
          beetroot_seeds: 0.3,
          melon_seeds: 0.3,
          pumpkin_seeds: 0.3,
          carrot: 0.65,
          potato: 0.65,
          beetroot: 0.65,
          apple: 0.65,
          bread: 0.85,
          cookie: 0.85,
          cactus: 0.5,
          sugar_cane: 0.5,
          kelp: 0.3,
          dried_kelp: 0.85,
          sweet_berries: 0.3,
          glow_berries: 0.3,
          melon_slice: 0.5,
          pumpkin_pie: 1.0,
          baked_potato: 0.85,
        };
        const chance = COMPOSTABLES[heldName];
        if (chance !== undefined) {
          if (Math.random() < chance) {
            const props = ((state >>> 16) & 0x07) + 1;
            if (props >= 8) {
              // Output bone meal.
              const bmId = itemRegistry.byName('webmc:bone_meal');
              if (bmId !== undefined) inventory.add({ itemId: bmId, count: 1, damage: 0 });
              world.set(bx, by, bz, makeState(id, 0));
              subtitles.push('Composter full → 1 bone meal');
            } else {
              world.set(bx, by, bz, makeState(id, props));
              subtitles.push(`Composter level ${props}/7`);
            }
          } else {
            subtitles.push('Compost failed');
          }
          if (gameMode === 'survival' || gameMode === 'adventure') {
            const itemId = itemRegistry.byName(`webmc:${heldName}`);
            if (itemId !== undefined) consumeInventoryItem(itemId, 1);
          }
          sfx.play('click');
          return true;
        }
      }
      // Plant crops on farmland: seeds/carrot/potato/beetroot_seeds with farmland target → place crop block above.
      if (def.name === 'webmc:farmland' && airAbove) {
        const PLANT_MAP: Record<string, string> = {
          wheat_seeds: 'webmc:wheat',
          beetroot_seeds: 'webmc:beetroots',
          carrot: 'webmc:carrots',
          potato: 'webmc:potatoes',
          torchflower_seeds: 'webmc:torchflower_crop',
          pitcher_pod: 'webmc:pitcher_crop',
        };
        const cropName = PLANT_MAP[heldName];
        if (cropName !== undefined) {
          const cropId = registry.byName(cropName);
          if (cropId !== undefined) {
            world.set(bx, by + 1, bz, makeState(cropId, 0));
            touchWorldEdit(bx, by + 1, bz, cropId);
            if (gameMode === 'survival' || gameMode === 'adventure') {
              const itemId = itemRegistry.byName(`webmc:${heldName}`);
              if (itemId !== undefined) consumeInventoryItem(itemId, 1);
            }
            sfx.play('place');
            subtitles.push(`Planted ${heldName}`);
            return true;
          }
        }
      }
      // Bone meal on sapling: 50% advance growth → instant tree (simplified: replace sapling with 4-tall log+leaves).
      if (heldName === 'bone_meal' && def.name.endsWith('_sapling') && Math.random() < 0.5) {
        if (growTreeAt(bx, by, bz, def.name)) {
          if (gameMode === 'survival' || gameMode === 'adventure') {
            const bmId = itemRegistry.byName('webmc:bone_meal');
            if (bmId !== undefined) consumeInventoryItem(bmId, 1);
          }
          subtitles.push('Tree grown');
          sfx.play('place');
          hand.swing();
          return true;
        }
      }
      // Bone meal on crops: jump straight to harvestable form (wheat, carrots, potatoes, beetroots).
      if (
        heldName === 'bone_meal' &&
        (def.name === 'webmc:wheat' ||
          def.name === 'webmc:carrots' ||
          def.name === 'webmc:potatoes' ||
          def.name === 'webmc:beetroots')
      ) {
        // Drop the corresponding harvested item.
        const dropMap: Record<string, string[]> = {
          'webmc:wheat': ['webmc:wheat', 'webmc:wheat_seeds'],
          'webmc:carrots': ['webmc:carrot'],
          'webmc:potatoes': ['webmc:potato'],
          'webmc:beetroots': ['webmc:beetroot', 'webmc:beetroot_seeds'],
        };
        const drops = dropMap[def.name] ?? [];
        for (const dropName of drops) {
          const dropId = itemRegistry.byName(dropName);
          if (dropId === undefined) continue;
          const count = 1 + Math.floor(Math.random() * 3);
          inventory.add({ itemId: dropId, count, damage: 0 });
        }
        // Replace crop with farmland.
        const farmlandId = registry.byName('webmc:farmland');
        if (farmlandId !== undefined) {
          world.set(bx, by, bz, makeState(farmlandId, 0));
          touchWorldEdit(bx, by, bz, farmlandId);
        }
        if (gameMode === 'survival' || gameMode === 'adventure') {
          const bmId = itemRegistry.byName('webmc:bone_meal');
          if (bmId !== undefined) consumeInventoryItem(bmId, 1);
        }
        for (let i = 0; i < 12; i++)
          blockParticles.emitPlace(
            bx + (Math.random() - 0.5),
            by + 0.5 + Math.random() * 0.6,
            bz + (Math.random() - 0.5),
            [200, 220, 80],
          );
        subtitles.push('Crop matured');
        hand.swing();
        return true;
      }
      if (heldName === 'bone_meal' && def.name === 'webmc:grass_block' && airAbove) {
        const result = applyBoneMeal({ kind: 'grass_block', hasSpace: true }, Math.random);
        if (result.consumed && result.spawnFlora) {
          const FLOWERS = [
            'webmc:dandelion',
            'webmc:poppy',
            'webmc:blue_orchid',
            'webmc:allium',
            'webmc:azure_bluet',
            'webmc:oxeye_daisy',
            'webmc:cornflower',
            'webmc:lily_of_the_valley',
          ];
          let spawned = 0;
          for (const f of result.spawnFlora) {
            const tx = bx + f.x;
            const tz = bz + f.z;
            const surfaceY = generator.surfaceAt(tx, tz);
            const groundState = world.get(tx, surfaceY, tz);
            if (groundState === AIR) continue;
            const groundDef = registry.get(stateId(groundState));
            if (groundDef.name !== 'webmc:grass_block' && groundDef.name !== 'webmc:dirt') continue;
            const above = world.get(tx, surfaceY + 1, tz);
            if (above !== AIR) continue;
            const blockName =
              f.type === 'flower'
                ? (FLOWERS[Math.floor(Math.random() * FLOWERS.length)] ?? 'webmc:dandelion')
                : 'webmc:short_grass';
            const blockId = registry.byName(blockName);
            if (blockId !== undefined) {
              world.set(tx, surfaceY + 1, tz, makeState(blockId, 0));
              touchWorldEdit(tx, surfaceY + 1, tz, blockId);
              spawned++;
            }
          }
          if (spawned > 0) {
            const itemId = itemRegistry.byName('webmc:bone_meal');
            if (itemId !== undefined && (gameMode === 'survival' || gameMode === 'adventure'))
              consumeInventoryItem(itemId, 1);
            for (let i = 0; i < 12; i++)
              blockParticles.emitPlace(
                bx + (Math.random() - 0.5) * 4,
                by + 0.5 + Math.random(),
                bz + (Math.random() - 0.5) * 4,
                [200, 220, 80],
              );
            subtitles.push('Bone meal applied');
            hand.swing();
            return true;
          }
        }
      }
      // Doors / trapdoors / levers / buttons / fence gates: toggle the
      // "powered/open" bit. Fence gates were missing — players couldn't
      // open them by right-click, so any fenced enclosure with a gate
      // was effectively a permanent fence.
      const interactable =
        def.name.endsWith('_door') ||
        def.name.endsWith('_trapdoor') ||
        def.name.endsWith('_button') ||
        def.name.endsWith('_pressure_plate') ||
        def.name.endsWith('_fence_gate') ||
        def.name === 'webmc:lever';
      if (interactable) {
        const props = (state >>> 16) ^ 1;
        world.set(bx, by, bz, makeState(id, props));
        sfx.play('click');
        hand.swing();
        touchWorldEdit(bx, by, bz, id);
        return true;
      }
      if (
        def.name === 'webmc:chest' ||
        def.name === 'webmc:trapped_chest' ||
        def.name === 'webmc:ender_chest' ||
        def.name === 'webmc:barrel' ||
        def.name.endsWith('_shulker_box') ||
        def.name === 'webmc:shulker_box'
      ) {
        // Vanilla "shiftBypassesUse": sneaking while holding a placeable
        // block bypasses the chest open so you can stack blocks on top
        // of the chest. Without this, you couldn't put a torch on top of
        // your chest in survival without alt-tabbing the chest UI shut.
        const heldStack = inventory.hotbar[inventory.selectedHotbar] ?? null;
        const heldIsPlaceable =
          heldStack !== null && itemRegistry.get(heldStack.itemId).blockId !== undefined;
        if (fp.input.sneak && heldIsPlaceable) return false;
        chestUI.setStorage(getChestStorage(def.name, bx, by, bz));
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
        // Setting spawn always works regardless of mob proximity — vanilla
        // does the same: clicking the bed even during the day saves the
        // spawn. Sleep-through-night additionally needs no hostile mobs
        // within 8 blocks (MC behaviour).
        playerSpawnPoint = { x: bx + 0.5, y: by + 1, z: bz + 0.5 };
        void persistDB.setMeta('playerSpawnPoint', playerSpawnPoint);
        if (!dayNight.isDay) {
          const HOSTILE_KINDS = new Set([
            'zombie',
            'skeleton',
            'creeper',
            'spider',
            'enderman',
            'witch',
            'pillager',
            'vindicator',
            'evoker',
            'phantom',
            'drowned',
            'husk',
            'stray',
            'wither_skeleton',
            'piglin',
            'piglin_brute',
            'hoglin',
            'zoglin',
            'ravager',
            'vex',
          ]);
          let mobNearby = false;
          for (const m of mobWorld.all()) {
            if (!HOSTILE_KINDS.has(m.def.kind)) continue;
            const dx = m.position.x - (bx + 0.5);
            const dy = m.position.y - (by + 0.5);
            const dz = m.position.z - (bz + 0.5);
            if (dx * dx + dy * dy + dz * dz <= 64) {
              mobNearby = true;
              break;
            }
          }
          if (mobNearby) {
            chatInput.addLine('You may not rest now; there are monsters nearby.', '#ffd080');
            toast.show('Spawn set', '#ffb0c0', 1200);
            sfx.play('click');
            return true;
          }
          dayNight.setTimeOfDayTicks(1000);
          // The day-cycle watcher in frame() does dayCounter++ when
          // isDay becomes true; show that pending value here without
          // mutating dayCounter ourselves (was double-counting on sleep).
          toast.show(`Spawn set. Day ${String(dayCounter + 1)}`, '#ffb0c0');
          chatInput.addLine('You sleep. Dawn arrives.', '#d0d0ff');
          lastSleepDay = dayCounter;
          // Vanilla heals the sleeper to full HP if hunger >= 9 (no hunger
          // restored). Sleep also clears the on-fire timer. Without this,
          // beds were just a spawn-setter — the heal-on-rest gameplay loop
          // (which makes early-game sustainable) didn't exist.
          if (playerState.hunger >= 9) {
            playerState.health = 20;
          }
          playerState.fireRemainingSec = 0;
          // Cancel any in-flight phantom approach — vanilla resets the
          // since-slept counter when sleeping.
        } else {
          toast.show('Spawn set', '#ffb0c0', 1200);
        }
        sfx.play('click');
        return true;
      }
      const WORKSTATIONS = new Set([
        'webmc:crafting_table',
        'webmc:furnace',
        'webmc:smoker',
        'webmc:blast_furnace',
        'webmc:enchanting_table',
        'webmc:anvil',
        'webmc:chipped_anvil',
        'webmc:damaged_anvil',
        'webmc:smithing_table',
        'webmc:fletching_table',
        'webmc:cartography_table',
        'webmc:loom',
        'webmc:grindstone',
        'webmc:stonecutter',
        'webmc:lectern',
        'webmc:brewing_stand',
        'webmc:beacon',
        'webmc:respawn_anchor',
        'webmc:lodestone',
        'webmc:conduit',
      ]);
      if (WORKSTATIONS.has(def.name)) {
        // Sneak+placeable bypasses workstation open too (vanilla parity).
        const heldStack = inventory.hotbar[inventory.selectedHotbar] ?? null;
        const heldIsPlaceable =
          heldStack !== null && itemRegistry.get(heldStack.itemId).blockId !== undefined;
        if (fp.input.sneak && heldIsPlaceable) return false;
        if (gameMode === 'survival' || gameMode === 'adventure') survivalInv.show();
        else creativeInv.show();
        fp.inputBlocked = true;
        document.exitPointerLock();
        sfx.play('click');
        return true;
      }
      return false;
    },
    onAirInteract: () => {
      // Right-click into the open sky / void (no block hit). Bow firing
      // works here too — vanilla shoots wherever you're aimed. Spectator
      // is gated out (matches the onInteract spectator gate).
      if (gameMode === 'spectator') return false;
      const heldName = heldNameLower();
      if (heldName === 'bow' || heldName === 'crossbow') {
        return fireBowOrCrossbow();
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

// Grow a tree by replacing a sapling with a 4-6 log trunk + leaf canopy.
// Pulled out of the bone-meal handler so the random-tick path can call it
// too — saplings shipped with no growth wiring, so a planted sapling just
// stayed a knee-high stick forever unless you bone-mealed it.
function growTreeAt(bx: number, by: number, bz: number, saplingName: string): boolean {
  const wood = saplingName.replace('webmc:', '').replace('_sapling', '');
  const logId = registry.byName(`webmc:${wood}_log`);
  const leavesId = registry.byName(`webmc:${wood}_leaves`) ?? registry.byName('webmc:oak_leaves');
  if (logId === undefined || leavesId === undefined) return false;
  const trunkH = 4 + Math.floor(Math.random() * 3);
  for (let h = 0; h < trunkH; h++) {
    const above = world.get(bx, by + h, bz);
    if (above === AIR || registry.get(stateId(above)).name.endsWith('_sapling')) {
      world.set(bx, by + h, bz, makeState(logId, 0));
      touchWorldEdit(bx, by + h, bz, logId);
    }
  }
  for (let dx = -2; dx <= 2; dx++) {
    for (let dz = -2; dz <= 2; dz++) {
      for (let dy = trunkH - 2; dy <= trunkH; dy++) {
        if (dx === 0 && dz === 0 && dy < trunkH) continue;
        if (Math.abs(dx) + Math.abs(dz) > 3) continue;
        const lx = bx + dx;
        const ly = by + dy;
        const lz = bz + dz;
        if (world.get(lx, ly, lz) !== AIR) continue;
        if (Math.random() < 0.85) {
          world.set(lx, ly, lz, makeState(leavesId, 0));
          touchWorldEdit(lx, ly, lz, leavesId);
        }
      }
    }
  }
  for (let i = 0; i < 18; i++)
    blockParticles.emitPlace(
      bx + (Math.random() - 0.5) * 3,
      by + Math.random() * trunkH,
      bz + (Math.random() - 0.5) * 3,
      [200, 220, 80],
    );
  return true;
}

// Bow / crossbow instant-hit hitscan. Was registered as an item since
// M2 but never wired to fire — drawing a bow did nothing. Vanilla has
// draw-charge + arc, but webmc trades that for hitscan matching how
// snowball/egg already work. Damage = 6 (full-draw ceil(speed*2) from
// arrow_trajectory). Consumes 1 arrow in survival/adventure (creative
// is free), bow loses 1 durability. Called from both onInteract (when
// aimed at a block) and onAirInteract (firing into the open sky).
function fireBowOrCrossbow(): boolean {
  const arrowId = itemRegistry.byName('webmc:arrow');
  const isSurvival = gameMode === 'survival' || gameMode === 'adventure';
  if (isSurvival && (arrowId === undefined || countInventoryItem(arrowId) === 0)) {
    subtitles.push('Out of arrows');
    return false;
  }
  const origin = camera.position;
  const look = fp.lookVector();
  let bestId: number | null = null;
  let bestDist = Infinity;
  for (const m of mobWorld.all()) {
    const box = {
      minX: m.position.x - m.def.aabb.halfX,
      minY: m.position.y - m.def.aabb.halfY,
      minZ: m.position.z - m.def.aabb.halfZ,
      maxX: m.position.x + m.def.aabb.halfX,
      maxY: m.position.y + m.def.aabb.halfY,
      maxZ: m.position.z + m.def.aabb.halfZ,
    };
    const hit = intersectRayAABB(origin, look, box, 50);
    if (hit && hit.tMin < bestDist) {
      bestDist = hit.tMin;
      bestId = m.id;
    }
  }
  const dmg = 6;
  if (bestId !== null) {
    const result = mobWorld.damage(bestId, dmg);
    if (result) {
      damageNumbers.spawn(result.position.x, result.position.y + 0.8, result.position.z, dmg);
      const ix = origin.x + look.x * bestDist;
      const iy = origin.y + look.y * bestDist;
      const iz = origin.z + look.z * bestDist;
      for (let k = 0; k < 6; k++) {
        const t = (k + 1) / 7;
        blockParticles.emitPlace(
          origin.x + (ix - origin.x) * t,
          origin.y + (iy - origin.y) * t,
          origin.z + (iz - origin.z) * t,
          [220, 200, 160],
        );
      }
      if (result.killed) {
        spawnMobDrops(result.kind, result.position);
        const xpAmount = rollMobXp({
          source: { kind: 'mob', mob: result.kind },
          rng: Math.random,
        });
        for (const chunk of splitXp(xpAmount)) {
          xpOrbs.spawn(result.position.x, result.position.y + 0.8, result.position.z, chunk);
        }
        playerStats.mobsKilled++;
      }
    }
  } else {
    for (let k = 0; k < 6; k++) {
      const t = ((k + 1) / 7) * 20;
      blockParticles.emitPlace(
        origin.x + look.x * t,
        origin.y + look.y * t,
        origin.z + look.z * t,
        [220, 200, 160],
      );
    }
  }
  if (isSurvival && arrowId !== undefined) consumeInventoryItem(arrowId, 1);
  consumeHeldToolDurability(1);
  sfx.play('break');
  hand.swing();
  return true;
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

// Right-click release cancels in-progress eating. Listen on window so
// releasing outside the canvas also stops eating (otherwise the player
// could "eat" forever by releasing off-canvas, with no consume).
window.addEventListener('mouseup', (e) => {
  if (e.button === 2 && rightClickHeldForEat) {
    cancelEating(eatState);
    rightClickHeldForEat = false;
  }
});

let lastPlayerAttackAt = 0;
function heldAttackFullChargeMs(heldName: string): number {
  let attacksPerSec = 4.0;
  if (heldName.includes('sword')) attacksPerSec = 1.6;
  else if (heldName.includes('netherite_axe')) attacksPerSec = 1.0;
  else if (heldName.includes('axe'))
    attacksPerSec = heldName.includes('wood') || heldName.includes('gold') ? 0.8 : 0.9;
  else if (heldName.includes('pickaxe')) attacksPerSec = 1.2;
  else if (heldName.includes('shovel')) attacksPerSec = 1.0;
  else if (heldName.includes('hoe')) {
    if (heldName.includes('netherite') || heldName.includes('diamond')) attacksPerSec = 4.0;
    else if (heldName.includes('iron')) attacksPerSec = 3.0;
    else if (heldName.includes('stone')) attacksPerSec = 2.0;
    else attacksPerSec = 1.0;
  } else if (heldName.includes('trident')) attacksPerSec = 1.1;
  else if (heldName.includes('mace')) attacksPerSec = 0.5;
  return Math.max(50, 1000 / attacksPerSec);
}
window.addEventListener('mousemove', (e) => {
  if (document.pointerLockElement !== canvas) return;
  hand.applyMouseDelta(e.movementX, e.movementY);
});

canvas.addEventListener('mousedown', (e) => {
  if (document.pointerLockElement !== canvas) return;
  // Spectator: no entity / world right-click interactions. Mob feed,
  // tame, leash, saddle, name-tag, hold-to-eat all bypass otherwise.
  if (e.button === 2 && gameMode === 'spectator') return;
  if (e.button === 2) {
    // Right-click: if aimed at a mob, try feed → tame → leash with held item.
    const aimLook = fp.lookVector();
    let aimedMob: typeof mobWorld extends { all(): IterableIterator<infer M> } ? M | null : null =
      null;
    let bestDist = Infinity;
    for (const m of mobWorld.all()) {
      const dx = m.position.x - camera.position.x;
      const dy = m.position.y - camera.position.y;
      const dz = m.position.z - camera.position.z;
      const d = Math.hypot(dx, dy, dz);
      if (d > 6 + 1) continue;
      const dot = (dx * aimLook.x + dy * aimLook.y + dz * aimLook.z) / Math.max(0.001, d);
      if (dot > 0.97 && d < bestDist) {
        bestDist = d;
        aimedMob = m;
      }
    }
    if (aimedMob) {
      const sel = hotbar.selected;
      const heldName = sel ? `webmc:${sel.name.toLowerCase()}` : '';
      const kind = aimedMob.def.kind;
      const breedFood = BREED_FOOD[kind];
      if (breedFood?.includes(heldName)) {
        const prev = lovingMobs.get(aimedMob.id) ?? {
          inLoveUntilTick: 0,
          breedCooldownUntilTick: 0,
        };
        if (worldTick >= prev.breedCooldownUntilTick) {
          const next = animalFeed(prev, worldTick);
          lovingMobs.set(aimedMob.id, next);
          const itemId = itemRegistry.byName(heldName);
          if (itemId !== undefined) consumeInventoryItem(itemId, 1);
          mobRenderer.setMobName(aimedMob.id, `♥ ${kind}`);
          chatInput.addLine(`${kind} entered love mode ♥`, '#ff80c0');
          hand.swing();
        }
        return;
      }
      if (TAMEABLE_KINDS.has(kind)) {
        let st = tamedMobs.get(aimedMob.id);
        if (!st) {
          st = makeTameable(kind as TameableKind);
          tamedMobs.set(aimedMob.id, st);
        }
        if (st.ownerId === null) {
          const result = tryTame(st, 1, heldName);
          if (result.consumed) {
            const itemId = itemRegistry.byName(heldName);
            if (itemId !== undefined) consumeInventoryItem(itemId, 1);
            if (result.tamed) {
              mobRenderer.setMobName(aimedMob.id, `♥ ${kind}`);
              chatInput.addLine(`Tamed ${kind}! ♥`, '#80ff80');
            }
            hand.swing();
            return;
          }
        }
      }
      if (heldName === 'webmc:lead' && canLeash(kind) && !leashedMobs.has(aimedMob.id)) {
        leashedMobs.add(aimedMob.id);
        mobRenderer.setMobName(aimedMob.id, `🪢 ${kind}`);
        chatInput.addLine(`Leashed ${kind}`, '#80ff80');
        hand.swing();
        return;
      }
      if (heldName === 'webmc:saddle' && (kind === 'pig' || kind === 'horse')) {
        if (!saddledMobs.has(aimedMob.id)) {
          saddledMobs.add(aimedMob.id);
          mobRenderer.setMobName(aimedMob.id, `🪞 ${kind}`);
          const sId = itemRegistry.byName('webmc:saddle');
          if (sId !== undefined && (gameMode === 'survival' || gameMode === 'adventure'))
            consumeInventoryItem(sId, 1);
          chatInput.addLine(`Saddled ${kind}`, '#80ff80');
          hand.swing();
          return;
        }
      }
      if (heldName === 'webmc:name_tag' && sel) {
        // Tag with a quick name; open chat for custom rename.
        chatInput.openChat('/rename ');
        return;
      }
    }
    // No mob in front — try hold-to-eat. Right-click on a food item starts
    // the 1.6s eat animation; mouseup cancels. Fully restored hunger gates
    // out unless the item bypasses (golden apple / chorus fruit / honey).
    if (gameMode === 'survival' || gameMode === 'adventure') {
      const stk = inventory.hotbar[inventory.selectedHotbar];
      if (stk) {
        const itemDef = itemRegistry.get(stk.itemId);
        const restore = itemDef.hungerRestore ?? 0;
        const itemName = itemDef.name;
        const alwaysEdible =
          itemName === 'webmc:golden_apple' ||
          itemName === 'webmc:enchanted_golden_apple' ||
          itemName === 'webmc:chorus_fruit' ||
          itemName === 'webmc:honey_bottle' ||
          itemName === 'webmc:milk_bucket' ||
          itemName.includes('potion_') ||
          itemName === 'webmc:awkward_potion';
        // Milk has zero hunger restore but is drinkable for the effect-clear.
        const drinkable = restore > 0 || itemName === 'webmc:milk_bucket';
        if (drinkable && (playerState.hunger < 20 || alwaysEdible)) {
          if (startEating(eatState, { itemId: itemName })) {
            rightClickHeldForEat = true;
          }
        }
      }
    }
    return;
  }
  if (e.button === 1) {
    e.preventDefault();
    // Spectator: no inventory mutation, no held-block change.
    if (gameMode === 'spectator') return;
    const hit = interaction.castRay();
    if (!hit) return;
    const pickedState = world.get(hit.bx, hit.by, hit.bz);
    const pickedId = stateId(pickedState);
    const def = registry.get(pickedId);
    if (gameMode === 'creative') {
      hotbar.setEntry(hotbar.selectedIndex, {
        state: pickedState,
        name: def.name.replace(/^webmc:/, ''),
        color: def.color,
      });
      interaction.selectedBlock = pickedState;
      chatInput.addLine(`Picked ${def.name.replace(/^webmc:/, '')}`, '#80d080');
      return;
    }
    // Survival/adventure: locate the matching item in the inventory and
    // swap to it. If the player already has it on the hotbar, switch slots.
    // If only in the main inventory, swap into the held slot. If they
    // don't have any, no-op (vanilla behaviour without cheats).
    const itemId = itemRegistry.byName(def.name);
    if (itemId === undefined) return;
    let foundHotbarIdx = -1;
    for (let i = 0; i < 9; i++) {
      if (inventory.hotbar[i]?.itemId === itemId) {
        foundHotbarIdx = i;
        break;
      }
    }
    if (foundHotbarIdx !== -1) {
      hotbar.select(foundHotbarIdx);
      chatInput.addLine(`Selected ${def.name.replace(/^webmc:/, '')}`, '#80d080');
      return;
    }
    let foundMainIdx = -1;
    for (let i = 0; i < inventory.main.length; i++) {
      if (inventory.main[i]?.itemId === itemId) {
        foundMainIdx = i;
        break;
      }
    }
    if (foundMainIdx !== -1) {
      const heldIdx = hotbar.selectedIndex;
      const tmp = inventory.hotbar[heldIdx];
      inventory.hotbar[heldIdx] = inventory.main[foundMainIdx] ?? null;
      inventory.main[foundMainIdx] = tmp ?? null;
      chatInput.addLine(`Picked ${def.name.replace(/^webmc:/, '')}`, '#80d080');
      return;
    }
    chatInput.addLine(`No ${def.name.replace(/^webmc:/, '')} in inventory`, '#ffb080');
    return;
  }
  if (e.button !== 0) return;
  // Spectator: ghost mode, no damage to mobs (matches the canBreak gate
  // I added for blocks). Without this, spectators could one-shot any mob
  // they aimed at — not vanilla behaviour.
  if (gameMode === 'spectator') return;
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
    const sinceMs = nowMs - lastPlayerAttackAt;
    const heldNameLow = heldNameLower();
    const fullChargeMs = heldAttackFullChargeMs(heldNameLow);
    const charge = Math.min(1, sinceMs / fullChargeMs);
    const damageMult = 0.2 + 0.8 * (charge * charge);
    if (sinceMs < 60) return;
    lastPlayerAttackAt = nowMs;
    const strengthEff = playerState.effects.get('strength');
    const weaknessEff = playerState.effects.get('weakness');
    const critMult = critMultiplier({
      velocityY: fp.velocity.y,
      onGround: fp.onGround,
      sprinting: fp.input.sprint,
      inWater: fp.inFluid === 'water',
      hasBlindness: playerState.effects.has('blindness'),
    });
    const strengthBonus = strengthEff ? 3 * (strengthEff.amplifier + 1) : 0;
    const weaknessReduce = weaknessEff ? -4 * (weaknessEff.amplifier + 1) : 0;
    const heldName = heldNameLower();
    const weaponBase = weaponBaseDamageFor(heldName);
    // Mace smash: bonus damage scaled by fall distance (>1.5 blocks falling, capped +24 dmg).
    let maceBonus = 0;
    if (
      heldName.includes('mace') &&
      fp.lastLandFallBlocks <= 0 &&
      !fp.onGround &&
      fp.velocity.y < -1
    ) {
      // Approximate fall distance via airborneStartY tracking — use camera height + a simple counter.
      const fallDist = Math.max(0, maceFallStartY - fp.position.y);
      maceBonus = smashDamage({
        fallDistance: fallDist,
        densityBonus: 0,
        windBurstLevel: 0,
        breachLevel: 0,
        baseDamage: 0,
      });
      if (maceBonus > 0) subtitles.push(`Smash +${maceBonus.toFixed(0)}`);
    }
    const baseDmg =
      Math.max(0, weaponBase + strengthBonus + weaknessReduce) * damageMult * critMult + maceBonus;
    if (critMult > 1) subtitles.push('Critical hit!');
    const result = mobWorld.damage(bestId, baseDmg);
    // Sweep attack: fully-charged sword (and not crit) hits other mobs in 1.5-block radius around the primary target.
    if (heldNameLow.includes('sword') && charge >= 0.9 && critMult === 1 && !fp.input.sprint) {
      const sweep = sweepingAttack({
        sweepingEdgeLevel: 0,
        baseSwordDamage: weaponBase,
        sharpnessBonus: strengthBonus,
        attackChargedRatio: charge,
      });
      if (sweep.sweeps && sweep.sweepDamage > 0) {
        const primary = Array.from(mobWorld.all()).find((m) => m.id === bestId);
        if (primary) {
          let extras = 0;
          for (const m of mobWorld.all()) {
            if (m.id === bestId) continue;
            const dx = m.position.x - primary.position.x;
            const dy = m.position.y - primary.position.y;
            const dz = m.position.z - primary.position.z;
            if (dx * dx + dy * dy + dz * dz > 1.5 * 1.5) continue;
            mobWorld.damage(m.id, sweep.sweepDamage);
            extras++;
          }
          if (extras > 0) subtitles.push(`Sweep ${extras}`);
        }
      }
    }
    if (gameMode === 'survival' || gameMode === 'adventure') {
      playerState.addExhaustion(0.1);
      // Vanilla per-attack durability:
      //   sword: 1
      //   pickaxe / axe / shovel / hoe: 2
      //   bare hand: 0
      // Was only catching sword + axe — pickaxes/shovels/hoes never lost
      // durability when used as makeshift weapons, so a stone shovel
      // could last forever on combat-only sessions.
      const heldNow = heldNameLower();
      if (heldNow.includes('sword') || heldNow.includes('mace') || heldNow.includes('trident')) {
        consumeHeldToolDurability(1);
      } else if (
        heldNow.includes('pickaxe') ||
        heldNow.includes('axe') ||
        heldNow.includes('shovel') ||
        heldNow.includes('hoe')
      ) {
        consumeHeldToolDurability(2);
      }
    }
    sfx.play('hit');
    interaction.setHeld(null);
    screenShake.pulse(0.15);
    hand.swing();
    if (result)
      damageNumbers.spawn(result.position.x, result.position.y + 0.8, result.position.z, baseDmg);
    // Knockback: push mob away from player along horizontal look vector.
    const mobHit = Array.from(mobWorld.all()).find((m) => m.id === bestId);
    if (mobHit) {
      const kb = computeKnockback({
        attackerPos: { x: fp.position.x, y: fp.position.y, z: fp.position.z },
        targetPos: { x: mobHit.position.x, y: mobHit.position.y, z: mobHit.position.z },
        sprinting: fp.input.sprint,
        knockbackLevel: 0,
        knockbackResistance: 0,
      });
      const KB_SCALE = 12;
      mobHit.velocity.x += kb.x * KB_SCALE;
      mobHit.velocity.z += kb.z * KB_SCALE;
      mobHit.velocity.y = Math.max(mobHit.velocity.y, kb.y * KB_SCALE);
    }
    if (result?.killed) {
      spawnMobDrops(result.kind, result.position);
      const xpAmount = rollMobXp({ source: { kind: 'mob', mob: result.kind }, rng: Math.random });
      // MC-style XP chunks (2477, 1237, 617, 307, 149, 73, 37, 17, 7, 3, 1) — fewer orbs for huge drops.
      for (const chunk of splitXp(xpAmount)) {
        xpOrbs.spawn(
          result.position.x + (Math.random() - 0.5) * 0.3,
          result.position.y + 0.8,
          result.position.z + (Math.random() - 0.5) * 0.3,
          chunk,
        );
      }
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
// Persist hotbar selection so the chosen slot survives a reload.
void persistDB.getMeta('hotbarSelected').then((saved) => {
  if (typeof saved === 'number' && saved >= 0 && saved < 9) hotbar.select(saved);
});
// Keep inventory.selectedHotbar in lockstep with the Hotbar UI selection.
// Several systems looked up "the held tool" via inventory.hotbar[selectedHotbar]
// (durability consumption, mending repair, drop-on-Q, ...) — without this
// sync those systems all targeted slot 0 forever, regardless of which
// hotbar slot the player visually had highlighted.
inventory.selectedHotbar = hotbar.selectedIndex;
hotbar.onSelect((index) => {
  inventory.selectedHotbar = index;
  // Switching hotbar slot mid-eat cancels the bite — vanilla does the
  // same. Without this, you could start eating bread, switch to a
  // pickaxe, and still get the food effect when the timer completed
  // (consuming the bread that was no longer in your hand).
  if (eatState.itemId !== null) {
    cancelEating(eatState);
    rightClickHeldForEat = false;
  }
});
let lastHotbarSavedIndex = hotbar.selectedIndex;
function saveHotbarIfChanged(): void {
  if (hotbar.selectedIndex !== lastHotbarSavedIndex) {
    lastHotbarSavedIndex = hotbar.selectedIndex;
    void persistDB.setMeta('hotbarSelected', lastHotbarSavedIndex);
  }
}

let gameMode: GameMode = 'creative';
function applyGameMode(m: GameMode): void {
  gameMode = m;
  // Persist so the next reload doesn't drop the player back into creative.
  void persistDB.setMeta('gameMode', m);
  const eff = effectsFor(m);
  fp.input.fly = eff.canFly;
  fp.canFly = eff.canFly;
  fp.passThroughBlocks = eff.passThroughBlocks;
  playerState.invulnerable = eff.invulnerable;
  survivalHud.setVisible(m === 'survival' || m === 'adventure');
  interaction.breakDurationSec = m === 'creative' ? 0.001 : 0.4;
  // Spectator → no FP hand. Other modes show the hand in first-person.
  refreshHandVisibility();
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
  // Inventory + position reset moved out of takeDamage so totem can run
  // pre-respawn; the death screen now drives it.
  playerState.respawn();
  fp.inputBlocked = false;
  void canvas.requestPointerLock();
  toast.show('Respawned', '#80ffa0', 1200);
});
survivalHud.setVisible(false);
let lastPlayerHealth = 20;
let starvingShown = false;
const bootTime = performance.now();
let lastXpLevel = 0;
let lastIsDay = true;
let lastPhase: 'dawn' | 'day' | 'dusk' | 'night' = 'day';
let dayCounter = 1;
let lastSleepDay = 0;
let lastPhantomCheckMs = 0;
let lastNaturalSpawnAttemptMs = 0;
let lastPassiveSpawnAttemptMs = 0;
let tickFrozen = false;
let lastDeathPos: { x: number; y: number; z: number } | null = null;
let customBossBar: {
  name: string;
  hp: number;
  maxHp: number;
  color: 'pink' | 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'white';
  style: 'progress' | 'notched_6' | 'notched_10' | 'notched_12' | 'notched_20';
} | null = null;
let hardcoreMode = false;
void persistDB.getMeta('hardcore').then((saved) => {
  if (saved === true) hardcoreMode = true;
});
const waypoints = new Map<string, { x: number; y: number; z: number }>();
void persistDB.getMeta('waypoints').then((saved) => {
  if (saved && typeof saved === 'object') {
    const wps = saved as Record<string, { x?: unknown; y?: unknown; z?: unknown }>;
    for (const [k, v] of Object.entries(wps)) {
      if (typeof v.x === 'number' && typeof v.y === 'number' && typeof v.z === 'number') {
        waypoints.set(k, { x: v.x, y: v.y, z: v.z });
      }
    }
  }
});
function persistWaypoints(): void {
  const obj: Record<string, { x: number; y: number; z: number }> = {};
  for (const [k, v] of waypoints) obj[k] = v;
  void persistDB.setMeta('waypoints', obj);
}
void persistDB.getMeta('lastDeathPos').then((saved) => {
  if (saved && typeof saved === 'object') {
    const p = saved as { x?: unknown; y?: unknown; z?: unknown };
    if (typeof p.x === 'number' && typeof p.y === 'number' && typeof p.z === 'number') {
      lastDeathPos = { x: p.x, y: p.y, z: p.z };
    }
  }
});
const chickenEggTimers = new Map<number, number>(); // mob id → next-egg-ms timestamp
let lastEggCheckMs = 0;
const zombieDrownTimers = new Map<number, number>(); // zombie id → ms in water
let lastDrownCheckMs = 0;
void persistDB.getMeta('dayCounter').then((saved) => {
  if (typeof saved === 'number' && Number.isFinite(saved)) dayCounter = saved;
});
let playerSpawnPoint: { x: number; y: number; z: number } | null = null;
void persistDB.getMeta('playerSpawnPoint').then((saved) => {
  if (saved && typeof saved === 'object' && 'x' in saved && 'y' in saved && 'z' in saved) {
    const p = saved;
    if (typeof p.x === 'number' && typeof p.y === 'number' && typeof p.z === 'number') {
      playerSpawnPoint = { x: p.x, y: p.y, z: p.z };
    }
  }
});
let lastInFluid: 'water' | 'lava' | null = null;

const chatInput = new ChatInput(appEl, {
  onSubmit: (text) => {
    if (text.startsWith('/')) {
      const useChain = text.includes(';');
      const exec = useChain ? executeCommands : executeCommand;
      exec(text, {
        playerPos: { x: fp.position.x, y: fp.position.y, z: fp.position.z },
        setPlayerPos: (x, y, z) => {
          fp.position.set(x, y, z);
          // Zero velocity so /tp doesn't preserve fall speed and instantly
          // damage the player on landing at the destination.
          fp.velocity.set(0, 0, 0);
        },
        gameMode,
        setGameMode: (m) => {
          applyGameMode(m);
        },
        setTimeOfDay: (t) => {
          dayNight.setTimeOfDayTicks(t);
        },
        addTimeOfDay: (n) => {
          dayNight.setTimeOfDayTicks(Math.floor(dayNight.timeOfDay * 24000) + n);
        },
        setWeather: (w) => {
          setWeather(w);
        },
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
        lookupItem: (name) => {
          const candidates = [name, `webmc:${name}`];
          return candidates.some((c) => itemRegistry.byName(c) !== undefined);
        },
        lookupBlock: (name) => {
          const candidates = [name, `webmc:${name}`];
          return candidates.some((c) => registry.byName(c) !== undefined);
        },
        listMobKinds: () => Object.keys(MOB_DEFS),
        uptimeMs: () => performance.now() - bootTime,
        lookAtBlock: () => {
          const hit = interaction.castRay();
          if (!hit) return null;
          const def = registry.get(stateId(world.get(hit.bx, hit.by, hit.bz)));
          return { x: hit.bx, y: hit.by, z: hit.bz, name: def.name.replace(/^webmc:/, '') };
        },
        setMute: (m) => {
          audio.setMasterVolume(m ? 0 : 0.35);
          sfx.setMasterVolume(m ? 0 : 0.35);
        },
        showTitle: (text, color, durMs) => {
          toast.show(text, color ?? '#ffffff', durMs ?? 2000);
        },
        listBlocks: (filter) => {
          const f = filter?.toLowerCase() ?? '';
          const out: string[] = [];
          for (const def of registry.defs) {
            if (def.name === 'webmc:air') continue;
            const short = def.name.replace(/^webmc:/, '');
            if (!f || short.includes(f)) out.push(short);
          }
          return out;
        },
        giveAllBlocks: () => {
          let n = 0;
          // Include every registered item: covers blocks-with-items, tools, foods, dyes, etc.
          for (let id = 1; id < itemRegistry.size; id++) {
            inventory.add({ itemId: id, count: 1, damage: 0 });
            n++;
          }
          return n;
        },
        broadcast: (line, color) => {
          chatInput.addLine(line, color);
        },
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
        sortInventory: () => {
          inventory.sortMain();
        },
        toggleScoreboard: () => scoreboard.toggle(),
        setTickFrozen: (frozen) => {
          tickFrozen = frozen;
        },
        isTickFrozen: () => tickFrozen,
        getTpsStats: () => ({
          tps: tpsTracker.tps(),
          p50ms: tpsTracker.percentile(0.5),
          p95ms: tpsTracker.percentile(0.95),
          lagging: tpsTracker.isLagging(),
        }),
        getLastDeathPos: () => lastDeathPos,
        setWorldBorder: (d) => {
          setBorderSize(worldBorder, d);
        },
        getWorldBorder: () => worldBorder.diameter,
        setHardcore: (on) => {
          hardcoreMode = on;
          void persistDB.setMeta('hardcore', on);
        },
        isHardcore: () => hardcoreMode,
        showBossBar: (name, hp, maxHp, color, style) => {
          customBossBar = { name, hp, maxHp, color, style: style ?? 'progress' };
        },
        hideBossBar: () => {
          customBossBar = null;
        },
        giveXp: (amount) => {
          if (amount > 0) playerState.addXP(amount);
          else if (amount < 0) {
            // Drain XP — go down levels.
            let remaining = -amount;
            while (remaining > 0 && (playerState.xpProgress > 0 || playerState.xpLevel > 0)) {
              if (playerState.xpProgress >= remaining) {
                playerState.xpProgress -= remaining;
                remaining = 0;
              } else {
                remaining -= playerState.xpProgress;
                playerState.xpProgress = 0;
                if (playerState.xpLevel > 0) {
                  playerState.xpLevel -= 1;
                  playerState.xpProgress = xpToNext(playerState.xpLevel) - 0.001;
                }
              }
            }
          }
        },
        equipArmor: (name) => {
          const fullName = name.startsWith('webmc:') ? name : `webmc:${name}`;
          const itemId = itemRegistry.byName(fullName);
          if (itemId === undefined) return null;
          const armorDef = ARMOR_DEFS[name.replace(/^webmc:/, '')];
          if (!armorDef) return null;
          const slotIndex =
            armorDef.slot === 'helmet'
              ? 0
              : armorDef.slot === 'chestplate'
                ? 1
                : armorDef.slot === 'leggings'
                  ? 2
                  : 3;
          if (countInventoryItem(itemId) === 0) return null;
          // Swap with whatever's in the slot.
          const prev = inventory.armor[slotIndex];
          consumeInventoryItem(itemId, 1);
          inventory.armor[slotIndex] = { itemId, count: 1, damage: 0 };
          if (prev) inventory.add(prev);
          return armorDef.slot;
        },
        exportWorldManifest: () => {
          const m = createExportManifest({
            worldName: worldMeta.name,
            seed: String(WORLD_SEED),
            createdMs: worldMeta.createdAt ?? Date.now(),
            lastPlayedMs: Date.now(),
            chunkCount: chunkRenderer.meshCount,
            playerCount: 1,
          });
          return JSON.stringify(m, null, 2);
        },
        loadDatapackDemo: () => {
          const demoPack: DataPack = {
            meta: {
              name: 'webmc-demo-pack',
              version: '1.0',
              author: 'webmc',
              description: 'Built-in demo',
            },
            blocks: [
              {
                name: 'webmc:demo_pink',
                color: [255, 100, 200],
                hardness: 0.5,
                opaque: true,
                solid: true,
              },
              {
                name: 'webmc:demo_cyan',
                color: [100, 255, 240],
                hardness: 0.5,
                opaque: true,
                solid: true,
                lightEmission: 8,
              },
            ],
          };
          const report = loadDatapack(demoPack, {
            blocks: registry,
            items: itemRegistry,
            recipes: recipeRegistry,
          });
          return `+${String(report.blocksAdded)} blocks +${String(report.recipesAdded)} recipes${report.errors.length ? ` (${String(report.errors.length)} errors)` : ''}`;
        },
        setWaypoint: (name, x, y, z) => {
          waypoints.set(name, { x, y, z });
          persistWaypoints();
        },
        getWaypoint: (name) => waypoints.get(name) ?? null,
        listWaypoints: () =>
          Array.from(waypoints, ([name, v]) => ({ name, x: v.x, y: v.y, z: v.z })),
        removeWaypoint: (name) => {
          const ok = waypoints.delete(name);
          if (ok) persistWaypoints();
          return ok;
        },
        locateStructure: (kind) => {
          if (kind === 'stronghold') {
            const positions = strongholdsInRing(WORLD_SEED, 0);
            if (positions.length === 0) return null;
            let best: { x: number; z: number; dist: number } | null = null;
            for (const p of positions) {
              const d = Math.hypot(p.x - fp.position.x, p.z - fp.position.z);
              if (!best || d < best.dist) best = { x: p.x, z: p.z, dist: d };
            }
            return best;
          }
          // Deterministic pseudo-locate for other structures: derive an offset from worldSeed + kind hash.
          const KNOWN = [
            'village',
            'monument',
            'fortress',
            'mansion',
            'pyramid',
            'desert_temple',
            'jungle_temple',
            'igloo',
            'shipwreck',
            'buried_treasure',
            'ocean_ruin',
            'pillager_outpost',
            'ancient_city',
            'trail_ruins',
            'trial_chambers',
            'bastion',
            'mineshaft',
            'end_city',
            'ruined_portal',
            'spawner',
            'witch_hut',
          ];
          if (!KNOWN.includes(kind)) return null;
          let h = WORLD_SEED >>> 0;
          for (let i = 0; i < kind.length; i++) h = ((h ^ kind.charCodeAt(i)) * 0x01000193) >>> 0;
          const ang = ((h & 0xffff) / 65535) * Math.PI * 2;
          const dist = 200 + ((h >>> 16) % 1500);
          const tx = Math.round(fp.position.x + Math.cos(ang) * dist);
          const tz = Math.round(fp.position.z + Math.sin(ang) * dist);
          return { x: tx, z: tz, dist };
        },
        rollLootTable: (table) => {
          const tables: Record<string, readonly { id: string; w: number }[]> = {
            desert: [
              { id: 'webmc:diamond', w: 1 },
              { id: 'webmc:enchanted_golden_apple', w: 1 },
              { id: 'webmc:golden_apple', w: 4 },
              { id: 'webmc:iron_ingot', w: 15 },
              { id: 'webmc:gold_ingot', w: 10 },
              { id: 'webmc:emerald', w: 8 },
              { id: 'webmc:bone', w: 25 },
              { id: 'webmc:rotten_flesh', w: 25 },
              { id: 'webmc:gunpowder', w: 25 },
              { id: 'webmc:string', w: 20 },
            ],
            dungeon: [
              { id: 'webmc:iron_ingot', w: 30 },
              { id: 'webmc:gold_ingot', w: 15 },
              { id: 'webmc:bread', w: 30 },
              { id: 'webmc:wheat', w: 30 },
              { id: 'webmc:redstone', w: 25 },
              { id: 'webmc:bone', w: 25 },
              { id: 'webmc:string', w: 25 },
              { id: 'webmc:enchanted_golden_apple', w: 1 },
            ],
            mineshaft: [
              { id: 'webmc:iron_ingot', w: 25 },
              { id: 'webmc:bread', w: 15 },
              { id: 'webmc:gold_ingot', w: 10 },
              { id: 'webmc:diamond', w: 1 },
              { id: 'webmc:redstone', w: 30 },
              { id: 'webmc:lapis_lazuli', w: 30 },
            ],
          };
          const pool = tables[table];
          if (!pool) return null;
          const valid = pool.filter((e) => itemRegistry.byName(e.id) !== undefined);
          if (valid.length === 0) return null;
          const total = valid.reduce((s, e) => s + e.w, 0);
          let r = Math.random() * total;
          for (const e of valid) {
            r -= e.w;
            if (r <= 0) return e.id.replace(/^webmc:/, '');
          }
          return valid[valid.length - 1]!.id.replace(/^webmc:/, '');
        },
        renameLookedAtMob: (name) => {
          const aimLook = fp.lookVector();
          const reach = 6;
          let best: {
            mob: typeof mobWorld extends { all(): IterableIterator<infer M> } ? M : never;
            dist: number;
          } | null = null;
          for (const m of mobWorld.all()) {
            const dx = m.position.x - camera.position.x;
            const dy = m.position.y - camera.position.y;
            const dz = m.position.z - camera.position.z;
            const d = Math.hypot(dx, dy, dz);
            if (d > reach + 1) continue;
            const dot = (dx * aimLook.x + dy * aimLook.y + dz * aimLook.z) / Math.max(0.001, d);
            if (dot > 0.97 && (!best || d < best.dist)) {
              best = { mob: m, dist: d };
            }
          }
          if (!best) return null;
          mobRenderer.setMobName(best.mob.id, name);
          return best.mob.def.kind;
        },
        tameLookedAtMob: () => {
          const aimLook = fp.lookVector();
          const reach = 6;
          let best: {
            mob: ReturnType<typeof mobWorld.all> extends IterableIterator<infer M> ? M : never;
            dist: number;
          } | null = null;
          for (const m of mobWorld.all()) {
            const dx = m.position.x - camera.position.x;
            const dy = m.position.y - camera.position.y;
            const dz = m.position.z - camera.position.z;
            const d = Math.hypot(dx, dy, dz);
            if (d > reach + 1) continue;
            const dot = (dx * aimLook.x + dy * aimLook.y + dz * aimLook.z) / Math.max(0.001, d);
            if (dot > 0.97 && (!best || d < best.dist)) {
              best = { mob: m, dist: d };
            }
          }
          if (!best) return null;
          const kind = best.mob.def.kind;
          if (!TAMEABLE_KINDS.has(kind)) {
            return { kind, tamed: false, itemUsed: null, reason: 'untameable' };
          }
          let state = tamedMobs.get(best.mob.id);
          if (!state) {
            state = makeTameable(kind as TameableKind);
            tamedMobs.set(best.mob.id, state);
          }
          if (state.ownerId !== null) {
            return { kind, tamed: false, itemUsed: null, reason: 'already_tamed' };
          }
          const sel = hotbar.selected;
          const heldName = sel ? `webmc:${sel.name.toLowerCase()}` : '';
          const result = tryTame(state, 1, heldName);
          if (!result.consumed) {
            return { kind, tamed: false, itemUsed: null, reason: 'wrong_item' };
          }
          if (sel) {
            const itemId = itemRegistry.byName(`webmc:${sel.name.toLowerCase()}`);
            if (itemId !== undefined) consumeInventoryItem(itemId, 1);
          }
          if (result.tamed) {
            mobRenderer.setMobName(best.mob.id, `♥ ${kind}`);
          }
          return { kind, tamed: result.tamed, itemUsed: heldName.replace(/^webmc:/, '') };
        },
        leashLookedAtMob: () => {
          const aimLook = fp.lookVector();
          const reach = 6;
          let best: {
            mob: ReturnType<typeof mobWorld.all> extends IterableIterator<infer M> ? M : never;
            dist: number;
          } | null = null;
          for (const m of mobWorld.all()) {
            const dx = m.position.x - camera.position.x;
            const dy = m.position.y - camera.position.y;
            const dz = m.position.z - camera.position.z;
            const d = Math.hypot(dx, dy, dz);
            if (d > reach + 1) continue;
            const dot = (dx * aimLook.x + dy * aimLook.y + dz * aimLook.z) / Math.max(0.001, d);
            if (dot > 0.97 && (!best || d < best.dist)) {
              best = { mob: m, dist: d };
            }
          }
          if (!best) return null;
          const kind = best.mob.def.kind;
          if (!canLeash(kind)) return { kind, leashed: false, reason: 'unleashable' };
          if (leashedMobs.has(best.mob.id))
            return { kind, leashed: false, reason: 'already_leashed' };
          leashedMobs.add(best.mob.id);
          mobRenderer.setMobName(best.mob.id, `🪢 ${kind}`);
          return { kind, leashed: true };
        },
        unleashAllMobs: () => {
          const n = leashedMobs.size;
          const allMobs = [...mobWorld.all()];
          for (const id of leashedMobs) {
            const m = allMobs.find((mm) => mm.id === id);
            if (m) mobRenderer.setMobName(id, m.def.kind);
          }
          leashedMobs.clear();
          return n;
        },
        feedLookedAtMob: () => {
          const aimLook = fp.lookVector();
          const reach = 6;
          let best: {
            mob: ReturnType<typeof mobWorld.all> extends IterableIterator<infer M> ? M : never;
            dist: number;
          } | null = null;
          for (const m of mobWorld.all()) {
            const dx = m.position.x - camera.position.x;
            const dy = m.position.y - camera.position.y;
            const dz = m.position.z - camera.position.z;
            const d = Math.hypot(dx, dy, dz);
            if (d > reach + 1) continue;
            const dot = (dx * aimLook.x + dy * aimLook.y + dz * aimLook.z) / Math.max(0.001, d);
            if (dot > 0.97 && (!best || d < best.dist)) {
              best = { mob: m, dist: d };
            }
          }
          if (!best) return null;
          const kind = best.mob.def.kind;
          const accepted = BREED_FOOD[kind];
          if (!accepted) {
            return { kind, loved: false, itemUsed: null, reason: 'not_breedable' };
          }
          const sel = hotbar.selected;
          const heldName = sel ? `webmc:${sel.name.toLowerCase()}` : '';
          if (!accepted.includes(heldName)) {
            return { kind, loved: false, itemUsed: null, reason: 'wrong_item' };
          }
          const prev = lovingMobs.get(best.mob.id) ?? {
            inLoveUntilTick: 0,
            breedCooldownUntilTick: 0,
          };
          if (worldTick < prev.breedCooldownUntilTick) {
            return {
              kind,
              loved: false,
              itemUsed: heldName.replace(/^webmc:/, ''),
              reason: 'cooldown',
            };
          }
          const next = animalFeed(prev, worldTick);
          lovingMobs.set(best.mob.id, next);
          const itemId = itemRegistry.byName(heldName);
          if (itemId !== undefined) consumeInventoryItem(itemId, 1);
          mobRenderer.setMobName(best.mob.id, `♥ ${kind}`);
          return { kind, loved: true, itemUsed: heldName.replace(/^webmc:/, '') };
        },
        toggleZoom: (factor) => {
          const baseFov = (fp.camera.userData['baseFov'] as number | undefined) ?? 70;
          fp.setBaseFov(baseFov === 70 || factor >= 0.99 ? 70 : 70);
          // Use effect-fov-boost slot for negative offset (zoom narrows fov).
          const targetBoost = factor >= 0.99 ? 0 : -baseFov * (1 - factor);
          fp.setEffectFovBoost(targetBoost);
        },
        setWalkSpeed: (mul) => {
          fp.speedMultiplier = mul;
        },
        surfaceAt: (x, z) => generator.surfaceAt(x, z),
        markRegionPoint: (point) => {
          regionPoints[point] = {
            x: Math.floor(fp.position.x),
            y: Math.floor(fp.position.y),
            z: Math.floor(fp.position.z),
          };
        },
        fillRegion: (block) => {
          if (!regionPoints.a || !regionPoints.b) return -1;
          const isAir = block === 'air' || block === 'webmc:air';
          let state = AIR;
          if (!isAir) {
            const full = block.startsWith('webmc:') ? block : `webmc:${block}`;
            const id = registry.byName(full);
            if (id === undefined) return -1;
            state = makeState(id, 0);
          }
          const a = regionPoints.a,
            b = regionPoints.b;
          const sx = Math.min(a.x, b.x),
            ex = Math.max(a.x, b.x);
          const sy = Math.min(a.y, b.y),
            ey = Math.max(a.y, b.y);
          const sz = Math.min(a.z, b.z),
            ez = Math.max(a.z, b.z);
          let n = 0;
          const chunksTouched = new Set<string>();
          for (let y = sy; y <= ey; y++) {
            for (let z = sz; z <= ez; z++) {
              for (let x = sx; x <= ex; x++) {
                if (y < 0 || y >= CHUNK_HEIGHT) continue;
                world.set(x, y, z, state);
                n++;
                chunksTouched.add(`${String(Math.floor(x / 16))},${String(Math.floor(z / 16))}`);
              }
            }
          }
          for (const k of chunksTouched) {
            const [cxS, czS] = k.split(',');
            const c = world.getChunk(Number(cxS), Number(czS));
            if (c) markChunkAllDirty(c);
          }
          return n;
        },
        entityStats: () => {
          let hostile = 0,
            passive = 0,
            neutral = 0;
          const counts = new Map<string, number>();
          for (const m of mobWorld.all()) {
            const b = m.def.behavior;
            if (b === 'hostile' || b === 'creeper') hostile++;
            else if (b === 'passive') passive++;
            else if (b === 'neutral' || b === 'enderman') neutral++;
            counts.set(m.def.kind, (counts.get(m.def.kind) ?? 0) + 1);
          }
          const byKind = [...counts.entries()]
            .map(([kind, count]) => ({ kind, count }))
            .sort((a, b) => b.count - a.count);
          return {
            mobs: mobWorld.size,
            hostile,
            passive,
            neutral,
            drops: droppedItems.size,
            xpOrbs: xpOrbs.size,
            byKind,
          };
        },
        chunkStats: () => ({
          loaded: Array.from(world.chunks()).length,
          pending: 0,
          meshes: chunkRenderer.meshCount,
          triangles: chunkRenderer.triangleCount,
        }),
        openCreativeInventory: () => {
          creativeInv.show();
          fp.inputBlocked = true;
          document.exitPointerLock();
        },
        saveLoadout: (name) => {
          const snapshot: LoadoutSnap = {
            hotbar: inventory.hotbar.map(snapshotStack),
            main: inventory.main.map(snapshotStack),
            armor: inventory.armor.map(snapshotStack),
          };
          loadouts.set(name, snapshot);
          void persistDB.setMeta('loadouts', Object.fromEntries(loadouts));
        },
        loadLoadout: (name) => {
          const snap = loadouts.get(name);
          if (!snap) return false;
          for (let i = 0; i < 9; i++) inventory.hotbar[i] = restoreStack(snap.hotbar[i] ?? null);
          for (let i = 0; i < 27; i++) inventory.main[i] = restoreStack(snap.main[i] ?? null);
          for (let i = 0; i < 4; i++) inventory.armor[i] = restoreStack(snap.armor[i] ?? null);
          return true;
        },
        listLoadouts: () => Array.from(loadouts.keys()),
        setTickRate: (tps) => {
          tickRateMultiplier = Math.max(0.05, Math.min(5, tps / 20));
        },
        cycleCamera: () => {
          cycleCamera();
          return cameraMode === 'fp'
            ? 'first-person'
            : cameraMode === 'tp_back'
              ? 'third (back)'
              : 'third (front)';
        },
        toggleMinimap: () => {
          minimapVisible = !minimapVisible;
          minimap.setVisible(minimapVisible);
          return minimapVisible;
        },
        minimapZoom: (dir) => {
          if (dir === 'in') minimap.zoomIn();
          else minimap.zoomOut();
        },
        setPlayerName: (name) => {
          currentPlayerName = sanitizePlayerName(name) || 'Player';
          playerAvatar.setName(currentPlayerName);
        },
        remeshAllChunks: () => {
          let n = 0;
          for (const c of world.chunks()) {
            markChunkAllDirty(c);
            n++;
          }
          return n;
        },
        setHealth: (hp) => {
          playerState.health = Math.max(0, Math.min(20, hp));
        },
        setHunger: (h) => {
          playerState.hunger = Math.max(0, Math.min(20, h));
        },
        setSaturation: (s) => {
          playerState.saturation = Math.max(0, Math.min(20, s));
        },
        setBreath: (b) => {
          playerState.breath = Math.max(0, Math.min(15, b));
        },
        setXpLevel: (lvl) => {
          playerState.xpLevel = Math.max(0, Math.min(200, lvl));
          playerState.xpProgress = 0;
        },
        killMobsNear: (radius) => {
          const r2 = radius * radius;
          const toKill: number[] = [];
          for (const m of mobWorld.all()) {
            const dx = m.position.x - fp.position.x;
            const dz = m.position.z - fp.position.z;
            if (dx * dx + dz * dz < r2) toKill.push(m.id);
          }
          for (const id of toKill) mobWorld.remove(id);
          return toKill.length;
        },
        tpAllMobsTo: () => {
          let n = 0;
          for (const m of mobWorld.all()) {
            m.position.x = fp.position.x + (Math.random() - 0.5) * 4;
            m.position.y = fp.position.y;
            m.position.z = fp.position.z + (Math.random() - 0.5) * 4;
            n++;
          }
          return n;
        },
        saveStateInfo: () => ({
          dirtyChunks: autosaveState.dirtyCount,
          lastSaveSec:
            autosaveState.lastSaveMs > 0
              ? (performance.now() - autosaveState.lastSaveMs) / 1000
              : 0,
        }),
        gpuInfo: () => ({
          gl: rendererInfo.gl,
          vendor: 'WebGL2',
          renderer: rendererInfo.rend,
        }),
        unequipAll: () => {
          let n = 0;
          for (let i = 0; i < 4; i++) {
            const piece = inventory.armor[i];
            if (piece) {
              inventory.add(piece);
              inventory.armor[i] = null;
              n++;
            }
          }
          return n;
        },
        healMobsNear: (radius) => {
          const r2 = radius * radius;
          let n = 0;
          for (const m of mobWorld.all()) {
            const dx = m.position.x - fp.position.x;
            const dz = m.position.z - fp.position.z;
            if (dx * dx + dz * dz < r2) {
              m.health = m.def.maxHealth;
              n++;
            }
          }
          return n;
        },
        dropAllItems: () => {
          let n = 0;
          const drop = (slots: (typeof inventory.hotbar)[number][]): void => {
            for (let i = 0; i < slots.length; i++) {
              const s = slots[i];
              if (!s) continue;
              const def = itemRegistry.get(s.itemId);
              const colorRgb =
                def.blockId !== undefined
                  ? registry.get(def.blockId).color
                  : ([200, 200, 200] as const);
              droppedItems.spawn(
                fp.position.x + (Math.random() - 0.5),
                fp.position.y,
                fp.position.z + (Math.random() - 0.5),
                { itemId: s.itemId, count: s.count, color: colorRgb, damage: s.damage },
                1.5,
              );
              slots[i] = null;
              n++;
            }
          };
          drop(inventory.hotbar);
          drop(inventory.main);
          return n;
        },
        inventoryStats: () => {
          const counts = new Map<string, number>();
          let filled = 0,
            total = 0;
          const all = [...inventory.hotbar, ...inventory.main, ...inventory.armor];
          for (const slot of all) {
            if (slot) {
              filled++;
              const name = itemRegistry.get(slot.itemId).name.replace(/^webmc:/, '');
              counts.set(name, (counts.get(name) ?? 0) + slot.count);
              total += slot.count;
            }
          }
          const topItems = [...counts.entries()]
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);
          return {
            filledSlots: filled,
            totalSlots: all.length,
            totalItems: total,
            uniqueTypes: counts.size,
            topItems,
          };
        },
        heldItemInfo: () => {
          const sel = inventory.hotbar[inventory.selectedHotbar];
          if (!sel) return null;
          const def = itemRegistry.get(sel.itemId);
          const out: {
            name: string;
            count: number;
            maxStack: number;
            durability?: { current: number; max: number };
            food?: { hunger: number; saturation: number };
            tags?: string[];
          } = {
            name: def.name.replace(/^webmc:/, ''),
            count: sel.count,
            maxStack: def.maxStack,
          };
          if (def.durability > 0)
            out.durability = { current: def.durability - sel.damage, max: def.durability };
          if (def.hungerRestore !== undefined && def.hungerRestore > 0)
            out.food = { hunger: def.hungerRestore, saturation: def.saturation ?? 0 };
          const tags: string[] = [];
          if (def.name.includes('sword')) tags.push('weapon');
          if (
            def.name.includes('axe') ||
            def.name.includes('pickaxe') ||
            def.name.includes('shovel') ||
            def.name.includes('hoe')
          )
            tags.push('tool');
          if (
            def.name.includes('helmet') ||
            def.name.includes('chestplate') ||
            def.name.includes('leggings') ||
            def.name.includes('boots')
          )
            tags.push('armor');
          if (def.blockId !== undefined) tags.push('placeable');
          if (tags.length > 0) out.tags = tags;
          return out;
        },
        screenshot: () => {
          const data = canvas.toDataURL('image/png');
          const a = document.createElement('a');
          a.href = data;
          a.download = screenshotFilename(new Date());
          a.click();
        },
        setFov: (deg) => {
          fp.setBaseFov(deg);
        },
        repairHeld: () => {
          const sel = inventory.hotbar[inventory.selectedHotbar];
          if (!sel) return false;
          const def = itemRegistry.get(sel.itemId);
          if (def.durability <= 0) return false;
          inventory.hotbar[inventory.selectedHotbar] = { ...sel, damage: 0 };
          return true;
        },
        heldDurability: () => {
          const sel = inventory.hotbar[inventory.selectedHotbar];
          if (!sel) return null;
          const def = itemRegistry.get(sel.itemId);
          if (def.durability <= 0) return null;
          return {
            name: def.name.replace(/^webmc:/, ''),
            current: def.durability - sel.damage,
            max: def.durability,
          };
        },
        applyVelocity: (dx, dy, dz) => {
          if (dx !== 0 || dz !== 0) {
            const look = fp.lookVector();
            fp.velocity.x += look.x * dx;
            fp.velocity.z += look.z * dx;
          }
          fp.velocity.y += dy;
          if (dz !== 0) {
            // dz is reserved for sideways; kept simple = ignore.
          }
        },
        toggleSitLookedAtMob: () => {
          const aimLook = fp.lookVector();
          const reach = 6;
          let best: {
            mob: ReturnType<typeof mobWorld.all> extends IterableIterator<infer M> ? M : never;
            dist: number;
          } | null = null;
          for (const m of mobWorld.all()) {
            const dx = m.position.x - camera.position.x;
            const dy = m.position.y - camera.position.y;
            const dz = m.position.z - camera.position.z;
            const d = Math.hypot(dx, dy, dz);
            if (d > reach + 1) continue;
            const dot = (dx * aimLook.x + dy * aimLook.y + dz * aimLook.z) / Math.max(0.001, d);
            if (dot > 0.97 && (!best || d < best.dist)) {
              best = { mob: m, dist: d };
            }
          }
          if (!best) return null;
          const state = tamedMobs.get(best.mob.id);
          if (!state || state.ownerId === null) return null;
          toggleSit(state, 1);
          mobRenderer.setMobName(best.mob.id, `${state.sitting ? '○' : '♥'} ${best.mob.def.kind}`);
          return { kind: best.mob.def.kind, sitting: state.sitting };
        },
        toggleGyro: () => {
          gyroState = setGyroEnabled(gyroState, !gyroState.enabled);
          if (
            gyroState.enabled &&
            typeof (
              DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }
            ).requestPermission === 'function'
          ) {
            void (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> })
              .requestPermission()
              .catch(() => undefined);
          }
          return gyroState.enabled;
        },
        copyToClipboard: (text) => BROWSER_CLIPBOARD.writeText(text),
        getRoomCode: () => roomCode ?? null,
        importWorldFile: () => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = '.zip,.mca,.dat,.webmc';
          input.style.display = 'none';
          document.body.appendChild(input);
          input.addEventListener(
            'change',
            () => {
              const f = input.files?.[0];
              input.remove();
              if (!f) return;
              chatInput.addLine(
                `Detecting format of ${f.name} (${(f.size / 1024).toFixed(1)} kB)…`,
                '#cccccc',
              );
              const handle = async (): Promise<void> => {
                const buf = new Uint8Array(await f.arrayBuffer());
                if (f.name.endsWith('.dat')) {
                  try {
                    const { gunzip } = await import('./persist/nbt_gzip');
                    const { parseLevelDat } = await import('./persist/level_dat_fields');
                    const raw = await gunzip(buf);
                    const sanitized = parseLevelDat(raw);
                    chatInput.addLine(
                      `level.dat: seed=${sanitized.seed} spawn=(${String(sanitized.spawnX)},${String(sanitized.spawnY)},${String(sanitized.spawnZ)}) diff=${sanitized.difficulty}`,
                      '#80ff80',
                    );
                    chatInput.addLine(
                      `time=${String(sanitized.gameTime)} dayTime=${String(sanitized.dayTime)} hardcore=${String(sanitized.hardcore)}`,
                      '#cccccc',
                    );
                  } catch (e) {
                    chatInput.addLine(`level.dat parse failed: ${String(e)}`, '#ff8080');
                  }
                } else if (f.name.endsWith('.mca')) {
                  try {
                    const { importVanillaChunk } = await import('./persist/anvil_chunk_to_webmc');
                    const airId = registry.byName('webmc:air');
                    const stoneId = registry.byName('webmc:stone');
                    if (airId === undefined || stoneId === undefined) {
                      chatInput.addLine('Internal: registry missing air/stone', '#ff8080');
                      return;
                    }
                    // Paste imported chunks centered on the player's current
                    // chunk so they land in view. The .mca holds 32x32 chunks
                    // at local (0..31, 0..31); we anchor (0,0) at the player.
                    const anchorCx = Math.floor(camera.position.x / 16);
                    const anchorCz = Math.floor(camera.position.z / 16);
                    let placed = 0;
                    let chunksWritten = 0;
                    const chunksTouched = new Set<string>();
                    const MAX_CHUNKS = 32;
                    for (let lx = 0; lx < 32 && chunksWritten < MAX_CHUNKS; lx++) {
                      for (let lz = 0; lz < 32 && chunksWritten < MAX_CHUNKS; lz++) {
                        const out = await importVanillaChunk(buf, lx, lz, {
                          byName: (n) => registry.byName(n),
                          airId,
                          fallbackId: stoneId,
                        });
                        if (!out) continue;
                        const destCx = anchorCx + lx;
                        const destCz = anchorCz + lz;
                        const baseX = destCx * 16;
                        const baseZ = destCz * 16;
                        // ids array is laid out Y*256 + Z*16 + X with Y in
                        // 0..(yMax - yMin); destination Y = yMin + ly.
                        const yRange = out.yMax - out.yMin + 1;
                        for (let ly = 0; ly < yRange; ly++) {
                          const destY = out.yMin + ly;
                          if (destY < 0 || destY >= CHUNK_HEIGHT) continue;
                          for (let lzz = 0; lzz < 16; lzz++) {
                            for (let lxx = 0; lxx < 16; lxx++) {
                              const srcIdx = (ly << 8) | (lzz << 4) | lxx;
                              const blockId: number = out.ids[srcIdx] ?? airId;
                              if (blockId === airId) continue;
                              world.set(baseX + lxx, destY, baseZ + lzz, makeState(blockId, 0));
                              placed++;
                            }
                          }
                        }
                        chunksTouched.add(`${String(destCx)},${String(destCz)}`);
                        chunksWritten++;
                      }
                    }
                    // Single chunk-rebuild pass, like fillBlocks does.
                    for (const k of chunksTouched) {
                      const [cxS, czS] = k.split(',');
                      const cxN = Number(cxS);
                      const czN = Number(czS);
                      const ch = world.getChunk(cxN, czN);
                      if (ch) {
                        const oldLight = lightCache.get(lightKey(cxN, czN)) ?? null;
                        chunkStore.markDirty(ch, oldLight);
                        const newLight = buildLight(ch, lightOracle);
                        lightCache.set(lightKey(cxN, czN), newLight);
                        markChunkAllDirty(ch);
                      }
                    }
                    if (chunksWritten === 0) {
                      chatInput.addLine(
                        '.mca: no chunks decoded (file empty or unsupported format)',
                        '#ffd080',
                      );
                    } else {
                      chatInput.addLine(
                        `.mca: pasted ${String(placed)} blocks across ${String(chunksWritten)} chunks at (${String(anchorCx)},${String(anchorCz)})${chunksWritten === MAX_CHUNKS ? ` [capped at ${String(MAX_CHUNKS)}]` : ''}`,
                        '#80ff80',
                      );
                    }
                  } catch (e) {
                    chatInput.addLine(`.mca parse failed: ${String(e)}`, '#ff8080');
                  }
                } else if (f.name.endsWith('.webmc')) {
                  chatInput.addLine(
                    'webmc save detected. Use Main Menu → Import to load.',
                    '#80ff80',
                  );
                } else if (f.name.endsWith('.zip')) {
                  try {
                    const { readZip } = await import('./persist/zip_reader');
                    const { importVanillaPack } = await import('./persist/vanilla_pack_import');
                    const zipEntries = await readZip(buf);
                    const decoder = new TextDecoder('utf-8', { fatal: false });
                    const packEntries = await Promise.all(
                      zipEntries.map(async (z) => {
                        const lower = z.name.toLowerCase();
                        const isText =
                          lower.endsWith('.json') ||
                          lower.endsWith('.mcmeta') ||
                          lower.endsWith('.mcfunction') ||
                          lower.endsWith('.txt') ||
                          lower.endsWith('.properties') ||
                          lower.endsWith('.lang');
                        if (!isText) return { path: z.name };
                        try {
                          const bytes = await z.data();
                          return { path: z.name, text: decoder.decode(bytes) };
                        } catch {
                          return { path: z.name };
                        }
                      }),
                    );
                    const report = importVanillaPack(packEntries);
                    chatInput.addLine(
                      `ZIP imported: ${String(zipEntries.length)} entries, pack=${
                        report.pack
                          ? `format=${String(report.pack.packFormat)} "${report.pack.description}"`
                          : 'none'
                      }`,
                      '#80ff80',
                    );
                    chatInput.addLine(
                      `recipes=${String(report.recipes.length)} tags=${String(report.tags.length)} loot=${String(report.lootTables.length)} adv=${String(report.advancements.length)} fn=${String(report.functions.length)} biome=${String(report.biomes.length)} dim=${String(report.dimensions.length)} bs=${String(report.blockstates.length)} model=${String(report.models.length)} lang=${String(report.lang.length)} sounds=${String(report.sounds.length)} anim=${String(report.animations.length)}`,
                      '#cccccc',
                    );
                    chatInput.addLine(
                      `enchant=${String(report.enchantments.length)} dmg=${String(report.damageTypes.length)} chat=${String(report.chatTypes.length)} splash=${String(report.splashes.length)} paint=${String(report.paintingVariants.length)} trim_p=${String(report.trimPatterns.length)} trim_m=${String(report.trimMaterials.length)} mob_v=${String(report.mobVariants.length)} banner=${String(report.bannerPatterns.length)} inst=${String(report.instruments.length)}`,
                      '#cccccc',
                    );
                    chatInput.addLine(
                      `atlas=${String(report.atlases.length)} pred=${String(report.predicates.length)} font=${String(report.fonts.length)} item_mod=${String(report.itemModifiers.length)} world_pre=${String(report.worldPresets.length)} flat_pre=${String(report.flatPresets.length)} cfeat=${String(report.configuredFeatures.length)} pfeat=${String(report.placedFeatures.length)}`,
                      '#cccccc',
                    );
                    chatInput.addLine(
                      `struct=${String(report.structures.length)} pool=${String(report.templatePools.length)} proc=${String(report.processorLists.length)} noise=${String(report.noiseSettings.length)} mn=${String(report.multiNoiseSources.length)} dens=${String(report.densityFunctions.length)} jukebox=${String(report.jukeboxSongs.length)} skipped=${String(report.skipped.length)} unknown=${String(report.unknown.length)}`,
                      '#cccccc',
                    );
                    if (report.errors.length > 0) {
                      chatInput.addLine(
                        `${String(report.errors.length)} per-file errors (first: ${
                          report.errors[0]?.path ?? ''
                        })`,
                        '#ff8080',
                      );
                    }
                  } catch (e) {
                    chatInput.addLine(`ZIP parse failed: ${String(e)}`, '#ff8080');
                  }
                } else {
                  chatInput.addLine(`Unknown format: ${f.name}`, '#ff8080');
                }
              };
              void handle();
            },
            { once: true },
          );
          input.click();
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
          const isAir = name === 'air' || name === 'webmc:air';
          let state = AIR;
          if (!isAir) {
            const full = name.startsWith('webmc:') ? name : `webmc:${name}`;
            const id = registry.byName(full);
            if (id === undefined) return -1;
            state = makeState(id, 0);
          }
          const sx = Math.min(x1, x2),
            ex = Math.max(x1, x2);
          const sy = Math.min(y1, y2),
            ey = Math.max(y1, y2);
          const sz = Math.min(z1, z2),
            ez = Math.max(z1, z2);
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
            const cxN = Number(cxS),
              czN = Number(czS);
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
          // Flush every persistent surface — was only flushing player +
          // chunks, leaving recent meta changes (game mode, weather,
          // time, fluid cells, day counter, chest, hotbar, ...) only on
          // their next periodic timer / visibilitychange.
          void savePlayerNow();
          void chunkStore.flush();
          void saveAllChestStorages();
          void persistDB.setMeta('playerStats', playerStats);
          void persistDB.setMeta('timeOfDay', dayNight.timeOfDay);
          void persistDB.setMeta('dayCounter', dayCounter);
          void persistDB.setMeta('fluidCells', fluidWorld.serialize());
          saveHotbarIfChanged();
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
          // Debug command — open the shared ender chest store. Per-block
          // chests have their own storage opened via right-clicking them.
          chestUI.setStorage(enderChestStorage);
          chestUI.show();
          fp.inputBlocked = true;
          document.exitPointerLock();
        },
        teleportSpawn: () => {
          if (playerSpawnPoint) {
            fp.position.set(playerSpawnPoint.x, playerSpawnPoint.y, playerSpawnPoint.z);
            fp.velocity.set(0, 0, 0);
            chatInput.addLine(
              `Spawn at ${playerSpawnPoint.x.toFixed(1)} ${playerSpawnPoint.y.toFixed(1)} ${playerSpawnPoint.z.toFixed(1)}`,
              '#cccccc',
            );
          } else {
            const s = Math.max(generator.surfaceAt(0, 0), 62) + 4;
            fp.position.set(worldMeta.spawn.x, s, worldMeta.spawn.z);
            fp.velocity.set(0, 0, 0);
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
        clearChat: () => {
          chatInput.clearLog();
        },
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
        setGameRule: (rule, val) => {
          if (rule in gameRules) {
            (gameRules as Record<string, boolean>)[rule] = val;
            void persistDB.setMeta('gameRules', gameRules);
          }
        },
        listGameRules: () => ({ ...gameRules }),
        biomeAt: (x, z) => (generator.biomeAt(x, z) === 1 ? 'forest' : 'plains'),
        findMob: (kind) => {
          let best: { x: number; y: number; z: number; dist: number } | null = null;
          for (const m of mobWorld.all()) {
            if (m.def.kind !== kind) continue;
            const dx = m.position.x - fp.position.x;
            const dy = m.position.y - fp.position.y;
            const dz = m.position.z - fp.position.z;
            const dist = Math.hypot(dx, dy, dz);
            if (!best || dist < best.dist) {
              best = { x: m.position.x, y: m.position.y, z: m.position.z, dist };
            }
          }
          return best;
        },
        findBlock: (name, r) => {
          const fullName = name.startsWith('webmc:') ? name : `webmc:${name}`;
          const id = registry.byName(fullName);
          if (id === undefined) return null;
          const px = Math.floor(fp.position.x);
          const py = Math.floor(fp.position.y);
          const pz = Math.floor(fp.position.z);
          let best: { x: number; y: number; z: number; dist: number } | null = null;
          for (let dy = -r; dy <= r; dy++) {
            for (let dz = -r; dz <= r; dz++) {
              for (let dx = -r; dx <= r; dx++) {
                const x = px + dx,
                  y = py + dy,
                  z = pz + dz;
                if (y < 0 || y >= CHUNK_HEIGHT) continue;
                const s = world.get(x, y, z);
                if (s === AIR) continue;
                if (stateId(s) !== id) continue;
                const dist = Math.hypot(dx, dy, dz);
                if (!best || dist < best.dist) best = { x, y, z, dist };
              }
            }
          }
          return best;
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
          mobDamageMultiplier =
            level === 'peaceful' ? 0 : level === 'easy' ? 0.5 : level === 'hard' ? 1.5 : 1;
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
          chatInput.addLine(
            `Playtime: ${(playerStats.playtimeSec / 60).toFixed(1)} min`,
            '#cccccc',
          );
          chatInput.addLine(
            `Blocks broken: ${String(playerStats.blocksBroken)}  placed: ${String(playerStats.blocksPlaced)}`,
            '#cccccc',
          );
          chatInput.addLine(`Mobs killed: ${String(playerStats.mobsKilled)}`, '#cccccc');
          chatInput.addLine(
            `Distance walked: ${playerStats.distanceWalked.toFixed(1)} m`,
            '#cccccc',
          );
        },
      });
    } else {
      // Local echo. Show under the player's actual name (so the local view
      // matches what other peers see) instead of the static '<You>' label
      // — and broadcast to room peers if connected. Multiplayer chat was
      // one-way: receivers got the messages but never sent.
      chatInput.addLine(`<${currentPlayerName}> ${text}`);
      roomClient?.sendChat(text);
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
      // Sneak/fly were missing — if the player held Shift to sneak then
      // pressed T to chat, sneak persisted because keyDown is gated on
      // !inputBlocked but the held state was never cleared. Closed chat
      // would still apply the lower eye height + edge cling until the
      // player tapped Shift again.
      fp.input.sneak = false;
      document.exitPointerLock();
    }
  },
  getCompletions: (input) => {
    if (!input.startsWith('/')) return [];
    const SLASH_CMDS = [
      '/help',
      '/gamemode',
      '/gm',
      '/tp',
      '/teleport',
      '/time',
      '/weather',
      '/give',
      '/heal',
      '/kill',
      '/clear',
      '/setblock',
      '/fill',
      '/summon',
      '/chest',
      '/spawn',
      '/seed',
      '/killall',
      '/stats',
      '/save',
      '/setspawn',
      '/spawnpoint',
      '/setworldspawn',
      '/clearchat',
      '/cc',
      '/me',
      '/list',
      '/whoami',
      '/fly',
      '/pos',
      '/where',
      '/biome',
      '/effect',
      '/listeffects',
      '/particle',
      '/difficulty',
      '/achievements',
      '/ach',
      '/find',
      '/findmob',
      '/lookup',
      '/listblocks',
      '/listmobs',
      '/lookat',
      '/destroy',
      '/back',
      '/freeze',
      '/unfreeze',
      '/mute',
      '/unmute',
      '/title',
      '/echo',
      '/repeat',
      '/random',
      '/roll',
      '/coin',
      '/flip',
      '/8ball',
      '/uptime',
      '/version',
      '/v',
      '/ping',
      '/day',
      '/sun',
      '/night',
      '/moon',
      '/noon',
      '/midnight',
      '/up',
      '/down',
      '/distance',
      '/dist',
      '/gamerule',
      '/sort',
      '/scoreboard',
      '/sb',
      '/gyro',
      '/tilt',
      '/copy',
      '/import',
      '/milk',
      '/tick',
      '/tps',
      '/deathloc',
      '/lastdeath',
      '/rename',
      '/nametag',
      '/worldborder',
      '/wb',
      '/loot',
      '/locate',
      '/waypoint',
      '/wp',
      '/hardcore',
      '/datapack',
      '/dp',
      '/export',
      '/equip',
      '/xp',
      '/experience',
      '/bossbar',
      '/tame',
      '/sit',
      '/stand',
      '/feed',
      '/breed',
      '/leash',
      '/unleash',
      '/village',
      '/house',
      '/tower',
      '/pyramid',
      '/dungeon',
      '/sphere',
      '/cube',
      '/platform',
      '/portal',
      '/netherportal',
      '/roof',
      '/wall',
      '/bridge',
      '/pillar',
      '/tree',
      '/glow',
      '/replace',
      '/dragon',
      '/wither',
      '/army',
      '/firework',
      '/fw',
      '/rain',
      '/storm',
      '/sun',
      '/tutorial',
      '/guide',
      '/starter',
      '/kit',
      '/craft',
      '/cook',
      '/smelt',
      '/world',
      '/info',
      '/perf',
      '/benchmark',
      '/zoom',
      '/speed',
      '/jump',
      '/launch',
      '/nv',
      '/nightvision',
      '/invis',
      '/invisible',
      '/god',
      '/godmode',
      '/home',
      '/sethome',
      '/about',
      '/credits',
      '/commands',
      '/cmds',
      '/rtp',
      '/randomtp',
      '/safetp',
      '/safe',
      '/buildmode',
      '/build',
      '/survivalmode',
      '/sm',
      '/spectate',
      '/sp',
      '/confetti',
      '/celebrate',
      '/panic',
      '/repair',
      '/durability',
      '/dura',
      '/mark',
      '/paste',
      '/fillregion',
      '/wipe',
      '/respawn',
      '/rs',
      '/fullness',
      '/noclip',
      '/screenshot',
      '/snap',
      '/fov',
      '/entities',
      '/mobs',
      '/chunkstats',
      '/chunks',
      '/spread',
      '/spreadplayers',
      '/lighting',
      '/creative_inventory',
      '/ci',
      '/freezemobs',
      '/safezone',
      '/peaceful',
      '/loadout',
      '/tps_target',
      '/tickrate',
      '/cyclecam',
      '/cyclecamera',
      '/minimap',
      '/minimapzoom',
      '/reset',
      '/mute_chat',
      '/broadcast',
      '/test',
      '/sanitycheck',
      '/item',
      '/itemstats',
      '/inventory',
      '/inv',
      '/dropall',
      '/count',
      '/commandcount',
      '/pick',
      '/name',
      '/rename_self',
      '/reload',
      '/remesh',
      '/health',
      '/hp',
      '/hunger',
      '/food',
      '/saturation',
      '/sat',
      '/breath',
      '/air',
      '/level',
      '/xplevel',
      '/clearmobs',
      '/killnear',
      '/healmobs',
      '/healall',
      '/savestate',
      '/savenow',
      '/forcesave',
      '/keys',
      '/keybinds',
      '/controls',
      '/gamemode_cycle',
      '/gmc',
      '/cdoff',
      '/noregen',
      '/cdon',
      '/regen_on',
      '/fastday',
      '/speedday',
      '/fastnight',
      '/speednight',
      '/biomename',
      '/bn',
      '/distancetraveled',
      '/dt',
      '/maxlevel',
      '/maxxp',
      '/godxp',
      '/infinitexp',
      '/naked',
      '/unequip',
      '/kits',
      '/listkits',
      '/modes',
      '/gamemodes',
      '/enchants',
      '/enchantments',
      '/effects',
      '/allbuffs',
      '/totem',
      '/undying',
      '/meme',
      '/noob',
      '/tipoftheday',
      '/tip',
      '/goals',
      '/objectives',
      '/achievements_progress',
      '/progress',
      '/recipes',
      '/recipebook',
      '/devmode',
      '/dev',
      '/speedrun',
      '/creator',
      '/authorinfo',
      '/chunk',
      '/currentchunk',
      '/gpu',
      '/renderer',
      '/farm',
      '/cabin',
      '/pool',
      '/lake',
      '/road',
      '/fountain',
      '/gardenshed',
      '/shed',
      '/graveyard',
      '/spawnvillage',
      '/autotown',
      '/maze',
      '/arena',
      '/castle',
      '/mineshaft',
      '/staircase',
      '/redstone_demo',
      '/rsdemo',
      '/pixelart',
      '/timer',
      '/countdown',
      '/cd',
      '/wave',
      '/crowd',
      '/rampage',
      '/showcase',
      '/demoworld',
      '/rainbow',
      '/levelup',
      '/lvlup',
      '/tankmode',
      '/tank',
      '/speedrun_pro',
      '/srpro',
      '/unpause',
      '/play',
      '/pausegame',
      '/tpall',
      '/tpmobs',
      '/highlight',
      '/mark_block',
      '/gotomark',
      '/tpmark',
      '/lookreport',
      '/aim_info',
      '/note',
      '/memo',
      '/time_quick',
      '/tq',
      '/wisdom',
      '/fortune',
      '/lookuprich',
      '/lr',
      '/gridmark',
      '/sea',
      '/flood',
      '/desert_world',
      '/sand',
      '/snow_world',
      '/icy',
      '/forest_world',
      '/forest',
      '/nether_world',
      '/nether',
      '/jungle_world',
      '/jungle',
      '/end_world',
      '/end_island',
      '/mushroom_world',
      '/mushroomland',
      '/cherry_world',
      '/sakura',
      '/amethyst_geode',
      '/geode',
      '/monument',
      '/oceanmonument',
      '/stronghold',
      '/animalpen',
      '/pen',
      '/cropfields',
      '/allfields',
      '/beacon_pyramid',
      '/beaconbase',
      '/campfire_circle',
      '/cfc',
      '/zoo',
      '/parkour',
      '/lighthouse',
      '/igloo',
      '/skyscraper',
      '/treehouse',
      '/windmill',
      '/bridge',
      '/pillar',
      '/road',
      '/tunnel',
      '/aquarium',
      '/spiralstaircase',
      '/spiral',
      '/platform',
      '/clearfloor',
      '/wall',
      '/dome',
      '/barn',
      '/watchtower',
      '/rainbow_path',
      '/rainbowpath',
      '/test_blocks',
      '/blockgrid',
      '/panic',
      '/pets',
      '/kittens',
      '/carnival',
      '/sky_island',
      '/skyisland',
      '/forge',
      '/kitchen',
      '/stable',
      '/tavern',
      '/inn',
      '/shop',
      '/tradinghouse',
      '/library',
      '/chess',
      '/checkerboard',
      '/fortress',
      '/castle_walls',
      '/brewery',
      '/apothecary',
      '/observatory',
      '/oasis',
      '/desert_temple',
      '/sandtemple',
      '/pale_garden',
      '/palegarden',
      '/trial_chamber',
      '/trialchamber',
      '/compliment',
      '/salute',
      '/gg',
      '/island',
      '/mountain',
      '/sky',
      '/flightpath',
      '/underground',
      '/caves',
      '/randomblock',
      '/rb',
      '/randommob',
      '/rmob',
      '/mobcount',
      '/mc',
    ];
    return SLASH_CMDS;
  },
  getPlayerName: () => currentPlayerName,
  onMention: () => {
    sfx.play('click');
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
    // Was only saving player + chunks — chest contents, fluid cells,
    // day counter, time of day, player stats, hotbar selection were
    // left to their next periodic flush. Quitting to main menu and
    // immediately closing the tab lost them. Mirror the full /save +
    // visibilitychange flush set.
    void savePlayerNow();
    void chunkStore.flush();
    void saveAllChestStorages();
    void persistDB.setMeta('playerStats', playerStats);
    void persistDB.setMeta('timeOfDay', dayNight.timeOfDay);
    void persistDB.setMeta('dayCounter', dayCounter);
    void persistDB.setMeta('fluidCells', fluidWorld.serialize());
    saveHotbarIfChanged();
  },
  onOpenSettings: () => {
    settingsPanel.show();
  },
  onShowAchievements: () => {
    chatInput.addLine('— Achievements —', '#ffeb80');
    for (const a of achievements) {
      const got = achievedSet.has(a.id);
      chatInput.addLine(`${got ? '✔' : '✗'} ${a.title}`, got ? '#80ff80' : '#888888');
    }
  },
  onShowStats: () => {
    chatInput.addLine('— Statistics —', '#ffeb80');
    chatInput.addLine(`Blocks broken: ${String(playerStats.blocksBroken)}`, '#cccccc');
    chatInput.addLine(`Blocks placed: ${String(playerStats.blocksPlaced)}`, '#cccccc');
    chatInput.addLine(`Mobs killed: ${String(playerStats.mobsKilled)}`, '#cccccc');
    chatInput.addLine(`Distance walked: ${playerStats.distanceWalked.toFixed(0)}m`, '#cccccc');
    chatInput.addLine(`Playtime: ${(playerStats.playtimeSec / 60).toFixed(1)}min`, '#cccccc');
  },
});
pauseMenu.setSubtitle(`Paused — ${worldNameForUI}`);

const resourcePackLoader = new ResourcePackLoader(appEl, {
  onLoaded: (pack) => {
    const result = applyPackToRegistry(registry, pack);
    const newPattern = buildPatternTextureFromPack(pack);
    if (newPattern) {
      const oldTex = (
        chunkRenderer.material.uniforms['uPattern'] as { value: THREE.Texture | null }
      ).value;
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

const accessibilityStyle = document.createElement('style');
accessibilityStyle.textContent = [
  'body.webmc-large-text [data-testid="chat-log"] div { font-size: 16px !important; }',
  'body.webmc-large-text [data-testid="subtitles"] div { font-size: 15px !important; }',
  'body.webmc-large-text [data-testid="pause-menu"] button { font-size: 20px !important; padding: 14px 26px !important; }',
  'body.webmc-large-text [data-testid="death-screen"] button { font-size: 20px !important; }',
  'body.webmc-high-contrast [data-testid="chat-log"] div { background: #000 !important; border: 1px solid #fff !important; }',
  'body.webmc-high-contrast [data-testid="subtitles"] div { background: #000 !important; border: 1px solid #fff !important; }',
  'body.webmc-high-contrast [data-testid="pause-menu"] button { border: 2px solid #fff !important; }',
  'body.webmc-reduce-motion *, body.webmc-reduce-motion *::before, body.webmc-reduce-motion *::after { transition-duration: 0s !important; animation-duration: 0s !important; }',
].join('\n');
document.head.appendChild(accessibilityStyle);

const settingsPanel = new SettingsPanel(appEl, {
  onChange: (v) => {
    fp.setBaseFov(v.fov);
    loader.setViewRadius(v.viewDistance);
    (fp as unknown as { opts: { lookSensitivity: number } }).opts.lookSensitivity =
      v.mouseSensitivity;
    // Touch look sensitivity. Touch px-deltas are smaller than mouse
    // deltas, so we don't share the raw multiplier — instead derive a
    // relative scale: touchSens = touchDefault × (userMouseSens /
    // mouseDefault). User doubling the sensitivity slider doubles both.
    // Touch users couldn't adjust look sens at all before.
    touch?.setLookSensitivity(0.005 * (v.mouseSensitivity / 0.0022));
    fp.invertY = v.invertY;
    fp.sprintToggle = v.sprintToggle;
    brightnessMul = v.brightness;
    if (v.showCrosshair) crosshair.show();
    else crosshair.hide();
    currentPlayerName = sanitizePlayerName(v.playerName) || 'Player';
    playerAvatar.setName(currentPlayerName);
    document.title = `webmc · ${worldMeta.name} · ${currentPlayerName}`;
    mobRenderer.showNameplates = v.showMobNames;
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
    document.body.classList.toggle('webmc-high-contrast', v.highContrast);
    document.body.classList.toggle('webmc-large-text', v.largeText);
    document.body.classList.toggle('webmc-reduce-motion', v.reduceMotion);
  },
});
// Apply persisted settings at startup. Without this, the SettingsPanel
// loaded values from localStorage but no onChange ever fired before the
// user opened the panel, so FOV / sensitivity / volume / sprintToggle
// / playerName / mob nameplates / brightness / etc. all stayed at
// hardcoded defaults until the user manually clicked "Settings".
settingsPanel.applyCurrent();

const TIPS: readonly string[] = [
  'Tip: Press E for inventory',
  'Tip: Press F4 to cycle game modes',
  'Tip: Press F5 for third-person',
  'Tip: Press T for chat, / for commands',
  'Tip: Right-click a bed at night to sleep (or B in creative)',
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
    fireTutorial('world_loaded');
    fireTutorial('spawn_finished');
  },
  onOpenSettings: () => {
    settingsPanel.show();
  },
  onOpenResourcePacks: () => {
    resourcePackLoader.show();
  },
});
fp.inputBlocked = true;
const savedGameMode = (await persistDB.getMeta('gameMode')) as GameMode | null;
if (
  savedGameMode === 'survival' ||
  savedGameMode === 'creative' ||
  savedGameMode === 'adventure' ||
  savedGameMode === 'spectator'
) {
  gameMode = savedGameMode;
}
applyGameMode(gameMode);

const chestUI = new ChestUI(appEl, inventory, itemRegistry, {
  onClose: () => {
    fp.inputBlocked = false;
    void canvas.requestPointerLock();
    void saveAllChestStorages();
  },
});
// New per-position chest storage. Falls back to the legacy single-array
// 'chestStorage' meta if the v2 'chestStorages' meta isn't present, so
// existing saves load their old shared chest contents into the ender chest
// (closest equivalent — was effectively a global shared store).
void persistDB.getMeta('chestStorages').then((saved) => {
  if (
    saved &&
    typeof saved === 'object' &&
    !Array.isArray(saved) &&
    'ender' in (saved as Record<string, unknown>)
  ) {
    const s = saved as { ender?: unknown; byPos?: Record<string, unknown> };
    const ender = restoreChestSlots(s.ender);
    for (let i = 0; i < 27; i++) enderChestStorage[i] = ender[i] ?? null;
    if (s.byPos && typeof s.byPos === 'object') {
      for (const [k, v] of Object.entries(s.byPos)) {
        chestStoragesByPos.set(k, restoreChestSlots(v));
      }
    }
    return;
  }
  // Legacy migration: old single-array chest storage → ender chest store.
  void persistDB.getMeta('chestStorage').then((legacy) => {
    if (!Array.isArray(legacy)) return;
    const restored = restoreChestSlots(legacy);
    for (let i = 0; i < 27; i++) enderChestStorage[i] = restored[i] ?? null;
  });
});

const survivalInv = new SurvivalInventory(
  appEl,
  inventory,
  itemRegistry,
  {
    onClose: () => {
      fp.inputBlocked = false;
      void canvas.requestPointerLock();
    },
    onEat: (id, hungerRestore, saturation) => {
      consumeFoodItem(id, hungerRestore, saturation);
    },
    getHunger: () => playerState.hunger,
  },
  recipeRegistry,
);

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
  // Close button bypasses the keydown handler in main.ts; without an
  // onClose hook the player got stuck with inputBlocked=true.
  onClose: () => {
    fp.inputBlocked = false;
    void canvas.requestPointerLock();
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
    // Pause menu was missing from the early-return chain — pressing E /
    // T / F4 / etc. while paused fired the in-game keybinds (opened
    // inventory, opened chat, cycled gamemode), which made the pause
    // menu inert in the worst way: it looked paused but the player was
    // still mashing through hotkeys behind it. Only ESC should pass
    // through (handled below to close the menu).
    if (pauseMenu.isVisible() && e.code !== 'Escape') return;
    // Death screen had the same passthrough issue — pressing E or T
    // during the death overlay opened inventory or chat over a corpse.
    if (deathScreen.isVisible()) return;
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
        // The creative-inv branch above releases input + relocks pointer,
        // but survival/chest didn't — closing those overlays froze the
        // player in place until they alt-tabbed and clicked back into the
        // canvas.
        fp.inputBlocked = false;
        void canvas.requestPointerLock();
      }
      return;
    }
    if (chestUI.isVisible()) {
      if (e.code === 'Escape' || e.code === 'KeyE') {
        e.preventDefault();
        chestUI.hide();
        fp.inputBlocked = false;
        void canvas.requestPointerLock();
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
      // F7 toggles the doWeatherCycle gamerule (the actual driver in
      // weatherCycle.tick). The old inline autoWeatherEnabled timer
      // ran in parallel — two random weather pickers fighting each
      // other every few minutes.
      gameRules.doWeatherCycle = !gameRules.doWeatherCycle;
      void persistDB.setMeta('gameRules', gameRules);
      toast.show(`Auto weather: ${gameRules.doWeatherCycle ? 'on' : 'off'}`, '#a0d0ff', 1200);
    }
    if (e.code === 'F9') {
      e.preventDefault();
      compassBarVisible = !compassBarVisible;
      if (compassBarVisible) compassBar.show();
      else compassBar.hide();
      toast.show(`Compass: ${compassBarVisible ? 'on' : 'off'}`, '#cccccc', 1000);
    }
    if (e.code === 'KeyC' && !e.repeat) {
      e.preventDefault();
      zoomHeld = true;
      fp.setBaseFov(30);
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
      a.download = screenshotFilename(new Date());
      a.click();
      chatInput.addLine(`Screenshot saved: ${a.download}`, '#d0ff80');
    }
    if (e.code === 'KeyB') {
      e.preventDefault();
      // Bed-less sleep shortcut. Allowed in creative as a quick way to skip
      // night while building. In survival/adventure it would be a cheat —
      // players should actually find/place a bed and sleep through it
      // (vanilla also permanently locks night-skip behind a real bed).
      if (gameMode !== 'creative') {
        chatInput.addLine('Use a bed to sleep.', '#ffd080');
        return;
      }
      if (!dayNight.isDay) {
        dayNight.setTimeOfDayTicks(1000);
        chatInput.addLine('You slept through the night.', '#d0d0ff');
        sfx.play('click');
        lastSleepDay = dayCounter;
      } else {
        chatInput.addLine('You can only sleep at night.', '#ffd080');
      }
      return;
    }
    if (e.code === 'KeyQ') {
      e.preventDefault();
      if (gameMode !== 'survival' && gameMode !== 'adventure') return;
      // Drop the EXACT held stack — modify inventory.hotbar[selected]
      // directly. inventory.remove() iterates from slot 0 up, so it would
      // happily drop a different pickaxe (with full durability) instead of
      // the one in your hand if you had spares. It also wiped per-stack
      // damage state because remove() searches by itemId only.
      const slotIdx = inventory.selectedHotbar;
      const stk = inventory.hotbar[slotIdx];
      if (!stk || stk.count <= 0) return;
      const itemDef = itemRegistry.get(stk.itemId);
      const dropCount = e.shiftKey ? stk.count : 1;
      const actualCount = Math.min(dropCount, stk.count);
      const remaining = stk.count - actualCount;
      inventory.hotbar[slotIdx] = remaining > 0 ? { ...stk, count: remaining } : null;
      const look = fp.lookVector();
      const color: readonly [number, number, number] =
        itemDef.blockId !== undefined ? registry.get(itemDef.blockId).color : [180, 130, 100];
      droppedItems.spawn(
        fp.position.x + look.x * 1.2,
        fp.position.y,
        fp.position.z + look.z * 1.2,
        { itemId: stk.itemId, count: actualCount, color, damage: stk.damage },
        1.5,
      );
      sfx.play('click');
    }
  },
  true,
);

const debugOverlay = new DebugOverlay(appEl);

document.addEventListener('pointerlockchange', () => {
  if (document.pointerLockElement !== canvas) {
    crosshair.hide();
    if (
      !mainMenu.isVisible() &&
      !pauseMenu.isVisible() &&
      !chatInput.isOpen() &&
      !settingsPanel.isVisible() &&
      !resourcePackLoader.isVisible() &&
      !creativeInv.isVisible() &&
      !survivalInv.isVisible() &&
      !chestUI.isVisible() &&
      // Death screen owns the modal stack while it's up — auto-showing
      // the pause menu over it would stack two overlays and the player
      // couldn't reach either's button.
      !deathScreen.isVisible()
    ) {
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
  // Cap mesh re-builds per frame to keep the main thread responsive.
  // Budget mirrors loader chunk-upload budget; default 6, dropped to 1-3 by potato preset.
  const budget = Math.max(1, loader.perFrameBudget * 3);
  let dispatched = 0;
  for (const chunk of world.chunks()) {
    if (chunk.meshDirty.size === 0) continue;
    if (dispatched >= budget) break;
    const dirty = Array.from(chunk.meshDirty);
    // Sort so closer-to-player sections process first.
    const px = fp.position.x,
      py = fp.position.y,
      pz = fp.position.z;
    dirty.sort((a, b) => {
      const dxA = chunk.cx * 16 - px,
        dzA = chunk.cz * 16 - pz,
        dyA = a * 16 - py;
      const dxB = chunk.cx * 16 - px,
        dzB = chunk.cz * 16 - pz,
        dyB = b * 16 - py;
      return dxA * dxA + dyA * dyA + dzA * dzA - (dxB * dxB + dyB * dyB + dzB * dzB);
    });
    for (const cy of dirty) {
      if (dispatched >= budget) break;
      (chunk.meshDirty as Set<number>).delete(cy);
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
      dispatched++;
    }
  }
}

const onUnload = (cx: number, cz: number): void => {
  for (let cy = 0; cy < 24; cy++) chunkRenderer.remove(cx, cy, cz);
  lightCache.delete(lightKey(cx, cz));
};

function snapshotStack(stack: ItemStack | null): PersistedItemStack | null {
  if (!stack) return null;
  const def = itemRegistry.get(stack.itemId);
  if (!def) return null;
  return { name: def.name, count: stack.count, damage: stack.damage };
}

function snapshotChestSlots(slots: (ItemStack | null)[]): (PersistedItemStack | null)[] {
  return slots.map(snapshotStack);
}
function restoreChestSlots(saved: unknown): (ItemStack | null)[] {
  const out = new Array<ItemStack | null>(27).fill(null);
  if (!Array.isArray(saved)) return out;
  for (let i = 0; i < Math.min(27, saved.length); i++) {
    const v = saved[i];
    if (v && typeof v === 'object' && typeof (v as PersistedItemStack).name === 'string') {
      out[i] = restoreStack(v as PersistedItemStack);
    } else if (v && typeof v === 'object' && typeof (v as ItemStack).itemId === 'number') {
      // Legacy save (numeric itemId) — keep as-is so existing chests don't
      // disappear; gets re-persisted in name form on next close.
      out[i] = v as ItemStack;
    }
  }
  return out;
}
// Snapshot every per-position chest plus the shared ender-chest store.
// Empty-everywhere chests are skipped to keep the saved blob small.
function saveAllChestStorages(): Promise<void> {
  const byPos: Record<string, (PersistedItemStack | null)[]> = {};
  for (const [k, slots] of chestStoragesByPos) {
    if (slots.every((s) => s === null)) continue;
    byPos[k] = snapshotChestSlots(slots);
  }
  return persistDB.setMeta('chestStorages', {
    version: 2,
    ender: snapshotChestSlots(enderChestStorage),
    byPos,
  });
}

function snapshotInventory(): PersistedInventory {
  return {
    hotbar: inventory.hotbar.map(snapshotStack),
    main: inventory.main.map(snapshotStack),
    armor: inventory.armor.map(snapshotStack),
    offhand: snapshotStack(inventory.offhand),
    selectedHotbar: inventory.selectedHotbar,
  };
}

function snapshotVitals(): PersistedVitals {
  const effs: PersistedVitals['effects'] = [];
  for (const [id, e] of playerState.effects) {
    effs.push({ id, amplifier: e.amplifier, remainingSec: e.remainingSec });
  }
  return {
    health: playerState.health,
    hunger: playerState.hunger,
    saturation: playerState.saturation,
    breath: playerState.breath,
    xpLevel: playerState.xpLevel,
    xpProgress: playerState.xpProgress,
    exhaustion: playerState.exhaustion,
    absorption: playerState.absorption,
    fireRemainingSec: playerState.fireRemainingSec,
    effects: effs,
  };
}

async function savePlayerNow(): Promise<void> {
  if (!worldMeta) return;
  await persistDB.putPlayer({
    worldId: worldMeta.id,
    position: { x: fp.position.x, y: fp.position.y, z: fp.position.z },
    yaw: fp.yaw,
    pitch: fp.pitch,
    hotbarSlots: [],
    selectedSlot: inventory.selectedHotbar,
    updatedAt: Date.now(),
    inventory: snapshotInventory(),
    vitals: snapshotVitals(),
  });
}

let lastPlayerSaveAt = performance.now();
let fluidTickAccum = 0;
let cropTickAccum = 0;
const FLUID_TICK_SEC = 0.25;
const CROP_TICK_SEC = 1;
const fallableIds = new Set<number>();
for (const name of ['webmc:sand', 'webmc:gravel', 'webmc:red_sand']) {
  const id = registry.byName(name);
  if (id !== undefined) fallableIds.add(id);
}

// Cascading falling-block check: called from touchWorldEdit when a block
// below a fallable-block column is removed. Drops the column one step and
// recursively checks the block above.
function cascadeFalling(bx: number, by: number, bz: number): void {
  // Drop the whole column of fallable blocks above (bx, by, bz) onto the
  // surface below them. Old impl only checked "is the cell directly
  // below air?" which broke after the first drop because the just-dropped
  // sand became "the cell below" for the next iteration — so only the
  // bottom block in a stack ever fell, instead of the whole pile.
  let dropTarget = by; // first known air cell to drop the next solid into
  let y = by + 1;
  while (y < CHUNK_HEIGHT) {
    const s = world.get(bx, y, bz);
    if (s === AIR) {
      // Found another air pocket — future sands above can fall further.
      // dropTarget stays the same; we still want the next sand to land
      // on the lowest empty cell, which is dropTarget.
      y++;
      continue;
    }
    if (!fallableIds.has(stateId(s))) break;
    if (dropTarget >= y) break; // no air below — pile is already settled
    world.set(bx, dropTarget, bz, s);
    world.set(bx, y, bz, AIR);
    dropTarget++;
    y++;
  }
}

const perfMonitor = new PerfMonitor({
  startQuality: isMobileDevice ? 4 : 8,
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
    void saveAllChestStorages();
    void persistDB.setMeta('playerStats', playerStats);
    void persistDB.setMeta('timeOfDay', dayNight.timeOfDay);
    void persistDB.setMeta('dayCounter', dayCounter);
    void persistDB.setMeta('fluidCells', fluidWorld.serialize());
    saveHotbarIfChanged();
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
  void saveAllChestStorages();
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
    // Use the persisted player name (was always 'Player' so every peer
    // showed up nameless in chat).
    name: currentPlayerName,
    onRoom: (code) => {
      roomCode = code;
    },
    onError: (msg) => {
      console.warn('[webmc] mp error:', msg);
      // Surface to the in-game chat too — was console-only so peers had
      // no idea why a connection silently failed.
      chatInput.addLine(`✗ multiplayer: ${msg}`, '#ff8080');
    },
    onChat: (from, text) => {
      console.log(`[chat ${from}]`, text);
      // Was only logging to the dev console; remote chat messages never
      // appeared in the actual chat panel, so multiplayer chat was a
      // one-way silence from the receiver's perspective.
      chatInput.addLine(`<${from}> ${text}`, '#80c0ff');
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
  primedTnt.push({ bx, by, bz, remainingSec: 4 }); // MC canonical 4s fuse
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

// dropsAfterBlast wraps explosion_block_drop helper for explicit MC behavior.
function explosionDrops(power: number): boolean {
  return Math.random() < 1 / Math.max(1, power);
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
        // Chest-style block destroyed by explosion: dump its contents
        // before the world.set wipes it. Without this, a creeper next to
        // a chest deleted every item inside silently — the chestStoragesByPos
        // entry stayed orphaned at a position with no chest.
        const isChestBlock =
          def2.name === 'webmc:chest' ||
          def2.name === 'webmc:trapped_chest' ||
          def2.name === 'webmc:barrel' ||
          def2.name.endsWith('_shulker_box') ||
          def2.name === 'webmc:shulker_box';
        if (isChestBlock) {
          const k = chestKey(x, y, z);
          const slots = chestStoragesByPos.get(k);
          if (slots) {
            for (const stk of slots) {
              if (!stk || stk.count <= 0) continue;
              const itemDef = itemRegistry.get(stk.itemId);
              const colorRgb =
                itemDef.blockId !== undefined
                  ? registry.get(itemDef.blockId).color
                  : ([200, 200, 200] as const);
              droppedItems.spawn(
                x + 0.5,
                y + 0.5,
                z + 0.5,
                { itemId: stk.itemId, count: stk.count, color: colorRgb, damage: stk.damage },
                3,
              );
            }
            chestStoragesByPos.delete(k);
          }
        }
        world.set(x, y, z, airState);
        if (explosionDrops(radius)) {
          blockParticles.emitBreak(x, y, z, def2.color);
          // Use the same drop registry the regular break path uses so
          // stone → cobblestone, ores → raw items, glass → nothing
          // (silk-touch only). Old code dropped the block-item directly,
          // which gave players "stone block" item from an explosion when
          // vanilla would've dropped cobblestone.
          const drops = dropRegistry.drops(id2, undefined, 99);
          for (const s of drops) {
            droppedItems.spawn(
              x + 0.5,
              y + 0.5,
              z + 0.5,
              { itemId: s.itemId, count: s.count, color: def2.color },
              3,
            );
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
  // Damage and knockback the player. Vanilla MC explosion damage scales
  // by ((1 - dist/(2*r)) * (2*r) + 1) ^ 2 / 2 with armor mitigation;
  // simplified here as linear falloff with a 7HP-at-zero peak for radius 4
  // (TNT) → 14HP for radius 5 (charged creeper). Pre-fix the player took
  // zero damage from explosions; you could stand on top of a creeper and
  // walk away with full HP after blocks vanished underfoot.
  if (gameMode === 'survival' || gameMode === 'adventure') {
    const dx = fp.position.x - (bx + 0.5);
    const dy = fp.position.y - (by + 0.5);
    const dz = fp.position.z - (bz + 0.5);
    const dist = Math.hypot(dx, dy, dz);
    const blastRange = radius * 2;
    if (dist < blastRange) {
      const fall = 1 - dist / blastRange;
      const baseDmg = fall * (2 * radius) + 1;
      const dmg = (baseDmg * baseDmg) / 2;
      const armorPts = computeArmorPoints();
      const toughnessPts = computeArmorToughness();
      const finalDmg = armorPts > 0 ? armorReducedDamage(dmg, armorPts, toughnessPts) : dmg;
      playerState.takeDamage({ amount: finalDmg, source: 'explosion' });
      if (armorPts > 0) consumeArmorDurability(dmg);
      // Knockback away from blast center.
      if (dist > 0.0001) {
        const KB = fall * 14;
        fp.velocity.x += (dx / dist) * KB;
        fp.velocity.y += (dy / Math.max(0.1, Math.abs(dy))) * KB * 0.5 + 4;
        fp.velocity.z += (dz / dist) * KB;
      }
    }
  }
  // Damage nearby mobs too — a creeper next to a sheep was just shoving
  // the sheep, never killing it.
  for (const m of mobWorld.all()) {
    const dx = m.position.x - (bx + 0.5);
    const dy = m.position.y - (by + 0.5);
    const dz = m.position.z - (bz + 0.5);
    const dist = Math.hypot(dx, dy, dz);
    const blastRange = radius * 2;
    if (dist >= blastRange) continue;
    const fall = 1 - dist / blastRange;
    const baseDmg = fall * (2 * radius) + 1;
    const dmg = (baseDmg * baseDmg) / 2;
    mobWorld.damage(m.id, dmg);
    if (dist > 0.0001) {
      const KB = fall * 14;
      m.velocity.x += (dx / dist) * KB;
      m.velocity.z += (dz / dist) * KB;
      m.velocity.y = Math.max(m.velocity.y, fall * 8);
    }
  }
}

function oreXp(blockName: string): number {
  return xpForOre(blockName.replace(/^webmc:/, ''), Math.random, false);
}

function spawnMobDrops(kind: string, pos: { x: number; y: number; z: number }): void {
  const lookup = (name: string): number | undefined => itemRegistry.byName(`webmc:${name}`);
  const dropTables: Record<
    string,
    readonly { name: string; min: number; max: number; color: readonly [number, number, number] }[]
  > = {
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
    wolf: [],
    enderman: [{ name: 'ender_pearl', min: 0, max: 1, color: [40, 130, 100] }],
    ghast: [
      { name: 'ghast_tear', min: 0, max: 1, color: [220, 220, 220] },
      { name: 'gunpowder', min: 0, max: 2, color: [90, 90, 90] },
    ],
    blaze: [{ name: 'blaze_rod', min: 0, max: 1, color: [240, 180, 40] }],
    piglin: [
      { name: 'rotten_flesh', min: 0, max: 1, color: [110, 80, 60] },
      { name: 'gold_nugget', min: 0, max: 1, color: [240, 230, 100] },
    ],
    wither_skeleton: [
      { name: 'bone', min: 0, max: 2, color: [230, 225, 210] },
      { name: 'coal', min: 0, max: 1, color: [40, 40, 40] },
    ],
    rabbit: [
      { name: 'rabbit', min: 0, max: 1, color: [200, 160, 130] },
      { name: 'rabbit_hide', min: 0, max: 1, color: [180, 140, 110] },
    ],
    fox: [],
    horse: [{ name: 'leather', min: 0, max: 2, color: [130, 90, 60] }],
    bee: [],
    cat: [{ name: 'string', min: 0, max: 2, color: [230, 230, 230] }],
    parrot: [{ name: 'feather', min: 1, max: 2, color: [250, 250, 250] }],
    witch: [
      { name: 'glass_bottle', min: 0, max: 2, color: [220, 240, 250] },
      { name: 'redstone', min: 0, max: 2, color: [200, 30, 30] },
      { name: 'gunpowder', min: 0, max: 2, color: [90, 90, 90] },
    ],
    husk: [{ name: 'rotten_flesh', min: 0, max: 2, color: [110, 80, 60] }],
    drowned: [
      { name: 'rotten_flesh', min: 0, max: 1, color: [110, 80, 60] },
      { name: 'copper_ingot', min: 0, max: 1, color: [180, 100, 70] },
    ],
    stray: [
      { name: 'bone', min: 0, max: 2, color: [230, 225, 210] },
      { name: 'arrow', min: 0, max: 2, color: [200, 190, 160] },
    ],
    bogged: [
      { name: 'bone', min: 0, max: 2, color: [230, 225, 210] },
      { name: 'arrow', min: 0, max: 2, color: [200, 190, 160] },
    ],
    breeze: [
      { name: 'wind_charge', min: 0, max: 2, color: [200, 220, 255] },
      { name: 'breeze_rod', min: 0, max: 1, color: [180, 220, 255] },
    ],
    armadillo: [{ name: 'armadillo_scute', min: 0, max: 1, color: [180, 140, 110] }],
    sniffer: [],
    dolphin: [{ name: 'cod', min: 0, max: 1, color: [196, 160, 106] }],
    cod: [{ name: 'cod', min: 1, max: 1, color: [196, 160, 106] }],
    salmon: [{ name: 'salmon', min: 1, max: 1, color: [208, 106, 74] }],
    pufferfish: [{ name: 'pufferfish', min: 1, max: 1, color: [255, 215, 70] }],
    tropical_fish: [{ name: 'tropical_fish', min: 1, max: 1, color: [255, 128, 64] }],
    squid: [{ name: 'ink_sac', min: 1, max: 3, color: [25, 25, 25] }],
    glow_squid: [{ name: 'glow_ink_sac', min: 1, max: 3, color: [80, 230, 220] }],
    magma_cube: [{ name: 'magma_cream', min: 0, max: 1, color: [220, 90, 50] }],
    slime: [{ name: 'slime_ball', min: 0, max: 2, color: [120, 220, 100] }],
    silverfish: [],
    cave_spider: [
      { name: 'string', min: 0, max: 2, color: [230, 230, 230] },
      { name: 'spider_eye', min: 0, max: 1, color: [120, 30, 30] },
    ],
    phantom: [{ name: 'phantom_membrane', min: 0, max: 1, color: [200, 180, 220] }],
    mooshroom: [
      { name: 'raw_beef', min: 1, max: 3, color: [180, 60, 60] },
      { name: 'leather', min: 0, max: 2, color: [130, 90, 60] },
    ],
    panda: [{ name: 'bamboo', min: 0, max: 2, color: [148, 192, 90] }],
    villager: [],
    zombie_villager: [{ name: 'rotten_flesh', min: 0, max: 2, color: [110, 80, 60] }],
    pillager: [
      { name: 'arrow', min: 0, max: 2, color: [200, 190, 160] },
      { name: 'emerald', min: 0, max: 1, color: [80, 220, 120] },
    ],
    vindicator: [{ name: 'emerald', min: 0, max: 1, color: [80, 220, 120] }],
    evoker: [
      { name: 'emerald', min: 0, max: 1, color: [80, 220, 120] },
      { name: 'totem_of_undying', min: 1, max: 1, color: [220, 200, 80] },
    ],
    iron_golem: [
      { name: 'poppy', min: 0, max: 2, color: [220, 30, 30] },
      { name: 'iron_ingot', min: 3, max: 5, color: [220, 220, 220] },
    ],
    snow_golem: [{ name: 'snowball', min: 0, max: 15, color: [240, 250, 255] }],
    zoglin: [],
    hoglin: [
      { name: 'raw_porkchop', min: 1, max: 3, color: [240, 170, 160] },
      { name: 'leather', min: 0, max: 2, color: [130, 90, 60] },
    ],
    strider: [{ name: 'string', min: 2, max: 5, color: [230, 230, 230] }],
    piglin_brute: [{ name: 'gold_nugget', min: 0, max: 1, color: [240, 230, 100] }],
    zombified_piglin: [
      { name: 'rotten_flesh', min: 0, max: 1, color: [110, 80, 60] },
      { name: 'gold_nugget', min: 0, max: 1, color: [240, 230, 100] },
    ],
    warden: [{ name: 'echo_shard', min: 0, max: 0, color: [80, 200, 220] }],
    ender_dragon: [{ name: 'dragon_scale', min: 1, max: 1, color: [60, 50, 80] }],
    wither: [{ name: 'nether_star', min: 1, max: 1, color: [240, 240, 240] }],
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
    const affected: { cx: number; cz: number }[] =
      emitsNew || wasBreak
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
  fpsFrame(fpsStats, stats.frameMs);
  tpsTracker.pushMspt(stats.frameMs);
  currentTickCount++;
  const afkOn = isAfk({ lastInputTick, currentTick: currentTickCount, idleKickEnabled: false });
  if (afkOn !== (afkBadge.style.display === 'block')) {
    afkBadge.style.display = afkOn ? 'block' : 'none';
  }
  const perfMem = (
    performance as Performance & { memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number } }
  ).memory;
  if (perfMem) {
    const lvl = memPressureLevel({
      heapUsed: perfMem.usedJSHeapSize,
      heapLimit: perfMem.jsHeapSizeLimit,
    });
    if (lvl === 'critical' && performance.now() - lastMemoryWarnAt > 30000) {
      lastMemoryWarnAt = performance.now();
      toast.show('High memory pressure — flushing chunks', '#ffd080', 3000);
      void chunkStore.flush();
    }
  }
  const now = performance.now();
  // Paused menus freeze the world tick by zeroing dtSec — every tick
  // call below uses dtSec, so day/night, mobs, breath, weather, fluids,
  // hunger, etc. stop advancing. Rendering still runs to draw the menu.
  // /tick freeze should also pause world systems (vanilla parity), not
  // just mob AI like before.
  const isPaused = pauseMenu.isVisible() || mainMenu.isVisible() || tickFrozen;
  const dtSec = isPaused ? 0 : Math.min(stats.frameMs / 1000, 0.1);
  if (perfMonitor.tick(dtSec)) {
    let qualityLimit = perfMonitor.quality;
    if (isMobileDevice) {
      const powerLimit = maxRenderDistanceChunks(
        {
          batteryLevel: powerState.batteryLevel,
          charging: powerState.charging,
          thermalState: 'nominal',
        },
        false,
      );
      qualityLimit = Math.min(qualityLimit, powerLimit);
    }
    // Thermal-throttle: shrink view radius if FPS p95 < 25 or low battery (chunk_unload_strategy_thermal).
    if (
      inThermalThrottle({
        cpuTempCelsius: 50,
        fpsP95: p95Fps(fpsStats),
        battery: powerState.batteryLevel,
      })
    ) {
      qualityLimit = Math.max(4, qualityLimit - 4);
    }
    loader.setViewRadius(qualityLimit);
    const lowTier = qualityLimit < 4;
    clouds.mesh.visible = !lowTier;
    stars.points.visible = !lowTier;
    if (lowTier && rain.isActive()) rain.setActive(false);
    const basePx = Math.min(window.devicePixelRatio, 1.5);
    const targetPx = lowTier ? Math.min(basePx, 1.0) : basePx;
    if (Math.abs(renderer.getPixelRatio() - targetPx) > 0.01) renderer.setPixelRatio(targetPx);
  }
  if (
    shouldPauseRender({
      batteryLevel: powerState.batteryLevel,
      charging: powerState.charging,
      thermalState: 'nominal',
    })
  ) {
    return;
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
    // Touch sprint: the auto-sprint flag from TouchControls (full-edge
    // forward push) was declared in the input shape but never read into
    // fp.input — touch users could never sprint. Now wired.
    if (touch.state.sprint) fp.input.sprint = true;
  }

  if (gyroYawAccum !== 0) {
    fp.yaw -= gyroYawAccum;
    gyroYawAccum = 0;
  }

  // MC sprint rule: cannot sprint if hunger ≤ 6.
  if (
    fp.input.sprint &&
    playerState.hunger <= 6 &&
    (gameMode === 'survival' || gameMode === 'adventure')
  ) {
    fp.input.sprint = false;
  }
  if (fp.input.sprint && (gameMode === 'survival' || gameMode === 'adventure')) {
    // Sprint exhaustion: 0.1 per meter sprinted. Approximate via dtSec * 5 m/s.
    playerState.addExhaustion(0.1 * dtSec * 5);
  }

  // Gamepad poll (Xbox-style mapping). Honors pointer-lock equivalent: only
  // applies when no menus are open and the player is not in chat.
  if (
    typeof navigator.getGamepads === 'function' &&
    !chatInput.isOpen() &&
    !pauseMenu.isVisible()
  ) {
    const pads = navigator.getGamepads();
    const pad = pads ? Array.from(pads).find((p) => p && p.connected) : null;
    if (pad) {
      const intent = gamepadToIntent({
        axes: [pad.axes[0] ?? 0, pad.axes[1] ?? 0, pad.axes[2] ?? 0, pad.axes[3] ?? 0],
        buttons: pad.buttons.map((b) => b.pressed),
      });
      if (intent.forward !== 0 || intent.strafe !== 0) {
        fp.input.forward = intent.forward;
        fp.input.strafe = intent.strafe;
      }
      if (intent.jump) fp.input.jump = true;
      if (intent.sneak) fp.input.sneak = true;
      const lookSens = 0.04;
      fp.yaw -= intent.look.yaw * lookSens;
      fp.pitch -= intent.look.pitch * lookSens;
      fp.pitch = Math.max(-Math.PI / 2 + 0.001, Math.min(Math.PI / 2 - 0.001, fp.pitch));
    }
  }

  fp.update(dtSec, { isSolid, isFluid, isClimbable });
  if (touch) {
    if (touch.state.primary && gameMode === 'spectator') {
      // Spectator can't attack/break — same gate as the desktop attack
      // handler, otherwise tap-to-break would still work via the
      // setHeld('break') fallback.
      interaction.setHeld(null);
    } else if (touch.state.primary) {
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
          // Touch attacks used to deal a flat 2 damage no matter what — an
          // iron sword tap and a bare-hand tap killed mobs at the same
          // rate. Now match the desktop formula (weapon tier × charge ×
          // strength/weakness/crit), but with charge=1 (no charge meter on
          // mobile) and no critical (no falling/airborne tap on touch).
          const heldName = heldNameLower();
          const weaponBase = weaponBaseDamageFor(heldName);
          const strengthEff = playerState.effects.get('strength');
          const weaknessEff = playerState.effects.get('weakness');
          const strengthBonus = strengthEff ? 3 * (strengthEff.amplifier + 1) : 0;
          const weaknessReduce = weaknessEff ? -4 * (weaknessEff.amplifier + 1) : 0;
          const dmg = Math.max(0, weaponBase + strengthBonus + weaknessReduce);
          const result = mobWorld.damage(bestId, dmg);
          // Touch combat durability + exhaustion (parity with desktop).
          if (gameMode === 'survival' || gameMode === 'adventure') {
            playerState.addExhaustion(0.1);
            if (
              heldName.includes('sword') ||
              heldName.includes('mace') ||
              heldName.includes('trident')
            ) {
              consumeHeldToolDurability(1);
            } else if (
              heldName.includes('pickaxe') ||
              heldName.includes('axe') ||
              heldName.includes('shovel') ||
              heldName.includes('hoe')
            ) {
              consumeHeldToolDurability(2);
            }
          }
          sfx.play('hit');
          screenShake.pulse(0.15);
          // Touch attacks were missing the hand swing animation that
          // desktop's left-click attack path includes. Mobile players got
          // no visual feedback when they tapped a mob.
          hand.swing();
          if (result)
            damageNumbers.spawn(result.position.x, result.position.y + 0.8, result.position.z, dmg);
          // Touch knockback was missing — mobs took damage but didn't
          // get pushed back, so they could grind through the player
          // without ever losing tempo.
          const mobHit = Array.from(mobWorld.all()).find((m) => m.id === bestId);
          if (mobHit) {
            const kb = computeKnockback({
              attackerPos: { x: fp.position.x, y: fp.position.y, z: fp.position.z },
              targetPos: { x: mobHit.position.x, y: mobHit.position.y, z: mobHit.position.z },
              sprinting: fp.input.sprint,
              knockbackLevel: 0,
              knockbackResistance: 0,
            });
            const KB_SCALE = 12;
            mobHit.velocity.x += kb.x * KB_SCALE;
            mobHit.velocity.z += kb.z * KB_SCALE;
            mobHit.velocity.y = Math.max(mobHit.velocity.y, kb.y * KB_SCALE);
          }
          if (result?.killed) {
            spawnMobDrops(result.kind, result.position);
            // Touch kills used to drop a flat 3 × 1-XP orbs instead of
            // the per-mob XP roll + chunked split that desktop uses.
            const xpAmount = rollMobXp({
              source: { kind: 'mob', mob: result.kind },
              rng: Math.random,
            });
            for (const chunk of splitXp(xpAmount)) {
              xpOrbs.spawn(
                result.position.x + (Math.random() - 0.5) * 0.3,
                result.position.y + 0.8,
                result.position.z + (Math.random() - 0.5) * 0.3,
                chunk,
              );
            }
            blockParticles.emitBreak(
              Math.floor(result.position.x),
              Math.floor(result.position.y),
              Math.floor(result.position.z),
              [180, 40, 40],
            );
            playerStats.mobsKilled++;
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
            blockParticles.emitPlace(px + dx + 0.5, py + dy + 0.9, pz + dz + 0.5, [255, 235, 140]);
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
  // Auto weather cycle (gated by gamerule). The old parallel
  // autoWeatherEnabled / weatherTimer block was removed — it raced with
  // weatherCycle.tick below, picking conflicting weather every few minutes.
  if (gameRules.doWeatherCycle) {
    const weatherChanged = weatherCycle.tick(dtSec);
    if (weatherChanged && currentWeather !== weatherChanged) {
      setWeather(weatherChanged);
      chatInput.addLine(`Weather changes to ${weatherChanged}.`, '#a8c8ff');
    }
  }

  if (currentWeather === 'thunder') {
    lightningTimer -= dtSec;
    if (lightningTimer <= 0) {
      lightningFlash();
      // 25% chance to strike a random mob within 32 blocks: charge creepers, convert pigs.
      const strikeCandidates = Array.from(mobWorld.all()).filter((m) => {
        const dx = m.position.x - fp.position.x;
        const dz = m.position.z - fp.position.z;
        return dx * dx + dz * dz < 32 * 32;
      });
      if (strikeCandidates.length > 0 && Math.random() < 0.25) {
        const target = strikeCandidates[Math.floor(Math.random() * strikeCandidates.length)];
        if (target) {
          subtitles.push(`Lightning struck ${target.def.kind}`);
          if (target.def.kind === 'pig') {
            try {
              mobWorld.spawn('zombified_piglin', target.position);
              mobWorld.remove(target.id);
            } catch {
              /* zombified_piglin not registered */
            }
          } else if (target.def.kind === 'creeper') {
            // Mark for charged behavior; webmc doesn't track charged state, so just damage as visual.
            mobWorld.damage(target.id, 5);
          } else {
            mobWorld.damage(target.id, 5);
          }
        }
      }
      lightningTimer = 20 + Math.random() * 40;
    }
  } else {
    lightningTimer = 15 + Math.random() * 30;
  }
  clouds.update(dtSec, fp.position.x, fp.position.z, currentWeather);
  sky.update(fp.position, dayNight.sunDir);
  stars.update(fp.position, dayNight.sunDir.y);
  const horizSpeed = Math.hypot(fp.velocity.x, fp.velocity.z);
  // Surface-aware footsteps: pick material from block under feet.
  let stepMat:
    | 'wood'
    | 'stone'
    | 'gravel'
    | 'grass'
    | 'sand'
    | 'snow'
    | 'wool'
    | 'metal'
    | 'water'
    | undefined;
  if (fp.onGround) {
    const fname = registry.get(
      stateId(
        world.get(
          Math.floor(fp.position.x),
          Math.floor(fp.position.y - 1.05),
          Math.floor(fp.position.z),
        ),
      ),
    ).name;
    if (fname.includes('log') || fname.includes('plank')) stepMat = 'wood';
    else if (fname.includes('stone') || fname.includes('cobble') || fname.includes('brick'))
      stepMat = 'stone';
    else if (fname.includes('gravel')) stepMat = 'gravel';
    else if (fname.includes('sand')) stepMat = 'sand';
    else if (fname.includes('snow')) stepMat = 'snow';
    else if (fname.includes('wool')) stepMat = 'wool';
    else if (fname.includes('iron') || fname.includes('gold') || fname.includes('copper'))
      stepMat = 'metal';
    else if (fname.includes('grass') || fname.includes('dirt')) stepMat = 'grass';
  } else if (fp.inFluid === 'water') {
    stepMat = 'water';
  }
  sfx.footstepIfMoving(fp.onGround && horizSpeed > 1.2 && !fp.input.fly, dtSec, stepMat);
  // MC-style jump exhaustion: 0.05 normal, 0.2 sprint-jump.
  if (
    prevOnGround &&
    !fp.onGround &&
    fp.velocity.y > 0 &&
    (gameMode === 'survival' || gameMode === 'adventure')
  ) {
    playerState.addExhaustion(fp.input.sprint ? 0.2 : 0.05);
  }
  // Track airborne peak Y for mace smash damage calc.
  if (fp.onGround) maceFallStartY = fp.position.y;
  else if (fp.position.y > maceFallStartY) maceFallStartY = fp.position.y;
  prevOnGround = fp.onGround;
  // Swim exhaustion: 0.01 per meter swum.
  if (fp.inFluid === 'water' && (gameMode === 'survival' || gameMode === 'adventure')) {
    playerState.addExhaustion(0.01 * horizSpeed * dtSec);
  }
  // Turtle Shell helmet: 10s of Water Breathing on emerging from water.
  const inWater = fp.inFluid === 'water';
  if (prevInWater && !inWater) {
    const helmetItem = inventory.armor[0];
    if (helmetItem && itemRegistry.get(helmetItem.itemId).name === 'webmc:turtle_shell') {
      playerState.applyEffect('water_breathing', 0, 10);
    }
  }
  prevInWater = inWater;
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
  if (gameRules.doDaylightCycle) dayNight.tick(dtSec);
  timeSaveAccum += dtSec;
  if (timeSaveAccum > 10) {
    timeSaveAccum = 0;
    void persistDB.setMeta('timeOfDay', dayNight.timeOfDay);
    saveHotbarIfChanged();
  }
  if (lightningFlashSec > 0) lightningFlashSec = Math.max(0, lightningFlashSec - dtSec);
  const flashBoost = lightningFlashSec > 0 ? Math.min(1, lightningFlashSec / 0.18) * 0.7 : 0;
  const weatherDimming =
    (currentWeather === 'thunder' ? 0.5 : currentWeather === 'rain' ? 0.7 : 1.0) + flashBoost;
  tmpSkyColor.copy(dayNight.skyColor).multiplyScalar(weatherDimming);
  tmpFogColor.copy(dayNight.fogColor).multiplyScalar(weatherDimming);
  // Biome sky/fog tint: subtle blend of biome palette toward the day-night base.
  const biomeId = generator.biomeAt(Math.floor(fp.position.x), Math.floor(fp.position.z));
  const biomeName = biomeId === 1 ? 'forest' : 'plains';
  const biomePalette = skyOf(biomeName);
  const TINT = 0.18;
  tmpSkyColor.r = tmpSkyColor.r * (1 - TINT) + (biomePalette.sky[0] / 255) * TINT;
  tmpSkyColor.g = tmpSkyColor.g * (1 - TINT) + (biomePalette.sky[1] / 255) * TINT;
  tmpSkyColor.b = tmpSkyColor.b * (1 - TINT) + (biomePalette.sky[2] / 255) * TINT;
  tmpFogColor.r = tmpFogColor.r * (1 - TINT) + (biomePalette.fog[0] / 255) * TINT;
  tmpFogColor.g = tmpFogColor.g * (1 - TINT) + (biomePalette.fog[1] / 255) * TINT;
  tmpFogColor.b = tmpFogColor.b * (1 - TINT) + (biomePalette.fog[2] / 255) * TINT;
  const skyColor = tmpSkyColor;
  const fogColor = tmpFogColor;
  const uniforms = chunkRenderer.material.uniforms;
  (uniforms['uSunDir'] as { value: THREE.Vector3 }).value.copy(dayNight.sunDir);
  (uniforms['uSkyColor'] as { value: THREE.Color }).value.copy(skyColor);
  const nightVision = playerState.effects.has('night_vision') ? 0.5 : 0;
  (uniforms['uAmbient'] as { value: number }).value =
    (dayNight.ambient + nightVision) * weatherDimming * brightnessMul;
  // Speed effect adjusts walk speed (amplifier 0 = +20%, 1 = +40%, ...)
  const speedEff = playerState.effects.get('speed');
  const slowEff = playerState.effects.get('slowness');
  let mul = 1;
  if (speedEff) mul *= 1 + 0.2 * (speedEff.amplifier + 1);
  if (slowEff) mul *= Math.max(0.15, 1 - 0.15 * (slowEff.amplifier + 1));
  fp.speedMultiplier = mul;
  // Speed/Slowness FOV bonus: ±~5° per amplifier level (multiplicative on baseFov).
  const baseFovDeg = (fp.camera.userData['baseFov'] as number | undefined) ?? 70;
  const speedLevel =
    (speedEff ? speedEff.amplifier + 1 : 0) - (slowEff ? slowEff.amplifier + 1 : 0);
  fp.setEffectFovBoost(baseFovDeg * 0.05 * speedLevel);
  const jumpEff = playerState.effects.get('jump_boost');
  fp.jumpVelocityMultiplier = jumpEff ? 1 + 0.4 * (jumpEff.amplifier + 1) : 1;
  // Levitation: forces player upward at 0.9 m/s per level (MC: 0.9 blocks/sec).
  const levitation = playerState.effects.get('levitation');
  if (levitation) {
    fp.velocity.y = Math.max(fp.velocity.y, 0.9 * (levitation.amplifier + 1));
  }
  // Nausea: FOV wobble for visual disorientation.
  const nausea = playerState.effects.get('nausea');
  if (nausea) {
    const intensity = Math.min(1, 0.4 * (nausea.amplifier + 1));
    const wobble = Math.sin(performance.now() / 200) * 0.1 * intensity;
    fp.camera.fov = Math.max(30, Math.min(179, fp.camera.fov * (1 + wobble)));
    fp.camera.updateProjectionMatrix();
  }
  (uniforms['uFogColor'] as { value: THREE.Color }).value.copy(fogColor);
  (uniforms['uCameraPosW'] as { value: THREE.Vector3 }).value.copy(fp.position);
  scene.background = skyColor;
  if (scene.fog instanceof THREE.Fog) scene.fog.color.copy(fogColor);

  const loaderStats = loader.update(
    fp.position.x,
    fp.position.z,
    onUnload,
    onLoad,
    fp.velocity.x,
    fp.velocity.z,
  );

  syncVisibleHotbarFromInventory();
  const placeable = placeableFromSlot(hotbar.selectedIndex);
  if (placeable) {
    interaction.selectedBlock = placeable.state;
    hand.setHeldBlockColor(registry.get(placeable.blockId).color);
  } else {
    interaction.selectedBlock = AIR;
    // Holding a tool/food in survival — neutral hand color so the cube
    // doesn't visually lie about being something placeable.
    hand.setHeldBlockColor([180, 130, 100]);
  }
  hand.update(dtSec);
  interaction.tick(now);

  if (gameMode === 'creative') {
    hotbar.setCounts([], 'infinite');
  } else {
    // Visible hotbar mirrors inventory.hotbar in survival/adventure, so the
    // count under each slot is just that slot's stack count, not the all-
    // inventory total of the entry's name (which used to double-count).
    const counts: number[] = [];
    for (let i = 0; i < 9; i++) counts.push(inventory.hotbar[i]?.count ?? 0);
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
  const invisible = playerState.effects.has('invisibility');
  // Spectators are invisible in vanilla — without this, the third-person
  // body still rendered while in spectator mode, which broke the ghost
  // illusion (you could see your own body floating through walls).
  playerAvatar.setVisible(cameraMode !== 'fp' && !invisible && gameMode !== 'spectator');
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
  // Drowning is gated by what's at eye level, not the body center —
  // walking through 1-deep water shouldn't drain breath. Creative +
  // spectator skip vital drains (hunger, breath) entirely.
  const vitalsActive = gameMode === 'survival' || gameMode === 'adventure';
  playerState.tick(dtSec, { inFluid: fp.inFluidEyes, drainHunger: vitalsActive });
  // Elytra glide: chestplate slot has elytra + falling + jump held → slow descent + forward thrust.
  {
    const chest = inventory.armor[1];
    const chestName = chest ? itemRegistry.get(chest.itemId).name : '';
    const wearingElytra = chestName === 'webmc:elytra';
    isGliding =
      wearingElytra && !fp.onGround && !fp.input.fly && fp.velocity.y < 0 && fp.input.jump;
    if (wearingElytra && !fp.onGround && !fp.input.fly && fp.velocity.y < 0 && fp.input.jump) {
      const look = fp.lookVector();
      // Slow descent: clamp downward velocity.
      const minFallY = -3 + look.y * 8;
      if (fp.velocity.y < minFallY) fp.velocity.y = fp.velocity.y * 0.7 + minFallY * 0.3;
      // Forward thrust along look horizontal.
      const horiz = Math.hypot(look.x, look.z);
      if (horiz > 0.001) {
        const speedFactor = 8 + Math.max(0, -look.y) * 12;
        fp.velocity.x = fp.velocity.x * 0.85 + (look.x / horiz) * speedFactor * 0.15;
        fp.velocity.z = fp.velocity.z * 0.85 + (look.z / horiz) * speedFactor * 0.15;
      }
      // Drain durability ~1/sec. Skip in creative — vanilla creative
      // elytra never wears out so unlimited cosmetic gliding works.
      if (gameMode !== 'creative' && Math.random() < dtSec) {
        const newDamage = (chest?.damage ?? 0) + 1;
        const def = itemRegistry.get(inventory.armor[1]!.itemId);
        if (newDamage >= def.durability) {
          inventory.armor[1] = null;
          chatInput.addLine('Your elytra broke!', '#ff8080');
        } else {
          inventory.armor[1] = { ...inventory.armor[1]!, damage: newDamage };
        }
      }
    }
  }
  // Walking through fire ignites the player (8s burn).
  if (
    (gameMode === 'survival' || gameMode === 'adventure') &&
    !playerState.effects.has('fire_resistance')
  ) {
    const fpx = Math.floor(fp.position.x);
    const fpz = Math.floor(fp.position.z);
    for (let dy = 0; dy <= 1; dy++) {
      const s = world.get(fpx, Math.floor(fp.position.y) + dy, fpz);
      if (s !== AIR && registry.get(stateId(s)).name === 'webmc:fire') {
        playerState.fireRemainingSec = Math.max(playerState.fireRemainingSec, 8);
        break;
      }
    }
  }

  if (
    fp.lastLandFallBlocks > 3 &&
    (gameMode === 'survival' || gameMode === 'adventure') &&
    gameRules.fallDamage
  ) {
    const slowFalling = playerState.effects.has('slow_falling');
    let dmg = slowFalling ? 0 : fp.lastLandFallBlocks - 3;
    // Vanilla MC: landing in water (or while underwater) cancels all
    // fall damage. fp.inFluid is sampled at body center, so even shallow
    // water counts. Without this, jumping into a 1-block pool from a
    // 30-block tower still killed the player.
    if (fp.inFluid === 'water') dmg = 0;
    // Surface mitigation: hay bale and honey block reduce fall damage to 20% (slime to 0).
    const fx = Math.floor(fp.position.x);
    const fy = Math.floor(fp.position.y - 1.05);
    const fz = Math.floor(fp.position.z);
    const landDef = registry.get(stateId(world.get(fx, fy, fz)));
    if (landDef.name === 'webmc:hay_block' || landDef.name === 'webmc:honey_block') {
      dmg = Math.floor(dmg * 0.2);
    } else if (landDef.name === 'webmc:slime_block') {
      dmg = 0;
    }
    if (dmg > 0) playerState.takeDamage({ amount: dmg, source: 'fall' });
  }
  fp.lastLandFallBlocks = 0;

  if (fp.position.y < -64 && (gameMode === 'survival' || gameMode === 'adventure')) {
    // Vanilla: 4 dmg per game tick (20Hz) ≈ 80 dmg/s. takeDamage's
    // i-frame bypass for 'void' was firing every render frame instead,
    // so at 60FPS we were applying 240 dmg/s — enough to instantly
    // erase totem-of-undying revivals via the same-frame re-damage.
    playerState.takeDamage({ amount: 80 * dtSec, source: 'void' });
  }

  if (gameMode === 'survival' || gameMode === 'adventure') {
    const wb = checkWorldBorder(worldBorder, fp.position.x, fp.position.z);
    if (!wb.insideBorder && wb.damagePerSec > 0) {
      playerState.takeDamage({ amount: wb.damagePerSec * dtSec, source: 'void' });
    }
  }

  if (gameMode === 'survival' || gameMode === 'adventure') {
    // Suffocation when the head cell is solid. position.y is the body
    // center (halfY=0.9), eyes ~0.72 above (eyeHeight 1.62 from feet).
    // The previous +1.55 was a full cell ABOVE the head — suffocation
    // never fired when a block was placed where the player's head was.
    const headX = Math.floor(fp.position.x);
    const headY = Math.floor(fp.position.y + 0.72);
    const headZ = Math.floor(fp.position.z);
    if (isSolid(headX, headY, headZ)) {
      playerState.takeDamage({ amount: 1 * dtSec, source: 'suffocation' });
    }
    // Surface contact effects: magma damage, soul sand slowness.
    if (fp.onGround) {
      const fx = Math.floor(fp.position.x);
      const fy = Math.floor(fp.position.y - 1.05);
      const fz = Math.floor(fp.position.z);
      const belowDef = registry.get(stateId(world.get(fx, fy, fz)));
      if (
        belowDef.name === 'webmc:magma_block' &&
        !fp.input.sneak &&
        !playerState.effects.has('fire_resistance')
      ) {
        playerState.takeDamage({ amount: 1 * dtSec, source: 'fire' });
      }
      // Soul sand slows player to 60% horizontal velocity (matches MC).
      if (belowDef.name === 'webmc:soul_sand') {
        fp.velocity.x *= 0.6;
        fp.velocity.z *= 0.6;
      }
      // Surface friction (ice slippery, honey sticky) via ground response multiplier.
      const blockId = belowDef.name.replace(/^webmc:/, '');
      const f = blockFriction(blockId);
      // Default friction 0.6 → mult 1; ice 0.98 → mult ~5 (slippery); honey 0.4 → mult ~0.5 (sticky).
      fp.groundResponseMultiplier = f >= 0.95 ? 5 : f <= 0.5 ? 0.5 : 1;
    } else {
      fp.groundResponseMultiplier = 1;
    }
    // Cactus + sweet berry bush contact damage. Hit-immune frame throttles
    // the apparent damage to 1 HP per 0.5s (vanilla cactus rate), so the
    // per-frame loop doesn't burn down a heart in a single tick. We sweep
    // the player AABB across the 8 corner blocks since a 0.6×2.52 player
    // can occupy up to 2x1x2 blocks straddling boundaries.
    const minX = Math.floor(fp.position.x - 0.3);
    const maxX = Math.floor(fp.position.x + 0.3);
    const minZ = Math.floor(fp.position.z - 0.3);
    const maxZ = Math.floor(fp.position.z + 0.3);
    const minY = Math.floor(fp.position.y - 1.62);
    const maxY = Math.floor(fp.position.y + 0.9);
    let touchedCactus = false;
    let touchedBerry = false;
    for (let by2 = minY; by2 <= maxY; by2++) {
      for (let bz2 = minZ; bz2 <= maxZ; bz2++) {
        for (let bx2 = minX; bx2 <= maxX; bx2++) {
          const s = world.get(bx2, by2, bz2);
          if (s === AIR) continue;
          const d2 = registry.get(stateId(s));
          if (d2.name === 'webmc:cactus') touchedCactus = true;
          else if (d2.name === 'webmc:sweet_berry_bush') touchedBerry = true;
        }
      }
    }
    if (touchedCactus) {
      playerState.takeDamage({ amount: 1, source: 'cactus' });
    } else if (touchedBerry) {
      // Berry bushes only damage on movement (vanilla: when entity moves
      // while inside). Approximate: damage if there's horizontal motion.
      const moving = Math.hypot(fp.velocity.x, fp.velocity.z) > 0.05;
      if (moving) playerState.takeDamage({ amount: 1, source: 'sweet_berry' });
    }
  }

  if (playerState.hunger <= 0 && (gameMode === 'survival' || gameMode === 'adventure')) {
    if (!starvingShown) {
      starvingShown = true;
      toast.show('Starving!', '#ff6060', 2000);
    }
  } else {
    starvingShown = false;
  }
  if (playerState.justDied && !playerState.invulnerable) {
    // Cancel any in-progress eat — corpse shouldn't be munching.
    if (eatState.itemId !== null) {
      cancelEating(eatState);
      rightClickHeldForEat = false;
    }
    // Totem of Undying: vanilla checks main-hand AND offhand slot. webmc
    // only scanned the inventory grids — a totem in offhand silently
    // failed to save you.
    const totemId = itemRegistry.byName('webmc:totem_of_undying');
    const totemInOffhand = totemId !== undefined && inventory.offhand?.itemId === totemId;
    const totemInInventory = totemId !== undefined && countInventoryItem(totemId) > 0;
    if (totemId !== undefined && (totemInInventory || totemInOffhand)) {
      if (totemInOffhand) {
        const off = inventory.offhand!;
        const after = off.count - 1;
        inventory.offhand = after > 0 ? { ...off, count: after } : null;
      } else {
        consumeInventoryItem(totemId, 1);
      }
      playerState.health = 1;
      playerState.justDied = false;
      playerState.applyEffect('regeneration', 1, 45);
      playerState.applyEffect('absorption', 1, 5);
      playerState.applyEffect('fire_resistance', 0, 40);
      toast.show('✦ Totem of Undying ✦', '#ffd040', 3500);
      subtitles.push('Totem of Undying activated');
      sfx.play('place');
    } else {
      lastDeathPos = { x: fp.position.x, y: fp.position.y, z: fp.position.z };
      void persistDB.setMeta('lastDeathPos', lastDeathPos);
      if (hardcoreMode) {
        // Hardcore: switch to spectator, no respawn.
        toast.show('☠ HARDCORE — locked to spectator', '#ff5050', 8000);
        applyGameMode('spectator');
        playerState.health = 20;
        playerState.justDied = false;
      } else if (gameRules.doImmediateRespawn) {
        // doImmediateRespawn skips the death screen, so respawn here.
        playerState.respawn();
        toast.show('Respawned', '#80ffa0', 1200);
      } else if (!deathScreen.isVisible()) {
        // Close any open inventory / chest / settings overlays before
        // showing the death screen — otherwise dying with chest UI open
        // stacked the death screen on top and the player couldn't reach
        // either's button.
        if (chestUI.isVisible()) chestUI.hide();
        if (creativeInv.isVisible()) creativeInv.hide();
        if (survivalInv.isVisible()) survivalInv.hide();
        if (settingsPanel.isVisible()) settingsPanel.hide();
        const score = playerState.xpLevel * 7 + Math.floor(playerState.xpProgress * 7);
        deathScreen.setCause(currentPlayerName, playerState.lastDeathCause, score);
        deathScreen.show();
        fp.inputBlocked = true;
        document.exitPointerLock();
        playerState.justDied = false;
      }
    }
  }

  if (playerState.health < lastPlayerHealth - 0.05) {
    const delta = lastPlayerHealth - playerState.health;
    hurtVignette.pulse(Math.min(0.95, 0.35 + delta * 0.08));
    screenShake.pulse(Math.min(1, 0.2 + delta * 0.1));
    sfx.play('hit');
    subtitles.push('Player hurt');
    // Damage cancels eating (vanilla — getting hit interrupts the bite).
    // Without this, you could keep eating bread while a zombie chewed
    // through your face. The held-right-click and hotbar-swap paths
    // already cancel; this covers the take-damage path that didn't.
    if (eatState.itemId !== null) {
      cancelEating(eatState);
      rightClickHeldForEat = false;
    }
    if (typeof navigator.getGamepads === 'function') {
      const pad = (navigator.getGamepads() ?? []).find((p) => p && p.connected);
      const actuator = (
        pad as
          | (Gamepad & {
              vibrationActuator?: { playEffect: (type: string, opts: object) => Promise<void> };
            })
          | undefined
      )?.vibrationActuator;
      if (actuator) {
        const r = rumbleForDamage(delta);
        void actuator
          .playEffect('dual-rumble', {
            duration: r.durationMs,
            strongMagnitude: r.highIntensity,
            weakMagnitude: r.lowIntensity,
          })
          .catch(() => undefined);
      }
    }
  }
  subtitles.tick();
  achievementToast.tick();
  activeEffectsHud.render(
    Array.from(playerState.effects, ([id, e]) => ({
      id,
      amplifier: e.amplifier,
      remainingSec: e.remainingSec,
    })),
  );

  // Crosshair tint hints what's targeted: red=hostile, green=passive, default=block.
  let aimTint: string | null = null;
  const aimReach = 5.5;
  const aimLook2 = fp.lookVector();
  for (const m of mobWorld.all()) {
    const dx = m.position.x - camera.position.x;
    const dy = m.position.y - camera.position.y;
    const dz = m.position.z - camera.position.z;
    const d = Math.hypot(dx, dy, dz);
    if (d > aimReach + 1) continue;
    const dot = (dx * aimLook2.x + dy * aimLook2.y + dz * aimLook2.z) / Math.max(0.001, d);
    if (dot > 0.97) {
      const beh = m.def.behavior;
      aimTint =
        beh === 'hostile' || beh === 'creeper' ? 'rgba(255,140,140,0.9)' : 'rgba(160,255,160,0.9)';
      break;
    }
  }
  crosshair.setTint(aimTint);
  // Dim crosshair when not aimed at any block or mob (visible-when-relevant).
  crosshair.setOpacity(aimTint || aim ? 1 : 0.55);

  if (!loadingOverlay.isHidden()) {
    const meshes = chunkRenderer.meshCount;
    if (meshes >= 25) {
      loadingOverlay.hide();
    } else if (meshes < 4) {
      loadingOverlay.set('world', meshes / 4);
    } else if (meshes < 12) {
      loadingOverlay.set('terrain', (meshes - 4) / 8);
    } else if (meshes < 20) {
      loadingOverlay.set('light', (meshes - 12) / 8);
    } else {
      loadingOverlay.set('entities', (meshes - 20) / 5);
    }
  }
  const nowPhase = phaseOfDay(Math.floor(dayNight.timeOfDay * 24000));
  if (nowPhase !== lastPhase) {
    if (nowPhase === 'dusk') fireTutorial('sunset');
    lastPhase = nowPhase;
  }

  // Cave-mood ambient: when player has no sky access above and it's dark.
  let skyBlocked = false;
  const px = Math.floor(fp.position.x);
  const py = Math.floor(fp.position.y);
  const pz = Math.floor(fp.position.z);
  for (let yy = py + 2; yy < CHUNK_HEIGHT; yy++) {
    if (isSolid(px, yy, pz)) {
      skyBlocked = true;
      break;
    }
  }
  const m = tickMood(moodState, {
    skyLight: skyBlocked ? 0 : 15,
    blockLight: nowPhase === 'night' && skyBlocked ? 4 : 12,
    dtMs: dtSec * 1000,
  });
  if (m.triggered) {
    sfx.play('cave');
    subtitles.push('Cave ambience');
  }

  // Underwater ambient — runs once per real-time tick equivalent.
  // Use eye-level fluid: ambient kicks in when head is submerged.
  underwaterAmbient = { ...underwaterAmbient, submerged: fp.inFluidEyes === 'water' };
  const ua = tickUnderwater(underwaterAmbient, Math.random);
  underwaterAmbient = ua.state;
  if (ua.play) {
    sfx.play('underwater');
    subtitles.push('Underwater ambience');
  }

  // Per-block break duration: hardness * tool factor (break_speed helper).
  if (gameMode !== 'creative') {
    const aim2 = interaction.castRay();
    if (aim2) {
      const def2 = registry.get(stateId(world.get(aim2.bx, aim2.by, aim2.bz)));
      const hasteAmp = playerState.effects.get('haste')?.amplifier ?? 0;
      const fatigueAmp = playerState.effects.get('mining_fatigue')?.amplifier ?? 0;
      // Aqua Affinity: helmet item with name including "turtle" gives free aqua affinity (turtle shell).
      const helmet = inventory.armor[0];
      const helmetName = helmet ? itemRegistry.get(helmet.itemId).name : '';
      const aquaAffinity = helmetName.includes('turtle');
      const t = breakTicksFor({
        hardness: Math.max(0.1, def2.hardness),
        correctTool: true,
        toolSpeed: 1,
        onGround: fp.onGround,
        // Mining-speed underwater penalty applies when the head is in
        // water (vanilla rule); aquaAffinity removes it.
        underwater: fp.inFluidEyes === 'water',
        hasAquaAffinity: aquaAffinity,
        hasteLevel: hasteAmp + (hasteAmp > 0 ? 1 : 0),
        fatigueLevel: fatigueAmp + (fatigueAmp > 0 ? 1 : 0),
        efficiencyBonus: 0,
      });
      interaction.breakDurationSec = Math.min(5, Math.max(0.1, t / 20));
    }
  }

  // Autosave debouncer: 30s interval OR 64-edit threshold OR forced.
  // Old impl only flushed chunkStore — player position, vitals, inventory,
  // time of day, etc. relied on visibilitychange / beforeunload, so a
  // browser crash mid-session would lose them. Now flushes the full set
  // every autosave window (matching what /save does).
  const nowSaveMs = performance.now();
  if (
    shouldSave(autosaveState, { nowMs: nowSaveMs, trigger: 'timer' }) ||
    shouldSave(autosaveState, { nowMs: nowSaveMs, trigger: 'threshold' })
  ) {
    beginSave(autosaveState, nowSaveMs);
    void savePlayerNow();
    void saveAllChestStorages();
    void persistDB.setMeta('playerStats', playerStats);
    void persistDB.setMeta('timeOfDay', dayNight.timeOfDay);
    void persistDB.setMeta('dayCounter', dayCounter);
    void persistDB.setMeta('fluidCells', fluidWorld.serialize());
    saveHotbarIfChanged();
    void chunkStore.flush().finally(() => {
      endSave(autosaveState);
    });
  }
  crosshair.setCooldown(
    (performance.now() - lastPlayerAttackAt) / heldAttackFullChargeMs(heldNameLower()),
  );

  // Boss bar: nearest mob with maxHealth >= 40 within 32 blocks
  let bossM: typeof bossCandidate | null = null;
  let bossDistSq = 32 * 32;
  interface BossCandidate {
    name: string;
    health: number;
    maxHealth: number;
    kind: string;
  }
  let bossCandidate: BossCandidate | null = null;
  for (const m of mobWorld.all()) {
    if (m.def.maxHealth < 40) continue;
    const dx = m.position.x - fp.position.x;
    const dz = m.position.z - fp.position.z;
    const d2 = dx * dx + dz * dz;
    if (d2 > bossDistSq) continue;
    bossDistSq = d2;
    bossCandidate = {
      name: m.def.kind,
      health: m.health,
      maxHealth: m.def.maxHealth,
      kind: m.def.kind,
    };
    bossM = bossCandidate;
  }
  if (bossM) {
    const color =
      bossM.kind === 'ender_dragon'
        ? 'purple'
        : bossM.kind === 'warden'
          ? 'red'
          : bossM.kind === 'wither'
            ? 'red'
            : 'pink';
    const style: 'progress' | 'notched_6' | 'notched_10' | 'notched_12' | 'notched_20' =
      bossM.kind === 'ender_dragon'
        ? 'notched_10'
        : bossM.kind === 'warden'
          ? 'notched_20'
          : bossM.kind === 'wither'
            ? 'notched_6'
            : 'progress';
    bossBar.set({
      name: bossM.name,
      hp: bossM.health,
      maxHp: bossM.maxHealth,
      color,
      style,
      visible: true,
    });
  } else if (customBossBar) {
    bossBar.set({
      name: customBossBar.name,
      hp: customBossBar.hp,
      maxHp: customBossBar.maxHp,
      color: customBossBar.color,
      style: customBossBar.style,
      visible: true,
    });
  } else {
    bossBar.hide();
  }

  if (scoreboard.isVisible()) {
    scoreboard.render([
      { name: 'Broken', score: playerStats.blocksBroken },
      { name: 'Placed', score: playerStats.blocksPlaced },
      { name: 'Killed', score: playerStats.mobsKilled },
      { name: 'Walked', score: Math.floor(playerStats.distanceWalked) },
      { name: 'Time', score: Math.floor(playerStats.playtimeSec) },
      { name: 'Level', score: playerState.xpLevel },
    ]);
  }
  lastPlayerHealth = playerState.health;
  hurtVignette.tick(dtSec);
  // Visual overlays follow what the EYES see, not the body — wading
  // through ankle-deep water shouldn't blue-tint the screen.
  fluidOverlay.set(fp.inFluidEyes);

  // Underwater fog: shorten render distance and tint when submerged.
  if (scene.fog instanceof THREE.Fog) {
    if (fp.inFluidEyes === 'water') {
      scene.fog.color.setRGB(0.24, 0.4, 0.6);
      scene.fog.near = 1;
      scene.fog.far = 20;
    } else {
      // Restore based on view distance, with weather-aware tightening.
      const baseFar = (loader.viewRadius ?? 6) * 16;
      let mul = 1;
      if (currentWeather === 'thunder') mul = 0.55;
      else if (currentWeather === 'rain') mul = 0.75;
      const targetFar = baseFar * mul;
      if (Math.abs(scene.fog.far - targetFar) > 1) {
        scene.fog.near = targetFar * 0.6;
        scene.fog.far = targetFar;
      }
    }
  }
  // Drowning feedback: breath < 2s → slight hurt vignette pulse.
  // Eye-level water: vignette only fires when head is actually submerged.
  if (fp.inFluidEyes === 'water' && playerState.breath < 2) {
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
  // Spawn-direction marker: relative angle to playerSpawnPoint (or world spawn).
  {
    const sp = playerSpawnPoint ?? worldMeta?.spawn ?? null;
    if (sp) {
      const dx = sp.x - fp.position.x;
      const dz = sp.z - fp.position.z;
      // CompassBar.setYaw treats yaw as MC-style; use atan2 with -dx,dz to align with strip.
      const angleWorld = Math.atan2(-dx, dz);
      compassBar.setSpawnDir(angleWorld, fp.yaw);
    } else {
      compassBar.setSpawnDir(null, fp.yaw);
    }
    if (lastDeathPos) {
      const dx = lastDeathPos.x - fp.position.x;
      const dz = lastDeathPos.z - fp.position.z;
      compassBar.setDeathDir(Math.atan2(-dx, dz), fp.yaw);
    } else {
      compassBar.setDeathDir(null, fp.yaw);
    }
  }
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
      armorPoints: computeArmorPoints(),
    });
  }

  // Per-category mob cap (MC-style WORLD_CAPS).
  let hostileCount = 0;
  let passiveCount = 0;
  for (const m of mobWorld.all()) {
    if (m.def.behavior === 'hostile' || m.def.behavior === 'creeper') hostileCount++;
    else if (m.def.behavior === 'passive') passiveCount++;
  }
  const overHostileCap = hostileCount >= WORLD_MOB_CAPS.hostile;
  const overPassiveCap = passiveCount >= WORLD_MOB_CAPS.passive;
  if (
    chunkRenderer.meshCount > 20 &&
    mobDamageMultiplier > 0 &&
    gameRules.doMobSpawning &&
    !(overHostileCap && overPassiveCap)
  ) {
    // Despawn mobs >128 blocks away from player to bound entity count.
    // Tamed pets, leashed mobs, name-tagged mobs, and saddled mounts get
    // a free pass — vanilla MC keeps these loaded indefinitely; otherwise
    // your wolf would vanish the moment you walked across a chunk.
    const farMobs: number[] = [];
    for (const m of mobWorld.all()) {
      const dx = m.position.x - fp.position.x;
      const dz = m.position.z - fp.position.z;
      if (dx * dx + dz * dz <= 128 * 128) continue;
      const tame = tamedMobs.get(m.id);
      if (tame && tame.ownerId !== null) continue;
      if (leashedMobs.has(m.id)) continue;
      if (saddledMobs.has(m.id)) continue;
      farMobs.push(m.id);
    }
    for (const id of farMobs) mobWorld.remove(id);

    spawnSystem.tick(dtSec, mobWorld, {
      playerPos: { x: fp.position.x, y: fp.position.y, z: fp.position.z },
      isDay: dayNight.isDay,
      surfaceAt: (x, z) => generator.surfaceAt(x, z),
      isSolid,
      biomeAt: (x, z) => (generator.biomeAt(x, z) === 1 ? 'forest' : 'plains'),
    });

    // Chicken egg laying: every 5–10 min per chicken, drop an egg item.
    const nowEggMs = performance.now();
    if (nowEggMs - lastEggCheckMs > 1000) {
      lastEggCheckMs = nowEggMs;
      const eggItemId = itemRegistry.byName('webmc:egg');
      if (eggItemId !== undefined) {
        for (const m of mobWorld.all()) {
          if (m.def.kind !== 'chicken') continue;
          let next = chickenEggTimers.get(m.id);
          if (next === undefined) {
            next = nowEggMs + 300_000 + Math.random() * 300_000;
            chickenEggTimers.set(m.id, next);
            continue;
          }
          if (nowEggMs >= next) {
            droppedItems.spawn(m.position.x, m.position.y + 0.4, m.position.z, {
              itemId: eggItemId,
              count: 1,
              color: [240, 230, 200],
            });
            chickenEggTimers.set(m.id, nowEggMs + 300_000 + Math.random() * 300_000);
          }
        }
        // Drop stale entries.
        for (const id of chickenEggTimers.keys()) {
          if (!Array.from(mobWorld.all()).some((m) => m.id === id)) chickenEggTimers.delete(id);
        }
      }
    }

    // Zombie → drowned conversion after ~30s underwater.
    const nowDrownMs = performance.now();
    if (nowDrownMs - lastDrownCheckMs > 1000) {
      const dt = nowDrownMs - lastDrownCheckMs;
      lastDrownCheckMs = nowDrownMs;
      const toConvert: { id: number; pos: { x: number; y: number; z: number } }[] = [];
      for (const m of mobWorld.all()) {
        if (m.def.kind !== 'zombie') continue;
        const headY = Math.floor(m.position.y + m.def.aabb.halfY);
        const headBlock = world.get(Math.floor(m.position.x), headY, Math.floor(m.position.z));
        const headDef = registry.get(stateId(headBlock));
        const inWater = headDef.name === 'webmc:water';
        if (inWater) {
          const cur = (zombieDrownTimers.get(m.id) ?? 0) + dt;
          zombieDrownTimers.set(m.id, cur);
          if (cur >= 30_000)
            toConvert.push({
              id: m.id,
              pos: { x: m.position.x, y: m.position.y, z: m.position.z },
            });
        } else if (zombieDrownTimers.has(m.id)) {
          zombieDrownTimers.delete(m.id);
        }
      }
      for (const c of toConvert) {
        try {
          mobWorld.spawn('drowned', c.pos);
          mobWorld.remove(c.id);
          zombieDrownTimers.delete(c.id);
          subtitles.push('Zombie drowned');
        } catch {
          /* drowned not registered */
        }
      }
    }

    // Natural hostile mob spawning: every ~5s, attempt to place a hostile
    // mob 24-48 blocks from the player at a dark spot. Tries surface first,
    // then random Y for cave spawning. Without this, survival had no
    // naturally-spawned mobs (only /summon).
    const nowSpawnMs = performance.now();
    if (
      (gameMode === 'survival' || gameMode === 'adventure') &&
      // Peaceful difficulty (mobDamageMultiplier === 0) suppresses hostile
      // spawning entirely. Vanilla MC behaviour. Without this gate,
      // peaceful players still got zombies spawning around them at night
      // — the spawn-gen cycle was independent of difficulty.
      mobDamageMultiplier > 0 &&
      nowSpawnMs - lastNaturalSpawnAttemptMs > 5000
    ) {
      lastNaturalSpawnAttemptMs = nowSpawnMs;
      let hostileCount = 0;
      for (const m of mobWorld.all()) {
        if (
          m.def.behavior === 'hostile' ||
          m.def.behavior === 'creeper' ||
          (m.def.behavior === 'neutral' && m.provoked)
        ) {
          hostileCount++;
        }
      }
      if (hostileCount < WORLD_MOB_CAPS.hostile) {
        for (let attempt = 0; attempt < 6; attempt++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = 24 + Math.random() * 24;
          const sx = Math.floor(fp.position.x + Math.cos(angle) * dist);
          const sz = Math.floor(fp.position.z + Math.sin(angle) * dist);
          // Half attempts target surface (covers night), half pick a random Y
          // between 5 and surface for cave spawning. Caves stay dark even
          // during the day so this gives the player something to fight when
          // they're spelunking.
          let sy = -1;
          if (attempt < 3) {
            // Surface scan.
            for (let y = CHUNK_HEIGHT - 1; y >= 1; y--) {
              if (isSolid(sx, y, sz) && !isSolid(sx, y + 1, sz) && !isSolid(sx, y + 2, sz)) {
                sy = y + 1;
                break;
              }
            }
          } else {
            // Random Y. Probe for a solid floor with 2 air above.
            const probeY = 5 + Math.floor(Math.random() * 60);
            if (
              isSolid(sx, probeY - 1, sz) &&
              !isSolid(sx, probeY, sz) &&
              !isSolid(sx, probeY + 1, sz)
            ) {
              sy = probeY;
            }
          }
          if (sy < 0) continue;
          // Light gate: don't spawn in a torch-lit area. Cheap heuristic — if
          // we have lighting data for the chunk, require sky+block <= 7 (caves
          // and night both fit). Without lighting data (chunk unloaded?),
          // skip rather than spam-spawn at default-bright fallback.
          const cx = sx >> 4;
          const cz = sz >> 4;
          const lx = sx & 0xf;
          const lz = sz & 0xf;
          const light = lightCache.get(lightKey(cx, cz));
          if (!light) continue;
          const lb = getLightByte(light, lx, sy, lz);
          const sky = (lb >>> 4) & 0xf;
          const block = lb & 0xf;
          if (Math.max(sky, block) > 7) continue;
          // Skip when it's broad daylight AND we're spawning at the surface
          // (sky light max). Caves stay dark so still spawn there.
          if (dayNight.isDay && sky > 7) continue;
          const choices: ('zombie' | 'skeleton' | 'creeper' | 'spider')[] = [
            'zombie',
            'zombie',
            'skeleton',
            'creeper',
            'spider',
          ];
          const kind = choices[Math.floor(Math.random() * choices.length)];
          if (!kind) continue;
          try {
            mobWorld.spawn(kind, { x: sx + 0.5, y: sy, z: sz + 0.5 });
          } catch {
            /* mob kind not registered */
          }
          break;
        }
      }
    }

    // Passive mob spawning. Vanilla scatters cow / pig / sheep / chicken
    // at chunkgen but webmc has no chunkgen-time spawner — without an
    // active loop, the world never had any livestock once the original
    // herds were killed. Slow cycle (~20s) at high light level only.
    if (
      (gameMode === 'survival' || gameMode === 'adventure') &&
      nowSpawnMs - lastPassiveSpawnAttemptMs > 20000
    ) {
      lastPassiveSpawnAttemptMs = nowSpawnMs;
      let passiveCount = 0;
      for (const m of mobWorld.all()) {
        if (m.def.behavior === 'passive') passiveCount++;
      }
      if (passiveCount < WORLD_MOB_CAPS.passive) {
        for (let attempt = 0; attempt < 4; attempt++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = 24 + Math.random() * 32;
          const sx = Math.floor(fp.position.x + Math.cos(angle) * dist);
          const sz = Math.floor(fp.position.z + Math.sin(angle) * dist);
          let sy = -1;
          for (let y = CHUNK_HEIGHT - 1; y >= 1; y--) {
            if (isSolid(sx, y, sz) && !isSolid(sx, y + 1, sz) && !isSolid(sx, y + 2, sz)) {
              sy = y + 1;
              break;
            }
          }
          if (sy < 0) continue;
          // Vanilla: passives need light >= 9 AND a grass block beneath.
          const cx = sx >> 4;
          const cz = sz >> 4;
          const lx = sx & 0xf;
          const lz = sz & 0xf;
          const light = lightCache.get(lightKey(cx, cz));
          if (!light) continue;
          const lb = getLightByte(light, lx, sy, lz);
          const sky = (lb >>> 4) & 0xf;
          const block = lb & 0xf;
          if (Math.max(sky, block) < 9) continue;
          const groundDef = registry.get(stateId(world.get(sx, sy - 1, sz)));
          if (groundDef.name !== 'webmc:grass_block' && groundDef.name !== 'webmc:grass') continue;
          const passiveChoices: ('pig' | 'cow' | 'sheep' | 'chicken' | 'rabbit')[] = [
            'pig',
            'cow',
            'sheep',
            'sheep',
            'chicken',
            'rabbit',
          ];
          const kind = passiveChoices[Math.floor(Math.random() * passiveChoices.length)];
          if (!kind) continue;
          try {
            // Spawn a small herd (2-4) of the same kind, vanilla style.
            const herd = 2 + Math.floor(Math.random() * 3);
            for (let h = 0; h < herd; h++) {
              mobWorld.spawn(kind, {
                x: sx + 0.5 + (Math.random() - 0.5) * 2,
                y: sy,
                z: sz + 0.5 + (Math.random() - 0.5) * 2,
              });
            }
          } catch {
            /* mob kind not registered */
          }
          break;
        }
      }
    }

    // Phantom spawning: 3+ days without sleep, at night, sky-exposed.
    const nowPhantomMs = performance.now();
    if (nowPhantomMs - lastPhantomCheckMs > 8000) {
      lastPhantomCheckMs = nowPhantomMs;
      const daysSinceSleep = dayCounter - lastSleepDay;
      const px2 = Math.floor(fp.position.x);
      const pz2 = Math.floor(fp.position.z);
      let inSky = true;
      for (let yy = Math.floor(fp.position.y) + 2; yy < CHUNK_HEIGHT; yy++) {
        if (isSolid(px2, yy, pz2)) {
          inSky = false;
          break;
        }
      }
      if (
        canSpawnPhantom({
          daysSinceSleep,
          worldTick: Math.floor(dayNight.timeOfDay * 24000),
          playerInSkyView: inSky,
          rand: Math.random,
        })
      ) {
        try {
          mobWorld.spawn('phantom', {
            x: fp.position.x + (Math.random() - 0.5) * 30,
            y: fp.position.y + 14,
            z: fp.position.z + (Math.random() - 0.5) * 30,
          });
          subtitles.push('Phantom screech');
        } catch {
          /* phantom not registered, non-fatal */
        }
      }
    }
  }

  // Crop random tick. The crop_growth_random_tick module + its tests have
  // existed since M3 but were never invoked — wheat / carrots / potatoes /
  // beetroots / sweet_berry / nether_wart you planted just sat at age 0
  // forever. Now ticks every CROP_TICK_SEC: scans a small radius around
  // the player for crop blocks, picks ~ randomTickSpeed per chunk-section,
  // advances age by 1 if the growth roll succeeds.
  cropTickAccum += dtSec;
  if (cropTickAccum >= CROP_TICK_SEC) {
    cropTickAccum -= CROP_TICK_SEC;
    if (gameMode !== 'spectator') {
      const CROP_BLOCKS: Record<string, CropQuery['crop'] | undefined> = {
        'webmc:wheat': 'wheat',
        'webmc:carrots': 'carrot',
        'webmc:potatoes': 'potato',
        'webmc:beetroots': 'beetroot',
        'webmc:nether_wart': 'nether_wart',
      };
      const px = Math.floor(fp.position.x);
      const py = Math.floor(fp.position.y);
      const pz = Math.floor(fp.position.z);
      const RADIUS = 24;
      const SAMPLES = 80;
      const farmlandId = registry.byName('webmc:farmland');
      for (let i = 0; i < SAMPLES; i++) {
        const dx = Math.floor((Math.random() - 0.5) * RADIUS * 2);
        const dy = Math.floor((Math.random() - 0.5) * 8);
        const dz = Math.floor((Math.random() - 0.5) * RADIUS * 2);
        const x = px + dx;
        const y = py + dy;
        const z = pz + dz;
        const s = world.get(x, y, z);
        if (s === AIR) continue;
        const id = stateId(s);
        const name = registry.get(id).name;
        const cropKind = CROP_BLOCKS[name];
        if (!cropKind) continue;
        const age = stateProps(s);
        const cx = x >> 4;
        const cz = z >> 4;
        const lx = x & 0xf;
        const lz = z & 0xf;
        const light = lightCache.get(lightKey(cx, cz));
        const lb = light ? getLightByte(light, lx, y, lz) : 0xff;
        const skyL = (lb >>> 4) & 0xf;
        const blockL = lb & 0xf;
        const lightAbove = Math.max(skyL, blockL);
        // Hydrated when on farmland with water within 4 horizontally.
        let hydrated = false;
        if (farmlandId !== undefined) {
          const groundId = stateId(world.get(x, y - 1, z));
          if (groundId === farmlandId) {
            // Vanilla farmland tracks moisture in props; webmc just checks
            // adjacent water as a coarse heuristic.
            const waterId = registry.byName('webmc:water');
            outer: for (let wdx = -4; wdx <= 4; wdx++) {
              for (let wdz = -4; wdz <= 4; wdz++) {
                const ws = world.get(x + wdx, y - 1, z + wdz);
                if (ws !== AIR && stateId(ws) === waterId) {
                  hydrated = true;
                  break outer;
                }
              }
            }
          }
        }
        const result = cropRandomTick({
          crop: cropKind,
          age,
          lightAbove,
          hydrated,
          inRowWithSameCrop: false,
          rand: Math.random,
        });
        if (result === 'grew') {
          world.set(x, y, z, makeState(id, age + 1));
          touchWorldEdit(x, y, z, id);
        }
      }
      // Sapling growth: same scan, separate registry. Was the other gap
      // — saplings just sat as decorative foliage forever unless bone-mealed.
      const sugarCaneId = registry.byName('webmc:sugar_cane');
      for (let i = 0; i < SAMPLES; i++) {
        const dx = Math.floor((Math.random() - 0.5) * RADIUS * 2);
        const dy = Math.floor((Math.random() - 0.5) * 8);
        const dz = Math.floor((Math.random() - 0.5) * RADIUS * 2);
        const x = px + dx;
        const y = py + dy;
        const z = pz + dz;
        const s = world.get(x, y, z);
        if (s === AIR) continue;
        const id = stateId(s);
        const name = registry.get(id).name;
        if (name.endsWith('_sapling')) {
          const stage = stateProps(s) & 1;
          const cx = x >> 4;
          const cz = z >> 4;
          const lx = x & 0xf;
          const lz = z & 0xf;
          const light = lightCache.get(lightKey(cx, cz));
          const lb = light ? getLightByte(light, lx, y, lz) : 0xff;
          const skyL = (lb >>> 4) & 0xf;
          const blockL = lb & 0xf;
          const lightLevel = Math.max(skyL, blockL);
          let clearance = 0;
          for (let h = 1; h <= 8; h++) {
            if (world.get(x, y + h, z) !== AIR) break;
            clearance++;
          }
          const result = saplingRandomTick(
            { stage: stage as 0 | 1, lightLevel, verticalClearance: clearance },
            Math.random,
          );
          if (result === 'grow_tree') {
            growTreeAt(x, y, z, name);
          } else if (result.stage !== stage) {
            world.set(x, y, z, makeState(id, result.stage));
          }
        } else if (sugarCaneId !== undefined && id === sugarCaneId) {
          // Sugar cane grows up to 3 stalks tall when air is above.
          // Count current height from this position upward (this stalk
          // is the topmost only when air is above).
          if (world.get(x, y + 1, z) !== AIR) continue;
          // Count height down: this stalk + however many stalks below.
          let currentHeight = 1;
          for (let dyDown = 1; dyDown <= 3; dyDown++) {
            const below = world.get(x, y - dyDown, z);
            if (below === AIR || stateId(below) !== sugarCaneId) break;
            currentHeight++;
          }
          const age = stateProps(s);
          const tickState = { age };
          const result = caneRandomTick({ state: tickState, currentHeight });
          if (result === 'grow_up' && currentHeight < CANE_MAX_H) {
            world.set(x, y + 1, z, makeState(sugarCaneId, 0));
            world.set(x, y, z, makeState(id, 0));
            touchWorldEdit(x, y + 1, z, sugarCaneId);
          } else if (result === 'age_inc') {
            world.set(x, y, z, makeState(id, tickState.age));
          }
        }
      }
    }
  }

  fluidTickAccum += dtSec;
  // Restore persisted cells once chunks have had ~3s to load. deserialize
  // skips cells whose world block isn't the matching fluid, so unloaded
  // chunks just silently miss out — re-attempt periodically while the
  // queue is non-empty.
  if (pendingFluidCells.length > 0) {
    fluidRestoreAccum += dtSec;
    if (fluidRestoreAccum > 3) {
      fluidRestoreAccum = 0;
      const before = fluidWorld.size();
      fluidWorld.deserialize(pendingFluidCells);
      if (fluidWorld.size() > before || pendingFluidCells.length === 0) {
        // Either we restored some or the queue drained; clear it so we
        // don't re-deserialize the same blob forever.
        pendingFluidCells.length = 0;
      }
    }
  }
  // Persist cells every 30s. Sources + flowing tips both — covers
  // bucket placements that need to survive chunk reloads.
  fluidSaveAccum += dtSec;
  if (fluidSaveAccum > 30) {
    fluidSaveAccum = 0;
    void persistDB.setMeta('fluidCells', fluidWorld.serialize());
  }
  while (fluidTickAccum >= FLUID_TICK_SEC) {
    fluidTickAccum -= FLUID_TICK_SEC;
    const { changed } = fluidWorld.tick();
    if (changed.length > 0) {
      // Per-chunk: rebuild light once. Per-section (cy): mark mesh dirty
      // — markChunkAllDirty was rebuilding all 24 sections of every
      // touched chunk every fluid tick, costing 24x what it should.
      const chunksToRelight = new Set<string>();
      const sectionsToRemesh = new Map<string, Set<number>>();
      for (const p of changed) {
        const cx = Math.floor(p.x / 16);
        const cz = Math.floor(p.z / 16);
        const cy = Math.floor(p.y / 16);
        const ck = `${String(cx)},${String(cz)}`;
        chunksToRelight.add(ck);
        let s = sectionsToRemesh.get(ck);
        if (!s) {
          s = new Set();
          sectionsToRemesh.set(ck, s);
        }
        s.add(cy);
      }
      for (const k of chunksToRelight) {
        const [cxS, czS] = k.split(',');
        const cxN = Number(cxS);
        const czN = Number(czS);
        const chunk = world.getChunk(cxN, czN);
        if (!chunk) continue;
        const oldLight = lightCache.get(lightKey(cxN, czN)) ?? null;
        chunkStore.markDirty(chunk, oldLight);
        const newLight = buildLight(chunk, lightOracle);
        lightCache.set(lightKey(cxN, czN), newLight);
        const sections = sectionsToRemesh.get(k);
        if (!sections) continue;
        for (const cy of sections) {
          if (chunk.section(cy)) chunk.markMeshDirty(cy);
        }
      }
    }
  }

  if (!tickFrozen) {
    worldTick += Math.max(1, Math.round(dtSec * 20));
    // Advance hold-to-eat. Tick at 20 Hz to match PlayerState; complete
    // after totalTicks (32 = 1.6s default). On completion: apply hunger,
    // saturation, side effects, consume one item, re-arm if still holding
    // right-click and still have the same food (lets you eat a stack).
    if (eatState.itemId !== null) {
      const eatTicks = Math.max(1, Math.round(dtSec * 20));
      for (let i = 0; i < eatTicks; i++) {
        const result = tickEating(eatState);
        if (!result.completed) continue;
        const consumedName = result.itemConsumed;
        if (consumedName === null) break;
        const itemId = itemRegistry.byName(consumedName);
        if (itemId === undefined) break;
        const itemDef = itemRegistry.get(itemId);
        consumeFoodItem(itemId, itemDef.hungerRestore ?? 0, itemDef.saturation ?? 0);
        consumeInventoryItem(itemId, 1);
        // Re-arm: if the player is still holding right-click and still has
        // the same food in the held slot, start the next bite. Vanilla MC
        // does the same — you can graze a stack of bread without re-clicking.
        if (rightClickHeldForEat) {
          const stk = inventory.hotbar[inventory.selectedHotbar];
          if (stk?.itemId === itemId) {
            const restore = itemDef.hungerRestore ?? 0;
            const alwaysEdible =
              consumedName === 'webmc:golden_apple' ||
              consumedName === 'webmc:enchanted_golden_apple' ||
              consumedName === 'webmc:chorus_fruit' ||
              consumedName === 'webmc:honey_bottle' ||
              consumedName.includes('potion_') ||
              consumedName === 'webmc:awkward_potion';
            if (restore > 0 && (playerState.hunger < 20 || alwaysEdible)) {
              startEating(eatState, { itemId: consumedName });
              continue;
            }
          }
          rightClickHeldForEat = false;
        }
        break;
      }
    }
    if (babyMobs.size > 0) {
      const ticksThisFrame = Math.max(1, Math.round(dtSec * 20));
      for (const [id, st] of babyMobs) {
        let next = st;
        for (let i = 0; i < ticksThisFrame; i++) next = babyTick(next);
        if (!next.isBaby) {
          babyMobs.delete(id);
          mobRenderer.setMobScale(id, 1);
        } else {
          babyMobs.set(id, next);
          mobRenderer.setMobScale(id, 0.5 + 0.5 * growFraction(next));
        }
      }
    }
    if (leashedMobs.size > 0) {
      const anchor = { x: fp.position.x, y: fp.position.y, z: fp.position.z };
      const allMobs = [...mobWorld.all()];
      const broken: number[] = [];
      for (const id of leashedMobs) {
        const m = allMobs.find((mm) => mm.id === id);
        if (!m) {
          broken.push(id);
          continue;
        }
        const r = tensionStep({ anchorPos: anchor, mobPos: m.position });
        if (r.broken) {
          broken.push(id);
          mobRenderer.setMobName(id, m.def.kind);
          chatInput.addLine(`Leash on ${m.def.kind} snapped.`, '#ffd080');
          continue;
        }
        m.velocity.x += r.pullVec.x;
        m.velocity.y += r.pullVec.y;
        m.velocity.z += r.pullVec.z;
      }
      for (const id of broken) leashedMobs.delete(id);
    }
    if ((worldTick & 0x3f) === 0 && lovingMobs.size > 0) {
      const allMobs = [...mobWorld.all()];
      const mobById = new Map(allMobs.map((m) => [m.id, m] as const));
      const lovers: { mob: (typeof allMobs)[number]; love: AnimalLove }[] = [];
      for (const [id, love] of lovingMobs) {
        const m = mobById.get(id);
        if (m && isInLove(love, worldTick)) lovers.push({ mob: m, love });
      }
      const consumed = new Set<number>();
      for (let i = 0; i < lovers.length; i++) {
        const a = lovers[i]!;
        if (consumed.has(a.mob.id)) continue;
        for (let j = i + 1; j < lovers.length; j++) {
          const b = lovers[j]!;
          if (consumed.has(b.mob.id)) continue;
          if (a.mob.def.kind !== b.mob.def.kind) continue;
          const dx = a.mob.position.x - b.mob.position.x;
          const dy = a.mob.position.y - b.mob.position.y;
          const dz = a.mob.position.z - b.mob.position.z;
          const d = Math.hypot(dx, dy, dz);
          if (!canBreed(a.love, b.love, d, worldTick)) continue;
          consumed.add(a.mob.id);
          consumed.add(b.mob.id);
          lovingMobs.set(a.mob.id, onBreedComplete(a.love, worldTick));
          lovingMobs.set(b.mob.id, onBreedComplete(b.love, worldTick));
          mobRenderer.setMobName(a.mob.id, a.mob.def.kind);
          mobRenderer.setMobName(b.mob.id, b.mob.def.kind);
          const midx = (a.mob.position.x + b.mob.position.x) * 0.5;
          const midy = (a.mob.position.y + b.mob.position.y) * 0.5;
          const midz = (a.mob.position.z + b.mob.position.z) * 0.5;
          const baby = mobWorld.spawn(a.mob.def.kind, { x: midx, y: midy, z: midz });
          babyMobs.set(baby.id, { ageTicks: 0, isBaby: true });
          mobRenderer.setMobScale(baby.id, 0.5);
          xpOrbs.spawn(midx, midy + 0.5, midz, 1 + Math.floor(Math.random() * 7));
          chatInput.addLine(`A baby ${a.mob.def.kind} was born!`, '#ff80c0');
          break;
        }
      }
      for (const [mobId, love] of lovingMobs) {
        if (!isInLove(love, worldTick) && worldTick >= love.breedCooldownUntilTick) {
          lovingMobs.delete(mobId);
          const m = mobById.get(mobId);
          if (m) mobRenderer.setMobName(mobId, m.def.kind);
        }
      }
    }
  }
  if (!tickFrozen)
    mobWorld.tick(dtSec * tickRateMultiplier, {
      isSolid,
      isFluid,
      // Spectator: hide the player position from mob aggro entirely.
      // Vanilla MC mobs ignore spectators (no detection, no chase).
      // Without this, mobs still tracked + chased the spectator's body
      // even though the body was passing through walls and dealing no
      // damage — wasted CPU on a target that can't be engaged.
      playerPos:
        gameMode === 'spectator' ? null : { x: fp.position.x, y: fp.position.y, z: fp.position.z },
      playerSneaking: fp.input.sneak,
      playerInvisible: playerState.effects.has('invisibility'),
      damagePlayer: (amt, attackerPos) => {
        const scaled = amt * mobDamageMultiplier;
        const armorPts = computeArmorPoints();
        const toughnessPts = computeArmorToughness();
        const finalDmg = armorPts > 0 ? armorReducedDamage(scaled, armorPts, toughnessPts) : scaled;
        if (finalDmg > 0) {
          playerState.takeDamage({ amount: finalDmg, source: 'mob' });
          if (armorPts > 0) consumeArmorDurability(scaled);
          if (attackerPos) {
            const angle = damageTiltAngle({
              attackerX: attackerPos.x,
              attackerZ: attackerPos.z,
              playerX: fp.position.x,
              playerZ: fp.position.z,
              playerYaw: fp.yaw,
            });
            fp.pulseDamageTilt(angle);
            // Knockback: push player away from attacker. Vanilla mob hit
            // imparts ~0.4 horizontal + 0.4 vertical kick (modulated by
            // knockback resistance, which we don't track yet). Without
            // this, mobs felt completely weightless — you'd take damage
            // but never get pushed back, so you could outrun zombies
            // by walking into them.
            const dx = fp.position.x - attackerPos.x;
            const dz = fp.position.z - attackerPos.z;
            const horiz = Math.hypot(dx, dz);
            if (horiz > 0.0001) {
              const KB = 6.0;
              fp.velocity.x += (dx / horiz) * KB;
              fp.velocity.z += (dz / horiz) * KB;
              fp.velocity.y = Math.max(fp.velocity.y, 4.0);
            }
          }
        }
        if (!playerState.invulnerable && scaled > 0) sfx.play('hit');
      },
      onCreeperExplode: (x, y, z) => {
        // mobGriefing=false: creepers explode but don't break terrain.
        if (gameRules.mobGriefing) {
          explodeAt(Math.floor(x), Math.floor(y), Math.floor(z), 3);
        } else {
          // Visual-only burst.
          for (let i = 0; i < 12; i++)
            blockParticles.emitBreak(Math.floor(x), Math.floor(y), Math.floor(z), [220, 220, 220]);
          screenShake.pulse(0.4);
        }
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
  mobRenderer.sync(mobWorld.all(), camera.position);

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
  for (const v of waypoints.values()) {
    markers.push({ x: v.x, z: v.z, color: '#80c0ff', size: 3 });
  }
  minimap.tick(dtSec, fp.position.x, fp.position.z, world, registry, generator, markers);
  droppedItems.tick(
    dtSec,
    isSolid,
    // Sneak suppresses pickup (stand over an item without grabbing it).
    // Spectator suppresses pickup entirely — vanilla spectators are
    // observers, not collectors. Pass an unreachable far position so the
    // tick treats the player as out of range for the magnetic grab.
    fp.input.sneak || gameMode === 'spectator' ? { x: -9999, y: 0, z: 0 } : fp.position,
    (out) => {
      // Preserve damage on pickup. Was hard-coded to 0, so dropping a
      // 50% durability tool and walking back over it healed it for free.
      const leftover = inventory.add({
        itemId: out.itemId,
        count: out.count,
        damage: out.damage ?? 0,
      });
      const taken = out.count - leftover;
      if (taken > 0) {
        sfx.play('click');
        const itemDef = itemRegistry.get(out.itemId);
        chatInput.addLine(`+ ${String(taken)} ${itemDef.name.replace(/^webmc:/, '')}`, '#d2ff80');
      }
      // Tell DroppedItems how much we couldn't accept; it'll either
      // delete the entity (leftover === 0) or reduce its count + re-arm
      // pickup delay (leftover > 0). Cleaner than the old re-spawn
      // workaround which created a new mesh + new id every full-inventory
      // attempt and slowly piled stacks at the player's feet.
      return leftover;
    },
  );
  xpOrbs.tick(
    dtSec,
    isSolid,
    gameMode === 'spectator' ? { x: -9999, y: 0, z: 0 } : fp.position,
    (xp) => {
      // Mending-style auto-repair: damaged held tool gets durability from XP first.
      let remaining = xp;
      const sel = inventory.hotbar[inventory.selectedHotbar];
      if (sel && sel.damage > 0) {
        const def = itemRegistry.get(sel.itemId);
        if (def.durability > 0) {
          const xpToFix = Math.min(remaining, Math.ceil(sel.damage / 2));
          const repair = xpToFix * 2;
          const newDamage = Math.max(0, sel.damage - repair);
          inventory.hotbar[inventory.selectedHotbar] = { ...sel, damage: newDamage };
          remaining -= xpToFix;
        }
      }
      if (remaining > 0) playerState.addXP(remaining);
      sfx.play('click');
    },
  );
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
    const totalDays = playerStats.playtimeSec / 600;
    toast.show(
      dayNight.isDay ? `Day ${String(dayCounter)}` : `Night falls (Day ${String(dayCounter)})`,
      dayNight.isDay ? '#ffd080' : '#80a0ff',
      1500,
    );
    chatInput.addLine(
      `${dayNight.isDay ? '☀' : '☾'} ${dayNight.isDay ? 'Morning' : 'Night'} of day ${String(dayCounter)} (lifetime ${totalDays.toFixed(1)} days)`,
      '#cccccc',
    );
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
      hostile: (() => {
        let n = 0;
        for (const m of mobWorld.all())
          if (m.def.behavior === 'hostile' || m.def.behavior === 'creeper') n++;
        return n;
      })(),
      passive: (() => {
        let n = 0;
        for (const m of mobWorld.all()) if (m.def.behavior === 'passive') n++;
        return n;
      })(),
      drops: droppedItems.size,
      xpOrbs: xpOrbs.size,
      seed: WORLD_SEED,
      biome:
        generator.biomeAt(Math.floor(fp.position.x), Math.floor(fp.position.z)) === 1
          ? 'forest'
          : 'plains',
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
      `FPS ${stats.fps.toFixed(0).padStart(3)} (p95 ${p95Fps(fpsStats).toFixed(0)})  frame ${stats.frameMs.toFixed(1)}ms  ${clock} ${phaseOfDay(Math.floor(dayNight.timeOfDay * 24000))}  d${String(dayCounter)} ${MOON_GLYPHS[moonPhase(dayCounter)] ?? ''}\n` +
      `pos ${fp.position.x.toFixed(1)} ${fp.position.y.toFixed(1)} ${fp.position.z.toFixed(1)}  ${(() => {
        if (!worldMeta) return '';
        const dx = fp.position.x - worldMeta.spawn.x;
        const dz = fp.position.z - worldMeta.spawn.z;
        return `(${Math.hypot(dx, dz).toFixed(0)}m from spawn)`;
      })()}\n` +
      `HP ${playerState.health.toFixed(0)}/20${playerState.absorption > 0 ? `+${playerState.absorption.toFixed(0)}` : ''}  food ${playerState.hunger.toFixed(0)}/20  mobs ${mobWorld.size}${roomCode ? `  room ${roomCode}` : ''}\n` +
      `${gameMode} · ${hotbar.selected?.name ?? '?'} · chunks ${chunkRenderer.meshCount}${aimedBlock ? `  → ${aimedBlock}` : ''}${effectStr ? `\nfx${effectStr}` : ''}`;
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

if (import.meta.env.DEV) {
  console.info('[webmc] boot ok', rendererInfo);
}
