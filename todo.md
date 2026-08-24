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
