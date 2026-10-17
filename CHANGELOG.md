# Lịch sử phiên bản (CHANGELOG)

Tất cả các thay đổi đáng chú ý của dự án **Ghép & Chuẩn Hóa Dữ Liệu KSK HIS (nsn-his-excel-matcher)** được ghi lại tại tài liệu này theo chuẩn NSN App Standard và Semantic Versioning.

## [1.0.8] - 2026-10-17

### Tính năng mới (Added) & Tối ưu hóa (Enhanced)
- **Thuật toán đối soát ngày sinh phân tầng thông minh (Tiered DOB Matching):**
  - Tự động so sánh chi tiết cả **ngày, tháng và năm sinh** khi phát hiện các trường hợp cùng họ tên và cùng năm sinh (cùng tuổi).
  - Phân biệt chính xác từng cá nhân: Những người cùng năm sinh nhưng khác ngày/tháng sinh (ví dụ: `02/09/1997` vs `22/10/1997`) được xác định chắc chắn là 2 người hoàn toàn khác nhau.
  - Tự động xếp các trường hợp này vào nhóm **Khớp chuẩn 1-1** (`exact_single`), loại bỏ 100% cảnh báo trùng lặp sai.
- **Hệ thống phân tầng ưu tiên độ khớp ngày sinh:**
  - *Mức 1 (Exact Full Date)*: Khớp tuyệt đối cả ngày/tháng/năm (Điểm 3). Luôn được ưu tiên ghép trước.
  - *Mức 2 (Exact Month/Year)*: Khớp tháng và năm sinh (Điểm 2).
  - *Mức 3 (Compatible Year)*: Khớp năm sinh khi một hoặc hai nguồn chỉ ghi năm sinh hoặc tuổi (Điểm 1).
  - *Không khớp (Mismatch)*: Khác năm sinh, hoặc cùng năm sinh nhưng khác ngày/tháng sinh (Điểm 0).
- **Chuẩn hóa thông minh CCCD/CMND:**
  - Bổ sung hàm `normalizeCccd`: Tự động đệm số 0 ở đầu cho mã CCCD 11 chữ số (do Excel tự ý định dạng số và làm mất số 0).
  - Giúp tự động ghép chính xác tuyệt đối qua CCCD/SĐT khi xảy ra trường hợp trùng cả họ tên và ngày sinh thực sự.

---

## [1.0.7] - 2026-10-14

### Tính năng mới (Added) & Tối ưu hóa (Enhanced)
- **Tùy chọn Nguồn Nơi làm việc / Tên C.ty ưu tiên:**
  - Bổ sung bộ chọn độ ưu tiên: `Ưu tiên Bìa (dự phòng HIS)` hoặc `Ưu tiên HIS (dự phòng Bìa)`.
  - Hiển thị trực quan và đồng bộ ở cả Giao diện nạp file ban đầu và Thanh quản lý đối soát kết quả.
  - Tự động fallback thông minh giữa 2 nguồn khi ô dữ liệu trống.
- **Bổ sung Dropdown chọn Cột Nơi làm việc cho File HIS:**
  - Tự động nhận diện chính xác các cột `Nơi làm việc`, `Nơi LV`, `Cơ quan`, `Công ty` trên file HIS.
  - Cho phép người dùng chọn lại thủ công bất kỳ cột nào trong file HIS kèm ký hiệu cột Excel (`[A]`, `[B]`, `[O]...`) hoặc chọn `-- Không dùng --`.
- **Tự động nhận diện chuẩn xác Địa chỉ công ty & Loại bỏ nhầm lẫn:**
  - Nhận diện các cột địa chỉ công ty (`DCCTY`, `ĐCCTY`, `Địa chỉ công ty`, `Địa chỉ C.ty`, `ĐC Cty`...) vào trường Địa chỉ, loại bỏ triệt để khỏi bộ nhận diện Tên công ty.
  - Cung cấp đầy đủ chỗ để chọn khi không tự động nhận diện: Cả File HIS (Nơi làm việc, Địa chỉ) và File Bìa (Bộ phận/Đơn vị, Nơi LV/Tên C.ty, Địa chỉ/ĐC Cty).
- **Cơ chế Reactive Re-matching tức thì:**
  - Thay đổi bất kỳ cột hoặc độ ưu tiên nào sẽ kích hoạt đối soát lại dữ liệu tự động ngay lập tức.

