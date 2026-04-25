const STICK_BASE_PX = 48;
const STICK_DEAD_PX = 6;
const DEFAULT_LOOK_SENSITIVITY = 0.005;

export interface TouchInputState {
  moveForward: number;
  moveStrafe: number;
  lookDx: number;
  lookDy: number;
  primary: boolean;
  secondary: boolean;
  jump: boolean;
  sprint: boolean;
}

export class TouchControls {
  readonly state: TouchInputState = {
    moveForward: 0,
    moveStrafe: 0,
    lookDx: 0,
    lookDy: 0,
    primary: false,
    secondary: false,
    jump: false,
    sprint: false,
  };

  private container: HTMLElement | null = null;
  private stickBase: HTMLElement | null = null;
  private stickKnob: HTMLElement | null = null;
  private stickTouch: number | null = null;
  private stickOrigin = { x: 0, y: 0 };

  private lookTouch: number | null = null;
  private lookLast = { x: 0, y: 0 };
  private lookSensitivity = DEFAULT_LOOK_SENSITIVITY;
  setLookSensitivity(s: number): void {
    // Settings panel typically passes a small float (~0.005 default). Clamp
    // so a wildly out-of-range stored value can't make the camera unusable.
    this.lookSensitivity = Math.max(0.0005, Math.min(0.05, s));
  }

  private readonly onTouchStart: (e: TouchEvent) => void;
  private readonly onTouchMove: (e: TouchEvent) => void;
  private readonly onTouchEnd: (e: TouchEvent) => void;

  constructor() {
    this.onTouchStart = (e) => {
      this.handleStart(e);
    };
    this.onTouchMove = (e) => {
      this.handleMove(e);
    };
    this.onTouchEnd = (e) => {
      this.handleEnd(e);
    };
  }

  attach(parent: HTMLElement): void {
    const container = document.createElement('div');
    container.setAttribute('data-testid', 'touch-controls');
    container.style.cssText =
      'position:fixed;inset:0;pointer-events:none;touch-action:none;user-select:none;z-index:5;';
    parent.appendChild(container);
    this.container = container;

    const stickBase = document.createElement('div');
    stickBase.style.cssText = [
      'position:absolute',
      'width:96px',
      'height:96px',
      'border-radius:50%',
      'border:2px solid rgba(255,255,255,0.4)',
      'background:rgba(10,14,20,0.3)',
      'pointer-events:none',
      'display:none',
    ].join(';');
    container.appendChild(stickBase);
    this.stickBase = stickBase;

    const stickKnob = document.createElement('div');
    stickKnob.style.cssText = [
      'position:absolute',
      'left:24px',
      'top:24px',
      'width:48px',
      'height:48px',
      'border-radius:50%',
      'background:rgba(255,255,255,0.35)',
      'pointer-events:none',
    ].join(';');
    stickBase.appendChild(stickKnob);
    this.stickKnob = stickKnob;

    this.addButton(container, 'Break', '70%', '85%', () => {
      this.state.primary = true;
      setTimeout(() => (this.state.primary = false), 120);
    });
    this.addButton(container, 'Place', '84%', '85%', () => {
      this.state.secondary = true;
      setTimeout(() => (this.state.secondary = false), 120);
    });
    this.addButton(container, 'Jump', '92%', '70%', () => {
      this.state.jump = true;
      setTimeout(() => (this.state.jump = false), 120);
    });

    window.addEventListener('touchstart', this.onTouchStart, { passive: false });
    window.addEventListener('touchmove', this.onTouchMove, { passive: false });
    window.addEventListener('touchend', this.onTouchEnd, { passive: false });
    window.addEventListener('touchcancel', this.onTouchEnd, { passive: false });
  }

