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
- [ ] Kiểm tra điều kiện GitHub Pages và tạo link chia sẻ website từ GitHub.
- [x] Quét source và lịch sử Git để phát hiện API key, token hoặc credential trước khi public repository: không phát hiện giá trị secret theo các mẫu phổ biến; chỉ có tên biến và tham chiếu GitHub Secret.
- [x] Khắc phục lỗi 404 của đường link GitHub Pages và xác minh website chia sẻ hoạt động; link gốc có thể cần vài phút để hết cache HTML cũ.
- [x] Phân tích album Flickr mẫu để xác định cách trình bày và chuyển chế độ xem.
- [x] Thêm chế độ xem ảnh lớn, lưới ảnh nhỏ và danh sách chi tiết.
- [x] Điều chỉnh ảnh để hiển thị đủ tỷ lệ, không dùng crop cắt xén.
- [x] Kiểm thử công tắc chế độ xem trên desktop và Galaxy S20.
- [x] Xác minh folder Drive `1EyZBWqmD1s74T_Aiekw3Y-tKguwdHwhQ` có Avatar.png, Cover.png và info.txt.
- [x] Chuẩn hóa typography toàn website sang font Unicode tiếng Việt.
- [x] Đặt chế độ lưới ảnh làm mặc định cho trang album.
- [x] Thiết kế lại trang chủ dạng profile có cover, avatar, thông tin và danh mục nhiều album.
- [x] Mở rộng script đồng bộ để lấy metadata hồ sơ từ Google Drive.
- [x] Kiểm thử giao diện profile trên desktop và Galaxy S20.
- [x] Xác minh Google Tài liệu tên `info` trong folder dữ liệu và khả năng đọc nội dung qua Drive API.
- [x] Thêm reposition cover cùng cơ chế lưu vị trí metadata độc lập với ảnh Drive.
- [x] Đổi đồng bộ profile từ `info.txt` sang Google Tài liệu `info`.
- [x] Chuyển danh mục album sang danh sách gọn, có sắp xếp theo tên hoặc thời gian tạo folder.
- [x] Tinh chỉnh hệ thống giao diện profile/danh sách và kiểm thử desktop/Galaxy S20.
- [x] Tinh gọn header, profile và thay tên thương hiệu thành Thư Viện Hình Công Giáo.
- [x] Loại bỏ nhãn, mô tả, chức năng cover editor và footer thừa theo yêu cầu.
- [x] Chuẩn hóa tên album theo cách viết hoa Công giáo và gạch nối ngắn.
- [x] Thêm phân trang 5 album, làm nổi bật tìm kiếm/sắp xếp và rút gọn hàng album.
- [x] Đảm bảo mọi thumbnail/cover hiển thị đầy đủ, không crop hoặc che ảnh.
- [x] Kiểm thử không gian, căn chỉnh và responsive desktop/Galaxy S20.
- [x] Loại bỏ mọi nội dung hồ sơ do giao diện tự chèn và chỉ hiển thị nguyên văn các trường được đồng bộ từ Google Tài liệu `info`.
- [x] Kiểm thử lại profile với manifest Drive, đồng bộ GitHub Pages và xác nhận nội dung không bị diễn giải.
- [x] Đánh giá UX, cấu trúc dữ liệu và giới hạn hiệu năng hiện tại cho thư viện khoảng 2.000 thiết kế.
- [x] Đối chiếu cách tổ chức Flickr cá nhân và lập danh sách ưu tiên cải tiến cho tìm kiếm, phân loại, tải xuống và xuất bản hằng tuần.
- [x] Mở rộng manifest và sync Drive để nhận diện folder cấp một là Album Cha, folder cấp hai là Album Con.
- [x] Tạo trang Album Cha liệt kê Album Con và giữ tương thích với Album phẳng hiện có.
- [x] Kiểm thử, đồng bộ GitHub Pages và hướng dẫn quy ước folder lồng nhau.
- [x] Bảo đảm workflow Sync Google Drive albums kích hoạt phát hành GitHub Pages khi manifest thay đổi.
- [x] Chọn cơ chế an toàn để chỉ chủ website kích hoạt đồng bộ Google Drive từ giao diện.
- [x] Thêm lối kích hoạt kín, xác thực quyền và phản hồi trạng thái đồng bộ sau khi được chủ website xác nhận phương án.
- [x] Chuyển thao tác nhấn giữ 5 giây sang dòng Long Nguyen © 2026 ở footer để mở workflow Sync Google Drive albums trên GitHub.
- [x] Loại bỏ các nhãn hiển thị Album Cha/Album Con nhưng giữ nguyên điều hướng folder lồng nhau.
- [x] Thêm nút tải toàn bộ Album theo cơ chế tải gói ZIP từ Google Drive, kèm fallback an toàn nếu Drive không tạo được gói.
- [x] Thêm fallback GitHub Pages để URL Album chia sẻ trực tiếp không trả về 404.
- [x] Chuyển lối tắt đồng bộ nhấn giữ 5 giây từ Avatar sang dòng Long Nguyen © 2026 ở footer.
- [x] Chọn và triển khai lối mở link workflow đồng bộ GitHub kín, ổn định trên mobile thay cho thao tác nhấn giữ 5 giây.
- [x] Thay trigger footer bằng chuỗi chạm 7 lần liên tiếp vào Long Nguyen © 2026 để mở workflow Sync Google Drive albums.
- [x] Loại bỏ mọi ảnh render với src rỗng khi dữ liệu Drive thiếu hoặc đang tải, rồi kiểm tra lại console trang chủ.
- [x] Mở workflow đồng bộ GitHub bằng tab mới sau chuỗi chạm 7 lần, không điều hướng rời website hiện tại.
- [x] Bỏ thanh đầu trang ở Home, tăng chiều cao Cover và giữ bố cục profile gọn.
- [x] Thay dấu Thánh Giá ở trang Album bằng Avatar profile và nén phần giới thiệu Album.
- [x] Tắt lịch đồng bộ Google Drive định kỳ và chỉ giữ workflow chạy thủ công.
- [x] Nén khoảng cách quanh đường chia, section gallery và phần giới thiệu đầu mỗi Album.
- [x] Bổ sung tương tác tinh tế cho đầu Album, bộ chuyển chế độ xem và tile thiết kế.
- [x] Cập nhật Actions để không còn cảnh báo dependency Node.js 20 bị ép chạy Node.js 24.
- [ ] Đánh giá manifest hiện có để gom toàn bộ ảnh theo mốc thời gian và giữ liên kết Album nguồn.
- [ ] Thiết kế chế độ xem Dòng thời gian toàn thư viện theo nhịp quét ảnh kiểu Flickr.
- [ ] Chọn phương án để chủ website đổi folder Google Drive qua giao diện quản trị mà không sửa mã.
- [ ] Đánh giá cơ chế đăng nhập quản trị và bảo vệ password/Drive API key khỏi GitHub cùng frontend.
- [x] Lưu ngày tạo Drive gốc cho từng ảnh và mở rộng schema Timeline.
- [x] Chuyển Drive root/profile Folder ID từ workflow cố định sang GitHub Actions Variables.
- [x] Tạo route Dòng thời gian gom ảnh từ toàn bộ Album, có mốc tháng/năm và link Album nguồn.
- [x] Gắn lối vào Dòng thời gian trong giao diện thư viện và kiểm thử desktop/Galaxy S20.
- [x] Viết hướng dẫn thay Folder ID trong GitHub cho owner, kèm yêu cầu phân quyền repository.
- [x] Kiểm tra job deploy sau Sync Google Drive gây lỗi không tìm thấy pnpm.
- [x] Cố định bước cài pnpm trong workflow đồng bộ trước install/build.
- [x] Xác nhận workflow đồng bộ thủ công chạy lại thành công sau bản sửa.
- [x] Kiểm tra giá trị GitHub Variables hiện tại và source folder trong manifest mới nhất.
- [x] Đối chiếu workflow Sync gần nhất có nhận cấu hình folder Drive mới hay không.
- [x] Khôi phục đồng bộ/fetch manifest từ folder mới và xác minh website hiển thị ảnh mới.
- [x] Đọc DRIVE_ROOT_FOLDER_ID và DRIVE_PROFILE_FOLDER_ID từ Repository secrets theo cấu hình owner đã tạo.
- [x] Chạy Sync từ secrets mới và đối chiếu source folder trong manifest.
- [x] Chọn cover theo ưu tiên cover ảnh, ảnh đầu folder, rồi ảnh từ Bộ Sưu Tập con.
- [x] Bỏ qua folder công việc như PSD và File Thiet Ke, đồng thời chỉ đưa file ảnh vào manifest.
- [x] Mở rộng tìm kiếm để tìm tên Album/Bộ Sưu Tập và tên file ảnh trong toàn thư viện.
- [x] Hợp nhất hiển thị ảnh và Bộ Sưu Tập trong ba chế độ Lớn, Lưới, Danh sách.
- [x] Kiểm thử manifest Drive mới, desktop và Galaxy S20 sau khi chuẩn hóa hiển thị.
- [x] Gắn cờ ảnh Background khi tên file chứa `_BG` trong manifest Drive.
- [x] Loại ảnh `_BG` khỏi quy tắc chọn cover ở mọi cấp Album và Bộ Sưu Tập.
- [x] Thêm bộ lọc Background mặc định ẩn trên trang Album và Timeline.
- [x] Xây lại tìm kiếm sâu theo tên Album, Bộ Sưu Tập và hình ở mọi cấp, có kết quả trực tiếp.
- [x] Đồng bộ manifest và kiểm thử bộ lọc/tìm kiếm trên desktop cùng Galaxy S20.
- [x] Rà soát và làm rõ điểm chuyển giữa Xem theo Album và Xem tất cả.
- [x] Bổ sung tìm kiếm, trạng thái rỗng và bộ lọc Background trong chế độ Xem tất cả.
- [x] Bảo đảm ảnh vừa trọn chiều ngang/dọc của viewport khi mở Lightbox.
- [x] Thêm zoom in, zoom out, đặt lại zoom và toàn màn hình cho Lightbox.
- [x] Kiểm thử thao tác chuột, bàn phím và chạm trên desktop/Galaxy S20.
- [x] Chẩn đoán vùng hiển thị Lightbox làm mất chiều cao của ảnh.
- [x] Buộc chế độ mặc định chứa trọn ảnh theo cả chiều ngang và dọc.
- [x] Chỉ cho phép cắt khung khi người xem chủ động phóng to, kèm nút Vừa Ảnh.
- [x] Kiểm thử ảnh ngang và dọc trên desktop/Galaxy S20 trước khi phát hành.
- [x] Đo vùng Lightbox desktop sau khi trừ thanh tiêu đề, công cụ và footer.
- [x] Giới hạn chiều cao ảnh mặc định theo vùng nhìn desktop thực tế.
- [x] Kiểm tra lại ảnh ngang và dọc trên desktop không còn khuất phía dưới.
- [x] Tăng chiều cao ảnh bìa trang chủ ở breakpoint desktop.
- [x] Kiểm tra ảnh bìa vẫn cân đối và không ảnh hưởng Galaxy S20.
- [x] Điều chỉnh chiều cao ảnh bìa trang chủ desktop từ 365px về 340px.
- [x] Rà soát toàn bộ luồng Album, Xem tất cả và trình xem ảnh trên desktop/Galaxy S20.
- [x] Đánh giá nhận diện, bố cục, typography, tương tác, responsive, accessibility và hiệu năng.
- [x] Soạn báo cáo ưu tiên cải tiến với khuyến nghị thực hiện cụ thể.

