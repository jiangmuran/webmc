export class Toast {
  private readonly root: HTMLDivElement;

  constructor(parent: HTMLElement) {
    this.root = document.createElement('div');
    this.root.style.cssText = [
      'position:fixed',
      'left:50%',
      'top:26%',
      'transform:translateX(-50%)',
      'padding:8px 22px',
      'background:rgba(10,14,20,0.72)',
      'border:1px solid rgba(255,255,255,0.18)',
      'border-radius:6px',
      'color:#f5f5f5',
      'font-family:inherit',
      'font-size:22px',
      'font-weight:600',
      'letter-spacing:2px',
      'text-shadow:2px 2px 0 rgba(0,0,0,0.7)',
      'opacity:0',
      'transition:opacity 300ms ease-out',
      'pointer-events:none',
      'user-select:none',
      'z-index:15',
    ].join(';');
    parent.appendChild(this.root);
  }

  show(text: string, color = '#ffffff', durationMs = 1600): void {
    this.root.textContent = text;
    this.root.style.color = color;
    this.root.style.opacity = '1';
    setTimeout(() => {
      this.root.style.opacity = '0';
    }, durationMs);
  }
}
