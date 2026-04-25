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
import { SubtitleView } from './ui/SubtitleView';
import { BossBarView } from './ui/BossBarView';
import { ScoreboardSidebarView } from './ui/ScoreboardSidebarView';
import { AchievementToastView } from './ui/AchievementToastView';
import { LoadingOverlay } from './ui/LoadingOverlay';
import { ActiveEffectsHud } from './ui/ActiveEffectsHud';
import { AudioBus } from './engine/audio/AudioBus';
import { openIndexedDB } from './persist/db';
import { ChunkStore } from './persist/ChunkStore';
import { CURRENT_SCHEMA_VERSION, type WorldMeta } from './persist/types';
import { RoomClient } from './net/RoomClient';
import { ItemRegistry } from './items/item';
import { Inventory } from './items/Inventory';
import { ARMOR_DEFS } from './items/armor';
import { reducedDamage as armorReducedDamage } from './game/armor_damage_formula';
import { isAfk } from './game/afk_idle_kick';
import { critMultiplier } from './game/critical_hit';
import { computeKnockback } from './game/combat_knockback';
import { xpForOre } from './game/mining_xp_ore';
import { WORLD_CAPS as WORLD_MOB_CAPS } from './game/mob_cap_global';
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
import { tickUnderwater, type AmbientState as UnderwaterAmbientState } from './engine/audio/ambient_underwater';
import { BROWSER_CLIPBOARD } from './game/clipboard_util';
import { canSpawnPhantom } from './entities/phantom_day_despawn';
import { Weather as WeatherCycle } from './world/weather';
import { checkPosition as checkWorldBorder, makeWorldBorder, setSize as setBorderSize } from './world/world_border';
import { generateStrongholdPositions as strongholdsInRing } from './world/stronghold_locate';
import { beginSave, endSave, makeSaveState, markDirty as markSaveDirty, shouldSave } from './game/autosave_debounce';
import { ticksToBreak as breakTicksFor } from './game/break_speed';
import { searchRespawnSpot } from './game/bed_obstructed';
import { classify as classifyGpu, recommendedChunkRadius } from './engine/gpu_tier_detect';
import { maxRenderDistanceChunks, shouldPauseRender } from './engine/power_budget';
import { inThermalThrottle } from './engine/chunk_unload_strategy_thermal';
import { kindFor as kindForWeather } from './engine/weather_particles';
import { makeStats as makeFpsStats, onFrame as fpsFrame, p95Fps } from './engine/fps_counter';
import { pressureLevel as memPressureLevel } from './engine/memory_pressure';
import { toIntent as gamepadToIntent } from './engine/input/gamepad_mapping';
import { rumbleForDamage } from './engine/input/gamepad_rumble';
import { init as initGyro, onSample as onGyroSample, setEnabled as setGyroEnabled, type GyroSmoothed } from './engine/input/gyro_assist';
import { startPinch, updateFov, type PinchState } from './engine/input/touch_pinch_zoom';
import { BlockDropRegistry } from './items/block-drops';
import { RecipeRegistry } from './items/recipe';
import { registerDefaultRecipes } from './items/default-recipes';
import { PlayerState, xpToNext, BREATH_MAX_SEC } from './game/PlayerState';
import { MobWorld, MOB_DEFS } from './entities/mob';
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
      rendererName = String((gl as WebGL2RenderingContext).getParameter(
        (debugInfo as { UNMASKED_RENDERER_WEBGL: number }).UNMASKED_RENDERER_WEBGL,
      ) ?? '');
    }
    const maxTextureSize = (gl as WebGL2RenderingContext).getParameter(gl.MAX_TEXTURE_SIZE) as number;
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
    const result = onGyroSample(gyroState, { alpha: e.alpha, beta: e.beta ?? 0, gamma: e.gamma ?? 0 });
    gyroState = result.state;
    gyroYawAccum += result.yawDelta * 0.0035;
  });

  let pinch: PinchState | null = null;
  window.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      const t0 = e.touches[0]!;
      const t1 = e.touches[1]!;
      const d = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
      pinch = startPinch(fp.camera.fov, d);
    }
  }, { passive: true });
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2 && pinch) {
      const t0 = e.touches[0]!;
      const t1 = e.touches[1]!;
      const d = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
      pinch = updateFov(pinch, d);
      fp.setBaseFov(pinch.currentFov);
    }
  }, { passive: true });
  window.addEventListener('touchend', () => {
    if (pinch) pinch = null;
  }, { passive: true });
}

