import { readFile, writeFile } from "node:fs/promises";
import { formatLiturgicalTitle } from "../client/src/lib/liturgicalName";

type ArchiveAlbum = {
  title: string;
  photos?: Array<{ title: string; location?: string }>;
  children?: ArchiveAlbum[];
};

type Candidate = {
  source: string;
  title: string;
  display: string;
  paths: Set<string>;
  occurrences: number;
};

const manifest = JSON.parse(await readFile(new URL("../client/public/data/albums.json", import.meta.url), "utf8")) as { albums: ArchiveAlbum[] };
const candidates = new Map<string, Candidate>();
const compactToken = /(?:[a-zà-ỹ][A-ZĐ]|\b(?:CN|TN|MC|MV|PS|CTT|LCTX|DMMC|VongPS|BaiDoc|TinMung|LeLa|Tuan\d+|Mong\d+|GiaoThua|TatNien|TanNien)\b)/;

function familyTitle(value: string) {
  return value
    .replace(/\b(?:LN\s*\d+[A-Za-z]?|LN|BG|Eng|English)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function inspect(title: string, source: string, path: string) {
  const display = formatLiturgicalTitle(title);
  if (!compactToken.test(display)) return;
  const family = familyTitle(title);
  if (!family) return;
  const key = `${source}\u0000${family}`;
  const current = candidates.get(key) ?? { source, title: family, display: formatLiturgicalTitle(family), paths: new Set<string>(), occurrences: 0 };
  current.paths.add(path);
  current.occurrences += 1;
  candidates.set(key, current);
}

function visit(albums: ArchiveAlbum[], parentPath = "") {
  for (const album of albums) {
    const folderPath = [parentPath, album.title].filter(Boolean).join(" / ");
    inspect(album.title, "Thư mục", folderPath);
    for (const photo of album.photos ?? []) inspect(photo.title, "File hình", photo.location ?? folderPath);
    visit(album.children ?? [], folderPath);
  }
}

visit(manifest.albums);
const rows = [...candidates.values()].sort((first, second) => first.display.localeCompare(second.display, "vi"));
const body = rows.length
  ? rows.map((item, index) => `| ${index + 1} | ${item.source} | \`${item.title.replaceAll("|", "\\|")}\` | ${item.display.replaceAll("|", "\\|")} | ${item.occurrences} | ${[...item.paths].slice(0, 2).map((path) => `\`${path.replaceAll("|", "\\|")}\``).join("<br>")} |`).join("\n")
  : "| — | — | — | Không phát hiện tên còn mã viết tắt/cụm viết liền cần quy ước thêm. | — | — |";
const report = `# Danh sách tên cần bổ sung quy ước\n\n**Tạo từ manifest Google Drive hiện tại.** Các biến thể hậu tố \`LN\`, \`LN1\`, \`LN2\`…, \`BG\` và \`Eng\` được gom thành một dòng để báo cáo gọn hơn. Hậu tố LN được giữ theo chủ ý, không phải lỗi.\n\n| # | Loại | Tên/mẫu gốc trong Drive | Hiển thị hiện tại | Số biến thể | Vị trí mẫu |\n|---:|---|---|---|---:|---|\n${body}\n\n> Mỗi dòng là một đề nghị quy ước. Sau khi anh xác nhận nghĩa của một tên, có thể thêm vào \`client/src/data/liturgical-rules.json\` mà không cần sửa giao diện.\n`;
await writeFile(new URL("../BAO_CAO_TU_VIET_TAT_CHUA_CHUAN_HOA.md", import.meta.url), report, "utf8");
console.log(`Đã lập báo cáo ${rows.length} tên cần rà soát.`);
