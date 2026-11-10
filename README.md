# LUMIÉ STORE — React Native + Expo

Ứng dụng thương mại điện tử phục vụ bài thi kết thúc môn Lập trình Di động 2.

## Công nghệ
- React Native + Expo SDK 58
- TypeScript
- Expo Router (điều hướng theo file)
- expo-sqlite (SQLite lưu dữ liệu cục bộ)

## Cài đặt và chạy
Yêu cầu: Node.js >= 22.13, npm, ứng dụng Expo Go tương thích SDK 58 hoặc Android Studio.

```bash
npm install
npx expo install --fix
npx expo start
```

Quét QR bằng Expo Go. Nếu chạy Android Emulator, nhấn `a` trong cửa sổ Expo.
Để chạy giao diện trên trình duyệt, dùng `npm run web`; cấu hình Metro đã bật đóng gói WebAssembly cần thiết cho SQLite.

## Tài khoản mẫu
- Admin: `admin@lumie.store` / `admin123`
- User: `user@lumie.store` / `user123`

Database `lumie-store.db` được tạo tự động khi mở ứng dụng lần đầu. Cơ sở dữ liệu khởi tạo sẵn tài khoản, danh mục và sản phẩm.
Phiên đăng nhập và giỏ hàng được lưu cục bộ để vẫn còn sau khi tải lại hoặc mở lại ứng dụng.

## Chức năng
### User
- Trang chủ, banner, danh mục, danh sách sản phẩm.
- Tìm kiếm theo tên hoặc danh mục; lọc theo giá từ/đến.
- Xem chi tiết sản phẩm, thêm vào giỏ hàng, cập nhật số lượng.
- Đăng ký, đăng nhập, đăng xuất.
- Checkout, đặt hàng, lịch sử mua hàng.
- Cập nhật hồ sơ.

### Admin
- Đăng nhập bằng tài khoản quản trị có sẵn.
- Quản lý người dùng, thay đổi vai trò và xóa user.
- Quản lý danh mục: thêm, sửa, xóa.
- Quản lý sản phẩm: thêm, sửa, xóa; gán danh mục.
- Quản lý đơn hàng và cập nhật trạng thái.

## Cấu trúc thư mục
```text
app/                 Các màn hình và route Expo Router
  admin/             Các màn hình quản trị
  product/           Chi tiết sản phẩm
src/
  components/        Thành phần giao diện tái sử dụng
  constants/         Bảng màu
  context/           Trạng thái đăng nhập và giỏ hàng
  database/          Khởi tạo SQLite và dữ liệu mẫu
  types/             Kiểu dữ liệu TypeScript
```

## Lưu ý học thuật và bảo mật
Đây là bản demo học tập chạy dữ liệu cục bộ trên thiết bị. Mật khẩu được lưu dạng văn bản để đơn giản hóa bài thực hành; không dùng cách này cho ứng dụng thương mại thực tế. Bản triển khai thực tế cần backend, xác thực an toàn và phân quyền phía máy chủ.

Hình ảnh sản phẩm sử dụng URL ảnh từ Unsplash, do đó cần Internet để tải ảnh. Các chức năng dữ liệu cốt lõi chạy bằng SQLite trên thiết bị.

## Đối chiếu phiếu chấm
- A. User: trang chủ, banner/menu, category selector, chi tiết, bottom navigation, signup/login/logout, header user, tìm kiếm, lọc giá.
- B. Admin: tài khoản có sẵn, đăng nhập, dashboard, admin bottom navigation, quản lý user/role, CRUD danh mục, thêm sản phẩm theo danh mục, CRUD sản phẩm.
- C. Khác: giỏ hàng, checkout/đặt hàng, lịch sử, cập nhật hồ sơ, quản trị trạng thái đơn hàng.

## Khắc phục lỗi thường gặp
- Nếu Expo Go báo SDK không tương thích, cập nhật Expo Go hoặc chạy `npx expo install --fix` và dùng đúng SDK mà Expo Go hiện hỗ trợ.
- Nếu Metro cache lỗi: `npx expo start -c`.
- Nếu muốn reset dữ liệu mẫu, gỡ ứng dụng khỏi thiết bị hoặc xóa dữ liệu ứng dụng để SQLite tạo database mới.


**Runtime:** Expo SDK 58 / React Native 0.88 / React 19.3. See `FIX_INSTALL_WINDOWS.md` for clean Windows setup.
