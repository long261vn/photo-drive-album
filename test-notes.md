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

## 2026-08-25 — Đồng bộ Drive thủ công

Đã gỡ trigger `schedule` khỏi workflow `Sync Google Drive albums`. Workflow chỉ còn `workflow_dispatch`, do đó chỉ chạy khi chủ website bấm Run workflow trực tiếp trong GitHub hoặc mở workflow bằng lối tắt 7 lần chạm ở footer.

## 2026-08-25 — Album compact và phản hồi tương tác

Trang Album `cn20-tn-a` đã được nén thêm ở phần đầu, đường chia và trước gallery: desktop giữ tiêu đề rõ ràng nhưng đưa hàng ảnh lên gần hơn; Galaxy S20 vẫn có vùng chạm đủ rộng, không tràn ngang và không cắt hình. Các tile ảnh nay nổi nhẹ, viền xanh lá và bóng mờ khi hover/focus; nút quay lại, nút tải, bộ chuyển chế độ xem và các dòng danh sách cũng có phản hồi trạng thái ngắn, tôn trọng `prefers-reduced-motion`.

Các workflow đã đổi `actions/checkout`, `actions/setup-node`, `pnpm/action-setup` và `actions/upload-pages-artifact` sang các bản dùng Node.js 24 cho runtime action; bước build website vẫn cố định Node.js 22. Kiểm thử `pnpm check`, `GITHUB_PAGES=true pnpm build` và `git diff --check` đều thành công. Workflow GitHub Pages `32801268852` đã build/deploy thành công; log build xác nhận không còn cảnh báo `Node.js 20 is deprecated`.

## 2026-08-25 — Dòng thời gian và cấu hình folder Drive

Đã thêm route `/timeline`, gom 21 ảnh từ toàn bộ Album theo ngày tạo Google Drive, sắp mới nhất trước, chia mốc tháng/năm, có lightbox và nút mở Album nguồn. Kiểm thử ảnh chụp ở desktop 1280px lẫn Galaxy S20 360×800 cho thấy grid, cột mốc thời gian, nhãn ngày và vùng chạm không tràn ngang. GitHub Pages workflow `32802397967` build/deploy thành công; mở trực tiếp `/timeline` hoạt động và nút Album nguồn đưa về đúng `/album/cn21-tn-a`.

Script đồng bộ nay ghi `createdAt`/`modifiedAt` từng ảnh. Workflow ưu tiên `DRIVE_ROOT_FOLDER_ID` và `DRIVE_PROFILE_FOLDER_ID` từ GitHub Actions Variables, nhưng giữ ID hiện tại làm fallback đến khi chủ repository tự tạo Variables trong GitHub. Việc tạo/chỉnh Variables cần quyền owner hoặc write của repository; API key vẫn chỉ ở GitHub Secret và không xuất hiện trong frontend.

## 2026-08-25 — Khắc phục pnpm trong Sync Google Drive

Lượt Sync `32804331298` lỗi tại bước `actions/setup-node@v5`: cơ chế package-manager cache tự động nhận diện `pnpm` từ `package.json`, dù job `sync` chỉ chạy script Node và chưa cài pnpm. Đã đặt `package-manager-cache: false` riêng cho job `sync`; job `deploy-pages` vẫn cài pnpm trước khi cache/install/build. Lượt chạy thủ công `32804476777` sau bản sửa đã thành công cả job `sync` và `deploy-pages`, đồng thời sinh manifest mới có `createdAt`/`modifiedAt` cho từng ảnh.

## 2026-08-25 — Folder Drive từ Repository secrets

Khi owner tạo `DRIVE_ROOT_FOLDER_ID` và `DRIVE_PROFILE_FOLDER_ID` trong tab Repository secrets, workflow trước đó vẫn đọc `vars`, nên dùng fallback folder cũ. Workflow đã đổi sang `secrets.DRIVE_ROOT_FOLDER_ID` và `secrets.DRIVE_PROFILE_FOLDER_ID`, không còn fallback để tránh đồng bộ nhầm nguồn. Lượt Sync `32805964409` thành công cả `sync` và `deploy-pages`; manifest hiện ghi root ID `1A50RPh0VKKkc2nmOrNzw5GwTawKNVyRn`. Website công khai đã xác minh nhận dữ liệu mới: 141 Album và 4.732 thiết kế.

## 2026-08-25 — Album hợp nhất và lọc nội dung Drive

Sau Sync `32807241144`, manifest không còn folder `PSD`/`Fonts` hay tệp `image/psd`; còn 359 Album/Bộ Sưu Tập hợp lệ và 3.293 ảnh hiển thị. Parent `14-dangthanhgia-ln-2025` đã nhận cover đệ quy từ Bộ Sưu Tập con. Kiểm tra desktop và Galaxy S20 cho Album chỉ có Bộ Sưu Tập xác nhận tile folder, cover, thứ tự và ba nút xem không tràn ngang. Kiểm tra Album hỗn hợp `le-phong-thanh-elena-guerra` xác nhận Lưới và Danh sách hiển thị chung folder trước, ảnh sau; folder có nhãn Bộ Sưu Tập/Mở, ảnh có phân loại Hình Ảnh/Tải.

Tìm kiếm trang chủ bằng tên file `Mockup` trả về Album `Le Phong Thanh Elena Guerra` dù từ khóa không nằm trong tên Album, đồng thời giữ các Album khác có ảnh cùng tên. Ô tìm kiếm hiện gợi rõ “Tìm Album hoặc tên hình”.

## 2026-08-25 — Background `_BG` và tìm kiếm sâu

