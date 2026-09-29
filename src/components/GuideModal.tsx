import React from 'react';
import { X, BookOpen, CheckCircle, AlertTriangle, FileSpreadsheet, ShieldCheck } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-r from-sky-600 to-sky-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <BookOpen className="w-5 h-5 text-sky-200" />
            <div>
              <h3 className="font-bold text-lg leading-tight">Hướng Dẫn Sử Dụng</h3>
              <p className="text-xs text-sky-100">Quy trình ghép dữ liệu HIS sang File Mẫu Chuẩn NSN</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs text-slate-600 leading-relaxed">
          {/* Section 1 */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs">1</span>
              Chuẩn Bị 2 File Excel Đầu Vào
            </h4>
            <div className="pl-6 space-y-1.5">
              <p>
                <strong>• File 1 (HIS):</strong> File xuất danh sách tiếp nhận bệnh nhân từ VNPT-HIS (thường có đuôi <code>.xls</code> dạng bảng HTML hoặc <code>.xlsx</code>). Cần có các cột: <em>Mã BA, Mã BN, Tên bệnh nhân, Ngày sinh, Giới tính</em>.
              </p>
              <p>
                <strong>• File 2 (Danh sách hồ sơ KSK):</strong> File danh sách nhân viên công ty đăng ký khám sức khỏe (chọn sheet <strong>Bìa</strong>). Cần có các cột: <em>STT, Họ và tên (HOVATEN), Giới tính (GT), Bộ phận / Nghề nghiệp (NGHENGHIEP), SĐT, Tên Cty (TENCTY), Địa Chỉ (ĐC 2Cấp)</em>.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs">2</span>
              Ghép Tự Động & Xử Lý Cảnh Báo Trùng Tên Tuổi
            </h4>
            <div className="pl-6 space-y-1.5">
              <p>
                • Bấm nút <strong>"Bắt Đầu Ghép Dữ Liệu"</strong>. Hệ thống sẽ chuẩn hóa khoảng trắng thừa, xóa dấu tab/space ẩn và đối soát dựa trên <strong>Họ tên</strong> và <strong>Giới tính</strong>.
              </p>
              <p>
                • <strong>Trường hợp trùng họ tên & giới tính:</strong> Hệ thống kích hoạt cơ chế đối soát cấp 2 theo <em>Ngày sinh, CCCD hoặc SĐT</em>. Nếu khớp đúng, hệ thống gán tự động và gắn huy hiệu cảnh báo màu vàng <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">✓ Đã khớp theo NS</span>.
              </p>
              <p>
                • Nếu có trường hợp trùng cả tên và ngày sinh hoặc không thể tự động phân biệt, hệ thống đánh dấu <span className="bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold">⚠️ Trùng tên tuổi</span>. Bạn chỉ cần nhấp nút <strong>"Hiệu chỉnh"</strong> tại dòng đó để chọn chính xác hồ sơ mong muốn từ danh sách ứng viên HIS!
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs">3</span>
              Xuất File Mẫu Chuẩn NSN (General Text)
            </h4>
            <div className="pl-6 space-y-1.5">
              <p>
                • Bấm nút <strong>"Xuất File Mẫu Chuẩn NSN (.xlsx)"</strong> ở góc phải trên thanh bảng dữ liệu.
              </p>
              <p>
                • File xuất ra gồm đúng <strong>11 cột tiêu chuẩn</strong>:
                <br />
                <code>STT | Mã BA | Mã BN | Tên bệnh nhân | Ngày sinh | Tuổi | Giới tính | Bộ phận | SĐT | Tên C.ty | Địa Chỉ</code>
              </p>
              <p>
                • <strong>Đặc biệt:</strong> Toàn bộ 11 cột đều được định dạng <em>General Text (@)</em>. Số điện thoại (ví dụ <code>0981121000</code>) luôn giữ nguyên số 0 ở đầu, không bị Excel tự ý chuyển thành số hoặc ký pháp khoa học.
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-slate-500">
            <div className="font-semibold text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Nút "Xóa danh sách (Clear Import)"
            </div>
            <p className="text-[11px]">
              Khi hoàn thành một công ty và muốn làm việc với danh sách công ty tiếp theo, hãy nhấp <strong>"Xóa danh sách"</strong> để dọn sạch toàn bộ trạng thái dữ liệu cũ một cách an toàn.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Đã Hiểu
          </button>
        </div>
      </div>
    </div>
  );
};