## Chuẩn hóa tên hiển thị theo quy ước Drive

- [x] Khảo sát schema manifest và toàn bộ vị trí hiển thị tên Album/thiết kế.
- [x] Xây dựng bộ phân tích tên cho Chúa Nhật, mùa phụng vụ, ngày lễ, tuần lễ và hậu tố Long Nguyen.
- [x] Áp dụng tên chuẩn hóa mà không thay đổi tên nguồn, slug hay URL tải từ Drive.
- [x] Kiểm thử các tên mẫu trên desktop, Galaxy S20 và GitHub Pages.

## Cấu hình quy ước và danh sách Lễ

- [x] Hoàn tất phân tích danh sách Lễ, mùa và cách ghi số La Mã/số thường từ tài liệu owner.
- [x] Tạo file cấu hình quy ước có thể sửa trên GitHub, gồm alias và danh sách Lễ theo ngày.
- [x] Tích hợp cấu hình vào lớp chuẩn hóa tên và tìm kiếm mà không đổi dữ liệu Drive gốc.
- [x] Kiểm thử tên Lễ, tải cấu hình và giao diện desktop/Galaxy S20 trước khi phát hành.

## Phân loại và lọc phụng vụ thông minh

- [x] Khảo sát tên file Drive hiện có để xác định mùa, tuần, Các Thánh, Đức Mẹ và ngôn ngữ.
- [x] Mở rộng file cấu hình cho `_Eng`/`_ENG`, Các Thánh và Đức Mẹ.
- [x] Tạo metadata phụng vụ cùng chỉ mục tìm kiếm viết tắt cho từng ảnh.
- [x] Thêm bộ lọc Mùa, Tuần, Các Thánh, Đức Mẹ và hiển thị metadata trong chế độ Danh Sách.
- [x] Kiểm thử desktop, Galaxy S20, tìm kiếm, hiệu năng và phát hành GitHub Pages.