Sync `32809093170` hoàn tất với 1.321 ảnh được gắn `isBackground: true`. Kiểm tra Album `anre-phu-yen` xác nhận cover chuyển từ ảnh `LN BG` sang ảnh không phải Background `LN GX NamBan`. Album mặc định chỉ hiển thị 2/3 ảnh và nút **Hiện BG**; sau khi bấm, ảnh `LN BG` xuất hiện, số mục tăng thành 3 và nút đổi thành **Ẩn BG**.

Tìm kiếm sâu `Hinh 50x70cm` trả về riêng Bộ Sưu Tập con `Hinh 50x70cm` và ảnh `Thanh Elena Guerra LN 50x70cm` bên trong nó. Mỗi kết quả hiển thị loại nội dung, Album nguồn và nút mở đúng Album/Bộ Sưu Tập.

## 2026-08-25 — Hai chế độ xem và tìm kiếm toàn thư viện

Đã thêm hai lựa chọn ngang hàng, có nhãn Chế độ 01/02: **Xem theo Album** và **Xem tất cả**. Xem tất cả tải gọn 80 thiết kế đầu tiên thay vì render toàn bộ thư viện ngay lập tức. Kiểm tra tìm kiếm `Gioan Euđe` trong Xem tất cả trả về đúng 2 thiết kế ở tháng 08/2026 và 08/2025, kèm Album nguồn. Bộ lọc Background vẫn áp dụng trong chế độ này.

Lightbox được kiểm tra từ Xem tất cả với ảnh ngang: ở tỷ lệ 100% ảnh vừa trọn vùng nhìn theo cả chiều ngang lẫn chiều dọc; nút phóng to tăng chính xác đến 150%; nút toàn màn hình đổi trạng thái thành “Thoát toàn màn hình”. Công cụ Thu nhỏ, Đặt lại tỷ lệ, Phóng to, Toàn màn hình, ảnh trước/sau và Tải được nhận diện đầy đủ.

Kiểm tra Lightbox từ Album ở kích thước Galaxy S20 cho thấy ảnh ngang được chứa trọn trong vùng xem ở tỷ lệ 100%, không cắt nội dung; hàng công cụ Zoom/Đặt lại/Toàn màn hình/Đóng, điều hướng trước-sau và tải vẫn hiển thị cùng lúc, có nhãn truy cập được.

## 2026-08-25 — Khung Vừa ảnh không cắt mép

Đã đổi khung Lightbox mặc định sang canvas `width: 100%` và `height: 100%` với `object-fit: contain`; ở tỷ lệ mặc định, khung không còn clip overflow. Overflow chỉ bật khi người xem chủ động zoom lớn hơn 100%. Kiểm tra lại ảnh ngang `07 26 ChanPhuoc AnrePhuYen LN GX NamBan` xác nhận đủ toàn bộ chiều ngang và chiều dọc, nút trạng thái hiển thị rõ **Vừa ảnh**.

Kiểm tra thêm ảnh dọc `1` trong Album `14 CHẶNG ĐÀNG THÁNH GIÁ NĂM THÁNH 2025` xác nhận ảnh được thu vừa theo chiều cao của vùng xem, giữ nguyên toàn bộ phần đầu và chân ảnh ở trạng thái **Vừa ảnh**.

## 2026-08-25 — Vùng an toàn Lightbox desktop

Trên desktop, khung ảnh nay bị giới hạn còn `100dvh - 196px`, chừa không gian cố định cho tiêu đề, các công cụ và footer. Kiểm tra lại ảnh dọc Đàng Thánh Giá cho thấy toàn bộ phần đầu, chân ảnh và footer cùng nằm trong một viewport; không còn hiện tượng phần đáy ảnh bị khuất.

## 2026-08-24 — Tải Toàn Bộ Album và nhãn gọn

Đã gỡ các chuỗi giao diện `Album Cha` và `Album Con`; các folder lồng nhau được trình bày trung tính là `Bộ Sưu Tập`, vẫn giữ toàn bộ điều hướng cũ. Script chỉ nhận một file `.zip` đặt trong cùng folder làm gói tải toàn Album, không đưa ZIP vào gallery. Kiểm thử cục bộ trên viewport 360×800 xác nhận nút `Tải Toàn Bộ Album` hiện đúng khi có metadata ZIP, đồng thời nhãn cũ không còn xuất hiện. Manifest Drive thật đã được khôi phục sau kiểm thử.

## 2026-08-24 — URL Album chia sẻ trực tiếp

Đã phát hiện và sửa fallback GitHub Pages cho route sâu. Trước bản sửa, URL `/album/cac-thanh` trả về trang 404 của GitHub Pages khi mở trực tiếp. Sau phát hành, cùng URL mở đúng trang `Các Thánh`, hiển thị `Bộ Sưu Tập` và không còn nhãn phân cấp cũ.

## 2026-08-26 — Nhãn tải trình xem ảnh

Đã đổi nhãn nút tải ở footer của Lightbox từ **Tải thiết kế** thành **Tải xuống**. Thuộc tính `href`, việc mở liên kết tải ở tab mới và các điều khiển xem ảnh khác không thay đổi. TypeScript đã kiểm tra thành công; toàn bộ mã nguồn `client/src` không còn nhãn cũ.

## 2026-08-26 — Chọn nhiều hình và tải Folder

