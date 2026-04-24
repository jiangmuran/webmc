import * as THREE from 'three';

export interface DayNightOptions {
  dayLengthSec: number;
  startTimeOfDay: number;
}

const DEFAULTS: DayNightOptions = {
  dayLengthSec: 600,
  startTimeOfDay: 0.25,
};

const COLOR_NIGHT = new THREE.Color(0x0a1020);
const COLOR_DAWN = new THREE.Color(0xffad6b);
const COLOR_DAY = new THREE.Color(0x8db5f0);
const COLOR_DUSK = new THREE.Color(0xff7a48);

export class DayNightCycle {
  readonly sunDir = new THREE.Vector3(0.5, 0.9, 0.3).normalize();
  readonly skyColor = new THREE.Color();
  readonly fogColor = new THREE.Color();
  ambient = 0.08;
  timeOfDay: number;
  private opts: DayNightOptions;

  constructor(opts: Partial<DayNightOptions> = {}) {
    this.opts = { ...DEFAULTS, ...opts };
    this.timeOfDay = this.opts.startTimeOfDay;
    this.update(0);
  }

  tick(dtSec: number): void {
    this.timeOfDay = (this.timeOfDay + dtSec / this.opts.dayLengthSec) % 1;
    if (this.timeOfDay < 0) this.timeOfDay += 1;
    this.update(0);
  }

  private update(_dummy: number): void {
    void _dummy;
    const t = this.timeOfDay;
    // At t=0.25 sun is on east horizon, t=0.5 noon (max y), t=0.75 west horizon,
    // t=0/1 midnight. Offset so timeOfDay 0.75 is already below horizon.
    const sunAngle = (t - 0.25) * Math.PI * 2;
    this.sunDir.set(Math.cos(sunAngle) * 0.3, Math.sin(sunAngle) * 0.95 - 0.05, 0.4).normalize();

    const sun = Math.sin(sunAngle);
    if (sun < -0.25) {
      this.skyColor.copy(COLOR_NIGHT);
      this.ambient = 0.04;
    } else if (sun < 0) {
      const k = (sun + 0.25) / 0.25;
      this.skyColor.copy(COLOR_NIGHT).lerp(sun < -0.125 ? COLOR_DAWN : COLOR_DUSK, k);
      this.ambient = 0.04 + 0.04 * k;
    } else if (sun < 0.2) {
      const k = sun / 0.2;
      this.skyColor.copy(t < 0.5 ? COLOR_DAWN : COLOR_DUSK).lerp(COLOR_DAY, k);
      this.ambient = 0.08 + 0.22 * k;
    } else {
      this.skyColor.copy(COLOR_DAY);
      this.ambient = 0.3;
    }
    this.fogColor.copy(this.skyColor);
  }

  get isDay(): boolean {
    return this.timeOfDay >= 0.25 && this.timeOfDay < 0.75;
  }

  setTimeOfDayTicks(ticks: number): void {
    const wrapped = ((ticks % 24000) + 24000) % 24000;
    this.timeOfDay = wrapped / 24000;
    this.update(0);
  }
}
