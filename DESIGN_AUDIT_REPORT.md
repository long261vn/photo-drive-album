# Báo Cáo Đánh Giá Thiết Kế Giao Diện

**Dự án:** Thư Viện Hình Công Giáo  
**Người phụ trách:** Long Nguyen  
**Ngày đánh giá:** 25/08/2026  
**Phạm vi:** Trang chủ, chế độ Xem Tất Cả, trang Album, trình xem ảnh, desktop 1280px và Galaxy S20 360px.

---

## 1. Kết luận điều hành

Giao diện hiện đã có một **nền tảng thẩm mỹ vững**: nền giấy ấm, xanh lá rừng, serif Việt hóa, metadata chữ hoa, đường kẻ mảnh và chỉ mục ảnh tạo được cảm giác **kho lưu trữ phụng vụ** thay vì một gallery phổ thông. Hai lối duyệt “Xem theo Album” và “Xem tất cả” rõ ràng; các thiết kế được tổ chức theo Album hoặc theo thời gian; Lightbox có thao tác xem đầy đủ, phóng to, thu nhỏ và tải ảnh.

Lần rà soát này đã hạ cover desktop xuống **340px** để nhịp đầu trang gọn hơn, đồng thời chuyển tiêu đề chính thành **“Thư Viện Hình Công Giáo”**. Tên Long Nguyen vẫn được giữ như thông tin phụ và phần hồ sơ tiếp tục lấy từ Drive. Nhìn tổng thể, sản phẩm đã sẵn sàng cho sử dụng công khai; các hạng mục ưu tiên tiếp theo nằm ở **biên tập dữ liệu Drive, hoàn thiện thumbnail và tăng khả năng khám phá kho lớn**.

| Hạng mục | Đánh giá | Nhận xét ngắn |
|---|---:|---|
| Nhận diện & thẩm mỹ | 4/5 | Hệ giấy–xanh lá–serif nhất quán; đầu trang nay đọc như thư viện phụng vụ rõ hơn. |
| Phân cấp thông tin | 4/5 | Album, metadata và chỉ mục có trật tự; tên folder thô vẫn làm giảm tính biên tập. |
| Điều hướng & tìm kiếm | 4/5 | Hai chế độ duyệt rõ; tìm kiếm sâu và lọc Background hữu ích. |
| Trải nghiệm ảnh | 4/5 | Ảnh không crop, Lightbox vừa ảnh/zoom/toàn màn hình đã đầy đủ. |
| Responsive & chạm | 4/5 | Galaxy S20 không tràn ngang; một số nhãn chế độ xem trong Album còn thiên về biểu tượng. |
| Hiệu năng cảm nhận | 3.5/5 | Lazy loading hợp lý; thư viện lớn vẫn cần tối ưu thumbnail và chia tải có chủ đích. |

---

## 2. Những điểm đang làm tốt

### 2.1. Ngôn ngữ thị giác đã có bản sắc

Nền ivory, đường hairline, tiêu đề Noto Serif lớn và metadata sans chữ hoa tạo được chất **editorial archive** có kiểm soát. Màu xanh lá chỉ xuất hiện ở điều hướng, trạng thái chọn và chỉ mục, nên không lấn át các ảnh thiết kế Công giáo vốn nhiều màu. Các mốc số, góc khung thumbnail và cấu trúc contact sheet giúp trải nghiệm có tính hệ thống.

### 2.2. Hai cách duyệt nội dung đã rõ mục đích

**Xem theo Album** phù hợp khi người xem đã biết chủ đề, Chúa Nhật hoặc mùa phụng vụ cần tìm. **Xem tất cả** phù hợp để xem kho như một dòng thời gian. Trên cả desktop và Galaxy S20, hai lựa chọn xuất hiện trước phần nội dung, giúp người mới hiểu ngay họ đang chọn cách tiếp cận nào.

### 2.3. Trình xem ảnh đã đáp ứng nhu cầu sử dụng thực tế

Lightbox mặc định dùng chế độ **Vừa ảnh** với `object-fit: contain`; toàn bộ ảnh ngang hoặc dọc nằm trong vùng nhìn. Người xem có thể phóng to, thu nhỏ, đặt lại tỷ lệ, kéo khi zoom, dùng toàn màn hình, chuyển ảnh, đóng và tải. Việc chỉ mở vùng crop khi người dùng chủ động zoom là quyết định đúng cho thư viện thiết kế có nhiều nội dung chữ.

### 2.4. Quy tắc dữ liệu Drive phù hợp thư viện lớn

Hệ thống đã phân biệt ảnh `_BG`, chỉ hiển thị khi bật bộ lọc; cover không chọn Background; tìm kiếm dò sâu tên Album, Bộ Sưu Tập và hình; folder công việc như PSD/File Thiết Kế bị loại. Đây là các quy tắc có giá trị vận hành thực tế, giúp kho hàng nghìn thiết kế không nhanh chóng trở thành một thư mục lộn xộn.

---

## 3. Các điểm cần cải thiện