Trang Album có nút **Chọn nhiều** ở thanh thao tác. Khi bật, mỗi ảnh trực tiếp trong Album có dấu chọn; bấm lại ảnh sẽ chọn/bỏ chọn thay vì mở Lightbox. Thanh thao tác cho phép **Chọn tất cả**, **Bỏ chọn**, **Tải xuống (N)** và đóng chế độ chọn. Các ảnh được tải tuần tự từ URL Drive rồi đóng gói vào một file ZIP trên trình duyệt; bài kiểm thử `scripts/verify-batch-download.mts` đã tải ảnh Drive mẫu 3.914.662 bytes và xác nhận ZIP chứa được ảnh đó.

Nút **Tải Folder** dùng file ZIP đã chuẩn bị sẵn trong Drive nếu manifest có `downloadAll`; nếu không, website tạo ZIP gồm toàn bộ ảnh trong Album và các Bộ Sưu Tập lồng nhau. Folder trên 75 ảnh có hộp xác nhận trước khi tải. Đã kiểm tra bố cục nút tải Folder, Chọn nhiều, các chế độ xem và bộ lọc ở desktop 1280×720 cùng Galaxy S20 360×800: không có tràn ngang; TypeScript, build Pages và kiểm tra diff đã chạy thành công.

## 2026-08-27 — Theo thư mục kiểu Explorer

Đã thử bản xem trước ở trang gốc. Ba kiểu xem **Biểu tượng lớn**, **Biểu tượng nhỏ** và **Chi tiết** đều hiển thị, đổi trạng thái bằng nút tương ứng và giữ được danh sách 24 Thư mục/phân trang. Kiểu **Chi tiết** xác nhận có folder đóng, tên, ngày, loại “Thư mục” và thông tin số Thư mục con/hình; các hàng là nút mở Thư mục có nhãn trợ năng đầy đủ. Bố cục desktop hiển thị Thư mục, thanh tìm kiếm, bộ lọc và các kiểu xem không tràn ngang.

Trong một Thư mục có hai Thư mục con, thao tác từ hàng Chi tiết mở đúng nội dung con. Ở kiểu **Biểu tượng lớn**, hai Thư mục con dùng biểu tượng folder mở với các hình nằm bên trong; chuyển sang **Chi tiết** thay chúng bằng folder đóng, tên, loại Thư mục, số hình và nút Mở. Nút quay về đã đổi thành “Thư mục gốc” hoặc “Quay lại” theo ngữ cảnh.

Thư mục con `CN22...` có 11 file hình trực tiếp vẫn hiển thị đúng các nút **Tải Thư mục**, **Chọn nhiều**, **Hiện nền** và ba kiểu xem. Từng file có nhãn trợ năng “Mở hình…”, do đó không bị nhầm với Thư mục và có thể tiếp tục mở Lightbox/tải như trước.

## 2026-08-27 — Biểu tượng Thư mục tĩnh

Theo phản hồi trực tiếp, biểu tượng Thư mục đã được thu gọn, bỏ hoàn toàn thumbnail thứ ba và mọi phép xoay/dịch chuyển. Biểu tượng chỉ còn hai ảnh đứng yên nằm ngay ngắn trong folder, không có animation; khung folder gọn hơn ở desktop lẫn Galaxy S20. Kiểm tra TypeScript, `git diff --check`, desktop 1280 × 720 và Galaxy S20 360 × 800 đều thành công.

## 2026-08-27 — Chi tiết mặc định và mở Thư mục

Chế độ **Chi tiết** hiện được chọn mặc định tại Thư mục gốc, Thư mục mẹ và Thư mục con. Biểu tượng folder đóng thống nhất được dùng trong mọi ngữ cảnh, không còn đưa hình ảnh bên trong vào biểu tượng. Tên Thư mục dài hiển thị tối đa hai hàng trong danh sách gốc, Thư mục con, biểu tượng thay thế và kết quả tìm kiếm.

Đã mở trang gốc rồi mở Thư mục đầu tiên: nội dung Thư mục xuất hiện ngay với hai Thư mục con ở chế độ Chi tiết, thay vì hiện phần giới thiệu trống rồi mới xuất hiện danh sách. Manifest được giữ trong bộ nhớ trong lúc người xem duyệt nội bộ; khi tải thẳng một URL Thư mục, màn hình “Đang chuẩn bị nội dung…” có chủ đích sẽ thay phần danh sách không hoàn chỉnh cho đến khi dữ liệu thật sẵn sàng.

## 2026-08-27 — Tiến trình tải ZIP

Trong Thư mục có 11 hình, đã bật **Chọn nhiều** và xác nhận thanh thao tác hiển thị rõ số hình đã chọn, **Chọn tất cả**, **Bỏ chọn** và nút **Tải xuống (0)** đang vô hiệu khi chưa chọn ảnh. Luồng ZIP hiện được cập nhật để thông báo rõ các bước chuẩn bị, tải lần lượt từng hình từ Drive, đóng gói ZIP và tạo tệp tải về.

## 2026-08-27 — Tải nhiều hình trực tiếp

Đã thay hoàn toàn cơ chế ZIP không tương thích CORS bằng hàng đợi tải trực tiếp từ Drive. Trong Thư mục thử nghiệm, nút chính hiện ghi **Tải Thư mục (17)** vì gồm cả ảnh ở Thư mục con; chế độ **Chọn nhiều hình** chỉ đặt dấu chọn trên 11 file ảnh trực tiếp, không đặt trên Thư mục. Khi chưa chọn, nút **Tải từng hình (0)** bị vô hiệu; điều này xác nhận giới hạn chọn nhiều chỉ áp dụng cho ảnh.

