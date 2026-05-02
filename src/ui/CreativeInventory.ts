import type { BlockRegistry } from '@/blocks/registry';
import { type BlockState, AIR, makeState } from '@/blocks/state';

export interface CreativeEntry {
  blockId: number;
  state: BlockState;
  name: string;
  shortName: string;
  category: string;
  color: readonly [number, number, number];
}

export interface CreativeInventoryCallbacks {
  onPick: (entry: CreativeEntry) => void;
  // Fired whenever the panel becomes hidden (Close button, click-outside,
  // programmatic hide). Lets callers re-grab pointer lock + unblock input.
  onClose?: () => void;
}

const CATEGORY_RULES: readonly { match: RegExp; category: string }[] = [
  {
    match:
      /(_log|_planks|_leaves|_sapling|oak|birch|spruce|jungle|acacia|dark_oak|mangrove|cherry|pale_oak)/,
    category: 'Wood',
  },
  {
    match:
      /(stone|granite|diorite|andesite|deepslate|tuff|basalt|cobblestone|andesite|brick|concrete)/,
    category: 'Stone',
  },
  { match: /(sand|gravel|dirt|grass|mud|clay|snow|ice|terracotta)/, category: 'Natural' },
  { match: /(water|lava|honey|kelp|seagrass|coral)/, category: 'Fluid' },
  {
    match:
      /(ore|raw_|gold_block|iron_block|diamond_block|emerald_block|lapis_block|netherite_block|redstone_block|copper_block|amethyst)/,
    category: 'Ore',
  },
  {
    match:
      /(glow|lantern|torch|glowstone|sea_lantern|end_rod|shroomlight|redstone_lamp|campfire|beacon|light_block)/,
    category: 'Light',
  },
  {
    match:
      /(flower|tulip|rose|daisy|orchid|allium|cornflower|lily|oxeye|dandelion|poppy|azalea|bamboo|cactus|pumpkin|melon|wheat|carrot|potato|beetroot|sugar_cane|mushroom|nether_wart)/,
    category: 'Plant',
  },
  { match: /(wool|carpet|banner|bed)/, category: 'Color' },
  {
    match:
      /(piston|observer|repeater|comparator|dispenser|dropper|hopper|rail|redstone|lever|button|pressure_plate|trapdoor|fence_gate|tripwire|target|lightning_rod)/,
    category: 'Redstone',
  },
  {
    match:
      /(sword|pickaxe|axe|shovel|hoe|bow|crossbow|shield|trident|mace|helmet|chestplate|leggings|boots|elytra|totem)/,
    category: 'Combat',
  },
  {
    match:
      /(beef|porkchop|chicken|mutton|rabbit|cod|salmon|apple|bread|cake|cookie|stew|berry|melon_slice|pie|potion|honey_bottle|milk_bucket)/,
    category: 'Food',
  },
];

const FALLBACK_CATEGORY = 'Misc';

export function categorize(name: string): string {
  for (const r of CATEGORY_RULES) {
    if (r.match.test(name)) return r.category;
  }
  return FALLBACK_CATEGORY;
}

function shortNameOf(fullName: string): string {
  return fullName.replace(/^webmc:/, '').replace(/_/g, ' ');
}

export function buildEntries(registry: BlockRegistry): readonly CreativeEntry[] {
  const out: CreativeEntry[] = [];
  for (const def of registry.defs) {
    if (def.name === 'webmc:air') continue;
    const blockId = registry.byName(def.name);
    if (blockId === undefined) continue;
    out.push({
      blockId,
      state: makeState(blockId, 0),
      name: def.name,
      shortName: shortNameOf(def.name),
      category: categorize(def.name),
      color: def.color,
    });
  }
  return out;
}

export class CreativeInventory {
  readonly root: HTMLDivElement;
  private readonly panel: HTMLDivElement;
  private readonly grid: HTMLDivElement;
  private readonly tabs: HTMLDivElement;
  private readonly search: HTMLInputElement;
  private readonly status: HTMLDivElement;
  private visible = false;
  private activeCategory = 'All';
  private filter = '';
  private readonly entries: readonly CreativeEntry[];

