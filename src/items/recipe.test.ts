import { describe, it, expect } from 'vitest';
import { ItemRegistry, stack } from './item';
import { type GridCell, RecipeRegistry, cellOf } from './recipe';

function setup(): {
  reg: ItemRegistry;
  wood: number;
  planks: number;
  stick: number;
  stone: number;
  pickaxe: number;
} {
  const reg = new ItemRegistry();
  const wood = reg.register({ name: 'webmc:wood', maxStack: 64, durability: 0 });
  const planks = reg.register({ name: 'webmc:planks', maxStack: 64, durability: 0 });
  const stick = reg.register({ name: 'webmc:stick', maxStack: 64, durability: 0 });
  const stone = reg.register({ name: 'webmc:stone_item', maxStack: 64, durability: 0 });
  const pickaxe = reg.register({ name: 'webmc:stone_pickaxe', maxStack: 1, durability: 132 });
  return { reg, wood, planks, stick, stone, pickaxe };
}

const EMPTY_ROW = (n: number): GridCell[] => new Array<GridCell>(n).fill(null);

describe('RecipeRegistry.resolve', () => {
  it('shapeless: 1 wood → 4 planks', () => {
    const { wood, planks } = setup();
    const r = new RecipeRegistry();
    r.register({ kind: 'shapeless', ingredients: [wood], result: stack(planks, 4) });
    const grid: GridCell[][] = [
      [cellOf(wood), null],
      [null, null],
    ];
    expect(r.resolve(grid)).toEqual(stack(planks, 4));
  });

  it('shapeless: 2 planks anywhere → 4 sticks', () => {
    const { planks, stick } = setup();
    const r = new RecipeRegistry();
    r.register({ kind: 'shapeless', ingredients: [planks, planks], result: stack(stick, 4) });
    const a: GridCell[][] = [
      [cellOf(planks), null],
      [cellOf(planks), null],
    ];
    const b: GridCell[][] = [
      [null, cellOf(planks)],
      [null, cellOf(planks)],
    ];
    expect(r.resolve(a)).toEqual(stack(stick, 4));
    expect(r.resolve(b)).toEqual(stack(stick, 4));
  });

  it('shaped: stone pickaxe (3 stone top + 2 stick below)', () => {
    const { stone, stick, pickaxe } = setup();
    const r = new RecipeRegistry();
    r.register({
      kind: 'shaped',
      pattern: [
        [stone, stone, stone],
        [null, stick, null],
        [null, stick, null],
      ],
      result: stack(pickaxe, 1),
    });
    const grid: GridCell[][] = [
      [cellOf(stone), cellOf(stone), cellOf(stone)],
      [null, cellOf(stick), null],
      [null, cellOf(stick), null],
    ];
    expect(r.resolve(grid)).toEqual(stack(pickaxe, 1));
  });

  it('shaped: pattern matches at any top-left offset', () => {
    const { wood, planks } = setup();
    const r = new RecipeRegistry();
    r.register({
      kind: 'shaped',
      pattern: [[wood, wood]],
      result: stack(planks, 1),
    });
    const topLeft: GridCell[][] = [[cellOf(wood), cellOf(wood), null], EMPTY_ROW(3), EMPTY_ROW(3)];
    const middle: GridCell[][] = [EMPTY_ROW(3), [null, cellOf(wood), cellOf(wood)], EMPTY_ROW(3)];
    expect(r.resolve(topLeft)).toEqual(stack(planks, 1));
    expect(r.resolve(middle)).toEqual(stack(planks, 1));
  });

  it('shaped: mirror is allowed by default', () => {
    const { stone, stick, pickaxe } = setup();
    const r = new RecipeRegistry();
    r.register({
      kind: 'shaped',
      pattern: [
        [stone, stick],
        [stone, stick],
      ],
      result: stack(pickaxe, 1),
    });
    const mirrored: GridCell[][] = [
      [cellOf(stick), cellOf(stone)],
      [cellOf(stick), cellOf(stone)],
    ];
    expect(r.resolve(mirrored)).toEqual(stack(pickaxe, 1));
  });

  it('shaped: mirror can be disabled', () => {
    const { stone, stick, pickaxe } = setup();
    const r = new RecipeRegistry();
    r.register({
      kind: 'shaped',
      pattern: [[stone, stick]],
      mirror: false,
      result: stack(pickaxe, 1),
    });
    const mirrored: GridCell[][] = [[cellOf(stick), cellOf(stone)]];
    expect(r.resolve(mirrored)).toBeNull();
  });

  it('returns null for unmatched grids', () => {
    const { wood, planks } = setup();
    const r = new RecipeRegistry();
    r.register({ kind: 'shaped', pattern: [[wood, wood]], result: stack(planks, 1) });
    const solo: GridCell[][] = [[cellOf(wood), null]];
    expect(r.resolve(solo)).toBeNull();
  });

  it('shapeless with wrong count returns null', () => {
    const { wood, planks } = setup();
    const r = new RecipeRegistry();
    r.register({ kind: 'shapeless', ingredients: [wood, wood], result: stack(planks, 2) });
    expect(r.resolve([[cellOf(wood)]])).toBeNull();
  });
});
