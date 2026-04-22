// Chat command tab completion. Given the partial input, produce a
// ranked list of completions. Commands register a tree of arguments;
// each level contributes its own completions based on context (player
// list, block id list, etc.).

export interface CommandNode {
  readonly name: string;
  readonly children: readonly CommandNode[];
  readonly argKind?: 'player' | 'item' | 'block' | 'coord' | 'literal' | 'rest';
}

export interface CompletionCtx {
  players: readonly string[];
  blockIds: readonly string[];
  itemIds: readonly string[];
}

export interface Completion {
  completion: string;
  insertStart: number;
}

export function complete(input: string, root: CommandNode, ctx: CompletionCtx): Completion[] {
  if (!input.startsWith('/')) return [];
  const body = input.slice(1);
  const parts = body.split(/\s+/);
  if (parts.length === 0) return [];

  // Start at root; walk the tree until the "current" part.
  let node: CommandNode = root;
  for (let i = 0; i < parts.length - 1; i++) {
    const match =
      node.children.find((c) => c.name === parts[i]) ??
      node.children.find((c) => c.argKind !== 'literal');
    if (!match) return [];
    node = match;
  }
  const current = parts[parts.length - 1] ?? '';
  const insertStart = input.length - current.length;
  const candidates: string[] = [];
  for (const c of node.children) {
    if (c.argKind === 'player') candidates.push(...ctx.players);
    else if (c.argKind === 'block') candidates.push(...ctx.blockIds);
    else if (c.argKind === 'item') candidates.push(...ctx.itemIds);
    else if (c.argKind === 'coord') candidates.push('~', '~0');
    else candidates.push(c.name);
  }
  return candidates
    .filter((s) => s.startsWith(current))
    .sort()
    .map((s) => ({ completion: s, insertStart }));
}

// Build-helper: simple DSL for leaf commands.
export function lit(name: string, ...children: CommandNode[]): CommandNode {
  return { name, children, argKind: 'literal' };
}

export function arg(
  kind: NonNullable<CommandNode['argKind']>,
  ...children: CommandNode[]
): CommandNode {
  return { name: '<arg>', children, argKind: kind };
}
