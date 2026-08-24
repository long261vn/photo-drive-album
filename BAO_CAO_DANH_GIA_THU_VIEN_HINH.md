# Đánh giá Website Thư Viện Hình Công Giáo

## Kết luận điều hành

Website hiện tại đã là một **bản khởi đầu tốt về nhận diện cá nhân**: ảnh bìa, avatar, thông tin lấy từ Google Tài liệu `info`, album đọc từ Google Drive, gallery có ba chế độ xem, ảnh không bị crop và có liên kết tải từng ảnh. Tuy nhiên, nó đang vận hành như một **trang danh sách album nhỏ**, chưa phải một thư viện công khai có thể tra cứu lâu dài.

Mục tiêu của Long Nguyen không phải chỉ “đăng ảnh”, mà là tạo một **kho tác phẩm phụng vụ cá nhân có thể xem lại, tìm đúng và tái sử dụng**. Với khoảng 2.000 thiết kế và xuất bản hằng tuần, ưu tiên phải chuyển từ giao diện profile sang kiến trúc **catalog**: phân loại có cấu trúc, tìm kiếm toàn kho, trang ảnh riêng, download rõ ràng và luồng cập nhật tuần mới.

> **Định vị nên dùng:** “Thư viện thiết kế phụng vụ của Long Nguyen — tra cứu và tải thiết kế theo Chúa Nhật, mùa phụng vụ, lễ và chủ đề.”

## Hiện trạng và đánh giá

Trang Flickr công khai của Long Nguyen hiện có **923 ảnh**, Photostream được phân trang và khu vực Albums đã tách thành các nhóm theo năm phụng vụ, mùa và chủ đề. [1] [2] Đây là nền taxonomy rất quý; website mới nên kế thừa cấu trúc đó thay vì chỉ sao chép kiểu trình bày gallery.

| Hạng mục | Hiện trạng | Đánh giá | Cần làm |
|---|---|---|---|
| Nhận diện cá nhân | Tên/bio lấy từ `info`, cover/avatar từ Drive | Đúng hướng, rõ tác giả | Giữ nguyên nguyên tắc dữ liệu từ `info`; không chèn copy tự động vào profile |
| Album và gallery | Có list album, 3 chế độ xem, ảnh không crop, tải từng ảnh | Tốt cho vài album | Cần thêm taxonomy, trang ảnh riêng và điều hướng giữa các bộ liên quan |
| Tìm kiếm | Chỉ hữu ích ở danh sách Album hiện có | Chưa đáp ứng nhu cầu “tìm 1 thiết kế trong 2.000 ảnh” | Lập chỉ mục từng ảnh, tìm theo lễ/mùa/năm/ngôn ngữ/từ khóa |
| Dữ liệu | Manifest hiện có 2 album, 20 ảnh; mỗi ảnh chủ yếu có tên tệp, ngày và loại tệp | Metadata quá mỏng | Bổ sung ngày phụng vụ, nhóm chủ đề, ngôn ngữ, định dạng, từ khóa và mô tả |
| Tải xuống | Liên kết tải một tệp trực tiếp | Đúng nhu cầu nền tảng | Làm rõ định dạng/kích thước, thêm tải cả bộ khi phù hợp |
| Khả năng mở rộng | Toàn bộ ảnh đang nằm trong một manifest tải ở phía trình duyệt | Chấp nhận được ở thử nghiệm, không tối ưu cho 2.000 ảnh | Tách index, tải theo trang/nhóm, tạo index tìm kiếm riêng |
| Khả năng được tìm thấy trên web | Chưa có trang riêng cho từng thiết kế, title/alt còn dựa nhiều vào tên tệp | Yếu | Tạo URL riêng, metadata mô tả, sitemap và nội dung trang ảnh |

Manifest hiện tại khoảng **11,8 KB cho 20 ảnh**; nếu giữ nguyên cấu trúc, 2.000 ảnh sẽ xấp xỉ **1,18 MB metadata** phải tải trước khi người xem bắt đầu tìm. Đây không phải mức không thể dùng, nhưng là tải thừa trên mạng di động vì đa số khách chỉ cần một nhóm thiết kế. [3]

## Những điểm chưa tốt cần sửa

### 1. Tìm kiếm hiện chưa phải tìm kiếm thư viện

