# Chuyển đổi từ HTML đơn sang monorepo

## Hiện trạng

`legacy/enigma_simulator_v1.5.html` là bản full-feature đã kiểm chứng. `apps/web` tải snapshot này qua compatibility shell để giữ nguyên hành vi trong khi logic được tách thành package TypeScript.

## Các lát chuyển đổi

1. Hoàn tất parity test giữa legacy và `enigma-core`/`codebook-core`.
2. Tạo browser adapters cho storage, clipboard, import và download.
3. Chuyển tab Codebook sang React dùng `codebook-core`.
4. Chuyển Bàn máy và Đường tín hiệu sang React dùng `enigma-core`.
5. Bỏ iframe khi E2E parity đạt đủ; giữ standalone build cho demo offline.

Mỗi lát phải deploy được và không làm mất tính năng. Không rewrite toàn bộ UI trong một pull request.
