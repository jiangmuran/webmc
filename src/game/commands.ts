// Minimal slash-command parser. Keeps commands as pure data — caller wires
// the handlers into the actual game state. Supports: /give /tp /gamemode
// /time /weather /kill /summon /setblock /fill /help.

export type Value = string | number | boolean;

export interface ParsedCommand {
  name: string;
  args: readonly Value[];
  raw: string;
}

export interface CommandSpec {
  name: string;
  description: string;
  argTypes: readonly ('string' | 'number' | 'boolean' | 'rest')[];
}

export const COMMANDS: readonly CommandSpec[] = [
  {
    name: 'give',
    description: 'Give an item to a player: /give <player> <item> [count]',
    argTypes: ['string', 'string', 'number'],
  },
  {
    name: 'tp',
    description: 'Teleport to coords: /tp <x> <y> <z>',
    argTypes: ['number', 'number', 'number'],
  },
  {
    name: 'gamemode',
    description: 'Set gamemode: /gamemode <creative|survival|adventure|spectator>',
    argTypes: ['string'],
  },
  {
    name: 'time',
    description: 'Set or query time: /time <set|add|query> <value>',
    argTypes: ['string', 'string'],
  },
  {
    name: 'weather',
    description: 'Set weather: /weather <clear|rain|thunder> [durationSec]',
    argTypes: ['string', 'number'],
  },
  {
    name: 'kill',
    description: 'Kill a target: /kill [player]',
    argTypes: ['string'],
  },
  {
    name: 'summon',
    description: 'Summon entity: /summon <kind> [x] [y] [z]',
    argTypes: ['string', 'number', 'number', 'number'],
  },
  {
    name: 'setblock',
    description: 'Set a block: /setblock <x> <y> <z> <block>',
    argTypes: ['number', 'number', 'number', 'string'],
  },
  {
    name: 'fill',
    description: 'Fill a region: /fill <x1> <y1> <z1> <x2> <y2> <z2> <block>',
    argTypes: ['number', 'number', 'number', 'number', 'number', 'number', 'string'],
  },
  {
    name: 'help',
    description: 'List commands',
    argTypes: [],
  },
  {
    name: 'say',
    description: 'Broadcast text: /say <message>',
    argTypes: ['rest'],
  },
];

export class CommandError extends Error {}

function coerce(raw: string, kind: 'string' | 'number' | 'boolean' | 'rest'): Value {
  if (kind === 'number') {
    const n = Number(raw);
    if (Number.isNaN(n)) throw new CommandError(`expected number, got ${raw}`);
    return n;
  }
  if (kind === 'boolean') {
    if (raw === 'true') return true;
    if (raw === 'false') return false;
    throw new CommandError(`expected boolean, got ${raw}`);
  }
  return raw;
}

export function parseCommand(input: string): ParsedCommand {
  const trimmed = input.trim();
  if (!trimmed.startsWith('/')) {
    throw new CommandError('commands must start with /');
  }
  const parts = trimmed.slice(1).split(/\s+/);
  const [head, ...tail] = parts;
  if (!head) throw new CommandError('empty command');
  const spec = COMMANDS.find((c) => c.name === head);
  if (!spec) throw new CommandError(`unknown command: ${head}`);
  const args: Value[] = [];
  for (let i = 0; i < spec.argTypes.length; i++) {
    const kind = spec.argTypes[i];
    if (!kind) break;
    if (kind === 'rest') {
      args.push(tail.slice(i).join(' '));
      break;
    }
    const raw = tail[i];
    if (raw === undefined) {
      // Trailing args are optional — stop, caller validates.
      break;
    }
    args.push(coerce(raw, kind));
  }
  return { name: head, args, raw: trimmed };
}
