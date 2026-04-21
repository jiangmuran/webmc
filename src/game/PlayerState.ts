import type { Inventory } from '@/items/Inventory';

export const MAX_HEALTH = 20;
export const MAX_HUNGER = 20;
export const HUNGER_DECAY_PER_SEC = 20 / (20 * 60); // ≈ 20 shanks over 20 minutes baseline
export const STARVE_HUNGER_THRESHOLD = 0;
export const STARVE_DAMAGE_PER_SEC = 0.5;
export const HUNGER_HEAL_MIN = 18; // above this, slow HP regen
export const HP_REGEN_PER_SEC = 1;

export interface DamageEvent {
  amount: number;
  source?: string;
}

export interface PlayerStateOptions {
  inventory: Inventory;
  onRespawn?: () => void;
}

export class PlayerState {
  health = MAX_HEALTH;
  hunger = MAX_HUNGER;
  saturation = 5;
  sprinting = false;
  readonly inventory: Inventory;
  private readonly onRespawn: () => void;

  constructor(opts: PlayerStateOptions) {
    this.inventory = opts.inventory;
    this.onRespawn = opts.onRespawn ?? (() => undefined);
  }

  takeDamage(ev: DamageEvent): void {
    if (this.health <= 0) return;
    this.health = Math.max(0, this.health - ev.amount);
    if (this.health === 0) this.respawn();
  }

  eat(hungerRestore: number, saturationAdd: number): void {
    this.hunger = Math.min(MAX_HUNGER, this.hunger + hungerRestore);
    this.saturation = Math.min(this.hunger, this.saturation + saturationAdd);
  }

  heal(amount: number): void {
    this.health = Math.min(MAX_HEALTH, this.health + amount);
  }

  tick(dtSec: number): void {
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
  }

  respawn(): void {
    this.health = MAX_HEALTH;
    this.hunger = MAX_HUNGER;
    this.saturation = 5;
    this.inventory.clear();
    this.onRespawn();
  }

  get isDead(): boolean {
    return this.health <= 0;
  }
}