---

## [1.0.6] - 2026-10-14

### Tính năng mới (Added) & Sửa lỗi (Fixed)
- **Khắc phục triệt để lỗi cột Bộ phận ghi là DONVI:**
  - Xóa bỏ việc nhận diện nhầm `DONVI` thành `Tên C.ty` hoặc `Địa chỉ`.
  - Thuật toán tự động phân định chính xác: `DONVI`/`Đơn vị` được đưa vào cột **Bộ phận** (`boPhan`), trong khi `TEN C.TY`/`Công ty` được đưa vào cột **Tên C.ty** (`tenCty`).
- **Bổ sung Dropdown chọn cột Tên C.ty / Công ty cho từng file:**
  - Hỗ trợ quét và tự động nhận diện các mẫu tiêu đề đa dạng: `TEN C.TY`, `Tên C.ty`, `Công ty`, `C.ty`, `CTY`, `Cơ quan`, `CQ`, `Doanh nghiệp`, `DCCTY`, `ĐCCTY`, `Địa chỉ C.ty`...
  - Cung cấp dropdown chọn cột thủ công kèm ký hiệu cột Excel (`[A]`, `[B]`, `[M]...`).
  - Tích hợp tùy chọn `-- Tự động lấy Nơi làm việc từ HIS --` khi file Bìa không có cột công ty.
- **Bổ sung Dropdown chọn cột Bộ phận cho từng file:**
  - Hỗ trợ quét và tự động nhận diện: `Bộ phận`, `BP`, `Phòng ban`, `Phòng`, `Khoa`, `Tổ`, `Đội`, `Đơn vị`, `DONVI`, `Chức danh`, `Nghề nghiệp`...
  - Cho phép người dùng chuyển đổi linh hoạt qua dropdown hoặc chọn `-- Để trống --`.
- **Hiển thị trực quan chữ cái cột Excel ([A], [B], [C]...) trên toàn bộ menu chọn cột:**
  - Giúp người dùng đối chiếu tức thì với file Excel trên máy mà không cần đếm số thứ tự cột.
- **Đồng bộ hóa trên cả 2 màn hình (Nạp file & Kết quả):**
  - Điều chỉnh cấu hình cột Bộ phận, Tên C.ty, Địa chỉ trực tiếp ở cả `FileUploadSection` và `ResultsFileManagerBar`, tự động re-matching tức thì.

---

## [1.0.5] - 2026-10-08

### Tính năng mới (Added) & Cải tiến (Changed)
- **Tự động nhận diện cột Địa chỉ ở cả 2 nguồn (HIS & Bìa):**
  - Quét và phát hiện thông minh cột Địa chỉ trên file kết xuất HIS (nhận diện các mẫu như `Đ/c BN`, `Đ/c`, `Địa chỉ`, `Hộ khẩu`, `HKTT`, `Thường trú`...).
  - Quét và phát hiện thông minh cột Địa chỉ trên sheet Bìa (nhận diện `ĐC 2Cấp`, `Địa chỉ`, `ĐC`, `Địa chỉ (sau sáp nhập)`, `HKTT`... với cơ chế ưu tiên địa chỉ chi tiết hơn và loại trừ địa chỉ công ty).
  - Gắn huy hiệu trạng thái nhận diện rõ ràng trên từng thẻ file (`📍 Đã nhận diện Đ/C` màu xanh lá hoặc `⚠️ Chưa có cột Đ/C` màu hổ phách).
- **Hỗ trợ chọn cột Địa chỉ thủ công từ danh sách thả xuống:**
  - Nếu file có tiêu đề đặc thù không tự động nhận diện được, hoặc người dùng muốn đổi sang cột địa chỉ khác, hệ thống cung cấp dropdown menu liệt kê toàn bộ cột trong sheet kèm chữ cái cột (A, B, C...) để chọn thủ công.
  - Cập nhật trực tiếp trên từng file riêng lẻ.
