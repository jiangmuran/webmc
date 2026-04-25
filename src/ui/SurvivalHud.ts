import { armorIcons, visible as armorVisible } from './armor_bar_icons';
import { shakeOnLowFood } from './food_bar_hunger';

export interface SurvivalFrame {
  health: number;
  maxHealth: number;
  hunger: number;
  maxHunger: number;
  breathSec: number;
  maxBreathSec: number;
  underwater: boolean;
  xpLevel: number;
  xpProgress: number;
  xpToNext: number;
  armorPoints?: number;
}

const ICON = 14;
const BAR_GAP = 2;
const HEARTS = 10;
const DRUMSTICKS = 10;
const BUBBLES = 10;
const ARMORS = 10;

type IconName =
  | 'heart_full'
  | 'heart_half'
  | 'heart_empty'
  | 'drum_full'
  | 'drum_half'
  | 'drum_empty'
  | 'bubble_full'
  | 'bubble_empty'
  | 'armor_full'
  | 'armor_half'
  | 'armor_empty';

function paintHeart(ctx: CanvasRenderingContext2D, fill: string, shadow: string): void {
  ctx.fillStyle = shadow;
  const pts: [number, number][] = [
    [3, 5],
    [4, 4],
    [5, 4],
    [6, 5],
    [7, 5],
    [8, 4],
    [9, 4],
    [10, 5],
    [11, 6],
    [11, 7],
    [10, 8],
    [9, 9],
    [8, 10],
    [7, 11],
    [6, 11],
    [5, 10],
    [4, 9],
    [3, 8],
    [2, 7],
    [2, 6],
  ];
  for (const [x, y] of pts) ctx.fillRect(x, y, 1, 1);
  ctx.fillStyle = fill;
  const innerPts: [number, number][] = [
    [4, 5],
    [5, 5],
    [6, 6],
    [7, 6],
    [8, 5],
    [9, 5],
    [10, 6],
    [10, 7],
    [9, 7],
    [8, 8],
    [7, 9],
    [7, 10],
    [6, 10],
    [6, 9],
    [5, 8],
    [4, 7],
    [3, 6],
    [3, 7],
  ];
  for (const [x, y] of innerPts) ctx.fillRect(x, y, 1, 1);
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fillRect(4, 6, 1, 1);
  ctx.fillRect(5, 7, 1, 1);
}

function paintHeartHalf(ctx: CanvasRenderingContext2D, fill: string, shadow: string): void {
  paintHeart(ctx, shadow, shadow);
  ctx.clearRect(7, 0, 7, ICON);
  paintHeart(ctx, shadow, shadow);
  const save = ctx.getImageData(0, 0, ICON, ICON);
  ctx.clearRect(0, 0, ICON, ICON);
  paintHeart(ctx, fill, shadow);
  const lit = ctx.getImageData(0, 0, ICON, ICON);
  ctx.clearRect(0, 0, ICON, ICON);
  ctx.putImageData(save, 0, 0);
  for (let y = 0; y < ICON; y++) {
    for (let x = 0; x < 7; x++) {
      const idx = (y * ICON + x) * 4;
      save.data[idx] = lit.data[idx]!;
      save.data[idx + 1] = lit.data[idx + 1]!;
      save.data[idx + 2] = lit.data[idx + 2]!;
      save.data[idx + 3] = lit.data[idx + 3]!;
    }
  }
  ctx.putImageData(save, 0, 0);
}

function paintDrumstick(ctx: CanvasRenderingContext2D, fill: string, shadow: string): void {
  ctx.fillStyle = shadow;
  const silhouette: [number, number][] = [
    [4, 2],
    [5, 2],
    [6, 2],
    [7, 3],
    [8, 3],
    [9, 3],
    [10, 4],
    [10, 5],
    [9, 6],
    [8, 7],
    [7, 8],
    [6, 9],
    [5, 10],
    [4, 11],
    [3, 11],
    [2, 10],
    [3, 9],
    [4, 8],
    [5, 7],
    [6, 6],
    [7, 5],
    [6, 4],
    [5, 3],
  ];
  for (const [x, y] of silhouette) ctx.fillRect(x, y, 1, 1);
  ctx.fillStyle = fill;
  const flesh: [number, number][] = [
    [5, 3],
    [6, 3],
    [7, 4],
    [8, 4],
    [9, 5],
    [8, 5],
    [7, 5],
    [6, 5],
    [5, 5],
    [8, 6],
    [7, 6],
    [6, 6],
    [5, 6],
    [4, 6],
  ];
  for (const [x, y] of flesh) ctx.fillRect(x, y, 1, 1);
  ctx.fillStyle = '#f1e4b6';
  ctx.fillRect(3, 10, 1, 1);
  ctx.fillRect(4, 10, 1, 1);
}