## Sửa nhận diện Đức Mẹ và Các Thánh

- [x] Bổ sung alias `CN_DMMC` cho Chúa Nhật Lễ Đức Mẹ Mân Côi.
- [x] Siết nhận diện Đức Mẹ để tên Các Thánh có “Maria” không bị đưa nhầm vào bộ lọc.
- [x] Thêm kiểm thử hồi quy cho toàn bộ ví dụ owner cung cấp.
- [x] Kiểm tra bộ lọc, build và phát hành GitHub Pages.

## Tra cứu Lễ và Năm Phụng Vụ

- [x] Khảo sát quy ước ảnh Các Thánh theo ngày, Năm A/B/C và cấu trúc danh mục Lễ tham chiếu.
- [x] Mở rộng metadata/cấu hình cho Các Thánh theo `MM_DD` và Năm A/B/C.
- [x] Xây dựng trang tra cứu Danh sách Lễ với mục neo và vùng hiển thị nội dung tương ứng.
- [x] Tích hợp lọc Năm A/B/C, tìm kiếm và liên kết từ thư viện sang tra cứu Lễ.
- [x] Kiểm thử desktop, Galaxy S20, điều hướng neo, build và phát hành Pages.

## Gỡ Chế độ 03 Danh Sách Lễ

- [x] Xác định toàn bộ route, điều hướng và tài liệu thuộc Chế độ 03.
- [x] Loại bỏ trang, route và lối vào Danh Sách Lễ khỏi website.
- [x] Kiểm thử lại Xem theo Album và Xem tất cả trên desktop/Galaxy S20.
- [x] Phát hành điều hướng hai chế độ đã tinh gọn lên GitHub Pages.

