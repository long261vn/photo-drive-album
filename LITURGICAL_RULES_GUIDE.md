# Hướng Dẫn Chỉnh Sửa Quy Ước Tên Phụng Vụ

File duy nhất cần chỉnh là **`client/src/data/liturgical-rules.json`**. File này không đổi tên thực tế trên Google Drive; nó chỉ quyết định cách website hiển thị tên và từ khóa tìm kiếm. Do đó, **slug Album, ID ảnh và link tải Drive không bị ảnh hưởng**.

## Các phần chính

| Phần | Dùng để làm gì | Khi nào cần sửa |
|---|---|---|
| `romanNumerals` | Đổi số La Mã `I`–`XXXIV` thành số thường khi đọc tên tuần/Chúa Nhật. | Chỉ sửa nếu thêm cách ghi số La Mã khác. |
| `seasonAliases` | Nhận diện `TN`, `MC`, `PS`, `MV` và biến thể không dấu. | Thêm một viết tắt mùa mới. |
| `weekdayAliases` | Nhận diện `T2` đến `T7`. | Thường không cần sửa. |
| `liturgicalYears` | Các chu kỳ hợp lệ `A`, `B`, `C` cho bộ lọc Năm. | Chỉ sửa khi muốn giới hạn hoặc mở rộng danh sách. |
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

> `date` luôn dùng **tháng-ngày**: `03-19` là ngày 19 tháng 03. Với tên Drive mở đầu bằng `03_19_...` hoặc `03/19_...`, website hiểu đây là **tháng 03, ngày 19** và hiển thị `19/03`.

## Quy tắc cho bộ lọc mới

Ảnh **Các Thánh** được nhận diện khi có dấu hiệu Thánh/Tử Đạo, kèm ngày theo dạng `MM_DD`, `MM/DD` hoặc cụm rõ như `Các Thánh`, `Tử Đạo`. Ảnh **Đức Mẹ** dùng các cụm trực tiếp `Duc_Me`, `Duc_Maria`, `Me_Maria`, `DMMC` (có hoặc không dấu). Không thêm `Maria` hay `Ma-ri-a` đứng một mình vào `categoryKeywords.marian`, vì đây cũng là tên của nhiều vị Thánh. Ảnh Tiếng Anh dùng `_Eng` hoặc `_ENG`.

Trong website, người xem chọn **Mùa Phụng Vụ** trước rồi chọn **Tuần**; các tuần trong menu sẽ thu hẹp theo Mùa đã chọn. Hai nút **Các Thánh** và **Đức Mẹ** có thể dùng cùng nhau để tìm hợp các nhóm. Ô tìm kiếm cũng hiểu mã mùa, viết tắt, tên nhóm và các alias đã khai báo trong `smartSearchAliases`.

## Năm A/B/C và Các Thánh theo ngày

Website nhận `CN22_TN_A`, `CN22_TN_NamA`, `CN03_MuaChay_B`, `CN05_PS_C` cũng như dạng chữ `Năm A`, `Năm B`, `Năm C`. Mã ngày trong tuần có thể là `T2`–`T7` hoặc `Thu_2`–`Thu_7`. Nút **Năm A/B/C** trên thư viện chỉ lọc ảnh mang đúng metadata đó. Đối với Các Thánh, giữ định dạng `MM_DD_Thánh...`, `MM/DD_Thanh...` hoặc biến thể tương tự; website dùng phần tháng-ngày này để vừa xếp nhóm **Các Thánh**, vừa đối chiếu Danh Sách Lễ cố định.

## Cách phát hành sau khi sửa

Trên GitHub, mở file → bấm biểu tượng chỉnh sửa → sửa JSON → **Commit changes** trực tiếp vào `main`. GitHub Pages tự build và xuất bản. Khi sửa nhanh, hãy kiểm tra ba điểm: dấu phẩy giữa các mục, dấu ngoặc kép quanh chữ và dấu ngoặc vuông/ngoặc nhọn cân bằng.