| Ưu tiên | Vấn đề | Dấu hiệu hiện tại | Tác động | Khuyến nghị cụ thể |
|---|---|---|---|---|
| **P1** | Tên Album mang tính file system | Ví dụ `CN21 TN A va Tuan21TN tu 23 08 den 29 08`; mobile phải xuống nhiều dòng. | Làm giảm cảm giác tuyển chọn và khó quét nhanh. | Đổi tên folder Drive thành `Chúa Nhật XXI Thường Niên – Năm A · 23–29.08`; giữ mã cũ ở metadata nếu cần. |
| **P1** | Bio hiện là nội dung thử nghiệm | Dòng `abcdef...` đang xuất hiện ngay dưới tên. | Làm giảm độ tin cậy của trang đầu. | Sửa Google Docs `info` bằng 1–2 câu ngắn, có dấu và đúng giọng phụng vụ; sau đó Run workflow. |
| **P1** | Một số Album thiếu thumbnail | Các tile placeholder tạo khoảng trống màu giấy trong list/timeline. | Người xem khó nhận diện nhanh Album. | Đặt file `cover...` không chứa `_BG` tại folder cần ưu tiên; hoặc thêm tối thiểu một ảnh thực vào folder/collection con. |
| **P1** | Timeline khá dày trên mobile | Dòng thời gian nhiều tile nhỏ liên tiếp. | Dễ mỏi mắt, khó quay lại một mốc tháng đã xem. | Thêm thanh nhảy tháng/năm dạng sticky hoặc bộ lọc năm ở đầu Xem Tất Cả. |
| **P2** | Nhãn ba chế độ trong Album bị rút gọn ở màn hẹp | Trên Galaxy S20, Xem Lớn/Lưới/Danh Sách ưu tiên icon. | Người mới có thể không hiểu ngay biểu tượng. | Giữ tooltip hiện có; cân nhắc đặt nhãn chữ ngắn cho trạng thái đang chọn hoặc một menu “Cách xem”. |
| **P2** | Hồ sơ vẫn mang nét profile cá nhân | Avatar tròn cùng cover có thể gợi mạng xã hội. | Mâu thuẫn nhẹ với tinh thần kho lưu trữ. | Giữ Avatar theo yêu cầu cá nhân nhưng dùng logo cửa sổ thánh giá ở favicon/header; tránh bổ sung yếu tố profile khác. |
| **P2** | Nội dung timeline chưa phân tầng theo ý nghĩa phụng vụ | Hiện chủ yếu chia theo tháng tạo Drive. | Khám phá theo mùa phụng vụ còn hạn chế. | Thêm filter `Mùa Thường Niên`, `Mùa Chay`, `Phục Sinh`, `Các Thánh`, `Lễ Trọng` dựa trên tên folder hoặc tag. |
| **P3** | Bundle frontend còn khá lớn | Build gần nhất có JavaScript nén khoảng 172KB và cảnh báo chunk lớn. | Chậm hơn ở mạng di động yếu, dù chưa có lỗi runtime. | Tách Lightbox và Timeline bằng dynamic import khi thư viện tiếp tục tăng; chỉ tải khi người dùng mở chúng. |

> **Nhận định:** Các lỗi có ảnh hưởng rõ nhất không nằm ở CSS mà ở **chất lượng tên folder, cover và nội dung profile trên Drive**. Khi dữ liệu nguồn được biên tập, giao diện hiện tại sẽ thuyết phục hơn đáng kể mà không cần tăng độ phức tạp kỹ thuật.

---

## 4. Đánh giá từng trải nghiệm

### 4.1. Trang chủ

Trang chủ đã có cấu trúc hợp lý: cover tạo bối cảnh, tên thư viện xác định mục đích, hai chế độ duyệt tạo đường đi, sau đó mới đến công cụ tìm kiếm và danh sách Album. Chiều cao cover **340px** ở desktop tạo cân bằng tốt hơn giữa tác động thị giác và tốc độ đi vào nội dung. Ở mobile, cover ngắn hơn và tiêu đề xếp lại có kiểm soát.

Điểm cần nâng là **biên tập phần copy**. Tên thư viện đã đúng; phần dưới nên dùng thông tin trong Docs như một lời giới thiệu ngắn, không để chuỗi thử nghiệm. Danh sách Album nên được hưởng lợi trực tiếp từ việc đổi tên folder có dấu, thay vì cố đoán nghĩa từ mã tắt.

### 4.2. Xem tất cả

Đây là phần mạnh nhất về cảm giác archive. Nhãn tháng lớn, rail dọc, index marker và ảnh neo đầu nhóm tạo nhịp đọc tốt. Tìm kiếm riêng, lọc Background và tải thêm giảm nguy cơ phải render tất cả thiết kế cùng lúc.

Vì kho sẽ còn lớn hơn, nên bổ sung một **bộ nhảy nhanh theo năm/tháng** là bước tiếp theo có lợi nhất. Nó giúp người xem quay lại một mốc đã biết mà không phải cuộn qua hàng trăm card. Với người dùng mục vụ, filter theo mùa phụng vụ còn có giá trị hơn filter kỹ thuật.

