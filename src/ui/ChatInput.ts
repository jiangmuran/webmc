export interface ChatInputCallbacks {
  onSubmit: (text: string) => void;
  onOpenChanged?: (open: boolean) => void;
}

export class ChatInput {
  readonly root: HTMLDivElement;
  readonly input: HTMLInputElement;
  readonly log: HTMLDivElement;
  private history: string[] = [];
  private historyCursor = -1;
  private open = false;

  constructor(parent: HTMLElement, private readonly cb: ChatInputCallbacks) {
    this.root = document.createElement('div');
    this.root.style.cssText = [
      'position:fixed',
      'left:8px',
      'right:8px',
      'bottom:60px',
      'pointer-events:none',
      'z-index:500',
      'color:#e6edf3',
      'font-size:13px',
    ].join(';');

    this.log = document.createElement('div');
    this.log.setAttribute('data-testid', 'chat-log');
    this.log.style.cssText =
      'display:flex;flex-direction:column;gap:1px;max-height:140px;overflow:hidden;margin-bottom:6px;';
    this.root.appendChild(this.log);

    this.input = document.createElement('input');
    this.input.type = 'text';
    this.input.placeholder = 'Press T to chat, / for command';
    this.input.setAttribute('data-testid', 'chat-input');
    this.input.style.cssText = [
      'display:none',
      'width:100%',
      'padding:6px 8px',
      'background:rgba(0,0,0,0.65)',
      'color:#fff',
      'border:1px solid rgba(255,255,255,0.2)',
      'border-radius:3px',
      'outline:none',
      'pointer-events:auto',
      'font:inherit',
      'font-size:14px',
    ].join(';');
    this.root.appendChild(this.input);

    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const text = this.input.value.trim();
        if (text.length > 0) {
          this.history.push(text);
          if (this.history.length > 50) this.history.shift();
          cb.onSubmit(text);
        }
        this.close();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        this.close();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (this.history.length === 0) return;
        this.historyCursor =
          this.historyCursor < 0
            ? this.history.length - 1
            : Math.max(0, this.historyCursor - 1);
        this.input.value = this.history[this.historyCursor] ?? '';
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (this.historyCursor < 0) return;
        this.historyCursor++;
        if (this.historyCursor >= this.history.length) {
          this.historyCursor = -1;
          this.input.value = '';
        } else {
          this.input.value = this.history[this.historyCursor] ?? '';
        }
      }
    });

    parent.appendChild(this.root);
  }

  addLine(text: string, color = '#ffffff'): void {
    const line = document.createElement('div');
    line.textContent = text;
    line.style.cssText = `background:rgba(0,0,0,0.55);padding:2px 6px;color:${color};max-width:max-content;border-radius:2px;white-space:pre-wrap;`;
    this.log.appendChild(line);
    while (this.log.children.length > 40) this.log.removeChild(this.log.firstChild!);
    setTimeout(() => {
      if (!this.open && this.log.contains(line)) {
        line.style.opacity = '0';
        line.style.transition = 'opacity 1s';
        setTimeout(() => line.remove(), 1200);
      }
    }, 10000);
  }

  openChat(prefix = ''): void {
    this.open = true;
    this.input.value = prefix;
    this.input.style.display = 'block';
    this.historyCursor = -1;
    this.input.focus();
    this.cb.onOpenChanged?.(true);
  }

  close(): void {
    if (!this.open) return;
    this.open = false;
    this.input.value = '';
    this.input.style.display = 'none';
    this.input.blur();
    this.cb.onOpenChanged?.(false);
  }

  isOpen(): boolean {
    return this.open;
  }
}
