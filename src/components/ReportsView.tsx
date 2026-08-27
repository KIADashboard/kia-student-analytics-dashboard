import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  Sparkles, 
  Filter, 
  Calendar, 
  Building, 
  Layers, 
  CheckCircle2,
  Clock,
  HardDriveDownload,
  FileSpreadsheet,
  FileCheck
} from 'lucide-react';
import { Student, ReportConfig, GeneratedReport } from '../types';
import { 
  DISTRICT_LIST, 
  DEPARTMENT_LIST, 
  ACADEMIC_YEARS, 
  SCHOOL_TYPE_LIST, 
  QUOTA_LIST 
} from '../data/mockStudents';
import { ReportPdfModal } from './ReportPdfModal';

interface ReportsViewProps {
  students: Student[];
  allStudents: Student[];
  onShowToast: (message: string, type?: 'success' | 'info') => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  students: _students,
  allStudents,
  onShowToast
}) => {
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    reportType: 'Academic Performance Summary',
    batch: 'All Batches (2021–2025)',
    department: 'All Departments',
    quota: 'All Quotas',
    district: 'All Districts',
    schoolType: 'All School Types',
    minMarks: 0
  });

  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);
  
  const [recentReports, setRecentReports] = useState<GeneratedReport[]>([
    {
      id: 'REP-2025-081',
      title: 'Batch 2021–2025 Consolidated Final Grade Audit',
      type: 'Academic Performance Summary',
      batch: 'Batch 2021–2025',
      department: 'All Departments',
      recordCount: 480,
      generatedAt: 'Today, 02:45 PM',
      fileSize: '142 KB',
      format: 'CSV'
    },
    {
      id: 'REP-2025-080',
      title: 'First Generation Graduate & Scholarship Concession Audit',
      type: 'Scholarship & Fee Concession Registry',
      batch: 'All Batches',
      department: 'CSE & AI-DS',
      recordCount: 124,
      generatedAt: 'Today, 11:20 AM',
      fileSize: '48 KB',
      format: 'PDF'
    },
    {
      id: 'REP-2025-079',
      title: 'TNEA Single Window Merit Admission Quota Distribution',
      type: 'Admission & Quota Distribution',
      batch: 'Batch 2024–2028',
      department: 'All Departments',
      recordCount: 395,
      generatedAt: 'Yesterday, 04:15 PM',
      fileSize: '96 KB',
      format: 'CSV'
    }
  ]);

  // Compute matching students based on report form configuration
  const matchingStudents = allStudents.filter(student => {
    if (reportConfig.batch !== 'All Batches (2021–2025)') {
      const yearMatch = reportConfig.batch.match(/\d{4}/);
      if (yearMatch && student.academicYear !== parseInt(yearMatch[0])) {
        return false;
      }
    }
    if (reportConfig.department !== 'All Departments') {
      const dept = DEPARTMENT_LIST.find(d => d.name === reportConfig.department);
      if (dept && student.departmentCode !== dept.code) {
        return false;
      }
    }
    if (reportConfig.quota !== 'All Quotas' && !student.quota.includes(reportConfig.quota.replace('All Quotas', ''))) {
      if (student.quota !== reportConfig.quota) return false;
    }
    if (reportConfig.district !== 'All Districts' && student.district !== reportConfig.district) {
      return false;
    }
    if (reportConfig.schoolType !== 'All School Types' && student.schoolType !== reportConfig.schoolType) {
      return false;
    }
    if (student.marksPercentage < reportConfig.minMarks) {
      return false;
    }
    return true;
  });

  const matchingCount = matchingStudents.length;
  const avgMarks = matchingCount > 0 
    ? (matchingStudents.reduce((acc, s) => acc + s.marksPercentage, 0) / matchingCount).toFixed(1)
    : '0';
  const avgCgpa = matchingCount > 0 
    ? (matchingStudents.reduce((acc, s) => acc + s.cgpa, 0) / matchingCount).toFixed(2)
    : '0';

  // Export real CSV
  const handleDownloadCsv = () => {
    if (matchingStudents.length === 0) {
      onShowToast('No matching records found for this batch criteria.', 'info');
      return;
    }

    const headers = [
      'Student ID',
      'Roll Number',
      'Student Name',
      'Department',
      'Batch',
      'Current Semester',
      'Gender',
      'District',
      'Social Category',
      'Admission Quota',
      'Schooling Type',
      'Cutoff Score',
      'CGPA',
      'Marks %',
      'Attendance %',
      'Backlogs',
      'First Gen Graduate',
      'Scholarship Status',
      'Mentor'
    ];

    const rows = matchingStudents.map(s => [
      `"${s.id}"`,
      `"${s.rollNo}"`,
      `"${s.name}"`,
      `"${s.department}"`,
      `"${s.batch}"`,
      s.currentSemester,
      `"${s.gender}"`,
      `"${s.district}"`,
      `"${s.category}"`,
      `"${s.quota}"`,
      `"${s.schoolType}"`,
      s.cutoffScore,
      s.cgpa,
      s.marksPercentage,
      s.attendance,
      s.backlogs,
      s.firstGenerationGraduate ? 'Yes' : 'No',
      `"${s.scholarship}"`,
      `"${s.mentorName}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const fileName = `KCT_${reportConfig.reportType.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.csv`;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Add to recent reports log
    const newReport: GeneratedReport = {
      id: `REP-2025-${Math.floor(100 + Math.random() * 900)}`,
      title: `${reportConfig.reportType} (${reportConfig.batch})`,
      type: reportConfig.reportType,
      academicYear: reportConfig.batch,
      department: reportConfig.department,
      recordCount: matchingCount,
      generatedAt: 'Just now',
      fileSize: `${Math.round(matchingCount * 0.8 + 12)} KB`,
      format: 'CSV'
    };
    setRecentReports(prev => [newReport, ...prev]);
    onShowToast(`Downloaded Batch CSV Report (${matchingCount} records)`, 'success');
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      onShowToast(`Batch Report '${reportConfig.reportType}' generated successfully with ${matchingCount} records!`, 'success');
    }, 600);
  };

  const handleCopyJson = () => {
    const dataset = matchingStudents.map(s => ({
      id: s.id,
      rollNo: s.rollNo,
      name: s.name,
      department: s.department,
      batch: s.batch,
      cgpa: s.cgpa,
      marksPercentage: s.marksPercentage,
      quota: s.quota,
      district: s.district
    }));

    navigator.clipboard.writeText(JSON.stringify(dataset, null, 2));
    setCopiedJson(true);
    onShowToast('JSON Dataset copied to clipboard!', 'info');
    setTimeout(() => setCopiedJson(false), 2500);
  };

  return (
    <div id="reports-view" className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* View Title */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <span>Institutional Batch Reports & Data Exports</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            Official Academic Registrar Suite
          </span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Generate, preview, and download institutional cohort data summaries, semester transcripts, and regulatory audit dossiers.
        </p>
      </div>

      {/* Main Grid: Report Generation Form + Live Batch Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Report Generation Panel (Form Controls) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="p-1.5 rounded-md bg-slate-100 text-slate-700">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Batch Report Configuration
              </h3>
              <p className="text-[11px] text-slate-500">Specify data dimensions and parameters</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Report Type */}
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Report Type
              </label>
              <select
                id="report-type-select"
                value={reportConfig.reportType}
                onChange={(e) => setReportConfig({ ...reportConfig, reportType: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium text-slate-800 focus:ring-2 focus:ring-slate-300/40 focus:border-slate-400 transition"
              >
                <option value="Academic Performance Summary">Academic Performance Summary</option>
                <option value="Admission & Quota Distribution">Admission & Quota Distribution</option>
                <option value="Demographic & Feeder District Census">Demographic & Feeder District Census</option>
                <option value="Consolidated Grade Sheet">Consolidated Grade Sheet</option>
                <option value="At-Risk & Arrear Student Audit">At-Risk & Arrear Student Audit</option>
                <option value="Scholarship & Fee Concession Registry">Scholarship & Fee Concession Registry</option>
              </select>
            </div>

            {/* Batch / Period */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>Batch / Academic Period</span>
              </label>
              <select
                value={reportConfig.batch}
                onChange={(e) => setReportConfig({ ...reportConfig, batch: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium text-slate-800 focus:ring-2 focus:ring-slate-300/40 focus:border-slate-400 transition"
              >
                <option value="All Batches (2021–2025)">All Batches Combined (2021–2025)</option>
                <option value="Batch 2021–2025 (Final Year / Sem 8)">Batch 2021–2025 (Final Year)</option>
                <option value="Batch 2022–2026 (Third Year / Sem 6)">Batch 2022–2026 (Third Year)</option>
                <option value="Batch 2023–2027 (Second Year / Sem 4)">Batch 2023–2027 (Second Year)</option>
                <option value="Batch 2024–2028 (First Year / Sem 2)">Batch 2024–2028 (First Year)</option>
                <option value="Batch 2025–2029 (Admitted / Sem 1)">Batch 2025–2029 (Admitted)</option>
              </select>
            </div>

            {/* Department */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Building className="w-3 h-3 text-slate-400" />
                <span>Department / Stream</span>
              </label>
              <select
                value={reportConfig.department}
                onChange={(e) => setReportConfig({ ...reportConfig, department: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium text-slate-800 focus:ring-2 focus:ring-slate-300/40 focus:border-slate-400 transition"
              >
                {DEPARTMENT_LIST.map(d => (
                  <option key={d.code} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            {/* Quota */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Admission Quota
              </label>
              <select
                value={reportConfig.quota}
                onChange={(e) => setReportConfig({ ...reportConfig, quota: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium text-slate-800 focus:ring-2 focus:ring-slate-300/40 focus:border-slate-400 transition"
              >
                {QUOTA_LIST.map(q => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
            </div>

            {/* District */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Feeder District
              </label>
              <select
                value={reportConfig.district}
                onChange={(e) => setReportConfig({ ...reportConfig, district: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium text-slate-800 focus:ring-2 focus:ring-slate-300/40 focus:border-slate-400 transition"
              >
                {DISTRICT_LIST.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* School Type */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Schooling Type
              </label>
              <select
                value={reportConfig.schoolType}
                onChange={(e) => setReportConfig({ ...reportConfig, schoolType: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium text-slate-800 focus:ring-2 focus:ring-slate-300/40 focus:border-slate-400 transition"
              >
                {SCHOOL_TYPE_LIST.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Minimum Marks */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Minimum Marks Threshold ({reportConfig.minMarks}%)
              </label>
              <input
                type="range"
                min="0"
                max="90"
                step="5"
                value={reportConfig.minMarks}
                onChange={(e) => setReportConfig({ ...reportConfig, minMarks: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-800"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0% (All)</span>
                <span>55% Pass</span>
                <span>75% Distinction</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setReportConfig({
                reportType: 'Academic Performance Summary',
                batch: 'All Batches (2021–2025)',
                department: 'All Departments',
                quota: 'All Quotas',
                district: 'All Districts',
                schoolType: 'All School Types',
                minMarks: 0
              })}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
            >
              Reset Configuration
            </button>

            <button
              id="btn-generate-report"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg border border-slate-200 transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-600" />
              <span>{isGenerating ? 'Compiling Metrics...' : 'Generate Live Preview'}</span>
            </button>
          </div>
        </div>

        {/* Right: Live Summary Preview & Action Buttons */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          {/* Summary Preview Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex-1">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-slate-100 text-slate-700">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Batch Dataset Summary
                  </h3>
                  <p className="text-[11px] text-slate-500">Live matched record breakdown</p>
                </div>
              </div>

              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                Ready for Export
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-slate-600 font-medium">Target Registry Strength</span>
                <span className="text-base font-bold text-slate-900">
                  {matchingCount} Student Records
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Average CGPA</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{avgCgpa} / 10.0</div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Average Marks</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{avgMarks}%</div>
                </div>
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-600">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Selected Department:</span>
                  <span className="font-semibold text-slate-900 truncate max-w-[170px]">{reportConfig.department}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Estimated File Size:</span>
                  <span className="font-mono text-slate-800">{Math.round(matchingCount * 0.8 + 12)} KB (CSV)</span>
                </div>

                <div className="flex justify-between py-1">
                  <span>Validation Status:</span>
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-slate-500" />
                    <span>Institutional Verified</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Prominent Action Buttons */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <button
                id="btn-download-csv"
                onClick={handleDownloadCsv}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center justify-center gap-2 group"
              >
                <FileSpreadsheet className="w-4 h-4 text-slate-300" />
                <span>Download Batch Report (CSV)</span>
              </button>

              <button
                id="btn-download-pdf"
                onClick={() => setIsPdfModalOpen(true)}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-semibold border border-slate-200 hover:border-slate-300 shadow-2xs transition flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4 text-slate-500" />
                <span>Download Batch Report (PDF) / Print</span>
              </button>

              <button
                onClick={handleCopyJson}
                className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg text-xs font-medium border border-slate-200 transition flex items-center justify-center gap-1.5"
              >
                {copiedJson ? <Check className="w-3.5 h-3.5 text-slate-800" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copiedJson ? 'JSON Copied to Clipboard!' : 'Copy Raw JSON Dataset'}</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Batch Reports Audit Log */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Recent Batch Generated Reports History
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">Archived Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-2.5 px-4">Report ID</th>
                <th className="py-2.5 px-4">Report Title & Type</th>
                <th className="py-2.5 px-3">Target Batch</th>
                <th className="py-2.5 px-3">Records</th>
                <th className="py-2.5 px-3">Generated At</th>
                <th className="py-2.5 px-3">File Size</th>
                <th className="py-2.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentReports.map((rep) => (
                <tr key={rep.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{rep.id}</td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{rep.title}</div>
                    <div className="text-[10px] text-slate-400">{rep.type}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-medium">{rep.batch}</td>
                  <td className="py-3 px-3 font-bold text-slate-800">{rep.recordCount}</td>
                  <td className="py-3 px-3 text-slate-500">{rep.generatedAt}</td>
                  <td className="py-3 px-3 font-mono text-slate-600">{rep.fileSize}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={handleDownloadCsv}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold rounded border border-slate-200 transition inline-flex items-center gap-1"
                    >
                      <HardDriveDownload className="w-3 h-3 text-slate-500" />
                      <span>Re-download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PDF Modal */}
      <ReportPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        reportConfig={reportConfig}
        matchingStudents={matchingStudents}
      />
    </div>
  );
};
