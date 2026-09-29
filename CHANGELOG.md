# Lịch sử phiên bản (CHANGELOG)

Tất cả các thay đổi đáng chú ý của dự án **Ghép & Chuẩn Hóa Dữ Liệu KSK HIS (nsn-his-excel-matcher)** được ghi lại tại tài liệu này theo chuẩn NSN App Standard và Semantic Versioning.

---

## [1.0.2] - 2026-09-29

### Cải tiến (Changed)
- **Tối ưu hóa luồng giao diện sau khi ghép (UX Workflow):**
  - Tự động ẩn khung nạp 2 file đầu vào sau khi ghép dữ liệu hoàn tất để màn hình tập trung hoàn toàn vào Bảng thống kê, Khối xuất Excel nổi bật và Bảng danh sách kết quả đối chiếu.
  - Bổ sung thanh điều khiển nhỏ gọn cho phép mở lại khung nạp file (`Hiện khung nạp file`) hoặc `Xóa danh sách (Clear Import)` bất kỳ lúc nào.
- **Tên file xuất chuẩn hóa cố định (`FileMauChuan_NsN.xlsx`):**
  - Cố định tên file tải về thành `FileMauChuan_NsN.xlsx` (bỏ tiền tố timestamp ngày giờ) giúp phần mềm in tem BarTender (`.btw`) và Word Mail Merge tự động nhận diện cơ sở dữ liệu ngay lập tức mà không cần đổi tên thủ công.
  - Bổ sung khối biểu ngữ CTA tải file nổi bật với phong cách sắc nét, chuyên nghiệp ngay đầu khu vực kết quả.

---

## [1.0.1] - 2026-09-29

### Cải tiến (Changed)
- **Tối ưu hóa cơ chế đối soát Ngày sinh & Tuổi:**
  - Cùng họ tên nhưng **khác ngày tháng năm sinh** (khác tuổi) được xác định là 2 cá nhân khác nhau và tự động xếp vào danh sách **Khớp chuẩn 1-1**, bỏ qua cảnh báo để không làm phiền người dùng.
  - Hệ thống **chỉ cảnh báo** đối với trường hợp trùng lặp thực sự: **Cùng họ tên VÀ Cùng ngày tháng năm sinh / cùng tuổi**.
  - Cập nhật banner thông báo hiển thị trạng thái tích cực "0 Cảnh báo" khi toàn bộ hồ sơ đã được ghép chuẩn xác.

---

## [1.0.0] - 2026-09-29

### Tính năng mới (Added)
- **Hệ thống khóa truy cập bảo mật (LockScreenModal):** Tích hợp giao diện khóa truy cập chuẩn NSN, mật mã `namns` (không phân biệt hoa/thường/dấu) được băm SHA-256 an toàn và lưu phiên trong `localStorage`.
- **Đọc và nhận diện thông minh 2 file Excel đầu vào:**
  - File 1 (HIS): Hỗ trợ cả file `.xls` dạng bảng HTML do VNPT-HIS xuất ra và `.xlsx`, nhận diện tự động các cột: `Mã BA`, `Mã BN`, `Tên bệnh nhân`, `Ngày sinh`, `Tuổi`, `Giới tính`, `CMT/CCCD`, `SĐT`, `Đ/c`.
  - File 2 (Danh sách hồ sơ KSK): Tự động nạp sheet `Bìa` (hoặc cho phép chuyển sheet linh hoạt), nhận diện các cột: `STT`, `HOVATEN`, `GT`, `NS`, `NGHENGHIEP / Bộ phận`, `SĐT`, `TENCTY`, `ĐC 2Cấp / ĐC`.
- **Thuật toán ghép Tên + Giới tính và Cơ chế Đối soát Cảnh báo Trùng Tên Tuổi:**
  - Nhận diện các trường hợp trùng họ tên & giới tính (ví dụ trùng tên *TRẦN VĂN LÂM*, *NGUYỄN THỊ TUYẾT*).
  - Tự động kích hoạt đối soát cấp 2 theo *Ngày sinh, CCCD, SĐT* để tự động phân định đúng hồ sơ.
  - Hiển thị hộp cảnh báo màu vàng/cam nổi bật, gắn huy hiệu cảnh báo chi tiết trên từng dòng và có bộ lọc xem nhanh.
  - Hỗ trợ hộp thoại **Hiệu chỉnh thủ công (DisambiguationModal)** cho phép xem danh sách ứng viên cùng tên trên HIS và gán lại chỉ với 1 click.
- **Chuẩn hóa dữ liệu triệt để:**
  - Cắt bỏ khoảng trắng thừa ở đầu và cuối chuỗi (trim), gộp khoảng trắng kép, chuẩn hóa Unicode sang dạng NFC tiếng Việt.
  - Xử lý ngày sinh định dạng chuẩn `DD/MM/YYYY`, chuyển đổi chính xác số serial date Excel sang ngày tháng.
  - Chuẩn hóa số điện thoại, giữ nguyên số 0 ở đầu (`normalizePhone`).
- **Xuất File Mẫu Chuẩn NSN (FileMauChuan_NsN):**
  - Xuất ra file Excel với đúng 11 cột: `STT | Mã BA | Mã BN | Tên bệnh nhân | Ngày sinh | Tuổi | Giới tính | Bộ phận | SĐT | Tên C.ty | Địa Chỉ`.
  - Toàn bộ các cột đều được thiết lập tường minh là định dạng **General Text (`@`)**, chống hoàn toàn lỗi nuốt số 0 ở đầu SĐT.
  - Tên file xuất tự động theo chuẩn GMT+7: `HHmmss_FileMauChuan_NsN_yyyyMMdd.xlsx`.
- **Quy chuẩn NSN App Standard:**
  - Nút **Xóa danh sách (Clear Import)** làm sạch toàn bộ dữ liệu, input file và bộ nhớ.
  - Tab Hướng dẫn, Phiên bản, Tác giả và Mời cà phê (BIDV 8855989777 - NGUYEN SON NAM).
  - Tự động đóng gói bản Web và bản Single HTML Offline 100% (`releases/nsn-his-excel-matcher-v1.0.0-offline.html`).