Ô tìm kiếm là một khởi đầu đúng, nhưng hiện không thể trả lời các nhu cầu thực tế như “hình Lễ Thánh Giuse”, “Chúa Nhật 15 Năm A”, “bản tiếng Anh”, “mẫu Tin Mừng”, hoặc “mùa Chay”. Tên tệp như `CN21 TNA BaiDoc1` thuận tiện khi làm việc nội bộ, nhưng không đủ thân thiện cho người dùng và cũng không tốt cho khả năng khám phá từ Google.

**Cần sửa:** index từng ảnh, không chỉ index Album; hỗ trợ tìm không dấu; tách điều kiện bằng chip/bộ lọc; hiển thị số kết quả; giữ URL kết quả để có thể chia sẻ.

### 2. Chưa có hệ phân loại phụng vụ bền vững

Flickr của bạn đã thể hiện các nhóm tự nhiên: `CN Thường Niên A/B/C`, `Mùa Vọng`, `Mùa Chay`, `Mùa Phục Sinh`, `Đức Mẹ`, `Các Thánh`, `Tết`, `Thiếu Nhi`, `English`. [2] Website mới hiện chỉ suy luận được một phần từ tên folder. Nếu tiếp tục như vậy, mỗi lần đổi cách đặt tên folder sẽ gây khó cho tìm kiếm và tự động hóa.

**Cần sửa:** mỗi Album và mỗi ảnh có metadata rõ ràng, ví dụ:

| Trường | Ví dụ | Dùng cho |
|---|---|---|
| `type` | `chu-nhat`, `le-cac-thanh`, `mua-phung-vu`, `thuong-nien` | Nhóm lớn |
| `liturgicalSeason` | `Mùa Chay`, `Mùa Thường Niên` | Bộ lọc mùa |
| `liturgicalYear` | `A`, `B`, `C` | Bộ lọc chu kỳ |
| `feast` | `Thánh Giuse`, `Đức Mẹ Mân Côi` | Tìm theo lễ/thánh |
| `liturgicalDate` | `2026-08-23` | Hiển thị tuần hiện tại/sắp tới |
| `language` | `vi`, `en` | Lọc ngôn ngữ |
| `assetKind` | `Tin Mừng`, `Bài Đọc 1`, `Lời Nguyện`, `Poster` | Tìm đúng mẫu cần dùng |
| `keywords` | `gieo giống, Mt 13, mục vụ` | Tìm tự do |

Metadata có thể được giữ trong một Google Sheet hoặc một file CSV/JSON quản trị bên cạnh folder Drive. Drive vẫn là nơi chứa ảnh; Sheet là “mục lục thư viện”. Đây là cách ít thay đổi thói quen làm việc nhất nhưng giúp hệ thống không phụ thuộc vào tên tệp.

### 3. Cần tách “Xem tất cả” khỏi “Xem theo Album”

Flickr tách Photostream và Albums, còn website mới hiện gần như chỉ có Albums. [1] [2] Với kho tác phẩm lớn, người dùng cần cả hai lối vào:

| Lối vào | Mục đích |
|---|---|
| **Mới nhất** | Xem tuần thiết kế vừa xuất bản; là trang chủ thực dụng nhất |
| **Khám phá tất cả** | Mọi ảnh, phân trang hoặc tải dần; lọc và tìm kiếm toàn kho |
| **Theo lịch phụng vụ** | Chúa Nhật, Mùa, Lễ Đức Mẹ, Các Thánh, ngày thường, Tết |
| **Theo Album** | Xem một bộ thiết kế hoàn chỉnh cho một ngày/lễ cụ thể |
| **Theo ngôn ngữ / định dạng** | Việt, Anh; poster, story, banner, slide… |

Trang chủ nên ưu tiên ba khối nhỏ: **Thiết Kế Mới**, **Tìm Theo Lịch Phụng Vụ**, và **Khám Phá Toàn Bộ**. Profile cá nhân vẫn có giá trị, nhưng nên gọn để nội dung và hành động tìm/tải là trọng tâm.

### 4. Hành trình tải xuống chưa đủ rõ

Nút tải từng ảnh là đúng, nhưng người dùng mục vụ thường cần cả bộ cho một Chúa Nhật hoặc cần biết họ sẽ tải định dạng nào. Mỗi ảnh nên cho biết tối thiểu: tên hiển thị, ngôn ngữ, định dạng, kích thước nếu có và giấy phép/cách ghi công nếu bạn muốn đặt điều kiện sử dụng.

