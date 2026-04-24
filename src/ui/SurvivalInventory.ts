import type { Inventory } from '@/items/Inventory';
import type { ItemRegistry } from '@/items/item';
import type { Recipe, RecipeRegistry } from '@/items/recipe';
import { attemptCraft, hasAllIngredients } from '@/items/CraftingHelper';

export interface SurvivalInventoryCallbacks {
  onClose: () => void;
  onEat?: (itemId: number, hungerRestore: number, saturation: number) => void;
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

    const craftLabel = document.createElement('div');
    craftLabel.textContent = 'Craftable';
    craftLabel.style.cssText = 'opacity:0.7;font-size:11px;margin-top:8px;';
    panel.appendChild(craftLabel);

    this.craftList = document.createElement('div');
    this.craftList.style.cssText = 'display:flex;flex-wrap:wrap;gap:4px;max-height:120px;overflow-y:auto;';
    panel.appendChild(this.craftList);

    const close = document.createElement('button');
    close.textContent = 'Close';
    close.style.cssText = 'align-self:flex-end;padding:6px 14px;background:rgba(50,80,110,0.85);color:#fff;border:1px solid rgba(255,255,255,0.18);border-radius:3px;cursor:pointer;font:inherit;font-size:12px;';
    close.addEventListener('click', () => { this.hide(); });
    panel.appendChild(close);

    this.root.appendChild(panel);
    parent.appendChild(this.root);
  }

  private readonly hotGrid: HTMLDivElement;
  private readonly craftList!: HTMLDivElement;

  private renderSlot(stack: { itemId: number; count: number; damage: number } | null): HTMLDivElement {
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
    label.style.cssText = 'position:absolute;top:2px;left:3px;font-size:8px;line-height:10px;color:#ddd;';
    slot.appendChild(label);
    const count = document.createElement('div');
    count.textContent = String(stack.count);
    count.style.cssText = 'font-size:11px;font-weight:700;text-shadow:1px 1px 0 rgba(0,0,0,0.8);';
    slot.appendChild(count);
    if (def.hungerRestore !== undefined && def.hungerRestore > 0 && this.cb.onEat) {
      slot.style.cursor = 'pointer';
      slot.style.borderColor = 'rgba(140,220,120,0.6)';
      slot.title = `Click to eat (+${String(def.hungerRestore)} hunger)`;
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
        this.cb.onEat(def.id, def.hungerRestore ?? 0, def.saturation ?? 0);
        const after = cur.count - 1;
        slots[idx] = after <= 0 ? null : { ...cur, count: after };
        this.refresh();
      });
    }
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
    this.refreshCraftList();
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
