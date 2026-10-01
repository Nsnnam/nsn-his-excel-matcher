import React, { useState, useEffect } from 'react';
import {
  ACCESS_AUTH_HASH,
  ACCESS_AUTH_KEY,
  LockScreenModal,
} from './components/LockScreenModal';
import { Navbar } from './components/Navbar';
import { FileUploadSection } from './components/FileUploadSection';
import { DuplicateWarningBanner } from './components/DuplicateWarningBanner';
import { DataTable } from './components/DataTable';
import { DisambiguationModal } from './components/DisambiguationModal';
import { GuideModal } from './components/GuideModal';
import { AboutModal } from './components/AboutModal';
import { Footer } from './components/Footer';
import {
  BiaRecord,
  HisRecord,
  MatchedRecord,
  ProcessingSummary,
} from './types';
import {
  readExcelFileToRows,
  parseHisRows,
  parseBiaRows,
  matchRecords,
  calculateAge,
  exportToStandardExcel,
} from './services/dataEngine';
import { Download, UploadCloud, Trash2, FileCheck, Layers } from 'lucide-react';

export const App: React.FC = () => {
  // Authentication State
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return localStorage.getItem(ACCESS_AUTH_KEY) === ACCESS_AUTH_HASH;
  });

  // Modals
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [aboutTab, setAboutTab] = useState<'coffee' | 'history' | 'about'>('history');
  const [disambiguatingRecord, setDisambiguatingRecord] = useState<MatchedRecord | null>(null);

  const handleOpenAbout = (tab: 'coffee' | 'history' | 'about' = 'history') => {
    setAboutTab(tab);
    setIsAboutOpen(true);
  };

  // File 1: HIS
  const [hisFile, setHisFile] = useState<File | null>(null);
  const [hisRecords, setHisRecords] = useState<HisRecord[]>([]);

  // File 2: Bia
  const [biaFile, setBiaFile] = useState<File | null>(null);
  const [availableSheets, setAvailableSheets] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [biaRowsBySheet, setBiaRowsBySheet] = useState<Record<string, string[][]>>({});
  const [biaRecords, setBiaRecords] = useState<BiaRecord[]>([]);

  // Processing & Results
  const [isProcessing, setIsProcessing] = useState(false);
  const [matchedResults, setMatchedResults] = useState<MatchedRecord[]>([]);
  const [summary, setSummary] = useState<ProcessingSummary | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'warning' | 'exact' | 'unmatched_bia' | 'unmatched_his'>('all');

  // UI state: hide upload section after matching is done to focus on results & export
  const [isUploadVisible, setIsUploadVisible] = useState(true);

  // Handle Lock App
  const handleLockApp = () => {
    localStorage.removeItem(ACCESS_AUTH_KEY);
    setIsUnlocked(false);
  };

  // Handle File 1 (HIS) Upload
  const handleHisFileChange = async (file: File | null) => {
    if (!file) {
      setHisFile(null);
      setHisRecords([]);
      return;
    }
    setHisFile(file);
    try {
      const { rowsBySheet, sheetNames } = await readExcelFileToRows(file);
      const firstSheet = sheetNames[0] || '';
      const rows = rowsBySheet[firstSheet] || [];
      const parsed = parseHisRows(rows);
      setHisRecords(parsed);
    } catch (err) {
      console.error('Lỗi đọc file HIS:', err);
      alert('Không thể đọc file HIS. Vui lòng kiểm tra định dạng file .xls hoặc .xlsx.');
      setHisFile(null);
      setHisRecords([]);
    }
  };

  // Handle File 2 (Bia) Upload
  const handleBiaFileChange = async (file: File | null) => {
    if (!file) {
      setBiaFile(null);
      setAvailableSheets([]);
      setSelectedSheet('');
      setBiaRowsBySheet({});
      setBiaRecords([]);
      return;
    }
    setBiaFile(file);
    try {
      const { rowsBySheet, sheetNames } = await readExcelFileToRows(file);
      setAvailableSheets(sheetNames);
      setBiaRowsBySheet(rowsBySheet);

      // Prefer sheet "Bìa" or "Bia", otherwise first sheet
      const foundBia = sheetNames.find(s => s.toLowerCase() === 'bìa' || s.toLowerCase() === 'bia');
      const targetSheet = foundBia || sheetNames[0] || '';
      setSelectedSheet(targetSheet);

      const rows = rowsBySheet[targetSheet] || [];
      const parsed = parseBiaRows(rows);
      setBiaRecords(parsed);
    } catch (err) {
      console.error('Lỗi đọc file Danh sách:', err);
      alert('Không thể đọc file Danh sách. Vui lòng kiểm tra định dạng file .xlsx hoặc .xls.');
      setBiaFile(null);
      setAvailableSheets([]);
      setSelectedSheet('');
      setBiaRowsBySheet({});
      setBiaRecords([]);
    }
  };

  // Handle Sheet Change
  const handleSheetChange = (sheet: string) => {
    setSelectedSheet(sheet);
    const rows = biaRowsBySheet[sheet] || [];
    const parsed = parseBiaRows(rows);
    setBiaRecords(parsed);
  };

  // Run Matching
  const handleProcess = () => {
    if (biaRecords.length === 0 || hisRecords.length === 0) {
      alert('Vui lòng nạp đủ 2 file dữ liệu HIS và Danh sách Bìa!');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      try {
        const { matchedResults: results, summary: sum } = matchRecords(biaRecords, hisRecords);
        setMatchedResults(results);
        setSummary(sum);

        // Hide upload section to focus on results & export
        setIsUploadVisible(false);

        // If there are duplicate warnings (same name AND same dob), switch to warning filter
        if (sum.warningSameDobCount > 0 || sum.warningMismatchDobCount > 0) {
          setActiveFilter('warning');
        } else {
          setActiveFilter('all');
        }
      } catch (err) {
        console.error('Lỗi khi ghép dữ liệu:', err);
        alert('Có lỗi xảy ra trong quá trình đối soát dữ liệu.');
      } finally {
        setIsProcessing(false);
      }
    }, 200);
  };

  // Standard Clear Import (Reset Clean State)
  const handleClearImport = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ danh sách đã import và đặt lại trạng thái ban đầu không?')) {
      setHisFile(null);
      setHisRecords([]);
      setBiaFile(null);
      setAvailableSheets([]);
      setSelectedSheet('');
      setBiaRowsBySheet({});
      setBiaRecords([]);
      setMatchedResults([]);
      setSummary(null);
      setActiveFilter('all');
      setIsUploadVisible(true);
    }
  };

  // Direct export default standard file
  const handleDirectExport = () => {
    if (matchedResults.length > 0) {
      exportToStandardExcel(matchedResults, 'FileMauChuan_NsN');
    }
  };

  // Disambiguation: user chose a specific candidate from HIS
  const handleSelectCandidate = (matchedRecordId: string, selectedHis: HisRecord) => {
    setMatchedResults(prev =>
      prev.map(r => {
        if (r.id === matchedRecordId) {
          return {
            ...r,
            maBA: selectedHis.maBA,
            maBN: selectedHis.maBN,
            tenBenhNhan: selectedHis.tenBenhNhan,
            ngaySinh: selectedHis.ngaySinh,
            tuoi: selectedHis.tuoi,
            gioiTinh: selectedHis.gioiTinh,
            tenCty: r.tenCty || selectedHis.noiLamViec || '',
            matchedHis: selectedHis,
            matchStatus: 'manual_adjusted',
            warningNotes: [`Người dùng đã chọn thủ công: Mã BA ${selectedHis.maBA} - Mã BN ${selectedHis.maBN}`],
          };
        }
        return r;
      })
    );
  };

  // Disambiguation: user entered custom codes
  const handleManualCustomEdit = (matchedRecordId: string, customMaBA: string, customMaBN: string, customDob: string) => {
    setMatchedResults(prev =>
      prev.map(r => {
        if (r.id === matchedRecordId) {
          return {
            ...r,
            maBA: customMaBA,
            maBN: customMaBN,
            ngaySinh: customDob || r.ngaySinh,
            tuoi: customDob ? calculateAge(customDob) : r.tuoi,
            matchStatus: 'manual_adjusted',
            warningNotes: [`Người dùng đã hiệu chỉnh thủ công: BA ${customMaBA}, BN ${customMaBN}`],
          };
        }
        return r;
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-sky-500 selection:text-white">
      {/* 1. ACCESS LOCK POPUP */}
      <LockScreenModal isOpen={!isUnlocked} onUnlock={() => setIsUnlocked(true)} />

      {/* 2. NAVBAR */}
      <Navbar
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenAbout={handleOpenAbout}
        onLockApp={handleLockApp}
      />

      {/* 3. MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Upload Zone (Visible initially or when user toggles) */}
        {isUploadVisible ? (
          <FileUploadSection
            hisFile={hisFile}
            hisRecordCount={hisRecords.length}
            onHisFileChange={handleHisFileChange}
            biaFile={biaFile}
            biaRecordCount={biaRecords.length}
            availableSheets={availableSheets}
            selectedSheet={selectedSheet}
            onSheetChange={handleSheetChange}
            onBiaFileChange={handleBiaFileChange}
            isProcessing={isProcessing}
            onProcess={handleProcess}
            onClearImport={handleClearImport}
          />
        ) : (
          /* Compact Header bar when upload section is hidden */
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 px-5 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center space-x-3 text-xs text-slate-600 truncate">
              <FileCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="truncate">
                <span className="font-bold text-slate-800">Dữ liệu đầu vào:</span>{' '}
                <span className="text-sky-700 font-semibold">{hisFile?.name}</span> ({hisRecords.length} dòng HIS) +{' '}
                <span className="text-indigo-700 font-semibold">{biaFile?.name}</span> ({biaRecords.length} hồ sơ Bìa)
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsUploadVisible(true)}
                className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors cursor-pointer"
                title="Hiển thị lại khung nạp file nếu cần thay đổi hoặc nạp thêm"
              >
                <UploadCloud className="w-3.5 h-3.5 mr-1.5" />
                Hiện khung nạp file
              </button>

              <button
                type="button"
                onClick={handleClearImport}
                className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                title="Xóa danh sách và đặt lại trạng thái ban đầu"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                Xóa DS
              </button>
            </div>
          </div>
        )}

        {/* Results Section */}
        {summary && matchedResults.length > 0 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Prominent Export CTA Banner */}
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-700 rounded-2xl p-5 sm:p-6 text-white shadow-lg shadow-emerald-700/20 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center md:text-left">
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-xs mb-1">
                  ✓ Sẵn sàng xuất in tem nhãn (Mail Merge / BarTender)
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold tracking-tight">
                  Xuất File Mẫu Chuẩn: <span className="underline decoration-amber-300 underline-offset-4">FileMauChuan_NsN.xlsx</span>
                </h3>
                <p className="text-xs text-emerald-100 max-w-2xl leading-relaxed">
                  Tên file mặc định chuẩn xác <strong>FileMauChuan_NsN.xlsx</strong> giúp phần mềm in tem BarTender và Mail Merge tự động nhận dạng cơ sở dữ liệu ngay lập tức mà không cần đổi tên thủ công.
                </p>
              </div>

              <button
                type="button"
                onClick={handleDirectExport}
                className="w-full md:w-auto px-7 py-3.5 bg-white text-emerald-800 hover:bg-amber-300 hover:text-slate-900 font-black text-sm sm:text-base rounded-xl shadow-xl transition-all flex items-center justify-center space-x-2.5 shrink-0 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Download className="w-5 h-5 text-emerald-700" />
                <span>TẢI FILE: FileMauChuan_NsN.xlsx</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
                  {matchedResults.length} dòng
                </span>
              </button>
            </div>

            {/* Summary & Duplicate Warning Banner */}
            <DuplicateWarningBanner
              summary={summary}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />

            {/* Combined Output Data Table */}
            <DataTable
              records={matchedResults}
              summary={summary}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              onOpenDisambiguate={(record) => setDisambiguatingRecord(record)}
            />
          </div>
        )}
      </main>

      {/* 4. MODALS */}
      <DisambiguationModal
        record={disambiguatingRecord}
        allHisRecords={hisRecords}
        onClose={() => setDisambiguatingRecord(null)}
        onSelectCandidate={handleSelectCandidate}
        onManualCustomEdit={handleManualCustomEdit}
      />

      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onOpenHistory={() => {
          setIsGuideOpen(false);
          handleOpenAbout('history');
        }}
      />
      <AboutModal
        isOpen={isAboutOpen}
        initialTab={aboutTab}
        onClose={() => setIsAboutOpen(false)}
      />

      {/* 5. FOOTER */}
      <Footer
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenAbout={handleOpenAbout}
      />
    </div>
  );
};

export default App;
