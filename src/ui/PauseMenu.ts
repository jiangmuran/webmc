import { availableButtons, type PauseAction } from './pause_menu_buttons';

export interface PauseMenuCallbacks {
  onResume: () => void;
  onQuit: () => void;
  onOpenSettings?: () => void;
  onShowAchievements?: () => void;
  onShowStats?: () => void;
}

const ACTION_LABEL: Record<PauseAction, string> = {
  resume: 'Resume',
  advancements: 'Advancements',
  stats: 'Statistics',
  options: 'Settings',
  open_to_lan: 'Open to LAN',
  feedback: 'Send feedback',
  achievements: 'Achievements',
  save_and_quit: 'Save & Quit',
  disconnect: 'Disconnect',
};

export class PauseMenu {
  readonly root: HTMLDivElement;
  private visible = false;
  private readonly titleEl: HTMLDivElement;
  private readonly buttonsEl: HTMLDivElement;

  constructor(
    parent: HTMLElement,
    private readonly cb: PauseMenuCallbacks,
  ) {
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
    this.titleEl = title;
    title.textContent = 'Game Menu';
    title.style.cssText = 'font-size:28px;margin-bottom:8px;';

    this.buttonsEl = document.createElement('div');
    this.buttonsEl.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:8px;';

    this.root.append(title, this.buttonsEl);
    parent.appendChild(this.root);
    this.rebuildButtons({ isMultiplayer: false, isHost: true });
  }

  rebuildButtons(ctx: { isMultiplayer: boolean; isHost: boolean }): void {
    const actions = availableButtons(ctx);
    const els: HTMLButtonElement[] = [];
    for (const a of actions) {
      const b = this.button(ACTION_LABEL[a]);
      switch (a) {
        case 'resume':
          b.setAttribute('data-testid', 'pause-resume');
          b.addEventListener('click', () => {
            this.cb.onResume();
          });
          break;
        case 'options':
          b.addEventListener('click', () => this.cb.onOpenSettings?.());
          break;
        case 'save_and_quit':
        case 'disconnect':
          b.setAttribute('data-testid', 'pause-quit');
          b.addEventListener('click', () => {
            this.cb.onQuit();
          });
          break;
        case 'advancements':
          b.addEventListener('click', () => this.cb.onShowAchievements?.());
          break;
        case 'stats':
          b.addEventListener('click', () => this.cb.onShowStats?.());
          break;
        case 'achievements':
          b.addEventListener('click', () => this.cb.onShowAchievements?.());
          break;
        default:
          b.disabled = true;
          b.style.opacity = '0.4';
          b.style.cursor = 'not-allowed';
      }
      els.push(b);
    }
    this.buttonsEl.replaceChildren(...els);
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

  setSubtitle(text: string): void {
    this.titleEl.textContent = text;
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
