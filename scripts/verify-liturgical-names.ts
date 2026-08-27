import { formatLiturgicalTitle, liturgicalSearchText } from "../client/src/lib/liturgicalName";
import { getLiturgicalMetadata, liturgicalMetadataSearchText, matchesLiturgicalFilters } from "../client/src/lib/liturgicalMetadata";
import { readFile } from "node:fs/promises";

const cases: Array<[string, string]> = [
  ["09_05_Thánh_Têrêsa_Calcutta_LN1", "05/09 Thánh Têrêsa Calcutta LN1"],
  ["CN22_TN_A_LN1", "Chúa Nhật Thứ 22 Thường Niên - Năm A LN1"],
  ["CN22_TNA_BaiDoc1", "Chúa Nhật Thứ 22 Thường Niên - Năm A - Bài Đọc 1"],
  ["CN22_TNA_Tin_Mung", "Chúa Nhật Thứ 22 Thường Niên - Năm A - Tin Mừng"],
  ["CN05_PS_C", "Chúa Nhật Thứ 05 Phục Sinh - Năm C"],
  ["CN03_MuaChay_B", "Chúa Nhật Thứ 03 Mùa Chay - Năm B"],
  ["T2_Tuan_06_TN_LN", "Thứ Hai Tuần 06 Thường Niên LN"],
  ["_MV", "Mùa Vọng"],
  ["_CNPS", "Chúa Nhật Phục Sinh"],
  ["T4_Tuan_02_MC_LN", "Thứ Tư Tuần 02 Mùa Chay LN"],
  ["Tuan_02_MC_va_Le_tu_02_03_den_07_03", "Tuần 02 Mùa Chay và Lễ từ 02/03 đến 07/03"],
  ["CN22_TN_A_va_Tuan22TN_tu_30_08_den_05_09", "Chúa Nhật Thứ 22 Thường Niên - Năm A và Tuần 22 Thường Niên từ 30/08 đến 05/09"],
  ["CN ChuaBaNgoi A LN1", "Chúa Nhật Chúa Ba Ngôi - Năm A LN1"],
  ["06 01 THÁNH JUSTINÔ tử đạo LN", "01/06 Thánh JUSTINÔ Tử Đạo LN"],
  ["Tuan09TN tu 01 06 den 06 06", "Tuần 09 Thường Niên từ 01/06 đến 06/06"],
  ["T4_Tuan_II_MC_LN", "Thứ Tư Tuần 02 Mùa Chay LN"],
  ["09_05_Thanh_Anton", "05/09 Thánh An-tôn Pa-đua-a, Tiến Sĩ Hội Thánh"],
  ["CN_DMMC", "Chúa Nhật Lễ Đức Mẹ Mân Côi"],
  ["CN_MinhMauChua_A", "Chúa Nhật Mình Máu Chúa Năm A"],
  ["CN_ChuaBaNgoi_B", "Chúa Nhật Chúa Ba Ngôi Năm B"],
  ["CTT", "Chúa Thánh Thần"],
  ["CN_CTT_HienXuong", "Chúa Nhật Chúa Thánh Thần Hiện Xuống"],
  ["ChuaThangThien", "Chúa Thăng Thiên"],
  ["LCTX", "Lòng Chúa Thương Xót"],
  ["LeLa_TuanThanh_PS_2026", "Lễ Lá - Tuần Thánh - Phục Sinh - 2026"],
  ["Tuan05MC", "Tuần 05 Mùa Chay"],
  ["Tuan03TN", "Tuần 03 Thường Niên"],
  ["Tuan02MV", "Tuần 02 Mùa Vọng"],
  ["CN06_TN_A_TET_LE_TRO", "Chúa Nhật 06 Thường Niên Năm A, TẾT, Lễ Tro"],
  ["Chua_Chiu_Phep_Rua_A_va_Le_tu_12_01_den_17_01", "Chúa Chịu Phép Rửa và Lễ từ ngày 12/01 đến 17/01"],
  ["DucMaria_MeThienChua", "Đức Maria Mẹ Thiên Chúa"],
  ["Le_Thanh_Gia_Nam_A", "Lễ Thánh Gia Năm A"],
  ["Le_Cac_Thanh_Nam_Nu", "Lễ Các Thánh Nam Nữ"],
  ["Duc_Me_Man_Coi", "Đức Mẹ Mân Côi"],
  ["Thien_than_ho_thu", "Thiên Thần Hộ Thủ"],
  ["Thanh_Teresa", "Thánh Teresa"],
  ["Le_Tong_Lanh_Thien_Than", "Lễ Tổng Lãnh Thiên Thần"],
  ["Duc_Me_Len_Troi", "Đức Mẹ Lên Trời"],
  ["Anre_Phu_Yen", "Thánh Anre Phú Yên"],
  ["ThanhPheroPhaolo", "Thánh Phêrô Phaolô"],
  ["RuocLeLanDau_LN_2025", "Rước Lễ Lần Đầu LN 2025"],
  ["CN_ChuaThangThien", "Chúa Nhật Chúa Thăng Thiên"],
  ["Thanh_Vinh_Son", "Thánh Vinh Sơn"],
  ["CN02_PS_C", "Chúa Nhật Thứ 02 Phục Sinh - Năm C"],
  ["Tuan_Bat_Nhat_PS", "Tuần Bát Nhật Phục Sinh"],
  ["Ngam_Dau_Danh_va_Ngam_Rang", "Ngắm Dấu Đanh và Ngắm Rằng"],
  ["Ngam_15_Su_Thuong_Kho", "Ngắm 15 Sự Thương Khó"],
  ["14_DangThanhGia", "14 Đàng Thánh Giá"],
  ["Le_Truyen_Tin", "Lễ Truyền Tin"],
  ["DangChuaTrongDenThanh", "Dâng Chúa Trong Đền Thánh"],
  ["TET", "Tết"],
  ["Le_Chua_Chiu_Phep_Rua_C", "Lễ Chúa Chịu Phép Rửa Năm C"],
  ["Le_Hien_Linh", "Lễ Hiển Linh"],
  ["Giang_Sinh", "Giáng Sinh"],
  ["CN29_TN_B_CN_Truyen_Giao_2024", "Chúa Nhật 29 Thường Niên Năm B, Chúa Nhật Truyền Giáo 2024"],
  ["Le_Phong_Thanh", "Lễ Phong Thánh"],
  ["Le_Duc_Me_Len_Troi_15_8", "Lễ Đức Mẹ Lên Trời 15/08"],
  ["SN_Thanh_Gioan_Tay_Gia", "Sinh Nhật Thánh Gioan Tẩy Giả"],
  ["LeTro_MuaChay", "Lễ Tro, Mùa Chay"],
  ["VongPS", "Vọng Phục Sinh"],
  ["BaiDoc_VongPS", "Bài Đọc Vọng Phục Sinh"],
  ["VongPS_BaiDoc_3", "Vọng Phục Sinh Bài Đọc 3"],
  ["VongPS_BaiDoc_3b", "Vọng Phục Sinh Bài Đọc 3 (b)"],
  ["VongPS_Exsultet", "Vọng Phục Sinh Exsultet"],
  ["VongPS_Thanh_Thu", "Vọng Phục Sinh Thánh Thư"],
  ["CN_LeLa_A_Tin_Mung_Kieu_La", "Chúa Nhật Lễ Lá Năm A, Tin Mừng Kiệu Lá"],
  ["Ngay_trong_tuan", "Ngày trong tuần"],
  ["T7_sau_Le_Tro", "Thứ Bảy Sau Lễ Tro"],
  ["Bai_Doc_2", "Bài Đọc 2"],
  ["Mong1", "Mồng 1 Tết"],
  ["Mong3", "Mồng 3 Tết"],
  ["GiaoThua", "Giao Thừa"],
  ["TatNien", "Tất Niên"],
  ["TanNien", "Tân Niên"],
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

const yearAMetadata = getLiturgicalMetadata("CN22_TN_A_LN1");
const yearBMetadata = getLiturgicalMetadata("CN03_MuaChay_B");
const yearCMetadata = getLiturgicalMetadata("CN05_PS_C");
const dateFirstSaintMetadata = getLiturgicalMetadata("09_03_Thánh_Grêgôriô_Cả_LN");
if (yearAMetadata.liturgicalYear !== "A" || yearBMetadata.liturgicalYear !== "B" || yearCMetadata.liturgicalYear !== "C" || !dateFirstSaintMetadata.categories.includes("saints") || dateFirstSaintMetadata.feastDate !== "03/09" || !matchesLiturgicalFilters(yearAMetadata, { season: "", liturgicalYear: "A", week: "", saintsOnly: false, marianOnly: false })) {
  throw new Error("Năm A/B/C hoặc quy ước Các Thánh bắt đầu bằng tháng-ngày không được nhận diện đúng.");
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
const anreMetadata = getLiturgicalMetadata("Anre_Phu_Yen");
if (!saintMariaMetadata.every((metadata) => metadata.categories.includes("saints") && !metadata.categories.includes("marian")) || nonMarianTitles.some((title) => getLiturgicalMetadata(title).categories.length) || !rosaryMetadata.categories.includes("marian") || !anreMetadata.categories.includes("saints")) {
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
