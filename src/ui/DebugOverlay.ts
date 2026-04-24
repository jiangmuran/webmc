export interface DebugFrame {
  fps: number;
  frameMs: number;
  position: { x: number; y: number; z: number };
  look: { yaw: number; pitch: number };
  chunkPos: { cx: number; cz: number };
  meshCount: number;
  triangles: number;
  pendingChunks: number;
  gameMode: string;
  biome?: string;
  timeOfDay: number;
  health: number;
  hunger: number;
  fly: boolean;
  onGround: boolean;
  fluid: string | null;
  viewDistance: number;
  rendererName: string;
  memoryMB?: number;
  mobs?: number;
  drops?: number;
  xpOrbs?: number;
  seed?: number;
}

export class DebugOverlay {
  readonly root: HTMLDivElement;
  private enabled = false;

  constructor(parent: HTMLElement) {
    this.root = document.createElement('div');
    this.root.setAttribute('data-testid', 'debug-overlay');
    this.root.style.cssText = [
      'position:fixed',
      'top:8px',
      'left:8px',
      'padding:6px 10px',
      'background:rgba(10,14,20,0.78)',
      'border:1px solid rgba(230,237,243,0.15)',
      'border-radius:6px',
      'font-size:12px',
      'line-height:1.5',
      'pointer-events:none',
      'user-select:none',
      'white-space:pre',
      'color:#9ee19e',
      'display:none',
      'z-index:50',
      'max-width:420px',
    ].join(';');
    parent.appendChild(this.root);
  }

  setEnabled(on: boolean): void {
    this.enabled = on;
    this.root.style.display = on ? 'block' : 'none';
  }

  toggle(): void {
    this.setEnabled(!this.enabled);
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  render(f: DebugFrame): void {
    if (!this.enabled) return;
    const yawDeg = ((f.look.yaw * 180) / Math.PI) % 360;
    const pitchDeg = (f.look.pitch * 180) / Math.PI;
    const facing = facingFromYaw(f.look.yaw);
    const mem = f.memoryMB === undefined ? '' : `\nmem  ${f.memoryMB.toFixed(0)} MB`;
    const entities =
      f.mobs !== undefined
        ? `mobs ${String(f.mobs)}  drops ${String(f.drops ?? 0)}  xp ${String(f.xpOrbs ?? 0)}\n`
        : '';
    this.root.textContent =
      `webmc — F3 debug\n` +
      `fps  ${f.fps.toFixed(0).padStart(3)}  frame ${f.frameMs.toFixed(1).padStart(5)} ms\n` +
      `pos  ${f.position.x.toFixed(2)} ${f.position.y.toFixed(2)} ${f.position.z.toFixed(2)}\n` +
      `chunk  ${String(f.chunkPos.cx)} ${String(f.chunkPos.cz)}  view ${String(f.viewDistance)}\n` +
      `facing  ${facing} (yaw ${yawDeg.toFixed(0)}°, pitch ${pitchDeg.toFixed(0)}°)\n` +
      `meshes ${String(f.meshCount)}  tris ${f.triangles.toLocaleString()}  pending ${String(f.pendingChunks)}\n` +
      entities +
      `mode  ${f.gameMode}  fly ${f.fly ? 'y' : 'n'}  onGround ${f.onGround ? 'y' : 'n'}  fluid ${f.fluid ?? '-'}\n` +
      `HP ${f.health.toFixed(0)}/20  food ${f.hunger.toFixed(0)}/20\n` +
      `time  ${f.timeOfDay.toFixed(2)}${f.seed !== undefined ? `  seed ${String(f.seed)}` : ''}\n` +
      `${f.rendererName}${mem}`;
  }
}

export function facingFromYaw(yaw: number): 'north' | 'south' | 'east' | 'west' {
  // lookVector at yaw=0 is (0,0,-1) = north. yaw increases CCW (+Y axis rotation),
  // so yaw=+π/2 points +X = east (mouse right, we subtract yaw → pointing +X after).
  const norm = ((yaw % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  const octant = Math.floor((norm + Math.PI / 4) / (Math.PI / 2)) % 4;
  return (['north', 'west', 'south', 'east'] as const)[octant] ?? 'north';
}
