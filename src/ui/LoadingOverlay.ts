import { overallProgress, type LoadStage } from '../game/loading_screen_progress';

// Hoisted out of LoadingOverlay.set — was allocated as a fresh Record
// literal every frame the loading overlay was visible (main.frame
// fires set() per frame until meshCount >= 25).
const STAGE_LABELS: Record<LoadStage, string> = {
  init: 'Initializing…',
  world: 'Loading world…',
  terrain: 'Streaming terrain…',
  light: 'Building lighting…',
  entities: 'Loading entities…',
  ready: 'Ready.',
};

export class LoadingOverlay {
  private readonly root: HTMLDivElement;
  private readonly fillEl: HTMLDivElement;
  private readonly stageEl: HTMLDivElement;
  private hidden = false;
  private lastStage: LoadStage | null = null;
  private lastWidthPercent = -1;

  constructor(parent: HTMLElement) {
    this.root = document.createElement('div');
    this.root.setAttribute('data-testid', 'loading-overlay');
    this.root.style.cssText = [
      'position:fixed',
      'inset:0',
      'background:linear-gradient(180deg, #1a2638, #0a121e)',
      'display:flex',
      'flex-direction:column',
      'align-items:center',
      'justify-content:center',
      'gap:14px',
      'z-index:1500',
      'pointer-events:auto',
      'font-family:sans-serif',
      'color:#e6edf3',
    ].join(';');

    const title = document.createElement('div');
    title.textContent = 'webmc';
    title.style.cssText = 'font-size:32px;font-weight:600;letter-spacing:2px;';
    this.root.appendChild(title);

    this.stageEl = document.createElement('div');
    this.stageEl.textContent = 'Initializing…';
    this.stageEl.style.cssText = 'font-size:13px;color:#a8b8d0;';
    this.root.appendChild(this.stageEl);

    const bar = document.createElement('div');
    bar.style.cssText =
      'width:280px;height:6px;background:rgba(255,255,255,0.12);border-radius:3px;overflow:hidden;';
    this.fillEl = document.createElement('div');
    this.fillEl.style.cssText =
      'height:100%;width:0%;background:linear-gradient(90deg,#5fa0ff,#7eff8a);transition:width 200ms ease-out;';
    bar.appendChild(this.fillEl);
    this.root.appendChild(bar);

    parent.appendChild(this.root);
  }

  set(stage: LoadStage, stageFraction: number): void {
    if (this.hidden) return;
    if (stage !== this.lastStage) {
      this.stageEl.textContent = STAGE_LABELS[stage];
      this.lastStage = stage;
    }
    const overall = overallProgress(stage, stageFraction);
    const widthPercent = Math.round(overall * 100);
    if (widthPercent !== this.lastWidthPercent) {
      this.lastWidthPercent = widthPercent;
      this.fillEl.style.width = `${String(widthPercent)}%`;
    }
  }

  hide(): void {
    if (this.hidden) return;
    this.hidden = true;
    this.root.style.transition = 'opacity 400ms ease-out';
    this.root.style.opacity = '0';
    setTimeout(() => {
      this.root.remove();
    }, 500);
  }

  isHidden(): boolean {
    return this.hidden;
  }
}
