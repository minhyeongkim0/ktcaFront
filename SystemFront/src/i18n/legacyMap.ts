/**
 * Deprecated i18n key → new key mapping
 * Use for gradual migration. Remove when all usages migrated.
 */

export const legacyKeyMap: Record<string, string> = {
  // Add old keys here as they get renamed
  // "org.rawMaterial": "context.rawMaterial",
};

export function resolveLegacyKey(key: string): string {
  return legacyKeyMap[key] ?? key;
}
