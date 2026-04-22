// Boss bar HUD. Wither, Ender Dragon, and Warden show a full-width bar
// at the top of the screen while within rendering distance. Bar has a
// color + style; fragments (for dragon crystals) overlay a 6-notch
// progress texture.

export type BossColor = 'pink' | 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'white';
export type BossStyle = 'progress' | 'notched_6' | 'notched_10' | 'notched_12' | 'notched_20';

export interface BossBar {
  id: string;
  title: string;
  color: BossColor;
  style: BossStyle;
  progress: number; // 0..1
  visible: boolean;
  darkenSky: boolean;
  playBossMusic: boolean;
  createWorldFog: boolean;
}

export class BossBarRegistry {
  private readonly bars = new Map<string, BossBar>();

  create(bar: BossBar): void {
    this.bars.set(bar.id, bar);
  }

  remove(id: string): boolean {
    return this.bars.delete(id);
  }

  set(id: string, patch: Partial<BossBar>): boolean {
    const cur = this.bars.get(id);
    if (!cur) return false;
    Object.assign(cur, patch);
    return true;
  }

  setProgress(id: string, progress: number): boolean {
    return this.set(id, { progress: Math.max(0, Math.min(1, progress)) });
  }

  setVisibility(id: string, visible: boolean): boolean {
    return this.set(id, { visible });
  }

  visibleBars(): BossBar[] {
    return Array.from(this.bars.values()).filter((b) => b.visible);
  }

  get(id: string): BossBar | null {
    return this.bars.get(id) ?? null;
  }
}

// Predefined templates for vanilla bosses.
export function witherBar(): BossBar {
  return {
    id: 'wither',
    title: 'Wither',
    color: 'purple',
    style: 'progress',
    progress: 1,
    visible: true,
    darkenSky: false,
    playBossMusic: true,
    createWorldFog: false,
  };
}

export function dragonBar(_crystalsAlive: number): BossBar {
  return {
    id: 'ender_dragon',
    title: 'Ender Dragon',
    color: 'pink',
    style: 'notched_6',
    progress: 1,
    visible: true,
    darkenSky: true,
    playBossMusic: true,
    createWorldFog: true,
  };
}
