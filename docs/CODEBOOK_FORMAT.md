# Định dạng Enigma Codebook v1

## Ví dụ JSON

```json
{
  "schema": "enigma-codebook",
  "version": 1,
  "name": "U571 · MẪU THÁNG 12",
  "network": "GEHEIM",
  "seed": "U571-1944-12",
  "year": 1944,
  "month": 12,
  "model": "I",
  "reflector": "B",
  "days": {
    "31": {
      "rotors": ["II", "III", "IV"],
      "rings": [20, 4, 5],
      "plugs": ["AO", "BQ", "CL", "EH", "FT", "GZ", "IM", "JV", "KR", "PW"],
      "kenngruppen": ["EYF", "KVV", "GOV", "SML"]
    }
  }
}
```

## Validation

- `schema` và `version` là discriminator bắt buộc.
- `days` dùng ngày không có số 0 ở đầu làm key JSON.
- `rings` là số 1–26, không phải chỉ số engine.
- Mỗi ngày có đúng 4 Kenngruppen khác nhau.
- Import hiện giới hạn 1 MB ở UI.

Khi thay đổi không tương thích, tăng `version` và thêm migration; không âm thầm đổi nghĩa trường v1.
