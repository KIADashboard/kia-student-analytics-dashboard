import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  GraduationCap, 
  CheckCircle2, 
  FileText, 
  Building2 
} from 'lucide-react';
import { Student, ReportConfig } from '../types';
import { InstitutionLogo } from './InstitutionLogo';

interface ReportPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportConfig: ReportConfig;
  matchingStudents: Student[];
}

export const ReportPdfModal: React.FC<ReportPdfModalProps> = ({
  isOpen,
  onClose,
  reportConfig,
  matchingStudents
}) => {
  if (!isOpen) return null;

  const totalCount = matchingStudents.length;
  const avgMarks = totalCount > 0 
    ? (matchingStudents.reduce((acc, s) => acc + s.marksPercentage, 0) / totalCount).toFixed(1)
    : '0';
  const avgCgpa = totalCount > 0 
    ? (matchingStudents.reduce((acc, s) => acc + s.cgpa, 0) / totalCount).toFixed(2)
    : '0';

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCsv = () => {
    const headers = [
      'Student ID',
      'Roll Number',
      'Student Name',
      'Department',
      'Batch',
      'Current Semester',
      'Gender',
      'District',
      'Category',
      'Quota',
      'School Type',
      'Cutoff Score',
      'CGPA',
      'Marks %',
      'Attendance %',
      'Backlogs',
      'First Gen Graduate',
      'Scholarship'
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
      `"${s.scholarship}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Institutional_${reportConfig.reportType.replace(/\s+/g, '_')}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-slate-300" />
            <div>
              <h3 className="text-sm font-bold tracking-tight">Institutional Official Batch Report Preview</h3>
              <p className="text-[11px] text-slate-400">Printable PDF & Document Format</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition"
            >
              <Printer className="w-3.5 h-3.5 text-slate-300" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={handleDownloadCsv}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition"
            >
              <Download className="w-3.5 h-3.5 text-slate-300" />
              <span>CSV File</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Container */}
        <div className="flex-1 p-8 overflow-y-auto bg-white font-sans text-slate-900 space-y-6">
          {/* Institutional Document Header */}
          <div className="border-b-2 border-slate-900 pb-4 text-center">
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-widest">
              <InstitutionLogo className="w-5 h-5 object-contain" />
              <span>Kumaraguru Institute of Agriculture</span>
            </div>
            <h1 className="text-lg font-black text-slate-900 uppercase mt-1 tracking-tight">
              Office of Academic Affairs & Institutional Analytics
            </h1>
            <p className="text-xs text-slate-600 font-medium">
              Accredited by NAAC with 'A++' Grade &middot; Approved by AICTE &middot; Affiliated to Anna University
            </p>
            <div className="mt-3 py-1.5 px-4 bg-slate-100 rounded text-xs font-bold uppercase tracking-wider text-slate-900 inline-block border border-slate-300">
              OFFICIAL BATCH RECORD: {reportConfig.reportType}
            </div>
          </div>

          {/* Meta Summary Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Target Cohort</span>
              <span className="font-bold text-slate-900">{reportConfig.batch}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Department</span>
              <span className="font-bold text-slate-900">{reportConfig.department}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Batch Strength</span>
              <span className="font-bold text-slate-900">{totalCount} Verified Records</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Aggregate CGPA</span>
              <span className="font-bold text-slate-900">{avgCgpa} / 10.0 ({avgMarks}%)</span>
            </div>
          </div>

          {/* Records Table */}
          <div>
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Student Cohort Registry</span>
              <span className="text-[11px] font-normal text-slate-500">Generated on {new Date().toLocaleDateString()}</span>
            </div>

            <table className="w-full text-left text-xs border border-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-[10px] font-bold text-slate-700 uppercase">
                  <th className="py-2 px-2.5 border-r border-slate-300">ID</th>
                  <th className="py-2 px-3 border-r border-slate-300">Student Name</th>
                  <th className="py-2 px-2 border-r border-slate-300 text-center">Batch</th>
                  <th className="py-2 px-2 border-r border-slate-300 text-center">Dept</th>
                  <th className="py-2 px-2.5 border-r border-slate-300">District</th>
                  <th className="py-2 px-2.5 border-r border-slate-300">Quota / Category</th>
                  <th className="py-2 px-2 text-right border-r border-slate-300">Marks %</th>
                  <th className="py-2 px-2 text-right">CGPA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {matchingStudents.map((s, index) => (
                  <tr key={s.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                    <td className="py-2 px-2.5 font-mono font-bold text-slate-900 border-r border-slate-200">{s.id}</td>
                    <td className="py-2 px-3 font-semibold text-slate-900 border-r border-slate-200">{s.name}</td>
                    <td className="py-2 px-2 text-center text-slate-600 border-r border-slate-200">{s.academicYear}</td>
                    <td className="py-2 px-2 text-center font-bold text-slate-800 border-r border-slate-200">{s.departmentCode}</td>
                    <td className="py-2 px-2.5 text-slate-600 border-r border-slate-200">{s.district}</td>
                    <td className="py-2 px-2.5 text-slate-600 border-r border-slate-200 text-[11px] truncate">{s.quota}</td>
                    <td className="py-2 px-2 text-right font-bold text-slate-900 border-r border-slate-200">{s.marksPercentage}%</td>
                    <td className="py-2 px-2 text-right font-bold text-slate-900">{s.cgpa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Institutional Sign-off Footer */}
          <div className="pt-8 mt-6 border-t border-slate-200 grid grid-cols-3 gap-4 text-center text-xs text-slate-600">
            <div>
              <div className="h-10 border-b border-dashed border-slate-400 mb-1"></div>
              <span className="font-semibold text-slate-800">Prepared By</span>
              <div className="text-[10px] text-slate-500">Institutional Data Analyst</div>
            </div>
            <div>
              <div className="h-10 border-b border-dashed border-slate-400 mb-1"></div>
              <span className="font-semibold text-slate-800">Verified By</span>
              <div className="text-[10px] text-slate-500">Head of Department</div>
            </div>
            <div>
              <div className="h-10 border-b border-dashed border-slate-400 mb-1"></div>
              <span className="font-semibold text-slate-800">Approved By</span>
              <div className="text-[10px] text-slate-500">Dean of Academics & Controller</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
