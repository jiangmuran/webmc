import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { AIR, makeState, stateId } from '@/blocks/state';
import { World } from '@/world/World';
import { createDefaultRegistry } from '@/blocks/registry';
import { InteractionController } from './Interaction';

const STONE = makeState(1, 0);

describe('InteractionController', () => {
  function build(): {
    world: World;
    controller: InteractionController;
    camera: THREE.PerspectiveCamera;
    setLook: (x: number, y: number, z: number) => void;
  } {
    const registry = createDefaultRegistry();
    const world = new World();
    for (let x = 0; x < 16; x++) {
      for (let z = 0; z < 16; z++) {
        world.set(x, 30, z, STONE);
      }
    }
    const camera = new THREE.PerspectiveCamera(70, 1, 0.1, 100);
    camera.position.set(8, 34, 8);
    const look = { x: 0, y: -1, z: 0 };
    const isSolid = (bx: number, by: number, bz: number): boolean =>
      registry.get(stateId(world.get(bx, by, bz))).solid;
    const controller = new InteractionController(camera, () => look, world, isSolid);
    return {
      world,
      controller,
      camera,
      setLook: (x, y, z) => {
        look.x = x;
        look.y = y;
        look.z = z;
      },
    };
  }

  it('castRay hits the first solid voxel along the look vector', () => {
    const { controller } = build();
    const hit = controller.castRay();
    expect(hit).not.toBeNull();
    expect(hit?.by).toBe(30);
  });

  it('break removes the block by setting it to AIR', () => {
    const { controller, world } = build();
    controller.selectedBlock = STONE;
    (controller as unknown as { held: string }).held = 'break';
    (controller as unknown as { act: (ms: number) => void }).act(0);
    expect(world.get(8, 30, 8)).toBe(AIR);
  });

  it('place adds the selected block on the hit face (camera moved to avoid player overlap)', () => {
    const { controller, camera, world } = build();
    camera.position.set(10, 34, 8);
    controller.selectedBlock = STONE;
    (controller as unknown as { held: string }).held = 'place';
    (controller as unknown as { act: (ms: number) => void }).act(0);
    expect(world.get(10, 31, 8)).toBe(STONE);
  });

  it('place refuses to overwrite a non-air block', () => {
    const { controller, camera, world } = build();
    camera.position.set(10, 34, 8);
    world.set(10, 31, 8, STONE);
    const mark = makeState(2, 0);
    controller.selectedBlock = mark;
    (controller as unknown as { held: string }).held = 'place';
    (controller as unknown as { act: (ms: number) => void }).act(0);
    expect(world.get(10, 31, 8)).toBe(STONE);
  });

  it('ray casting ignores max-distance-exceeded hits', () => {
    const { controller, camera } = build();
    camera.position.set(8, 100, 8);
    const hit = controller.castRay();
    expect(hit).toBeNull();
  });
});
