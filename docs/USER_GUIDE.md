# Hướng dẫn sử dụng Enigma Lab

## Mục đích

Enigma Lab mô phỏng Enigma I, M3 và M4 để học lịch sử, cơ chế rotor và cách dùng Codebook. Ứng dụng chỉ xử lý chữ A–Z; tiếng Việt được bỏ dấu, còn khoảng trắng, số và ký hiệu bị loại bỏ.

## Mã hóa bản tin đầu tiên

1. Mở tab **Bàn máy**.
2. Giữ cấu hình mặc định: Enigma I, rotor `I II III`, vòng `01 01 01`, cửa sổ `AAA`, reflector `B`, không có plugboard.
3. Nhập `HELLO WORLD` vào ô **Văn bản đầu vào**.
4. Chọn một cách chạy:
   - **Chạy bản tin**: chạy theo tốc độ đã chọn.
   - **Từng phím**: quan sát từng bước quay.
   - **Nhanh**: xử lý ngay toàn bộ phần còn lại.
5. Kết quả chuẩn là `ILBDA AMTAZ` khi bật nhóm 5 chữ.

## Giải mã

Enigma không có chế độ giải mã riêng. Cùng một cấu hình và cùng vị trí ban đầu sẽ đảo bản mã về bản rõ.

1. Ghi lại đầy đủ cấu hình và vị trí ban đầu.
2. Bấm **Giải mã kết quả** hoặc tạo bản tin mới rồi khôi phục đúng cấu hình.
3. Nhập bản mã.
4. Chạy máy. Kết quả sẽ trở về bản rõ đã chuẩn hóa.

## Cấu hình máy thủ công

Mở **Cấu hình máy** và nhập:

- **Mẫu máy**: I, M3 hoặc M4.
- **Rotor**: đọc từ trái sang phải; ba rotor chuyển động không được trùng.
- **Ringstellung**: 01–26, là độ lệch vòng chữ so với lõi dây.
- **Vị trí ban đầu**: chữ nhìn thấy qua cửa sổ trước phím đầu tiên.
- **Reflector / UKW**: phải phù hợp mẫu máy.
- **Plugboard**: mỗi chữ chỉ xuất hiện trong tối đa một cặp, ví dụ `AV BS CG`.

Với M4, rotor đầu tiên phải là `Beta` hoặc `Gamma`; rotor này đứng yên.

## Xem đường tín hiệu

1. Xử lý ít nhất một chữ.
2. Mở tab **Đường tín hiệu**.
3. Chọn bước trong danh sách để xem trạng thái rotor trước/sau và đường đi qua plugboard, rotor, reflector rồi quay lại.
4. Dùng **Phóng to sơ đồ** trên màn hình nhỏ nếu cần cuộn ngang.

## Lưu và chuyển phiên

- **Nhớ phiên trên trình duyệt này** lưu trạng thái vào browser hiện tại.
- **Xuất phiên JSON** tải cấu hình và tiến trình để mở lại.
- **Nhập phiên** chỉ nhận file JSON hợp lệ do ứng dụng tạo.
- **Tải kết quả TXT** xuất bản mã/bản rõ đã chuẩn hóa.

Không đưa secret thật vào file phiên hoặc Codebook.

## Dùng trên điện thoại

- Thanh tab và dock dưới giúp đổi khu vực.
- Bảng Codebook và bảng lịch sử có thể vuốt ngang.
- Hộp cấu hình cuộn dọc độc lập; luôn bấm **Áp dụng** trước khi đóng.
- Nếu bàn phím ảo che nút, đóng bàn phím hoặc cuộn trong hộp thoại.
