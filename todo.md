# Hạng mục cập nhật

- [ ] Xác minh quyền truy cập và cấu trúc folder Google Drive `1ua5LsDU7yv-Y_ZFyFA7lx4LoKiXcGwUw`.
- [ ] Đọc hướng dẫn cấu hình tích hợp và xác định phương án OAuth/secret an toàn cho Drive API.
- [ ] Thay brand, typography và nội dung bằng định hướng kho thiết kế Công giáo theo lịch phụng vụ.
- [ ] Tạo manifest `client/public/data/albums.json` cùng schema cho album, ảnh và link tải.
- [ ] Viết script `sync-drive.mjs` để đọc folder Drive, lọc ảnh, tạo metadata và cập nhật manifest.
- [ ] Tạo workflow GitHub Actions chạy theo lịch, có thể chạy thủ công và chỉ commit manifest khi nội dung thay đổi.
- [ ] Cấu hình secrets, tài liệu hóa biến cần thiết và thêm hướng dẫn kết nối Google Cloud/Drive API.
- [ ] Tối ưu lazy loading ảnh, placeholder và chuyển cảnh lightbox.
- [ ] Kiểm thử desktop, 360px, lightbox và fallback khi chưa cấu hình Drive secret.
