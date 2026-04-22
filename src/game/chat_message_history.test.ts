import { describe, it, expect } from 'vitest';
import { ChatHistory } from './chat_message_history';

describe('chat history', () => {
  it('push and cycle', () => {
    const h = new ChatHistory();
    h.push('hi');
    h.push('hello');
    expect(h.prev()).toBe('hello');
    expect(h.prev()).toBe('hi');
    expect(h.prev()).toBe('hi');
  });

  it('drop consecutive duplicates', () => {
    const h = new ChatHistory();
    h.push('a');
    h.push('a');
    expect(h.size()).toBe(1);
  });

  it('cap enforced', () => {
    const h = new ChatHistory(3);
    h.push('1');
    h.push('2');
    h.push('3');
    h.push('4');
    expect(h.size()).toBe(3);
  });

  it('next past latest = null', () => {
    const h = new ChatHistory();
    h.push('a');
    expect(h.next()).toBeNull();
  });
});
