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
  // Sneak is an explicit touch button now — without it, touch users
  // couldn't open shulker boxes through the chest UI shift-bypass,
  // couldn't edge-cling at cliffs, and couldn't sneak past mobs.
  sneak: boolean;
  // Edge-triggered: true once when the user taps the inventory button.
  // The host clears it back to false after handling. Touch users had
  // no way to open the inventory at all before this.
  inventoryToggle: boolean;
  // Edge-triggered: tap to drop the held stack (vanilla Q).
  drop: boolean;
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
    sneak: false,
    inventoryToggle: false,
    drop: false,
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

    // Press-and-hold buttons. Old impl used a 120ms timeout, which made
    // breaking a block require ~3 taps because hold-to-break needs the
    // button to stay down while the block is being chiseled. Now the
    // state stays true while the finger is on the button.
    this.addHoldButton(container, 'Break', '70%', '85%', (down) => {
      this.state.primary = down;
    });
    this.addHoldButton(container, 'Place', '84%', '85%', (down) => {
      this.state.secondary = down;
    });
    this.addHoldButton(container, 'Jump', '92%', '70%', (down) => {
      this.state.jump = down;
    });
    this.addHoldButton(container, 'Sneak', '92%', '85%', (down) => {
      this.state.sneak = down;
    });
    // Inventory + drop are tap-to-edge-fire: the host reads the flag
    // then clears it. Hold-buttons would re-fire every frame.
    this.addHoldButton(container, 'Inv', '70%', '70%', (down) => {
      if (down) this.state.inventoryToggle = true;
    });
    this.addHoldButton(container, 'Drop', '84%', '70%', (down) => {
      if (down) this.state.drop = true;
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

  // Reused result object — was allocated fresh per frame on touch
  // devices where the per-frame loop calls this.
  private readonly _consumeLookResult = { dx: 0, dy: 0 };
  consumeLook(): { dx: number; dy: number } {
    this._consumeLookResult.dx = this.state.lookDx;
    this._consumeLookResult.dy = this.state.lookDy;
    this.state.lookDx = 0;
    this.state.lookDy = 0;
    return this._consumeLookResult;
  }

  private addHoldButton(
    parent: HTMLElement,
    label: string,
    left: string,
    top: string,
    onState: (down: boolean) => void,
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
    let activeId: number | null = null;
    btn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const t = e.changedTouches[0];
      if (!t || activeId !== null) return;
      activeId = t.identifier;
      btn.style.background = 'rgba(255,255,255,0.4)';
      onState(true);
    });
    const release = (e: TouchEvent): void => {
      // for...of on TouchList iterates directly without the Array.from
      // allocation that the original code had per touch event.
      for (const t of e.changedTouches) {
        if (t.identifier === activeId) {
          activeId = null;
          btn.style.background = 'rgba(255,255,255,0.18)';
          onState(false);
          e.preventDefault();
          return;
        }
      }
    };
    btn.addEventListener('touchend', release);
    btn.addEventListener('touchcancel', release);
    parent.appendChild(btn);
  }

  private isLeftHalf(x: number): boolean {
    return x < window.innerWidth * 0.5;
  }

  private handleStart(e: TouchEvent): void {
    // for...of on TouchList iterates directly. Original code wrapped in
    // Array.from per event — at ~60Hz touchmove that was 60 throwaway
    // arrays per second.
    for (const t of e.changedTouches) {
      if (this.isLeftHalf(t.clientX) && this.stickTouch === null) {
        this.stickTouch = t.identifier;
        this.stickOrigin.x = t.clientX;
        this.stickOrigin.y = t.clientY;
        if (this.stickBase) {
          this.stickBase.style.left = `${(t.clientX - 48).toString()}px`;
          this.stickBase.style.top = `${(t.clientY - 48).toString()}px`;
          this.stickBase.style.display = 'block';
        }
        e.preventDefault();
      } else if (!this.isLeftHalf(t.clientX) && this.lookTouch === null) {
        this.lookTouch = t.identifier;
        this.lookLast.x = t.clientX;
        this.lookLast.y = t.clientY;
        e.preventDefault();
      }
    }
  }

  private handleMove(e: TouchEvent): void {
    for (const t of e.changedTouches) {
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
        // Mutate in place — was `this.lookLast = {x,y}` per touchmove,
        // ~60 throwaway literals/sec on active look-pad drags.
        this.lookLast.x = t.clientX;
        this.lookLast.y = t.clientY;
        e.preventDefault();
      }
    }
  }

  private handleEnd(e: TouchEvent): void {
    for (const t of e.changedTouches) {
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
