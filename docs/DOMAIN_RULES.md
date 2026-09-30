# Quy tắc miền nghiệp vụ

## Quy ước dữ liệu

- Rotor luôn đọc và lưu từ trái sang phải.
- Engine dùng vị trí/vòng theo chỉ số 0–25.
- UI và Codebook hiển thị Ringstellung theo 01–26.
- Chuỗi đưa vào máy phải là A–Z đã chuẩn hóa.
- Plugboard tối đa 13 cặp; một chữ không được dùng ở nhiều cặp.

## Stepping

- Rotor bước trước khi tín hiệu điện đi qua.
- Rotor phải luôn bước.
- Rotor giữa bước nếu rotor phải đang ở rãnh hoặc rotor giữa đang ở rãnh.
- Rotor trái bước nếu rotor giữa đang ở rãnh.
- Rãnh quay theo chữ đang hiển thị; không trừ Ringstellung khi kiểm tra notch.
- Rotor Greek của M4 không bước.

## Model constraints

- Enigma I: ba rotor khác nhau từ I–V; reflector A/B/C.
- M3: ba rotor khác nhau từ I–VIII; reflector B/C.
- M4: Beta/Gamma + ba rotor khác nhau từ I–VIII; reflector B-thin/C-thin.

## Invariants cần test

- `AAAAA → BDZGO` ở cấu hình mặc định.
- `HELLOWORLD → ILBDAAMTAZ` ở cấu hình mặc định.
- Cùng config và cùng vị trí đầu: `decrypt(encrypt(text)) = text`.
- Double-step: `ADU → ADV → AEW → BFX`.
- M4 Greek rotor đứng yên sau mọi số phím.
