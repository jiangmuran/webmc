// Simple pub-sub event bus. Listeners subscribe to a typed event name;
// emit dispatches to all. Ordered by subscription time.

export type Listener<T> = (event: T) => void;

export interface EventBus {
  listeners: Map<string, Listener<unknown>[]>;
}

export function makeBus(): EventBus {
  return { listeners: new Map() };
}

export function subscribe<T>(b: EventBus, name: string, fn: Listener<T>): () => void {
  const arr = b.listeners.get(name) ?? [];
  arr.push(fn as Listener<unknown>);
  b.listeners.set(name, arr);
  return () => {
    const cur = b.listeners.get(name);
    if (!cur) return;
    const idx = cur.indexOf(fn as Listener<unknown>);
    if (idx >= 0) cur.splice(idx, 1);
  };
}

export function emit(b: EventBus, name: string, payload: unknown): number {
  const arr = b.listeners.get(name);
  if (!arr) return 0;
  for (const fn of [...arr]) fn(payload);
  return arr.length;
}

export function clear(b: EventBus, name?: string): void {
  if (name === undefined) b.listeners.clear();
  else b.listeners.delete(name);
}

export function listenerCount(b: EventBus, name: string): number {
  return b.listeners.get(name)?.length ?? 0;
}
