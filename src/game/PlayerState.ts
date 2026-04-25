import type { Inventory } from '@/items/Inventory';

export const MAX_HEALTH = 20;
export const MAX_HUNGER = 20;
export const HUNGER_DECAY_PER_SEC = 20 / (20 * 60); // ≈ 20 shanks over 20 minutes baseline
export const STARVE_HUNGER_THRESHOLD = 0;
export const STARVE_DAMAGE_PER_SEC = 0.5;
export const HUNGER_HEAL_MIN = 18; // above this, slow HP regen
export const HP_REGEN_PER_SEC = 1;
export const LAVA_DAMAGE_PER_SEC = 4;
export const DROWN_DAMAGE_PER_SEC = 2;
export const BREATH_MAX_SEC = 15;

// MC XP curve: 1-16: 2n+7 ; 17-31: 5n-38 ; 32+: 9n-158
export function xpToNext(level: number): number {
  if (level < 16) return 2 * level + 7;
  if (level < 31) return 5 * level - 38;
  return 9 * level - 158;
}

export interface DamageEvent {
  amount: number;
  source?: string;
}

export interface PlayerStateOptions {
  inventory: Inventory;
  onRespawn?: () => void;
  onDeath?: () => void;
}

export class PlayerState {
  health = MAX_HEALTH;
  hunger = MAX_HUNGER;
  saturation = 5;
  sprinting = false;
  breath = BREATH_MAX_SEC;
  xpLevel = 0;
  xpProgress = 0;
  readonly effects = new Map<string, { amplifier: number; remainingSec: number }>();
  readonly inventory: Inventory;
  private readonly onRespawn: () => void;
  private readonly onDeathCb: () => void;

  constructor(opts: PlayerStateOptions) {
    this.inventory = opts.inventory;
    this.onRespawn = opts.onRespawn ?? (() => undefined);
    this.onDeathCb = opts.onDeath ?? (() => undefined);
  }

  invulnerable = false;
  justDied = false;
  hitImmuneSec = 0;
  fireRemainingSec = 0;

  takeDamage(ev: DamageEvent): void {
    if (this.invulnerable) return;
    if (this.health <= 0) return;
    if (this.hitImmuneSec > 0 && ev.source !== 'starvation' && ev.source !== 'drown') return;
    this.health = Math.max(0, this.health - ev.amount);
    this.hitImmuneSec = 0.5;
    if (this.health === 0) {
      this.justDied = true;
      this.respawn();
    }
  }

  eat(hungerRestore: number, saturationAdd: number): void {
    this.hunger = Math.min(MAX_HUNGER, this.hunger + hungerRestore);
    this.saturation = Math.min(this.hunger, this.saturation + saturationAdd);
  }

  heal(amount: number): void {
    this.health = Math.min(MAX_HEALTH, this.health + amount);
  }

  addXP(xp: number): void {
    if (xp <= 0) return;
    this.xpProgress += xp;
    while (this.xpProgress >= xpToNext(this.xpLevel)) {
      this.xpProgress -= xpToNext(this.xpLevel);
      this.xpLevel++;
    }
  }

  spendXPLevels(levels: number): boolean {
    if (this.xpLevel < levels) return false;
    this.xpLevel -= levels;
    return true;
  }

  applyEffect(id: string, amplifier: number, durationSec: number): void {
    const cur = this.effects.get(id);
    if (cur && cur.amplifier >= amplifier && cur.remainingSec > durationSec) return;
    this.effects.set(id, { amplifier, remainingSec: durationSec });
  }

  tick(dtSec: number, env: { inFluid?: 'water' | 'lava' | null } = {}): void {
    if (this.hitImmuneSec > 0) this.hitImmuneSec = Math.max(0, this.hitImmuneSec - dtSec);
    if (this.health <= 0) return;
    let decay = HUNGER_DECAY_PER_SEC;
    if (this.sprinting) decay *= 4;
    if (this.saturation > 0) {
      this.saturation = Math.max(0, this.saturation - decay);
    } else if (this.hunger > 0) {
      this.hunger = Math.max(0, this.hunger - decay);
    } else if (this.hunger === STARVE_HUNGER_THRESHOLD) {
      this.takeDamage({ amount: STARVE_DAMAGE_PER_SEC * dtSec, source: 'starvation' });
    }
    if (this.hunger >= HUNGER_HEAL_MIN && this.saturation > 0 && this.health < MAX_HEALTH) {
      this.heal(HP_REGEN_PER_SEC * dtSec);
      this.saturation = Math.max(0, this.saturation - dtSec * 0.5);
    }
    const fireImmune = this.effects.has('fire_resistance');
    if (env.inFluid === 'lava') {
      if (!fireImmune) this.takeDamage({ amount: LAVA_DAMAGE_PER_SEC * dtSec, source: 'lava' });
      if (!fireImmune) this.fireRemainingSec = 5;
    } else if (env.inFluid === 'water') {
      this.fireRemainingSec = 0;
    } else if (this.fireRemainingSec > 0) {
      this.fireRemainingSec = Math.max(0, this.fireRemainingSec - dtSec);
      if (!fireImmune) this.takeDamage({ amount: 1 * dtSec, source: 'fire' });
    }
    if (env.inFluid === 'water') {
      this.breath = Math.max(0, this.breath - dtSec);
      if (this.breath <= 0) {
        this.takeDamage({ amount: DROWN_DAMAGE_PER_SEC * dtSec, source: 'drown' });
      }
    } else {
      this.breath = Math.min(BREATH_MAX_SEC, this.breath + dtSec * 3);
    }
    for (const [id, eff] of this.effects) {
      eff.remainingSec -= dtSec;
      if (eff.remainingSec <= 0) {
        this.effects.delete(id);
        continue;
      }
      if (id === 'regeneration') {
        this.heal(0.5 * (eff.amplifier + 1) * dtSec);
      } else if (id === 'poison' && this.health > 1) {
        this.takeDamage({ amount: 0.5 * (eff.amplifier + 1) * dtSec, source: 'poison' });
      } else if (id === 'instant_health') {
        this.heal(4 * (eff.amplifier + 1));
        this.effects.delete(id);
      } else if (id === 'instant_damage') {
        this.takeDamage({ amount: 3 * (eff.amplifier + 1), source: 'harming' });
        this.effects.delete(id);
      }
    }
  }

  respawn(): void {
    this.onDeathCb();
    this.health = MAX_HEALTH;
    this.hunger = MAX_HUNGER;
    this.saturation = 5;
    this.breath = BREATH_MAX_SEC;
    this.xpLevel = 0;
    this.xpProgress = 0;
    this.effects.clear();
    this.inventory.clear();
    this.onRespawn();
  }

  get isDead(): boolean {
    return this.health <= 0;
  }
}
