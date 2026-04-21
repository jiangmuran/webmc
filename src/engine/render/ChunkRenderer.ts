import * as THREE from 'three';
import { SUBCHUNK_DIM } from '@/world/SubChunk';
import type { MesherResponse } from '@/world/workers/mesher.protocol';
import { createChunkMaterial } from './ChunkShader';

export function chunkKey(cx: number, cy: number, cz: number): string {
  return `${cx.toString()},${cy.toString()},${cz.toString()}`;
}

export class ChunkRenderer {
  readonly group = new THREE.Group();
  private readonly material: THREE.ShaderMaterial;
  private readonly meshes = new Map<string, THREE.Mesh>();

  constructor(material: THREE.ShaderMaterial = createChunkMaterial()) {
    this.material = material;
    this.group.name = 'webmc-chunk-group';
  }

  get meshCount(): number {
    return this.meshes.size;
  }

  get triangleCount(): number {
    let total = 0;
    for (const m of this.meshes.values()) {
      const idx = m.geometry.getIndex();
      if (idx) total += idx.count / 3;
    }
    return total;
  }

  apply(response: MesherResponse): void {
    const key = chunkKey(response.cx, response.cy, response.cz);
    const old = this.meshes.get(key);
    if (old) {
      old.geometry.dispose();
      this.group.remove(old);
      this.meshes.delete(key);
    }
    if (response.quadCount === 0) return;

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(response.positions, 3));
    geom.setAttribute('normal', new THREE.BufferAttribute(response.normals, 3, true));
    geom.setAttribute('color', new THREE.BufferAttribute(response.colors, 4, true));
    geom.setIndex(new THREE.BufferAttribute(response.indices, 1));
    geom.boundingSphere = new THREE.Sphere(
      new THREE.Vector3(SUBCHUNK_DIM / 2, SUBCHUNK_DIM / 2, SUBCHUNK_DIM / 2),
      SUBCHUNK_DIM * Math.sqrt(3),
    );

    const mesh = new THREE.Mesh(geom, this.material);
    mesh.position.set(
      response.cx * SUBCHUNK_DIM,
      response.cy * SUBCHUNK_DIM,
      response.cz * SUBCHUNK_DIM,
    );
    mesh.name = `chunk-${key}`;
    this.meshes.set(key, mesh);
    this.group.add(mesh);
  }

  remove(cx: number, cy: number, cz: number): void {
    const key = chunkKey(cx, cy, cz);
    const m = this.meshes.get(key);
    if (!m) return;
    m.geometry.dispose();
    this.group.remove(m);
    this.meshes.delete(key);
  }

  clear(): void {
    for (const m of this.meshes.values()) {
      m.geometry.dispose();
      this.group.remove(m);
    }
    this.meshes.clear();
  }
}
