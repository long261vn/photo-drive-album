# Hạng mục cập nhật

- [x] Xác minh quyền truy cập và cấu trúc folder Google Drive `1ua5LsDU7yv-Y_ZFyFA7lx4LoKiXcGwUw`.
- [x] Đọc hướng dẫn cấu hình tích hợp và xác định phương án OAuth/secret an toàn cho Drive API.
- [x] Thay brand, typography và nội dung bằng định hướng kho thiết kế Công giáo theo lịch phụng vụ.
- [x] Tạo manifest `client/public/data/albums.json` cùng schema cho album, ảnh và link tải.
- [x] Viết script `sync-drive.mjs` để đọc folder Drive, lọc ảnh, tạo metadata và cập nhật manifest.
- [x] Tạo workflow GitHub Actions chạy theo lịch, có thể chạy thủ công và chỉ commit manifest khi nội dung thay đổi.
- [ ] Người dùng thêm `GOOGLE_DRIVE_API_KEY` vào GitHub Actions Secrets theo hướng dẫn.
- [x] Tối ưu lazy loading ảnh, placeholder và chuyển cảnh lightbox.
- [x] Kiểm thử desktop, 360px, lightbox và fallback khi chưa cấu hình Drive secret.
- [x] Xác minh repository GitHub `long261vn/photo-drive-album` hiển thị cho đúng tài khoản người dùng: repository là private và thuộc tài khoản `long261vn`.
- [ ] Kiểm tra kết quả lần chạy thủ công workflow `Sync Google Drive albums` và manifest ảnh thật.
- [ ] Kiểm tra điều kiện GitHub Pages và tạo link chia sẻ website từ GitHub.
- [x] Quét source và lịch sử Git để phát hiện API key, token hoặc credential trước khi public repository: không phát hiện giá trị secret theo các mẫu phổ biến; chỉ có tên biến và tham chiếu GitHub Secret.
- [x] Khắc phục lỗi 404 của đường link GitHub Pages và xác minh website chia sẻ hoạt động; link gốc có thể cần vài phút để hết cache HTML cũ.
- [x] Phân tích album Flickr mẫu để xác định cách trình bày và chuyển chế độ xem.
- [x] Thêm chế độ xem ảnh lớn, lưới ảnh nhỏ và danh sách chi tiết.
- [x] Điều chỉnh ảnh để hiển thị đủ tỷ lệ, không dùng crop cắt xén.
- [x] Kiểm thử công tắc chế độ xem trên desktop và Galaxy S20.
