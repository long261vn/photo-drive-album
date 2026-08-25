# Thiết lập đồng bộ Google Drive

Website hiện dùng folder công khai `Website_LHN` với ID `1ua5LsDU7yv-Y_ZFyFA7lx4LoKiXcGwUw`. Hai folder con đang được nhận diện là `CN20_TN_A` và `CN21_TN_A`; script sẽ tự đổi chúng thành “Chúa Nhật Thứ 20 Thường Niên - Năm A” và “Chúa Nhật Thứ 21 Thường Niên - Năm A”.

## Đổi folder Google Drive không sửa code

Folder ID nay là **Repository secret**, không nằm cố định trong code website. Chỉ tài khoản có quyền quản trị repository `long261vn/photo-drive-album` mới thấy và thay được phần cấu hình này; khách xem website, kể cả khi repository là public, không có quyền thay đổi.

1. Đăng nhập đúng tài khoản GitHub chủ repository, mở `long261vn/photo-drive-album` → **Settings** → **Secrets and variables** → **Actions** → tab **Secrets**.
2. Tạo hoặc mở secret `DRIVE_ROOT_FOLDER_ID`. Dán ID folder thư viện mới, tức phần nằm sau `/folders/` trong link Google Drive. Folder này là nơi các folder cấp một trở thành Album.
3. Tạo hoặc mở secret `DRIVE_PROFILE_FOLDER_ID`. Dán ID folder chứa `Avatar.png`, `Cover.png` và Google Tài liệu `info`. Nếu vẫn dùng profile cũ, giữ nguyên ID hiện có.
4. Bấm **Update secret**. Sau đó vào **Actions** → **Sync Google Drive albums** → **Run workflow** để sinh manifest và phát hành thư viện từ folder mới.

Hai ID folder là cấu hình, không phải API key. Giữ cả hai ở tab **Secrets** cùng với `GOOGLE_DRIVE_API_KEY`; không đưa bất kỳ giá trị nào vào code. GitHub không đưa giá trị Secret vào source hay trang web; website công khai chỉ nhận file `albums.json` đã được workflow tạo.

Để chỉ mình bạn quản lý: bật xác thực hai bước cho tài khoản GitHub, không thêm collaborator có quyền **Write/Maintain/Admin**, và kiểm tra định kỳ danh sách quyền ở repository **Settings → Collaborators and teams**. Người xem public không thể bấm chạy workflow, đổi Secret hoặc sửa GitHub Pages; những thao tác này cần quyền ghi repository. Nếu sau này giao quyền cho người khác, họ có thể thay folder hoặc chạy workflow, vì vậy chỉ cấp quyền này cho người hoàn toàn tin cậy.

## Folder lồng nhau

Mỗi folder trực tiếp trong `Website_LHN` là một Album. Nếu trong Album có folder nằm bên trong, các folder đó sẽ hiện thành các bộ sưu tập ở trang Album. Người xem mở một bộ sưu tập để xem và tải ảnh.

Ví dụ:

```text
Website_LHN/
└── Mùa Chay 2026/                 ← Album
    ├── Thứ Tư Lễ Tro/              ← Bộ sưu tập, chứa ảnh
    ├── Chúa Nhật I Mùa Chay/       ← Bộ sưu tập, chứa ảnh
    └── Chúa Nhật II Mùa Chay/      ← Bộ sưu tập, chứa ảnh
```

Folder có thể lồng sâu hơn nếu cần; mỗi cấp sẽ là một trang Album riêng. Ảnh đặt trực tiếp trong folder vẫn được giữ và hiện ở phần **Thiết Kế Trong Bộ Này**, bên dưới danh sách bộ sưu tập. Để chọn ảnh bìa, đặt một ảnh trong folder đó có tên bắt đầu bằng `cover`, ví dụ `cover-mua-chay.jpg`; nếu không có, website dùng ảnh đầu tiên hoặc ảnh bìa của bộ sưu tập đầu tiên.

## Ảnh bìa và nội dung được hiển thị

Mỗi folder được chọn cover theo thứ tự rõ ràng: **(1)** ảnh có tên bắt đầu bằng `cover`, **(2)** ảnh đầu tiên nằm trực tiếp trong folder, **(3)** cover của Bộ Sưu Tập con đầu tiên có ảnh. Vì vậy folder mẹ không cần đặt lại ảnh nếu chỉ dùng để nhóm các Bộ Sưu Tập.

