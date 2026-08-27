# Rà soát giao diện — 27/08/2026

## Phạm vi và kết luận

Đã rà soát các luồng **Xem tất cả**, **Theo thư mục**, **Thư mục có tên dài**, thanh tìm kiếm–lọc, chuyển cách xem, điều hướng về trang chủ, danh sách chi tiết và Lightbox. Việc rà soát dùng viewport desktop 1280×720 và Galaxy S20 360×800, đồng thời thử luồng mở ảnh và quay về trang chủ.

> Kết luận chính: giao diện đã có nền tảng nhất quán với nền giấy, màu xanh lá và metadata gọn; tuy nhiên trên điện thoại, phần đầu trang và tiêu đề Thư mục vẫn chiếm quá nhiều chiều cao. Cần ưu tiên giảm cỡ chữ, nén khoảng cách dọc và làm nhịp thao tác rõ hơn trước khi tiếp tục thêm hiệu ứng hoặc trang mới.

## Danh sách ưu tiên cải tiến

| Ưu tiên | Khu vực | Vấn đề quan sát được | Điều chỉnh sẽ thực hiện |
|---|---|---|---|
| P0 | Tiêu đề Thư mục trên điện thoại | Tên dài có thể chiếm 5 dòng và gần nửa màn hình đầu, làm cảm giác giống poster hơn danh sách Thư mục. | Giảm cỡ chữ mobile, tăng nhẹ line-height, kiểm soát khoảng cách tiêu đề–metadata–tải và giữ toàn bộ tên dễ đọc. |
| P0 | Cover–avatar–hồ sơ | Cụm nhận diện đang chiếm nhiều chiều cao trên mọi trang; cover ảnh Lễ vô tình lấn át tên Long Nguyen. | Giảm chiều cao cover và avatar theo breakpoint, đưa tên/thống kê vào một hàng rõ hơn, giảm khoảng trống dưới cụm hồ sơ. |
| P0 | Trang Thư mục | Sau cover, thanh quay lại, tiêu đề và nút tải đang xếp thành nhiều khối dọc trước khi thấy nội dung. | Nén phần điều hướng, đưa metadata gần tiêu đề và sắp lại nút tải theo trật tự đọc điện thoại. |
| P1 | Thanh tìm kiếm và thao tác | Ô tìm kiếm đã gọn nhưng các nút thao tác vẫn dễ vỡ thành nhiều hàng không đều ở màn hình hẹp. | Thiết lập hệ hàng ưu tiên: tìm kiếm + lọc trước; các nút kiểu xem thành nhóm nhỏ cùng nhịp; giảm padding/letter-spacing không cần thiết. |
| P1 | Trang Xem tất cả | Ảnh hiển thị đúng hai cột trên điện thoại, nhưng caption và metadata dưới ảnh quá dày khi cuộn dài. | Rút caption về tối đa hai dòng, chỉ giữ metadata quan trọng, tăng khoảng cách chạm mà không tăng chiều cao thẻ. |
| P1 | Theo thư mục / Chi tiết | Danh sách đã rõ, nhưng tên dài cần ưu tiên tuyệt đối khi các cột phụ hiện ra ở màn hình rộng. | Duy trì chỉ Tên, Ngày, Loại; tối ưu grid để tên nhận phần lớn chiều ngang và hàng chạm tối thiểu 48px. |
| P2 | Voice hồ sơ | Nội dung `abcdefg…` làm giảm đáng kể cảm giác hoàn chỉnh. | Giữ nguyên dữ liệu Drive theo yêu cầu; owner nên thay bằng giới thiệu thật. Không tự tạo nội dung thay thế. |
| P2 | Lightbox | Các chức năng xem đầy đủ, zoom, tải và mở Thư mục đã có. | Giữ nguyên hệ điều khiển hiện tại; chỉ tinh chỉnh spacing nếu phát hiện tràn trong lượt kiểm thử sau chỉnh giao diện. |

## Nguyên tắc chỉnh sửa được áp dụng

Lượt hoàn thiện sẽ **không** thay đổi dữ liệu Google Drive, quy tắc đặt tên, tên thư mục, ảnh gốc, tính năng tải hoặc Lightbox. Ảnh tiếp tục không bị crop. Mọi thay đổi tập trung vào tỷ lệ chữ, khoảng trống, kích thước vùng chạm và thứ bậc đọc trên 360px; desktop chỉ điều chỉnh tương ứng để hệ thống nhất quán.

Theo yêu cầu owner, các ô ảnh trong **Xem tất cả** tiếp tục đồng đều; vì vậy đề xuất dùng ảnh neo phóng lớn theo từng tháng không được áp dụng trong lượt này.
