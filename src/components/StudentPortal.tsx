import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Bell,
  LogOut,
  Menu,
  Pencil,
  Save,
  ShieldCheck,
  UserRound,
  X
} from 'lucide-react';
import { Student, StudentPortalTab, StudentProfile } from '../types';
import kiaLogo from '../assets/kia-logo.png';

interface StudentPortalProps {
  student: Student;
  profile: StudentProfile;
  onLogout: () => void;
}

const navItems: { id: StudentPortalTab; label: string; icon: React.ElementType }[] = [
  { id: 'profile', label: 'My Profile', icon: UserRound },
  { id: 'academics', label: 'My Academics', icon: BarChart3 }
];

const DEFAULT_TAB: StudentPortalTab = 'profile';

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

export const StudentPortal: React.FC<StudentPortalProps> = ({ student, profile, onLogout }) => {
  const [activeTab, setActiveTab] = useState<StudentPortalTab>(() => parseTabFromUrl());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [contact, setContact] = useState({
    phone: student.phone,
    email: student.email,
    address: profile.communicationAddress,
    whatsapp: profile.whatsappNumber || student.phone
  });

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
    setSidebarOpen(false);
    window.history.replaceState(null, '', `#${tab}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
            {isEditing ? 'Cancel Edit' : 'Edit Contact Info'}
          </button>
        }
      />

      {isEditing && (
        <div className="portal-notice">
          <ShieldCheck className="w-5 h-5 text-[#076653] shrink-0 mt-0.5" />
          <span>
            Only contact details can be modified directly. Official academic and admission records are managed by the Dean's Office.
          </span>
        </div>
      )}

      <Section title="Personal Information">
        <InfoGrid fields={[
          ["Student Name", student.name],
          ["Student ID", student.id],
          ["Registration Number", profile.registrationNumber],
          ["Date of Birth", student.dob],
          ["Gender", student.gender],
          ["Blood Group", student.bloodGroup],
          ["Nationality", profile.nationality],
          ["Religion", profile.religion],
          ["Community", profile.community],
          ["Caste", profile.caste],
          ["Mother Tongue", profile.motherTongue],
          ["Residential Status", student.residentialType]
        ]} />
      </Section>

      <Section title="Academic & Institutional Status">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-[#FFFDEE]/60 border border-[#0C342C]/10 rounded-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#076653] block">Status</span>
            <span className="portal-badge green mt-2">Active Student</span>
          </div>
          <div className="p-4 bg-[#FFFDEE]/60 border border-[#0C342C]/10 rounded-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#076653] block">Residential Type</span>
            <span className="portal-badge mt-2 font-semibold text-[#0C342C]">{student.residentialType}</span>
          </div>
          <div className="p-4 bg-[#FFFDEE]/60 border border-[#0C342C]/10 rounded-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#076653] block">Batch Year</span>
            <span className="font-serif text-lg font-bold text-[#0C342C] mt-1 block">{student.batch}</span>
          </div>
          <div className="p-4 bg-[#FFFDEE]/60 border border-[#0C342C]/10 rounded-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#076653] block">Academic Year</span>
            <span className="font-serif text-lg font-bold text-[#0C342C] mt-1 block">{student.academicYear}</span>
          </div>
        </div>
        <InfoGrid fields={[
          ["Admission Type", profile.admissionType],
          ["Admission Quota", profile.admissionQuota],
          ["First Graduate Status", profile.firstGraduate],
          ["Department", student.department]
        ]} />
      </Section>

      <Section title="Contact Information">
        <div className="grid sm:grid-cols-2 gap-5">
          {isEditing ? (
            <>
              <Field
                label="Mobile Number"
                value={contact.phone}
                onChange={v => setContact({ ...contact, phone: v })}
              />
              <Field
                label="WhatsApp Number"
                value={contact.whatsapp}
                onChange={v => setContact({ ...contact, whatsapp: v })}
              />
              <Field
                label="Email Address"
                value={contact.email}
                onChange={v => setContact({ ...contact, email: v })}
              />
              <Field
                label="Address for Communication"
                value={contact.address}
                onChange={v => setContact({ ...contact, address: v })}
                multiline
              />
            </>
          ) : (
            <>
              <Field label="Mobile Number" value={contact.phone} badge="neutral" />
              <Field label="WhatsApp Number" value={contact.whatsapp} badge="neutral" />
              <Field label="Official Email" value={contact.email} badge="neutral" />
              <Field label="Address for Communication" value={contact.address} />
            </>
          )}
        </div>
        {isEditing && (
          <button
            className="portal-primary mt-6"
            onClick={() => setIsEditing(false)}
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        )}
      </Section>

      <Section title="Family & Background Information">
        <InfoGrid fields={[
          ["Father / Guardian", student.guardianName],
          ["Father's Contact", student.guardianPhone],
          ["Father's Qualification", profile.fatherQualification],
          ["Father's Occupation", profile.fatherOccupation],
          ["Mother's Name", profile.motherName],
          ["Annual Family Income", student.annualIncome],
          ["Board of Study", profile.boardOfStudy],
          ["Medium of Study", profile.mediumOfStudy],
          ["School Type", student.schoolType],
          ["Family Background", profile.familyBackground],
          ["Agricultural Land Availability", profile.agriculturalLandAvailability],
          ["Area of Residence", profile.areaOfResidence]
        ]} />
      </Section>

      <p className="text-xs text-[#06231D]/50 italic">
        Restricted banking, Aadhaar, and identity verification credentials are protected and handled securely via institutional compliance.
      </p>
    </div>
  );

  return (
    <div className={`student-portal min-h-screen ${sidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Mobile/Tablet Drawer Backdrop */}
      {sidebarOpen && (
        <button
          className="student-drawer-backdrop"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`student-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Brand Header with Official KIA Logo */}
        <div className="p-4 border-b border-white/10 bg-white flex items-center justify-between">
          <img src={kiaLogo} alt="Kumaraguru Institute of Agriculture" className="h-9 w-auto object-contain" />
          <button
            className="icon-button mobile-close text-slate-600 hover:text-slate-900"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sidebar Context */}
        <div className="student-sidebar-context">
          <span className="text-white/70">Student Workspace</span>
          <span className="px-2 py-0.5 rounded-full bg-[#E2FBCE]/15 text-[#E2FBCE] text-[9px] font-bold border border-[#E2FBCE]/25">
            TNAU AFFILIATED
          </span>
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
          <div className="min-w-0 flex-1">
            <strong>{student.name}</strong>
            <small>{student.id} · {student.rollNo}</small>
          </div>
          <button
            title="Log out"
            className="icon-button"
            onClick={onLogout}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main View Area */}
      <div className="student-main">
        {/* Sticky Header Top Bar */}
        <header className="student-header">
          <div className="flex items-center gap-3">
            <button
              className="icon-button mobile-menu"
              onClick={() => setSidebarOpen(prev => !prev)}
              aria-label="Toggle navigation menu"
              title="Toggle navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
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

            {/* Notification Button */}
            <button className="student-icon-button" title="Notifications">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#076653] ring-2 ring-white"></span>
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
