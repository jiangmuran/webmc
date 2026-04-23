import { describe, it, expect } from 'vitest';
import { message } from './death_message_template';

describe('death message template', () => {
  it('zombie with name', () => {
    expect(message('Steve', 'zombie', 'Zom')).toContain('Zom');
  });

  it('anonymous creeper', () => {
    expect(message('Steve', 'creeper')).toContain('creeper');
  });

  it('fall', () => {
    expect(message('Steve', 'fall')).toBe('Steve hit the ground too hard');
  });

  it('void', () => {
    expect(message('Steve', 'void')).toContain('fell out');
  });

  it('lightning', () => {
    expect(message('Steve', 'lightning')).toContain('lightning');
  });
});
