# Cài đặt LUMIÉ STORE - Expo SDK 58 (Windows)

1. Giải nén thư mục này vào một thư mục MỚI, không chép đè lên project cũ.
2. Mở đúng thư mục `LumieStore` có file `package.json` bằng VS Code.
3. Mở PowerShell tại thư mục đó và chạy:

```powershell
node -v
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
npm install
npx expo-doctor
```

4. Nếu Expo Doctor không còn lỗi dependency nghiêm trọng, chạy:

```powershell
npx expo start --clear
```

Yêu cầu Node.js >= 22.13.x. Không dùng `npm audit fix --force`, `--force` hoặc `--legacy-peer-deps` để ép cài.
