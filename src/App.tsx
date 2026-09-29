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
} from './services/dataEngine';

export const App: React.FC = () => {
  // Authentication State
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return localStorage.getItem(ACCESS_AUTH_KEY) === ACCESS_AUTH_HASH;
  });

  // Modals
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [disambiguatingRecord, setDisambiguatingRecord] = useState<MatchedRecord | null>(null);

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

        // If there are duplicate warnings, switch directly to warning filter to prompt review
        if (sum.warningConflictCount > 0 || sum.warningResolvedCount > 0) {
          setActiveFilter('all');
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
        onOpenAbout={() => setIsAboutOpen(true)}
        onLockApp={handleLockApp}
      />

      {/* 3. MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Upload Zone */}
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

        {/* Results Section */}
        {summary && matchedResults.length > 0 && (
          <div className="space-y-5 animate-in fade-in duration-200">
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

      <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

      {/* 5. FOOTER */}
      <Footer onOpenAbout={() => setIsAboutOpen(true)} />
    </div>
  );
};

export default App;
