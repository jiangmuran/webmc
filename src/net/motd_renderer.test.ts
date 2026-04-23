import { describe, it, expect } from 'vitest';
import { renderMotd, stripCodes } from './motd_renderer';

describe('motd renderer', () => {
  it('plain text one segment', () => {
    expect(renderMotd('hello')).toEqual([
      { text: 'hello', color: '#ffffff', bold: false, italic: false },
    ]);
  });

  it('color code segments', () => {
    const r = renderMotd('&ared&fwhite');
    expect(r.find((s) => s.text === 'red')?.color).not.toBe('#ffffff');
    expect(r.find((s) => s.text === 'white')?.color).toBe('#ffffff');
  });

  it('bold toggle', () => {
    const r = renderMotd('&lBOLD');
    expect(r[0]?.bold).toBe(true);
  });

  it('reset clears style', () => {
    const r = renderMotd('&l&cred&rnormal');
    const normal = r.find((s) => s.text === 'normal');
    expect(normal?.bold).toBe(false);
  });

  it('stripCodes removes', () => {
    expect(stripCodes('&ahi&r!')).toBe('hi!');
  });
});
