# Xử lý sự cố

## Nút Codebook không phản hồi

1. Tải lại trang bằng hard refresh.
2. Đảm bảo đang mở ứng dụng qua `pnpm dev`, không mở nhầm file source chưa build.
3. Mở Console của trình duyệt và tìm lỗi JavaScript đầu tiên.
4. Chạy `pnpm verify`; nếu lỗi, gửi log và trình duyệt/thiết bị đang dùng.

## Sinh cả tháng không tạo dữ liệu

- Năm phải từ 1900 đến 2100, tháng từ 1 đến 12.
- Reflector phải phù hợp model.
- Seed tối đa 80 ký tự; có thể bấm **Tạo seed mới**.
- Dòng trạng thái dưới nút generate sẽ hiển thị lỗi cụ thể.

## Không giải mã ra nội dung ban đầu

Kiểm tra đủ sáu giá trị: model, reflector, thứ tự rotor, Ringstellung, plugboard và cửa sổ khởi đầu. Sau khi mã hóa, cửa sổ hiện tại đã thay đổi và không thể dùng thay cho cửa sổ ban đầu.

## Giao diện tràn trên điện thoại

- Xoay ngang nếu cần xem bảng rộng.
- Vuốt ngang bên trong Codebook hoặc lịch sử.
- Không dùng chế độ zoom trình duyệt quá lớn nếu thiết bị đã bật cỡ chữ hệ thống rất lớn.
- Ghi lại chiều rộng màn hình và chụp ảnh khi báo lỗi.

## Import JSON thất bại

- File phải là JSON hợp lệ, dưới 1 MB.
- `schema` phải là `enigma-codebook`, `version` phải là `1`.
- Ngày phải nằm trong tháng, rotor/vòng/dây/Kenngruppen phải hợp lệ.
- Không sửa file bằng phần mềm tự đổi số thành chuỗi hoặc mất số 0 nếu không hiểu schema.