  detach(): void {
    window.removeEventListener('touchstart', this.onTouchStart);
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onTouchEnd);
    window.removeEventListener('touchcancel', this.onTouchEnd);
    this.container?.remove();
    this.container = null;
  }

  consumeLook(): { dx: number; dy: number } {
    const dx = this.state.lookDx;
    const dy = this.state.lookDy;
    this.state.lookDx = 0;
    this.state.lookDy = 0;
    return { dx, dy };
  }

  private addButton(
    parent: HTMLElement,
    label: string,
    left: string,
    top: string,
    onTap: () => void,
  ): void {
    const btn = document.createElement('div');
    btn.textContent = label;
    btn.style.cssText = [
      'position:absolute',
      `left:${left}`,
      `top:${top}`,
      'width:56px',
      'height:56px',
      'border-radius:50%',
      'background:rgba(255,255,255,0.18)',
      'border:2px solid rgba(255,255,255,0.4)',
      'color:#fff',
      'font-size:12px',
      'text-align:center',
      'line-height:56px',
      'pointer-events:auto',
      'touch-action:none',
      'user-select:none',
    ].join(';');
    btn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      onTap();
    });
    parent.appendChild(btn);
  }

  private isLeftHalf(x: number): boolean {
    return x < window.innerWidth * 0.5;
  }

  private handleStart(e: TouchEvent): void {
    for (const t of Array.from(e.changedTouches)) {
      if (this.isLeftHalf(t.clientX) && this.stickTouch === null) {
        this.stickTouch = t.identifier;
        this.stickOrigin = { x: t.clientX, y: t.clientY };
        if (this.stickBase) {
          this.stickBase.style.left = `${(t.clientX - 48).toString()}px`;
          this.stickBase.style.top = `${(t.clientY - 48).toString()}px`;
          this.stickBase.style.display = 'block';
        }
        e.preventDefault();
      } else if (!this.isLeftHalf(t.clientX) && this.lookTouch === null) {
        this.lookTouch = t.identifier;
        this.lookLast = { x: t.clientX, y: t.clientY };
        e.preventDefault();
      }
    }
  }

  private handleMove(e: TouchEvent): void {
    for (const t of Array.from(e.changedTouches)) {
      if (t.identifier === this.stickTouch) {
        const dx = t.clientX - this.stickOrigin.x;
        const dy = t.clientY - this.stickOrigin.y;
        const mag = Math.hypot(dx, dy);
        if (mag < STICK_DEAD_PX) {
          this.state.moveStrafe = 0;
          this.state.moveForward = 0;
          this.state.sprint = false;
        } else {
          const clampMag = Math.min(mag, STICK_BASE_PX);
          const nx = (dx / mag) * (clampMag / STICK_BASE_PX);
          const ny = (dy / mag) * (clampMag / STICK_BASE_PX);
          this.state.moveStrafe = nx;
          this.state.moveForward = -ny;
          // Auto-sprint: pushing the stick to its forward edge sustains
          // sprint while the stick stays there. No HUD button needed.
          // Only forward sprint (vanilla — sideways sprint is forbidden).
          this.state.sprint = -ny > 0.9 && Math.abs(nx) < 0.5;
          if (this.stickKnob) {
            this.stickKnob.style.left = `${(24 + nx * 24).toString()}px`;
            this.stickKnob.style.top = `${(24 + ny * 24).toString()}px`;
          }
        }
        e.preventDefault();
      } else if (t.identifier === this.lookTouch) {
        const dx = t.clientX - this.lookLast.x;
        const dy = t.clientY - this.lookLast.y;
        this.state.lookDx += dx * this.lookSensitivity;
        this.state.lookDy += dy * this.lookSensitivity;
        this.lookLast = { x: t.clientX, y: t.clientY };
        e.preventDefault();
      }
    }
  }

  private handleEnd(e: TouchEvent): void {
    for (const t of Array.from(e.changedTouches)) {
      if (t.identifier === this.stickTouch) {
        this.stickTouch = null;
        this.state.moveForward = 0;
        this.state.moveStrafe = 0;
        this.state.sprint = false;
        if (this.stickBase) this.stickBase.style.display = 'none';
        if (this.stickKnob) {
          this.stickKnob.style.left = '24px';
          this.stickKnob.style.top = '24px';
        }
      } else if (t.identifier === this.lookTouch) {
        this.lookTouch = null;
      }
    }
  }
}

export function isTouchDevice(): boolean {
  return (
    typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
  );
}
