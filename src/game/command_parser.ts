export interface ParsedCommand {
  name: string;
  args: string[];
}

export function parseSlash(raw: string): ParsedCommand | undefined {
  const trimmed = raw.trim();
  if (!trimmed.startsWith('/')) return undefined;
  const parts = trimmed.slice(1).split(/\s+/).filter(Boolean);
  const name = parts.shift();
  if (name === undefined || name === '') return undefined;
  return { name, args: parts };
}

export function isKnownCommand(p: ParsedCommand): boolean {
  return [
    'tp',
    'gamemode',
    'time',
    'weather',
    'give',
    'kill',
    'op',
    'deop',
    'ban',
    'pardon',
    'msg',
    'help',
    'seed',
    'setblock',
    'summon',
  ].includes(p.name);
}
