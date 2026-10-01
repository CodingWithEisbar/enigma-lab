# Enigma cơ bản

## Bối cảnh ra đời

Enigma không khởi đầu như một vũ khí bí mật của Đức Quốc xã. Kỹ sư người Đức Arthur Scherbius phát triển và đăng ký bằng sáng chế cho thiết kế ban đầu ngay sau Thế chiến I. Trong thập niên 1920, các phiên bản Enigma được chào bán như máy mã hóa thương mại cho doanh nghiệp và tổ chức cần bảo vệ điện tín.

Khi liên lạc vô tuyến trở nên quan trọng, quân đội Đức đã cải tiến Enigma để sử dụng trong các lực lượng vũ trang. Máy có tốc độ vận hành cao, dễ mang theo và cho phép hai đơn vị ở xa trao đổi thông tin mã hóa nếu cùng sở hữu cấu hình khóa trong ngày. Trong Thế chiến II, nhiều biến thể được sử dụng; vì vậy “Enigma” là tên của cả một họ máy chứ không chỉ một thiết bị duy nhất.

## Cách thức hoạt động cơ bản

Có thể hình dung Enigma là một hệ thống thay thế chữ cái nhưng bảng thay thế thay đổi sau mỗi lần nhấn phím. Điều này làm cho cùng một chữ cái trong bản rõ có thể biến thành những chữ cái khác nhau tùy thời điểm.

| Bộ phận | Vai trò |
|---|---|
| Bàn phím và bảng đèn | Người vận hành nhập một chữ cái và đọc chữ cái kết quả trên đèn sáng. |
| Plugboard (Steckerbrett) | Hoán đổi các cặp chữ cái trước và sau khi tín hiệu đi qua rotor. |
| Rotor | Mỗi rotor chứa một phép hoán vị 26 chữ cái; thứ tự và vị trí rotor quyết định đường đi của tín hiệu. |
| Ring setting (Ringstellung) | Dịch tương quan giữa vòng chữ cái hiển thị và dây nối bên trong rotor. |
| Reflector (Umkehrwalze) | Phản xạ tín hiệu trở lại qua các rotor theo chiều ngược lại. |
| Cơ cấu bước | Làm rotor quay theo mỗi lần nhấn phím, khiến phép thay thế liên tục thay đổi. |

Một khóa vận hành đầy đủ thường bao gồm mẫu máy, bộ rotor và thứ tự lắp, ring setting, vị trí bắt đầu, reflector và các cặp nối plugboard. Chỉ cần một thành phần không khớp, bên nhận sẽ không khôi phục đúng thông điệp.

### Luồng tín hiệu của một phím bấm

Một phím bấm thực hiện theo thứ tự:

1. Rotor bước.
2. Tín hiệu qua plugboard.
3. Tín hiệu đi từ rotor phải sang rotor trái.
4. Reflector đảo đường đi.
5. Tín hiệu trở lại từ trái sang phải.
6. Tín hiệu qua plugboard lần hai và bật một đèn.

Do reflector, cùng cấu hình có tính đối xứng: nhập bản mã từ đúng cấu hình và vị trí ban đầu sẽ thu lại bản rõ. Reflector cũng khiến một chữ cái không bao giờ được mã hóa thành chính nó — một đặc điểm về sau trở thành manh mối hữu ích cho các nhà giải mã.

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

## Thông tin thêm: hành trình phá mã Enigma trong Thế chiến II

Thành công tại Bletchley Park thường gắn với nước Anh và Alan Turing, nhưng đó là kết quả của một chuỗi hợp tác quốc tế, nhiều năm nghiên cứu và một hệ thống vận hành quy mô lớn.

1. **Nền móng từ Ba Lan:** Từ năm 1932, Marian Rejewski thuộc Cục Mật mã Ba Lan đã dùng toán học để tái dựng cấu trúc Enigma quân sự. Cùng Jerzy Różycki và Henryk Zygalski, ông phát triển các phương pháp và thiết bị hỗ trợ tìm khóa, trong đó có *bomba kryptologiczna*.
2. **Chuyển giao trước chiến tranh:** Ngày 25–26 tháng 7 năm 1939, tại cuộc gặp gần Warsaw, phía Ba Lan chia sẻ kiến thức, phương pháp và bản sao Enigma với đại diện Anh và Pháp. Nguồn tri thức này giúp Anh rút ngắn đáng kể giai đoạn khởi đầu.
3. **Mở rộng tại Bletchley Park:** Sau khi chiến tranh bùng nổ, Government Code and Cypher School của Anh tập trung các nhà toán học, ngôn ngữ học, kỹ sư, quân nhân và hàng nghìn nhân viên hỗ trợ tại Bletchley Park. Alan Turing, Gordon Welchman, Dilly Knox, Peter Twinn và nhiều đồng nghiệp đã phát triển các phương pháp mới cho nhiều mạng Enigma khác nhau.
4. **Bombe và “crib”:** Máy Bombe của Anh không đơn giản là thử mọi khóa rồi tự in ra bản rõ. Nó dùng một đoạn bản rõ được phỏng đoán, gọi là *crib*, cùng các ràng buộc logic của Enigma để loại nhanh những cấu hình bất khả thi. Các cấu hình còn lại vẫn phải được con người kiểm tra trên máy Enigma hoặc thiết bị tương đương.
5. **Một cuộc đua liên tục:** Đức thường thay đổi khóa hằng ngày, thay quy trình và đưa vào các biến thể mới. Enigma của Hải quân, đặc biệt mạng U-boat và máy M4, khó xử lý hơn. Việc thu được tài liệu khóa, máy móc và quy trình vận hành từ phía Đức đôi khi có ý nghĩa quyết định trong việc khôi phục khả năng đọc điện văn.
6. **Từ bản mã đến tình báo:** Sau khi tìm được khóa, các đài nghe phải thu tín hiệu, đội giải mã xử lý điện văn, chuyên gia ngôn ngữ dịch và nhà phân tích đánh giá độ tin cậy. Tình báo thu được từ các hệ thống mã cấp cao của Đức được quản lý dưới mật danh **ULTRA** và phải được sử dụng cẩn thận để tránh làm lộ nguồn.

### Điều cần ghi nhớ

- Enigma không bị “phá một lần là xong”; khả năng đọc điện văn có thể mất đi rồi được khôi phục khi khóa, máy hoặc quy trình thay đổi.
- Thành công của Anh dựa trên nền móng quan trọng của Ba Lan, sự hợp tác với Pháp, kỹ thuật cơ điện, các điểm yếu trong quy trình vận hành và công sức của một lực lượng rất lớn — không phải thành tựu của một cá nhân duy nhất.
- Các máy Bombe giúp thu hẹp không gian tìm kiếm; chất lượng của *crib*, tình báo thu được và quyết định của con người vẫn là yếu tố thiết yếu.

### Nguồn đọc thêm

- [Bletchley Park: Enigma](https://www.bletchleypark.org.uk/our-story/enigma/)
- [GCHQ: The Pyry Forest meeting](https://www.gchq.gov.uk/information/the-pyry-forest-meeting)
- [Imperial War Museums: The Secret War](https://www.iwm.org.uk/history/second-world-war/intelligence/secret-war-what-you-need-to-know)
- [Crypto Museum: Enigma history](https://www.cryptomuseum.com/crypto/enigma/hist.htm)
