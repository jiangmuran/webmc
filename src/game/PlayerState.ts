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
  private regenAccumSec = 0;
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
  lastDeathCause: string | undefined;
  lastDamageSource: string | undefined;
  exhaustion = 0;
  absorption = 0; // bonus HP buffer; depletes first

  takeDamage(ev: DamageEvent): void {
    if (this.invulnerable) return;
    if (this.health <= 0) return;
    if (
      this.hitImmuneSec > 0 &&
      ev.source !== 'starvation' &&
      ev.source !== 'drown' &&
      ev.source !== 'suffocation' &&
      ev.source !== 'void' &&
      ev.source !== 'lava' &&
      ev.source !== 'fire' &&
      ev.source !== 'poison' &&
      // Wither effect (and magic damage) ticks past i-frames in vanilla —
      // listing wither alongside poison so a wither II potion + a hit
      // doesn't silently skip every wither tick during the 0.5s window.
      ev.source !== 'wither' &&
      ev.source !== 'magic'
    )
      return;
    // Resistance reduces damage by 0.2 * (amplifier+1), clamped to 80% reduction.
    const resist = this.effects.get('resistance');
    const reduction = resist ? Math.min(0.8, 0.2 * (resist.amplifier + 1)) : 0;
    let dmg = ev.amount * (1 - reduction);
    // Absorption soaks damage first.
    if (this.absorption > 0 && dmg > 0) {
      const taken = Math.min(this.absorption, dmg);
      this.absorption -= taken;
      dmg -= taken;
    }
    this.health = Math.max(0, this.health - dmg);
    this.hitImmuneSec = 0.5;
    if (ev.source !== undefined) this.lastDamageSource = ev.source;
    // MC: damage_taken adds 0.1 exhaustion (continuous sources scale tiny).
    if (dmg > 0) {
      const exh =
        ev.source === 'starvation' || ev.source === 'wither' || ev.source === 'poison' ? 0 : 0.1;
      if (exh > 0) this.exhaustion += exh;
    }
    if (this.health === 0) {
      this.justDied = true;
      this.lastDeathCause = ev.source ?? this.lastDamageSource;
      // Don't auto-respawn here. Caller handles death sequence
      // (totem of undying check, item drops, death screen) and decides
      // whether to call respawn(). Old behavior wiped inventory before
      // anyone got a chance to read it, breaking totems entirely.
    }
  }

  eat(hungerRestore: number, saturationAdd: number): void {
    this.hunger = Math.min(MAX_HUNGER, this.hunger + hungerRestore);
    this.saturation = Math.min(this.hunger, this.saturation + saturationAdd);
  }

  addExhaustion(amount: number): void {
    this.exhaustion += amount;
    while (this.exhaustion >= 4) {
      this.exhaustion -= 4;
      if (this.saturation > 0) this.saturation = Math.max(0, this.saturation - 1);
      else this.hunger = Math.max(0, this.hunger - 1);
    }
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
    if (this.hunger >= HUNGER_HEAL_MIN && this.health < MAX_HEALTH) {
      this.regenAccumSec += dtSec;
      // Fast regen: full hunger + saturation > 0 → heal 1 HP every 0.5s.
      // Normal regen: hunger ≥ 18 → heal 1 HP every 4s.
      const intervalSec = this.hunger >= 20 && this.saturation > 0 ? 0.5 : 4.0;
      while (this.regenAccumSec >= intervalSec) {
        this.regenAccumSec -= intervalSec;
        this.heal(1);
        this.addExhaustion(6);
      }
    } else {
      this.regenAccumSec = 0;
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
    const waterBreathing = this.effects.has('water_breathing');
    if (env.inFluid === 'water' && !waterBreathing) {
      this.breath = Math.max(0, this.breath - dtSec);
      if (this.breath <= 0) {
        this.takeDamage({ amount: DROWN_DAMAGE_PER_SEC * dtSec, source: 'drown' });
      }
    } else {
      this.breath = Math.min(BREATH_MAX_SEC, this.breath + dtSec * 3);
    }
    let absorptionTarget = 0;
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
      } else if (id === 'absorption') {
        absorptionTarget = Math.max(absorptionTarget, 4 * (eff.amplifier + 1));
      } else if (id === 'wither' && this.health > 0) {
        this.takeDamage({ amount: 1 * (eff.amplifier + 1) * dtSec, source: 'wither' });
      } else if (id === 'hunger') {
        this.exhaustion += 0.1 * (eff.amplifier + 1) * dtSec;
      }
    }
    // Absorption: bring up to target; never decay automatically (drained by damage).
    if (absorptionTarget > this.absorption) this.absorption = absorptionTarget;
  }

  respawn(): void {
    this.onDeathCb();
    this.health = MAX_HEALTH;
    this.hunger = MAX_HUNGER;
    this.saturation = 5;
    this.breath = BREATH_MAX_SEC;
    this.xpLevel = 0;
    this.xpProgress = 0;
    // Clear residual statuses too — fire damage carrying over a respawn
    // would kill the player again instantly; absorption hearts shouldn't
    // persist; hit-immune frame and exhaustion accumulator both belong
    // to the previous life.
    this.exhaustion = 0;
    this.absorption = 0;
    this.fireRemainingSec = 0;
    this.hitImmuneSec = 0;
    this.effects.clear();
    this.inventory.clear();
    this.onRespawn();
  }

  get isDead(): boolean {
    return this.health <= 0;
  }
}