Đã chọn một hình, bấm **Tải từng hình (1)** và xác nhận trang giữ nguyên vị trí, thoát chế độ chọn, đồng thời thông báo **“Đã gửi yêu cầu tải 1 hình. Hãy kiểm tra danh sách tải xuống của trình duyệt.”**. Không còn lỗi CORS do đọc file để ghép ZIP.

Đã kiểm tra `chrome://downloads`: file **`CN22_TN_A_LN1_Eng.jpg`** xuất hiện trong lịch sử tải xuống. Điều này xác nhận yêu cầu tải trực tiếp được trình duyệt nhận mà không điều hướng rời trang Thư mục.

Trên desktop 1280 × 720 và Galaxy S20 360 × 800, nút **Tải Thư mục (17)**, **Chọn nhiều hình**, trạng thái tải và các hàng file đều hiển thị không tràn ngang. Số Thư mục đã được gỡ khỏi phần thống kê trang chủ, thẻ Thư mục và phần giới thiệu Thư mục; số lượng hình vẫn giữ ở nơi phục vụ thao tác tải.

## 2026-08-27 — Quy ước phụng vụ và đồng bộ Drive

Workflow **Sync Google Drive albums** đã hoàn tất thành công; manifest thay đổi 32 dòng thêm và 5 dòng xóa. Trên dữ liệu thật, danh sách Thư mục hiện hiển thị đúng các tên mới gồm **Chúa Nhật Mình Máu Chúa Năm A**, **Chúa Nhật Chúa Thánh Thần Hiện Xuống**, **Chúa Thăng Thiên**, **Lòng Chúa Thương Xót**, **Lễ Lá - Tuần Thánh - Phục Sinh - 2026** và **Tuần 05 Mùa Chay**.

Đã tìm “Lòng Chúa Thương Xót” ở trang Theo thư mục và nhận 15 kết quả, gồm Thư mục, Thư mục con và các hình liên quan; các nút **Mở thư mục** / **Xem ảnh** phân biệt đúng loại kết quả. Bộ kiểm thử tự động xác nhận 59 mẫu tên, gồm toàn bộ quy ước mới, cùng metadata/bộ lọc Các Thánh, Đức Mẹ và năm phụng vụ.

## 2026-08-27 — Phân nhóm nội dung Thư mục

Đã kiểm tra Thư mục `RuocLeLanDau` có đồng thời một Thư mục con và file hình. Số mã mờ, lớn ở phần đầu đã được gỡ hoàn toàn. Ở **Chi tiết** và **Biểu tượng lớn**, hai phần **Thư mục con** và **File hình** hiển thị bằng tiêu đề riêng, đường phân cách riêng, thứ tự Thư mục trước file hình; từng hàng/tile vẫn mở đúng nội dung tương ứng.

Đã chuyển sang **Biểu tượng nhỏ** và xác nhận hai tiêu đề nhóm vẫn được giữ. Kiểm tra Galaxy S20 360 × 800 với cả Thư mục hỗn hợp và Thư mục mẹ: tên dài xuống hàng tự nhiên, phần Thư mục con nằm trước, File hình được tách sau đường phân cách và không còn số mờ trang trí.

## 2026-08-27 — Hậu tố LN và quy ước Vọng Phục Sinh/Tết

Đã xác nhận 74 mẫu chuẩn hóa, bao gồm hậu tố `LN`, `LN1`, `LN2`… giữ nguyên dạng ngắn và không tự chèn “Long Nguyen”. Thử tìm `LN1` trên bản xem trước trả về 506 kết quả; tiêu đề hiển thị `LN1`/`LN10` đúng dạng gọn. Các quy ước Vọng Phục Sinh, Bài Đọc 3/3b, Exsultet, Thánh Thư, Lễ Lá, ngày trong tuần và Tết đều được kiểm thử bằng mẫu tên độc lập.

Công cụ rà soát đã gom các biến thể `LN`/`BG`/`Eng` và lập báo cáo gồm **178 nhóm tên** còn có mã viết tắt hoặc chữ viết liền cần xác nhận thêm. TypeScript và kiểm tra diff đã hoàn tất thành công.

## 2026-08-27 — Tìm kiếm gọn, hồ sơ và đường dẫn ảnh

Trang đầu desktop nay đặt ô tìm kiếm lớn và nút **Tùy chọn** cạnh nhau; sắp xếp, nền và bộ lọc phụng vụ nằm trong bảng mở rộng thay vì chiếm nhiều dòng mặc định. Trên Galaxy S20, cover-avatar-tên-thống kê không còn chồng lên nhau; số hình được đưa xuống hàng riêng, còn ô tìm kiếm và nút Tùy chọn vừa đủ vùng chạm.

Trong Lightbox của Thư mục `Rước Lễ Lần Đầu`, phần chân hiển thị nhãn **Đường dẫn**, tên Thư mục, tháng/năm và hai nút **Xem Thư mục** / **Tải xuống**. Bấm **Xem Thư mục** đã đóng Lightbox, giữ người xem tại danh sách ảnh của Thư mục hiện tại. Tìm kiếm có độ trễ 260 ms trước khi lọc kho dữ liệu nhằm tránh tính lại kết quả ở từng ký tự.

Khi nhập `Lòng Chúa Thương Xót`, ô tìm hiện nhãn **Đang tìm** trong lúc dữ liệu còn giữ danh sách cũ, sau đó thay bằng kết quả phù hợp sau khoảng dừng gõ. Nhờ vậy, việc nhập không tạo cảm giác giao diện nhảy theo từng ký tự.

