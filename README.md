# Ghép & Chuẩn Hóa Dữ Liệu KSK HIS — Mẫu Chuẩn NSN

Ứng dụng web tự động đối soát và ghép dữ liệu khám sức khỏe định kỳ từ hệ thống VNPT-HIS với Danh sách hồ sơ KSK (Sheet Bìa) của cơ quan, nhà máy sang File Mẫu Chuẩn NSN. Tích hợp hệ thống khóa bảo mật chuẩn NSN, thuật toán nhận diện và cảnh báo trùng tên tuổi, hỗ trợ hiệu chỉnh thủ công và xuất Excel định dạng General Text 100% không mất số 0 ở đầu SĐT. Cố định tên file xuất phục vụ trực tiếp cho phần mềm in tem BarTender (`.btw`) và Word Mail Merge. Hoạt động offline 100% trên trình duyệt.

| Thông tin | Giá trị chuẩn |
|---|---|
| **Phiên bản** | `1.0.2` (Mới nhất) |
| **Ngày phát hành** | 2026-09-29 |
| **Tác giả** | [Nguyễn Sơn Nam (Nsnnam / NamNS)](https://github.com/Nsnnam) |
| **Múi giờ** | GMT+7 (`Asia/Ho_Chi_Minh`) |
| **Kho mã nguồn** | [https://github.com/Nsnnam/nsn-his-excel-matcher](https://github.com/Nsnnam/nsn-his-excel-matcher) |
| **Trang trực tuyến (Live)** | [https://nsnnam.github.io/nsn-his-excel-matcher/](https://nsnnam.github.io/nsn-his-excel-matcher/) |
| **Bản chạy Offline 100%** | `releases/nsn-his-excel-matcher-v1.0.2-offline.html` (Hoặc file standalone copy trực tiếp trên Desktop) |
| **Khóa truy cập** | `namns` (Không phân biệt hoa thường) |
| **Giấy phép** | MIT (Public Open-Source) |

---

## Tính năng nổi bật & Quy trình nghiệp vụ

### 1. Khóa bảo mật truy cập chuẩn NSN (Popup Modal)
- Tích hợp màn hình khóa bảo mật khớp chuẩn với mã truy cập `namns` (chấp nhận chữ hoa, chữ thường, không dấu).
- Bảo mật chữ ký SHA-256 nội bộ, lưu trạng thái mở khóa vào `localStorage` tiện lợi.

### 2. Tự động nhận diện 2 File Excel đầu vào
- **File 1 (HIS):** Đọc trực tiếp file xuất danh sách tiếp nhận từ VNPT-HIS (hỗ trợ cả file `.xls` dạng bảng HTML hay `.xlsx`). Trích xuất chính xác `Mã BA`, `Mã BN`, `Tên bệnh nhân`, `Ngày sinh`, `Tuổi`, `Giới tính`, `CMT/CCCD`, `SĐT`.
- **File 2 (Danh sách KSK):** Tự động tìm và đọc sheet `Bìa` (hoặc cho phép chọn sheet bất kỳ). Trích xuất `STT`, `Họ và tên (HOVATEN)`, `Giới tính (GT)`, `Bộ phận (NGHENGHIEP)`, `SĐT`, `Tên C.ty (TENCTY)`, `Địa Chỉ (ĐC 2Cấp / ĐC)`.

### 3. Thuật toán ghép thông minh & Đối soát Tuổi / Ngày sinh (v1.0.1)
- **Ghép cặp Tên & Giới tính:** Chuẩn hóa khoảng trắng đầu cuối, xóa ký tự ẩn, chuyển Unicode NFC.
- **Cùng tên nhưng khác ngày sinh / tuổi:** Được xác định chắc chắn là 2 cá nhân khác nhau, tự động xếp vào nhóm **Khớp chuẩn 1-1** và **bỏ qua cảnh báo** để không làm phiền người dùng.
- **Chỉ cảnh báo khi trùng thực sự:** Khi phát hiện các trường hợp cùng tên VÀ cùng ngày tháng năm sinh trên HIS, hệ thống bật cảnh báo màu vàng <span style="color:#b45309;font-weight:bold;">⚠️ Trùng tên tuổi</span>.
- **Hiệu chỉnh thủ công 1 chạm:** Cho phép người dùng nhấp xem danh sách ứng viên trên HIS để chọn đúng hồ sơ hoặc nhập bổ sung Mã BA/BN.

### 4. Tối ưu hóa luồng giao diện sau khi ghép (v1.0.2)
- **Tự động ẩn khung nạp 2 file đầu vào:** Sau khi ghép dữ liệu hoàn tất, 2 khung nạp file lớn sẽ tự động ẩn đi để nhường toàn bộ không gian màn hình cho Thống kê, Khối xuất Excel nổi bật và Bảng danh sách đối chiếu.
- **Thanh điều khiển thu gọn:** Bổ sung nút **"Hiện khung nạp file"** để mở lại khi cần và nút **"Xóa DS (Clear Import)"** chuẩn NSN.

### 5. Xuất File Mẫu Chuẩn NSN Cho In Tem BarTender & Mail Merge (v1.0.2)
- **Cố định tên file xuất:** Luôn xuất ra tên file `FileMauChuan_NsN.xlsx` (bỏ tiền tố timestamp ngày giờ) giúp phần mềm in tem **BarTender (.btw)** và tính năng **Word Mail Merge** tự động nhận diện cơ sở dữ liệu ngay lập tức mà không cần đổi tên thủ công.
- **Khối biểu ngữ CTA tải file nổi bật:** Bố trí nút tải file siêu lớn, màu sắc bắt mắt ngay trên đầu bảng kết quả.
- **11 cột tiêu chuẩn:**
  `STT` | `Mã BA` | `Mã BN` | `Tên bệnh nhân` | `Ngày sinh` | `Tuổi` | `Giới tính` | `Bộ phận` | `SĐT` | `Tên C.ty` | `Địa Chỉ`
- **Định dạng General Text (@):** Toàn bộ 11 cột đều được thiết lập tường minh là kiểu văn bản (`t: 's'`, `z: '@'`), triệt tiêu hoàn toàn lỗi Excel nuốt số 0 ở đầu SĐT (ví dụ `0981...`) hoặc biến SĐT thành số khoa học.

### 6. Hướng dẫn & Lịch sử phiên bản đa điểm chạm
- Nút **"Hướng dẫn"** và **"Lịch sử (v1.0.2)"** hiển thị rõ ràng trên thanh Navbar và Footer.
- Huy hiệu phiên bản `v1.0.2` có thể nhấp để mở trực tiếp nhật ký thay đổi qua từng phiên bản.

---

## Cài đặt & Khởi chạy

### Cách 1: Sử dụng trực tuyến qua GitHub Pages
Truy cập: [https://nsnnam.github.io/nsn-his-excel-matcher/](https://nsnnam.github.io/nsn-his-excel-matcher/)

### Cách 2: Sử dụng bản Offline Single HTML (Khuyên dùng trong nội bộ bệnh viện)
Mở trực tiếp file `Ghep_File_HIS_Sang_Mau_Chuan_NSN.html` trên máy tính bằng Chrome / Edge / Cốc Cốc mà không cần cài đặt Node.js hay internet.

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
# Kết quả xuất ra file đơn độc lập trong thư mục releases/
```

---

## Lịch sử phiên bản tóm tắt

- **v1.0.2 (2026-09-29):**
  - Tự động ẩn khung nạp 2 file sau khi ghép dữ liệu xong, tập trung màn hình vào Thống kê, Khối xuất Excel nổi bật và Bảng đối chiếu.
  - Cố định tên file xuất ra thành `FileMauChuan_NsN.xlsx` phục vụ trực tiếp phần mềm in tem BarTender (`.btw`) và Word Mail Merge.
  - Thêm biểu ngữ CTA tải file nổi bật, bổ sung nút "Hiện khung nạp file" và cập nhật đầy đủ Hướng dẫn, Lịch sử phiên bản.
- **v1.0.1 (2026-09-29):**
  - Tối ưu hóa đối soát Ngày sinh & Tuổi: Cùng họ tên nhưng khác ngày sinh/tuổi là 2 người khác nhau, tự động xếp vào Khớp chuẩn 1-1 và bỏ qua cảnh báo.
  - Chỉ cảnh báo đối với trường hợp trùng lặp thực sự: Cùng họ tên VÀ cùng ngày tháng năm sinh trên HIS.
- **v1.0.0 (2026-09-29):**
  - Khóa truy cập bảo mật qua mã popup chuẩn NSN (`namns`).
  - Đọc tự động file xuất VNPT-HIS (.xls/.xlsx) và Danh sách hồ sơ KSK (Sheet Bìa).
  - Thuật toán ghép thông minh, đối soát cấp 2 theo Ngày sinh, CCCD, SĐT.
  - Hộp thoại hiệu chỉnh thủ công (DisambiguationModal) trực quan.
  - Chuẩn hóa triệt để dữ liệu: loại bỏ khoảng trắng thừa, Unicode NFC.
  - Xuất 11 cột mẫu chuẩn NSN định dạng 100% General Text (@) không mất số 0 đầu SĐT.
  - Nút Xóa danh sách (Clear Import) chuẩn NSN và đóng gói Offline 100%.

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

Xem thêm chi tiết tại [CHANGELOG.md](./CHANGELOG.md) và [SUPPORT.md](./SUPPORT.md).
