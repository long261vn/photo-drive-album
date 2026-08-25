/**
 * Design: Liturgical Design Archive.
 * Drive names remain the source of truth; this formatter only creates a readable Vietnamese display label and search vocabulary.
 */

const weekdayNames: Record<string, string> = { "2": "Hai", "3": "Ba", "4": "Tư", "5": "Năm", "6": "Sáu", "7": "Bảy" };

const padNumber = (value: string) => value.padStart(2, "0");

function seasonLabel(value: string) {
  const token = value.replace(/\s+/g, "").toLocaleLowerCase("vi");
  if (token === "tn" || token === "thuongnien") return "Thường Niên";
  if (token === "mc" || token === "muachay") return "Mùa Chay";
  if (token === "ps" || token === "phucsinh") return "Phục Sinh";
  if (token === "mv" || token === "muavong") return "Mùa Vọng";
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

/** Converts a Drive filename/folder title into a human-readable liturgical name without changing its raw source value. */
export function formatLiturgicalTitle(value = "") {
  const { text: source, suffixes } = peelTechnicalSuffixes(sourceText(value));
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
  return `${value} ${formatLiturgicalTitle(value)}`.trim();
}
