/**
 * Design: Liturgical Design Archive.
 * Metadata is inferred from raw Drive names and editable JSON rules; no Drive title, slug, ID or URL is changed.
 */
import liturgicalRules from "@/data/liturgical-rules.json";

export type LiturgicalCategory = "saints" | "marian";
export type LiturgicalYear = "A" | "B" | "C";

export type LiturgicalMetadata = {
  season: string | null;
  liturgicalYear: LiturgicalYear | null;
  week: number | null;
  weekLabel: string | null;
  categories: LiturgicalCategory[];
  language: "vi" | "en" | null;
  feastDate: string | null;
  celebrations: string[];
  searchTerms: string[];
};

export type LiturgicalFilters = {
  season: string;
  liturgicalYear: "" | LiturgicalYear;
  week: string;
  saintsOnly: boolean;
  marianOnly: boolean;
};

export const emptyLiturgicalFilters: LiturgicalFilters = { season: "", liturgicalYear: "", week: "", saintsOnly: false, marianOnly: false };

const normalizeKey = (value: string) => value
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/đ/g, "d")
  .replace(/[^a-z0-9]+/gi, "")
  .toLocaleLowerCase("vi");

const padNumber = (value: string) => value.padStart(2, "0");
const romanNumerals: Record<string, number> = liturgicalRules.romanNumerals;
const fixedFeastsByDate = new Map(liturgicalRules.fixedFeasts.map((feast) => [feast.date, feast.celebrations]));
const metadataCache = new Map<string, LiturgicalMetadata>();

function seasonFor(value: string) {
  const source = normalizeKey(value);
  const matched = Object.entries(liturgicalRules.seasonAliases).find(([alias]) => source.includes(normalizeKey(alias)));
  return matched?.[1] ?? null;
}

function weekFor(value: string) {
  const match = value.match(/(?:\bCN\s*|\bT[2-7]\s*)?(?:Tuan\s*)?([0-9]{1,2}|[IVXLCDM]+)\s*(TN|MC|PS|MV|Thuong\s*Nien|Mua\s*Chay|Phuc\s*Sinh|Mua\s*Vong)\b/i);
  if (!match) return null;
  const rawNumber = match[1].toUpperCase();
  const number = /^\d+$/.test(rawNumber) ? Number(rawNumber) : romanNumerals[rawNumber];
  return Number.isFinite(number) ? number : null;
}

function liturgicalYearFor(value: string): LiturgicalYear | null {
  const explicit = value.match(/\b(?:Nam|Năm)\s*([ABC])\b/i)?.[1]?.toUpperCase();
  if (explicit && liturgicalRules.liturgicalYears.includes(explicit as LiturgicalYear)) return explicit as LiturgicalYear;
  const sundayShortCode = value.match(/(?:^|[\s_-])CN(?:\d{1,2})?(?:[\s_-][^\s_-]+)*[\s_-]([ABC])(?:[\s_-]|$)/i)?.[1]?.toUpperCase();
  if (sundayShortCode && liturgicalRules.liturgicalYears.includes(sundayShortCode as LiturgicalYear)) return sundayShortCode as LiturgicalYear;
  return null;
}

function feastDateFor(value: string) {
  const match = value.match(/(?:^|[\s_/-])(\d{1,2})[\s_/-]+(\d{1,2})(?=[\s_/-]|$)/);
  if (!match) return null;
  return `${padNumber(match[1])}-${padNumber(match[2])}`;
}

function matchesAnyKey(value: string, keywords: string[]) {
  const source = normalizeKey(value);
  return keywords.some((keyword) => source.includes(normalizeKey(keyword)));
}

function languageFor(rawValue: string) {
  const source = rawValue.toLocaleLowerCase("vi");
  if (liturgicalRules.languageMarkers.english.some((marker) => source.includes(marker.toLocaleLowerCase("vi")))) return "en" as const;
  if (liturgicalRules.languageMarkers.vietnamese.some((marker) => source.includes(marker.toLocaleLowerCase("vi")))) return "vi" as const;
  return null;
}

