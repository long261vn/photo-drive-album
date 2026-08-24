# Ghi chú đánh giá thư viện thiết kế

## Flickr của Long Nguyen — quan sát 2026-08-24

Trang Flickr công khai cho thấy hồ sơ `Long Nguyen` có **923 ảnh**, thuộc Photostream phân trang ít nhất 10 trang. Điều hướng tách rõ Photostream và Albums; trang còn có tìm kiếm riêng trong photostream. Đây là chuẩn tham chiếu hữu ích cho website mới: phải có một luồng xem toàn bộ tác phẩm độc lập với luồng xem theo Album, tìm kiếm trên toàn bộ kho, và phân trang/hiển thị theo tải dần khi số ảnh tăng.

Mục Albums của Flickr đang có ít nhất 18 nhóm, bao gồm các nhóm theo **năm phụng vụ** (`CN Thường Niên A/B/C`, `Mùa Vọng - Năm A/B/C`), **mùa** (`Mùa Chay`, `Mùa Phục Sinh`, `Mùa Giáng Sinh`), và **chủ đề/lễ** (`Đức Mẹ`, `Các Thánh`, `Tết`, `Thiếu Nhi`, `English`). Taxonomy này phù hợp để chuyển thành bộ lọc có cấu trúc trên website mới, thay vì chỉ lọc chuỗi tên Album.