Ảnh Background có tên chứa `_BG` (cũng nhận diện dạng ` BG` hoặc `-BG`) được đánh dấu riêng. Website **mặc định ẩn** các ảnh này ở Album, tìm kiếm và Dòng Thời Gian để thư viện dễ xem; người xem có thể bấm **Hiện BG** khi cần. Ảnh Background không bao giờ được chọn làm cover. Nếu folder chỉ có ảnh Background, website sẽ tiếp tục tìm ảnh không phải Background trong Bộ Sưu Tập con hoặc để cover trống.

Website chỉ đưa **ảnh có thể xem** vào gallery. Tệp PSD, AI, EPS, XCF, các tệp thiết kế nguồn và các tệp không phải ảnh không xuất hiện ở gallery, Timeline hay kết quả tìm kiếm. Folder có tên công việc như `PSD`, `AI`, `Fonts`, `File Thiet Ke`, `Source`, `Layers` hoặc `PDF layers` cũng được bỏ qua cùng toàn bộ nội dung của chúng.

Trong mỗi Album, ảnh và Bộ Sưu Tập con được sắp chung theo thứ tự Drive: Bộ Sưu Tập trước, rồi ảnh trực tiếp trong Album. Ba chế độ **Xem Lớn**, **Lưới** và **Danh Sách** đều hiển thị nhất quán cả hai loại; Bộ Sưu Tập có nhãn folder và bấm vào sẽ mở trang bên trong.

Ô tìm kiếm ở trang chủ tìm sâu trong toàn bộ cây thư viện: tên Album, tên Bộ Sưu Tập, và tên từng ảnh trong các folder con. Kết quả cho biết loại nội dung, vị trí Album nguồn và bấm để mở đúng Album chứa nội dung đó.

## Quy ước đặt tên phụng vụ

Tên file/folder trong Drive là **tên nguồn**: website không đổi tên, slug, ID hoặc link tải Drive. Khi hiển thị, website tự chuyển các mẫu dưới đây thành tiếng Việt có dấu, đồng thời cho phép tìm bằng cả tên viết tắt lẫn tên đã chuẩn hóa.

| Tên nguồn trên Drive | Tên hiển thị trên website |
|---|---|
| `09_05_Thánh_Têrêsa_Calcutta_LN1` | `05/09 Thánh Têrêsa Calcutta · Long Nguyen 1` |
| `CN22_TN_A_LN1` | `Chúa Nhật Thứ 22 Thường Niên - Năm A · Long Nguyen 1` |
| `CN22_TNA_BaiDoc1` | `Chúa Nhật Thứ 22 Thường Niên - Năm A - Bài Đọc 1` |
| `CN22_TNA_Tin_Mung` | `Chúa Nhật Thứ 22 Thường Niên - Năm A - Tin Mừng` |
| `CN05_PS_C`, `CN03_MuaChay_B` | `Chúa Nhật Thứ 05 Phục Sinh - Năm C`, `Chúa Nhật Thứ 03 Mùa Chay - Năm B` |
| `T2_Tuan_06_TN_LN`, `T4_Tuan_02_MC_LN` | `Thứ Hai Tuần 06 Thường Niên · Long Nguyen`, `Thứ Tư Tuần 02 Mùa Chay · Long Nguyen` |
| `_MV`, `_MuaVong`, `_CNPS` | `Mùa Vọng`, `Mùa Vọng`, `Chúa Nhật Phục Sinh` |
| `Tuan_02_MC_va_Le_tu_02_03_den_07_03` | `Tuần 02 Mùa Chay và Lễ từ 02/03 đến 07/03` |
| `CN22_TN_A_va_Tuan22TN_tu_30_08_den_05_09` | `Chúa Nhật Thứ 22 Thường Niên - Năm A và Tuần 22 Thường Niên từ 30/08 đến 05/09` |

Hậu tố `_LN`, `_LN1`, `_LN2`… được hiểu là phiên bản của **Long Nguyen**. Hậu tố `_BG` vẫn chỉ đánh dấu ảnh Background và mặc định bị ẩn; khi bật **Hiện BG**, tên hiển thị thêm nhãn `Background` để phân biệt rõ.