function paintDrumstickHalf(ctx: CanvasRenderingContext2D, fill: string, shadow: string): void {
  paintDrumstick(ctx, fill, shadow);
  ctx.clearRect(7, 0, 7, ICON);
  ctx.fillStyle = shadow;
  const rightSilhouette: [number, number][] = [
    [7, 3],
    [8, 3],
    [9, 3],
    [10, 4],
    [10, 5],
    [9, 6],
    [8, 7],
    [7, 8],
  ];
  for (const [x, y] of rightSilhouette) ctx.fillRect(x, y, 1, 1);
}

function paintBubble(ctx: CanvasRenderingContext2D, fill: string): void {
  ctx.fillStyle = '#0a1e36';
  const ring: [number, number][] = [
    [5, 2],
    [6, 2],
    [7, 2],
    [8, 2],
    [4, 3],
    [9, 3],
    [3, 4],
    [10, 4],
    [3, 5],
    [10, 5],
    [3, 6],
    [10, 6],
    [3, 7],
    [10, 7],
    [3, 8],
    [10, 8],
    [4, 9],
    [9, 9],
    [5, 10],
    [6, 10],
    [7, 10],
    [8, 10],
  ];
  for (const [x, y] of ring) ctx.fillRect(x, y, 1, 1);
  ctx.fillStyle = fill;
  for (let y = 3; y < 10; y++) {
    for (let x = 4; x < 10; x++) ctx.fillRect(x, y, 1, 1);
  }
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.fillRect(5, 4, 1, 1);
  ctx.fillRect(6, 4, 1, 1);
  ctx.fillRect(5, 5, 1, 1);
}

function paintHeartEmpty(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = '#140305';
  const pts: [number, number][] = [
    [3, 5],
    [4, 4],
    [5, 4],
    [6, 5],
    [7, 5],
    [8, 4],
    [9, 4],
    [10, 5],
    [11, 6],
    [11, 7],
    [10, 8],
    [9, 9],
    [8, 10],
    [7, 11],
    [6, 11],
    [5, 10],
    [4, 9],
    [3, 8],
    [2, 7],
    [2, 6],
  ];
  for (const [x, y] of pts) ctx.fillRect(x, y, 1, 1);
}

function paintDrumEmpty(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = '#141008';
  const silhouette: [number, number][] = [
    [4, 2],
    [5, 2],
    [6, 2],
    [7, 3],
    [8, 3],
    [9, 3],
    [10, 4],
    [10, 5],
    [9, 6],
    [8, 7],
    [7, 8],
    [6, 9],
    [5, 10],
    [4, 11],
    [3, 11],
    [2, 10],
    [3, 9],
    [4, 8],
    [5, 7],
    [6, 6],
    [7, 5],
    [6, 4],
    [5, 3],
  ];
  for (const [x, y] of silhouette) ctx.fillRect(x, y, 1, 1);
}

