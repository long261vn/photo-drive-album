# Định hướng thiết kế — Khoảnh Khắc

## Ba hướng tiếp cận

### Theme Name: Nhật Ký Ánh Sáng

**Very Brief Intro:** Một tạp chí ảnh ấm áp, gần gũi với cảm giác giấy in và ánh nắng nhạt. Hướng này ưu tiên câu chuyện phía sau từng bộ ảnh hơn tính kỹ thuật.

**Probability:** 0.07

### Theme Name: Kho Lưu Trữ Hiện Đại

**Very Brief Intro:** Một không gian lưu trữ ảnh cá nhân tinh gọn, gợi nhắc archive studio và contact sheet của nhiếp ảnh gia. Bố cục lệch, typography mạnh và dữ liệu album rõ ràng tạo cảm giác có chủ đích.

**Probability:** 0.04

### Theme Name: Phòng Tối Đêm Xanh

**Very Brief Intro:** Một gallery tối giàu tương phản, lấy cảm hứng từ phòng tối và ảnh phim. Hướng này tạo cảm giác điện ảnh nhưng không dùng neon hoặc cyberpunk.

**Probability:** 0.09

---

## Hướng được chọn: Kho Lưu Trữ Hiện Đại

### Design Movement

Contemporary Editorial Archive kết hợp ngôn ngữ thiết kế của **contact sheet nhiếp ảnh**, **Swiss editorial layout** và lưu trữ văn hóa hiện đại. Website không cố giả lập mạng xã hội; nó hoạt động như một kho ký ức có tuyển chọn.

### Core Principles

1. **Ảnh là nhân vật chính:** bố cục ưu tiên bề mặt ảnh lớn, nhịp độ không đồng đều và khoảng thở hào phóng.
2. **Thông tin có trật tự:** ngày tháng, số ảnh và trạng thái Drive được hiển thị bằng metadata gọn, không lấn át câu chuyện.
3. **Cảm giác lưu trữ có sức sống:** nền giấy sáng, vết grain nhẹ, đường kẻ mảnh và chỉ dấu đánh số gợi archive nhưng tránh hoài cổ nặng nề.
4. **Thiết kế từ mobile:** grid, tiêu đề và lightbox được khởi đầu ở 360px; desktop chỉ mở rộng thêm nhịp thở và phân cấp.

### Color Philosophy

Nền **mực giấy ấm** (ivory) tạo cảm giác các ký ức được in, không phải nằm trong dashboard. Màu **xanh cobalt sâu** dùng rất tiết chế để dẫn hướng, làm điểm nhận diện và biểu thị phần tương tác. Slate/ink đậm duy trì độ tương phản cho metadata và văn bản, trong khi các điểm nhấn terracotta chỉ xuất hiện như dấu mốc thời gian.

### Layout Paradigm

Trang chủ dùng một dải intro lệch trái, sau đó các album nằm trên **đường băng lưu trữ**: mỗi card có nhịp cao thấp khác nhau, so le qua các cột và được phân cách bởi chỉ số. Đây không phải lưới card đồng đều; nó là một contact sheet mở rộng, có các block ảnh neo theo dòng đọc.

### Signature Elements

1. **Index tab cobalt:** một thẻ đứng chứa số thứ tự album xuất hiện ở mỗi card.
2. **Archive rule:** các đường kẻ hairline và mã metadata viết hoa phân tầng không gian.
3. **Frame marker:** dấu góc vuông nhỏ ở các ảnh bìa và lightbox, gợi dấu canh khung in ảnh.

### Interaction Philosophy

Tương tác phải giống như mở một ngăn lưu trữ: rõ ràng, nhẹ và không tạo bất ngờ. Hover chỉ nâng nhịp ảnh, mở album dùng điều hướng trực tiếp, lightbox luôn có nút đóng, nút tải và chỉ báo vị trí dễ chạm. Mọi thao tác cảm ứng đều có nút thay thế rõ ràng.

### Animation

Card ảnh chỉ dịch chuyển 2–4px và đổi bóng trong 180ms. Những item mới xuất hiện có fade-up theo thứ tự 45ms; lightbox mở với opacity và scale từ 0.97 trong 220ms. Không animate chiều rộng/chiều cao; tôn trọng `prefers-reduced-motion` và không dùng hiệu ứng lặp gây phân tâm.

### Typography System

**DM Serif Display** tạo tiêu đề có chất biên tập, dùng cho tên archive, tên album và lời dẫn. **Manrope** dùng cho navigation, metadata, nút và nội dung nhỏ với tracking tăng nhẹ ở chữ hoa. Tên album có thể dùng serif 32–52px tùy breakpoint; metadata dùng sans 10–12px, uppercase, letter-spacing 0.14em.

### Brand Essence

**Khoảnh Khắc là kho lưu trữ ảnh cá nhân dành cho những người muốn chia sẻ kỷ niệm bằng một trải nghiệm có tuyển chọn thay vì một feed trôi.**

Tính cách thương hiệu: **lặng, tinh tế, có tổ chức**.

### Brand Voice

Headlines nói như một ghi chú của người lưu giữ ảnh: ngắn, cụ thể và mang cảm giác quan sát. CTA mời mở hoặc xem lại thay vì bán hàng.

Ví dụ: “Những ngày được giữ lại bằng ánh sáng.”

Ví dụ: “Mở album và đi chậm một chút.”

### Wordmark & Logo

Logo là một **ký hiệu hai khung hình chồng lệch**, tạo bởi các đường cobalt dày, với một điểm terracotta đại diện cho khoảnh khắc được đánh dấu. Wordmark “KHOẢNH KHẮC” dùng DM Serif Display với kerning tùy chỉnh, đặt cạnh logo ở kích thước vừa đủ rõ.

### Signature Brand Color

**Archive Cobalt — #1F45A8**

## Style Decisions

- Trang album được triển khai như một **contact sheet mở rộng**: mỗi khung ảnh luôn có số index, metadata ngắn và dấu canh khung thay vì chỉ là gallery đều cột.
- Ảnh demo phải được đánh dấu là dữ liệu minh họa nhất quán; khi có Drive manifest, mỗi album sẽ hiển thị ảnh thật cùng một câu chuyện địa điểm của chủ website.
- Archive Cobalt chỉ dẫn dắt các hành động chính, số index, trạng thái archive và điểm điều hướng quan trọng; các CTA chính không dùng ink nếu không có lý do biên tập.
