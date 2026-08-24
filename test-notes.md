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

## 2026-08-24 — Gallery kiểu Flickr

Album `cn20-tn-a` hiển thị ba công tắc có nhãn rõ: Ảnh lớn, Lưới ảnh và Danh sách. Chế độ Ảnh lớn xếp từng thiết kế theo một cột; chế độ Lưới ảnh hiển thị 5 ảnh một hàng trên desktop. Các thumbnail dùng `object-fit: contain` trong khung nền giấy để giữ đủ nội dung thiết kế thay vì crop. Cần tiếp tục xác minh chế độ Danh sách và mobile.

Chế độ Danh sách hiển thị từng tệp với thumbnail, thứ tự, tiêu đề, mùa/ngày, định dạng JPEG, nguồn Google Drive và nút Tải riêng. Ở 360×800, thanh điều khiển chỉ còn icon để tránh tràn ngang; chế độ Ảnh lớn vẫn một cột và giữ trọn thiết kế. Điều hướng trực tiếp về album khởi tạo ở chế độ Ảnh lớn như kỳ vọng.

Từ chế độ Danh sách, thumbnail của mỗi dòng vẫn mở lightbox. Lightbox hiển thị đúng ảnh đầy đủ, thông tin `Thiết kế / 01`, nút đóng, điều hướng trước/sau và liên kết tải trực tiếp từ Google Drive.

## 2026-08-24 — Profile trang chủ và Unicode tiếng Việt

Trang chủ đã dùng `Avatar.png` và `Cover.png` thật từ folder `Website_LHN_Data` thông qua manifest Drive. Layout profile hiển thị cover, avatar chồng cover, tên, mô tả, thống kê album/thiết kế và danh mục album dày hơn cho thư viện nhiều nội dung. Noto Serif và Noto Sans được dùng xuyên suốt, hiển thị tiếng Việt có dấu ổn định. Album mở mặc định ở chế độ Lưới. Đã kiểm tra desktop và viewport 360×800: cover/avatar, phần giới thiệu, tìm kiếm và grid không tràn ngang.

## 2026-08-24 — Cover reposition và danh sách album

Giao diện mới hiển thị nút Điều chỉnh ảnh bìa trên cover và danh sách album có thumbnail, số thứ tự, metadata mùa/ngày, mô tả, số thiết kế, nút mở album, tìm kiếm cùng dropdown sắp xếp. Desktop và viewport 360×800 không có tràn ngang; trên mobile, list giữ thumbnail nhỏ, tên album dễ quét và nút mũi tên mở album.

Cover editor mở được và hiển thị lớp hướng dẫn kéo ảnh. Bổ sung thêm hai thanh điều chỉnh Ngang/Dọc để thao tác reposition cũng dùng được với cảm ứng và bàn phím; người dùng có thể lưu tạm trên thiết bị hoặc xuất JSON để cập nhật cấu hình dùng chung.
