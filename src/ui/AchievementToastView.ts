import {
  enqueueToast,
  makeToastState,
  sortQueueByPriority,
  tickToasts,
  type Toast,
  type ToastState,
} from '../game/achievement_toast';

const KIND_LABEL: Record<Toast['kind'], string> = {
  advancement_task: 'Advancement made!',
  advancement_goal: 'Goal Reached!',
  advancement_challenge: 'Challenge Complete!',
  recipe_unlocked: 'Recipe Unlocked',
  system: 'System',
};

const KIND_COLOR: Record<Toast['kind'], string> = {
  advancement_task: '#ffeb80',
  advancement_goal: '#80ffa0',
  advancement_challenge: '#c080ff',
  recipe_unlocked: '#80c8ff',
  system: '#cccccc',
};

export class AchievementToastView {
  private readonly root: HTMLDivElement;
  private readonly state: ToastState = makeToastState();
  private readonly cardEl: HTMLDivElement;
  private readonly headerEl: HTMLDivElement;
  private readonly titleEl: HTMLDivElement;
  private nextId = 0;

  constructor(parent: HTMLElement) {
    this.root = document.createElement('div');
    this.root.setAttribute('data-testid', 'achievement-toast');
    this.root.style.cssText = [
      'position:fixed',
      'right:8px',
      'top:8px',
      'pointer-events:none',
      'z-index:540',
      'font-family:sans-serif',
    ].join(';');

    this.cardEl = document.createElement('div');
    this.cardEl.style.cssText = [
      'min-width:240px',
      'padding:8px 14px',
      'background:rgba(20,30,45,0.92)',
      'border:1px solid rgba(255,255,255,0.18)',
      'border-radius:4px',
      'transform:translateX(120%)',
      'transition:transform 300ms ease-out',
      'box-shadow:0 4px 12px rgba(0,0,0,0.5)',
    ].join(';');

    this.headerEl = document.createElement('div');
    this.headerEl.style.cssText =
      'font-size:11px;color:#ffeb80;font-weight:600;letter-spacing:1px;';
    this.cardEl.appendChild(this.headerEl);

    this.titleEl = document.createElement('div');
    this.titleEl.style.cssText = 'font-size:14px;color:#fff;margin-top:2px;';
    this.cardEl.appendChild(this.titleEl);

    this.root.appendChild(this.cardEl);
    parent.appendChild(this.root);
  }

  push(kind: Toast['kind'], title: string, subtitle?: string): void {
    const id = `toast-${String(this.nextId++)}`;
    const t: Toast = {
      id,
      kind,
      title,
      enqueuedAtSec: performance.now() / 1000,
    };
    if (subtitle !== undefined) t.subtitle = subtitle;
    enqueueToast(this.state, t);
    sortQueueByPriority(this.state);
  }

  tick(): void {
    const result = tickToasts(this.state, { nowSec: performance.now() / 1000 });
    if (result.justShown) {
      const t = result.justShown;
      this.headerEl.textContent = KIND_LABEL[t.kind];
      this.headerEl.style.color = KIND_COLOR[t.kind];
      this.titleEl.textContent = t.subtitle ? `${t.title} — ${t.subtitle}` : t.title;
      this.cardEl.style.transform = 'translateX(0)';
    }
    if (result.justHidden) {
      this.cardEl.style.transform = 'translateX(120%)';
    }
  }
}
