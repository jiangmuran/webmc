export interface VersionInfo {
  major: number;
  minor: number;
  patch: number;
  protocolVersion: number;
}

export function isCompatible(client: VersionInfo, server: VersionInfo): boolean {
  return client.protocolVersion === server.protocolVersion;
}

export function humanReadable(v: VersionInfo): string {
  return `${v.major.toString()}.${v.minor.toString()}.${v.patch.toString()}`;
}

export function newerThan(a: VersionInfo, b: VersionInfo): boolean {
  if (a.major !== b.major) return a.major > b.major;
  if (a.minor !== b.minor) return a.minor > b.minor;
  return a.patch > b.patch;
}
