import React, { useState, useEffect, useRef } from 'react';
import {
  BarChart3,
  LogOut,
  Moon,
  Pencil,
  Save,
  ShieldCheck,
  Sun,
  UserRound,
  X
} from 'lucide-react';
import { Student, StudentPortalTab, StudentProfile, ThemeMode } from '../types';
import kiaLogo from '../assets/kia-logo.png';
import kiaShield from '../assets/kiwal.png';

interface StudentPortalProps {
  student: Student;
  profile: StudentProfile;
  onLogout: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

const navItems: { id: StudentPortalTab; label: string; icon: React.ElementType }[] = [
  { id: 'profile', label: 'My Profile', icon: UserRound },
  { id: 'academics', label: 'My Academics', icon: BarChart3 }
];

const DEFAULT_TAB: StudentPortalTab = 'profile';

type EditableProfileData = {
  studentName: string;
  studentId: string;
  registrationNumber: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  nationality: string;
  religion: string;
  community: string;
  caste: string;
  motherTongue: string;
  residentialStatus: string;
  studentStatus: string;
  batch: string;
  academicYear: string;
  admissionType: string;
  admissionQuota: string;
  firstGraduate: string;
  department: string;
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
  guardianName: string;
  guardianPhone: string;
  fatherQualification: string;
  fatherOccupation: string;
  motherName: string;
  annualIncome: string;
  boardOfStudy: string;
  mediumOfStudy: string;
  schoolType: string;
  familyBackground: string;
  agriculturalLandAvailability: string;
  areaOfResidence: string;
};

const createEditableProfileData = (student: Student, profile: StudentProfile): EditableProfileData => ({
  studentName: student.name,
  studentId: student.id,
  registrationNumber: profile.registrationNumber,
  dateOfBirth: student.dob,
  gender: student.gender,
  bloodGroup: student.bloodGroup,
  nationality: profile.nationality,
  religion: profile.religion,
  community: profile.community,
  caste: profile.caste,
  motherTongue: profile.motherTongue,
  residentialStatus: student.residentialType,
  studentStatus: student.status,
  batch: student.batch,
  academicYear: String(student.academicYear),
  admissionType: profile.admissionType,
  admissionQuota: profile.admissionQuota,
  firstGraduate: profile.firstGraduate,
  department: student.department,
  phone: student.phone,
  email: student.email,
  whatsapp: profile.whatsappNumber || student.phone,
  address: profile.communicationAddress,
  guardianName: student.guardianName,
  guardianPhone: student.guardianPhone,
  fatherQualification: profile.fatherQualification,
  fatherOccupation: profile.fatherOccupation,
  motherName: profile.motherName,
  annualIncome: student.annualIncome,
  boardOfStudy: profile.boardOfStudy,
  mediumOfStudy: profile.mediumOfStudy,
  schoolType: student.schoolType,
  familyBackground: profile.familyBackground,
  agriculturalLandAvailability: profile.agriculturalLandAvailability,
  areaOfResidence: profile.areaOfResidence
});

const isEditableProfileData = (value: unknown, initialData: EditableProfileData): value is EditableProfileData => (
  typeof value === 'object'
  && value !== null
  && Object.keys(initialData).every(key => typeof (value as Record<string, unknown>)[key] === 'string')
);

const loadEditableProfileData = (student: Student, profile: StudentProfile): EditableProfileData => {
  const initialData = createEditableProfileData(student, profile);
  try {
    const savedData = window.localStorage.getItem(`kia-student-profile:${student.id}`);
    if (!savedData) return initialData;

    const parsedData: unknown = JSON.parse(savedData);
    if (!isEditableProfileData(parsedData, initialData)) {
      console.error(`Saved student profile data for ${student.id} has an invalid format.`);
      return initialData;
    }

    return parsedData;
  } catch (error) {
    console.error(`Could not load saved student profile data for ${student.id}.`, error);
    return initialData;
  }
};

const parseTabFromUrl = (): StudentPortalTab => {
  if (typeof window === 'undefined') return DEFAULT_TAB;

  // 1. Check URL hash (e.g. #profile, #academics, #home, #survey, #achievements)
  const hash = window.location.hash.replace(/^#[/]?/, '').toLowerCase().trim();
  if (hash === 'academics') return 'academics';
  if (hash === 'profile') return 'profile';

  // 2. Check query params (e.g. ?tab=academics or ?page=profile)
  const params = new URLSearchParams(window.location.search);
  const tabQuery = (params.get('tab') || params.get('page') || params.get('view') || '').toLowerCase().trim();
  if (tabQuery === 'academics') return 'academics';
  if (tabQuery === 'profile') return 'profile';

  // 3. Check path segment (e.g. /profile or /academics)
  const pathSegment = window.location.pathname.toLowerCase().split('/').filter(Boolean).pop() || '';
  if (pathSegment === 'academics') return 'academics';
  if (pathSegment === 'profile') return 'profile';

  return DEFAULT_TAB;
};

const Field = ({
  label,
  value,
  onChange,
  multiline = false,
  badge
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  multiline?: boolean;
  badge?: 'green' | 'amber' | 'neutral';
  key?: React.Key;
}) => onChange ? (
  multiline ? (
    <label className="block">
      <span className="portal-label mb-2 block">{label}</span>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        className="portal-input min-h-24 resize-y"
      />
    </label>
  ) : (
    <label className="block">
      <span className="portal-label mb-2 block">{label}</span>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        className="portal-input"
      />
    </label>
  )
) : (
  <div className="bg-[#FFFDEE]/30 p-3.5 rounded-xl border border-[#0C342C]/10 transition-all hover:bg-white hover:border-[#076653]/30">
    <span className="portal-label block">{label}</span>
    <div className="mt-1 flex items-center justify-between">
      <p className="text-sm font-semibold text-[#0C342C]">{value || 'Not provided'}</p>
      {badge === 'green' && (
        <span className="portal-badge green text-[10px] font-bold">Active</span>
      )}
      {badge === 'amber' && (
        <span className="portal-badge amber text-[10px] font-bold">Pending</span>
      )}
      {badge === 'neutral' && (
        <span className="portal-badge text-[10px] font-bold">Verified</span>
      )}
    </div>
  </div>
);

export const StudentPortal: React.FC<StudentPortalProps> = ({ student, profile, onLogout, theme, onToggleTheme }) => {
  const [activeTab, setActiveTab] = useState<StudentPortalTab>(() => parseTabFromUrl());
  const [sidebarHoverOpen, setSidebarHoverOpen] = useState(false);
  const hoverCloseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(() => loadEditableProfileData(student, profile));
  const [draftProfile, setDraftProfile] = useState(() => loadEditableProfileData(student, profile));
  const [profileSaveError, setProfileSaveError] = useState('');

  useEffect(() => () => {
    if (hoverCloseTimeout.current !== null) {
      clearTimeout(hoverCloseTimeout.current);
    }
  }, []);

  const cancelHoverClose = () => {
    if (hoverCloseTimeout.current !== null) {
      clearTimeout(hoverCloseTimeout.current);
      hoverCloseTimeout.current = null;
    }
  };
  const openSidebarOnHover = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse') return;
    cancelHoverClose();
    setSidebarHoverOpen(true);
  };
  const scheduleSidebarHoverClose = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse') return;
    cancelHoverClose();
    hoverCloseTimeout.current = setTimeout(() => setSidebarHoverOpen(false), 160);
  };
  const closeSidebar = () => {
    cancelHoverClose();
    setSidebarHoverOpen(false);
  };

