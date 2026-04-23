// Localization. Loads translation maps by locale; supports %s placeholders.

export type LocaleMap = Record<string, string>;

export interface Locales {
  active: string;
  fallback: string;
  maps: Record<string, LocaleMap>;
}

export function makeLocales(fallback = 'en-US'): Locales {
  return { active: fallback, fallback, maps: {} };
}

export function registerLocale(l: Locales, id: string, map: LocaleMap): void {
  l.maps[id] = map;
}

export function setActive(l: Locales, id: string): void {
  l.active = id;
}

export function t(l: Locales, key: string, ...args: (string | number)[]): string {
  const active = l.maps[l.active]?.[key];
  const fallback = l.maps[l.fallback]?.[key];
  let template = active ?? fallback ?? key;
  let i = 0;
  template = template.replace(/%s/g, () => String(args[i++] ?? ''));
  return template;
}

export function availableLocales(l: Locales): string[] {
  return Object.keys(l.maps);
}
