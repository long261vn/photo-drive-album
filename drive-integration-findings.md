# Phát hiện tích hợp Google Drive

## Folder được cung cấp

- Folder gốc: `1ua5LsDU7yv-Y_ZFyFA7lx4LoKiXcGwUw`.
- Tên folder hiển thị: `Website_LHN`.
- Folder có thể xem công khai mà không cần đăng nhập Google.
- Có ít nhất hai folder con: `CN20_TN_A` và `CN21_TN_A`; chúng sẽ được chuyển thành hai album đầu tiên trong website sau khi đồng bộ.

## Hướng tích hợp

Folder công khai có thể được đọc bằng Google Drive API để tạo manifest tĩnh. Website frontend không cần, và không được, giữ credential Google. Script đồng bộ sẽ chạy trong GitHub Actions, nhận API key qua GitHub Secret, đọc folder theo `folderId` và tạo `client/public/data/albums.json`.

Google Drive có cơ chế push notifications nhưng cần một endpoint webhook nhận được request từ Google. GitHub Actions không phải endpoint nhận webhook lâu dài; vì vậy phiên bản MVP sẽ chạy theo lịch và có nút chạy thủ công. Đây là cơ chế ổn định hơn trong kiến trúc GitHub Pages tĩnh.
