# Ghi chú kiểm thử giao diện

## 2026-08-24 — Kiểm thử MVP

Trang album `/album/da-lat-2024` đã được kiểm tra trực tiếp. Các nút mở ảnh trong contact sheet hoạt động và hiển thị lightbox toàn màn hình. Lightbox có tiêu đề ảnh, metadata vị trí/ngày, nút đóng, điều hướng ảnh trước/sau và liên kết tải ảnh. Nút tải hiện mở URL ảnh mẫu; khi tích hợp Google Drive, trường `downloadUrl` sẽ được thay bằng URL tải Drive.

Nút “Ảnh tiếp theo” đã chuyển từ ảnh 01 sang ảnh 02 và cập nhật cả tiêu đề, metadata lẫn bộ đếm `2 / 5`. Nút đóng đưa trang về đúng contact sheet hiện có, không điều hướng ra khỏi album.

Kiểm thử ảnh chụp ở viewport 360×800 cho thấy trang chủ và trang album không có scroll ngang, nội dung dài được xuống dòng hoặc rút gọn, các nút chính có diện tích chạm phù hợp. Kiểm thử desktop xác nhận grid album so le và contact sheet bất đối xứng hiển thị đúng định hướng thiết kế.

## 2026-08-24 — Phiên bản Thư viện Phụng vụ

Font Noto Serif và Be Vietnam Pro hiển thị tiếng Việt có dấu đúng ở desktop và 360×800. Trang chủ dùng nhận diện phụng vụ mới; trang album `cn20-tn-a` hiển thị danh mục, metadata, contact sheet và ảnh bìa đúng khi chưa có manifest Google Drive thật. Ảnh bên ngoài viewport hiển thị placeholder lazy-load trong ảnh chụp full-page; khi cuộn vào vùng xem, browser sẽ tải ảnh theo thuộc tính native `loading="lazy"`.

Thao tác click bằng automation vào tile đầu tiên chưa làm lightbox hiện ra, dù không có lỗi console. Cần kiểm tra lại bằng một kích hoạt DOM trực tiếp trước khi bàn giao để phân biệt giới hạn của automation với lỗi tương tác thực tế.

Kích hoạt trực tiếp tile qua DOM đã tìm thấy và gọi được event click. Tiếp theo cần đọc lại trạng thái trang để xác nhận lớp lightbox đã được render.

Lightbox đã render đúng sau khi kích hoạt DOM, với ảnh lớn, nút đóng, nút điều hướng và liên kết tải. Điều hướng “Thiết kế tiếp theo” đã đổi nội dung từ `Banner Lời Chúa` sang `Lời nguyện đầu lễ` đồng thời cập nhật bộ đếm từ `1 / 3` thành `2 / 3`.

## 2026-08-24 — GitHub Pages

Workflow GitHub Pages đã build và deploy thành công. Bản deploy đầu tiên trả về NotFound vì router chưa xử lý subpath `/photo-drive-album/`; bản sửa dùng Wouter base path đã được deploy thành công. Link có query cache-busting tải đúng trang chủ và manifest Google Drive thật. Link gốc có thể tạm giữ HTML cũ trong cache GitHub Pages tối đa vài phút sau deploy.
