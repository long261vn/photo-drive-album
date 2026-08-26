# Hướng Dẫn Chỉnh Sửa Quy Ước Tên Phụng Vụ

File duy nhất cần chỉnh là **`client/src/data/liturgical-rules.json`**. File này không đổi tên thực tế trên Google Drive; nó chỉ quyết định cách website hiển thị tên và từ khóa tìm kiếm. Do đó, **slug Album, ID ảnh và link tải Drive không bị ảnh hưởng**.

## Các phần chính

| Phần | Dùng để làm gì | Khi nào cần sửa |
|---|---|---|
| `romanNumerals` | Đổi số La Mã `I`–`XXXIV` thành số thường khi đọc tên tuần/Chúa Nhật. | Chỉ sửa nếu thêm cách ghi số La Mã khác. |
| `seasonAliases` | Nhận diện `TN`, `MC`, `PS`, `MV` và biến thể không dấu. | Thêm một viết tắt mùa mới. |
| `weekdayAliases` | Nhận diện `T2` đến `T7`. | Thường không cần sửa. |
| `languageMarkers` | Nhận diện hậu tố `_Eng`/`_ENG` và biến thể Tiếng Việt. | Thêm một hậu tố ngôn ngữ mới. |
| `categoryKeywords` | Nhận diện ảnh **Các Thánh** và **Đức Mẹ**. | Thêm một cách ghi tên nhóm mới trên Drive. |
| `smartSearchAliases` | Tập từ khóa tương đương cho tìm kiếm: `MC` ↔ Mùa Chay ↔ `lent`. | Thêm viết tắt hoặc từ đồng nghĩa. |
| `displayAliases` | Biến tên/viết tắt thường gặp thành một tên Lễ chuẩn. | Đây là mục nên thêm khi có tên Thánh hoặc Lễ mới. |
| `fixedFeasts` | Danh sách Lễ cố định theo định dạng `MM-DD`, có thể có nhiều Lễ trong một ngày. | Thêm/sửa danh sách Lễ trong năm. |

## Thêm một alias mới

Ví dụ, để mọi cách ghi `Thanh Gia`, `le thanh gia` đều hiển thị thống nhất, thêm một object vào mảng `displayAliases`:

```json
{
  "aliases": ["thanh gia", "le thanh gia"],
  "label": "Chúa Nhật Lễ Thánh Gia"
}
```

## Thêm một Lễ theo ngày

Ví dụ, để thêm Lễ vào ngày 19/03, thêm object dưới đây vào `fixedFeasts` hoặc thêm tên vào `celebrations` nếu ngày này đã tồn tại:

```json
{
  "date": "03-19",
  "celebrations": ["Thánh Giuse, Bạn Trăm Năm Đức Trinh Nữ Ma-ri-a"]
}
```

> `date` luôn dùng **tháng-ngày**: `03-19` là ngày 19 tháng 03. Với tên Drive mở đầu bằng `03_19_...`, website hiểu đúng thứ tự này.

## Quy tắc cho bộ lọc mới

Ảnh **Các Thánh** được nhận diện khi có dấu hiệu Thánh/Tử Đạo, kèm ngày theo dạng `MM_DD` hoặc cụm rõ như `Các Thánh`, `Tử Đạo`. Ảnh **Đức Mẹ** dùng các cụm `Duc_Me`, `Duc_Maria`, `Me_Maria`, `Ma-ri-a` (có hoặc không dấu). Ảnh Tiếng Anh dùng `_Eng` hoặc `_ENG`.

Trong website, người xem chọn **Mùa Phụng Vụ** trước rồi chọn **Tuần**; các tuần trong menu sẽ thu hẹp theo Mùa đã chọn. Hai nút **Các Thánh** và **Đức Mẹ** có thể dùng cùng nhau để tìm hợp các nhóm. Ô tìm kiếm cũng hiểu mã mùa, viết tắt, tên nhóm và các alias đã khai báo trong `smartSearchAliases`.

## Cách phát hành sau khi sửa

Trên GitHub, mở file → bấm biểu tượng chỉnh sửa → sửa JSON → **Commit changes** trực tiếp vào `main`. GitHub Pages tự build và xuất bản. Khi sửa nhanh, hãy kiểm tra ba điểm: dấu phẩy giữa các mục, dấu ngoặc kép quanh chữ và dấu ngoặc vuông/ngoặc nhọn cân bằng.
