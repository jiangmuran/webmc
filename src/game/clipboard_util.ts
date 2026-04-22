// Clipboard helpers. Used by F3 overlay ("copy coords"), world list
// ("copy seed"), and multiplayer UI ("copy room code"). Wrapped in a
// tiny interface so non-browser environments (tests, workers) can
// inject a stub.

export interface ClipboardAdapter {
  writeText(text: string): Promise<boolean>;
  readText(): Promise<string | null>;
}

export const BROWSER_CLIPBOARD: ClipboardAdapter = {
  async writeText(text: string): Promise<boolean> {
    try {
      const clipboard = (
        globalThis as { navigator?: { clipboard?: { writeText: (s: string) => Promise<void> } } }
      ).navigator?.clipboard;
      if (!clipboard) return false;
      await clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  },
  async readText(): Promise<string | null> {
    try {
      const clipboard = (
        globalThis as { navigator?: { clipboard?: { readText: () => Promise<string> } } }
      ).navigator?.clipboard;
      if (!clipboard) return null;
      return await clipboard.readText();
    } catch {
      return null;
    }
  },
};

// In-memory clipboard adapter for tests or restricted environments.
export class MemoryClipboard implements ClipboardAdapter {
  private text = '';
  writeText(text: string): Promise<boolean> {
    this.text = text;
    return Promise.resolve(true);
  }
  readText(): Promise<string | null> {
    return Promise.resolve(this.text);
  }
}

// Format helpers: coordinates, seed, room code.
export function formatCoordsForClipboard(pos: { x: number; y: number; z: number }): string {
  return `${pos.x.toFixed(2)} ${pos.y.toFixed(2)} ${pos.z.toFixed(2)}`;
}

export function formatSeedForClipboard(seed: string): string {
  return seed;
}

export function formatRoomCodeForClipboard(code: string): string {
  return code;
}

// High-level "copy to clipboard with toast" helper — returns the toast
// message to display on success/failure.
export interface CopyResult {
  success: boolean;
  message: string;
}

export async function copyToClipboard(
  adapter: ClipboardAdapter,
  text: string,
  successMessage = 'Copied!',
): Promise<CopyResult> {
  const ok = await adapter.writeText(text);
  return {
    success: ok,
    message: ok ? successMessage : 'Copy failed',
  };
}
