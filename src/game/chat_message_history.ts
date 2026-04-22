// Chat message history. Local ring buffer; up+down arrows cycle.
// Drop duplicates when consecutive.

export class ChatHistory {
  private buffer: string[] = [];
  private cursor = -1;
  private cap: number;

  constructor(cap = 50) {
    this.cap = cap;
  }

  push(msg: string): void {
    if (!msg.trim()) return;
    if (this.buffer[this.buffer.length - 1] === msg) return;
    this.buffer.push(msg);
    if (this.buffer.length > this.cap) this.buffer.shift();
    this.cursor = this.buffer.length;
  }

  prev(): string | null {
    if (this.buffer.length === 0) return null;
    this.cursor = Math.max(0, this.cursor - 1);
    return this.buffer[this.cursor] ?? null;
  }

  next(): string | null {
    if (this.buffer.length === 0) return null;
    if (this.cursor >= this.buffer.length - 1) {
      this.cursor = this.buffer.length;
      return null;
    }
    this.cursor += 1;
    return this.buffer[this.cursor] ?? null;
  }

  size(): number {
    return this.buffer.length;
  }
}
