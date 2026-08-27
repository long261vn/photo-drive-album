/**
 * Design: Liturgical Design Archive.
 * Drive names remain the source of truth; editable rules live in data/liturgical-rules.json and only shape display/search labels.
 */
import liturgicalRules from "@/data/liturgical-rules.json";

const weekdayNames: Record<string, string> = Object.fromEntries(Object.entries(liturgicalRules.weekdayAliases).map(([key, label]) => [key.replace(/^T/, ""), label.replace(/^Thứ\s+/i, "")]));
const romanNumerals: Record<string, number> = liturgicalRules.romanNumerals;
const fixedFeastsByDate = new Map(liturgicalRules.fixedFeasts.map((feast) => [feast.date, feast.celebrations]));

const padNumber = (value: string) => value.padStart(2, "0");
const normalizeRuleKey = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]+/gi, "").toLocaleLowerCase("vi");
const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function seasonLabel(value: string) {
  const token = normalizeRuleKey(value);
  const configured = Object.entries(liturgicalRules.seasonAliases).find(([alias]) => normalizeRuleKey(alias) === token)?.[1];
  if (configured) return configured;
  return value;
}

function sourceText(value: string) {
  return value
    .replace(/\.(?:avif|gif|jpe?g|png|webp)$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function peelTechnicalSuffixes(value: string) {
  const suffixes: string[] = [];
  let text = value;
  text = text.replace(/\bLN\s*(\d{4})\b/gi, (_match: string, year: string, offset: number, original: string) => {
    if (normalizeRuleKey(original).includes("ruoclelandau")) return ` ${year}`;
    suffixes.push(`Long Nguyen ${year}`);
    return " ";
  });
  text = text.replace(/\bLN\s*(\d+[A-Za-z]?)?\b/gi, (_match: string, version?: string) => {
    suffixes.push(`Long Nguyen${version ? ` ${version.toUpperCase()}` : ""}`);
    return " ";
  });
  text = text.replace(/\bBG\b/gi, () => {
    suffixes.push("Background");
    return " ";
  });
  text = text.replace(/\bEng\b/gi, () => {
    suffixes.push("Tiếng Anh");
    return " ";
  });
  return { text: text.replace(/\s+/g, " ").trim(), suffixes };
}

function withArabicRomanWeek(value: string) {
  return value.replace(/\b(CN|Tuan)\s+([IVXLCDM]+)(?=\s+(?:TN|MC|PS|MV|Thuong|Mua|Phuc))/gi, (match: string, prefix: string, roman: string) => {
    const number = romanNumerals[roman.toUpperCase()];
    return number ? `${prefix}${number}` : match;
  });
}

function applyConfiguredAliases(value: string) {
  return liturgicalRules.displayAliases.reduce((current, rule) => rule.aliases.reduce((result, alias) => {
    const pattern = alias.trim().split(/\s+/).map(escapeRegExp).join("\\s+");
    return result.replace(new RegExp(`(^|\\s)${pattern}(?=\\s|$)`, "gi"), (_match, leadingSpace: string) => `${leadingSpace}${rule.label}`);
  }, current), value);
}

function fixedFeastSearchText(value: string) {
  const match = sourceText(value).match(/^(\d{1,2})\s+(\d{1,2})(?:\s|$)/);
  if (!match) return "";
  return (fixedFeastsByDate.get(`${padNumber(match[1])}-${padNumber(match[2])}`) ?? []).join(" ");
}

/** Converts a Drive filename/folder title into a human-readable liturgical name without changing its raw source value. */
export function formatLiturgicalTitle(value = "") {
  const { text: rawSource, suffixes } = peelTechnicalSuffixes(sourceText(value));
  const source = withArabicRomanWeek(applyConfiguredAliases(rawSource));
  if (!source) return suffixes.join(" · ");

  let title = source
    .replace(/\bCN\s*Phuc\s*Sinh\b|\bCNPS\b/gi, "Chúa Nhật Phục Sinh")
    .replace(/\bCN\s*Chua\s*Ba\s*Ngoi\s*([ABC])?\b/gi, (_match: string, year?: string) => `Chúa Nhật Chúa Ba Ngôi${year ? ` - Năm ${year.toUpperCase()}` : ""}`)
    .replace(/\bCN\s*(\d{1,2})\s*(?:TN|Thuong\s*Nien)\s*([ABC])\b/gi, (_match: string, week: string, year: string) => `Chúa Nhật Thứ ${padNumber(week)} Thường Niên - Năm ${year.toUpperCase()}`)
    .replace(/\bCN\s*(\d{1,2})\s*(?:TN|Thuong\s*Nien)\b/gi, (_match: string, week: string) => `Chúa Nhật Thứ ${padNumber(week)} Thường Niên`)
    .replace(/\bCN\s*(\d{1,2})\s*(?:PS|Phuc\s*Sinh)\s*([ABC])\b/gi, (_match: string, week: string, year: string) => `Chúa Nhật Thứ ${padNumber(week)} Phục Sinh - Năm ${year.toUpperCase()}`)
    .replace(/\bCN\s*(\d{1,2})\s*(?:PS|Phuc\s*Sinh)\b/gi, (_match: string, week: string) => `Chúa Nhật Thứ ${padNumber(week)} Phục Sinh`)
    .replace(/\bCN\s*(\d{1,2})\s*(?:MC|Mua\s*Chay)\s*([ABC])\b/gi, (_match: string, week: string, year: string) => `Chúa Nhật Thứ ${padNumber(week)} Mùa Chay - Năm ${year.toUpperCase()}`)
    .replace(/\bCN\s*(\d{1,2})\s*(?:MC|Mua\s*Chay)\b/gi, (_match: string, week: string) => `Chúa Nhật Thứ ${padNumber(week)} Mùa Chay`)
    .replace(/\bT([2-7])\s*Tuan\s*(\d{1,2})\s*(TN|MC|PS|MV|Thuong\s*Nien|Mua\s*Chay|Phuc\s*Sinh|Mua\s*Vong)\b/gi, (_match: string, day: string, week: string, season: string) => `Thứ ${weekdayNames[day]} Tuần ${padNumber(week)} ${seasonLabel(season)}`)
    .replace(/\bTuan\s*(\d{1,2})\s*(TN|MC|PS|MV|Thuong\s*Nien|Mua\s*Chay|Phuc\s*Sinh|Mua\s*Vong)\b/gi, (_match: string, week: string, season: string) => `Tuần ${padNumber(week)} ${seasonLabel(season)}`)
    .replace(/\bBai\s*Doc\s*(\d+)?\b/gi, (_match: string, order?: string) => `Bài Đọc${order ? ` ${order}` : ""}`)
    .replace(/\bTin\s*Mung\b/gi, "Tin Mừng")
    .replace(/\bMua\s*Vong\b|\bMV\b/gi, "Mùa Vọng")
    .replace(/\bMua\s*Chay\b|\bMC\b/gi, "Mùa Chay")
    .replace(/\bPhuc\s*Sinh\b|\bPS\b/gi, "Phục Sinh")
    .replace(/\bThuong\s*Nien\b|\bTN\b/gi, "Thường Niên")
    .replace(/\bLe\b/gi, "Lễ")
    .replace(/(^|\s)va(?=\s|$)/gi, "$1và")
    .replace(/(^|\s)tu(?=\s|$)/gi, "$1từ")
    .replace(/(^|\s)den(?=\s|$)/gi, "$1đến")
    .replace(/\bTHÁNH\b/g, "Thánh")
    .replace(/\btử đạo\b/gi, "Tử Đạo")
    .replace(/(từ|đến)\s*(\d{1,2})\s+(\d{1,2})/gi, (_match: string, marker: string, day: string, month: string) => `${marker} ${padNumber(day)}/${padNumber(month)}`)
    .replace(/^(\d{1,2})\s+(\d{1,2})(?=\s+(?:Thánh|Lễ)\b)/i, (_match: string, month: string, day: string) => `${padNumber(day)}/${padNumber(month)}`)
    .replace(/\s+(Bài Đọc(?:\s*\d+)?|Tin Mừng)\b/g, " - $1")
    .replace(/\s+/g, " ")
    .trim();

  if (suffixes.length) title = `${title} · ${suffixes.join(" · ")}`;
  return title;
}

/** Indexes both raw Drive text and the display label, so either naming style remains searchable. */
export function liturgicalSearchText(value = "") {
  const sourceKey = normalizeRuleKey(value);
  const aliasSearchText = liturgicalRules.displayAliases
    .filter((rule) => rule.aliases.some((alias) => sourceKey.includes(normalizeRuleKey(alias))))
    .flatMap((rule) => [...rule.aliases, rule.label])
    .join(" ");
  return `${value} ${formatLiturgicalTitle(value)} ${fixedFeastSearchText(value)} ${aliasSearchText}`.trim();
}
