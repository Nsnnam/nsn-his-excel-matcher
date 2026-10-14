# Ghép & Chuẩn Hóa Dữ Liệu KSK HIS — Mẫu Chuẩn NSN

Ứng dụng web tự động đối soát và ghép dữ liệu khám sức khỏe định kỳ từ hệ thống VNPT-HIS với Danh sách hồ sơ KSK (Sheet Bìa) của cơ quan, nhà máy sang File Mẫu Chuẩn NSN. Tích hợp hệ thống khóa bảo mật chuẩn NSN, thuật toán nhận diện và cảnh báo trùng tên tuổi, tự động nhận diện và fallback tên công ty từ "Nơi làm việc" trên HIS, hỗ trợ hiệu chỉnh thủ công và xuất Excel định dạng General Text 100% không mất số 0 ở đầu SĐT. Cố định tên file xuất phục vụ trực tiếp cho phần mềm in tem BarTender (`.btw`) và Word Mail Merge. Hoạt động offline 100% trên trình duyệt.

| Thông tin | Giá trị chuẩn |
|---|---|
| **Phiên bản** | `1.0.7` (Mới nhất) |
| **Ngày phát hành** | 2026-10-14 |
| **Tác giả** | [Nguyễn Sơn Nam (Nsnnam / NamNS)](https://github.com/Nsnnam) |
| **Múi giờ** | GMT+7 (`Asia/Ho_Chi_Minh`) |
| **Kho mã nguồn** | [https://github.com/Nsnnam/nsn-his-excel-matcher](https://github.com/Nsnnam/nsn-his-excel-matcher) |
| **Trang trực tuyến (Live)** | [https://nsnnam.github.io/nsn-his-excel-matcher/](https://nsnnam.github.io/nsn-his-excel-matcher/) |
| **Bản chạy Offline 100%** | `releases/nsn-his-excel-matcher-v1.0.7-offline.html` (Hoặc file standalone copy trực tiếp trên Desktop) |
| **Khóa truy cập** | `namns` (Không phân biệt hoa thường) |
| **Giấy phép** | MIT (Public Open-Source) |

---

## Tính năng nổi bật & Quy trình nghiệp vụ

### 1. Khóa bảo mật truy cập chuẩn NSN (Popup Modal)
- Tích hợp màn hình khóa bảo mật khớp chuẩn với mã truy cập `namns` (chấp nhận chữ hoa, chữ thường, không dấu).
- Bảo mật chữ ký SHA-256 nội bộ, lưu trạng thái mở khóa vào `localStorage` tiện lợi.

### 2. Tùy Chọn & Ưu Tiên Nơi Làm Việc / Tên C.ty & Địa Chỉ Công Ty (v1.0.7 MỚI)
- **Tùy chọn Nguồn Nơi làm việc / Tên C.ty ưu tiên:**
  - Hỗ trợ linh hoạt 2 chế độ: `Ưu tiên Bìa (dự phòng HIS)` và `Ưu tiên HIS (dự phòng Bìa)`.
  - Có mặt đồng bộ ở cả Giao diện nạp file ban đầu và Thanh quản lý file kết quả.
  - Tự động fallback thông minh lấy từ nguồn còn lại nếu ô dữ liệu ở nguồn chính bị để trống.
- **Bổ sung Dropdown chọn Cột Nơi làm việc cho File HIS:**
  - Tự động nhận diện chính xác các cột `Nơi làm việc`, `Nơi LV`, `Cơ quan`, `Công ty` trên file HIS.
  - Cho phép người dùng chọn lại thủ công bất kỳ cột nào trong file HIS kèm ký hiệu cột Excel (`[A]`, `[B]`, `[O]...`) hoặc chọn `-- Không dùng --`.
- **Tự động nhận diện chuẩn xác Địa chỉ công ty & Loại bỏ nhầm lẫn:**
  - Nhận diện các cột địa chỉ công ty (`DCCTY`, `ĐCCTY`, `Địa chỉ công ty`, `Địa chỉ C.ty`, `ĐC Cty`...) vào trường Địa chỉ, loại bỏ triệt để khỏi bộ nhận diện Tên công ty.
  - Đầy đủ chỗ để chọn khi không tự động nhận diện: Cả File HIS (Nơi làm việc, Địa chỉ) và File Bìa (Bộ phận/Đơn vị, Nơi LV/Tên C.ty, Địa chỉ/ĐC Cty).
- **Cơ chế Reactive Re-matching tức thì:**
  - Thay đổi bất kỳ cột hoặc độ ưu tiên nào sẽ kích hoạt đối soát lại dữ liệu tự động ngay lập tức.

### 3. Tự động nhận diện & Cho phép chọn cột Bộ phận, Tên C.ty, Địa chỉ (v1.0.6)
- **Khắc phục triệt để lỗi DONVI:**
  - Nhận diện chuẩn xác `DONVI` hoặc `Đơn vị` vào cột **Bộ phận** (thay vì bị nhầm sang Tên công ty hay Địa chỉ).
  - Cột `TEN C.TY` hoặc `Công ty` được nhận diện chuẩn xác vào **Tên C.ty**.
- **Dropdown chọn cột Tên C.ty / Công ty:**
  - Tự động nhận diện các biến thể: `TEN C.TY`, `Tên C.ty`, `Công ty`, `C.ty`, `Cơ quan`, `Doanh nghiệp`, `DCCTY`, `ĐCCTY`, `Địa chỉ C.ty`...
  - Cho phép chọn bất kỳ cột nào trong sheet hoặc chọn `-- Tự động lấy Nơi làm việc từ HIS --`.
- **Dropdown chọn cột Bộ phận:**
  - Tự động nhận diện: `Bộ phận`, `BP`, `Phòng ban`, `Phòng`, `Khoa`, `Tổ`, `Đội`, `Đơn vị`, `DONVI`, `Chức danh`, `Nghề nghiệp`...
  - Cho phép tùy chọn cột hoặc chọn `-- Để trống --`.
- **Dropdown chọn cột Địa chỉ & Hiển thị chữ cái cột Excel ([A], [B], [C]...):**
  - Tự động nhận diện các biến thể: `ĐC`, `Đ/C`, `DC`, `Địa chỉ`, `Dia chi`, `ĐC 2Cấp`, `Nơi thường trú`, `Hộ khẩu`, `HKTT`...
  - Toàn bộ menu chọn cột đều hiển thị chữ cái cột Excel (`[A]`, `[B]`, `[K]`, `[M]...`) giúp người dùng đối chiếu tức thì với file Excel trên máy tính.
  - Tích hợp đồng bộ ở cả 2 màn hình: Nạp file ban đầu (`FileUploadSection`) và Thanh quản lý file kết quả (`ResultsFileManagerBar`).

### 4. Tự động nhận diện Địa chỉ ở cả 2 file & Thứ tự ưu tiên (v1.0.5)
- **Tự động nhận diện Địa chỉ ở cả 2 nguồn:**
  - File HIS: Nhận diện tự động cột `Đ/c BN`, `Đ/c`, `Địa chỉ`, `Hộ khẩu`, `HKTT`, `Thường trú`...
  - File Bìa: Nhận diện tự động cột `ĐC 2Cấp`, `Địa chỉ`, `ĐC`, `Địa chỉ (sau sáp nhập)`... với thuật toán ưu tiên địa chỉ chi tiết hơn và bỏ qua cột địa chỉ công ty.
  - Gắn huy hiệu trực quan trên từng file: `📍 Đã nhận diện Đ/C` (xanh) hoặc `⚠️ Chưa có cột Đ/C` (vàng hổ phách).
- **Chọn cột thủ công linh hoạt:** Nếu file có cấu trúc bất thường hoặc người dùng muốn đổi cột khác, mỗi file đều có menu thả xuống để chọn trực tiếp bất kỳ cột nào trong sheet.
- **Tùy chọn thứ tự ưu tiên:** Hỗ trợ `Ưu tiên Bìa (dự phòng HIS)` và `Ưu tiên HIS (dự phòng Bìa)`. Tự động fallback lấy dữ liệu nguồn phụ nếu dòng bệnh nhân bị trống địa chỉ ở nguồn chính.
- **Cập nhật tức thì ở cả 2 giao diện:** Cho phép tinh chỉnh cột và ưu tiên địa chỉ tại màn hình nạp file hoặc ngay trên thanh quản lý file sau khi đã ghép dữ liệu xong.

### 5. Tự động nhận diện 2 File Excel đầu vào & Nạp nhiều file (v1.0.4)
- **File 1 (HIS):** Đọc trực tiếp file xuất danh sách tiếp nhận từ VNPT-HIS (hỗ trợ cả file `.xls` dạng bảng HTML hay `.xlsx`). Trích xuất chính xác `Mã BA`, `Mã BN`, `Tên bệnh nhân`, `Ngày sinh`, `Tuổi`, `Giới tính`, `CMT/CCCD`, `SĐT`, `Nơi làm việc`, `Địa chỉ`.
- **File 2 (Danh sách KSK):** Tự động tìm và đọc sheet `Bìa` (hoặc cho phép chọn sheet bất kỳ). Trích xuất `STT`, `Họ và tên (HOVATEN)`, `Giới tính (GT)`, `Bộ phận (NGHENGHIEP)`, `SĐT`, `Tên C.ty`, `Địa Chỉ`.
- **Nạp nhiều file & Live replace:** Hỗ trợ nạp dồn nhiều file HIS / Bìa cùng lúc, khử trùng lặp HIS thông minh, thay thế từng file hoặc toàn bộ trực tiếp.

### 6. Tự động nhận diện Tên công ty & Fallback từ "Nơi làm việc" trên HIS (v1.0.3)
- **Nhận diện đa dạng trên sheet Bìa:** Hệ thống tự động bắt các tiêu đề cột như `TENCTY`, `Tên C.ty`, `C.ty`, `Cơ quan`, `CT`, `CQ`, `Đơn vị`, `Doanh nghiệp`... hoặc tiêu đề công ty ở phần đầu sheet.
- **Tự động lấy từ "Nơi làm việc" trong HIS:** Nếu file sheet Bìa *không có cột tên công ty* hoặc *ô dữ liệu bị để trống*, hệ thống sẽ tự động lấy trực tiếp từ trường **"Nơi làm việc"** của hồ sơ bệnh nhân tương ứng trên HIS.
- **Kế thừa toàn đợt khám:** Kể cả trường hợp hồ sơ chưa khớp được trên HIS, ứng dụng vẫn tự động gán tên cơ quan chung của đợt khám từ file HIS để file xuất ra không bao giờ bị khuyết cột *Tên C.ty*.

### 7. Thuật toán ghép thông minh & Đối soát Tuổi / Ngày sinh (v1.0.1)
- **Ghép cặp Tên & Giới tính:** Chuẩn hóa khoảng trắng đầu cuối, xóa ký tự ẩn, chuyển Unicode NFC.
- **Cùng tên nhưng khác ngày sinh / tuổi:** Được xác định chắc chắn là 2 cá nhân khác nhau, tự động xếp vào nhóm **Khớp chuẩn 1-1** và **bỏ qua cảnh báo** để không làm phiền người dùng.
- **Chỉ cảnh báo khi trùng thực sự:** Khi phát hiện các trường hợp cùng tên VÀ cùng ngày tháng năm sinh trên HIS, hệ thống bật cảnh báo màu vàng <span style="color:#b45309;font-weight:bold;">⚠️ Trùng tên tuổi</span>.
- **Hiệu chỉnh thủ công 1 chạm:** Cho phép người dùng nhấp xem danh sách ứng viên trên HIS để chọn đúng hồ sơ hoặc nhập bổ sung Mã BA/BN.

### 8. Tối ưu hóa luồng giao diện sau khi ghép (v1.0.2)
- **Tự động ẩn khung nạp 2 file đầu vào:** Sau khi ghép dữ liệu hoàn tất, 2 khung nạp file lớn sẽ tự động ẩn đi để nhường toàn bộ không gian màn hình cho Thống kê, Khối xuất Excel nổi bật và Bảng danh sách đối chiếu.
- **Thanh điều khiển thu gọn:** Bổ sung nút **"Hiện khung nạp file"** để mở lại khi cần và nút **"Xóa DS (Clear Import)"** chuẩn NSN.

### 9. Xuất File Mẫu Chuẩn NSN Cho In Tem BarTender & Mail Merge (v1.0.2)
- **Cố định tên file xuất:** Luôn xuất ra tên file `FileMauChuan_NsN.xlsx` (bỏ tiền tố timestamp ngày giờ) giúp phần mềm in tem **BarTender (.btw)** và tính năng **Word Mail Merge** tự động nhận diện cơ sở dữ liệu ngay lập tức mà không cần đổi tên thủ công.
- **Khối biểu ngữ CTA tải file nổi bật:** Bố trí nút tải file siêu lớn, màu sắc bắt mắt ngay trên đầu bảng kết quả.
- **11 cột tiêu chuẩn:**
  `STT` | `Mã BA` | `Mã BN` | `Tên bệnh nhân` | `Ngày sinh` | `Tuổi` | `Giới tính` | `Bộ phận` | `SĐT` | `Tên C.ty` | `Địa Chỉ`
- **Định dạng General Text (@):** Toàn bộ 11 cột đều được thiết lập tường minh là kiểu văn bản (`t: 's'`, `z: '@'`), triệt tiêu hoàn toàn lỗi Excel nuốt số 0 ở đầu SĐT (ví dụ `0981...`) hoặc biến SĐT thành số khoa học.

### 10. Hướng dẫn & Lịch sử phiên bản đa điểm chạm
- Nút **"Hướng dẫn"** và **"Lịch sử (v1.0.7)"** hiển thị rõ ràng trên thanh Navbar và Footer.
- Huy hiệu phiên bản `v1.0.7` có thể nhấp để mở trực tiếp nhật ký thay đổi qua từng phiên bản.

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

- **v1.0.4 (2026-10-04):**
  - Hỗ trợ nạp dồn nhiều file cùng lúc cho cả File 1 (HIS `.xls`/`.xlsx`) và File 2 (Danh sách Bìa `.xlsx`/`.xls`) qua nút "+ Thêm file" hoặc kéo thả nhiều file.
  - Hỗ trợ cơ chế thay thế trực tiếp: Thay thế toàn bộ danh sách hoặc thay thế từng file đơn lẻ bằng nút "🔄 Thay" ngay trên danh sách nạp.
  - Tự động đối soát và cho phép chọn sheet độc lập cho từng file Bìa khi import nhiều file khác nhau.
  - Bổ sung thanh quản lý file tương tác trực tiếp ngay tại màn hình kết quả đối soát (`ResultsFileManagerBar`): Cho phép thêm mới, thay thế, đổi sheet hoặc xóa file mà không cần quay lại từ đầu.
  - Cơ chế re-matching tự động tức thì ngay khi có bất kỳ thay đổi file nào.
- **v1.0.3 (2026-10-01):**
  - Tự động nhận diện các biến thể tên công ty trên sheet Bìa (`TENCTY`, `Tên C.ty`, `C.ty`, `Cơ quan`, `CT`, `CQ`, `Đơn vị`, `Doanh nghiệp`...).
  - Tự động fallback lấy trực tiếp từ cột "Nơi làm việc" trong file HIS nếu không tìm thấy tên công ty ở file sheet Bìa.
  - Tự động kế thừa "Nơi làm việc" chung của đợt khám từ file HIS cho toàn bộ danh sách khi xuất Excel.
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