## Nhận diện trang hình cá nhân

- [x] Rà soát nhãn trang đầu, mô tả Xem tất cả và lối điều hướng cuối trang không phù hợp.
- [x] Bỏ nhận diện “Thư Viện Hình Công Giáo” và nội dung giải thích kỹ thuật khỏi giao diện.
- [x] Thay lối điều hướng cuối trang bằng ngữ cảnh phù hợp với trang hình cá nhân.
- [x] Kiểm thử desktop, Galaxy S20 và phát hành GitHub Pages.

## Nhãn tải trong trình xem ảnh

- [x] Xác định và đổi nhãn “Tải thiết kế” thành “Tải xuống”.
- [x] Kiểm thử trình xem ảnh, build và phát hành GitHub Pages.

## Tải nhiều hình và toàn Album

- [x] Rà soát chức năng tải từng hình và tải toàn Album/folder hiện có.
- [x] Thiết kế thao tác chọn nhiều hình, chọn tất cả và hủy chọn phù hợp desktop/Galaxy S20.
- [x] Thêm tải xuống nhiều hình và làm rõ nút tải toàn Album/folder.
- [x] Kiểm thử thao tác tải, build và phát hành GitHub Pages.

## Đánh giá trải nghiệm theo hai chân dung người dùng

- [x] Lập hành trình thử dùng cho người rành công nghệ và người lớn tuổi lần đầu sử dụng.
- [x] Thử tìm ảnh, mở Album, xem ảnh và tải xuống trên desktop lẫn Galaxy S20.
- [x] Tổng hợp điểm tốt, trở ngại và khuyến nghị ưu tiên.

