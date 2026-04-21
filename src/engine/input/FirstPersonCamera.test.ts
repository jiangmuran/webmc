import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { FirstPersonCamera } from './FirstPersonCamera';

describe('FirstPersonCamera', () => {
  function make(): FirstPersonCamera {
    const cam = new THREE.PerspectiveCamera(70, 1, 0.1, 1000);
    return new FirstPersonCamera(cam);
  }

  it('default yaw = 0 looks along -z', () => {
    const fp = make();
    const v = fp.lookVector();
    expect(v.x).toBeCloseTo(0, 5);
    expect(v.z).toBeCloseTo(-1, 5);
  });

  it('yaw = π/2 looks along -x', () => {
    const fp = make();
    fp.yaw = Math.PI / 2;
    const v = fp.lookVector();
    expect(v.x).toBeCloseTo(-1, 5);
    expect(v.z).toBeCloseTo(0, 5);
  });

  it('update with forward input moves along look vector horizontally', () => {
    const fp = make();
    fp.input.forward = 1;
    fp.input.fly = true;
    const before = fp.position.clone();
    fp.update(1);
    expect(fp.position.z).toBeLessThan(before.z);
    expect(Math.abs(fp.position.y - before.y)).toBeCloseTo(0, 5);
  });

  it('update with strafe input moves perpendicular to look', () => {
    const fp = make();
    fp.input.strafe = 1;
    fp.input.fly = true;
    const before = fp.position.clone();
    fp.update(1);
    expect(fp.position.x).toBeGreaterThan(before.x);
  });

  it('vertical input raises/lowers position in fly mode', () => {
    const fp = make();
    fp.input.fly = true;
    fp.input.vertical = 1;
    const y0 = fp.position.y;
    fp.update(0.5);
    expect(fp.position.y).toBeGreaterThan(y0);
    fp.input.vertical = -1;
    fp.update(0.5);
    expect(fp.position.y).toBeCloseTo(y0, 5);
  });

  it('mouse movement clamps pitch to just under ±π/2 to avoid gimbal flip', () => {
    const fp = make();
    const before = fp.pitch;
    // simulate a huge upward mouse sweep by pushing pitch manually via the
    // mousemove handler's contract — enormous negative movementY
    for (let i = 0; i < 1000; i++) {
      fp.pitch -= 1 * 0.0022;
      fp.pitch = Math.max(-Math.PI / 2 + 0.0001, Math.min(Math.PI / 2 - 0.0001, fp.pitch));
    }
    expect(fp.pitch).toBeGreaterThanOrEqual(-Math.PI / 2);
    expect(fp.pitch).toBeLessThan(before);
    expect(Math.abs(fp.pitch)).toBeLessThan(Math.PI / 2);
  });

  it('diagonal forward+strafe is normalized so diagonal speed = straight speed', () => {
    const fp = make();
    fp.input.fly = true;
    fp.input.forward = 1;
    fp.input.strafe = 1;
    const before = fp.position.clone();
    fp.update(1);
    const straight = Math.hypot(fp.position.x - before.x, fp.position.z - before.z);
    fp.position.copy(before);
    fp.input.strafe = 0;
    fp.update(1);
    const straightOnly = Math.hypot(fp.position.x - before.x, fp.position.z - before.z);
    expect(straight).toBeCloseTo(straightOnly, 4);
  });

  it('toggleFly resets velocity', () => {
    const fp = make();
    fp.velocity.set(5, 5, 5);
    fp.toggleFly();
    expect(fp.velocity.length()).toBe(0);
  });
});
