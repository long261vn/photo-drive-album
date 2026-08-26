import { unzipSync, zipSync } from "fflate";

const source = "https://drive.google.com/uc?export=download&id=19Lp8vWFtatiHF51_eDshUY04CLZQPgxP";
const response = await fetch(source);
if (!response.ok) throw new Error(`Không tải được ảnh mẫu: ${response.status}`);

const image = new Uint8Array(await response.arrayBuffer());
const archive = zipSync({ "anh-mau.png": image }, { level: 0 });
const contents = unzipSync(archive);
if (!contents["anh-mau.png"]?.length) throw new Error("ZIP không chứa ảnh mẫu");

console.log(`Đã xác nhận tải ảnh Drive và đóng gói ZIP: ${image.length} bytes.`);