**Nên có thêm:** nút “Tải Ảnh”, nút “Tải Cả Bộ” chỉ khi có file ZIP chuẩn bị sẵn, URL ảnh để chia sẻ, và liên kết “Xem Album Gốc”. Không nên nén ZIP theo yêu cầu trong trình duyệt hay tải hàng trăm ảnh cùng lúc vì sẽ chậm và dễ gây lỗi.

### 5. Cần trang riêng cho từng ảnh và chuẩn SEO

Mỗi thiết kế nên có URL bền vững, ví dụ `/anh/cn21-thuong-nien-a-tin-mung-vi`, với ảnh lớn, mô tả, các tag, download và liên kết tới Album liên quan. Google khuyến nghị dùng tên tệp/tên trang/alt text mô tả, đặt ảnh cạnh nội dung liên quan và dùng sitemap ảnh để cải thiện việc phát hiện ảnh. [5] [6]

Đây không chỉ là SEO: URL riêng giúp giáo xứ hoặc người dùng gửi đúng thiết kế cho nhau, thay vì phải chụp màn hình hoặc giải thích “ảnh thứ tư trong Album”.

## Ưu tiên phát triển đề xuất

### Giai đoạn 1 — Biến website thành thư viện tra cứu

Triển khai trước: index từng ảnh; tìm kiếm toàn kho; bộ lọc theo mùa, năm A/B/C, chủ đề/lễ, ngôn ngữ và loại thiết kế; trang “Thiết Kế Mới”; trang “Khám Phá Tất Cả”; phân trang 48–60 ảnh/lần; URL có thể chia sẻ cho Album và ảnh. Đây là phần có tác động lớn nhất tới người dùng.

### Giai đoạn 2 — Chuẩn hóa quy trình xuất bản hằng tuần

Giữ Drive làm kho chính. Khi chuẩn bị tuần mới, tạo folder theo quy ước cố định, thêm ảnh, rồi bổ sung một dòng metadata ngắn trong Sheet/CSV. Lần đồng bộ kế tiếp sẽ tạo Album, index ảnh, bộ lọc và trang chi tiết. Nên có trạng thái `Sắp Tới` để bạn có thể chuẩn bị cả tuần sau nhưng chỉ công khai khi muốn.

### Giai đoạn 3 — Phát hành, truy cập và tái sử dụng

Thêm sitemap, metadata chia sẻ (Open Graph), alt text từ metadata, “Thiết Kế Liên Quan”, download theo bộ khi có ZIP, và trang hướng dẫn sử dụng ảnh. Sau khi có dữ liệu thật, đo các truy vấn tìm kiếm không có kết quả để bổ sung keyword/bộ lọc.

## Những thứ chưa cần ưu tiên

Không cần làm tài khoản người dùng, bình luận, like, feed xã hội, AI sinh ảnh hay chỉnh sửa ảnh trực tuyến ở giai đoạn này. Chúng tăng độ phức tạp nhưng không giúp một giáo xứ tìm và tải nhanh đúng mẫu. Đầu tư đúng nhất là **mục lục tốt, lọc tốt, metadata tốt và download tin cậy**.

## Quyết định thiết kế nên chốt trước khi xây tiếp

1. Chọn bộ taxonomy chính thức: các mùa, năm A/B/C, các lễ, nhóm Các Thánh, ngày thường, ngôn ngữ và dạng thiết kế.
2. Chọn nguồn metadata: ưu tiên Google Sheet đơn giản hay metadata file cạnh từng folder.
3. Chốt quy ước folder/tên tệp cho tuần mới, để tự động hóa không phải “đoán” từ tên.
4. Quy định quyền sử dụng ảnh: tự do dùng mục vụ, yêu cầu ghi công hay cần xin phép khi tái sử dụng thương mại.

## References

[1] [Long Nguyen — Flickr Photostream](https://www.flickr.com/photos/199616417@N03/)

[2] [Long Nguyen — Flickr Albums](https://www.flickr.com/photos/199616417@N03/albums)

[3] [Manifest dữ liệu hiện tại của website](https://long261vn.github.io/photo-drive-album/data/albums.json)

[4] [Website Thư Viện Hình Công Giáo hiện tại](https://long261vn.github.io/photo-drive-album/)

[5] [Google Search Central — Image SEO Best Practices](https://developers.google.com/search/docs/appearance/google-images)

[6] [Google Search Central — Image Sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps)