### 4.3. Trang Album

Trang Album đủ tối giản để ưu tiên thiết kế. Tiêu đề lớn, metadata gọn, có ba chế độ xem, nút Background và khả năng hiển thị cả ảnh lẫn Bộ Sưu Tập lồng nhau. Khoảng trống ở Album ít ảnh là chủ đích editorial chấp nhận được, không phải lỗi.

Tuy nhiên, ở mobile các icon đổi chế độ xem có nguy cơ chưa tự giải thích đầy đủ. Khi cần giảm diện tích, nên ưu tiên hiển thị **tên của chế độ đang chọn** hơn là chỉ để icon; phần còn lại giữ tooltip hỗ trợ.

### 4.4. Lightbox

Trình xem đáp ứng tốt nguyên tắc “ảnh là nhân vật chính”. Vừa ảnh mặc định, zoom theo ý người xem và toàn màn hình xử lý đúng nhu cầu đọc thiết kế có nhiều chi tiết/chữ. Bản desktop đã chừa vùng an toàn cho thanh công cụ và footer, loại tình trạng mất phần đáy.

Nâng cấp tương lai nên là một **overlay trợ giúp ngắn lần đầu mở**: `+/- để zoom`, `0 để vừa ảnh`, `←/→ để chuyển`, `F toàn màn hình`. Điều này làm các chức năng mạnh hiện có dễ được khám phá hơn mà không tăng clutter.

---

## 5. Responsive, accessibility và độ ổn định

Đánh giá ở 360×800 cho thấy không có tràn ngang rõ rệt; cover, tìm kiếm, sắp xếp, phân trang và card Album xếp lại hợp lý. Các thao tác chính có button thật, nhãn truy cập và trạng thái chọn; chuyển động nhỏ, ngắn và có tôn trọng reduced motion. Console kiểm tra không có lỗi ứng dụng hoặc yêu cầu 4xx/5xx gần đây.

Điểm cần tiếp tục theo dõi là **thumbnail tải chậm**. Lazy loading là lựa chọn đúng cho kho lớn, nhưng cover của Album quan trọng nên có ảnh `cover...` rõ ràng để người xem không gặp quá nhiều placeholder khi mạng yếu hoặc vừa tải trang.

---

## 6. Lộ trình đề xuất

| Giai đoạn | Mục tiêu | Việc cần làm | Giá trị |
|---|---|---|---|
| **Ngay bây giờ** | Nâng chất lượng đầu trang | Sửa `info` trên Drive; đổi 10–20 folder nổi bật sang tên tiếng Việt có dấu; thêm cover. | Tăng độ tin cậy và khả năng đọc tức thì. |
| **Đợt kế tiếp** | Khám phá kho lớn tốt hơn | Bộ nhảy năm/tháng và filter mùa phụng vụ ở Xem Tất Cả. | Người xem tìm lại đúng mùa/lễ nhanh hơn. |
| **Đợt ba** | Tăng trải nghiệm xem ảnh | Overlay phím tắt Lightbox, xoay ảnh, slideshow tùy chọn. | Phù hợp thói quen xem ảnh trên desktop. |
| **Khi kho tăng mạnh** | Bảo toàn tốc độ | Dynamic import Lightbox/Timeline, đo tải ảnh trên 4G thực tế. | Giảm tải ban đầu và cải thiện mobile. |

---

## 7. Tiêu chuẩn giữ vững khi phát triển tiếp

1. **Không crop ảnh thiết kế.** Thumbnail và Lightbox phải ưu tiên `contain`; chỉ crop vùng nhìn khi người dùng chủ động zoom.
2. **Drive là nguồn sự thật.** Tên folder, cover và text `info` nên được quản lý ở Drive; website không tự bịa mô tả profile.
3. **Một hệ archive duy nhất.** Nền giấy, xanh lá rừng, metadata, số index, hairline và frame marker phải xuất hiện nhất quán; tránh thêm gradient/neon/card bo tròn không cần thiết.
4. **Mobile trước.** Mọi bộ lọc, chuyển chế độ và Lightbox cần còn dễ chạm ở 360px trước khi mở rộng trên desktop.

---

## 8. Kết quả kiểm tra thực hiện

| Kiểm tra | Kết quả |
|---|---|
| Chiều cao cover desktop | Đã đặt **340px** tại breakpoint desktop. |
| Hiển thị ảnh cover | `object-fit: contain`, không crop. |
| Trang chủ, Timeline, Album desktop | Đã kiểm tra trực quan ở 1280×720. |
| Trang chủ, Timeline, Album mobile | Đã kiểm tra trực quan ở 360×800. |
| Console và network gần đây | Không có lỗi ứng dụng hoặc yêu cầu 4xx/5xx được ghi nhận. |
| TypeScript/build | Đã chạy thành công sau khi chốt cover 340px và nhận diện trang đầu. |
