# Enigma Lab

Ứng dụng mô phỏng Enigma I, M3 và M4 cho mục đích học tập lịch sử. Repo dùng mô hình modular monorepo: giao diện web nằm trong `apps/`, nghiệp vụ thuần TypeScript nằm trong `packages/`, tài liệu vận hành nằm trong `docs/`.

> Enigma đã bị phá mã và **không an toàn cho dữ liệu thật**. Không dùng dự án này để bảo vệ mật khẩu, token, khóa API, dữ liệu cá nhân hoặc thông tin nhạy cảm.

## Dành cho admin / maintainer — Khởi chạy ứng dụng

### 1. Yêu cầu môi trường

- Node.js 22 LTS trở lên.
- Corepack (đi kèm Node.js) và pnpm 10.
- Git.

Kiểm tra:

```bash
node --version
corepack --version
```

### 2. Cài đặt lần đầu

```bash
git clone https://github.com/CodingWithEisbar/enigma-lab.git
cd enigma-lab
corepack enable
pnpm install --frozen-lockfile
```

Nếu repo chưa có `pnpm-lock.yaml` ở commit đầu tiên, chạy `pnpm install` một lần rồi commit lockfile.

### 3. Chạy môi trường phát triển

```bash
pnpm dev
```

Mở địa chỉ Vite in ra terminal, mặc định là `http://localhost:5173`.

### 4. Kiểm tra trước khi phát hành

```bash
pnpm verify
pnpm test:e2e
```

`verify` lần lượt chạy typecheck, lint, unit test và production build. E2E cần cài trình duyệt Playwright ở máy/runner lần đầu:

```bash
pnpm exec playwright install --with-deps chromium
```

### 5. Build và chạy bản production cục bộ

```bash
pnpm build
pnpm preview
```

Artifact của web app nằm tại `apps/web/dist/`.

### 6. Xuất file HTML độc lập

```bash
pnpm build:standalone
```

File được tạo tại `dist/enigma_simulator.html`. Đây là bản HTML tự chạy, phù hợp demo offline.

## Lệnh thường dùng

| Lệnh | Mục đích |
|---|---|
| `pnpm dev` | Chạy web app ở chế độ phát triển |
| `pnpm typecheck` | Kiểm tra TypeScript toàn workspace |
| `pnpm lint` | Kiểm tra quy ước source |
| `pnpm test` | Chạy unit test |
| `pnpm test:e2e` | Chạy kiểm thử luồng người dùng |
| `pnpm build` | Build toàn bộ packages và web app |
| `pnpm build:standalone` | Xuất một file HTML độc lập |
| `pnpm verify` | Chạy toàn bộ quality gate chính |

## Kiến trúc repo

```text
apps/web/                    Web app React + Vite
packages/enigma-core/        Máy trạng thái Enigma, không phụ thuộc DOM
packages/codebook-core/      Tạo, kiểm tra và ánh xạ Codebook
packages/shared/             Kiểu dữ liệu và tiện ích dùng chung
tests/e2e/                   Kiểm thử hành vi trên trình duyệt
fixtures/                    Dữ liệu mẫu và vector kiểm thử
docs/                        Hướng dẫn user, kiến trúc, test, bảo mật
legacy/                      Bản HTML v1.5 đã kiểm chứng
scripts/                     Công cụ build/release
```

Chi tiết: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) và [docs/README.md](docs/README.md).

## Trạng thái chuyển đổi

Web app hiện dùng một compatibility shell để chạy nguyên bản UI v1.5 đã kiểm chứng trong Vite, trong khi engine và Codebook đã có package TypeScript độc lập. Cách này giữ nguyên toàn bộ tính năng đang hoạt động và cho phép chuyển từng phần UI sang React mà không sửa thuật toán mật mã cùng lúc. Xem [docs/MIGRATION.md](docs/MIGRATION.md).

## Quy tắc đóng góp

Đọc [CONTRIBUTING.md](CONTRIBUTING.md) trước khi mở pull request. AI Agent phải đọc [AGENTS.md](AGENTS.md) và các tài liệu miền nghiệp vụ liên quan trước khi sửa code.
