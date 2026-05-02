// Fire spread. Each tick a fire block considers each of 6 neighbors: if
// a neighbor is flammable (encouragement > 0) and the fire passes a
// chance roll, it ignites. Fire age 0..15 — ages to extinguish on stone.
// Humidity biomes slow spread; doFireTick gamerule disables all spread.

export interface FlammableDef {
  encouragement: number; // how readily fire spreads to this block
  flammability: number; // how quickly fire burns it out
}

// Per minecraft.wiki/w/Fire (encouragement = how readily fire spreads
// TO this block, flammability = how quickly fire burns it out).
const FLAMMABLE: Record<string, FlammableDef> = {
  'webmc:wool': { encouragement: 30, flammability: 60 },
  'webmc:tnt': { encouragement: 15, flammability: 100 },
  'webmc:coal_block': { encouragement: 5, flammability: 5 },
  'webmc:bookshelf': { encouragement: 30, flammability: 20 },
  'webmc:hay_block': { encouragement: 60, flammability: 20 },
  'webmc:dried_kelp_block': { encouragement: 30, flammability: 60 },
  // Plant matter that's commonly torched in builds — was missing,
  // letting players safely build with bamboo / vines next to lava.
  'webmc:bamboo': { encouragement: 60, flammability: 60 },
  'webmc:bamboo_block': { encouragement: 5, flammability: 5 },
  'webmc:vine': { encouragement: 15, flammability: 100 },
  'webmc:short_grass': { encouragement: 60, flammability: 100 },
  'webmc:tall_grass': { encouragement: 60, flammability: 100 },
  'webmc:fern': { encouragement: 60, flammability: 100 },
  'webmc:large_fern': { encouragement: 60, flammability: 100 },
  // Beds catch fire (vanilla bug-feature: bed-in-nether explodes, in
  // overworld they just burn).
  'webmc:bed': { encouragement: 5, flammability: 20 },
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
//
// Per-ignition slot pool: was a fresh {offset, blockBurned} literal
// for every neighbor that caught fire (up to 6 per fire block per
// random tick). A spreading forest fire churns dozens per second.
// Pool 6 persistent slots; each call resets SHARED_IGNITIONS.length=0
// (drops only the references, not the pool entries) and refills via
// pool slots.
const IGNITION_POOL: { offset: Vec3; blockBurned: string }[] = [];
for (let i = 0; i < 6; i++) {
  IGNITION_POOL.push({ offset: { x: 0, y: 0, z: 0 }, blockBurned: '' });
}
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
  // Wiki (minecraft.wiki/w/Fire#Burning_out): "At age 15, as long as
  // there isn't a flammable block below the fire, a block tick has a
  // 1/4 chance to extinguish the fire." Old 0.04 was 6× under wiki
  // canon, so fires that should naturally burn out in a few seconds
  // lingered for over half a minute. Sibling fire_age_spread.ts
  // already uses 0.25.
  if (result.newAge >= 15 && ctx.rng() < 0.25) {
    result.extinguish = true;
  }
  let poolIdx = 0;
  for (let i = 0; i < DIRS.length; i++) {
    const d = DIRS[i]!;
    const block = ctx.neighborAt(d.x, d.y, d.z);
    const def = flammabilityOf(block);
    if (def.encouragement === 0) continue;
    const spreadChance = ((def.encouragement + 40) / 500) * (1 - ctx.humidity * 0.5);
    if (ctx.rng() < spreadChance) {
      const slot = IGNITION_POOL[poolIdx++]!;
      slot.offset = d;
      slot.blockBurned = block;
      SHARED_IGNITIONS.push(slot);
    }
  }
  return result;
}

// Register a new flammable block (for datapacks).
export function registerFlammable(blockId: string, def: FlammableDef): void {
  FLAMMABLE[blockId] = def;
}