Từ kết quả tìm kiếm, Lightbox của ảnh **Chúa Nhật Thứ 02 Phục Sinh - Năm A - Bài Đọc 1** ghi đúng Thư mục nguồn là **Chúa Nhật Thứ 02 Phục Sinh Lòng Chúa Thương Xót — 04.2026**. Nút **Xem Thư mục** đóng lớp xem ảnh và mở đúng danh sách 13 file hình của Thư mục con tương ứng.

Trang **Xem tất cả** giữ một ô tìm kiếm và chỉ một nút **Lọc**, còn Background và bộ lọc phụng vụ nằm trong panel gọn. Lightbox của hình đầu tiên trên Dòng thời gian hiển thị đủ đường dẫn; nút **Xem Thư mục** đóng ảnh và chuyển đúng tới Thư mục `Chúa Nhật Thứ 22 Thường Niên - Năm A và Tuần 22 Thường Niên từ 30/08 đến 05/09`.

## 2026-08-27 — Quy ước tên Lễ, Thánh và ngày tháng bổ sung

Đã bổ sung các alias mới cho chức danh Thánh, Cung Hiến Thánh Đường, Lễ Vọng, Thiếu Nhi, Lòng Chúa Thương Xót, Đức Mẹ Mân Côi, Chúa Chịu Phép Rửa, Chúa Thánh Thần Hiện Xuống, Lễ Lá, Tháng Mân Côi, Khánh Nhật Truyền Giáo, Lễ Tro, Tuần Thánh, Lễ Truyền Dầu, Chia Sẻ, Tuần Bát Nhật Phục Sinh và Trung Thu. Tên ngày đầu file nay nhận cả dạng `MM_DD` lẫn `MM/DD` và hiển thị theo `DD/MM`; mã `Thu_2`–`Thu_7` cùng `_NamA`–`_NamC` cũng tạo metadata đúng.

Bộ kiểm thử hồi quy đã xác nhận **112** mẫu tên. Tìm `CungHien` trực tiếp trên manifest Drive cho **16** kết quả, trong đó các tên hiển thị là **Cung Hiến Thánh Đường** và ngày được hiển thị đúng `09/11`, `09/12`. Báo cáo tên còn cần xác nhận giảm từ 178 xuống **42 nhóm** sau khi loại các quy ước vừa hoàn tất.

## 2026-08-26 — Trang hình cá nhân Long Nguyen

Trang đầu nay dùng **Long Nguyen** làm tiêu đề chính, giữ avatar/cover/nội dung profile từ Drive và không còn nhãn “Thư Viện Hình Công Giáo”. Tiêu đề trình duyệt cùng mô tả trang cũng đổi thành album hình ảnh cá nhân. Trang Xem Tất Cả đã bỏ dòng giải thích về ngày tạo Google Drive và liên kết “Mở Album Khác” ở cuối trang; empty state không còn nhắc cơ chế đồng bộ. Đã kiểm tra desktop 1280×720, Galaxy S20 360×800, TypeScript, build Pages và diff thành công.

## 2026-08-26 — Điều hướng hai chế độ

Theo yêu cầu owner, đã gỡ hoàn toàn Danh Sách Lễ: tệp trang, route `/tra-cuu-le`, mục điều hướng, CSS chuyên biệt và nội dung hướng dẫn liên quan đều đã bị loại bỏ. Thư viện chỉ còn **Chế độ 01 — Xem theo Album** và **Chế độ 02 — Xem tất cả**. Đã kiểm tra cả hai trang trên desktop 1280×720 và Galaxy S20 360×800: điều hướng hai ô hiển thị đúng, active state rõ ràng, không tràn ngang. TypeScript, build GitHub Pages và kiểm tra diff đều thành công.


## 2026-08-26 — Tra cứu Lễ và Năm A/B/C

Đã thêm metadata `liturgicalYear` và bộ lọc **Năm A/B/C** ở Trang chủ, Dòng Thời Gian và Album. Parser nhận dạng mã `CN22_TN_A`, `CN03_MuaChay_B`, `CN05_PS_C` hoặc cụm `Năm A/B/C`. Ảnh Các Thánh theo chuẩn `MM_DD_Thánh...` được nhận ngày Lễ, đối chiếu danh mục Lễ và vẫn thuộc nhóm Các Thánh.

Trang `/tra-cuu-le` lấy danh sách từ `calendar.leChinh`, `calendar.muaPhungVu` và `fixedFeasts` của cấu hình. Trên desktop có mục lục neo sticky bên phải; mở một Lễ theo đường dẫn trực tiếp sẽ tự đưa mục đang chọn vào vùng nhìn thấy. Trên Galaxy S20, mục lục chuyển lên trước nội dung. Đã thử trực tiếp Lễ Thánh An-tôn Pa-đua-a (trả 2 thiết kế Drive) và Lễ Đức Mẹ Mân Côi (empty state đúng khi chưa có ảnh). `pnpm check`, 18 kiểm thử quy ước, build Pages, desktop 1280×720, Galaxy S20 360×800 và console sau bản sửa đều đạt.

## 2026-08-26 — Sửa phân loại Đức Mẹ và Các Thánh

Đã bổ sung alias `CN_DMMC` thành **Chúa Nhật Lễ Đức Mẹ Mân Côi**. Bộ lọc Đức Mẹ giờ chỉ nhận các cụm trực tiếp như `Duc_Me`, `Duc_Maria`, `Me_Maria`, `DMMC`; không còn dùng `Maria`/`Ma-ri-a` đứng một mình. Vì vậy các Thánh có tên Maria vẫn thuộc **Các Thánh**, không lẫn vào **Đức Mẹ**. Bộ đọc ngày cũng nhận cả `MM_DD`, `MM DD` và `MM/DD`.

