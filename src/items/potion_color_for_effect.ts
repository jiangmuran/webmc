export const POTION_COLORS: Record<string, number> = {
  speed: 0x7cafc6,
  slowness: 0x5a6c81,
  haste: 0xd9c043,
  mining_fatigue: 0x4a4217,
  strength: 0x932423,
  instant_health: 0xf82423,
  instant_damage: 0x430a09,
  jump_boost: 0x22ff4c,
  nausea: 0x551d4a,
  regeneration: 0xcd5cab,
  resistance: 0x99453a,
  fire_resistance: 0xe49a3a,
  water_breathing: 0x2e5299,
  invisibility: 0x7f8392,
  blindness: 0x1f1f23,
  night_vision: 0x1f1fa1,
  hunger: 0x587653,
  weakness: 0x484d48,
  poison: 0x4e9331,
  wither: 0x352a27,
  health_boost: 0xf87d23,
  absorption: 0x2552a5,
  saturation: 0xf82423,
  glowing: 0x94a061,
  levitation: 0xceffff,
  luck: 0x339933,
  unluck: 0xd3f21a,
  slow_falling: 0xf8f5dc,
  conduit_power: 0x1dc2d1,
  dolphins_grace: 0x88a3be,
  bad_omen: 0x0b6138,
  hero_of_the_village: 0x44ff44,
  darkness: 0x292721,
  trial_omen: 0x16a6a6,
  infested: 0x8b74a7,
  oozing: 0x95ce96,
  raid_omen: 0xd16800,
  weaving: 0x4c3e76,
  wind_charged: 0xb4d3ef,
};

export function colorFor(id: string): number {
  return POTION_COLORS[id] ?? 0x385dc6;
}

export function colorMix(ids: readonly string[]): number {
  if (ids.length === 0) return 0x385dc6;
  let r = 0,
    g = 0,
    b = 0;
  for (const id of ids) {
    const c = colorFor(id);
    r += (c >> 16) & 0xff;
    g += (c >> 8) & 0xff;
    b += c & 0xff;
  }
  return (
    ((Math.floor(r / ids.length) & 0xff) << 16) |
    ((Math.floor(g / ids.length) & 0xff) << 8) |
    (Math.floor(b / ids.length) & 0xff)
  );
}
