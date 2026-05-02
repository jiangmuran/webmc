export interface FrameStats {
  fps: number;
  frameMs: number;
}

const FPS_WINDOW_MS = 500;
// Long gaps are usually tab suspend/resume. Crediting them as real frame time
// would produce nonsense FPS and, once physics is tick-stepped by dt, would
// cause teleporting. Cap the reported frame at one display refresh worth.
const MAX_FRAME_DT_MS = 100;

export class FrameTimer {
  private last = performance.now();
  private acc = 0;
  private frames = 0;
  private fps = 0;
  private frameMs = 0;
  // Reused result object — was a fresh literal per per-frame call.
  private readonly statsObj: FrameStats = { fps: 0, frameMs: 0 };

  tick(): FrameStats {
    const now = performance.now();
    const raw = now - this.last;
    this.last = now;
    const dt = raw < 0 ? 0 : raw > MAX_FRAME_DT_MS ? MAX_FRAME_DT_MS : raw;
    this.frameMs = dt;
    this.acc += dt;
    this.frames += 1;
    if (this.acc >= FPS_WINDOW_MS) {
      this.fps = (this.frames * 1000) / this.acc;
      this.frames = 0;
      this.acc = 0;
    }
    this.statsObj.fps = this.fps;
    this.statsObj.frameMs = this.frameMs;
    return this.statsObj;
  }

  reset(): void {
    this.last = performance.now();
    this.acc = 0;
    this.frames = 0;
    this.fps = 0;
    this.frameMs = 0;
  }
}
