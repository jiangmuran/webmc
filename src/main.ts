import * as THREE from 'three';
import { FrameTimer } from './engine/time/FrameTimer';
import { FirstPersonCamera } from './engine/input/FirstPersonCamera';
import { ChunkRenderer } from './engine/render/ChunkRenderer';
import { type BlockState, AIR, makeState, stateId } from './blocks/state';
import { createDefaultRegistry } from './blocks/registry';
import { World } from './world/World';
import { CHUNK_HEIGHT } from './world/Chunk';
import { SUBCHUNK_DIM } from './world/SubChunk';
import {
  type BorderOpacity,
  createMesherClient,
  extractBorderFromSubChunk,
} from './world/workers/MesherClient';

const canvas = document.querySelector<HTMLCanvasElement>('#canvas');
const hudEl = document.querySelector<HTMLElement>('#hud');
if (!canvas || !hudEl) throw new Error('boot: #canvas or #hud missing');
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
scene.fog = new THREE.Fog(0x8db5f0, 60, 220);

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);

const registry = createDefaultRegistry();
const STONE = makeState(registry.byName('webmc:stone') ?? 1, 0);
const DIRT = makeState(registry.byName('webmc:dirt') ?? 2, 0);
const GRASS = makeState(registry.byName('webmc:grass_block') ?? 3, 0);
const COBBLE = makeState(registry.byName('webmc:cobblestone') ?? 4, 0);
const LOG = makeState(registry.byName('webmc:oak_log') ?? 5, 0);
const GLOW = makeState(registry.byName('webmc:glowstone') ?? 6, 0);

const isOpaque = (state: BlockState): boolean => {
  if (state === AIR) return false;
  return registry.get(stateId(state)).opaque;
};
const colorOf = (state: BlockState): readonly [number, number, number] =>
  registry.get(stateId(state)).color;
const isSolid = (x: number, y: number, z: number): boolean =>
  y >= 0 && y < CHUNK_HEIGHT && registry.get(stateId(world.get(x, y, z))).solid;

const world = new World();

function buildFlatDemo(): void {
  const GRID = 8;
  for (let cx = 0; cx < GRID; cx++) {
    for (let cz = 0; cz < GRID; cz++) {
      for (let lx = 0; lx < SUBCHUNK_DIM; lx++) {
        for (let lz = 0; lz < SUBCHUNK_DIM; lz++) {
          const wx = cx * SUBCHUNK_DIM + lx;
          const wz = cz * SUBCHUNK_DIM + lz;
          world.set(wx, 30, wz, STONE);
          world.set(wx, 31, wz, STONE);
          world.set(wx, 32, wz, DIRT);
          world.set(wx, 33, wz, DIRT);
          world.set(wx, 34, wz, GRASS);
          if ((wx * 31 + wz * 17) % 91 === 0) {
            world.set(wx, 35, wz, GLOW);
          } else if ((wx * 7 + wz * 11) % 37 === 0) {
            for (let h = 35; h < 39; h++) world.set(wx, h, wz, LOG);
          } else if ((wx * 13 + wz * 29) % 29 === 0) {
            for (let h = 35; h < 37; h++) world.set(wx, h, wz, COBBLE);
          }
        }
      }
    }
  }
}
buildFlatDemo();

const fp = new FirstPersonCamera(camera);
fp.position.set(SUBCHUNK_DIM * 4, 40, SUBCHUNK_DIM * 4);
fp.yaw = Math.PI;
fp.attach(canvas);

const chunkRenderer = new ChunkRenderer();
scene.add(chunkRenderer.group);

const mesherClient = createMesherClient();

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
  const sectionHere = here.section(cy);
  if (!sectionHere) return b;

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

async function meshAllDirty(): Promise<void> {
  const pending: Promise<void>[] = [];
  for (const chunk of world.chunks()) {
    for (const cy of chunk.meshDirty) {
      const section = chunk.section(cy);
      if (!section) continue;
      const borders = borderFor(chunk.cx, cy, chunk.cz);
      pending.push(
        mesherClient
          .mesh(chunk.cx, cy, chunk.cz, section, isOpaque, colorOf, borders)
          .then((response) => {
            chunkRenderer.apply(response);
          }),
      );
    }
    chunk.clearMeshDirty();
  }
  await Promise.all(pending);
}

for (const chunk of world.chunks()) {
  for (let cy = 0; cy < 24; cy++) {
    if (chunk.section(cy)) chunk.markMeshDirty(cy);
  }
}

void meshAllDirty();

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

function frame(): void {
  const stats = timer.tick();
  const dtSec = Math.min(stats.frameMs / 1000, 0.1);
  fp.update(dtSec, { isSolid });
  renderer.render(scene, camera);

  const look = fp.lookVector();
  hud.textContent =
    `webmc M1\n` +
    `${rendererInfo.gl}  ${rendererInfo.rend}\n` +
    `FPS ${stats.fps.toFixed(0).padStart(3)}  frame ${stats.frameMs.toFixed(1)}ms\n` +
    `pos ${fp.position.x.toFixed(1)} ${fp.position.y.toFixed(1)} ${fp.position.z.toFixed(1)}\n` +
    `look ${look.x.toFixed(2)} ${look.y.toFixed(2)} ${look.z.toFixed(2)}\n` +
    `chunks ${chunkRenderer.meshCount}  tris ${chunkRenderer.triangleCount}\n` +
    `${fp.input.fly ? 'fly' : 'walk'}  ${fp.onGround ? 'ground' : 'air'}  ${fp.input.sprint ? 'sprint' : ''}`;
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

if (import.meta.env.DEV) {
  console.info('[webmc] boot ok', rendererInfo);
}
