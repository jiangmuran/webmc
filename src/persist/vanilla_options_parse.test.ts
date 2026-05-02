import { describe, it, expect } from 'vitest';
import { parseVanillaOptionsTxt } from './vanilla_options_parse';

describe('vanilla options.txt parser', () => {
  it('parses typical client settings', () => {
    const o = parseVanillaOptionsTxt(`fov:0.5
renderDistance:16
guiScale:2
fancyGraphics:true
ao:2
enableVsync:false
fullscreen:false
invertYMouse:false
mouseSensitivity:0.6
mainHand:left
lang:zh_cn
`);
    expect(o.fov).toBeCloseTo(0.5);
    expect(o.renderDistance).toBe(16);
    expect(o.guiScale).toBe(2);
    expect(o.fancyGraphics).toBe(true);
    expect(o.smoothLighting).toBe('maximum');
    expect(o.vsync).toBe(false);
    expect(o.invertYMouse).toBe(false);
    expect(o.mouseSensitivity).toBeCloseTo(0.6);
    expect(o.mainHand).toBe('left');
    expect(o.lang).toBe('zh_cn');
  });

  it('parses ao boolean form (legacy)', () => {
    expect(parseVanillaOptionsTxt('ao:true').smoothLighting).toBe(true);
    expect(parseVanillaOptionsTxt('ao:false').smoothLighting).toBe(false);
  });

  it('parses ao integer 0/1 form', () => {
    expect(parseVanillaOptionsTxt('ao:0').smoothLighting).toBe('off');
    expect(parseVanillaOptionsTxt('ao:1').smoothLighting).toBe('minimum');
  });

  it('parses array fields', () => {
    const o = parseVanillaOptionsTxt('resourcePacks:[vanilla,custom_pack]\n');
    expect(o.arrayFields['resourcePacks']).toEqual(['vanilla', 'custom_pack']);
  });

  it('parses quoted string values', () => {
    const o = parseVanillaOptionsTxt('lang:"zh_cn"\n');
    expect(o.lang).toBe('zh_cn');
  });

  it('falls back to defaults for missing fields', () => {
    const o = parseVanillaOptionsTxt('');
    expect(o.fov).toBe(0);
    expect(o.renderDistance).toBe(12);
    expect(o.fancyGraphics).toBe(true);
    expect(o.lang).toBe('en_us');
    expect(o.mainHand).toBe('right');
  });

  it('skips comments and blank lines, supports CRLF', () => {
    const o = parseVanillaOptionsTxt('# header\r\n\r\nfov:0.3\r\n# trailing\r\n');
    expect(o.fov).toBeCloseTo(0.3);
  });
});
