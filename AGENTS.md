# Hướng dẫn cho AI Agent

## Thứ tự đọc bắt buộc

1. `README.md`
2. `docs/ARCHITECTURE.md`
3. `docs/DOMAIN_RULES.md`
4. Tài liệu gần nhất với phần code cần sửa

## Ranh giới module

- `packages/enigma-core` là TypeScript thuần. Không dùng DOM, React, `window`, `localStorage` hoặc API tải file.
- `packages/codebook-core` là TypeScript thuần và phải tái lập được kết quả khi cùng seed.
- `apps/web` sở hữu UI, trạng thái trình bày và browser adapters.
- `packages/shared` chỉ chứa hợp đồng/tiện ích thật sự dùng chung; không biến thành thư mục “misc”.
- Không thêm backend nếu yêu cầu chưa cần tài khoản, đồng bộ cloud hoặc chia sẻ nhiều người.

## Quy tắc thay đổi

- Sửa thuật toán phải thêm hoặc cập nhật test vector.
- Không thay đổi thứ tự rotor trái → phải trong API công khai.
- `Ringstellung` trong Codebook là 01–26; engine nội bộ là 0–25.
- Rotor bước trước khi tín hiệu đi qua máy.
- M4 có rotor Greek đứng yên ở ngoài cùng trái.
- Không dùng `Math.random()` cho generator có seed.
- Import JSON phải validate schema, kích thước và dữ liệu miền nghiệp vụ.

## Definition of Done

```bash
pnpm verify
pnpm test:e2e
```

Nếu thay đổi hành vi người dùng, cập nhật `docs/USER_GUIDE.md` hoặc `docs/CODEBOOK_USER_GUIDE.md` trong cùng pull request.
