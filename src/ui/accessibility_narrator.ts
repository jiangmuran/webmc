// Screen reader narrator abstraction. Enqueues messages with priorities;
// drives ARIA live region announcements.

export type NarratorPriority = 'low' | 'medium' | 'high';

export interface NarratorMessage {
  text: string;
  priority: NarratorPriority;
  id: string;
}

export interface Narrator {
  enabled: boolean;
  queue: NarratorMessage[];
}

export function makeNarrator(): Narrator {
  return { enabled: false, queue: [] };
}

export function announce(n: Narrator, text: string, priority: NarratorPriority, id: string): void {
  if (!n.enabled) return;
  // Replace prior message with same id to avoid spam.
  n.queue = n.queue.filter((m) => m.id !== id);
  n.queue.push({ text, priority, id });
  n.queue.sort((a, b) => weight(b.priority) - weight(a.priority));
}

function weight(p: NarratorPriority): number {
  return p === 'high' ? 3 : p === 'medium' ? 2 : 1;
}

export function next(n: Narrator): NarratorMessage | null {
  return n.queue.shift() ?? null;
}

export function setEnabled(n: Narrator, on: boolean): void {
  n.enabled = on;
  if (!on) n.queue = [];
}
