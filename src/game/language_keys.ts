// Language / translation key table. UI strings, death messages, and
// advancement titles are indirected through translation keys so the
// game can be localized. Keys fall back to en_us if missing.

export interface Translation {
  readonly langCode: string; // e.g. "en_us", "zh_cn"
  readonly entries: ReadonlyMap<string, string>;
}

const BASE_EN_US: Record<string, string> = {
  'key.forward': 'Walk Forward',
  'key.back': 'Walk Backward',
  'key.left': 'Strafe Left',
  'key.right': 'Strafe Right',
  'key.jump': 'Jump',
  'key.sneak': 'Sneak',
  'key.sprint': 'Sprint',
  'key.attack': 'Attack',
  'key.use': 'Use Item',
  'key.inventory': 'Open Inventory',
  'key.chat': 'Open Chat',
  'menu.singleplayer': 'Singleplayer',
  'menu.multiplayer': 'Multiplayer',
  'menu.settings': 'Settings',
  'menu.quit': 'Quit',
  'button.cancel': 'Cancel',
  'button.confirm': 'OK',
  'death.fell.accident.generic': '%s fell from a high place',
  'death.attack.drown': '%s drowned',
  'death.attack.inFire': '%s went up in flames',
  'commands.error.unknownCommand': 'Unknown command',
  'commands.help.summary': '/help — list available commands',
  'gamerule.keepInventory': 'Keep Inventory',
  'advancement.minecraft.root.title': 'Minecraft',
  'gui.done': 'Done',
  'gui.back': 'Back',
  'gui.reset': 'Reset',
  'inventory.player': 'Your Inventory',
  'inventory.crafting': 'Crafting',
};

const TRANSLATIONS = new Map<string, Translation>();
TRANSLATIONS.set('en_us', { langCode: 'en_us', entries: new Map(Object.entries(BASE_EN_US)) });

export function registerLanguage(code: string, entries: Record<string, string>): void {
  TRANSLATIONS.set(code, { langCode: code, entries: new Map(Object.entries(entries)) });
}

export interface TranslateQuery {
  key: string;
  langCode: string;
  placeholders?: readonly string[];
}

export function translate(q: TranslateQuery): string {
  const lang = TRANSLATIONS.get(q.langCode);
  const fallback = TRANSLATIONS.get('en_us');
  const template = lang?.entries.get(q.key) ?? fallback?.entries.get(q.key) ?? q.key;
  if (!q.placeholders) return template;
  let out = template;
  for (const ph of q.placeholders) {
    out = out.replace('%s', ph);
  }
  return out;
}

export function hasTranslation(code: string, key: string): boolean {
  return TRANSLATIONS.get(code)?.entries.has(key) ?? false;
}

export function availableLanguages(): string[] {
  return Array.from(TRANSLATIONS.keys()).sort();
}
