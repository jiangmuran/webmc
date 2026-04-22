// Touch gesture recognizer. Reduces raw TouchEvent streams into a small
// set of high-level gestures: tap, long_press, pan, pinch, two_finger_tap.
// Used by TouchControls to dispatch logical input events.

export type Gesture =
  | { kind: 'tap'; x: number; y: number }
  | { kind: 'long_press'; x: number; y: number; durationMs: number }
  | { kind: 'pan'; dx: number; dy: number }
  | { kind: 'pinch'; scale: number }
  | { kind: 'two_finger_tap'; x: number; y: number };

export interface TouchPoint {
  id: number;
  x: number;
  y: number;
  tsMs: number;
}

const TAP_MAX_MS = 250;
const TAP_MAX_PX = 10;
const LONG_PRESS_MS = 500;

export class TouchGestureRecognizer {
  private active = new Map<number, TouchPoint>();
  private starts = new Map<number, TouchPoint>();
  private lastPinchDistance = 0;

  onDown(pt: TouchPoint): void {
    this.active.set(pt.id, pt);
    this.starts.set(pt.id, { ...pt });
    if (this.active.size === 2) {
      this.lastPinchDistance = this.pinchDistance();
    }
  }

  onMove(pt: TouchPoint): Gesture | null {
    const existing = this.active.get(pt.id);
    if (!existing) return null;
    this.active.set(pt.id, pt);
    if (this.active.size === 2) {
      const newDist = this.pinchDistance();
      if (this.lastPinchDistance > 0) {
        const scale = newDist / this.lastPinchDistance;
        this.lastPinchDistance = newDist;
        if (Math.abs(scale - 1) > 0.02) {
          return { kind: 'pinch', scale };
        }
      }
      return null;
    }
    if (this.active.size === 1) {
      const dx = pt.x - existing.x;
      const dy = pt.y - existing.y;
      return { kind: 'pan', dx, dy };
    }
    return null;
  }

  onUp(id: number, tsMs: number): Gesture | null {
    const start = this.starts.get(id);
    this.starts.delete(id);
    this.active.delete(id);
    if (!start) return null;
    const dt = tsMs - start.tsMs;
    const end = this.active.get(id);
    const dx = (end?.x ?? start.x) - start.x;
    const dy = (end?.y ?? start.y) - start.y;
    const dist = Math.hypot(dx, dy);
    if (dt <= TAP_MAX_MS && dist <= TAP_MAX_PX) {
      if (this.starts.size === 1) return { kind: 'two_finger_tap', x: start.x, y: start.y };
      return { kind: 'tap', x: start.x, y: start.y };
    }
    if (dt >= LONG_PRESS_MS && dist <= TAP_MAX_PX) {
      return { kind: 'long_press', x: start.x, y: start.y, durationMs: dt };
    }
    return null;
  }

  reset(): void {
    this.active.clear();
    this.starts.clear();
    this.lastPinchDistance = 0;
  }

  private pinchDistance(): number {
    const pts = Array.from(this.active.values());
    if (pts.length < 2) return 0;
    const a = pts[0];
    const b = pts[1];
    if (!a || !b) return 0;
    return Math.hypot(a.x - b.x, a.y - b.y);
  }
}
