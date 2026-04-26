import type { Inventory } from '@/items/Inventory';
import type { ItemRegistry } from '@/items/item';
import type { Recipe, RecipeRegistry } from '@/items/recipe';
import { attemptCraft, hasAllIngredients } from '@/items/CraftingHelper';

// Returns the inventory.armor[] index for an armor item, or null if not
// armor. Inferred from item name so we don't need to thread ARMOR_DEFS
// through the UI module. Slot order matches Minecraft: 0=head, 1=chest,
// 2=legs, 3=feet.
function armorSlotForName(name: string): number | null {
  if (name.includes('helmet') || name === 'webmc:turtle_shell') return 0;
  if (name.includes('chestplate') || name === 'webmc:elytra') return 1;
  if (name.includes('leggings')) return 2;
  if (name.includes('boots')) return 3;
  return null;
}
function armorSlotName(idx: number): string {
  return idx === 0 ? 'helmet' : idx === 1 ? 'chest' : idx === 2 ? 'legs' : 'feet';
}

export interface SurvivalInventoryCallbacks {
  onClose: () => void;
  onEat?: (itemId: number, hungerRestore: number, saturation: number) => void;
  // Returns the player's current hunger (0..20). UI uses it to gate
  // out clicks on regular food when hunger is full — vanilla rejects
  // eating at full hunger except for "always edible" items (handled
  // by the eat handler itself).
  getHunger?: () => number;
}

export class SurvivalInventory {
  private readonly root: HTMLDivElement;
  private readonly grid: HTMLDivElement;
  private visible = false;
  private readonly cb: SurvivalInventoryCallbacks;

  constructor(
    parent: HTMLElement,
    private readonly inventory: Inventory,
    private readonly registry: ItemRegistry,
    cb: SurvivalInventoryCallbacks,
    private readonly recipes?: RecipeRegistry,
  ) {
    this.cb = cb;
    this.root = document.createElement('div');
    this.root.style.cssText = [
      'position:fixed',
      'inset:0',
      'display:none',
      'align-items:center',
      'justify-content:center',
      'background:rgba(0,0,0,0.55)',
      'z-index:900',
      'pointer-events:auto',
    ].join(';');

    const panel = document.createElement('div');
    panel.style.cssText = [
      'background:rgba(22,28,38,0.96)',
      'border:1px solid rgba(255,255,255,0.18)',
      'border-radius:8px',
      'padding:14px',
      'display:flex',
      'flex-direction:column',
      'gap:10px',
      'color:#e6edf3',
      'font:inherit',
      'font-size:13px',
      'min-width:380px',
    ].join(';');

    const title = document.createElement('div');
    title.textContent = 'Inventory';
    title.style.cssText = 'font-size:16px;font-weight:600;';
    panel.appendChild(title);

    const mainLabel = document.createElement('div');
    mainLabel.textContent = 'Main (27)';
    mainLabel.style.cssText = 'opacity:0.7;font-size:11px;';
    panel.appendChild(mainLabel);

    this.grid = document.createElement('div');
    this.grid.setAttribute('data-main-grid', 'true');
    this.grid.style.cssText = [
      'display:grid',
      'grid-template-columns:repeat(9, 40px)',
      'gap:3px',
    ].join(';');
    panel.appendChild(this.grid);

    const hotLabel = document.createElement('div');
    hotLabel.textContent = 'Hotbar (9)';
    hotLabel.style.cssText = 'opacity:0.7;font-size:11px;margin-top:8px;';
    panel.appendChild(hotLabel);

    const hotGrid = document.createElement('div');
    hotGrid.setAttribute('data-hotbar-grid', 'true');
    hotGrid.style.cssText = 'display:grid;grid-template-columns:repeat(9, 40px);gap:3px;';
    panel.appendChild(hotGrid);
    this.hotGrid = hotGrid;

    const armorLabel = document.createElement('div');
    armorLabel.textContent = 'Armor (head/chest/legs/feet)';
    armorLabel.style.cssText = 'opacity:0.7;font-size:11px;margin-top:8px;';
    panel.appendChild(armorLabel);
    const armorGrid = document.createElement('div');
    armorGrid.setAttribute('data-armor-grid', 'true');
    armorGrid.style.cssText = 'display:grid;grid-template-columns:repeat(4, 40px);gap:3px;';
    panel.appendChild(armorGrid);
    this.armorGrid = armorGrid;

    const craftLabel = document.createElement('div');
    craftLabel.textContent = 'Craftable';
    craftLabel.style.cssText = 'opacity:0.7;font-size:11px;margin-top:8px;';
    panel.appendChild(craftLabel);

    this.craftList = document.createElement('div');
    this.craftList.style.cssText =
      'display:flex;flex-wrap:wrap;gap:4px;max-height:120px;overflow-y:auto;';
    panel.appendChild(this.craftList);

    const smeltLabel = document.createElement('div');
    smeltLabel.textContent = 'Smeltable (needs coal)';
    smeltLabel.style.cssText = 'opacity:0.7;font-size:11px;margin-top:8px;';
    panel.appendChild(smeltLabel);

    this.smeltList = document.createElement('div');
    this.smeltList.style.cssText =
      'display:flex;flex-wrap:wrap;gap:4px;max-height:80px;overflow-y:auto;';
    panel.appendChild(this.smeltList);

    const buttonRow = document.createElement('div');
    buttonRow.style.cssText = 'display:flex;gap:8px;align-self:flex-end;';
    const sortBtn = document.createElement('button');
    sortBtn.textContent = 'Sort';
    sortBtn.style.cssText =
      'padding:6px 14px;background:rgba(70,100,70,0.85);color:#fff;border:1px solid rgba(255,255,255,0.18);border-radius:3px;cursor:pointer;font:inherit;font-size:12px;';
    sortBtn.addEventListener('click', () => {
      this.sortInventory();
      this.refresh();
    });
    buttonRow.appendChild(sortBtn);
    const close = document.createElement('button');
    close.textContent = 'Close';
    close.style.cssText =
      'padding:6px 14px;background:rgba(50,80,110,0.85);color:#fff;border:1px solid rgba(255,255,255,0.18);border-radius:3px;cursor:pointer;font:inherit;font-size:12px;';
    close.addEventListener('click', () => {
      this.hide();
    });
    buttonRow.appendChild(close);
    panel.appendChild(buttonRow);

    this.root.appendChild(panel);
    parent.appendChild(this.root);
  }