Đã kiểm thử 18 mẫu tên phụng vụ, bao gồm toàn bộ các ví dụ owner nêu: Thánh Maria Goretti, Antôn Maria Zaccaria, Maria Mađalêna, Martha Maria Ladaro, Alphonsô Maria Liguori, Antôn Maria Claret, Luy Maria Montfort, Maximilianô Maria Kolbe, cùng các tên không thuộc hai nhóm. `pnpm check`, build GitHub Pages và `git diff --check` đều thành công.

## 2026-08-26 — Lọc và metadata phụng vụ

Đã bổ sung bộ lọc **Mùa Phụng Vụ → Tuần**, **Các Thánh** và **Đức Mẹ** ở Trang chủ, Dòng Thời Gian và từng Album. Tuần hiển thị phụ thuộc Mùa đang chọn. Ảnh `_Eng`/`_ENG` được gắn **Tiếng Anh**; Các Thánh nhận diện từ ngày `MM_DD` kết hợp `Thanh`/`Thánh` hoặc dấu hiệu Tử Đạo; Đức Mẹ nhận diện các cụm `Duc_Me`, `Duc_Maria`, `Me_Maria`, `Ma-ri-a` và biến thể có dấu.

Ô tìm kiếm nhận metadata và alias theo file cấu hình; chế độ Danh Sách bổ sung Mùa/Tuần, ngày Lễ, nhóm nội dung, ngôn ngữ và tên Lễ cố định khi có dữ liệu. Kiểm thử hồi quy gồm 17 mẫu quy ước và đối chiếu manifest thật cho cả bốn nhóm Tiếng Anh/Các Thánh/Đức Mẹ/Tuần. Đã chạy `pnpm check`, build Pages, `git diff --check`, kiểm tra desktop 1280×720 và Galaxy S20 360×800. Bộ lọc thêm 12.74KB JavaScript, tương đương 2.74KB gzip; metadata được cache theo tên ảnh, không có request mạng mới hay lỗi runtime sau bản sửa.

## 2026-08-26 — File cấu hình quy ước và danh sách Lễ

Đã tách số La Mã I–XXXIV, mùa phụng vụ, thứ trong tuần, alias tên Lễ và danh sách Lễ cố định theo ngày vào `client/src/data/liturgical-rules.json`. File được import lúc build, nên thay đổi trong file không đổi tên Drive gốc, slug Album, ID hoặc URL tải; đồng thời không tạo request mạng mới khi người xem mở website.

Đã kiểm thử 17 tên gồm quy ước file của owner, tuần/số La Mã, Lễ Thánh An-tôn và giới hạn tìm kiếm alias theo đúng tên ảnh. `pnpm check`, build GitHub Pages và `git diff --check` đều thành công. Bundle JavaScript tăng 10.91KB, tương đương 3.13KB gzip; mức tăng nhỏ so với lợi ích chỉnh sửa cấu hình độc lập. Đã xem desktop 1280×720 cùng Galaxy S20 360×800, không có tràn ngang; console và network sau bản cập nhật không ghi nhận lỗi runtime hoặc 4xx/5xx.

## 2026-08-25 — Chuẩn hóa tên phụng vụ từ Drive

Đã thêm lớp chuẩn hóa tên hiển thị ở frontend. Tên file/folder nguồn, ID, slug và URL tải Google Drive được giữ nguyên; website chỉ tạo nhãn tiếng Việt có dấu tại thời điểm render. Bộ chuẩn hóa nhận các mẫu Chúa Nhật Thường Niên/Mùa Chay/Phục Sinh, ngày trong tuần, Mùa Vọng, Chúa Nhật Phục Sinh, Bài Đọc, Tin Mừng, ngày lễ theo tháng-ngày, khoảng thời gian và hậu tố Long Nguyen/Background.

Script `scripts/verify-liturgical-names.ts` kiểm thử thành công 15 mẫu, gồm toàn bộ quy ước owner cung cấp và các biến thể đang có trong manifest. Đã chạy `pnpm check`, `GITHUB_PAGES=true pnpm build`, `git diff --check`; tất cả thành công. Đã xem trực quan Trang chủ, Dòng Thời Gian và Album tuần/lễ dài ở desktop 1280×720 cùng Galaxy S20 360×800: tên xuống dòng gọn, không tràn ngang; console sau bản sửa không có runtime error hay yêu cầu 4xx/5xx.

## 2026-08-25 — Cover 340px và đánh giá giao diện

Cover trang chủ ở breakpoint desktop đã điều chỉnh từ 365px xuống đúng 340px. Tiêu đề nhận diện chính là `Thư Viện Hình Công Giáo`; `Long Nguyen` được giữ ở cấp phụ. Các trường handle/bio vẫn render nguyên văn từ manifest Google Drive, không bị giao diện thay thế hoặc diễn giải.

Đã chụp kiểm tra trang chủ ở desktop 1280×720 và Galaxy S20 360×800 sau bản chỉnh cuối. Cover dùng `object-fit: contain`, ảnh không bị cắt; không có tràn ngang. Kiểm tra bổ sung Trang chủ, Xem Tất Cả và trang Album cho thấy luồng duyệt, bộ lọc Background, tìm kiếm, ảnh không crop và các placeholder thiếu URL vẫn ổn định. Console gần đây không có lỗi ứng dụng; network log không ghi nhận yêu cầu 4xx/5xx.

