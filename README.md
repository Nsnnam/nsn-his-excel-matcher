# Ghép & Chuẩn Hóa Dữ Liệu KSK HIS — Mẫu Chuẩn NSN

Ứng dụng web tự động đối soát và ghép dữ liệu khám sức khỏe định kỳ từ hệ thống VNPT-HIS với Danh sách hồ sơ KSK (Sheet Bìa) của cơ quan, nhà máy sang File Mẫu Chuẩn NSN. Tích hợp hệ thống khóa bảo mật chuẩn NSN, thuật toán nhận diện và cảnh báo trùng tên tuổi, hỗ trợ hiệu chỉnh thủ công và xuất Excel định dạng General Text 100% không mất số 0 ở đầu SĐT. Hoạt động offline 100% trên trình duyệt.

| | |
|---|---|
| **Phiên bản** | `1.0.0` |
| **Ngày phát hành** | 2026-09-29 |
| **Tác giả** | [Nguyễn Sơn Nam (Nsnnam / NamNS)](https://github.com/Nsnnam) |
| **Múi giờ** | GMT+7 (`Asia/Ho_Chi_Minh`) |
| **Kho mã nguồn** | [https://github.com/Nsnnam/nsn-his-excel-matcher](https://github.com/Nsnnam/nsn-his-excel-matcher) |
| **Trang trực tuyến (Live)** | [https://nsnnam.github.io/nsn-his-excel-matcher/](https://nsnnam.github.io/nsn-his-excel-matcher/) |
| **Bản chạy Offline 100%** | `releases/nsn-his-excel-matcher-v1.0.0-offline.html` (Mở trực tiếp trên mọi trình duyệt) |
| **Giấy phép** | MIT (Public Open-Source) |

---

## Tính năng nổi bật

1. **Khóa bảo mật truy cập chuẩn NSN (Popup Modal)**:
   - Tích hợp màn hình khóa bảo mật khớp chuẩn với mã truy cập `namns` (chấp nhận chữ hoa, chữ thường, không dấu).
   - Bảo mật chữ ký SHA-256 nội bộ, lưu trạng thái mở khóa vào `localStorage` tiện lợi.

2. **Tự động nhận diện 2 File Excel đầu vào**:
   - **File 1 (HIS):** Đọc trực tiếp file xuất danh sách tiếp nhận từ VNPT-HIS (kể cả file `.xls` dạng bảng HTML hay `.xlsx`). Trích xuất chính xác `Mã BA`, `Mã BN`, `Tên bệnh nhân`, `Ngày sinh`, `Tuổi`, `Giới tính`, `CMT/CCCD`, `SĐT`.
   - **File 2 (Danh sách KSK):** Tự động tìm và đọc sheet `Bìa` (hoặc cho phép chọn sheet bất kỳ). Trích xuất `STT`, `Họ và tên (HOVATEN)`, `Giới tính (GT)`, `Bộ phận (NGHENGHIEP)`, `SĐT`, `Tên C.ty (TENCTY)`, `Địa Chỉ (ĐC 2Cấp / ĐC)`.

3. **Thuật toán ghép thông minh & Cảnh báo Trùng Tên Tuổi**:
   - Ghép cặp chính xác dựa trên **Họ tên** và **Giới tính**.
   - **Xử lý trùng tên:** Khi phát hiện nhiều người cùng họ tên và giới tính (ví dụ: 2 người tên *TRẦN VĂN LÂM*, 2 người tên *NGUYỄN THỊ TUYẾT*), hệ thống tự động kích hoạt đối soát cấp 2 theo *Ngày sinh, CCCD hoặc SĐT*.
   - **Huy hiệu cảnh báo nổi bật:** Đánh dấu rõ ràng các trường hợp cùng tên tuổi, hiển thị hộp cảnh báo màu vàng/cam và bộ lọc nhanh.
   - **Hiệu chỉnh thủ công 1 chạm:** Cho phép người dùng nhấp xem danh sách ứng viên trên HIS để chọn đúng hồ sơ hoặc nhập bổ sung Mã BA/BN.
   - **Phát hiện hồ sơ thừa trên HIS:** Hiển thị danh sách các bệnh nhân đã tiếp nhận trên HIS nhưng chưa có trong danh sách đăng ký khám (ví dụ chuyên gia nước ngoài).

4. **Chuẩn hóa triệt để dữ liệu & Định dạng General Text**:
   - Tự động cắt bỏ mọi khoảng trắng thừa ở đầu và cuối (trim), gộp khoảng trắng liên tiếp, chuẩn hóa Unicode NFC tiếng Việt.
   - **Bảo toàn số 0 ở đầu SĐT:** Toàn bộ 11 cột xuất ra Excel đều được thiết lập tường minh là kiểu General Text (`t: 's'`, `z: '@'`), triệt tiêu hoàn toàn lỗi Excel tự ý nuốt số 0 hoặc biến SĐT thành số khoa học.

5. **Xuất File Mẫu Chuẩn NSN (11 Cột)**:
   - Tạo file Excel định dạng chuẩn `Chuan` với 11 cột:
     `STT` | `Mã BA` | `Mã BN` | `Tên bệnh nhân` | `Ngày sinh` | `Tuổi` | `Giới tính` | `Bộ phận` | `SĐT` | `Tên C.ty` | `Địa Chỉ`
   - Đặt tên file tự động theo chuẩn GMT+7: `HHmmss_FileMauChuan_NsN_yyyyMMdd.xlsx`.

6. **Nút Xóa danh sách (Clear Import Standard)**:
   - Dọn sạch toàn bộ trạng thái dữ liệu, reset file input và bộ nhớ chỉ bằng 1 thao tác có xác nhận an toàn.

7. **Hoạt động Offline 100% & Bảo vệ dữ liệu Y tế**:
   - Toàn bộ thuật toán chạy trực tiếp trên trình duyệt máy khách (Client-side), không truyền bất kỳ thông tin bệnh nhân hay bệnh án nào ra ngoài mạng Internet.

---

## Cài đặt & Khởi chạy

### Cách 1: Sử dụng trực tuyến qua GitHub Pages
Truy cập: [https://nsnnam.github.io/nsn-his-excel-matcher/](https://nsnnam.github.io/nsn-his-excel-matcher/)

### Cách 2: Sử dụng bản Offline Single HTML (Khuyên dùng trong nội bộ bệnh viện)
Tải file [`releases/nsn-his-excel-matcher-v1.0.0-offline.html`](./releases/nsn-his-excel-matcher-v1.0.0-offline.html) về máy tính và nhấp đúp chuột để mở bằng Chrome / Edge / Cốc Cốc.

### Cách 3: Chạy từ mã nguồn
```bash
git clone https://github.com/Nsnnam/nsn-his-excel-matcher.git
cd nsn-his-excel-matcher
pnpm install
pnpm run dev
```

### Đóng gói Single File Offline
```bash
pnpm run build:single
# File kết quả: releases/nsn-his-excel-matcher-v1.0.0-offline.html
```

---

## Thông tin tác giả & Ủng hộ

- **Tác giả:** Nguyễn Sơn Nam (Nsnnam / NamNS)
- **Zalo:** 0977059075
- **Email:** akahimachi@gmail.com
- **GitHub:** [https://github.com/Nsnnam](https://github.com/Nsnnam)
- **Mời cà phê tác giả:**
  - Ngân hàng: **BIDV — PGD Nguyễn Tất Thành**
  - Số tài khoản: **8855989777**
  - Chủ tài khoản: **NGUYEN SON NAM**

Xem thêm chi tiết tại [SUPPORT.md](./SUPPORT.md).
