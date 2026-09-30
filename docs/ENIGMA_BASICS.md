# Enigma cơ bản

## Luồng tín hiệu

Một phím bấm thực hiện theo thứ tự:

1. Rotor bước.
2. Tín hiệu qua plugboard.
3. Tín hiệu đi từ rotor phải sang rotor trái.
4. Reflector đảo đường đi.
5. Tín hiệu trở lại từ trái sang phải.
6. Tín hiệu qua plugboard lần hai và bật một đèn.

Do reflector, cùng cấu hình có tính đối xứng: mã hóa bản mã từ cùng vị trí ban đầu sẽ thu lại bản rõ.

## Double-stepping

Rotor phải bước ở mọi phím. Khi rotor phải ở rãnh, rotor giữa cũng bước. Khi rotor giữa ở rãnh, rotor giữa và rotor trái cùng bước, tạo hiện tượng rotor giữa bước ở hai phím liên tiếp.

Vector quan sát với rotor I–II–III:

```text
ADU → ADV → AEW → BFX
```

## Khác nhau giữa các mẫu

| Mẫu | Rotor | Reflector |
|---|---|---|
| Enigma I | Chọn 3 rotor khác nhau từ I–V | A, B hoặc C |
| M3 | Chọn 3 rotor khác nhau từ I–VIII | B hoặc C |
| M4 | Beta/Gamma đứng yên + 3 rotor từ I–VIII | B-thin hoặc C-thin |

Rotor VI, VII và VIII có hai rãnh tại M và Z.