## 2026-08-27 — Đồng bộ hai cách xem và lưới Xem tất cả

Đường dẫn gốc nay mở ngay **Xem tất cả**; link `/timeline` cũ vẫn hiển thị cùng trang để không làm hỏng bookmark trước đây. Cả Xem tất cả và **Theo thư mục** dùng cùng cover, avatar, tên, mô tả và thống kê 1.993 hình; thao tác chuyển đổi hai chiều giữ cụm hồ sơ không đổi.

Tiêu đề giới thiệu “Thư mục” / “Xem Tất Cả” đã gỡ khỏi vùng ngay sau bộ chuyển cách xem. Trong Thư mục chi tiết, phần Thư mục và phần ảnh vẫn được cách nhau rõ bằng đường phân cách, nhưng không còn nhãn chữ “Thư mục con” hoặc “File hình”. Trên Xem tất cả, mọi ô ảnh trong cùng lưới dùng chung số cột và tỷ lệ khung; ảnh đầu không còn được phóng lớn. Đã kiểm tra route gốc, chuyển sang `/folders`, trang Thư mục chi tiết, desktop 1280×720 và Galaxy S20 360×800; console mới không có lỗi ứng dụng.

## 2026-08-27 — Thanh công cụ thống nhất cho Thư mục

Đã kiểm tra Thư mục “Rước Lễ Lần Đầu”: cover–avatar dùng đúng cụm chung ở đầu trang; thanh tìm kiếm, bộ lọc và kiểu xem hiển thị gọn trên cùng một vùng. Khi gõ `File In Bat`, nhãn “Đang tìm” hiện trong lúc chờ và sau độ trễ chỉ còn Thư mục con phù hợp, không còn các hình không liên quan. Chế độ chi tiết không còn cột Kích thước và vùng tên rộng hơn. Đã phát hiện lỗi thứ tự hook trong lần xem đầu, di chuyển phép tính thống kê hồ sơ lên trước nhánh tải và kiểm tra lại thành công; log mới sau khi sửa không có lỗi ứng dụng.

Sau cùng, đã điều chỉnh flex ở breakpoint Galaxy S20 để ô tìm kiếm Theo thư mục không bị kéo cao. Ở 360×800, nút hai cách xem đúng thứ tự Xem tất cả → Theo thư mục, ô tìm kiếm và Tùy chọn nằm gọn ở một hàng, ba nút kiểu xem nằm ngay dưới, và danh sách chi tiết chỉ còn cột Tên / Ngày / Loại.

## 2026-08-27 — Tinh gọn đầu trang Thư mục

Phần đầu Thư mục nay dùng tiêu đề biên tập rộng hết khu vực nội dung, không còn giới hạn `max-width` làm tên dài bị bó hẹp; kích thước và khoảng cách đã được cân lại cho desktop 1280×720 và Galaxy S20 360×800. Biểu tượng Thánh Giá ở thanh quay lại đã thay bằng nút rõ ràng **Trở về Trang Chủ**. Bản dựng TypeScript, GitHub Pages và kiểm tra định dạng diff đều thành công.

Đã mở trực tiếp Thư mục Rước Lễ Lần Đầu và thử nút **Trở về Trang Chủ**; trang điều hướng đúng về Xem tất cả tại `/`. Console sau lượt kiểm tra mới không ghi nhận lỗi ứng dụng.

## 2026-08-27 — Rà soát và hoàn thiện giao diện ưu tiên điện thoại

Đã rà soát ba luồng chính trên desktop 1280×720 và Galaxy S20 360×800: **Xem tất cả**, **Theo thư mục** và Thư mục có tên dài. Báo cáo chi tiết `BAO_CAO_RAO_SOAT_GIAO_DIEN_2026-08-27.md` ghi sáu nhóm ưu tiên về tiêu đề dài, cover–avatar, nhịp dọc, thanh thao tác, caption ảnh và danh sách Chi tiết.

Lượt hoàn thiện giảm cover mobile còn 112px, avatar còn 66px, tên hồ sơ còn 25–30px và giảm khoảng trống giữa các khối. Tiêu đề Thư mục dài sử dụng 27–34px, line-height 1.09, giữ nguyên toàn bộ nội dung nhưng không còn chiếm gần nửa màn hình. Ở Xem tất cả, caption được giới hạn hai dòng, metadata được nén và đường dẫn Thư mục nguồn được ẩn trong tile để nhường chỗ cho ảnh; grid hai cột đồng đều vẫn giữ theo yêu cầu owner. Đã kiểm tra lại không có tràn ngang; TypeScript, build Pages và diff đều thành công.

## 2026-08-27 — Nén thêm tiêu đề Thư mục theo phản hồi trực tiếp

Sau phản hồi owner, tiêu đề Thư mục ở Galaxy S20 giảm tiếp còn **23–27px**, line-height **1.12**. Padding đầu khối giảm còn 11px trên/dưới 14px; metadata và nút tải giảm tương ứng nhưng giữ vùng chạm rõ ràng. Tên Thư mục dài “Chúa Nhật Thứ 22 Thường Niên - Năm A và Tuần 22 Thường Niên từ 30/08 đến 05/09” vẫn hiện đầy đủ trong bốn dòng vừa phải, ngay sau đó đã thấy vùng tìm kiếm và danh sách Thư mục. Kiểm tra 360×800, TypeScript, build GitHub Pages và diff đều thành công.

## 2026-08-27 — Cụm hồ sơ và thanh tải Thư mục