function buildIconAtlas(): Map<IconName, HTMLCanvasElement> {
  const map = new Map<IconName, HTMLCanvasElement>();
  const make = (paint: (c: CanvasRenderingContext2D) => void): HTMLCanvasElement => {
    const c = document.createElement('canvas');
    c.width = ICON;
    c.height = ICON;
    const ctx = c.getContext('2d');
    if (!ctx) return c;
    ctx.imageSmoothingEnabled = false;
    paint(ctx);
    return c;
  };
  map.set(
    'heart_full',
    make((c) => {
      paintHeart(c, '#f02030', '#6b0010');
    }),
  );
  map.set(
    'heart_half',
    make((c) => {
      paintHeartHalf(c, '#f02030', '#6b0010');
    }),
  );
  map.set(
    'heart_empty',
    make((c) => {
      paintHeartEmpty(c);
    }),
  );
  map.set(
    'drum_full',
    make((c) => {
      paintDrumstick(c, '#a76d3a', '#3a1e0a');
    }),
  );
  map.set(
    'drum_half',
    make((c) => {
      paintDrumstickHalf(c, '#a76d3a', '#3a1e0a');
    }),
  );
  map.set(
    'drum_empty',
    make((c) => {
      paintDrumEmpty(c);
    }),
  );
  map.set(
    'bubble_full',
    make((c) => {
      paintBubble(c, '#e3f1ff');
    }),
  );
  map.set(
    'bubble_empty',
    make((c) => {
      paintBubble(c, '#3a5878');
    }),
  );
  map.set(
    'armor_full',
    make((c) => {
      paintArmor(c, 'full');
    }),
  );
  map.set(
    'armor_half',
    make((c) => {
      paintArmor(c, 'half');
    }),
  );
  map.set(
    'armor_empty',
    make((c) => {
      paintArmor(c, 'empty');
    }),
  );
  return map;
}

function paintArmor(ctx: CanvasRenderingContext2D, kind: 'full' | 'half' | 'empty'): void {
  const outline: [number, number][] = [
    [4, 2],
    [5, 2],
    [6, 2],
    [7, 2],
    [8, 2],
    [9, 2],
    [3, 3],
    [10, 3],
    [3, 4],
    [10, 4],
    [3, 5],
    [10, 5],
    [4, 6],
    [5, 6],
    [6, 6],
    [7, 6],
    [8, 6],
    [9, 6],
    [4, 7],
    [9, 7],
    [4, 8],
    [9, 8],
    [4, 9],
    [9, 9],
    [4, 10],
    [9, 10],
    [4, 11],
    [5, 11],
    [6, 11],
    [7, 11],
    [8, 11],
    [9, 11],
  ];
  ctx.fillStyle = '#1a2030';
  for (const [x, y] of outline) ctx.fillRect(x, y, 1, 1);
  if (kind === 'empty') return;
  const fill: [number, number][] = [
    [4, 3],
    [5, 3],
    [6, 3],
    [7, 3],
    [8, 3],
    [9, 3],
    [4, 4],
    [5, 4],
    [6, 4],
    [7, 4],
    [8, 4],
    [9, 4],
    [4, 5],
    [5, 5],
    [6, 5],
    [7, 5],
    [8, 5],
    [9, 5],
    [5, 7],
    [6, 7],
    [7, 7],
    [8, 7],
    [5, 8],
    [6, 8],
    [7, 8],
    [8, 8],
    [5, 9],
    [6, 9],
    [7, 9],
    [8, 9],
    [5, 10],
    [6, 10],
    [7, 10],
    [8, 10],
  ];
  ctx.fillStyle = '#dadde6';
  for (const [x, y] of fill) {
    if (kind === 'half' && x >= 7) continue;
    ctx.fillRect(x, y, 1, 1);
  }
}

export class SurvivalHud {
  private readonly root: HTMLDivElement;
  private readonly hearts: HTMLCanvasElement[] = [];
  private readonly hungers: HTMLCanvasElement[] = [];
  private readonly bubbles: HTMLCanvasElement[] = [];
  private readonly armors: HTMLCanvasElement[] = [];
  private readonly armorRow: HTMLDivElement;
  private readonly xpBar: HTMLDivElement;
  private readonly xpFill: HTMLDivElement;
  private readonly xpLabel: HTMLDivElement;
  private readonly atlas = buildIconAtlas();
  private visible = true;

