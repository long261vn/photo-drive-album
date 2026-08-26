import { formatLiturgicalTitle, liturgicalSearchText } from "../client/src/lib/liturgicalName";

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

console.log(`Đã xác nhận ${cases.length} mẫu tên phụng vụ.`);