Đã gỡ hoàn toàn thống kê tổng số hình khỏi cover–avatar–info ở Xem tất cả, Theo thư mục và mọi trang Thư mục con. Avatar nay nằm cùng hàng với tên **Long Nguyen** và nội dung nguyên văn từ `info`, không còn chồng lấn lên cover. Nút **Tải Thư mục** đã rời khỏi khối tiêu đề; nó nằm cạnh các thao tác nội dung sau thanh tìm kiếm/lọc, giữ phần đầu trang nhẹ và tên Thư mục được ưu tiên. Đã chụp kiểm tra desktop 1280×720 và Galaxy S20 360×800, không có tràn ngang; TypeScript, build Pages và diff đều thành công.

## 2026-08-27 — Đồng nhất Thư mục con

Trong chế độ Chi tiết, Thư mục con nay dùng đúng hàng `folder-detail-row` như Thư mục mẹ: biểu tượng folder đóng 28px, số thứ tự xanh, tên Noto Sans đậm tối đa hai dòng, ngày/loại ở desktop và mũi tên mở ở cuối. Nền màu, thumbnail lớn, tên serif và nút Mở riêng của hàng cũ đã được gỡ. Trên Galaxy S20, hàng Thư mục con có cùng chiều cao 68px và khoảng cách với danh sách Thư mục mẹ; tiêu đề Thư mục dài giảm tiếp còn 20–23px để toàn bộ tên hiển thị gọn. Đã kiểm tra desktop 1280×720, Galaxy S20 360×800, TypeScript, build Pages và diff thành công.

## 2026-08-27 — Avatar chồng nhẹ lên Cover

Theo phản hồi owner, chiều cao cover được giữ nguyên. Avatar tăng lên 82px trên Galaxy S20, 122px ở tablet và 138px trên desktop; toàn bộ cụm hồ sơ được kéo lên để avatar chồng nhẹ, có chủ đích lên mép cover. Tên **Long Nguyen** và nội dung nguyên văn từ `info` căn giữa cùng hàng với avatar, tạo một nhịp ngang rõ ràng hơn. Không có phần tử tràn hoặc chồng chữ ở 360×800 và 1280×720; TypeScript, build Pages và diff đều thành công.

## 2026-08-27 — Khoảng cách hồ sơ và nội dung

Trên Galaxy S20, phần kết thúc của cover–avatar–info được cách vùng chuyển **Xem tất cả / Theo thư mục** bằng khoảng đệm 26px; tiếp theo là khoảng đệm 14px trước nhóm nút. Ở trang Thư mục, khoảng đệm sau hồ sơ là 24px trước điều hướng. Nhịp này tách rõ phần nhận diện với phần duyệt nội dung, nhưng không đẩy nội dung chính quá xa khỏi vùng nhìn đầu tiên. Desktop giữ tỷ lệ cũ cân đối. Đã kiểm tra ba route chính ở 360×800 và 1280×720; TypeScript, build Pages và diff thành công.

## 2026-08-27 — Thu gọn khoảng cách theo phản hồi owner

Đã điều chỉnh lại sau khi owner xác nhận cần **giảm**, không phải tăng khoảng cách. Trên Galaxy S20, khoảng cách sau cụm hồ sơ giảm xuống 10px và margin trước bộ chuyển cách xem giảm còn 6px; riêng trang Thư mục giữ 10px trước điều hướng. Ba route Xem tất cả, Theo thư mục và Thư mục chi tiết nay tiếp nối sát, rõ và không tạo vùng trống giữa nhận diện với nội dung. Đã chụp kiểm tra 360×800 và desktop 1280×720; TypeScript, build Pages và diff thành công.

## 2026-08-27 — Căn tên và thông tin hồ sơ theo Avatar

Cụm chữ hồ sơ được hạ nhẹ 5px trên Galaxy S20, 7px ở tablet và 9px desktop để có đường thở rõ với mép cover. Dòng **Long Nguyen** bắt đầu tại tâm dọc của avatar và nội dung `info` nằm gọn ngay dưới theo cùng một khối, không bị chạm vào cover. Đã kiểm tra trang Xem tất cả và Thư mục có tên dài ở 360×800 lẫn 1280×720; TypeScript, build Pages và diff thành công.

## 2026-08-27 — Bộ lọc Thiếu Nhi
Đã thêm nút **Thiếu Nhi** ngay sau **Các Thánh** và **Đức Mẹ** trong bảng Lọc của Xem tất cả, Theo thư mục và mọi Thư mục con. Quy tắc nhận diện dùng cả tên file và tên Thư mục chứa ảnh: `ThieuNhi`, `Thiếu Nhi` và hậu tố `_TN` đã được lớp chuẩn hóa đổi thành Thiếu Nhi. Thử trực tiếp ở Xem tất cả trả về **153 hình** chỉ có nhãn Thiếu Nhi, gồm cả ảnh tiếng Anh. Bộ kiểm thử quy ước 112 mẫu, TypeScript, build Pages, Galaxy S20 và diff đều thành công.

## 2026-08-27 — Bỏ số thứ tự trên Thư mục và hình

Đã gỡ nhãn số thứ tự ở ô Thư mục trong ba kiểu xem, thẻ hình của Xem tất cả, kết quả tìm kiếm, danh sách chi tiết và Thư mục con. Trình xem ảnh cũng không còn hiển thị vị trí số trong phần đầu hoặc chân trang. Kiểm tra desktop 1280×720 và Galaxy S20 360×800 cho ba route Xem tất cả, Theo thư mục và Thư mục chi tiết xác nhận tên có thêm không gian, không tràn ngang; TypeScript, build Pages và diff đều thành công.
