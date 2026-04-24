export class DeathScreen {
  private readonly root: HTMLDivElement;
  private visible = false;
  private onRespawn: () => void = () => undefined;

  constructor(parent: HTMLElement) {
    this.root = document.createElement('div');
    this.root.style.cssText = [
      'position:fixed',
      'inset:0',
      'display:none',
      'flex-direction:column',
      'align-items:center',
      'justify-content:center',
      'gap:18px',
      'background:radial-gradient(ellipse at center, rgba(60,0,0,0.65), rgba(10,0,0,0.95))',
      'color:#fee',
      'z-index:1100',
      'pointer-events:auto',
      'font-family:sans-serif',
    ].join(';');

    const title = document.createElement('div');
    title.textContent = 'You died.';
    title.style.cssText = 'font-size:56px;font-weight:700;text-shadow:2px 2px 0 rgba(0,0,0,0.8);color:#ff5454;';
    this.root.appendChild(title);

    const sub = document.createElement('div');
    sub.textContent = 'Game over.';
    sub.style.cssText = 'font-size:16px;opacity:0.8;';
    this.root.appendChild(sub);

    const respawn = document.createElement('button');
    respawn.textContent = 'Respawn';
    respawn.style.cssText = [
      'padding:10px 26px',
      'background:rgba(60,100,60,0.85)',
      'color:#fff',
      'border:2px solid rgba(255,255,255,0.4)',
      'border-radius:4px',
      'cursor:pointer',
      'font-size:16px',
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
