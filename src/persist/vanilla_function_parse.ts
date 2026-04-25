// Parse a vanilla .mcfunction text file. Format:
//   # comment lines (start with #)
//   single command per line
//   blank lines ignored
//   trailing comments after a command are NOT part of vanilla MC
//
// We strip line continuations the way vanilla 1.20.2+ does: a line ending
// in '\' continues to the next line, joined by a single space.
//
// Commands are NOT executed here — they're returned as a list so the
// caller can route each line through webmc's CommandExecutor (or any
// dispatcher that takes "name [arg ...]").
//
// Source: minecraft.wiki "Function". Behavioral spec — clean-room.

export interface ParsedFunction {
  // One entry per executable command line, in order.
  commands: string[];
  // Original line numbers for error reporting (1-indexed, source-line, not joined-line).
  lineNumbers: number[];
  // Number of comment + blank source lines (for stats).
  commentLines: number;
  blankLines: number;
}

export function parseVanillaFunction(text: string): ParsedFunction {
  const out: ParsedFunction = {
    commands: [],
    lineNumbers: [],
    commentLines: 0,
    blankLines: 0,
  };
  if (text.length === 0) return out;
  const sourceLines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  let pending = '';
  let pendingLine = 0;
  for (let i = 0; i < sourceLines.length; i++) {
    const raw = sourceLines[i] ?? '';
    const trimmed = raw.replace(/\s+$/, '');
    if (trimmed.length === 0) {
      out.blankLines++;
      continue;
    }
    if (trimmed.trimStart().startsWith('#')) {
      out.commentLines++;
      continue;
    }
    // Continuation: trailing backslash joins with next line by a single space.
    if (trimmed.endsWith('\\')) {
      const body = trimmed.slice(0, -1).trimEnd();
      if (pending.length === 0) pendingLine = i + 1;
      pending += pending.length > 0 ? ` ${body}` : body;
      continue;
    }
    const lineBody = pending.length > 0 ? `${pending} ${trimmed.trim()}` : trimmed.trim();
    out.commands.push(lineBody);
    out.lineNumbers.push(pending.length > 0 ? pendingLine : i + 1);
    pending = '';
    pendingLine = 0;
  }
  // Trailing continuation that never ended — emit as-is.
  if (pending.length > 0) {
    out.commands.push(pending);
    out.lineNumbers.push(pendingLine);
  }
  return out;
}
