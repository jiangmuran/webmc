import type * as THREE from 'three';

export class ScreenShake {
  private intensity = 0;
  private phase = 0;

  pulse(amount: number): void {
    this.intensity = Math.min(1, Math.max(this.intensity, amount));
  }

  apply(camera: THREE.PerspectiveCamera, dtSec: number): void {
    if (this.intensity <= 0.005) {
      this.intensity = 0;
      return;
    }
    this.phase += dtSec * 40;
    const amp = this.intensity * 0.08;
    const ox = Math.cos(this.phase) * amp;
    const oy = Math.sin(this.phase * 1.3) * amp;
    camera.position.x += ox;
    camera.position.y += oy;
    this.intensity = Math.max(0, this.intensity - dtSec * 3.5);
  }
}