- **Tùy chọn thứ tự ưu tiên nguồn Địa chỉ linh hoạt:**
  - Hỗ trợ 2 chế độ ưu tiên: `Ưu tiên Bìa (dự phòng HIS)` (mặc định) và `Ưu tiên HIS (dự phòng Bìa)`.
  - Cơ chế fallback thông minh: Khi một hồ sơ có trường địa chỉ bị trống ở nguồn ưu tiên, hệ thống tự động lấy địa chỉ từ nguồn còn lại, đảm bảo dữ liệu cột `Địa Chỉ` ở file xuất `FileMauChuan_NsN.xlsx` đầy đủ nhất.
  - Trên bảng kết quả, hiển thị nhãn phụ `HIS` nếu địa chỉ được lấy bổ sung từ nguồn HIS để người dùng dễ kiểm tra.
- **Tích hợp đồng bộ ở cả 2 chế độ xem (Nạp file & Kết quả):**
  - Cung cấp dropdown chọn cột và bộ chọn ưu tiên địa chỉ ngay tại giao diện nạp file ban đầu (`FileUploadSection`) lẫn thanh quản lý file sau khi xuất báo cáo (`ResultsFileManagerBar`).
  - Tự động re-matching và làm mới bảng kết quả ngay lập tức khi thay đổi cấu hình địa chỉ mà không cần nạp lại file.

---

## [1.0.4] - 2026-10-04

### Tính năng mới (Added) & Cải tiến (Changed)
- **Hỗ trợ nạp nhiều file & Nạp dồn dữ liệu (Multi-file Append):**
  - Cho phép người dùng chọn và nạp nhiều file cùng lúc cho cả File 1 (HIS `.xls`/`.xlsx`) và File 2 (Danh sách Bìa `.xlsx`/`.xls`) thông qua nút "+ Thêm file" hoặc kéo thả nhiều file vào khu vực nạp.
  - Tự động khử trùng lặp dữ liệu HIS thông minh (theo `Mã BA`, `Mã BN` hoặc `Họ tên + Ngày sinh + Giới tính`) khi import nhiều đợt HIS trùng nhau.
- **Hỗ trợ cơ chế thay thế trực tiếp (Live File Replacement):**
  - Cung cấp nút `Thay thế toàn bộ` để làm mới hoàn toàn danh sách file một cách nhanh chóng.
  - Cung cấp nút `🔄 Thay` cho từng file đơn lẻ trong danh sách đã nạp, cho phép thay đổi file lỗi/sửa đổi mà không làm ảnh hưởng tới các file khác đã nạp.
- **Chọn sheet độc lập cho từng file Bìa:**
  - Khi nạp nhiều file Danh sách khác nhau, người dùng có thể tùy chỉnh chọn sheet độc lập cho từng file riêng biệt.
- **Thanh quản lý file tương tác trực tiếp ngay tại màn hình kết quả (ResultsFileManagerBar):**
  - Sau khi đối soát xong, người dùng không cần phải xóa danh sách hay thao tác lại từ đầu. Ngay trên màn hình kết quả, thanh quản lý file cho phép: thêm file mới, thay thế file, đổi sheet hoặc xóa file.
  - **Cơ chế re-matching tự động tức thì:** Ngay khi có bất kỳ thay đổi nào về file ở màn hình kết quả, hệ thống tự động đối soát và cập nhật bảng kết quả, số liệu thống kê và nút xuất Excel ngay lập tức.

---

## [1.0.3] - 2026-10-01

### Cải tiến (Changed)
- **Tự động nhận diện Tên công ty & Fallback từ "Nơi làm việc" trên HIS:**
  - Nhận diện linh hoạt và mở rộng tối đa các biến thể cột Tên công ty trên sheet Bìa (`TENCTY`, `Tên C.ty`, `C.ty`, `Cơ quan`, `CT`, `CQ`, `Đơn vị`, `Doanh nghiệp`...).
  - Nếu không tìm thấy cột tên công ty ở file sheet Bìa hoặc ô dữ liệu bị để trống, hệ thống tự động lấy trực tiếp từ cột **"Nơi làm việc"** trong file kết xuất HIS.
  - Cơ chế fallback thông minh: Tự động kế thừa "Nơi làm việc" chung của đợt khám từ file HIS cho toàn bộ danh sách, đảm bảo 100% dòng dữ liệu xuất ra file `FileMauChuan_NsN.xlsx` đều có đầy đủ Tên C.ty chuẩn xác.
  - Đồng bộ cập nhật trường Tên C.ty khi người dùng hiệu chỉnh thủ công hoặc chọn ứng viên từ HIS.

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
