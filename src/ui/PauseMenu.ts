export interface PauseMenuCallbacks {
  onResume: () => void;
  onQuit: () => void;
  onOpenSettings?: () => void;
}

export class PauseMenu {
  readonly root: HTMLDivElement;
  private visible = false;

  constructor(parent: HTMLElement, private readonly cb: PauseMenuCallbacks) {
    this.root = document.createElement('div');
    this.root.setAttribute('data-testid', 'pause-menu');
    this.root.style.cssText = [
      'position:fixed',
      'inset:0',
      'display:none',
      'flex-direction:column',
      'align-items:center',
      'justify-content:center',
      'gap:12px',
      'background:rgba(0,0,0,0.6)',
      'backdrop-filter:blur(2px)',
      'z-index:900',
      'color:#e6edf3',
      'pointer-events:auto',
    ].join(';');

    const title = document.createElement('div');
    title.textContent = 'Game Menu';
    title.style.cssText = 'font-size:28px;margin-bottom:8px;';

    const resume = this.button('Resume');
    resume.addEventListener('click', () => this.cb.onResume());
    resume.setAttribute('data-testid', 'pause-resume');

    const settings = this.button('Settings');
    settings.addEventListener('click', () => this.cb.onOpenSettings?.());

    const quit = this.button('Save & Quit');
    quit.addEventListener('click', () => this.cb.onQuit());
    quit.setAttribute('data-testid', 'pause-quit');

    this.root.append(title, resume, settings, quit);
    parent.appendChild(this.root);
  }

  private button(label: string): HTMLButtonElement {
    const b = document.createElement('button');
    b.textContent = label;
    b.style.cssText = [
      'min-width:220px',
      'padding:10px 18px',
      'background:rgba(50,80,110,0.85)',
      'color:#fff',
      'border:1px solid rgba(255,255,255,0.18)',
      'border-radius:4px',
      'cursor:pointer',
      'font:inherit',
      'font-size:16px',
    ].join(';');
    b.addEventListener('mouseenter', () => (b.style.background = 'rgba(70,110,145,0.95)'));
    b.addEventListener('mouseleave', () => (b.style.background = 'rgba(50,80,110,0.85)'));
    return b;
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
}
