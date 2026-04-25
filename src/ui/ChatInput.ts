import { completions, nextCompletion } from './chat_tab_complete';
import { wrap } from './chat_line_wrap';
import { parseFormatted } from '../game/chat_color_formatter';

const COLOR_HEX: Record<string, string> = {
  black: '#000000',
  dark_blue: '#0000aa',
  dark_green: '#00aa00',
  dark_aqua: '#00aaaa',
  dark_red: '#aa0000',
  dark_purple: '#aa00aa',
  gold: '#ffaa00',
  gray: '#aaaaaa',
  dark_gray: '#555555',
  blue: '#5555ff',
  green: '#55ff55',
  aqua: '#55ffff',
  red: '#ff5555',
  light_purple: '#ff55ff',
  yellow: '#ffff55',
  white: '#ffffff',
};

export interface ChatInputCallbacks {
  onSubmit: (text: string) => void;
  onOpenChanged?: (open: boolean) => void;
  getCompletions?: (input: string) => string[];
}

export class ChatInput {
  readonly root: HTMLDivElement;
  readonly input: HTMLInputElement;
  readonly log: HTMLDivElement;
  private history: string[] = [];
  private historyCursor = -1;
  private open = false;
  private completionCycle: string[] = [];
  private completionLast = '';

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
      'display:flex;flex-direction:column;gap:1px;max-height:240px;overflow-y:auto;margin-bottom:6px;pointer-events:auto;';
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
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const cur = this.input.value;
        if (this.completionCycle.length > 0 && cur === this.completionLast) {
          const next = nextCompletion(cur, this.completionCycle, !e.shiftKey);
          this.input.value = next;
          this.completionLast = next;
          return;
        }
        const candidates = cb.getCompletions?.(cur) ?? [];
        if (candidates.length === 0) return;
        const matches = completions(cur, candidates);
        if (matches.length === 0) return;
        this.completionCycle = matches;
        const first = matches[0] ?? cur;
        this.input.value = first;
        this.completionLast = first;
      } else if (e.key !== 'Shift') {
        this.completionCycle = [];
        this.completionLast = '';
      }
    });

    parent.appendChild(this.root);
  }

  clearLog(): void {
    this.log.textContent = '';
  }

  addLine(text: string, color = '#ffffff'): void {
    const segments = wrap(text, 80);
    for (const seg of segments) this.addRawLine(seg, color);
  }

  private addRawLine(text: string, color: string): void {
    const line = document.createElement('div');
    line.style.cssText = `background:rgba(0,0,0,0.55);padding:2px 6px;color:${color};max-width:max-content;border-radius:2px;white-space:pre-wrap;`;
    if (text.includes('§')) {
      for (const seg of parseFormatted(text)) {
        const span = document.createElement('span');
        span.textContent = seg.text;
        if (seg.color !== undefined) {
          const hex = COLOR_HEX[seg.color];
          if (hex) span.style.color = hex;
        }
        if (seg.format.includes('bold')) span.style.fontWeight = '700';
        if (seg.format.includes('italic')) span.style.fontStyle = 'italic';
        if (seg.format.includes('underline')) span.style.textDecoration = 'underline';
        if (seg.format.includes('strikethrough')) {
          span.style.textDecoration = (span.style.textDecoration ? span.style.textDecoration + ' ' : '') + 'line-through';
        }
        line.appendChild(span);
      }
    } else {
      line.textContent = text;
    }
    this.log.appendChild(line);
    while (this.log.children.length > 40) this.log.removeChild(this.log.firstChild!);
    this.log.scrollTop = this.log.scrollHeight;
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
