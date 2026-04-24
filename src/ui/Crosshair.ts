export interface CrosshairOpts {
  size: number;
  thickness: number;
  color: string;
}

const DEFAULTS: CrosshairOpts = {
  size: 14,
  thickness: 2,
  color: '#ffffffcc',
};

export class Crosshair {
  readonly root: HTMLDivElement;

  constructor(parent: HTMLElement, opts: Partial<CrosshairOpts> = {}) {
    const o = { ...DEFAULTS, ...opts };
    this.root = document.createElement('div');
    this.root.setAttribute('data-testid', 'crosshair');
    this.root.style.cssText = [
      'position:fixed',
      'left:50%',
      'top:50%',
      'pointer-events:none',
      'z-index:40',
      `width:${String(o.size * 2)}px`,
      `height:${String(o.size * 2)}px`,
      'transform:translate(-50%,-50%)',
    ].join(';');
    const horiz = document.createElement('div');
    horiz.style.cssText = [
      'position:absolute',
      'left:0',
      `right:0`,
      'top:50%',
      `height:${String(o.thickness)}px`,
      `background:${o.color}`,
      'transform:translateY(-50%)',
      'mix-blend-mode:difference',
    ].join(';');
    const vert = document.createElement('div');
    vert.style.cssText = [
      'position:absolute',
      'top:0',
      'bottom:0',
      'left:50%',
      `width:${String(o.thickness)}px`,
      `background:${o.color}`,
      'transform:translateX(-50%)',
      'mix-blend-mode:difference',
    ].join(';');
    this.root.append(horiz, vert);
    parent.appendChild(this.root);
  }

  hide(): void {
    this.root.style.display = 'none';
  }

  show(): void {
    this.root.style.display = '';
  }

  setTint(color: string | null): void {
    const children = Array.from(this.root.children) as HTMLElement[];
    for (const el of children) {
      if (color === null) {
        el.style.background = '#ffffffcc';
        el.style.mixBlendMode = 'difference';
      } else {
        el.style.background = color;
        el.style.mixBlendMode = 'normal';
      }
    }
  }
}
