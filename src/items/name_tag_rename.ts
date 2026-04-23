export interface RenameCtx {
  tagName: string;
  targetHasName: boolean;
}

export const MAX_NAME_LENGTH = 50;

export function isValidName(name: string): boolean {
  return name.length > 0 && name.length <= MAX_NAME_LENGTH;
}

export function appliedName(c: RenameCtx): string | undefined {
  return isValidName(c.tagName) ? c.tagName : undefined;
}

export function namedMobSkipsDespawn(): boolean {
  return true;
}

export function dinnerboneFlipsRendering(name: string): boolean {
  return name === 'Dinnerbone' || name === 'Grumm';
}
