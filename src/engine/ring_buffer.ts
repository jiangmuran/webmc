// Fixed-capacity ring buffer. O(1) push/shift; overwrites oldest on
// overflow (when `dropOldest` is true).

export interface RingBuffer<T> {
  buf: (T | undefined)[];
  head: number;
  size: number;
  capacity: number;
  dropOldest: boolean;
}

export function makeRing<T>(capacity: number, dropOldest = true): RingBuffer<T> {
  return {
    buf: new Array<T | undefined>(capacity).fill(undefined),
    head: 0,
    size: 0,
    capacity,
    dropOldest,
  };
}

export function push<T>(r: RingBuffer<T>, value: T): boolean {
  if (r.size < r.capacity) {
    r.buf[(r.head + r.size) % r.capacity] = value;
    r.size++;
    return true;
  }
  if (!r.dropOldest) return false;
  r.buf[r.head] = value;
  r.head = (r.head + 1) % r.capacity;
  return true;
}

export function shift<T>(r: RingBuffer<T>): T | undefined {
  if (r.size === 0) return undefined;
  const v = r.buf[r.head];
  r.buf[r.head] = undefined;
  r.head = (r.head + 1) % r.capacity;
  r.size--;
  return v;
}

export function peek<T>(r: RingBuffer<T>, index: number): T | undefined {
  if (index < 0 || index >= r.size) return undefined;
  return r.buf[(r.head + index) % r.capacity];
}

export function length<T>(r: RingBuffer<T>): number {
  return r.size;
}