  private readonly hotGrid: HTMLDivElement;
  private readonly armorGrid!: HTMLDivElement;
  private readonly craftList!: HTMLDivElement;
  private readonly smeltList!: HTMLDivElement;

  private renderSlot(
    stack: { itemId: number; count: number; damage: number } | null,
  ): HTMLDivElement {
    const slot = document.createElement('div');
    slot.style.cssText = [
      'width:40px',
      'height:40px',
      'background:rgba(0,0,0,0.5)',
      'border:2px solid rgba(255,255,255,0.12)',
      'border-radius:3px',
      'font-size:10px',
      'color:#fff',
      'display:flex',
      'align-items:flex-end',
      'justify-content:flex-end',
      'padding:2px',
      'position:relative',
    ].join(';');
    if (!stack || stack.count <= 0) {
      return slot;
    }
    const def = this.registry.get(stack.itemId);
    const label = document.createElement('div');
    label.textContent = def.name.replace(/^webmc:/, '').slice(0, 6);
    label.style.cssText =
      'position:absolute;top:2px;left:3px;font-size:8px;line-height:10px;color:#ddd;';
    slot.appendChild(label);
    const count = document.createElement('div');
    count.textContent = String(stack.count);
    count.style.cssText = 'font-size:11px;font-weight:700;text-shadow:1px 1px 0 rgba(0,0,0,0.8);';
    slot.appendChild(count);
    // Durability bar at the bottom of the slot, when the item is a tool
    // and has been used at least once. Vanilla shows this as a colored bar
    // beneath each item icon. Without this, players had no UI feedback on
    // how much life their pickaxe had left until it broke.
    if (def.durability > 0 && stack.damage > 0) {
      const ratio = Math.max(0, 1 - stack.damage / def.durability);
      const bar = document.createElement('div');
      const r = Math.round(255 * (1 - ratio));
      const g = Math.round(255 * ratio);
      bar.style.cssText = [
        'position:absolute',
        'left:2px',
        'right:2px',
        'bottom:1px',
        'height:3px',
        'background:rgba(0,0,0,0.6)',
        'border-radius:1px',
        'overflow:hidden',
      ].join(';');
      const fill = document.createElement('div');
      fill.style.cssText = [
        'height:100%',
        `width:${(ratio * 100).toFixed(0)}%`,
        `background:rgb(${r},${g},0)`,
      ].join(';');
      bar.appendChild(fill);
      slot.appendChild(bar);
    }
    const isPotion = def.name.includes('potion_') || def.name === 'webmc:awkward_potion';
    const armorSlotIdx = armorSlotForName(def.name);
    if (((def.hungerRestore !== undefined && def.hungerRestore > 0) || isPotion) && this.cb.onEat) {
      slot.style.cursor = 'pointer';
      slot.style.borderColor = isPotion ? 'rgba(180,140,220,0.6)' : 'rgba(140,220,120,0.6)';
      slot.title = isPotion
        ? 'Click to drink'
        : `Click to eat (+${String(def.hungerRestore)} hunger)`;
      slot.addEventListener('click', () => {
        if (!this.cb.onEat) return;
        const container = slot.parentElement;
        if (!container) return;
        const idx = Array.from(container.children).indexOf(slot);
        if (idx < 0) return;
        const whichList = container.getAttribute('data-hotbar-grid') ? 'hotbar' : 'main';
        const slots = whichList === 'hotbar' ? this.inventory.hotbar : this.inventory.main;
        const cur = slots[idx];
        if (!cur || cur.count <= 0) return;
        // Full-hunger gate: regular food doesn't consume when you're full.
        // Always-edible items (potions, golden apples, chorus, honey)
        // bypass — those are about effects, not hunger.
        const alwaysEdible =
          isPotion ||
          def.name === 'webmc:golden_apple' ||
          def.name === 'webmc:enchanted_golden_apple' ||
          def.name === 'webmc:chorus_fruit' ||
          def.name === 'webmc:honey_bottle';
        const hunger = this.cb.getHunger?.() ?? 0;
        if (hunger >= 20 && !alwaysEdible) return;
        this.cb.onEat(def.id, def.hungerRestore ?? 0, def.saturation ?? 0);
        const after = cur.count - 1;
        slots[idx] = after <= 0 ? null : { ...cur, count: after };
        this.refresh();
      });
    } else if (armorSlotIdx !== null) {
      slot.style.cursor = 'pointer';
      slot.style.borderColor = 'rgba(180,180,255,0.6)';
      slot.title = `Click to equip (${armorSlotName(armorSlotIdx)})`;
      slot.addEventListener('click', () => {
        const container = slot.parentElement;
        if (!container) return;
        const idx = Array.from(container.children).indexOf(slot);
        if (idx < 0) return;
        const isHotbar = container.getAttribute('data-hotbar-grid') !== null;
        const slots = isHotbar ? this.inventory.hotbar : this.inventory.main;
        const cur = slots[idx];
        if (!cur || cur.count <= 0) return;
        // Swap into the armor slot. Whatever was equipped goes back to
        // the source slot — same swap pattern the right-click hotbar
        // shuffle uses.
        const prevArmor = this.inventory.armor[armorSlotIdx];
        this.inventory.armor[armorSlotIdx] = { itemId: cur.itemId, count: 1, damage: cur.damage };
        const remainingCount = cur.count - 1;
        if (prevArmor && remainingCount === 0) {
          slots[idx] = prevArmor;
        } else if (prevArmor) {
          slots[idx] = { ...cur, count: remainingCount };
          this.inventory.add(prevArmor);
        } else {
          slots[idx] = remainingCount > 0 ? { ...cur, count: remainingCount } : null;
        }
        this.refresh();
      });
    } else {
      slot.style.cursor = 'pointer';
      slot.title = 'Right-click to swap with hotbar';
    }
    slot.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      const container = slot.parentElement;
      if (!container) return;
      const idx = Array.from(container.children).indexOf(slot);
      if (idx < 0) return;
      const isHotbar = container.getAttribute('data-hotbar-grid') !== null;
      if (isHotbar) {
        const firstEmpty = this.inventory.main.findIndex((v) => !v);
        if (firstEmpty < 0) return;
        this.inventory.main[firstEmpty] = this.inventory.hotbar[idx] ?? null;
        this.inventory.hotbar[idx] = null;
      } else {
        const firstEmpty = this.inventory.hotbar.findIndex((v) => !v);
        if (firstEmpty < 0) return;
        this.inventory.hotbar[firstEmpty] = this.inventory.main[idx] ?? null;
        this.inventory.main[idx] = null;
      }
      this.refresh();
    });
    return slot;
  }

  private refresh(): void {
    this.grid.textContent = '';
    for (const s of this.inventory.main) {
      this.grid.appendChild(this.renderSlot(s));
    }
    this.hotGrid.textContent = '';
    for (const s of this.inventory.hotbar) {
      this.hotGrid.appendChild(this.renderSlot(s));
    }
    this.armorGrid.textContent = '';
    for (let i = 0; i < this.inventory.armor.length; i++) {
      this.armorGrid.appendChild(this.renderArmorSlot(i));
    }
    this.refreshCraftList();
    this.refreshSmeltList();
  }

  // Armor slot displays the equipped piece (if any) with click-to-unequip.
  // The slot label hints which body part it covers when empty.
  private renderArmorSlot(slotIdx: number): HTMLDivElement {
    const stack = this.inventory.armor[slotIdx] ?? null;
    const slot = document.createElement('div');
    slot.style.cssText = [
      'width:40px',
      'height:40px',
      'background:rgba(0,0,0,0.5)',
      'border:2px solid rgba(180,180,255,0.4)',
      'border-radius:3px',
      'font-size:9px',
      'color:#ccd',
      'display:flex',
      'align-items:flex-end',
      'justify-content:flex-end',
      'padding:2px',
      'position:relative',
      'cursor:pointer',
    ].join(';');
    if (!stack || stack.count <= 0) {
      const ph = document.createElement('div');
      ph.textContent = armorSlotName(slotIdx);
      ph.style.cssText =
        'position:absolute;top:50%;left:0;right:0;transform:translateY(-50%);text-align:center;opacity:0.5;font-size:9px;';
      slot.appendChild(ph);
      slot.title = `Empty ${armorSlotName(slotIdx)} slot`;
      return slot;
    }
    const def = this.registry.get(stack.itemId);
    const label = document.createElement('div');
    label.textContent = def.name.replace(/^webmc:/, '').slice(0, 6);
    label.style.cssText =
      'position:absolute;top:2px;left:3px;font-size:8px;line-height:10px;color:#ddd;';
    slot.appendChild(label);
    slot.title = `Click to unequip (${def.name.replace(/^webmc:/, '')})`;
    slot.addEventListener('click', () => {
      // Move equipped armor back to inventory. Mirrors vanilla shift-click
      // out of the armor slot.
      this.inventory.armor[slotIdx] = null;
      this.inventory.add(stack);
      this.refresh();
    });
    return slot;
  }

  private refreshSmeltList(): void {
    this.smeltList.textContent = '';
    // Accept any vanilla furnace fuel, not just coal. Players smelting
    // logs into charcoal then needing the charcoal to smelt more was
    // frustrating: the panel always said "need coal" even when they had
    // 64 charcoal in their hotbar.
    const FUEL_NAMES: readonly string[] = [
      'webmc:coal',
      'webmc:charcoal',
      'webmc:coal_block',
      'webmc:lava_bucket',
      'webmc:blaze_rod',
      'webmc:dried_kelp_block',
    ];
    let fuelId: number | undefined;
    for (const name of FUEL_NAMES) {
      const id = this.registry.byName(name);
      if (id !== undefined && this.inventoryCount(id) > 0) {
        fuelId = id;
        break;
      }
    }
    const hasFuel = fuelId !== undefined;
    // Full vanilla furnace recipe set (the common ones). Was just the 3
    // meats — players couldn't smelt iron, gold, copper, sand→glass,
    // cobble→stone, clay→brick, fish, mutton, rabbit, potato, kelp,
    // raw cactus, log→charcoal. Made the entire mid-game iron progression
    // impossible from the inventory UI.
    const pairs: readonly (readonly [string, string])[] = [
      ['webmc:raw_beef', 'webmc:cooked_beef'],
      ['webmc:raw_porkchop', 'webmc:cooked_porkchop'],
      ['webmc:raw_chicken', 'webmc:cooked_chicken'],
      ['webmc:raw_mutton', 'webmc:cooked_mutton'],
      ['webmc:raw_rabbit', 'webmc:cooked_rabbit'],
      ['webmc:cod', 'webmc:cooked_cod'],
      ['webmc:salmon', 'webmc:cooked_salmon'],
      ['webmc:potato', 'webmc:baked_potato'],
      ['webmc:kelp', 'webmc:dried_kelp'],
      ['webmc:raw_iron', 'webmc:iron_ingot'],
      ['webmc:iron_ore', 'webmc:iron_ingot'],
      ['webmc:deepslate_iron_ore', 'webmc:iron_ingot'],
      ['webmc:raw_gold', 'webmc:gold_ingot'],
      ['webmc:gold_ore', 'webmc:gold_ingot'],
      ['webmc:deepslate_gold_ore', 'webmc:gold_ingot'],
      ['webmc:raw_copper', 'webmc:copper_ingot'],
      ['webmc:copper_ore', 'webmc:copper_ingot'],
      ['webmc:deepslate_copper_ore', 'webmc:copper_ingot'],
      ['webmc:sand', 'webmc:glass'],
      ['webmc:red_sand', 'webmc:glass'],
      ['webmc:cobblestone', 'webmc:stone'],
      ['webmc:stone', 'webmc:smooth_stone'],
      ['webmc:cobbled_deepslate', 'webmc:deepslate'],
      ['webmc:clay_ball', 'webmc:brick'],
      ['webmc:clay', 'webmc:terracotta'],
      ['webmc:netherrack', 'webmc:nether_brick'],
      ['webmc:nether_quartz_ore', 'webmc:quartz'],
      ['webmc:cactus', 'webmc:green_dye'],
      ['webmc:oak_log', 'webmc:charcoal'],
      ['webmc:spruce_log', 'webmc:charcoal'],
      ['webmc:birch_log', 'webmc:charcoal'],
      ['webmc:jungle_log', 'webmc:charcoal'],
      ['webmc:acacia_log', 'webmc:charcoal'],
      ['webmc:dark_oak_log', 'webmc:charcoal'],
      ['webmc:cherry_log', 'webmc:charcoal'],
      ['webmc:mangrove_log', 'webmc:charcoal'],
      ['webmc:wet_sponge', 'webmc:sponge'],
      ['webmc:chorus_fruit', 'webmc:popped_chorus_fruit'],
      ['webmc:sea_pickle', 'webmc:lime_dye'],
    ];
    for (const [inName, outName] of pairs) {
      const inId = this.registry.byName(inName);
      const outId = this.registry.byName(outName);
      if (inId === undefined || outId === undefined) continue;
      const has = this.inventoryCount(inId) > 0;
      if (!has || !hasFuel) continue;
      const btn = document.createElement('button');
      const shortIn = inName.replace(/^webmc:/, '');
      const shortOut = outName.replace(/^webmc:/, '');
      btn.textContent = `${shortIn} → ${shortOut}`;
      btn.style.cssText = [
        'padding:4px 10px',
        'background:rgba(120,70,30,0.85)',
        'color:#fff',
        'border:1px solid rgba(255,255,255,0.2)',
        'border-radius:3px',
        'cursor:pointer',
        'font:inherit',
        'font-size:11px',
      ].join(';');
      btn.addEventListener('click', () => {
        this.consumeItem(inId, 1);
        // Re-resolve the cheapest available fuel at click time so a stack
        // exhausted between refresh and click doesn't crash. Default to
        // coal which we'd already validated as the panel's "need fuel"
        // baseline.
        let useFuel = fuelId;
        for (const name of FUEL_NAMES) {
          const id = this.registry.byName(name);
          if (id !== undefined && this.inventoryCount(id) > 0) {
            useFuel = id;
            break;
          }
        }
        if (useFuel !== undefined) this.consumeItem(useFuel, 1);
        this.inventory.add({ itemId: outId, count: 1, damage: 0 });
        this.refresh();
      });
      this.smeltList.appendChild(btn);
    }
    if (!hasFuel) {
      const hint = document.createElement('div');
      hint.textContent = 'Need fuel (coal, charcoal, lava bucket, blaze rod, ...) to smelt.';
      hint.style.cssText = 'opacity:0.6;font-size:11px;';
      this.smeltList.appendChild(hint);
    }
  }

  private sortInventory(): void {
    // Merge all stacks, consolidate by itemId, then re-layout sorted by itemId.
    const totals = new Map<number, number>();
    for (const list of [this.inventory.hotbar, this.inventory.main]) {
      for (let i = 0; i < list.length; i++) {
        const s = list[i];
        if (!s || s.count <= 0) continue;
        totals.set(s.itemId, (totals.get(s.itemId) ?? 0) + s.count);
        list[i] = null;
      }
    }
    const sorted = Array.from(totals.entries()).sort((a, b) => a[0] - b[0]);
    for (const [itemId, total] of sorted) {
      this.inventory.add({ itemId, count: total, damage: 0 });
    }
  }

  private inventoryCount(itemId: number): number {
    let n = 0;
    for (const s of this.inventory.hotbar) if (s?.itemId === itemId) n += s.count;
    for (const s of this.inventory.main) if (s?.itemId === itemId) n += s.count;
    return n;
  }

  private consumeItem(itemId: number, count: number): void {
    let remaining = count;
    const go = (slots: (typeof this.inventory.hotbar)[number][]): void => {
      for (let i = 0; i < slots.length && remaining > 0; i++) {
        const s = slots[i];
        if (s?.itemId !== itemId) continue;
        const take = Math.min(s.count, remaining);
        const after = s.count - take;
        slots[i] = after <= 0 ? null : { ...s, count: after };
        remaining -= take;
      }
    };
    go(this.inventory.hotbar);
    if (remaining > 0) go(this.inventory.main);
  }

  private refreshCraftList(): void {
    this.craftList.textContent = '';
    if (!this.recipes) return;
    const all = this.recipes.all();
    for (const recipe of all) {
      if (!hasAllIngredients(this.inventory, recipe)) continue;
      this.craftList.appendChild(this.renderRecipeButton(recipe));
    }
    if (this.craftList.childElementCount === 0) {
      const hint = document.createElement('div');
      hint.textContent = 'No recipes craftable yet.';
      hint.style.cssText = 'opacity:0.6;font-size:11px;';
      this.craftList.appendChild(hint);
    }
  }

  private renderRecipeButton(recipe: Recipe): HTMLButtonElement {
    const b = document.createElement('button');
    const outDef = this.registry.get(recipe.result.itemId);
    const label = outDef.name.replace(/^webmc:/, '');
    b.textContent = recipe.result.count > 1 ? `${label} ×${String(recipe.result.count)}` : label;
    b.style.cssText = [
      'padding:4px 10px',
      'background:rgba(60,90,60,0.85)',
      'color:#fff',
      'border:1px solid rgba(255,255,255,0.2)',
      'border-radius:3px',
      'cursor:pointer',
      'font:inherit',
      'font-size:11px',
    ].join(';');
    b.addEventListener('click', () => {
      if (attemptCraft(this.inventory, recipe)) this.refresh();
    });
    return b;
  }

  show(): void {
    if (this.visible) return;
    this.visible = true;
    this.refresh();
    this.root.style.display = 'flex';
  }

  hide(): void {
    if (!this.visible) return;
    this.visible = false;
    this.root.style.display = 'none';
    this.cb.onClose();
  }

  isVisible(): boolean {
    return this.visible;
  }
}