  // URL handling & protection: prevent access to removed pages if manually entered in URL
  useEffect(() => {
    const syncFromUrl = () => {
      const resolved = parseTabFromUrl();
      setActiveTab(resolved);

      // If URL contains references to removed pages (home, achievements, survey), sanitize URL
      const currentHash = window.location.hash.toLowerCase();
      const currentSearch = window.location.search.toLowerCase();
      const currentPath = window.location.pathname.toLowerCase();
      const removedPatterns = ['home', 'achievement', 'survey'];
      const hasRemoved = removedPatterns.some(p => currentHash.includes(p) || currentSearch.includes(p) || currentPath.includes(p));

      if (hasRemoved) {
        window.history.replaceState(null, '', `#${resolved}`);
      }
    };

    syncFromUrl();
    window.addEventListener('hashchange', syncFromUrl);
    window.addEventListener('popstate', syncFromUrl);
    return () => {
      window.removeEventListener('hashchange', syncFromUrl);
      window.removeEventListener('popstate', syncFromUrl);
    };
  }, []);

  const go = (tab: StudentPortalTab) => {
    setActiveTab(tab);
    closeSidebar();
    window.history.replaceState(null, '', `#${tab}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const beginEditing = () => {
    setDraftProfile(profileData);
    setProfileSaveError('');
    setIsEditing(true);
  };
  const cancelEditing = () => {
    setDraftProfile(profileData);
    setProfileSaveError('');
    setIsEditing(false);
  };
  const saveProfile = () => {
    try {
      window.localStorage.setItem(`kia-student-profile:${student.id}`, JSON.stringify(draftProfile));
    } catch (error) {
      console.error(`Could not save student profile data for ${student.id}.`, error);
      setProfileSaveError('Your changes could not be saved in this browser. Please try again.');
      return;
    }

    setProfileData(draftProfile);
    setProfileSaveError('');
    setIsEditing(false);
  };
  const updateDraft = (field: keyof EditableProfileData, value: string) => {
    setDraftProfile(current => ({ ...current, [field]: value }));
  };

  const title = navItems.find(item => item.id === activeTab)?.label || 'My Profile';

  // 1. Academics Tab
  const renderAcademics = () => (
    <div className="space-y-6">
      <PageIntro
        kicker="Academic Record"
        title="My Academics"
        copy="Review your official secondary school examination history, subject breakdown, and institutional cut-off score."
      />

      <Section title="X Standard (Secondary Examination)">
        <InfoGrid fields={[
          ["Board of Examination", profile.tenthBoard],
          ["School Name", profile.tenthSchool],
          ["Passing Year", profile.tenthPassingDate],
          ["Medium of Instruction", profile.tenthMedium],
          ["Total Marks", profile.tenthMarks]
        ]} />
      </Section>

      <Section title="XII Standard (Higher Secondary Examination)">
        <InfoGrid fields={[
          ["Board of Examination", profile.twelfthBoard],
          ["School Name", profile.twelfthSchool],
          ["Passing Year", profile.twelfthPassingDate],
          ["Medium of Instruction", profile.twelfthMedium],
          ["Total Marks", profile.twelfthMarks],
          ["Cut-off Score", `${student.cutoffScore} / 200`]
        ]} />
      </Section>

      {profile.subjectMarks.length > 0 && (
        <Section title="Subject-wise Marks Breakdown">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {profile.subjectMarks.map(mark => (
              <div
                key={mark.name}
                className="p-4 bg-[#FFFDEE]/60 border border-[#0C342C]/10 rounded-xl hover:border-[#076653]/30 transition"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#076653] block">
                  {mark.name}
                </span>
                <strong className="block text-2xl font-serif text-[#0C342C] mt-1">
                  {mark.mark}
                </strong>
                <span className="text-[10px] text-[#06231D]/60 mt-1 block">Max: 100</span>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );

  // 2. Profile Tab
  const renderProfile = () => (
    <div className="space-y-6">
      <PageIntro
        kicker="Personal Record"
        title="My Profile"
        copy="Review your institutional registration details, residential standing, and update contact information."
        action={
          <button
            className="portal-primary"
            onClick={isEditing ? cancelEditing : beginEditing}
          >
            {isEditing ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
            {isEditing ? 'Cancel Editing' : 'Edit Profile'}
          </button>
        }
      />

      {isEditing && (
        <div className="portal-notice">
          <ShieldCheck className="w-5 h-5 text-[#076653] shrink-0 mt-0.5" />
          <span>
            Profile details can be edited for this session. Changes are not submitted to the college record system.
          </span>
        </div>
      )}

      {profileSaveError && (
        <div className="portal-notice" role="alert">
          <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{profileSaveError}</span>
        </div>
      )}

      <Section title="Personal Information">
        {isEditing ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <Field label="Student Name" value={draftProfile.studentName} onChange={v => updateDraft('studentName', v)} />
            <Field label="Student ID" value={draftProfile.studentId} onChange={v => updateDraft('studentId', v)} />
            <Field label="Registration Number" value={draftProfile.registrationNumber} onChange={v => updateDraft('registrationNumber', v)} />
            <Field label="Date of Birth" value={draftProfile.dateOfBirth} onChange={v => updateDraft('dateOfBirth', v)} />
            <Field label="Gender" value={draftProfile.gender} onChange={v => updateDraft('gender', v)} />
            <Field label="Blood Group" value={draftProfile.bloodGroup} onChange={v => updateDraft('bloodGroup', v)} />
            <Field label="Nationality" value={draftProfile.nationality} onChange={v => updateDraft('nationality', v)} />
            <Field label="Religion" value={draftProfile.religion} onChange={v => updateDraft('religion', v)} />
            <Field label="Community" value={draftProfile.community} onChange={v => updateDraft('community', v)} />
            <Field label="Caste" value={draftProfile.caste} onChange={v => updateDraft('caste', v)} />
            <Field label="Mother Tongue" value={draftProfile.motherTongue} onChange={v => updateDraft('motherTongue', v)} />
            <Field label="Residential Status" value={draftProfile.residentialStatus} onChange={v => updateDraft('residentialStatus', v)} />
          </div>
        ) : (
          <InfoGrid fields={[
            ["Student Name", profileData.studentName],
            ["Student ID", profileData.studentId],
            ["Registration Number", profileData.registrationNumber],
            ["Date of Birth", profileData.dateOfBirth],
            ["Gender", profileData.gender],
            ["Blood Group", profileData.bloodGroup],
            ["Nationality", profileData.nationality],
            ["Religion", profileData.religion],
            ["Community", profileData.community],
            ["Caste", profileData.caste],
            ["Mother Tongue", profileData.motherTongue],
            ["Residential Status", profileData.residentialStatus]
          ]} />
        )}
      </Section>

      <Section title="Academic & Institutional Status">
        {isEditing ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <Field label="Status" value={draftProfile.studentStatus} onChange={v => updateDraft('studentStatus', v)} />
            <Field label="Residential Type" value={draftProfile.residentialStatus} onChange={v => updateDraft('residentialStatus', v)} />
            <Field label="Batch Year" value={draftProfile.batch} onChange={v => updateDraft('batch', v)} />
            <Field label="Academic Year" value={draftProfile.academicYear} onChange={v => updateDraft('academicYear', v)} />
            <Field label="Admission Type" value={draftProfile.admissionType} onChange={v => updateDraft('admissionType', v)} />
            <Field label="Admission Quota" value={draftProfile.admissionQuota} onChange={v => updateDraft('admissionQuota', v)} />
            <Field label="First Graduate Status" value={draftProfile.firstGraduate} onChange={v => updateDraft('firstGraduate', v)} />
            <Field label="Department" value={draftProfile.department} onChange={v => updateDraft('department', v)} />
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-[#FFFDEE]/60 border border-[#0C342C]/10 rounded-xl">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#076653] block">Status</span>
                <span className="portal-badge green mt-2">{profileData.studentStatus}</span>
              </div>
              <div className="p-4 bg-[#FFFDEE]/60 border border-[#0C342C]/10 rounded-xl">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#076653] block">Residential Type</span>
                <span className="portal-badge mt-2 font-semibold text-[#0C342C]">{profileData.residentialStatus}</span>
              </div>
              <div className="p-4 bg-[#FFFDEE]/60 border border-[#0C342C]/10 rounded-xl">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#076653] block">Batch Year</span>
                <span className="font-serif text-lg font-bold text-[#0C342C] mt-1 block">{profileData.batch}</span>
              </div>
              <div className="p-4 bg-[#FFFDEE]/60 border border-[#0C342C]/10 rounded-xl">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#076653] block">Academic Year</span>
                <span className="font-serif text-lg font-bold text-[#0C342C] mt-1 block">{profileData.academicYear}</span>
              </div>
            </div>
            <InfoGrid fields={[
              ["Admission Type", profileData.admissionType],
              ["Admission Quota", profileData.admissionQuota],
              ["First Graduate Status", profileData.firstGraduate],
              ["Department", profileData.department]
            ]} />
          </>
        )}
      </Section>

      <Section title="Contact Information">
        <div className="grid sm:grid-cols-2 gap-5">
          {isEditing ? (
            <>
              <Field
                label="Mobile Number"
                value={draftProfile.phone}
                onChange={v => updateDraft('phone', v)}
              />
              <Field
                label="WhatsApp Number"
                value={draftProfile.whatsapp}
                onChange={v => updateDraft('whatsapp', v)}
              />
              <Field
                label="Email Address"
                value={draftProfile.email}
                onChange={v => updateDraft('email', v)}
              />
              <Field
                label="Address for Communication"
                value={draftProfile.address}
                onChange={v => updateDraft('address', v)}
                multiline
              />
            </>
          ) : (
            <>
              <Field label="Mobile Number" value={profileData.phone} badge="neutral" />
              <Field label="WhatsApp Number" value={profileData.whatsapp} badge="neutral" />
              <Field label="Official Email" value={profileData.email} badge="neutral" />
              <Field label="Address for Communication" value={profileData.address} />
            </>
          )}
        </div>
      </Section>

      <Section title="Family & Background Information">
        {isEditing ? (
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Father / Guardian" value={draftProfile.guardianName} onChange={v => updateDraft('guardianName', v)} />
            <Field label="Father's Contact" value={draftProfile.guardianPhone} onChange={v => updateDraft('guardianPhone', v)} />
            <Field label="Father's Qualification" value={draftProfile.fatherQualification} onChange={v => updateDraft('fatherQualification', v)} />
            <Field label="Father's Occupation" value={draftProfile.fatherOccupation} onChange={v => updateDraft('fatherOccupation', v)} />
            <Field label="Mother's Name" value={draftProfile.motherName} onChange={v => updateDraft('motherName', v)} />
            <Field label="Annual Family Income" value={draftProfile.annualIncome} onChange={v => updateDraft('annualIncome', v)} />
            <Field label="Board of Study" value={draftProfile.boardOfStudy} onChange={v => updateDraft('boardOfStudy', v)} />
            <Field label="Medium of Study" value={draftProfile.mediumOfStudy} onChange={v => updateDraft('mediumOfStudy', v)} />
            <Field label="School Type" value={draftProfile.schoolType} onChange={v => updateDraft('schoolType', v)} />
            <Field label="Family Background" value={draftProfile.familyBackground} onChange={v => updateDraft('familyBackground', v)} />
            <Field label="Agricultural Land Availability" value={draftProfile.agriculturalLandAvailability} onChange={v => updateDraft('agriculturalLandAvailability', v)} />
            <Field label="Area of Residence" value={draftProfile.areaOfResidence} onChange={v => updateDraft('areaOfResidence', v)} />
          </div>
        ) : (
          <InfoGrid fields={[
            ["Father / Guardian", profileData.guardianName],
            ["Father's Contact", profileData.guardianPhone],
            ["Father's Qualification", profileData.fatherQualification],
            ["Father's Occupation", profileData.fatherOccupation],
            ["Mother's Name", profileData.motherName],
            ["Annual Family Income", profileData.annualIncome],
            ["Board of Study", profileData.boardOfStudy],
            ["Medium of Study", profileData.mediumOfStudy],
            ["School Type", profileData.schoolType],
            ["Family Background", profileData.familyBackground],
            ["Agricultural Land Availability", profileData.agriculturalLandAvailability],
            ["Area of Residence", profileData.areaOfResidence]
          ]} />
        )}
      </Section>

      {isEditing && (
        <button className="portal-primary" onClick={saveProfile}>
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      )}

      <p className="text-xs text-[#06231D]/50 italic">
        Restricted banking, Aadhaar, and identity verification credentials are protected and handled securely via institutional compliance.
      </p>
    </div>
  );

  return (
    <div className={`student-portal min-h-screen ${sidebarHoverOpen ? 'sidebar-open' : ''}${theme === 'dark' ? ' dark-theme' : ''}`}>
      {/* Sidebar Navigation */}
      <aside
        id="student-navigation"
        className={`student-sidebar ${sidebarHoverOpen ? 'open' : ''}`}
        onPointerEnter={openSidebarOnHover}
        onPointerLeave={scheduleSidebarHoverClose}
      >
        {/* Brand Header with Official KIA Logo */}
        <div className="student-sidebar-brand">
          <img src={kiaShield} alt="Kumaraguru Institute of Agriculture" className="student-sidebar-mark" />
          <img src={kiaLogo} alt="Kumaraguru Institute of Agriculture" className="student-sidebar-logo" />
        </div>

        {/* Navigation Items */}
        <nav>
          <p className="student-nav-label">Portal Navigation</p>
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={activeTab === item.id ? 'active' : ''}
                onClick={() => go(item.id)}
                title={item.label}
                aria-current={activeTab === item.id ? 'page' : undefined}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="student-sidebar-footer">
          <div className="mini-avatar">
            {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="student-sidebar-user min-w-0 flex-1">
            <strong>{student.name}</strong>
            <small>{student.id} · {student.rollNo}</small>
          </div>
          <button
            title="Log out"
            className="icon-button student-sidebar-logout"
            onClick={onLogout}
            aria-label="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main View Area */}
      <div className="student-main">
        {/* Sticky Header Top Bar */}
        <header className="student-header">
          <div className="flex items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="portal-kicker">KIA Student Portal</span>
              </div>
              <p>{title}</p>
            </div>
          </div>

          <div className="header-user">
            {/* Campus Tag */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-[#E2FBCE]/50 border border-[#076653]/20 rounded-full text-xs font-semibold text-[#0C342C]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#076653]"></span>
              Sakthi Nagar Campus
            </div>

            {/* Theme Toggle */}
            <button
              className="student-icon-button theme-toggle-button"
              onClick={onToggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              aria-pressed={theme === 'dark'}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* User Badge */}
            <div className="flex items-center gap-2.5 px-3 py-1 bg-white border border-[#0C342C]/10 rounded-full shadow-2xs">
              <div className="mini-avatar">
                {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <div className="text-xs font-bold text-[#0C342C]">{student.name}</div>
                <div className="text-[10px] text-[#076653] font-mono">{student.id}</div>
              </div>
            </div>

            {/* Logout */}
            <button
              title="Log out"
              className="student-icon-button"
              onClick={onLogout}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="student-content">
          {activeTab === 'profile' && renderProfile()}
          {activeTab === 'academics' && renderAcademics()}
        </main>
      </div>
    </div>
  );
};

// Sub-components
const PageIntro = ({
  kicker,
  title,
  copy,
  action
}: {
  kicker: string;
  title: string;
  copy: string;
  action?: React.ReactNode;
}) => (
  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-[#0C342C]/10">
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="w-6 h-px bg-[#076653]/60"></span>
        <p className="portal-kicker">{kicker}</p>
      </div>
      <h1 className="text-3xl sm:text-4xl font-serif text-[#0C342C] font-bold">{title}</h1>
      <p className="text-sm text-[#06231D]/70 mt-2 max-w-2xl leading-relaxed">{copy}</p>
    </div>
    {action}
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="portal-section rounded-2xl border border-[#0C342C]/10 bg-white p-6 sm:p-8 shadow-xs">
    <h2 className="text-lg sm:text-xl font-serif text-[#0C342C] font-bold border-b border-[#0C342C]/10 pb-3 mb-6">
      {title}
    </h2>
    <div>{children}</div>
  </section>
);

const InfoGrid = ({ fields }: { fields: [string, string][] }) => (
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {fields.map(([label, value]) => (
      <Field key={label} label={label} value={value} />
    ))}
  </div>
);
