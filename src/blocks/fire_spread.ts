// Fire spread. Each tick a fire block considers each of 6 neighbors: if
// a neighbor is flammable (encouragement > 0) and the fire passes a
// chance roll, it ignites. Fire age 0..15 — ages to extinguish on stone.
// Humidity biomes slow spread; doFireTick gamerule disables all spread.

export interface FlammableDef {
  encouragement: number; // how readily fire spreads to this block
  flammability: number; // how quickly fire burns it out
}

const FLAMMABLE: Record<string, FlammableDef> = {
  'webmc:wool': { encouragement: 30, flammability: 60 },
  'webmc:tnt': { encouragement: 15, flammability: 100 },
  'webmc:coal_block': { encouragement: 5, flammability: 5 },
  'webmc:bookshelf': { encouragement: 30, flammability: 20 },
  'webmc:hay_block': { encouragement: 60, flammability: 20 },
  'webmc:dried_kelp_block': { encouragement: 30, flammability: 60 },
};
// Was oak-only — fire would happily ignite an oak forest but the same
// fire next to a spruce log did nothing. Add all log + planks + leaves
// variants. Crimson + warped are vanilla-explicit non-flammable.
const FLAMMABLE_WOODS = [
  'oak',
  'spruce',
  'birch',
  'jungle',
  'acacia',
  'dark_oak',
  'cherry',
  'mangrove',
  'pale_oak',
];
for (const w of FLAMMABLE_WOODS) {
  FLAMMABLE[`webmc:${w}_log`] = { encouragement: 5, flammability: 5 };
  FLAMMABLE[`webmc:${w}_planks`] = { encouragement: 5, flammability: 20 };
  FLAMMABLE[`webmc:${w}_leaves`] = { encouragement: 30, flammability: 60 };
  FLAMMABLE[`webmc:stripped_${w}_log`] = { encouragement: 5, flammability: 5 };
}

export function flammabilityOf(blockId: string): FlammableDef {
  return FLAMMABLE[blockId] ?? { encouragement: 0, flammability: 0 };
}

export function isFlammable(blockId: string): boolean {
  return flammabilityOf(blockId).encouragement > 0;
}

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface FireTickCtx {
  pos: Vec3;
  age: number; // 0..15
  fireTickAllowed: boolean;
  humidity: number; // biome humidity 0..1
  neighborAt: (dx: number, dy: number, dz: number) => string;
  rng: () => number;
}

export interface FireTickResult {
  newAge: number;
  extinguish: boolean;
  ignitions: readonly { offset: Vec3; blockBurned: string }[];
}

// Module-scope constant — was a fresh array of 6 literals every tickFire call.
const DIRS: readonly Vec3[] = [
  { x: 1, y: 0, z: 0 },
  { x: -1, y: 0, z: 0 },
  { x: 0, y: 1, z: 0 },
  { x: 0, y: -1, z: 0 },
  { x: 0, y: 0, z: 1 },
  { x: 0, y: 0, z: -1 },
];
// Reused per-call result + ignitions list. tickFire is called from the
// random-tick scan for every fire block found; caller reads the result
// fields synchronously and doesn't keep the reference.
const SHARED_IGNITIONS: { offset: Vec3; blockBurned: string }[] = [];
const SHARED_RESULT: FireTickResult = {
  newAge: 0,
  extinguish: false,
  ignitions: SHARED_IGNITIONS,
};

// Per-tick spread. Fire ages up by 1; chance to ignite each neighbor
// proportional to (encouragement + 40) / 500 modulated by humidity.
export function tickFire(ctx: FireTickCtx): FireTickResult {
  const result = SHARED_RESULT;
  result.newAge = ctx.age;
  result.extinguish = false;
  SHARED_IGNITIONS.length = 0;
  if (!ctx.fireTickAllowed) return result;
  result.newAge = Math.min(15, ctx.age + 1);
  if (result.newAge >= 15 && ctx.rng() < 0.04) {
    result.extinguish = true;
  }
  for (let i = 0; i < DIRS.length; i++) {
    const d = DIRS[i]!;
    const block = ctx.neighborAt(d.x, d.y, d.z);
    const def = flammabilityOf(block);
    if (def.encouragement === 0) continue;
    const spreadChance = ((def.encouragement + 40) / 500) * (1 - ctx.humidity * 0.5);
    if (ctx.rng() < spreadChance) {
      SHARED_IGNITIONS.push({ offset: d, blockBurned: block });
    }
  }
  return result;
}

// Register a new flammable block (for datapacks).
export function registerFlammable(blockId: string, def: FlammableDef): void {
  FLAMMABLE[blockId] = def;
}
