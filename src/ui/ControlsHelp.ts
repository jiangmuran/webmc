const BINDINGS: readonly { key: string; action: string }[] = [
  { key: 'WASD', action: 'Move' },
  { key: 'Space', action: 'Jump / Fly up' },
  { key: 'Shift', action: 'Sneak / Fly down' },
  { key: 'Ctrl', action: 'Sprint (hold)' },
  { key: 'Double-W', action: 'Sprint (tap)' },
  { key: 'Double-Space', action: 'Toggle fly (creative)' },
  { key: 'Mouse Left', action: 'Break block / attack' },
  { key: 'Mouse Right', action: 'Place / interact' },
  { key: 'Mouse Middle', action: 'Pick block' },
  { key: 'Scroll', action: 'Change hotbar slot' },
  { key: '1–9', action: 'Select hotbar slot' },
  { key: 'E', action: 'Inventory' },
  { key: 'Q', action: 'Drop selected block' },
  { key: 'R', action: 'Toggle fly' },
  { key: 'B', action: 'Sleep (at night)' },
  { key: 'T', action: 'Chat' },
  { key: '/', action: 'Chat with command prefix' },
  { key: 'F1', action: 'Toggle this help' },
  { key: 'F2', action: 'Screenshot' },
  { key: 'F3', action: 'Debug overlay' },
  { key: 'F4', action: 'Cycle gamemode' },
  { key: 'F5', action: 'Cycle camera (FP/TP)' },
  { key: 'ESC', action: 'Pause menu' },
];

export class ControlsHelp {
  private readonly root: HTMLDivElement;
  private visible = false;

  constructor(parent: HTMLElement) {
    this.root = document.createElement('div');
    this.root.style.cssText = [
      'position:fixed',
      'left:50%',
      'top:50%',
      'transform:translate(-50%,-50%)',
      'display:none',
      'padding:14px 22px',
      'background:rgba(10,14,20,0.9)',
      'border:1px solid rgba(255,255,255,0.18)',
      'border-radius:6px',
      'color:#eef3ff',
      'font-family:monospace',
      'font-size:13px',
      'line-height:1.5',
      'pointer-events:none',
      'user-select:none',
      'z-index:30',
      'max-width:480px',
      'column-count:2',
      'column-gap:30px',
    ].join(';');

    const title = document.createElement('div');
    title.textContent = 'Controls';
    title.style.cssText = 'font-weight:700;font-size:16px;margin-bottom:8px;column-span:all;';
    this.root.appendChild(title);

    for (const b of BINDINGS) {
      const row = document.createElement('div');
      row.style.cssText = 'break-inside:avoid;white-space:nowrap;';
      row.innerHTML = `<span style="color:#ffd080;min-width:110px;display:inline-block;">${b.key}</span> <span style="opacity:0.85;">${b.action}</span>`;
      this.root.appendChild(row);
    }

    parent.appendChild(this.root);
  }

  toggle(): void {
    this.visible = !this.visible;
    this.root.style.display = this.visible ? 'block' : 'none';
  }

  hide(): void {
    this.visible = false;
    this.root.style.display = 'none';
  }

  isVisible(): boolean {
    return this.visible;
  }
}
