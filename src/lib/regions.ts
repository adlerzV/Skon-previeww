export const REGION_ALIASES: Record<string, string[]> = {
  eu: ["eu", "eu-global", "اروپا", "europe"],
  us: ["us", "امریکا", "آمریکا", "america", "usa"],
  tr: ["tr", "ترکیه", "turkey"],
  ua: ["ua", "اوکراین", "ukraine"],
};

export const KNOWN_REGIONS = ["eu", "us", "tr", "ua"];
export const DEFAULT_REGION = "eu";

export function normalizeRegionToken(value?: string | null): string {
  if (!value) return "";
  const normalized = value.trim().toLowerCase();

  for (const [canonical, aliases] of Object.entries(REGION_ALIASES)) {
    if (aliases.some((alias) => normalized === alias || normalized.includes(alias))) {
      return canonical;
    }
  }

  return normalized;
}

export function regionsMatch(a?: string | null, b?: string | null): boolean {
  if (!a || !b) return false;
  return normalizeRegionToken(a) === normalizeRegionToken(b);
}

export function isKnownRegion(value?: string | null): value is string {
  return !!value && KNOWN_REGIONS.includes(value.toLowerCase());
}
