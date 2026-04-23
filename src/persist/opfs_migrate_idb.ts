export interface MigrationState {
  opfsAvailable: boolean;
  migratedChunks: number;
  totalChunks: number;
}

export function progressFraction(s: MigrationState): number {
  if (s.totalChunks === 0) return 1;
  return Math.min(1, s.migratedChunks / s.totalChunks);
}

export function shouldUseOpfs(s: MigrationState): boolean {
  return s.opfsAvailable;
}

export function canResume(s: MigrationState): boolean {
  return s.migratedChunks < s.totalChunks;
}
