# Thiết lập đồng bộ Google Drive

Website dùng folder công khai `Website_LHN` với ID `1ua5LsDU7yv-Y_ZFyFA7lx4LoKiXcGwUw`. Hai folder con đang được nhận diện là `CN20_TN_A` và `CN21_TN_A`; script sẽ tự đổi chúng thành “Chúa Nhật Thứ 20 Thường Niên - Năm A” và “Chúa Nhật Thứ 21 Thường Niên - Năm A”.

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

## Tải Toàn Bộ Album

Google Drive chỉ tạo gói ZIP khi tải folder qua giao diện Drive; API công khai của website chỉ tải trực tiếp từng tệp. Vì vậy, để có nút **Tải Toàn Bộ Album**, hãy tự nén các ảnh của bộ đó thành một file `.zip` và đặt file ZIP vào **cùng folder** với ảnh. Ví dụ: `mua-chay-2026.zip`.

Lần đồng bộ kế tiếp sẽ nhận diện file ZIP, không hiển thị file này trong gallery ảnh và tự hiện nút **Tải Toàn Bộ Album** trên trang tương ứng. Nếu folder chưa có file `.zip`, nút sẽ không xuất hiện; người xem vẫn tải từng thiết kế như bình thường.

## Hồ sơ thư viện

Trang chủ dùng thêm folder công khai `Website_LHN_Data` có ID `1EyZBWqmD1s74T_Aiekw3Y-tKguwdHwhQ`. Giữ nguyên `Avatar.png`, `Cover.png` và Google Tài liệu tên chính xác là `info`: avatar và cover được hiển thị ở phần hồ sơ; tài liệu có thể dùng các trường `Tên: ...`, `Giới thiệu: ...`, `Handle: ...`, rồi thêm các dòng thông tin ngắn khác bên dưới. Nội dung sẽ tự đổi sau lần đồng bộ kế tiếp.

Để workflow đọc được folder qua Drive API, cần tạo một API key trong Google Cloud Console của chính anh/chị. Trong project Google Cloud, hãy bật **Google Drive API**, tạo API key và giới hạn key theo API là “Google Drive API”. Vì website chỉ đọc folder đã chia sẻ công khai, không cần nhúng OAuth client secret vào frontend.

Sau khi tạo key, thêm vào repository GitHub tại **Settings → Secrets and variables → Actions → New repository secret** với tên chính xác là `GOOGLE_DRIVE_API_KEY`. Sau đó mở tab **Actions**, chọn workflow **Sync Google Drive albums** và bấm **Run workflow** lần đầu. Workflow sẽ tạo hoặc cập nhật `client/public/data/albums.json`, rồi tự commit khi manifest thay đổi.

Workflow chạy mỗi 30 phút, vào phút 17 và 47. GitHub Actions không nhận trực tiếp thông báo file thay đổi từ Google Drive vì Drive push notifications cần một webhook HTTPS luôn hoạt động; GitHub Pages là website tĩnh nên không có webhook receiver. Vì vậy, cập nhật sẽ xuất hiện trong vòng khoảng 30 phút sau khi thêm hoặc xóa ảnh, hoặc ngay khi anh/chị bấm **Run workflow**.

## Lối tắt đồng bộ kín trên website

Khi cần đồng bộ ngay, hãy vào trang chủ website và **nhấn giữ dòng `Long Nguyen © 2026` ở footer trong 5 giây**. Một gạch xanh sẽ hiện bên dưới dòng bản quyền trong lúc giữ. Khi đủ thời gian, website mở trang workflow `Sync Google Drive albums` của GitHub. Hãy đăng nhập đúng tài khoản GitHub của mình rồi bấm **Run workflow** để xác nhận chạy đồng bộ.

Thả tay trước 5 giây sẽ hủy thao tác. Avatar chỉ dùng để hiển thị hồ sơ. Lối tắt này không lưu token hoặc mật khẩu trên website và không tự chạy workflow mà chưa có xác nhận trong GitHub.

Ảnh và folder phải kế thừa quyền công khai phù hợp để khách truy cập không cần đăng nhập Google.
