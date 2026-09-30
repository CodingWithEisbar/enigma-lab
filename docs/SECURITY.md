# Bảo mật

## Phạm vi

Đây là phần mềm giáo dục. Enigma không đáp ứng bất kỳ yêu cầu mật mã hiện đại nào và không được dùng để bảo vệ dữ liệu thật.

## Dữ liệu người dùng

- Ứng dụng mặc định chạy client-side, không gửi bản tin lên server.
- Tính năng nhớ phiên dùng storage của trình duyệt; người dùng phải tự xóa dữ liệu trên thiết bị dùng chung.
- File import được coi là dữ liệu không tin cậy: giới hạn kích thước, parse JSON và validate schema trước khi dùng.

## Quy tắc developer

- Không dùng `innerHTML` với dữ liệu import hoặc input người dùng.
- Không commit `.env`, token, khóa API hay Codebook có dữ liệu thật.
- External link phải dùng `rel="noopener noreferrer"`.
- Dependency update phải qua CI và review thay đổi lockfile.
- Không quảng bá seeded PRNG của Codebook là CSPRNG.

## Báo cáo lỗ hổng

Không đăng secret hoặc proof-of-concept chứa dữ liệu thật trong issue công khai. Với repo private, tạo issue gắn nhãn `security`; nếu repo chuyển public, cấu hình GitHub Private Vulnerability Reporting trước release.
