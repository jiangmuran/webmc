import { formatScore as formatScoreNum } from '../game/score_format';

const CAUSE_TEXT: Record<string, string> = {
  fall: 'fell from a high place',
  mob: 'was slain',
  command: 'was killed by /kill',
  starvation: 'starved to death',
  lava: 'burned in lava',
  fire: 'went up in flames',
  drown: 'drowned',
  poison: 'was poisoned',
  harming: 'was magicked away',
  void: 'fell out of the world',
  suffocation: 'suffocated in a wall',
  cactus: 'was pricked to death',
  explosion: 'blew up',
  arrow: 'was shot to death',
};

export class DeathScreen {
  private readonly root: HTMLDivElement;
  private readonly subEl: HTMLDivElement;
  private readonly scoreEl: HTMLDivElement;
  private visible = false;
  private onRespawn: () => void = () => undefined;

  constructor(parent: HTMLElement) {
    this.root = document.createElement('div');
    this.root.setAttribute('data-testid', 'death-screen');
    this.root.style.cssText = [
      'position:fixed',
      'inset:0',
      'display:none',
      'flex-direction:column',
      'align-items:center',
      'justify-content:center',
      'gap:14px',
      'background:radial-gradient(ellipse at center, rgba(60,0,0,0.65), rgba(10,0,0,0.95))',
      'color:#fee',
      'z-index:1100',
      'pointer-events:auto',
      'font-family:sans-serif',
    ].join(';');

    const title = document.createElement('div');
    title.textContent = 'You died!';
    title.style.cssText =
      'font-size:56px;font-weight:700;text-shadow:2px 2px 0 rgba(0,0,0,0.8);color:#ff5454;';
    this.root.appendChild(title);

    this.subEl = document.createElement('div');
    this.subEl.textContent = 'Game over.';
    this.subEl.style.cssText = 'font-size:18px;opacity:0.9;text-shadow:1px 1px 0 rgba(0,0,0,0.7);';
    this.root.appendChild(this.subEl);

    this.scoreEl = document.createElement('div');
    this.scoreEl.textContent = '';
    this.scoreEl.style.cssText = 'font-size:14px;opacity:0.7;letter-spacing:1px;';
    this.root.appendChild(this.scoreEl);

    const respawn = document.createElement('button');
    respawn.textContent = 'Respawn';
    respawn.setAttribute('data-testid', 'death-respawn');
    respawn.style.cssText = [
      'margin-top:10px',
      'padding:10px 26px',
      'background:rgba(60,100,60,0.85)',
      'color:#fff',
      'border:2px solid rgba(255,255,255,0.4)',
      'border-radius:4px',
      'cursor:pointer',
      'font:inherit',
      'font-size:16px',
    ].join(';');
    respawn.addEventListener('click', () => {
      this.hide();
      this.onRespawn();
    });
    this.root.appendChild(respawn);

    parent.appendChild(this.root);
  }

  setOnRespawn(cb: () => void): void {
    this.onRespawn = cb;
  }

  setCause(playerName: string, cause: string | undefined, score: number): void {
    const verb = cause !== undefined ? CAUSE_TEXT[cause] : undefined;
    this.subEl.textContent = verb ? `${playerName} ${verb}.` : 'Game over.';
    this.scoreEl.textContent = `Score: ${formatScoreNum(score)}`;
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