if (localStorage.getItem('webmc:settings') === null) {
  const recVD = recommendedChunkRadius(detectedGpuTier, !isMobileDevice);
  try {
    localStorage.setItem(
      'webmc:settings',
      JSON.stringify({ viewDistance: recVD, chunkUploadBudget: detectedGpuTier === 'low' ? 1 : detectedGpuTier === 'mid' ? 3 : 6 }),
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
const worldNameForUI = worldMeta.name;

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
// Extended food set from food_nutrition_table — every standard MC food.
itemRegistry.register({ name: 'webmc:carrot', maxStack: 64, durability: 0, hungerRestore: 3, saturation: 3.6 });
itemRegistry.register({ name: 'webmc:golden_apple', maxStack: 64, durability: 0, hungerRestore: 4, saturation: 9.6 });
itemRegistry.register({ name: 'webmc:enchanted_golden_apple', maxStack: 64, durability: 0, hungerRestore: 4, saturation: 9.6 });
itemRegistry.register({ name: 'webmc:golden_carrot', maxStack: 64, durability: 0, hungerRestore: 6, saturation: 14.4 });
itemRegistry.register({ name: 'webmc:honey_bottle', maxStack: 16, durability: 0, hungerRestore: 6, saturation: 1.2 });
itemRegistry.register({ name: 'webmc:mushroom_stew', maxStack: 1, durability: 0, hungerRestore: 6, saturation: 7.2 });
itemRegistry.register({ name: 'webmc:rabbit_stew', maxStack: 1, durability: 0, hungerRestore: 10, saturation: 12 });
itemRegistry.register({ name: 'webmc:pumpkin_pie', maxStack: 64, durability: 0, hungerRestore: 8, saturation: 4.8 });
itemRegistry.register({ name: 'webmc:rotten_flesh', maxStack: 64, durability: 0, hungerRestore: 4, saturation: 0.8 });
itemRegistry.register({ name: 'webmc:potato', maxStack: 64, durability: 0, hungerRestore: 1, saturation: 0.6 });
itemRegistry.register({ name: 'webmc:baked_potato', maxStack: 64, durability: 0, hungerRestore: 5, saturation: 6 });
itemRegistry.register({ name: 'webmc:poisonous_potato', maxStack: 64, durability: 0, hungerRestore: 2, saturation: 1.2 });
itemRegistry.register({ name: 'webmc:spider_eye', maxStack: 64, durability: 0, hungerRestore: 2, saturation: 3.2 });
itemRegistry.register({ name: 'webmc:chorus_fruit', maxStack: 64, durability: 0, hungerRestore: 4, saturation: 2.4 });
itemRegistry.register({ name: 'webmc:beetroot_soup', maxStack: 1, durability: 0, hungerRestore: 6, saturation: 7.2 });
itemRegistry.register({ name: 'webmc:dried_kelp', maxStack: 64, durability: 0, hungerRestore: 1, saturation: 0.6 });
itemRegistry.register({ name: 'webmc:sweet_berries', maxStack: 64, durability: 0, hungerRestore: 2, saturation: 0.4 });
itemRegistry.register({ name: 'webmc:glow_berries', maxStack: 64, durability: 0, hungerRestore: 2, saturation: 0.4 });
itemRegistry.register({ name: 'webmc:cooked_mutton', maxStack: 64, durability: 0, hungerRestore: 6, saturation: 9.6 });
itemRegistry.register({ name: 'webmc:cooked_rabbit', maxStack: 64, durability: 0, hungerRestore: 5, saturation: 6 });
itemRegistry.register({ name: 'webmc:cooked_cod', maxStack: 64, durability: 0, hungerRestore: 5, saturation: 6 });
itemRegistry.register({ name: 'webmc:cooked_salmon', maxStack: 64, durability: 0, hungerRestore: 6, saturation: 9.6 });
// 16 vanilla dyes — enables future dye-related recipes/crafting.
for (const dye of [
  'white_dye', 'orange_dye', 'magenta_dye', 'light_blue_dye',
  'yellow_dye', 'lime_dye', 'pink_dye', 'gray_dye',
  'light_gray_dye', 'cyan_dye', 'purple_dye', 'blue_dye',
  'brown_dye', 'green_dye', 'red_dye', 'black_dye',
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
itemRegistry.register({ name: 'webmc:shield', maxStack: 1, durability: 336 });
itemRegistry.register({ name: 'webmc:fishing_rod', maxStack: 1, durability: 64 });
itemRegistry.register({ name: 'webmc:flint_and_steel', maxStack: 1, durability: 64 });
itemRegistry.register({ name: 'webmc:compass', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:clock', maxStack: 64, durability: 0 });
itemRegistry.register({ name: 'webmc:totem_of_undying', maxStack: 1, durability: 0 });

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
    // Peaceful mode (or keepInventory=true) keeps inventory; snapshot+restore.
    if (mobDamageMultiplier === 0 || gameRules.keepInventory) {
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
      const safe = findSafeRespawnNear(playerSpawnPoint.x, playerSpawnPoint.y, playerSpawnPoint.z);
      if (safe) {
        fp.position.set(safe.x, safe.y, safe.z);
      } else {
        chatInput.addLine('Your home bed was missing or obstructed.', '#ffd080');
        const s = Math.max(generator.surfaceAt(0, 0), 62) + 4;
        fp.position.set(worldMeta.spawn.x, s, worldMeta.spawn.z);
      }
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
  { id: 'mountain', title: 'Above Sea Level (y > 100)', check: () => fp.position.y >= 100 },
  { id: 'caver', title: 'Spelunker (y < 30)', check: () => fp.position.y <= 30 },
  { id: 'hunter', title: 'Hunter (50 mobs killed)', check: () => playerStats.mobsKilled >= 50 },
  { id: 'demolisher', title: 'Demolisher (1000 blocks broken)', check: () => playerStats.blocksBroken >= 1000 },
  { id: 'iron_age', title: 'Iron Age', check: () => inventory.count(itemRegistry.byName('webmc:iron_ingot') ?? -1) >= 1 },
  { id: 'diamond_hunter', title: 'Diamond Hunter', check: () => inventory.count(itemRegistry.byName('webmc:diamond') ?? -1) >= 1 },
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
let underwaterAmbient: UnderwaterAmbientState = { submerged: false, ticksUntilNextLoop: 200, ticksUntilNextRare: 1000 };
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

window.addEventListener('mousemove', () => { lastInputTick = currentTickCount; }, { passive: true });
window.addEventListener('keydown', () => { lastInputTick = currentTickCount; }, { passive: true });
window.addEventListener('touchstart', () => { lastInputTick = currentTickCount; }, { passive: true });
function setWeather(w: 'clear' | 'rain' | 'thunder'): void {
  currentWeather = w;
  if (w === 'clear') {
    rain.setActive(false);
  } else {
    const biomeId = generator.biomeAt(Math.floor(fp.position.x), Math.floor(fp.position.z));
    const biomeName = biomeId === 1 ? 'forest' : 'plains';
    const temp = biomeTemperature(biomeName);
    const kind = kindForWeather({ raining: true, intensity: 1, biomeTemperature: temp });
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
  if (biome.includes('snow') || biome.includes('frozen') || biome.includes('ice') || biome.includes('taiga')) return 0.05;
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
  audio.play3D('break', fp.position.x + (Math.random() - 0.5) * 30, fp.position.y, fp.position.z + (Math.random() - 0.5) * 30);
  chatInput.addLine('⚡ Lightning strikes nearby!', '#e0e0ff');
  screenShake.pulse(0.35);
}

const mesherClient = createMesherClient();
const audio = new AudioBus({ masterVolume: 0.35 });
audio.attachUnlock(document.body);

function findSafeRespawnNear(x: number, y: number, z: number): { x: number; y: number; z: number } | null {
  const candidates: { x: number; y: number; z: number; solidBelow: boolean; airAt: boolean; airAbove: boolean }[] = [];
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
      subtitles.push(`Block broken: ${def.name.replace(/^webmc:/, '')}`, directionFromPlayer(bx + 0.5, bz + 0.5));
      blockParticles.emitBreak(bx, by, bz, def.color);
      // Mining XP for ores (matches MC: coal 0-2, iron 0 via smelt, diamond 3-7, redstone 1-5, lapis 2-5, emerald 3-7).
      if (gameMode === 'survival' || gameMode === 'adventure') {
        const xp = oreXp(def.name);
        if (xp > 0) xpOrbs.spawn(bx + 0.5, by + 0.5, bz + 0.5, xp);
      }
      const drops = gameRules.doTileDrops ? dropRegistry.drops(prevBlockId, undefined, 99) : [];
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
      markSaveDirty(autosaveState);
      if (gameMode === 'survival' || gameMode === 'adventure') {
        playerState.addExhaustion(0.005);
        consumeHeldToolDurability(1);
      }
      if (def.name === 'webmc:oak_log') fireTutorial('collected_log');
      if (def.name === 'webmc:cobblestone' || def.name === 'webmc:cobble') fireTutorial('collected_cobblestone');
    },
    onPlace: (bx, by, bz) => {
      audio.play3D('place', bx + 0.5, by + 0.5, bz + 0.5);
      sfx.play('place');
      const sel = hotbar.selected;
      const blockId = sel ? stateId(sel.state) : 0;
      if (sel) {
        const def = registry.get(stateId(sel.state));
        subtitles.push(`Block placed: ${def.name.replace(/^webmc:/, '')}`, directionFromPlayer(bx + 0.5, bz + 0.5));
        blockParticles.emitPlace(bx, by, bz, def.color);
        if (gameMode === 'survival' || gameMode === 'adventure') {
          const itemId = itemRegistry.byName(def.name);
          if (itemId !== undefined) consumeInventoryItem(itemId, 1);
        }
      }
      touchWorldEdit(bx, by, bz, blockId);
      hand.swing();
      playerStats.blocksPlaced++;
      markSaveDirty(autosaveState);
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
window.addEventListener('mousemove', (e) => {
  if (document.pointerLockElement !== canvas) return;
  hand.applyMouseDelta(e.movementX, e.movementY);
});

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
    // Attack cooldown (1.9+ combat): scale damage by charge fraction.
    const sinceMs = nowMs - lastPlayerAttackAt;
    const charge = Math.min(1, sinceMs / 400);
    const damageMult = 0.2 + 0.8 * (charge * charge);
    if (sinceMs < 60) return; // hard floor on click rate
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
    // Weapon tier damage (held item determines base).
    let weaponBase = 1; // fist
    const heldName = hotbar.selected?.name.toLowerCase() ?? '';
    if (heldName.includes('sword')) {
      if (heldName.includes('netherite')) weaponBase = 8;
      else if (heldName.includes('diamond')) weaponBase = 7;
      else if (heldName.includes('iron')) weaponBase = 6;
      else if (heldName.includes('stone')) weaponBase = 5;
      else weaponBase = 4; // wood/gold
    } else if (heldName.includes('axe')) {
      if (heldName.includes('netherite')) weaponBase = 10;
      else if (heldName.includes('iron') || heldName.includes('stone') || heldName.includes('diamond')) weaponBase = 9;
      else weaponBase = 7;
    }
    const baseDmg = Math.max(0, (weaponBase + strengthBonus + weaknessReduce)) * damageMult * critMult;
    if (critMult > 1) subtitles.push('Critical hit!');
    const result = mobWorld.damage(bestId, baseDmg);
    if (gameMode === 'survival' || gameMode === 'adventure') {
      playerState.addExhaustion(0.1);
      // Sword takes 1 durability per hit; axe takes 2.
      const heldNow = hotbar.selected?.name.toLowerCase() ?? '';
      if (heldNow.includes('sword')) consumeHeldToolDurability(1);
      else if (heldNow.includes('axe')) consumeHeldToolDurability(2);
    }
    sfx.play('hit');
    interaction.setHeld(null);
    screenShake.pulse(0.15);
    hand.swing();
    if (result) damageNumbers.spawn(result.position.x, result.position.y + 0.8, result.position.z, baseDmg);
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
const bootTime = performance.now();
let lastXpLevel = 0;
let lastIsDay = true;
let lastPhase: 'dawn' | 'day' | 'dusk' | 'night' = 'day';
let dayCounter = 1;
let lastSleepDay = 0;
let lastPhantomCheckMs = 0;
let tickFrozen = false;
let lastDeathPos: { x: number; y: number; z: number } | null = null;
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
      const useChain = text.includes(';');
      const exec = useChain ? executeCommands : executeCommand;
      exec(text, {
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
        showTitle: (text, color, durMs) => { toast.show(text, color ?? '#ffffff', durMs ?? 2000); },
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
          for (const def of registry.defs) {
            if (def.name === 'webmc:air') continue;
            const id = itemRegistry.byName(def.name);
            if (id === undefined) continue;
            inventory.add({ itemId: id, count: 1, damage: 0 });
            n++;
          }
          return n;
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
        sortInventory: () => {
          inventory.sortMain();
        },
        toggleScoreboard: () => scoreboard.toggle(),
        setTickFrozen: (frozen) => { tickFrozen = frozen; },
        isTickFrozen: () => tickFrozen,
        getTpsStats: () => ({
          tps: tpsTracker.tps(),
          p50ms: tpsTracker.percentile(0.5),
          p95ms: tpsTracker.percentile(0.95),
          lagging: tpsTracker.isLagging(),
        }),
        getLastDeathPos: () => lastDeathPos,
        setWorldBorder: (d) => { setBorderSize(worldBorder, d); },
        getWorldBorder: () => worldBorder.diameter,
        setHardcore: (on) => {
          hardcoreMode = on;
          void persistDB.setMeta('hardcore', on);
        },
        isHardcore: () => hardcoreMode,
        setWaypoint: (name, x, y, z) => {
          waypoints.set(name, { x, y, z });
          persistWaypoints();
        },
        getWaypoint: (name) => waypoints.get(name) ?? null,
        listWaypoints: () => Array.from(waypoints, ([name, v]) => ({ name, x: v.x, y: v.y, z: v.z })),
        removeWaypoint: (name) => {
          const ok = waypoints.delete(name);
          if (ok) persistWaypoints();
          return ok;
        },
        locateStructure: (kind) => {
          if (kind !== 'stronghold') return null;
          // Use the first ring of strongholds (3 positions) deterministic from world seed.
          const positions = strongholdsInRing(WORLD_SEED, 0);
          if (positions.length === 0) return null;
          let best: { x: number; z: number; dist: number } | null = null;
          for (const p of positions) {
            const d = Math.hypot(p.x - fp.position.x, p.z - fp.position.z);
            if (!best || d < best.dist) best = { x: p.x, z: p.z, dist: d };
          }
          return best;
        },
        rollLootTable: (table) => {
          const tables: Record<string, ReadonlyArray<{ id: string; w: number }>> = {
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
          let best: { mob: typeof mobWorld extends { all(): IterableIterator<infer M> } ? M : never; dist: number } | null = null;
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
        toggleGyro: () => {
          gyroState = setGyroEnabled(gyroState, !gyroState.enabled);
          if (gyroState.enabled && typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === 'function') {
            void (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission().catch(() => undefined);
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
          input.addEventListener('change', () => {
            const f = input.files?.[0];
            input.remove();
            if (!f) return;
            chatInput.addLine(`Detecting format of ${f.name} (${(f.size / 1024).toFixed(1)} kB)…`, '#cccccc');
            if (f.name.endsWith('.mca') || f.name.endsWith('.dat')) {
              chatInput.addLine('Detected Anvil region/level. Native import scaffold present (full NBT decode TBD).', '#ffd080');
              chatInput.addLine('User uploads at own licensing risk; webmc never ships Mojang data.', '#888888');
            } else if (f.name.endsWith('.webmc')) {
              chatInput.addLine('webmc save detected. Use Main Menu → Import to load.', '#80ff80');
            } else if (f.name.endsWith('.zip')) {
              chatInput.addLine('ZIP: drop in resource-pack uploader for textures or main-menu import for save.', '#ffd080');
            } else {
              chatInput.addLine(`Unknown format: ${f.name}`, '#ff8080');
            }
          }, { once: true });
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
                const x = px + dx, y = py + dy, z = pz + dz;
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
  getCompletions: (input) => {
    if (!input.startsWith('/')) return [];
    const SLASH_CMDS = [
      '/help', '/gamemode', '/gm', '/tp', '/teleport', '/time', '/weather',
      '/give', '/heal', '/kill', '/clear', '/setblock', '/fill', '/summon',
      '/chest', '/spawn', '/seed', '/killall', '/stats', '/save', '/setspawn',
      '/spawnpoint', '/setworldspawn', '/clearchat', '/cc', '/me', '/list',
      '/whoami', '/fly', '/pos', '/where', '/biome', '/effect', '/listeffects',
      '/particle', '/difficulty', '/achievements', '/ach', '/find', '/findmob',
      '/lookup', '/listblocks', '/listmobs', '/lookat', '/destroy', '/back',
      '/freeze', '/unfreeze', '/mute', '/unmute', '/title', '/echo', '/repeat',
      '/random', '/roll', '/coin', '/flip', '/8ball', '/uptime', '/version',
      '/v', '/ping', '/day', '/sun', '/night', '/moon', '/noon', '/midnight',
      '/up', '/down', '/distance', '/dist', '/gamerule', '/sort', '/scoreboard', '/sb', '/gyro', '/tilt', '/copy', '/import', '/milk', '/tick', '/tps', '/deathloc', '/lastdeath', '/rename', '/nametag', '/worldborder', '/wb', '/loot', '/locate', '/waypoint', '/wp', '/hardcore',
    ];
    return SLASH_CMDS;
  },
  getPlayerName: () => currentPlayerName,
  onMention: () => sfx.play('click'),
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
    (fp as unknown as { opts: { lookSensitivity: number } }).opts.lookSensitivity = v.mouseSensitivity;
    fp.invertY = v.invertY;
    fp.sprintToggle = v.sprintToggle;
    brightnessMul = v.brightness;
    if (v.showCrosshair) crosshair.show(); else crosshair.hide();
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
    fireTutorial('world_loaded');
    fireTutorial('spawn_finished');
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
  onEat: (id, hungerRestore, saturation) => {
    playerState.eat(hungerRestore, saturation);
    sfx.play('click');
    // Item-specific food effects.
    const itemName = itemRegistry.get(id).name;
    if (itemName === 'webmc:honey_bottle') {
      playerState.effects.delete('poison');
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
      // Random teleport ±8 blocks.
      const tx = fp.position.x + (Math.random() - 0.5) * 16;
      const tz = fp.position.z + (Math.random() - 0.5) * 16;
      const ty = Math.max(generator.surfaceAt(Math.floor(tx), Math.floor(tz)) + 2, fp.position.y);
      fp.position.set(tx, ty, tz);
      subtitles.push('Chorus warp');
    }
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
        world.set(x, y, z, airState);
        if (explosionDrops(radius)) {
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
  return xpForOre(blockName.replace(/^webmc:/, ''), Math.random, false);
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
  fpsFrame(fpsStats, stats.frameMs);
  tpsTracker.pushMspt(stats.frameMs);
  currentTickCount++;
  const afkOn = isAfk({ lastInputTick, currentTick: currentTickCount, idleKickEnabled: false });
  if (afkOn !== (afkBadge.style.display === 'block')) {
    afkBadge.style.display = afkOn ? 'block' : 'none';
  }
  const perfMem = (performance as Performance & { memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
  if (perfMem) {
    const lvl = memPressureLevel({ heapUsed: perfMem.usedJSHeapSize, heapLimit: perfMem.jsHeapSizeLimit });
    if (lvl === 'critical' && performance.now() - lastMemoryWarnAt > 30000) {
      lastMemoryWarnAt = performance.now();
      toast.show('High memory pressure — flushing chunks', '#ffd080', 3000);
      void chunkStore.flush();
    }
  }
  const now = performance.now();
  const dtSec = Math.min(stats.frameMs / 1000, 0.1);
  if (perfMonitor.tick(dtSec)) {
    let qualityLimit = perfMonitor.quality;
    if (isMobileDevice) {
      const powerLimit = maxRenderDistanceChunks(
        { batteryLevel: powerState.batteryLevel, charging: powerState.charging, thermalState: 'nominal' },
        false,
      );
      qualityLimit = Math.min(qualityLimit, powerLimit);
    }
    // Thermal-throttle: shrink view radius if FPS p95 < 25 or low battery (chunk_unload_strategy_thermal).
    if (inThermalThrottle({ cpuTempCelsius: 50, fpsP95: p95Fps(fpsStats), battery: powerState.batteryLevel })) {
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
  if (shouldPauseRender({ batteryLevel: powerState.batteryLevel, charging: powerState.charging, thermalState: 'nominal' })) {
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
  }

  if (gyroYawAccum !== 0) {
    fp.yaw -= gyroYawAccum;
    gyroYawAccum = 0;
  }

  // MC sprint rule: cannot sprint if hunger ≤ 6.
  if (fp.input.sprint && playerState.hunger <= 6 && (gameMode === 'survival' || gameMode === 'adventure')) {
    fp.input.sprint = false;
  }
  if (fp.input.sprint && (gameMode === 'survival' || gameMode === 'adventure')) {
    // Sprint exhaustion: 0.1 per meter sprinted. Approximate via dtSec * 5 m/s.
    playerState.addExhaustion(0.1 * dtSec * 5);
  }

  // Gamepad poll (Xbox-style mapping). Honors pointer-lock equivalent: only
  // applies when no menus are open and the player is not in chat.
  if (typeof navigator.getGamepads === 'function' && !chatInput.isOpen() && !pauseMenu.isVisible()) {
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
  // Auto weather cycle (gated by gamerule).
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
              mobWorld.spawn('zombified_piglin' as Parameters<typeof mobWorld.spawn>[0], target.position);
              mobWorld.remove(target.id);
            } catch { /* zombified_piglin not registered */ }
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
  let stepMat: 'wood' | 'stone' | 'gravel' | 'grass' | 'sand' | 'snow' | 'wool' | 'metal' | 'water' | undefined;
  if (fp.onGround) {
    const fname = registry.get(stateId(world.get(Math.floor(fp.position.x), Math.floor(fp.position.y - 1.05), Math.floor(fp.position.z)))).name;
    if (fname.includes('log') || fname.includes('plank')) stepMat = 'wood';
    else if (fname.includes('stone') || fname.includes('cobble') || fname.includes('brick')) stepMat = 'stone';
    else if (fname.includes('gravel')) stepMat = 'gravel';
    else if (fname.includes('sand')) stepMat = 'sand';
    else if (fname.includes('snow')) stepMat = 'snow';
    else if (fname.includes('wool')) stepMat = 'wool';
    else if (fname.includes('iron') || fname.includes('gold') || fname.includes('copper')) stepMat = 'metal';
    else if (fname.includes('grass') || fname.includes('dirt')) stepMat = 'grass';
  } else if (fp.inFluid === 'water') {
    stepMat = 'water';
  }
  sfx.footstepIfMoving(fp.onGround && horizSpeed > 1.2 && !fp.input.fly, dtSec, stepMat);
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
  // Speed effect adjusts walk speed (amplifier 0 = +20%, 1 = +40%, ...)
  const speedEff = playerState.effects.get('speed');
  const slowEff = playerState.effects.get('slowness');
  let mul = 1;
  if (speedEff) mul *= 1 + 0.2 * (speedEff.amplifier + 1);
  if (slowEff) mul *= Math.max(0.15, 1 - 0.15 * (slowEff.amplifier + 1));
  fp.speedMultiplier = mul;
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
  const invisible = playerState.effects.has('invisibility');
  playerAvatar.setVisible(cameraMode !== 'fp' && !invisible);
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

  if (fp.lastLandFallBlocks > 3 && (gameMode === 'survival' || gameMode === 'adventure') && gameRules.fallDamage) {
    const slowFalling = playerState.effects.has('slow_falling');
    let dmg = slowFalling ? 0 : fp.lastLandFallBlocks - 3;
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
    playerState.takeDamage({ amount: 4, source: 'void' });
  }

  if (gameMode === 'survival' || gameMode === 'adventure') {
    const wb = checkWorldBorder(worldBorder, fp.position.x, fp.position.z);
    if (!wb.insideBorder && wb.damagePerSec > 0) {
      playerState.takeDamage({ amount: wb.damagePerSec * dtSec, source: 'void' });
    }
  }

  if (gameMode === 'survival' || gameMode === 'adventure') {
    const headX = Math.floor(fp.position.x);
    const headY = Math.floor(fp.position.y + 1.55);
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
      if (belowDef.name === 'webmc:magma_block' && !fp.input.sneak && !playerState.effects.has('fire_resistance')) {
        playerState.takeDamage({ amount: 1 * dtSec, source: 'fire' });
      }
      // Soul sand slows player to 60% horizontal velocity (matches MC).
      if (belowDef.name === 'webmc:soul_sand') {
        fp.velocity.x *= 0.6;
        fp.velocity.z *= 0.6;
      }
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
    // Totem of Undying: if held in hotbar, consume to revive at 1 HP + Regen II + Absorption II.
    const totemId = itemRegistry.byName('webmc:totem_of_undying');
    if (totemId !== undefined && countInventoryItem(totemId) > 0) {
      consumeInventoryItem(totemId, 1);
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
        toast.show('Respawned', '#80ffa0', 1200);
        playerState.justDied = false;
      } else if (!deathScreen.isVisible()) {
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
    if (typeof navigator.getGamepads === 'function') {
      const pad = (navigator.getGamepads() ?? []).find((p) => p && p.connected);
      const actuator = (pad as (Gamepad & { vibrationActuator?: { playEffect: (type: string, opts: object) => Promise<void> } }) | undefined)?.vibrationActuator;
      if (actuator) {
        const r = rumbleForDamage(delta);
        void actuator.playEffect('dual-rumble', {
          duration: r.durationMs,
          strongMagnitude: r.highIntensity,
          weakMagnitude: r.lowIntensity,
        }).catch(() => undefined);
      }
    }
  }
  subtitles.tick();
  achievementToast.tick();
  activeEffectsHud.render(Array.from(playerState.effects, ([id, e]) => ({ id, amplifier: e.amplifier, remainingSec: e.remainingSec })));

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
      aimTint = (beh === 'hostile' || beh === 'creeper') ? 'rgba(255,140,140,0.9)' : 'rgba(160,255,160,0.9)';
      break;
    }
  }
  crosshair.setTint(aimTint);

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
    if (isSolid(px, yy, pz)) { skyBlocked = true; break; }
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
  underwaterAmbient = { ...underwaterAmbient, submerged: fp.inFluid === 'water' };
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
      const t = breakTicksFor({
        hardness: Math.max(0.1, def2.hardness),
        correctTool: true,
        toolSpeed: 1,
        onGround: fp.onGround,
        underwater: fp.inFluid === 'water',
        hasAquaAffinity: false,
        hasteLevel: hasteAmp + (hasteAmp > 0 ? 1 : 0),
        fatigueLevel: fatigueAmp + (fatigueAmp > 0 ? 1 : 0),
        efficiencyBonus: 0,
      });
      interaction.breakDurationSec = Math.min(5, Math.max(0.1, t / 20));
    }
  }

  // Autosave debouncer: 30s interval OR 64-edit threshold OR forced.
  const nowSaveMs = performance.now();
  if (shouldSave(autosaveState, { nowMs: nowSaveMs, trigger: 'timer' }) ||
      shouldSave(autosaveState, { nowMs: nowSaveMs, trigger: 'threshold' })) {
    beginSave(autosaveState, nowSaveMs);
    void chunkStore.flush().finally(() => endSave(autosaveState));
  }
  crosshair.setCooldown((performance.now() - lastPlayerAttackAt) / 400);

  // Boss bar: nearest mob with maxHealth >= 40 within 32 blocks
  let bossM: typeof bossCandidate | null = null;
  let bossDistSq = 32 * 32;
  type BossCandidate = { name: string; health: number; maxHealth: number; kind: string };
  let bossCandidate: BossCandidate | null = null;
  for (const m of mobWorld.all()) {
    if (m.def.maxHealth < 40) continue;
    const dx = m.position.x - fp.position.x;
    const dz = m.position.z - fp.position.z;
    const d2 = dx * dx + dz * dz;
    if (d2 > bossDistSq) continue;
    bossDistSq = d2;
    bossCandidate = { name: m.def.kind, health: m.health, maxHealth: m.def.maxHealth, kind: m.def.kind };
    bossM = bossCandidate;
  }
  if (bossM) {
    const color = bossM.kind === 'ender_dragon' ? 'purple' : bossM.kind === 'warden' ? 'red' : bossM.kind === 'wither' ? 'red' : 'pink';
    bossBar.set({
      name: bossM.name,
      hp: bossM.health,
      maxHp: bossM.maxHealth,
      color,
      style: 'progress',
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
  fluidOverlay.set(fp.inFluid);

  // Underwater fog: shorten render distance and tint when submerged.
  if (scene.fog instanceof THREE.Fog) {
    if (fp.inFluid === 'water') {
      scene.fog.color.setRGB(0.24, 0.4, 0.6);
      scene.fog.near = 1;
      scene.fog.far = 20;
    } else if (!fp.inFluid && scene.fog.far <= 20.1) {
      // Restore based on view distance (handled elsewhere on settings change).
      scene.fog.near = (loader.viewRadius ?? 6) * 16 * 0.6;
      scene.fog.far = (loader.viewRadius ?? 6) * 16;
    }
  }
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
  if (chunkRenderer.meshCount > 20 && mobDamageMultiplier > 0 && gameRules.doMobSpawning && !(overHostileCap && overPassiveCap)) {
    // Despawn mobs >128 blocks away from player to bound entity count.
    const farMobs: number[] = [];
    for (const m of mobWorld.all()) {
      const dx = m.position.x - fp.position.x;
      const dz = m.position.z - fp.position.z;
      if (dx * dx + dz * dz > 128 * 128) farMobs.push(m.id);
    }
    for (const id of farMobs) mobWorld.remove(id);

    spawnSystem.tick(dtSec, mobWorld, {
      playerPos: { x: fp.position.x, y: fp.position.y, z: fp.position.z },
      isDay: dayNight.isDay,
      surfaceAt: (x, z) => generator.surfaceAt(x, z),
      isSolid,
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
          if (cur >= 30_000) toConvert.push({ id: m.id, pos: { x: m.position.x, y: m.position.y, z: m.position.z } });
        } else if (zombieDrownTimers.has(m.id)) {
          zombieDrownTimers.delete(m.id);
        }
      }
      for (const c of toConvert) {
        try {
          mobWorld.spawn('drowned' as Parameters<typeof mobWorld.spawn>[0], c.pos);
          mobWorld.remove(c.id);
          zombieDrownTimers.delete(c.id);
          subtitles.push('Zombie drowned');
        } catch { /* drowned not registered */ }
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
        if (isSolid(px2, yy, pz2)) { inSky = false; break; }
      }
      if (canSpawnPhantom({
        daysSinceSleep,
        worldTick: Math.floor(dayNight.timeOfDay * 24000),
        playerInSkyView: inSky,
        rand: Math.random,
      })) {
        try {
          mobWorld.spawn('phantom' as Parameters<typeof mobWorld.spawn>[0], {
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

  if (!tickFrozen) mobWorld.tick(dtSec, {
    isSolid,
    playerPos: { x: fp.position.x, y: fp.position.y, z: fp.position.z },
    damagePlayer: (amt) => {
      const scaled = amt * mobDamageMultiplier;
      const armorPts = computeArmorPoints();
      const toughnessPts = computeArmorToughness();
      const finalDmg = armorPts > 0 ? armorReducedDamage(scaled, armorPts, toughnessPts) : scaled;
      if (finalDmg > 0) {
        playerState.takeDamage({ amount: finalDmg, source: 'mob' });
        if (armorPts > 0) consumeArmorDurability(scaled);
      }
      if (!playerState.invulnerable && scaled > 0) sfx.play('hit');
    },
    onCreeperExplode: (x, y, z) => {
      // mobGriefing=false: creepers explode but don't break terrain.
      if (gameRules.mobGriefing) {
        explodeAt(Math.floor(x), Math.floor(y), Math.floor(z), 3);
      } else {
        // Visual-only burst.
        for (let i = 0; i < 12; i++) blockParticles.emitBreak(Math.floor(x), Math.floor(y), Math.floor(z), [220, 220, 220]);
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
      `FPS ${stats.fps.toFixed(0).padStart(3)} (p95 ${p95Fps(fpsStats).toFixed(0)})  frame ${stats.frameMs.toFixed(1)}ms  ${clock} ${phaseOfDay(Math.floor(dayNight.timeOfDay * 24000))}  d${String(dayCounter)} ${MOON_GLYPHS[moonPhase(dayCounter)] ?? ''}\n` +
      `pos ${fp.position.x.toFixed(1)} ${fp.position.y.toFixed(1)} ${fp.position.z.toFixed(1)}  ${(() => {
        if (!worldMeta) return '';
        const dx = fp.position.x - worldMeta.spawn.x;
        const dz = fp.position.z - worldMeta.spawn.z;
        return `(${Math.hypot(dx, dz).toFixed(0)}m from spawn)`;
      })()}\n` +
      `HP ${playerState.health.toFixed(0)}/20${playerState.absorption > 0 ? `+${playerState.absorption.toFixed(0)}` : ''}  food ${playerState.hunger.toFixed(0)}/20  mobs ${mobWorld.size}${roomCode ? `  room ${roomCode}` : ''}\n` +
      `${gameMode} · ${sel?.name ?? '?'} · chunks ${chunkRenderer.meshCount}${aimedBlock ? `  → ${aimedBlock}` : ''}${effectStr ? `\nfx${effectStr}` : ''}`;
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

if (import.meta.env.DEV) {
  console.info('[webmc] boot ok', rendererInfo);
}
