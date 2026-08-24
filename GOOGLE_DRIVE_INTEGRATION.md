# Kết nối Google Drive cho Khoảnh Khắc

## Trạng thái hiện tại

Giao diện MVP đang dùng dữ liệu minh họa ở `client/src/lib/albumData.ts`. Cấu trúc dữ liệu đã có các trường cần dùng khi đồng bộ Google Drive: `id`, `slug`, `title`, `cover`, `photos`, `src` và `downloadUrl`.

Để chuyển website sang album thật, cần một **folder Google Drive gốc**. Mỗi folder con trực tiếp sẽ là một album và mỗi ảnh bên trong folder con sẽ là một ảnh gallery.

```text
Website Album Ảnh/
├── 2024 - Đà Lạt/
│   ├── cover.jpg
│   ├── dalat-001.jpg
│   └── dalat-002.jpg
└── 2025 - Gia đình/
    ├── cover.jpg
    └── family-001.jpg
```

`cover.jpg` là ảnh bìa album nếu có. Nếu không có file này, script đồng bộ sẽ dùng ảnh đầu tiên làm bìa.

## Chuẩn bị trên Google Drive

Folder gốc và tất cả nội dung cần hiển thị phải được chia sẻ với quyền xem phù hợp. Với album công khai, có thể dùng chế độ **Anyone with the link — Viewer**. Trước khi kết nối, nên mở folder qua cửa sổ ẩn danh để xác nhận khách không đăng nhập vẫn xem được file.

Không chia sẻ cả My Drive. Chỉ chia sẻ folder gốc cho website. Ảnh đã hiển thị công khai có thể được sao chép hoặc chia sẻ lại, vì vậy không đặt ảnh riêng tư trong folder này.

## Quy trình tích hợp tiếp theo

Sau khi có link folder mẫu, bước tiếp theo là thêm một script đồng bộ dùng Google Drive API. Script sẽ đọc folder, tạo manifest `albums.json` và GitHub Actions sẽ chạy theo lịch để cập nhật manifest. Website chỉ đọc manifest; không đưa OAuth secret hoặc refresh token vào mã frontend.

| Đầu vào cần có | Mục đích |
| --- | --- |
| Link folder Drive gốc | Lấy `folderId` cho đồng bộ |
| 2–3 folder album thử nghiệm | Xác nhận quy ước folder/file |
| Tên website hoặc tên chủ album | Thay wordmark mặc định nếu cần |
| Tên miền riêng, nếu có | Cấu hình ở bước phát hành |

## Lưu ý về nút Download

Nút tải của website sẽ trỏ trực tiếp đến URL download của từng file trên Google Drive. Khi người xem tải theo URL này, nội dung ảnh được Google Drive phục vụ; GitHub Pages chỉ phục vụ giao diện, JavaScript và manifest dữ liệu.
