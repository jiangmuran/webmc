// Language-aware keymap. Players on Chinese or Japanese keyboards get
// different inventory toggle defaults. No direct translation; just
// overrides.

export type LocaleId = 'en_us' | 'zh_cn' | 'ja_jp' | 'ru_ru' | 'de_de';

export interface KeyDefault {
  forward: string;
  back: string;
  left: string;
  right: string;
  inventory: string;
  chat: string;
}

const BASE_WASD: KeyDefault = {
  forward: 'KeyW',
  back: 'KeyS',
  left: 'KeyA',
  right: 'KeyD',
  inventory: 'KeyE',
  chat: 'KeyT',
};

const BASE_ZQSD: KeyDefault = {
  forward: 'KeyZ',
  back: 'KeyS',
  left: 'KeyQ',
  right: 'KeyD',
  inventory: 'KeyE',
  chat: 'KeyT',
};

export function defaultsFor(locale: LocaleId): KeyDefault {
  if (locale === 'de_de') return { ...BASE_WASD, forward: 'KeyW' };
  return BASE_WASD;
}

export function frenchZQSD(): KeyDefault {
  return BASE_ZQSD;
}