  constructor(
    parent: HTMLElement,
    registry: BlockRegistry,
    private readonly cb: CreativeInventoryCallbacks,
  ) {
    this.entries = buildEntries(registry);

    this.root = document.createElement('div');
    this.root.setAttribute('data-testid', 'creative-inventory');
    this.root.style.cssText = [
      'position:fixed',
      'inset:0',
      'display:none',
      'align-items:center',
      'justify-content:center',
      'background:rgba(0,0,0,0.55)',
      'z-index:800',
      'backdrop-filter:blur(2px)',
    ].join(';');

    this.panel = document.createElement('div');
    this.panel.style.cssText = [
      'background:rgba(18,22,30,0.95)',
      'border:1px solid rgba(255,255,255,0.15)',
      'border-radius:8px',
      'padding:12px',
      'width:min(860px,92vw)',
      'max-height:86vh',
      'display:flex',
      'flex-direction:column',
      'gap:8px',
      'color:#e6edf3',
      'font-size:13px',
      'pointer-events:auto',
    ].join(';');

    const header = document.createElement('div');
    header.textContent = 'Creative Inventory';
    header.style.cssText = 'font-size:18px;font-weight:600;';

    this.search = document.createElement('input');
    this.search.placeholder = 'Search…';
    this.search.setAttribute('data-testid', 'creative-search');
    this.search.style.cssText =
      'padding:6px 8px;background:rgba(0,0,0,0.4);color:#fff;border:1px solid rgba(255,255,255,0.15);border-radius:4px;outline:none;font:inherit;';
    this.search.addEventListener('input', () => {
      this.filter = this.search.value.toLowerCase().trim();
      this.render();
    });

    this.tabs = document.createElement('div');
    this.tabs.style.cssText = 'display:flex;flex-wrap:wrap;gap:4px;';

    this.grid = document.createElement('div');
    this.grid.style.cssText =
      'display:grid;grid-template-columns:repeat(auto-fill,minmax(52px,1fr));gap:4px;overflow-y:auto;padding-right:4px;max-height:60vh;';

    this.status = document.createElement('div');
    this.status.style.cssText = 'font-size:11px;opacity:0.6;';

    const close = document.createElement('button');
    close.textContent = 'Close (E)';
    close.style.cssText =
      'align-self:flex-end;padding:4px 10px;background:rgba(50,80,110,0.85);color:#fff;border:1px solid rgba(255,255,255,0.18);border-radius:3px;cursor:pointer;font:inherit;font-size:12px;';
    close.addEventListener('click', () => {
      this.hide();
    });

    this.panel.append(header, this.search, this.tabs, this.grid, this.status, close);
    this.root.appendChild(this.panel);
    parent.appendChild(this.root);

    this.buildTabs();
    this.render();
  }

  private buildTabs(): void {
    const categories = new Set<string>(['All']);
    for (const e of this.entries) categories.add(e.category);
    const order = [
      'All',
      'Wood',
      'Stone',
      'Natural',
      'Ore',
      'Fluid',
      'Plant',
      'Color',
      'Light',
      'Redstone',
      'Combat',
      'Food',
      'Misc',
    ];
    const sorted = [...categories].sort((a, b) => {
      const ia = order.indexOf(a);
      const ib = order.indexOf(b);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });
    for (const c of sorted) {
      const btn = document.createElement('button');
      btn.textContent = c;
      btn.dataset['cat'] = c;
      btn.style.cssText =
        'padding:4px 9px;background:rgba(50,80,110,0.45);color:#fff;border:1px solid rgba(255,255,255,0.12);border-radius:3px;cursor:pointer;font:inherit;font-size:11px;';
      btn.addEventListener('click', () => {
        this.activeCategory = c;
        this.render();
      });
      this.tabs.appendChild(btn);
    }
  }

  private render(): void {
    for (const t of Array.from(this.tabs.children)) {
      const el = t as HTMLButtonElement;
      const active = el.dataset['cat'] === this.activeCategory;
      el.style.background = active ? 'rgba(100,150,200,0.85)' : 'rgba(50,80,110,0.45)';
    }
    this.grid.textContent = '';
    const matches = this.entries.filter((e) => {
      if (this.activeCategory !== 'All' && e.category !== this.activeCategory) return false;
      if (this.filter && !e.shortName.toLowerCase().includes(this.filter)) return false;
      return true;
    });
    for (const e of matches) {
      const cell = document.createElement('button');
      cell.title = e.shortName;
      cell.style.cssText = [
        'aspect-ratio:1',
        'background:#14181f',
        'border:1px solid rgba(255,255,255,0.1)',
        'border-radius:3px',
        'cursor:pointer',
        'display:flex',
        'align-items:center',
        'justify-content:center',
        'padding:0',
      ].join(';');
      const [r, g, b] = e.color;
      const swatch = document.createElement('div');
      swatch.style.cssText = `width:70%;height:70%;background:rgb(${r},${g},${b});border-radius:2px;box-shadow:inset 0 0 0 1px rgba(0,0,0,0.35);`;
      cell.appendChild(swatch);
      cell.addEventListener('click', () => {
        this.cb.onPick(e);
      });
      this.grid.appendChild(cell);
    }
    this.status.textContent = `${matches.length}/${this.entries.length} · category: ${this.activeCategory}`;
  }

  show(): void {
    if (this.visible) return;
    this.visible = true;
    this.root.style.display = 'flex';
    this.search.focus();
  }

  hide(): void {
    if (!this.visible) return;
    this.visible = false;
    this.root.style.display = 'none';
    this.cb.onClose?.();
  }

  toggle(): void {
    if (this.visible) this.hide();
    else this.show();
  }

  isVisible(): boolean {
    return this.visible;
  }
}

export const AIR_STATE = AIR;
