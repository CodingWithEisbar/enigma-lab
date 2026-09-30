# Kiểm thử

## Kim tự tháp test

- Unit: core engine, stepping, validation, seeded generator.
- Integration: chuyển Codebook thành MachineConfig và round-trip JSON.
- E2E: các nút chính, vector mặc định, desktop 1440 px và mobile 390 px.

## Chạy test

```bash
pnpm test
pnpm test:e2e
pnpm verify
```

## Khi sửa lỗi

Viết test tái hiện lỗi trước hoặc cùng commit sửa. Với lỗi thuật toán, thêm vector nhỏ nhất vào package tương ứng. Với lỗi UI, thêm test theo role/label thay vì selector phụ thuộc layout khi có thể.

## Manual smoke test trước release

1. Mã hóa `HELLOWORLD` từ AAA.
2. Giải mã trở lại.
3. Generate tháng 2/1944 và xác nhận 29 ngày.
4. Export rồi import Codebook.
5. Áp khóa ngày vào máy.
6. Mở cấu hình và Codebook ở viewport 390 px.
