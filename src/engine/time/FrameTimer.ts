export interface FrameStats {
  fps: number;
  frameMs: number;
}

export class FrameTimer {
  private last = performance.now();
  private acc = 0;
  private frames = 0;
  private fps = 0;
  private frameMs = 0;

  tick(): FrameStats {
    const now = performance.now();
    const dt = now - this.last;
    this.last = now;
    this.frameMs = dt;
    this.acc += dt;
    this.frames += 1;
    if (this.acc >= 500) {
      this.fps = (this.frames * 1000) / this.acc;
      this.frames = 0;
      this.acc = 0;
    }
    return { fps: this.fps, frameMs: this.frameMs };
  }

  reset(): void {
    this.last = performance.now();
    this.acc = 0;
    this.frames = 0;
    this.fps = 0;
    this.frameMs = 0;
  }
}
