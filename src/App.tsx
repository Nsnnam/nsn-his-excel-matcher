import React, { useState, useMemo } from 'react';
import {
  ACCESS_AUTH_HASH,
  ACCESS_AUTH_KEY,
  LockScreenModal,
} from './components/LockScreenModal';
import { Navbar } from './components/Navbar';
import { FileUploadSection } from './components/FileUploadSection';
import { ResultsFileManagerBar } from './components/ResultsFileManagerBar';
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
  UploadedFileItem,
} from './types';
import {
  readExcelFileToRows,
  parseHisRows,
  parseBiaRows,
  combineHisRecords,
  combineBiaRecords,
  matchRecords,
  calculateAge,
  exportToStandardExcel,
} from './services/dataEngine';
import { Download } from 'lucide-react';

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

  // Uploaded Files State (Supports multiple files and direct replacement)
  const [hisFiles, setHisFiles] = useState<UploadedFileItem[]>([]);
  const [biaFiles, setBiaFiles] = useState<UploadedFileItem[]>([]);

  // Combined records (memoized for performance)
  const combinedHisRecords = useMemo(() => combineHisRecords(hisFiles), [hisFiles]);
  const combinedBiaRecords = useMemo(() => combineBiaRecords(biaFiles), [biaFiles]);

  // Processing & Results
  const [isProcessing, setIsProcessing] = useState(false);
  const [matchedResults, setMatchedResults] = useState<MatchedRecord[]>([]);
  const [summary, setSummary] = useState<ProcessingSummary | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'warning' | 'exact' | 'unmatched_bia' | 'unmatched_his'>('all');

  // UI state: hide full upload section after matching is done to focus on results & export
  const [isUploadVisible, setIsUploadVisible] = useState(true);

  // Handle Lock App
  const handleLockApp = () => {
    localStorage.removeItem(ACCESS_AUTH_KEY);
    setIsUnlocked(false);
  };

  // Helper: Parse a single HIS File to UploadedFileItem
  const parseSingleHisFile = async (file: File, fileIndex: number): Promise<UploadedFileItem> => {
    const { rowsBySheet, sheetNames } = await readExcelFileToRows(file);
    const firstSheet = sheetNames[0] || '';
    const rows = rowsBySheet[firstSheet] || [];
    const filePrefix = `his_${Date.now()}_${fileIndex}`;
    const parsed = parseHisRows(rows, filePrefix);
    return {
      id: `his_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      file,
      name: file.name,
      size: file.size,
      recordCount: parsed.length,
      uploadedAt: new Date(),
      availableSheets: sheetNames,
      selectedSheet: firstSheet,
      rawRowsBySheet: rowsBySheet,
      parsedHisRecords: parsed,
    };
  };

  // Helper: Parse a single Bia File to UploadedFileItem
  const parseSingleBiaFile = async (file: File, fileIndex: number): Promise<UploadedFileItem> => {
    const { rowsBySheet, sheetNames } = await readExcelFileToRows(file);
    const foundBia = sheetNames.find(s => s.toLowerCase() === 'bìa' || s.toLowerCase() === 'bia');
    const targetSheet = foundBia || sheetNames[0] || '';
    const rows = rowsBySheet[targetSheet] || [];
    const filePrefix = `bia_${Date.now()}_${fileIndex}`;
    const parsed = parseBiaRows(rows, filePrefix);
    return {
      id: `bia_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      file,
      name: file.name,
      size: file.size,
      recordCount: parsed.length,
      uploadedAt: new Date(),
      availableSheets: sheetNames,
      selectedSheet: targetSheet,
      rawRowsBySheet: rowsBySheet,
      parsedBiaRecords: parsed,
    };
  };

  // Core Matching Execution Helper
  const executeMatching = (bias: BiaRecord[], his: HisRecord[], shouldHideUpload = false) => {
    if (bias.length === 0 || his.length === 0) {
      setMatchedResults([]);
      setSummary(null);
      setIsUploadVisible(true);
      return;
    }

    try {
      const { matchedResults: results, summary: sum } = matchRecords(bias, his);
      setMatchedResults(results);
      setSummary(sum);

      if (shouldHideUpload) {
        setIsUploadVisible(false);
      }

      if (sum.warningSameDobCount > 0 || sum.warningMismatchDobCount > 0) {
        setActiveFilter('warning');
      } else {
        setActiveFilter('all');
      }
    } catch (err) {
      console.error('Lỗi khi ghép dữ liệu:', err);
      alert('Có lỗi xảy ra trong quá trình đối soát dữ liệu.');
    }
  };

  // Handle Add HIS Files (Nạp dồn)
  const handleAddHisFiles = async (files: File[]) => {
    if (files.length === 0) return;
    setIsProcessing(true);
    try {
      const newItems: UploadedFileItem[] = [];
      for (let i = 0; i < files.length; i++) {
        const item = await parseSingleHisFile(files[i], i);
        newItems.push(item);
      }
      const updated = [...hisFiles, ...newItems];
      setHisFiles(updated);

      if (summary !== null) {
        const newHis = combineHisRecords(updated);
        executeMatching(combinedBiaRecords, newHis, false);
      }
    } catch (err) {
      console.error('Lỗi nạp file HIS:', err);
      alert('Không thể đọc một số file HIS. Vui lòng kiểm tra định dạng file .xls hoặc .xlsx.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Replace All HIS Files (Thay thế toàn bộ)
  const handleReplaceHisFiles = async (files: File[]) => {
    if (files.length === 0) return;
    setIsProcessing(true);
    try {
      const newItems: UploadedFileItem[] = [];
      for (let i = 0; i < files.length; i++) {
        const item = await parseSingleHisFile(files[i], i);
        newItems.push(item);
      }
      setHisFiles(newItems);

      if (summary !== null) {
        const newHis = combineHisRecords(newItems);
        executeMatching(combinedBiaRecords, newHis, false);
      }
    } catch (err) {
      console.error('Lỗi thay thế file HIS:', err);
      alert('Không thể đọc file HIS. Vui lòng kiểm tra định dạng file .xls hoặc .xlsx.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Replace Single HIS File
  const handleReplaceSingleHisFile = async (fileId: string, newFile: File) => {
    setIsProcessing(true);
    try {
      const newItem = await parseSingleHisFile(newFile, 0);
      const updated = hisFiles.map(f => (f.id === fileId ? newItem : f));
      setHisFiles(updated);

      if (summary !== null) {
        const newHis = combineHisRecords(updated);
        executeMatching(combinedBiaRecords, newHis, false);
      }
    } catch (err) {
      console.error('Lỗi thay thế file HIS đơn lẻ:', err);
      alert('Không thể đọc file HIS thay thế.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Remove HIS File
  const handleRemoveHisFile = (fileId: string) => {
    const updated = hisFiles.filter(f => f.id !== fileId);
    setHisFiles(updated);

    if (summary !== null) {
      const newHis = combineHisRecords(updated);
      executeMatching(combinedBiaRecords, newHis, false);
    }
  };

  // Handle Add Bia Files (Nạp dồn)
  const handleAddBiaFiles = async (files: File[]) => {
    if (files.length === 0) return;
    setIsProcessing(true);
    try {
      const newItems: UploadedFileItem[] = [];
      for (let i = 0; i < files.length; i++) {
        const item = await parseSingleBiaFile(files[i], i);
        newItems.push(item);
      }
      const updated = [...biaFiles, ...newItems];
      setBiaFiles(updated);

      if (summary !== null) {
        const newBia = combineBiaRecords(updated);
        executeMatching(newBia, combinedHisRecords, false);
      }
    } catch (err) {
      console.error('Lỗi nạp file Danh sách:', err);
      alert('Không thể đọc một số file Danh sách. Vui lòng kiểm tra định dạng file .xlsx hoặc .xls.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Replace All Bia Files (Thay thế toàn bộ)
  const handleReplaceBiaFiles = async (files: File[]) => {
    if (files.length === 0) return;
    setIsProcessing(true);
    try {
      const newItems: UploadedFileItem[] = [];
      for (let i = 0; i < files.length; i++) {
        const item = await parseSingleBiaFile(files[i], i);
        newItems.push(item);
      }
      setBiaFiles(newItems);

      if (summary !== null) {
        const newBia = combineBiaRecords(newItems);
        executeMatching(newBia, combinedHisRecords, false);
      }
    } catch (err) {
      console.error('Lỗi thay thế file Danh sách:', err);
      alert('Không thể đọc file Danh sách. Vui lòng kiểm tra định dạng file .xlsx hoặc .xls.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Replace Single Bia File
  const handleReplaceSingleBiaFile = async (fileId: string, newFile: File) => {
    setIsProcessing(true);
    try {
      const newItem = await parseSingleBiaFile(newFile, 0);
      const updated = biaFiles.map(f => (f.id === fileId ? newItem : f));
      setBiaFiles(updated);

      if (summary !== null) {
        const newBia = combineBiaRecords(updated);
        executeMatching(newBia, combinedHisRecords, false);
      }
    } catch (err) {
      console.error('Lỗi thay thế file Danh sách đơn lẻ:', err);
      alert('Không thể đọc file Danh sách thay thế.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Remove Bia File
  const handleRemoveBiaFile = (fileId: string) => {
    const updated = biaFiles.filter(f => f.id !== fileId);
    setBiaFiles(updated);

    if (summary !== null) {
      const newBia = combineBiaRecords(updated);
      executeMatching(newBia, combinedHisRecords, false);
    }
  };

  // Handle Change Sheet for a specific Bia file
  const handleChangeBiaSheet = (fileId: string, sheetName: string) => {
    const updated = biaFiles.map(item => {
      if (item.id === fileId && item.rawRowsBySheet) {
        const rows = item.rawRowsBySheet[sheetName] || [];
        const filePrefix = item.id;
        const parsed = parseBiaRows(rows, filePrefix);
        return {
          ...item,
          selectedSheet: sheetName,
          parsedBiaRecords: parsed,
          recordCount: parsed.length,
        };
      }
      return item;
    });
    setBiaFiles(updated);

    if (summary !== null) {
      const newBia = combineBiaRecords(updated);
      executeMatching(newBia, combinedHisRecords, false);
    }
  };

  // Run Matching
  const handleProcess = () => {
    if (combinedBiaRecords.length === 0 || combinedHisRecords.length === 0) {
      alert('Vui lòng nạp đủ cả file dữ liệu HIS và file Danh sách Bìa!');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      executeMatching(combinedBiaRecords, combinedHisRecords, true);
      setIsProcessing(false);
    }, 200);
  };

  // Standard Clear Import (Reset Clean State)
  const handleClearImport = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ danh sách đã import và đặt lại trạng thái ban đầu không?')) {
      setHisFiles([]);
      setBiaFiles([]);
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
        {/* Full File Upload Section (Shown initially or when user toggles expand) */}
        {isUploadVisible && (
          <FileUploadSection
            hisFiles={hisFiles}
            hisRecordCount={combinedHisRecords.length}
            onAddHisFiles={handleAddHisFiles}
            onReplaceHisFiles={handleReplaceHisFiles}
            onReplaceSingleHisFile={handleReplaceSingleHisFile}
            onRemoveHisFile={handleRemoveHisFile}
            biaFiles={biaFiles}
            biaRecordCount={combinedBiaRecords.length}
            onAddBiaFiles={handleAddBiaFiles}
            onReplaceBiaFiles={handleReplaceBiaFiles}
            onReplaceSingleBiaFile={handleReplaceSingleBiaFile}
            onRemoveBiaFile={handleRemoveBiaFile}
            onChangeBiaSheet={handleChangeBiaSheet}
            isProcessing={isProcessing}
            onProcess={handleProcess}
            onClearImport={handleClearImport}
          />
        )}

        {/* Results Section */}
        {summary && matchedResults.length > 0 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Interactive File Manager Bar in Results View */}
            <ResultsFileManagerBar
              hisFiles={hisFiles}
              hisRecordCount={combinedHisRecords.length}
              onAddHisFiles={handleAddHisFiles}
              onReplaceHisFiles={handleReplaceHisFiles}
              onReplaceSingleHisFile={handleReplaceSingleHisFile}
              onRemoveHisFile={handleRemoveHisFile}
              biaFiles={biaFiles}
              biaRecordCount={combinedBiaRecords.length}
              onAddBiaFiles={handleAddBiaFiles}
              onReplaceBiaFiles={handleReplaceBiaFiles}
              onReplaceSingleBiaFile={handleReplaceSingleBiaFile}
              onRemoveBiaFile={handleRemoveBiaFile}
              onChangeBiaSheet={handleChangeBiaSheet}
              isUploadVisible={isUploadVisible}
              onToggleUploadVisible={() => setIsUploadVisible(prev => !prev)}
              onClearImport={handleClearImport}
            />

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
        allHisRecords={combinedHisRecords}
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