  constructor(parent: HTMLElement) {
    this.root = document.createElement('div');
    this.root.setAttribute('data-testid', 'survival-hud');
    this.root.style.cssText = [
      'position:fixed',
      'left:50%',
      'bottom:56px',
      'transform:translateX(-50%)',
      'display:flex',
      'flex-direction:column',
      'align-items:center',
      'gap:3px',
      'pointer-events:none',
      'user-select:none',
      'z-index:9',
      'text-shadow:1px 1px 0 rgba(0,0,0,0.7)',
      'font-family:monospace',
      'color:#dcffbc',
      'font-size:11px',
    ].join(';');

    this.armorRow = document.createElement('div');
    this.armorRow.style.cssText = 'display:flex;gap:1px;min-height:14px;display:none;';
    for (let i = 0; i < ARMORS; i++) {
      const c = document.createElement('canvas');
      c.width = ICON;
      c.height = ICON;
      c.style.cssText = 'image-rendering:pixelated;';
      this.armorRow.appendChild(c);
      this.armors.push(c);
    }
    this.root.appendChild(this.armorRow);

    const bubbleRow = document.createElement('div');
    bubbleRow.style.cssText = 'display:flex;gap:1px;min-height:14px;';
    for (let i = 0; i < BUBBLES; i++) {
      const c = document.createElement('canvas');
      c.width = ICON;
      c.height = ICON;
      c.style.cssText = 'image-rendering:pixelated;display:none;';
      bubbleRow.appendChild(c);
      this.bubbles.push(c);
    }
    this.root.appendChild(bubbleRow);

    this.xpLabel = document.createElement('div');
    this.xpLabel.style.cssText = 'color:#7affa0;font-size:10px;letter-spacing:1px;min-height:10px;';
    this.root.appendChild(this.xpLabel);

    this.xpBar = document.createElement('div');
    this.xpBar.style.cssText = [
      'width:182px',
      'height:5px',
      'background:rgba(0,0,0,0.6)',
      'border:1px solid rgba(0,0,0,0.8)',
      'position:relative',
    ].join(';');
    this.xpFill = document.createElement('div');
    this.xpFill.style.cssText = [
      'position:absolute',
      'left:0',
      'top:0',
      'bottom:0',
      'width:0%',
      'background:linear-gradient(#7bff4f,#3dbd2a)',
    ].join(';');
    this.xpBar.appendChild(this.xpFill);
    this.root.appendChild(this.xpBar);

    const statsRow = document.createElement('div');
    statsRow.style.cssText = `display:flex;gap:${String(BAR_GAP * 4)}px;align-items:center;`;

    const heartRow = document.createElement('div');
    heartRow.style.cssText = 'display:flex;gap:1px;';
    for (let i = 0; i < HEARTS; i++) {
      const c = document.createElement('canvas');
      c.width = ICON;
      c.height = ICON;
      c.style.cssText = 'image-rendering:pixelated;';
      heartRow.appendChild(c);
      this.hearts.push(c);
    }
    statsRow.appendChild(heartRow);

    const hungerRow = document.createElement('div');
    hungerRow.style.cssText = 'display:flex;gap:1px;flex-direction:row-reverse;';
    for (let i = 0; i < DRUMSTICKS; i++) {
      const c = document.createElement('canvas');
      c.width = ICON;
      c.height = ICON;
      c.style.cssText = 'image-rendering:pixelated;';
      hungerRow.appendChild(c);
      this.hungers.push(c);
    }
    statsRow.appendChild(hungerRow);

    this.root.appendChild(statsRow);
    parent.appendChild(this.root);
  }

  setVisible(on: boolean): void {
    this.visible = on;
    this.root.style.display = on ? 'flex' : 'none';
  }

