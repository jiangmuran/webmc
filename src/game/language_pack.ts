// Language / translation system. Maps translation keys to strings per
// locale. Fallback to en_us for missing keys.

export type LocaleId = 'en_us' | 'zh_cn' | 'ja_jp' | 'es_es' | 'fr_fr' | 'de_de' | 'pt_br';

export type Translations = Record<string, string>;

export class LanguageRegistry {
  private packs = new Map<LocaleId, Translations>();
  private current: LocaleId = 'en_us';

  register(locale: LocaleId, t: Translations): void {
    const existing = this.packs.get(locale) ?? {};
    this.packs.set(locale, { ...existing, ...t });
  }

  setLocale(locale: LocaleId): void {
    this.current = locale;
  }

  translate(key: string, params: Record<string, string | number> = {}): string {
    const pack = this.packs.get(this.current);
    const en = this.packs.get('en_us');
    const raw = pack?.[key] ?? en?.[key] ?? key;
    return interpolate(raw, params);
  }
}

function interpolate(s: string, params: Record<string, string | number>): string {
  return s.replace(/\{(\w+)\}/g, (_, k: string) =>
    params[k] === undefined ? `{${k}}` : String(params[k]),
  );
}
