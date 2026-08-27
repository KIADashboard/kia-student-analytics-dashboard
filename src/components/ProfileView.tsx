import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Printer, 
  Download, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Award, 
  BookOpen, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Calendar, 
  Home, 
  UserCheck, 
  FileText,
  BadgePercent,
  BarChart3,
  ExternalLink,
  Database
} from 'lucide-react';
import { Student } from '../types';

interface ProfileViewProps {
  student: Student;
  onBack: () => void;
  onExportStudentReport?: (student: Student) => void;
  onNavigateToAnalytics?: () => void;
  onNavigateToReports?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ 
  student, 
  onBack,
  onExportStudentReport,
  onNavigateToAnalytics,
  onNavigateToReports
}) => {
  const [activeProfileTab, setActiveProfileTab] = useState<'overview' | 'academics' | 'admission' | 'activities'>('overview');

  const handlePrint = () => {
    window.print();
  };

  const isDistinction = student.marksPercentage >= 85;

  return (
    <div id="profile-view" className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4 no-print">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-2xs transition group"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:-translate-x-0.5 transition" />
          <span>Back to Student Directory</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {/* Analytics Drill-through Action */}
          {onNavigateToAnalytics && (
            <button
              onClick={onNavigateToAnalytics}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-2xs transition flex items-center gap-1.5"
              title="View cohort analytics for this student's year and department"
            >
              <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
              <span>View Analytics</span>
            </button>
          )}

          {/* Reports Action */}
          {onNavigateToReports && (
            <button
              onClick={onNavigateToReports}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-2xs transition flex items-center gap-1.5"
              title="Generate structured institutional report"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Generate Report</span>
            </button>
          )}

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-2xs transition flex items-center gap-1.5"
            title="Print Student Institutional Profile Card"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Profile</span>
          </button>

          <button
            onClick={() => onExportStudentReport && onExportStudentReport(student)}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xs transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Dossier</span>
          </button>
        </div>
      </div>

      {/* Institutional Student Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Banner with Institution Branding & Data Source Indicator */}
        <div className="h-16 bg-slate-900 px-6 py-4 flex items-center justify-between text-slate-200 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
            <GraduationCap className="w-4 h-4 text-slate-400" />
            <span>Institutional Student Registry</span>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 border border-slate-700">
              <Database className="w-3 h-3 text-slate-400" />
              <span>Source: {student.academicYear} Student Dataset</span>
            </span>
          </div>
          <div className="text-right text-[11px] font-mono text-slate-400">
            REG NO: {student.rollNo}
          </div>
        </div>

        {/* Profile Card Main Body */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-8 mb-5">
            <div className="flex items-end gap-4">
              {/* Avatar placeholder with initials */}
              <div className="w-18 h-18 rounded-2xl bg-white p-1.5 shadow-sm border border-slate-200 shrink-0">
                <div className="w-full h-full rounded-xl bg-slate-800 text-white font-bold text-xl flex items-center justify-center shadow-inner">
                  {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
              </div>

              {/* Name and Basic Title */}
              <div className="pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    {student.name}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                    {student.status}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-600 mt-1 flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-slate-800">{student.degree}</span>
                  <span className="text-slate-300">&bull;</span>
                  <span>Semester {student.currentSemester} (Batch {student.batch})</span>
                </p>
              </div>
            </div>

            {/* Student ID Pill */}
            <div className="flex items-center gap-2">
              <div className="text-left md:text-right bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                <div className="text-[10px] uppercase font-bold text-slate-400">Institutional ID</div>
                <div className="text-xs font-mono font-bold text-slate-900">{student.id}</div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Metric Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 border-t border-slate-100">
            {/* CGPA */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cumulative GPA</div>
              <div className="text-lg font-bold text-slate-900 mt-0.5 flex items-baseline gap-1">
                <span>{student.cgpa}</span>
                <span className="text-[10px] font-normal text-slate-500">/ 10.0</span>
              </div>
              <div className="text-[10px] text-slate-600 font-medium mt-0.5">
                {isDistinction ? 'Distinction' : 'First Class'}
              </div>
            </div>

            {/* Marks % */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Marks %</div>
              <div className="text-lg font-bold text-slate-900 mt-0.5">
                {student.marksPercentage}%
              </div>
              <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                Cutoff: {student.cutoffScore}
              </div>
            </div>

            {/* Attendance */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Attendance</div>
              <div className="text-lg font-bold text-slate-900 mt-0.5">
                {student.attendance}%
              </div>
              <div className="text-[10px] text-slate-600 font-medium mt-0.5">
                Eligible for Exams
              </div>
            </div>

            {/* Credits */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Credits Earned</div>
              <div className="text-lg font-bold text-slate-900 mt-0.5">
                {student.creditsEarned} <span className="text-[10px] font-normal text-slate-400">/ {student.totalCredits}</span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                On Track for Degree
              </div>
            </div>

            {/* Backlogs */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Arrears</div>
              <div className="text-lg font-bold text-slate-900 mt-0.5">
                {student.backlogs}
              </div>
              <div className="text-[10px] text-slate-600 font-medium mt-0.5">
                {student.backlogs === 0 ? 'Clear Record' : 'Arrear Action'}
              </div>
            </div>

            {/* Placement Readiness */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Career Readiness</div>
              <div className="text-lg font-bold text-slate-900 mt-0.5">
                {student.placementReadiness}%
              </div>
              <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                Tier-1 Eligible
              </div>
            </div>
          </div>
        </div>

        {/* Profile Internal Tabs */}
        <div className="px-6 border-t border-slate-200 bg-slate-50/70 flex items-center gap-2 overflow-x-auto no-print">
          <button
            onClick={() => setActiveProfileTab('overview')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition whitespace-nowrap ${
              activeProfileTab === 'overview'
                ? 'border-slate-800 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Personal & Demographic Info
          </button>

          <button
            onClick={() => setActiveProfileTab('academics')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition whitespace-nowrap ${
              activeProfileTab === 'academics'
                ? 'border-slate-800 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Academic Transcript & Courses
          </button>

          <button
            onClick={() => setActiveProfileTab('admission')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition whitespace-nowrap ${
              activeProfileTab === 'admission'
                ? 'border-slate-800 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Admission & Quota Details
          </button>

          <button
            onClick={() => setActiveProfileTab('activities')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition whitespace-nowrap ${
              activeProfileTab === 'activities'
                ? 'border-slate-800 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Skills, Leadership & Clubs
          </button>
        </div>
      </div>

      {/* Tab Content 1: Overview (Personal & Demographic Info) */}
      {(activeProfileTab === 'overview' || true) && (
        <div className={`${activeProfileTab !== 'overview' ? 'hidden print:block' : ''} grid grid-cols-1 md:grid-cols-2 gap-5`}>
          {/* Personal Information Grid */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-slate-600" />
              <span>Personal & Contact Information</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Date of Birth</span>
                <span className="font-semibold text-slate-900">{student.dob}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Gender</span>
                <span className="font-semibold text-slate-900">{student.gender}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Blood Group</span>
                <span className="font-bold text-slate-800">{student.bloodGroup}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Institutional Email</span>
                <span className="font-mono text-slate-800 font-medium">{student.email}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Mobile Phone</span>
                <span className="font-semibold text-slate-900">{student.phone}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Residential Status</span>
                <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {student.residentialType}
                </span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-slate-500">Faculty Advisor / Mentor</span>
                <span className="font-semibold text-slate-900">{student.mentorName}</span>
              </div>
            </div>
          </div>

          {/* Guardian & Geographic Demographics */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Home className="w-4 h-4 text-slate-600" />
              <span>Guardian & Geographic Background</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Parent / Guardian Name</span>
                <span className="font-semibold text-slate-900">{student.guardianName}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Relationship</span>
                <span className="font-semibold text-slate-900">{student.guardianRelation}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Guardian Contact</span>
                <span className="font-semibold text-slate-900">{student.guardianPhone}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Home District</span>
                <span className="font-semibold text-slate-900 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  {student.district}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">State of Domicile</span>
                <span className="font-semibold text-slate-900">{student.state}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Annual Household Income</span>
                <span className="font-semibold text-slate-900">{student.annualIncome} ({student.incomeCategory})</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Agriculture Background</span>
                <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                  {student.agricultureBackground === 'Yes' ? 'Yes (Farming Family)' : 'No'}
                </span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-slate-500">First Generation Graduate</span>
                <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                  {student.firstGenerationGraduate ? 'Yes · Eligible for Scheme' : 'No'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: Academic Transcript & Courses */}
      {(activeProfileTab === 'academics' || true) && (
        <div className={`${activeProfileTab !== 'academics' ? 'hidden print:block' : ''} space-y-5`}>
          {/* Recent Subjects Grade Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-slate-600" />
                <span>Current Semester Coursework & Examination Grades</span>
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                Semester {student.currentSemester} Continuous Assessment
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Course Code</th>
                    <th className="py-2.5 px-4">Subject Title</th>
                    <th className="py-2.5 px-3 text-center">Credits</th>
                    <th className="py-2.5 px-3 text-center">Grade Point</th>
                    <th className="py-2.5 px-3 text-right">Letter Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {student.recentSubjects.map((sub) => (
                    <tr key={sub.code} className="hover:bg-slate-50/80">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{sub.code}</td>
                      <td className="py-2.5 px-4 font-semibold text-slate-900">{sub.name}</td>
                      <td className="py-2.5 px-3 text-center font-medium text-slate-600">{sub.credits}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-900">{sub.gradePoint}</td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                          {sub.grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Semester-by-Semester GPA Progression */}
          {student.semesterGrades.length > 0 && (
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                <Award className="w-4 h-4 text-slate-600" />
                <span>Semester-Wise GPA Progression History</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {student.semesterGrades.map((sem) => (
                  <div key={sem.semester} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
                    <div className="text-[11px] font-bold text-slate-700">{sem.semester}</div>
                    <div className="text-base font-bold text-slate-900 mt-1">{sem.gpa}</div>
                    <div className="text-[10px] text-slate-500 font-medium mt-0.5">{sem.credits} credits</div>
                    <div className="mt-1 text-[9px] font-medium text-slate-600 truncate">
                      {sem.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab Content 3: Admission & Quota Details */}
      {(activeProfileTab === 'admission' || true) && (
        <div className={`${activeProfileTab !== 'admission' ? 'hidden print:block' : ''} grid grid-cols-1 md:grid-cols-2 gap-5`}>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-slate-600" />
              <span>Admission & Entry Quota Credentials</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Admission Batch</span>
                <span className="font-semibold text-slate-900">{student.batch}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Admission Mode / Quota</span>
                <span className="font-semibold text-slate-900">{student.quota}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Social Category (Communal Reservation)</span>
                <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {student.category}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">TNEA / Counselling Cutoff Score</span>
                <span className="font-bold text-slate-900">{student.cutoffScore} / 200</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Higher Secondary (HSC) Marks</span>
                <span className="font-semibold text-slate-900">{student.hscMarks}%</span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-slate-500">Prior Schooling Type</span>
                <span className="font-semibold text-slate-900">{student.schoolType}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-slate-600" />
              <span>Scholarships & Financial Concessions</span>
            </h3>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-4">
              <div className="text-xs font-bold text-slate-900 mb-1">Assigned Institutional Scholarship</div>
              <p className="text-xs text-slate-700 font-medium">
                {student.scholarship}
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-600 shrink-0" />
                <span>Government & institutional tuition fee waiver verified by Finance Office.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-600 shrink-0" />
                <span>Zero pending semester tuition dues for current academic session.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 4: Skills, Leadership & Clubs */}
      {(activeProfileTab === 'activities' || true) && (
        <div className={`${activeProfileTab !== 'activities' ? 'hidden print:block' : ''} grid grid-cols-1 md:grid-cols-2 gap-5`}>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-slate-600" />
              <span>Technical Competencies & Skills</span>
            </h3>

            <div className="flex flex-wrap gap-2">
              {student.skills.map((skill) => (
                <span 
                  key={skill} 
                  className="px-2.5 py-1 bg-slate-100 text-slate-700 font-semibold rounded-md border border-slate-200 text-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Award className="w-4 h-4 text-slate-600" />
              <span>Co-Curricular & Student Leadership</span>
            </h3>

            <div className="space-y-2.5">
              {student.activities.map((act, index) => (
                <div key={index} className="flex items-center gap-2 text-xs text-slate-800 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0"></div>
                  <span>{act}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
