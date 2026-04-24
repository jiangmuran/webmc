export class FluidOverlay {
  private readonly root: HTMLDivElement;
  private current: 'water' | 'lava' | null = null;

  constructor(parent: HTMLElement) {
    this.root = document.createElement('div');
    this.root.style.cssText = [
      'position:fixed',
      'inset:0',
      'pointer-events:none',
      'z-index:3',
      'background:rgba(30,80,180,0.35)',
      'opacity:0',
      'transition:opacity 220ms ease-out, background 220ms ease-out',
      'mix-blend-mode:multiply',
    ].join(';');
    parent.appendChild(this.root);
  }

  set(kind: 'water' | 'lava' | null): void {
    if (kind === this.current) return;
    this.current = kind;
    if (kind === null) {
      this.root.style.opacity = '0';
    } else if (kind === 'water') {
      this.root.style.background = 'rgba(30,80,180,0.35)';
      this.root.style.opacity = '1';
    } else {
      this.root.style.background = 'rgba(230,80,20,0.55)';
      this.root.style.opacity = '1';
    }
  }
}
