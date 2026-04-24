import { readZip, pngEntriesUnder } from '@/persist/zip_reader';

export interface LoadedPackTextures {
  readonly packName: string;
  readonly blockTextures: ReadonlyMap<string, HTMLImageElement>;
  readonly itemTextures: ReadonlyMap<string, HTMLImageElement>;
  readonly totalPngs: number;
}

export interface ResourcePackLoaderCallbacks {
  onLoaded: (pack: LoadedPackTextures) => void;
  onStatus?: (msg: string) => void;
}

const BLOCK_TEXTURE_PREFIXES = [
  'assets/webmc/textures/blocks/',
  'assets/webmc/textures/block/',
  'assets/minecraft/textures/block/',
];

const ITEM_TEXTURE_PREFIXES = [
  'assets/webmc/textures/items/',
  'assets/webmc/textures/item/',
  'assets/minecraft/textures/item/',
];

export class ResourcePackLoader {
  readonly root: HTMLDivElement;
  private visible = false;
  private readonly fileInput: HTMLInputElement;
  private readonly status: HTMLDivElement;
  private readonly entryList: HTMLDivElement;
  private loadedPack: LoadedPackTextures | null = null;

  constructor(parent: HTMLElement, private readonly cb: ResourcePackLoaderCallbacks) {
    this.root = document.createElement('div');
    this.root.setAttribute('data-testid', 'resource-pack-loader');
    this.root.style.cssText = [
      'position:fixed',
      'inset:0',
      'display:none',
      'align-items:center',
      'justify-content:center',
      'background:rgba(0,0,0,0.55)',
      'backdrop-filter:blur(2px)',
      'z-index:1200',
    ].join(';');

    const panel = document.createElement('div');
    panel.style.cssText = [
      'background:rgba(18,22,30,0.96)',
      'border:1px solid rgba(255,255,255,0.15)',
      'border-radius:8px',
      'padding:14px',
      'width:min(620px,92vw)',
      'max-height:80vh',
      'overflow-y:auto',
      'display:flex',
      'flex-direction:column',
      'gap:8px',
      'color:#e6edf3',
      'font-size:13px',
      'pointer-events:auto',
    ].join(';');

    const title = document.createElement('div');
    title.textContent = 'Resource Pack';
    title.style.cssText = 'font-size:18px;font-weight:600;';

    const hint = document.createElement('div');
    hint.innerHTML = 'Load a vanilla-format <code>.zip</code> pack. webmc reads PNGs from <code>assets/*/textures/block/</code> and <code>item/</code>. Your upload stays in-browser.';
    hint.style.cssText = 'opacity:0.75;font-size:12px;line-height:1.5;';

    this.fileInput = document.createElement('input');
    this.fileInput.type = 'file';
    this.fileInput.accept = '.zip,application/zip';
    this.fileInput.setAttribute('data-testid', 'pack-file');
    this.fileInput.style.cssText = 'padding:6px;background:rgba(0,0,0,0.35);color:#fff;border:1px solid rgba(255,255,255,0.15);border-radius:4px;font:inherit;';
    this.fileInput.addEventListener('change', () => void this.handleFile());

    this.status = document.createElement('div');
    this.status.style.cssText = 'font-size:12px;opacity:0.85;';
    this.status.textContent = 'No pack loaded.';

    this.entryList = document.createElement('div');
    this.entryList.style.cssText = 'max-height:240px;overflow-y:auto;padding:6px;background:rgba(0,0,0,0.35);border-radius:4px;font-size:11px;color:#a0c0ff;';

    const close = document.createElement('button');
    close.textContent = 'Close';
    close.style.cssText = 'align-self:flex-end;padding:4px 12px;background:rgba(50,80,110,0.85);color:#fff;border:1px solid rgba(255,255,255,0.18);border-radius:3px;cursor:pointer;font:inherit;font-size:12px;';
    close.addEventListener('click', () => this.hide());

    panel.append(title, hint, this.fileInput, this.status, this.entryList, close);
    this.root.appendChild(panel);
    parent.appendChild(this.root);
  }

  private async handleFile(): Promise<void> {
    const f = this.fileInput.files?.[0];
    if (!f) return;
    this.setStatus(`Reading ${f.name}…`);
    try {
      const buf = new Uint8Array(await f.arrayBuffer());
      const entries = await readZip(buf);
      const blockTextures = new Map<string, HTMLImageElement>();
      const itemTextures = new Map<string, HTMLImageElement>();
      let totalPngs = 0;
      for (const prefix of BLOCK_TEXTURE_PREFIXES) {
        for (const e of pngEntriesUnder(entries, prefix)) {
          totalPngs++;
          const short = e.name.slice(prefix.length).replace(/\.png$/i, '');
          if (!blockTextures.has(short)) {
            const img = await loadImage(await e.data());
            blockTextures.set(short, img);
          }
        }
      }
      for (const prefix of ITEM_TEXTURE_PREFIXES) {
        for (const e of pngEntriesUnder(entries, prefix)) {
          totalPngs++;
          const short = e.name.slice(prefix.length).replace(/\.png$/i, '');
          if (!itemTextures.has(short)) {
            const img = await loadImage(await e.data());
            itemTextures.set(short, img);
          }
        }
      }
      if (blockTextures.size === 0 && itemTextures.size === 0) {
        this.setStatus(`No textures under known prefixes. (${entries.length} entries scanned)`, '#ffa060');
        return;
      }
      const pack: LoadedPackTextures = {
        packName: f.name,
        blockTextures,
        itemTextures,
        totalPngs,
      };
      this.loadedPack = pack;
      this.setStatus(
        `Loaded ${f.name} · ${blockTextures.size} block textures, ${itemTextures.size} item textures`,
        '#80ff80',
      );
      this.renderEntryList(blockTextures, itemTextures);
      this.cb.onLoaded(pack);
      // Auto-dismiss after a short delay so the user sees the success line.
      setTimeout(() => {
        this.hide();
      }, 1500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.setStatus(`Error: ${msg}`, '#ff6060');
    }
  }

  private renderEntryList(
    blocks: ReadonlyMap<string, HTMLImageElement>,
    items: ReadonlyMap<string, HTMLImageElement>,
  ): void {
    this.entryList.textContent = '';
    const bullet = (label: string, names: string[]): HTMLElement => {
      const d = document.createElement('div');
      d.textContent = `${label} (${String(names.length)}): ${names.slice(0, 20).join(', ')}${names.length > 20 ? '…' : ''}`;
      return d;
    };
    this.entryList.appendChild(bullet('blocks', [...blocks.keys()]));
    this.entryList.appendChild(bullet('items', [...items.keys()]));
  }

  private setStatus(text: string, color = '#e6edf3'): void {
    this.status.textContent = text;
    this.status.style.color = color;
    this.cb.onStatus?.(text);
  }

  show(): void {
    if (this.visible) return;
    this.visible = true;
    this.root.style.display = 'flex';
  }

  hide(): void {
    if (!this.visible) return;
    this.visible = false;
    this.root.style.display = 'none';
  }

  isVisible(): boolean {
    return this.visible;
  }

  pack(): LoadedPackTextures | null {
    return this.loadedPack;
  }
}

async function loadImage(bytes: Uint8Array): Promise<HTMLImageElement> {
  const blob = new Blob([bytes.slice()], { type: 'image/png' });
  const url = URL.createObjectURL(blob);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return img;
  } finally {
    // revoke later: keep URL alive until image cached — browser garbage-collects blobs with image refs.
  }
}
