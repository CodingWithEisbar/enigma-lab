# Hướng dẫn Codebook theo tháng

## Codebook chứa gì?

Mỗi ngày có một khóa gồm:

| Trường | Ý nghĩa |
|---|---|
| `Walzenlage` | Thứ tự rotor từ trái sang phải |
| `Ringstellung` | Vị trí vòng 01–26 |
| `Steckerverbindungen` | Các cặp dây plugboard |
| `Kenngruppen` | Bốn nhóm nhận dạng, mỗi nhóm ba chữ |

**Cửa sổ khởi đầu** của từng bản tin được nhập riêng và không lưu trong khóa ngày.

## Sinh Codebook cho cả tháng

1. Mở tab **Codebook**.
2. Nhập tên bảng, mạng/đơn vị, năm và tháng.
3. Chọn mẫu máy và reflector.
4. Nhập seed nếu muốn tái lập chính xác cùng bảng. Để trống để hệ thống tự tạo seed.
5. Bấm **Sinh ngẫu nhiên cả tháng**.
6. Kiểm tra dòng trạng thái phải báo số ngày đã sinh.
7. Bấm **Xuất JSON** để sao lưu.

Cùng metadata và cùng seed sẽ tạo cùng một bảng. Generator là PRNG JavaScript có seed, phù hợp mô phỏng và test nhưng không phải bộ sinh khóa mật mã hiện đại.

## Nhập thủ công một ngày

1. Bấm **Sửa** hoặc **Nhập** ở ngày cần thay đổi.
2. Nhập rotor, ví dụ `II III IV`.
3. Nhập vòng, ví dụ `20 04 05`.
4. Nhập plugboard, ví dụ `AO BQ CL EH FT GZ IM JV KR PW`.
5. Nhập bốn Kenngruppen, ví dụ `EYF KVV GOV SML`.
6. Bấm **Lưu ngày**.

Nếu một chữ xuất hiện ở hai cặp dây, hoặc rotor bị lặp, ứng dụng sẽ từ chối lưu.

## Sinh hoặc áp dụng một ngày

1. Chọn ngày trong bảng.
2. Bấm **Sinh ngày này** nếu muốn thay khóa ngày bằng giá trị mới.
3. Nhập cửa sổ khởi đầu, hoặc bấm **Ngẫu nhiên**.
4. Bấm **Áp dụng ngày này vào máy**.
5. Ứng dụng chuyển về tab Bàn máy với rotor, vòng, reflector, plugboard và cửa sổ đã chọn.

## Import và export

- Export tạo file theo schema `enigma-codebook`, version `1`.
- Import chỉ nhận JSON nhỏ hơn 1 MB và phải vượt qua toàn bộ validation.
- Sau khi import, kiểm tra tên, tháng, model, reflector và số ngày trước khi áp dụng.
- Giữ seed nếu cần tái lập; thay seed rồi generate sẽ tạo bảng khác.

## Ví dụ từ bảng tháng 12/1944

Ngày 31 trong bảng mẫu:

```text
Walzenlage: II III IV
Ringstellung: 20 04 05
Steckerverbindungen: AO BQ CL EH FT GZ IM JV KR PW
Kenngruppen: EYF KVV GOV SML
```

Chọn một cửa sổ khởi đầu ba chữ riêng cho bản tin rồi áp dụng khóa ngày vào máy.