## Chế độ Theo thư mục kiểu Explorer

- [x] Rà soát dữ liệu Album/Bộ Sưu Tập, Home, AlbumPage và CSS để lập bản đồ thay đổi.
- [x] Đổi thuật ngữ và thiết kế chế độ Theo thư mục, giữ Xem tất cả tập trung vào ảnh.
- [x] Tạo biểu tượng thư mục có ảnh hé bên trong, chế độ biểu tượng và chế độ chi tiết.
- [x] Cập nhật điều hướng, tìm kiếm và tải Thư mục mà không ảnh hưởng Lightbox/Xem tất cả.
- [x] Kiểm thử desktop, Galaxy S20, build và phát hành GitHub Pages.

## Tinh chỉnh biểu tượng Thư mục

- [x] Rà soát tỷ lệ biểu tượng và lớp ảnh xem trước đang gây cảm giác thô/rối.
- [x] Chuyển biểu tượng Thư mục sang dạng gọn, tĩnh, không xoay hoặc dịch chuyển ảnh bên trong.
- [x] Kiểm thử desktop, Galaxy S20, build và phát hành bản tinh chỉnh.

## Hoàn thiện trải nghiệm duyệt Thư mục

- [x] Đặt chế độ Chi tiết làm mặc định tại trang gốc và mọi cấp Thư mục.
- [x] Dùng một biểu tượng folder cân đối, không hiển thị ảnh xem trước, ở mọi kiểu xem và mọi cấp.
- [x] Cho tên Thư mục dài hiển thị tối đa hai hàng thay vì cắt một hàng.
- [x] Rà soát và cải thiện trạng thái tải khi mở Thư mục để tránh khoảng trống chờ khó hiểu.
- [x] Kiểm thử desktop, Galaxy S20, build và phát hành GitHub Pages.

## Phản hồi tiến trình tải ZIP

- [x] Rà soát thông báo khi tải nhiều ảnh và tải Thư mục.
- [x] Hiển thị rõ trạng thái chuẩn bị và số yêu cầu tải đã gửi/tổng số.
- [x] Kiểm thử desktop, Galaxy S20, build và phát hành GitHub Pages.

## Cơ chế tải nhiều ảnh đáng tin cậy

- [x] Xác minh giới hạn CORS của Google Drive khi ghép ZIP trực tiếp trong trình duyệt.
- [x] Chọn phương án tải nhiều ảnh/Thư mục tương thích GitHub Pages.
- [x] Thay luồng tải ZIP không hoạt động và kiểm thử tải thật trên trình duyệt.

## Tải nhiều hình trực tiếp từ Drive

- [x] Bỏ luồng ZIP và tải từng hình theo hàng đợi trực tiếp từ Drive.
- [x] Hiển thị số ảnh đã gửi tải/tổng số, trạng thái trình duyệt và thông báo hoàn tất.
- [x] Chỉ cho phép chọn nhiều hình; Thư mục chỉ có thao tác tải lần lượt toàn bộ hình.
- [x] Đổi nhãn thành “Chọn nhiều hình” và bỏ số lượng Thư mục ở các màn hình duyệt.
- [x] Kiểm thử desktop, Galaxy S20, build và phát hành GitHub Pages.

## Đồng bộ Drive và mở rộng quy ước phụng vụ

- [x] Rà soát các alias, quy tắc metadata và kiểm thử chuẩn hóa hiện có.
- [x] Bổ sung các tên Lễ, Mùa, Chúa Nhật và Các Thánh mới vào cấu hình quy ước.
- [x] Chạy Sync Google Drive albums và xác minh manifest cập nhật.
- [x] Kiểm thử tên hiển thị, tìm kiếm tự nhiên/viết tắt, bộ lọc và build.
- [x] Phát hành GitHub Pages với dữ liệu Drive và quy tắc mới.

## Làm rõ nội dung trong Thư mục