function smartTermsFor(season: string | null, categories: LiturgicalCategory[], language: LiturgicalMetadata["language"]) {
  const keys = [
    season === "Mùa Vọng" ? "mua-vong" : "",
    season === "Mùa Chay" ? "mua-chay" : "",
    season === "Phục Sinh" ? "phuc-sinh" : "",
    season === "Thường Niên" ? "thuong-nien" : "",
    categories.includes("saints") ? "cac-thanh" : "",
    categories.includes("marian") ? "duc-me" : "",
    language === "en" ? "tieng-anh" : "",
  ].filter(Boolean);
  return keys.flatMap((key) => liturgicalRules.smartSearchAliases[key as keyof typeof liturgicalRules.smartSearchAliases] ?? []);
}

/** Infers filterable metadata from a file title and its containing Album title. */
export function getLiturgicalMetadata(title = "", location = ""): LiturgicalMetadata {
  const cacheKey = `${title}\u0000${location}`;
  const cached = metadataCache.get(cacheKey);
  if (cached) return cached;
  const raw = `${title} ${location}`.trim();
  const season = seasonFor(raw);
  const liturgicalYear = liturgicalYearFor(raw);
  const week = weekFor(raw);
  const categories: LiturgicalCategory[] = [];
  const feastKey = feastDateFor(title);
  const strongSaintSignal = matchesAnyKey(title, ["cac thanh", "các thánh", "tu dao", "tử đạo"]);
  if (matchesAnyKey(title, liturgicalRules.categoryKeywords.saints) && (feastKey || strongSaintSignal)) categories.push("saints");
  if (matchesAnyKey(title, liturgicalRules.categoryKeywords.marian)) categories.push("marian");
  const language = languageFor(title);
  const celebrations = feastKey ? [...(fixedFeastsByDate.get(feastKey) ?? [])] : [];
  const weekLabel = week && season ? `Tuần ${padNumber(String(week))} ${season}` : week ? `Tuần ${padNumber(String(week))}` : null;
  const feastDate = feastKey ? `${feastKey.slice(3)}/${feastKey.slice(0, 2)}` : null;

  const metadata = {
    season,
    liturgicalYear,
    week,
    weekLabel,
    categories,
    language,
    feastDate,
    celebrations,
    searchTerms: smartTermsFor(season, categories, language),
  };
  metadataCache.set(cacheKey, metadata);
  return metadata;
}

export function matchesLiturgicalFilters(metadata: LiturgicalMetadata, filters: LiturgicalFilters) {
  if (filters.season && metadata.season !== filters.season) return false;
  if (filters.liturgicalYear && metadata.liturgicalYear !== filters.liturgicalYear) return false;
  if (filters.week && String(metadata.week ?? "") !== filters.week) return false;
  const selectedCategories: LiturgicalCategory[] = [filters.saintsOnly ? "saints" : null, filters.marianOnly ? "marian" : null].filter(Boolean) as LiturgicalCategory[];
  if (selectedCategories.length && !selectedCategories.some((category) => metadata.categories.includes(category))) return false;
  return true;
}

export function liturgicalDetailLabels(metadata: LiturgicalMetadata) {
  const labels = [metadata.season, metadata.liturgicalYear ? `Năm ${metadata.liturgicalYear}` : null, metadata.weekLabel, metadata.feastDate ? `Lễ ${metadata.feastDate}` : null, metadata.categories.includes("saints") ? "Các Thánh" : null, metadata.categories.includes("marian") ? "Đức Mẹ" : null, metadata.language === "en" ? "Tiếng Anh" : null].filter(Boolean) as string[];
  return labels;
}

/** Adds inferred seasonal, feast, category and language vocabulary to the normal full-text index. */
export function liturgicalMetadataSearchText(title = "", location = "") {
  const metadata = getLiturgicalMetadata(title, location);
  return [title, location, metadata.season, metadata.liturgicalYear ? `Năm ${metadata.liturgicalYear}` : null, metadata.weekLabel, metadata.feastDate, ...metadata.celebrations, ...metadata.searchTerms, ...liturgicalDetailLabels(metadata)].filter(Boolean).join(" ");
}
