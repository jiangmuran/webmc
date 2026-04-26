import * as THREE from 'three';
import { SUBCHUNK_DIM } from '@/world/SubChunk';
import type { MesherResponse } from '@/world/workers/mesher.protocol';
import { createChunkMaterial } from './ChunkShader';

// Pack (cx, cy, cz) into a single safe-integer key. Mesh apply +
// remove are hot during chunk streaming; was a template-literal
// allocation per Map lookup. Pack: cx16 | cz16 | cy8 — fits well
// within Number.MAX_SAFE_INTEGER (2^53) for any sensible world size.
export function chunkKey(cx: number, cy: number, cz: number): number {
  const xc = (cx + 32768) & 0xffff;
  const zc = (cz + 32768) & 0xffff;
  const yc = cy & 0xff;
  return xc * 65536 + zc + yc * 4294967296;
}

// All sub-chunks have the same local bounding sphere (centered at the
// section midpoint, radius = half-diagonal). Allocate once and share —
// was a fresh Sphere + Vector3 per chunk apply().
const SHARED_CHUNK_BOUNDING_SPHERE = new THREE.Sphere(
  new THREE.Vector3(SUBCHUNK_DIM / 2, SUBCHUNK_DIM / 2, SUBCHUNK_DIM / 2),
  (SUBCHUNK_DIM * Math.sqrt(3)) / 2,
);

export class ChunkRenderer {
  readonly group = new THREE.Group();
  readonly material: THREE.ShaderMaterial;
  private readonly meshes = new Map<number, THREE.Mesh>();
  // Cached cumulative triangle count + per-key contribution. The old
  // triangleCount getter walked all meshes (500+ at 12-radius) on every
  // call — the debug HUD reads this at 5Hz, so 2500+ getIndex() calls
  // per second for nothing on most frames. Mesh count only changes on
  // apply/remove; track the delta there and read from cache.
  private _triangleCount = 0;
  private readonly trianglesByKey = new Map<number, number>();

  constructor(material: THREE.ShaderMaterial = createChunkMaterial()) {
    this.material = material;
    this.group.name = 'webmc-chunk-group';
    // Group is at world origin and never moves; skip three.js's per-frame
    // updateMatrix call. Mesh-level matrices are also frozen via
    // matrixAutoUpdate=false in apply().
    this.group.matrixAutoUpdate = false;
    this.group.updateMatrix();
  }

  get meshCount(): number {
    return this.meshes.size;
  }

  get triangleCount(): number {
    return this._triangleCount;
  }

  apply(response: MesherResponse): void {
    const key = chunkKey(response.cx, response.cy, response.cz);
    const old = this.meshes.get(key);
    if (old) {
      old.geometry.dispose();
      this.group.remove(old);
      this.meshes.delete(key);
      const oldTris = this.trianglesByKey.get(key) ?? 0;
      this._triangleCount -= oldTris;
      this.trianglesByKey.delete(key);
    }
    if (response.quadCount === 0) return;

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(response.positions, 3));
    geom.setAttribute('normal', new THREE.BufferAttribute(response.normals, 3, true));
    geom.setAttribute('color', new THREE.BufferAttribute(response.colors, 4, true));
    geom.setIndex(new THREE.BufferAttribute(response.indices, 1));
    geom.boundingSphere = SHARED_CHUNK_BOUNDING_SPHERE;

    const mesh = new THREE.Mesh(geom, this.material);
    mesh.position.set(
      response.cx * SUBCHUNK_DIM,
      response.cy * SUBCHUNK_DIM,
      response.cz * SUBCHUNK_DIM,
    );
    // Skip mesh.name — was a `chunk-${cx},${cy},${cz}` template
    // literal allocated per apply for debug introspection only;
    // three.js doesn't use it for rendering and chunk streaming
    // hits this path hundreds of times per second at startup.
    mesh.matrixAutoUpdate = false;
    mesh.updateMatrix();
    this.meshes.set(key, mesh);
    this.group.add(mesh);
    // 6 indices per quad = 2 triangles per quad.
    const tris = response.quadCount * 2;
    this.trianglesByKey.set(key, tris);
    this._triangleCount += tris;
  }

  remove(cx: number, cy: number, cz: number): void {
    const key = chunkKey(cx, cy, cz);
    const m = this.meshes.get(key);
    if (!m) return;
    m.geometry.dispose();
    this.group.remove(m);
    this.meshes.delete(key);
    const oldTris = this.trianglesByKey.get(key) ?? 0;
    this._triangleCount -= oldTris;
    this.trianglesByKey.delete(key);
  }

  clear(): void {
    for (const m of this.meshes.values()) {
      m.geometry.dispose();
      this.group.remove(m);
    }
    this.meshes.clear();
    this.trianglesByKey.clear();
    this._triangleCount = 0;
  }
}