  render(frame: SurvivalFrame): void {
    if (!this.visible) return;
    const hpPerHeart = frame.maxHealth / HEARTS;
    const lowHp = frame.health < 6;
    const pulse = lowHp ? 0.5 + 0.5 * Math.sin(performance.now() * 0.01) : 1;
    const heartShake = lowHp;
    const hbT = performance.now();
    for (let i = 0; i < HEARTS; i++) {
      const start = i * hpPerHeart;
      const v = Math.max(0, Math.min(hpPerHeart, frame.health - start));
      const name: IconName =
        v >= hpPerHeart * 0.9 ? 'heart_full' : v >= hpPerHeart * 0.4 ? 'heart_half' : 'heart_empty';
      this.blit(this.hearts[i]!, name);
      this.hearts[i]!.style.opacity = name === 'heart_empty' ? '1' : String(pulse.toFixed(2));
      if (heartShake) {
        const ox = (Math.sin(hbT * 0.05 + i * 1.3) * 1.5) | 0;
        const oy = (Math.cos(hbT * 0.06 + i * 0.7) * 1.5) | 0;
        this.hearts[i]!.style.transform = `translate(${String(ox)}px,${String(oy)}px)`;
      } else {
        this.hearts[i]!.style.transform = '';
      }
    }

    const hungerPer = frame.maxHunger / DRUMSTICKS;
    const shake = shakeOnLowFood(frame.hunger);
    const t = performance.now();
    for (let i = 0; i < DRUMSTICKS; i++) {
      const start = i * hungerPer;
      const v = Math.max(0, Math.min(hungerPer, frame.hunger - start));
      const name: IconName =
        v >= hungerPer * 0.9 ? 'drum_full' : v >= hungerPer * 0.4 ? 'drum_half' : 'drum_empty';
      this.blit(this.hungers[i]!, name);
      if (shake) {
        const ox = (Math.sin(t * 0.04 + i * 1.7) * 2) | 0;
        const oy = (Math.cos(t * 0.05 + i * 0.9) * 2) | 0;
        this.hungers[i]!.style.transform = `translate(${String(ox)}px,${String(oy)}px)`;
      } else {
        this.hungers[i]!.style.transform = '';
      }
    }

    const armorPts = frame.armorPoints ?? 0;
    if (armorVisible(armorPts)) {
      this.armorRow.style.display = 'flex';
      const icons = armorIcons(armorPts);
      for (let i = 0; i < ARMORS; i++) {
        const which = icons[i];
        const name: IconName =
          which === 'full' ? 'armor_full' : which === 'half' ? 'armor_half' : 'armor_empty';
        this.blit(this.armors[i]!, name);
      }
    } else {
      this.armorRow.style.display = 'none';
    }

    const showBubbles = frame.underwater || frame.breathSec < frame.maxBreathSec;
    if (showBubbles) {
      const breathPer = frame.maxBreathSec / BUBBLES;
      for (let i = 0; i < BUBBLES; i++) {
        const start = i * breathPer;
        const v = Math.max(0, Math.min(breathPer, frame.breathSec - start));
        const name: IconName = v > breathPer * 0.5 ? 'bubble_full' : 'bubble_empty';
        const el = this.bubbles[i]!;
        el.style.display = 'inline-block';
        this.blit(el, name);
      }
    } else {
      for (const c of this.bubbles) c.style.display = 'none';
    }

    const pct = frame.xpToNext > 0 ? frame.xpProgress / frame.xpToNext : 0;
    this.xpFill.style.width = `${String(Math.round(Math.max(0, Math.min(1, pct)) * 100))}%`;
    this.xpLabel.textContent = frame.xpLevel > 0 ? String(frame.xpLevel) : '';
  }

  private blit(target: HTMLCanvasElement, name: IconName): void {
    const src = this.atlas.get(name);
    const ctx = target.getContext('2d');
    if (!ctx || !src) return;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, target.width, target.height);
    ctx.drawImage(src, 0, 0);
  }
}

export class HurtVignette {
  private readonly root: HTMLDivElement;
  private intensity = 0;

  constructor(parent: HTMLElement) {
    this.root = document.createElement('div');
    this.root.style.cssText = [
      'position:fixed',
      'inset:0',
      'pointer-events:none',
      'z-index:5',
      'background:radial-gradient(ellipse at center, transparent 45%, rgba(180,0,0,0.85) 120%)',
      'opacity:0',
      'transition:opacity 120ms ease-out',
    ].join(';');
    parent.appendChild(this.root);
  }

  pulse(severity: number): void {
    this.intensity = Math.min(1, Math.max(this.intensity, severity));
    this.root.style.opacity = String(this.intensity.toFixed(2));
  }

  tick(dtSec: number): void {
    if (this.intensity > 0) {
      this.intensity = Math.max(0, this.intensity - dtSec * 0.9);
      this.root.style.opacity = this.intensity < 0.01 ? '0' : String(this.intensity.toFixed(2));
    }
  }
}
