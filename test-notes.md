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

## 2026-08-24 — Thư Viện Hình Công Giáo tinh gọn

Trang chủ đã đổi nhận diện thành `Thư Viện Hình Công Giáo`; bỏ cover editor, nhãn Drive, ghi chú nguồn và footer phụ. Cover, avatar, thumbnail album và ảnh trong gallery dùng `object-fit: contain`, nên giữ đủ nội dung ảnh. Hàng Album chỉ giữ thumbnail, mùa/ngày, tên, số thiết kế và nút mở; mô tả dài đã được loại bỏ. Danh sách có tìm kiếm, sắp xếp và logic phân trang 5 album/trang. Đã kiểm tra desktop và 360×800; header mobile không còn va chạm với điều hướng.

GitHub Pages đã được xác minh sau workflow triển khai thành công cho commit `624b4d8`: trang chủ tải bình thường, hiện nhận diện **Thư Viện Hình Công Giáo**, tiêu đề `Chúa Nhật Thứ … - Năm A`, cover/avatar/thumbnail từ Drive và footer `Long Nguyen © 2026`.

## 2026-08-24 — Hồ sơ nguyên văn từ info

Đã gỡ các dòng “Lưu Trữ Hình Ảnh Phụng Vụ”, “Phụ Trách Lưu Trữ” và tiêu đề hồ sơ cố định do giao diện chèn. Trang chủ hiện render trực tiếp `profile.name`, `profile.handle` và `profile.bio` từ manifest do Google Tài liệu `info` sinh ra; nội dung `Long Nguyen` và `abcdefg…` đã hiển thị đúng ở viewport 360×800.

## 2026-08-24 — Album Cha và Album Con

Đã thay manifest và script đồng bộ để nhận diện đệ quy folder lồng nhau: folder cấp một là Album Cha, folder nằm trong là Album Con; folder sâu hơn tiếp tục có thể mở thành trang Album riêng. Kiểm thử bằng manifest cục bộ với `Mùa Chay 2026` gồm hai Album Con và một ảnh trực tiếp: trang chủ mở Album Cha, Album Cha hiện hai card Album Con và gallery “Thiết Kế Đặt Trực Tiếp Trong Album Cha”, Album Con quay về đúng Album Cha và mở gallery/download riêng. Sau kiểm thử, manifest Drive thật đã được khôi phục.

Workflow đồng bộ Drive đã được cập nhật: chỉ khi `albums.json` thay đổi, workflow sẽ checkout nhánh `main` mới nhất, build rồi triển khai GitHub Pages trong cùng lượt chạy. Điều này tránh việc manifest mới bị commit nhưng chưa xuất hiện ở website chia sẻ.

## 2026-08-24 — Lối tắt đồng bộ bằng footer

Avatar giữ nguyên vai trò ảnh hồ sơ ở desktop và viewport Galaxy S20. Chạm nhanh 7 lần vào dòng `Long Nguyen © 2026` trong cửa sổ 5 giây sẽ mở workflow `Sync Google Drive albums` trên GitHub; không đủ 7 lần thì bộ đếm tự xóa. Không có token GitHub hoặc quyền chạy workflow trong mã frontend.

Đã mở preview mới nhất và mô phỏng sáu lần chạm: trang không điều hướng. Khi mô phỏng đủ bảy lần chạm trong cùng chuỗi, trình duyệt điều hướng khỏi trang preview tới workflow GitHub (xác nhận bằng trạng thái target đã điều hướng); thao tác không kích hoạt chạy workflow tự động.

Sau cập nhật tab mới, mô phỏng đủ bảy chạm xác nhận `window.open` được gọi với URL workflow, target `_blank` và `noopener,noreferrer`; URL trang thư viện hiện tại không thay đổi.

## 2026-08-25 — Ảnh thiếu URL

Manifest Drive thực tế có Album `Các Thánh` với `cover` rỗng. Đã thay việc render thẻ `img` vô điều kiện bằng placeholder trung tính cho cover/ảnh thiếu URL, đồng thời chặn Lightbox render khi ảnh không có nguồn hợp lệ. Preview trang chủ tải lại với placeholder đúng vị trí và console không còn cảnh báo `src=""`.

## 2026-08-25 — Profile Home và đầu trang Album gọn hơn

Đã bỏ hoàn toàn thanh đầu trang ở Home để Cover mở đầu trang trực tiếp; chiều cao Cover tăng lên 185px trên mobile, 245px từ 580px và 320px từ 850px. Trên trang Album, biểu tượng Thánh Giá ở đầu trang được thay bằng Avatar Drive của profile. Khối giới thiệu giảm padding, cỡ chỉ mục, cỡ tiêu đề và khoảng cách metadata; đã kiểm tra desktop cùng Galaxy S20, không có va chạm hoặc cắt nội dung.

## 2026-08-24 — Tải Toàn Bộ Album và nhãn gọn

Đã gỡ các chuỗi giao diện `Album Cha` và `Album Con`; các folder lồng nhau được trình bày trung tính là `Bộ Sưu Tập`, vẫn giữ toàn bộ điều hướng cũ. Script chỉ nhận một file `.zip` đặt trong cùng folder làm gói tải toàn Album, không đưa ZIP vào gallery. Kiểm thử cục bộ trên viewport 360×800 xác nhận nút `Tải Toàn Bộ Album` hiện đúng khi có metadata ZIP, đồng thời nhãn cũ không còn xuất hiện. Manifest Drive thật đã được khôi phục sau kiểm thử.

## 2026-08-24 — URL Album chia sẻ trực tiếp

Đã phát hiện và sửa fallback GitHub Pages cho route sâu. Trước bản sửa, URL `/album/cac-thanh` trả về trang 404 của GitHub Pages khi mở trực tiếp. Sau phát hành, cùng URL mở đúng trang `Các Thánh`, hiển thị `Bộ Sưu Tập` và không còn nhãn phân cấp cũ.
