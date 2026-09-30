# Đóng góp

## Luồng làm việc

1. Tạo branch từ `main`: `feat/...`, `fix/...`, `docs/...` hoặc `refactor/...`.
2. Giữ thay đổi nhỏ và tập trung vào một mục tiêu.
3. Thêm test cho logic mới hoặc lỗi vừa sửa.
4. Chạy `pnpm verify` và `pnpm test:e2e`.
5. Mở pull request, mô tả hành vi trước/sau và cách đã kiểm thử.

## Commit

Dùng Conventional Commits, ví dụ:

- `feat(codebook): add monthly key import`
- `fix(web): keep codebook buttons active on mobile`
- `docs(user): explain daily key workflow`

## Review checklist

- Không làm sai vector Enigma đã có.
- Không để logic miền nghiệp vụ phụ thuộc trình duyệt.
- Không commit secret hoặc dữ liệu thật.
- UI dùng được bằng bàn phím và màn hình 390 px.
- Tài liệu phản ánh đúng hành vi mới.
