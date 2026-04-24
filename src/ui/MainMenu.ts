export interface MainMenuCallbacks {
  onPlay: () => void;
  onOpenSettings?: () => void;
  onOpenResourcePacks?: () => void;
}

export class MainMenu {
  readonly root: HTMLDivElement;
  private visible = true;

  constructor(parent: HTMLElement, private readonly cb: MainMenuCallbacks) {
    this.root = document.createElement('div');
    this.root.setAttribute('data-testid', 'main-menu');
    this.root.style.cssText = [
      'position:fixed',
      'inset:0',
      'display:flex',
      'flex-direction:column',
      'align-items:center',
      'justify-content:center',
      'gap:14px',
      'background:radial-gradient(circle at center,#1b2a3a,#0a0e14 80%)',
      'z-index:1000',
      'font-family:inherit',
      'color:#e6edf3',
      'pointer-events:auto',
    ].join(';');

    const title = document.createElement('div');
    title.textContent = 'webmc';
    title.style.cssText = 'font-size:64px;letter-spacing:6px;font-weight:700;';
    const subtitle = document.createElement('div');
    subtitle.textContent = 'clean-room · AGPL-3.0 · browser-native voxel';
    subtitle.style.cssText = 'opacity:0.6;font-size:12px;margin-bottom:24px;';

    const play = this.button('Singleplayer');
    play.addEventListener('click', () => this.handlePlay());
    play.setAttribute('data-testid', 'menu-play');

    const settings = this.button('Settings');
    settings.addEventListener('click', () => this.cb.onOpenSettings?.());

    const resourcePacks = this.button('Resource Packs');
    resourcePacks.addEventListener('click', () => this.cb.onOpenResourcePacks?.());

    const footer = document.createElement('div');
    footer.style.cssText = 'position:absolute;bottom:10px;left:10px;font-size:10px;opacity:0.5;';
    footer.textContent = 'WASD move · Space jump · Shift sprint/sneak · E inventory · T chat · / command · ESC pause · R fly';

    this.root.append(title, subtitle, play, settings, resourcePacks, footer);
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

  private handlePlay(): void {
    this.hide();
    this.cb.onPlay();
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
