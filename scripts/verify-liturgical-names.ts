import { formatLiturgicalTitle, liturgicalSearchText } from "../client/src/lib/liturgicalName";
import { getLiturgicalMetadata, liturgicalMetadataSearchText, matchesLiturgicalFilters } from "../client/src/lib/liturgicalMetadata";
import { readFile } from "node:fs/promises";

const cases: Array<[string, string]> = [
  ["09_05_Thánh_Têrêsa_Calcutta_LN1", "05/09 Thánh Têrêsa Calcutta · Long Nguyen 1"],
  ["CN22_TN_A_LN1", "Chúa Nhật Thứ 22 Thường Niên - Năm A · Long Nguyen 1"],
  ["CN22_TNA_BaiDoc1", "Chúa Nhật Thứ 22 Thường Niên - Năm A - Bài Đọc 1"],
  ["CN22_TNA_Tin_Mung", "Chúa Nhật Thứ 22 Thường Niên - Năm A - Tin Mừng"],
  ["CN05_PS_C", "Chúa Nhật Thứ 05 Phục Sinh - Năm C"],
  ["CN03_MuaChay_B", "Chúa Nhật Thứ 03 Mùa Chay - Năm B"],
  ["T2_Tuan_06_TN_LN", "Thứ Hai Tuần 06 Thường Niên · Long Nguyen"],
  ["_MV", "Mùa Vọng"],
  ["_CNPS", "Chúa Nhật Phục Sinh"],
  ["T4_Tuan_02_MC_LN", "Thứ Tư Tuần 02 Mùa Chay · Long Nguyen"],
  ["Tuan_02_MC_va_Le_tu_02_03_den_07_03", "Tuần 02 Mùa Chay và Lễ từ 02/03 đến 07/03"],
  ["CN22_TN_A_va_Tuan22TN_tu_30_08_den_05_09", "Chúa Nhật Thứ 22 Thường Niên - Năm A và Tuần 22 Thường Niên từ 30/08 đến 05/09"],
  ["CN ChuaBaNgoi A LN1", "Chúa Nhật Chúa Ba Ngôi - Năm A · Long Nguyen 1"],
  ["06 01 THÁNH JUSTINÔ tử đạo LN", "01/06 Thánh JUSTINÔ Tử Đạo · Long Nguyen"],
  ["Tuan09TN tu 01 06 den 06 06", "Tuần 09 Thường Niên từ 01/06 đến 06/06"],
  ["T4_Tuan_II_MC_LN", "Thứ Tư Tuần 02 Mùa Chay · Long Nguyen"],
  ["09_05_Thanh_Anton", "05/09 Thánh An-tôn Pa-đua-a, Tiến Sĩ Hội Thánh"],
  ["CN_DMMC", "Chúa Nhật Lễ Đức Mẹ Mân Côi"],
];

const failures = cases.flatMap(([source, expected]) => {
  const actual = formatLiturgicalTitle(source);
  return actual === expected ? [] : [`${source}\n  expected: ${expected}\n  actual:   ${actual}`];
});

if (failures.length) {
  throw new Error(`Tên chuẩn hóa không khớp:\n${failures.join("\n")}`);
}

const feastSearch = liturgicalSearchText("06_13_Thanh_Anton");
const ordinarySearch = liturgicalSearchText("T2_Tuan_06_TN_LN");
if (!feastSearch.includes("Thánh An-tôn Pa-đua-a") || ordinarySearch.includes("Thánh An-tôn Pa-đua-a")) {
  throw new Error("Từ khóa danh sách Lễ không được lập chỉ mục đúng theo từng tên ảnh.");
}

const englishMetadata = getLiturgicalMetadata("CN22_TN_A_ENG");
const saintMetadata = getLiturgicalMetadata("06_13_Thanh_Anton");
const marianMetadata = getLiturgicalMetadata("08_22_Duc_Maria_Nu_Vuong_ENG");
if (englishMetadata.language !== "en" || englishMetadata.season !== "Thường Niên" || !saintMetadata.categories.includes("saints") || saintMetadata.feastDate !== "13/06" || !marianMetadata.categories.includes("marian") || marianMetadata.language !== "en") {
  throw new Error("Metadata Tiếng Anh, Mùa, Các Thánh hoặc Đức Mẹ không được nhận diện đúng.");
}

const smartSearch = liturgicalMetadataSearchText("T4_Tuan_II_MC_LN");
if (!smartSearch.includes("lent") || !matchesLiturgicalFilters(saintMetadata, { season: "", week: "", saintsOnly: true, marianOnly: false })) {
  throw new Error("Tìm kiếm viết tắt hoặc bộ lọc metadata không hoạt động đúng.");
}

const saintMariaTitles = [
  "07 06 Thanh Maria Goretti",
  "05/07 Thánh ANTÔN MARIA ZACCARIA",
  "07/22 Thanh MARIA MAGĐALÊNA",
  "07 29 Thanh Martha Maria Ladaro",
  "08 01 Thanh Alphonsô Maria Liguori",
  "4/10 Thánh AntônMariaClaret",
  "04 28 Thanh Luy Maria Montfort",
  "08 14 Thanh Maximilianô Maria Kolbe",
];
const saintMariaMetadata = saintMariaTitles.map((title) => getLiturgicalMetadata(title));
const nonMarianTitles = ["Ta On Cuoi Nam Duong Lich", "Ngay VIII Bat Nhat GS 2025"];
const rosaryMetadata = getLiturgicalMetadata("CN_DMMC");
if (!saintMariaMetadata.every((metadata) => metadata.categories.includes("saints") && !metadata.categories.includes("marian")) || nonMarianTitles.some((title) => getLiturgicalMetadata(title).categories.length) || !rosaryMetadata.categories.includes("marian")) {
  throw new Error("Các Thánh có tên Maria hoặc các ví dụ không liên quan đang bị phân loại nhầm là Đức Mẹ.");
}

type ManifestAlbum = { title: string; photos?: Array<{ title: string; location?: string }>; children?: ManifestAlbum[] };
const manifest = JSON.parse(await readFile(new URL("../client/public/data/albums.json", import.meta.url), "utf8")) as { albums: ManifestAlbum[] };
const collectPhotos = (albums: ManifestAlbum[]): Array<{ title: string; location: string }> => albums.flatMap((album) => [
  ...(album.photos ?? []).map((photo) => ({ title: photo.title, location: photo.location ?? album.title })),
  ...collectPhotos(album.children ?? []),
]);
const actualMetadata = collectPhotos(manifest.albums).map((photo) => getLiturgicalMetadata(photo.title, photo.location));
const realCoverage = {
  english: actualMetadata.filter((metadata) => metadata.language === "en").length,
  saints: actualMetadata.filter((metadata) => metadata.categories.includes("saints")).length,
  marian: actualMetadata.filter((metadata) => metadata.categories.includes("marian")).length,
  weeks: actualMetadata.filter((metadata) => metadata.week !== null).length,
};
if (Object.values(realCoverage).some((count) => count === 0)) {
  throw new Error(`Bộ lọc chưa nhận diện được dữ liệu Drive thật: ${JSON.stringify(realCoverage)}`);
}

console.log(`Đã xác nhận ${cases.length} mẫu tên phụng vụ.`);
