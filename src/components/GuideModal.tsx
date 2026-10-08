import React from 'react';
import {
  X,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  FileSpreadsheet,
  ShieldCheck,
  History,
  Sparkles,
  ArrowRight,
  Eye,
  FileText,
  Printer,
  FileCheck,
  Building2,
  FolderSync,
  Layers,
  MapPin
} from 'lucide-react';
import { APP_META } from '../constants/meta';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenHistory?: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose, onOpenHistory }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 to-sky-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-xs">
              <BookOpen className="w-5 h-5 text-sky-200" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Hướng Dẫn Sử Dụng & Quy Trình Ghép Dữ Liệu</h3>
              <p className="text-xs text-sky-100">Cập nhật theo phiên bản v{APP_META.version} · Chuẩn NSN App Standard</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs text-slate-600 leading-relaxed">
          {/* Quick Version Banner */}
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 flex items-center justify-between gap-3">
            <div className="flex items-center space-x-2 text-sky-900">
              <Sparkles className="w-4 h-4 text-sky-600 shrink-0" />
              <span className="font-medium text-[11px]">
                Phiên bản hiện tại: <strong className="font-bold text-sky-800">v{APP_META.version} ({APP_META.releaseDate})</strong> — Tự động nhận diện cột Địa chỉ ở cả 2 file, chọn cột thủ công, nạp dồn nhiều file & thay thế trực tiếp.
              </span>
            </div>
            {onOpenHistory && (
              <button
                type="button"
                onClick={onOpenHistory}
                className="shrink-0 px-2.5 py-1 text-[11px] font-semibold bg-white hover:bg-sky-100 text-sky-700 border border-sky-300 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <History className="w-3.5 h-3.5 text-sky-600" />
                <span>Xem lịch sử</span>
              </button>
            )}
          </div>

          {/* Section 1: Tự động nhận diện Địa chỉ & Chọn cột thủ công (v1.0.5 MỚI) */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-bold">1</span>
              Tự Động Nhận Diện Địa Chỉ & Chọn Cột Thủ Công (v1.0.5)
            </h4>
            <div className="pl-6 space-y-2">
              <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-lg space-y-1.5">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  Cơ chế nhận diện & gán cột Địa chỉ thông minh:
                </div>
                <ul className="space-y-1 text-[11px] text-emerald-800 list-disc list-inside">
                  <li>
                    <strong>Tự động nhận diện ở cả 2 nguồn:</strong> File HIS (nhận diện các cột như <code>Đ/c BN</code>, <code>Địa chỉ</code>, <code>Hộ khẩu</code>, <code>HKTT</code>...) và File Bìa (nhận diện <code>ĐC 2Cấp</code>, <code>Địa chỉ</code>, <code>ĐC</code>, <code>Địa chỉ (sau sáp nhập)</code>...).
                  </li>
                  <li>
                    <strong>Menu thả xuống chọn cột trực tiếp:</strong> Mỗi file được nạp đều có ô chọn cột Địa chỉ hiển thị tiêu đề và chỉ số cột (A, B, C...). Nếu file có cấu trúc đặc biệt không tự nhận diện được (báo nhãn màu hổ phách <code>⚠️ Chưa có cột Đ/C</code>), bạn chỉ cần chọn cột mong muốn trong danh sách thả xuống.
                  </li>
                  <li>
                    <strong>Tùy chọn thứ tự ưu tiên:</strong> Bạn có thể linh hoạt chuyển đổi giữa <em>Ưu tiên Bìa (dự phòng HIS)</em> và <em>Ưu tiên HIS (dự phòng Bìa)</em>. Nếu một hồ sơ bị thiếu địa chỉ ở nguồn ưu tiên, hệ thống tự động bù trừ từ nguồn còn lại!
                  </li>
                  <li>
                    <strong>Chỉnh sửa tức thì ở cả 2 giao diện:</strong> Có thể điều chỉnh cột địa chỉ và ưu tiên ngay tại giao diện nạp ban đầu hoặc thanh quản lý file sau khi đã ghép dữ liệu xong.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 2: Hỗ trợ nạp nhiều file & Thay thế trực tiếp (v1.0.4) */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-bold">2</span>
              Nạp Nhiều File & Thay Thế Trực Tiếp (v1.0.4)
            </h4>
            <div className="pl-6 space-y-2">
              <div className="p-2.5 bg-sky-50/70 border border-sky-200 rounded-lg space-y-1.5">
                <div className="font-bold text-sky-900 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-sky-600" />
                  Tính năng nạp dồn & quản lý file linh hoạt:
                </div>
                <ul className="space-y-1 text-[11px] text-sky-800 list-disc list-inside">
                  <li>
                    <strong>Nạp dồn nhiều file (Multi-file append):</strong> Cho phép nạp đồng thời nhiều file HIS hoặc nhiều file Danh sách Bìa (qua nút <code>+ Thêm file</code> hoặc kéo thả nhiều file cùng lúc). Hệ thống tự động khử trùng lặp thông minh đối với dữ liệu HIS.
                  </li>
                  <li>
                    <strong>Thay thế trực tiếp:</strong> Bạn có thể nhấp <code>Thay thế</code> để đổi toàn bộ danh sách file, hoặc nhấp nút <code>🔄 Thay</code> tại từng file đơn lẻ để cập nhật lại file đó mà không ảnh hưởng tới các file khác.
                  </li>
                  <li>
                    <strong>Chọn sheet độc lập cho từng file Bìa:</strong> Mỗi file Danh sách nạp vào có thể chọn một sheet riêng biệt phù hợp với cấu trúc file của đơn vị đó.
                  </li>
                  <li>
                    <strong>Quản lý file trực tiếp tại màn hình kết quả:</strong> Sau khi đã đối soát xong, thanh quản lý file nhỏ gọn vẫn hiển thị cho phép thêm, thay thế, đổi sheet hoặc xóa file ngay tại chỗ. Hệ thống tự động re-matching và làm mới bảng kết quả tức thì!
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 3: Chuẩn bị file */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-bold">3</span>
              Chuẩn Bị Định Dạng File Excel Đầu Vào
            </h4>
            <div className="pl-6 space-y-2">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
                  <FileSpreadsheet className="w-4 h-4 text-sky-600" />
                  File 1: File Tiếp Nhận Xuất Từ VNPT-HIS
                </div>
                <p className="text-[11px] text-slate-500">
                  Hỗ trợ cả file <code>.xls</code> (bảng HTML do VNPT-HIS kết xuất) và file <code>.xlsx</code>. Hệ thống tự động trích xuất: <em>Mã BA, Mã BN, Tên bệnh nhân, Ngày sinh, Tuổi, Giới tính, CCCD, SĐT, Nơi làm việc</em>.
                </p>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
                  <FileCheck className="w-4 h-4 text-indigo-600" />
                  File 2: Danh Sách Đăng Ký Khám Sức Khỏe (Sheet "Bìa")
                </div>
                <p className="text-[11px] text-slate-500">
                  File danh sách nhân viên công ty đăng ký khám. Hệ thống tự động chọn sheet <strong>Bìa</strong> (hoặc cho phép chọn sheet khác trong danh sách thả xuống) để lấy: <em>STT, Họ và tên (HOVATEN), Giới tính (GT), Bộ phận / Nghề nghiệp, SĐT, Tên Cty, Địa Chỉ</em>.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Nhận diện Tên công ty & Fallback từ HIS (v1.0.3) */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-bold">4</span>
              Nhận Diện Tên Công Ty & Tự Động Lấy Từ "Nơi Làm Việc" HIS
            </h4>
            <div className="pl-6 space-y-2">
              <div className="p-2.5 bg-indigo-50/70 border border-indigo-200 rounded-lg">
                <div className="font-bold text-indigo-900 flex items-center gap-1.5 mb-1">
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  Cơ chế tự động lấy Tên Công Ty linh hoạt:
                </div>
                <ul className="space-y-1 text-[11px] text-indigo-800 list-disc list-inside">
                  <li>
                    <strong>Nhận diện đa dạng trên sheet Bìa:</strong> Hệ thống tự động bắt các tiêu đề cột như <code>TENCTY</code>, <code>Tên C.ty</code>, <code>C.ty</code>, <code>Cơ quan</code>, <code>CT</code>, <code>CQ</code>, <code>Đơn vị</code>, <code>Doanh nghiệp</code>...
                  </li>
                  <li>
                    <strong>Tự động lấy từ "Nơi làm việc" trong HIS:</strong> Nếu file sheet Bìa <em>không có cột tên công ty</em> hoặc <em>ô dữ liệu bị để trống</em>, hệ thống sẽ tự động lấy trực tiếp từ trường <strong>"Nơi làm việc"</strong> của hồ sơ bệnh nhân trên HIS!
                  </li>
                  <li>
                    <strong>Kế thừa đợt khám:</strong> Ngay cả với hồ sơ có trong Bìa nhưng chưa tìm thấy trên HIS, ứng dụng vẫn tự động gán tên cơ quan chung của đợt khám từ file HIS để file xuất ra không bao giờ bị khuyết cột <em>Tên C.ty</em>.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 5: Quy tắc đối soát tuổi & cảnh báo trùng tên */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-bold">5</span>
              Quy Tắc Đối Soát Ngày Sinh / Tuổi & Cảnh Báo Trùng Tên
            </h4>
            <div className="pl-6 space-y-2">
              <p>
                Sau khi nhấp <strong>"Bắt Đầu Ghép Dữ Liệu"</strong>, hệ thống tự động chuẩn hóa chuỗi (loại bỏ khoảng trắng thừa ở đầu/cuối, chuyển Unicode NFC) và ghép nối theo quy tắc:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-lg">
                  <div className="font-bold text-emerald-800 flex items-center gap-1 mb-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    Cùng tên nhưng khác ngày sinh/tuổi:
                  </div>
                  <p className="text-emerald-700">
                    Được xác định chắc chắn là <strong>2 người khác nhau</strong>. Hệ thống tự động ghép chính xác và <strong>bỏ qua cảnh báo</strong> (đưa vào nhóm Khớp chuẩn 1-1 để không làm phiền người dùng).
                  </p>
                </div>

                <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-lg">
                  <div className="font-bold text-amber-800 flex items-center gap-1 mb-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Cùng tên VÀ cùng ngày sinh / tuổi:
                  </div>
                  <p className="text-amber-700">
                    Hệ thống sẽ <strong>bật cảnh báo màu vàng</strong> <span className="bg-amber-100 text-amber-900 px-1 py-0.5 rounded font-semibold">⚠️ Trùng tên tuổi</span>. Người dùng chỉ cần bấm nút <strong>"Hiệu chỉnh"</strong> tại dòng đó để chọn đích danh hồ sơ trên HIS hoặc nhập Mã BA/BN thủ công.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 6: Xuất File Mẫu Chuẩn NSN */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-bold">6</span>
              Xuất File Mẫu Chuẩn Cho In Tem Nhãn (BarTender & Mail Merge)
            </h4>
            <div className="pl-6 space-y-2">
              <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1.5">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5 text-xs">
                  <Printer className="w-4 h-4 text-emerald-700" />
                  Cố định tên file xuất: <code className="text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-300">FileMauChuan_NsN.xlsx</code>
                </div>
                <p className="text-[11px] text-emerald-700">
                  Tên file tải về luôn cố định chính xác là <strong>FileMauChuan_NsN.xlsx</strong> (không gắn thời gian). Điều này giúp phần mềm in tem <strong>BarTender (.btw)</strong> và tính năng <strong>Mail Merge trong Word</strong> nhận diện tự động nguồn cơ sở dữ liệu ngay lập tức mà bạn không cần phải đổi tên file hay cấu hình lại đường dẫn in tem!
                </p>
              </div>

              <div className="space-y-1">
                <p>
                  • <strong>Đúng 11 Cột Tiêu Chuẩn:</strong>
                </p>
                <div className="p-2 bg-slate-900 text-slate-100 font-mono text-[10.5px] rounded-lg overflow-x-auto">
                  STT | Mã BA | Mã BN | Tên bệnh nhân | Ngày sinh | Tuổi | Giới tính | Bộ phận | SĐT | Tên C.ty | Địa Chỉ
                </div>
              </div>

              <p>
                • <strong>Định dạng 100% General Text (@):</strong> Toàn bộ 11 cột đều được quy định kiểu văn bản thuần túy. Số điện thoại (ví dụ <code>0981121000</code>) luôn giữ nguyên vẹn số 0 ở đầu, không bị Excel tự động biến dạng.
              </p>
            </div>
          </div>

          {/* Section 6: Bảo Mật & Khóa Ứng Dụng */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-slate-500">
            <div className="font-semibold text-slate-700 flex items-center gap-1.5 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Khóa Truy Cập Bảo Mật & An Toàn Dữ Liệu
            </div>
            <p className="text-[11px]">
              Mã truy cập mặc định chuẩn NSN là <strong>namns</strong> (viết hoa, viết thường đều được). Toàn bộ dữ liệu được tính toán 100% trên trình duyệt (client-side), tuyệt đối an toàn và không gửi thông tin bệnh nhân ra Internet.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            Tác giả: <strong>{APP_META.author.name}</strong> · Múi giờ: GMT+7
          </div>
          <div className="flex items-center space-x-2">
            {onOpenHistory && (
              <button
                type="button"
                onClick={onOpenHistory}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-sky-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Lịch sử phiên bản
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              Đã Hiểu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
