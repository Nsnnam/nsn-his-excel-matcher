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
  FileCheck
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
                Phiên bản hiện tại: <strong className="font-bold text-sky-800">v{APP_META.version} ({APP_META.releaseDate})</strong> — Tối ưu đối soát ngày sinh, ẩn khung nạp và cố định tên file BarTender.
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

          {/* Section 1: Chuẩn bị file */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-bold">1</span>
              Chuẩn Bị 2 File Excel Đầu Vào
            </h4>
            <div className="pl-6 space-y-2">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
                  <FileSpreadsheet className="w-4 h-4 text-sky-600" />
                  File 1: File Tiếp Nhận Xuất Từ VNPT-HIS
                </div>
                <p className="text-[11px] text-slate-500">
                  Hỗ trợ cả file <code>.xls</code> (bảng HTML do VNPT-HIS kết xuất) và file <code>.xlsx</code>. Hệ thống tự động bóc tách các trường: <em>Mã BA, Mã BN, Tên bệnh nhân, Ngày sinh, Tuổi, Giới tính, CCCD, SĐT</em>.
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

          {/* Section 2: Quy tắc đối soát tuổi & cảnh báo trùng tên */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-bold">2</span>
              Quy Tắc Đối Soát Ngày Sinh / Tuổi & Cảnh Báo Trùng Tên (v1.0.1)
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

          {/* Section 3: Tối ưu hiển thị sau ghép */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-bold">3</span>
              Giao Diện Tối Ưu Sau Khi Ghép & Khung Nạp File (v1.0.2)
            </h4>
            <div className="pl-6 space-y-1.5">
              <p>
                • <strong>Tự động ẩn khung nạp 2 file:</strong> Ngay sau khi bấm ghép xong, 2 khung nạp file lớn sẽ tự động ẩn đi để nhường toàn bộ không gian màn hình cho <em>Bảng số liệu thống kê</em>, <em>Khối biểu ngữ xuất file nổi bật</em> và <em>Bảng đối chiếu dữ liệu</em>.
              </p>
              <p>
                • <strong>Mở lại khung nạp khi cần:</strong> Trên thanh tóm tắt đầu trang có nút <span className="text-sky-700 font-semibold bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">Hiện khung nạp file</span>, nhấp vào bất cứ lúc nào để kiểm tra tên file hoặc nạp lại dữ liệu mới.
              </p>
              <p>
                • <strong>Xóa danh sách (Clear Import):</strong> Nút <span className="text-rose-700 font-semibold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">Xóa DS</span> giúp dọn sạch toàn bộ trạng thái dữ liệu cũ để chuẩn bị làm cho công ty tiếp theo.
              </p>
            </div>
          </div>

          {/* Section 4: Xuất File Mẫu Chuẩn NSN */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-bold">4</span>
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

          {/* Section 5: Bảo Mật & Khóa Ứng Dụng */}
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