## Tải Toàn Bộ Album

Google Drive chỉ tạo gói ZIP khi tải folder qua giao diện Drive; API công khai của website chỉ tải trực tiếp từng tệp. Vì vậy, để có nút **Tải Toàn Bộ Album**, hãy tự nén các ảnh của bộ đó thành một file `.zip` và đặt file ZIP vào **cùng folder** với ảnh. Ví dụ: `mua-chay-2026.zip`.

Lần đồng bộ kế tiếp sẽ nhận diện file ZIP, không hiển thị file này trong gallery ảnh và tự hiện nút **Tải Toàn Bộ Album** trên trang tương ứng. Nếu folder chưa có file `.zip`, nút sẽ không xuất hiện; người xem vẫn tải từng thiết kế như bình thường.

## Hồ sơ thư viện

Trang chủ dùng thêm folder công khai `Website_LHN_Data` có ID `1EyZBWqmD1s74T_Aiekw3Y-tKguwdHwhQ`. Giữ nguyên `Avatar.png`, `Cover.png` và Google Tài liệu tên chính xác là `info`: avatar và cover được hiển thị ở phần hồ sơ; tài liệu có thể dùng các trường `Tên: ...`, `Giới thiệu: ...`, `Handle: ...`, rồi thêm các dòng thông tin ngắn khác bên dưới. Nội dung sẽ tự đổi sau lần đồng bộ kế tiếp.

Để workflow đọc được folder qua Drive API, cần tạo một API key trong Google Cloud Console của chính anh/chị. Trong project Google Cloud, hãy bật **Google Drive API**, tạo API key và giới hạn key theo API là “Google Drive API”. Vì website chỉ đọc folder đã chia sẻ công khai, không cần nhúng OAuth client secret vào frontend.

Sau khi tạo key, thêm vào repository GitHub tại **Settings → Secrets and variables → Actions → New repository secret** với tên chính xác là `GOOGLE_DRIVE_API_KEY`. Sau đó mở tab **Actions**, chọn workflow **Sync Google Drive albums** và bấm **Run workflow** lần đầu. Workflow sẽ tạo hoặc cập nhật `client/public/data/albums.json`, rồi tự commit khi manifest thay đổi.

Workflow không có lịch chạy tự động. Sau mỗi lần thêm, sửa hoặc xóa nội dung trong Google Drive, hãy chủ động bấm **Run workflow**. GitHub Actions sẽ tạo manifest mới, chỉ commit khi dữ liệu thật sự thay đổi và phát hành GitHub Pages trong cùng lượt chạy.

## Dòng thời gian

Trang **Dòng Thời Gian** gom ảnh từ tất cả Album, xếp mới nhất trước và chia theo tháng/năm. Mỗi ảnh ghi ngày tạo và liên kết về Album nguồn. Mốc dùng là **ngày tạo file trên Google Drive**: khi bạn đưa file vào Drive, không phải ngày ảnh được thiết kế. Sau khi cập nhật phiên bản website này, hãy chạy **Sync Google Drive albums** một lần để manifest có ngày tạo chính xác cho từng ảnh.

## Lối tắt đồng bộ kín trên website

Khi cần đồng bộ ngay, hãy vào trang chủ website và **chạm nhanh 7 lần liên tiếp vào dòng `Long Nguyen © 2026` ở footer trong tối đa 5 giây**. Ở lần chạm thứ bảy, website mở trang workflow `Sync Google Drive albums` của GitHub trong **tab mới**; trang thư viện hiện tại vẫn được giữ nguyên. Hãy đăng nhập đúng tài khoản GitHub của mình rồi bấm **Run workflow** để xác nhận chạy đồng bộ.

Nếu không đủ 7 lần chạm trong 5 giây, bộ đếm sẽ tự hủy. Avatar chỉ dùng để hiển thị hồ sơ. Lối tắt này không lưu token hoặc mật khẩu trên website và không tự chạy workflow mà chưa có xác nhận trong GitHub.

Ảnh và folder phải kế thừa quyền công khai phù hợp để khách truy cập không cần đăng nhập Google.