- [x] Bỏ số trang trí mờ, lớn tại phần đầu Thư mục.
- [x] Thiết kế nhãn/phân cách Thư mục con và File hình thống nhất.
- [x] Áp dụng phân nhóm trong biểu tượng lớn, biểu tượng nhỏ và chi tiết.
- [x] Kiểm thử Thư mục có cả thư mục con lẫn hình trên desktop và Galaxy S20.
- [x] Build và phát hành GitHub Pages.

## Chuẩn hóa hậu tố LN và quy ước mới

- [x] Đổi hậu tố `_LN`, `_LN1`, `_LN2`… thành LN, LN1, LN2… trong tên hiển thị.
- [x] Bổ sung quy ước Vọng Phục Sinh, Bài Đọc, Lễ Lá, ngày trong tuần và các tên Tết.
- [x] Quét manifest để thống kê các từ viết tắt/tên viết liền chưa có quy ước.
- [x] Kiểm thử chuẩn hóa tên, tìm kiếm và giao diện.
- [x] Phát hành GitHub Pages và bàn giao danh sách cần xác nhận.

## Tối ưu tìm kiếm, Lightbox và hồ sơ trang đầu

- [x] Rà soát vị trí tìm kiếm/bộ lọc, xử lý truy vấn và phần chân Lightbox.
- [x] Gộp bộ lọc vào giao diện gọn, thêm độ trễ tìm kiếm khi gõ.
- [x] Hiển thị đường dẫn và nút Xem Thư mục trong Lightbox.
- [x] Tái bố cục cover-avatar-tên trang đầu, tăng khoảng thở và giảm chiều cao chiếm chỗ.
- [x] Kiểm thử desktop, Galaxy S20, tìm kiếm, Lightbox, build và phát hành.

## Bổ sung quy ước tên Lễ, Thánh và ngày tháng

- [x] Rà soát quy tắc ngày đầu tên file dạng `MM/DD` và biến thể `MM_DD_Thanh`.
- [x] Bổ sung alias cho chức danh Thánh, Lễ, Mùa, ngày trong tuần và hậu tố mới được cung cấp.
- [x] Mở rộng kiểm thử hồi quy để xác nhận tên hiển thị, metadata và tìm kiếm.
- [x] Đối chiếu manifest thật, kiểm tra build và phát hành GitHub Pages.

## Đồng bộ hai cách xem và lưới Xem tất cả

- [x] Rà soát cấu trúc Home, Xem tất cả và điều hướng để xác định các nhãn giới thiệu/phân loại dư.
- [x] Dùng chung cụm cover-avatar-hồ sơ cho cả hai cách xem.
- [x] Đặt Xem tất cả là trang mở đầu, giữ Theo thư mục là lựa chọn chuyển đổi rõ ràng.
- [x] Đưa mọi ô ảnh Xem tất cả về một kích thước đồng đều, không còn ảnh neo phóng lớn.
- [x] Kiểm thử desktop, Galaxy S20, điều hướng, build và phát hành GitHub Pages.

## Đồng nhất cụm hồ sơ, điều hướng và chi tiết Thư mục

- [x] Đảo vị trí nút hai cách xem để Xem tất cả mặc định xuất hiện trước.
- [x] Gom tìm kiếm và kiểu xem của Theo thư mục trên một hàng, bỏ nhãn “Kiểu xem”.
- [x] Bỏ cột Kích thước khỏi chế độ Chi tiết để ưu tiên tên Thư mục.
- [x] Dùng chung cover–avatar trên các trang Thư mục con và tinh gọn thanh thao tác ở đó.
- [x] Kiểm thử desktop, Galaxy S20, build và phát hành GitHub Pages.

## Tinh gọn đầu trang Thư mục

- [x] Rà soát phần tiêu đề Thư mục đang giới hạn chiều rộng và biểu tượng điều hướng dư.
- [x] Mở rộng tiêu đề theo chiều ngang, cân lại phân cấp nội dung và nút tải.
- [x] Thay biểu tượng Thánh Giá bằng lối “Trở về Trang Chủ”.
- [x] Kiểm thử desktop, Galaxy S20, build và phát hành GitHub Pages.
