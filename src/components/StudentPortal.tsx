import React, { useState } from 'react';
import { 
  Award, 
  BarChart3, 
  BookOpen, 
  Check, 
  ChevronRight, 
  FileText, 
  Home, 
  LogOut, 
  Menu, 
  Pencil, 
  Plus, 
  Save, 
  UserRound, 
  X, 
  Bell, 
  Sparkles,
  Calendar,
  Building2,
  ShieldCheck
} from 'lucide-react';
import { Achievement, Student, StudentDocument, StudentPortalTab, StudentProfile, SurveyResponse } from '../types';
import { InstitutionLogo } from './InstitutionLogo';

interface StudentPortalProps { 
  student: Student; 
  profile: StudentProfile; 
  onLogout: () => void; 
}

const initialSurvey: SurveyResponse = { 
  careerGoal: 'Agricultural Research Scientist', 
  careerDomain: 'Technology', 
  higherStudiesInterest: 'Considering', 
  higherStudyArea: 'Sustainable Agronomy & Crop Genetics', 
  preferredIndustry: 'Agricultural Biotechnology', 
  preferredJobRole: 'Agronomist / Research Fellow', 
  entrepreneurshipInterest: 'Maybe', 
  governmentJobInterest: 'No', 
  skills: ['Data analysis', 'Leadership', 'Programming'], 
  shortTermGoal: 'Secure top percentile in ICAR examination and complete thesis project.', 
  longTermGoal: 'Lead sustainable precision farming innovations across South Asia.', 
  workLocation: 'Tamil Nadu', 
  expectedCareerPath: 'Research & Development', 
  additionalComments: 'Interested in faculty mentorship for publishing peer-reviewed field trials.' 
};

const initialAchievements: Achievement[] = [
  { 
    id: 'ACH-01', 
    name: 'Smart India Hackathon', 
    category: 'Technical', 
    level: 'National', 
    type: 'Winner', 
    description: 'Built an accessible campus navigation and crop-monitoring prototype.', 
    date: '2024-11-16' 
  },
  { 
    id: 'ACH-02', 
    name: 'State Agricultural Conclave Paper', 
    category: 'Academic', 
    level: 'State', 
    type: 'First Prize', 
    description: 'Presented research on organic soil nitrogen enrichment strategies.', 
    date: '2025-02-10' 
  }
];

const initialDocuments: StudentDocument[] = [
  { id: 'DOC-01', name: 'Hackathon Certificate.pdf', type: 'Achievement certificate', uploadedAt: '16 Nov 2024', status: 'Verified' },
  { id: 'DOC-02', name: 'Higher Secondary Marksheet.pdf', type: 'Academic credential', uploadedAt: '12 Aug 2024', status: 'Verified' }
];

const navItems: { id: StudentPortalTab; label: string; icon: React.ElementType }[] = [
  { id: 'home', label: 'Home', icon: Home }, 
  { id: 'profile', label: 'My Profile', icon: UserRound }, 
  { id: 'academics', label: 'My Academics', icon: BarChart3 }, 
  { id: 'achievements', label: 'My Achievements', icon: Award }, 
  { id: 'survey', label: 'Aspiration Survey', icon: BookOpen }
];

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
  const [activeTab, setActiveTab] = useState<StudentPortalTab>('home');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [contact, setContact] = useState({ 
    phone: student.phone, 
    email: student.email, 
    address: profile.communicationAddress,
    whatsapp: profile.whatsappNumber || student.phone
  });
  const [survey, setSurvey] = useState<SurveyResponse>(initialSurvey);
  const [surveyStatus, setSurveyStatus] = useState<'Pending' | 'Draft saved' | 'Submitted'>('Pending');
  const [achievements, setAchievements] = useState(initialAchievements);
  const [documents, setDocuments] = useState(initialDocuments);
  const [showAchievementForm, setShowAchievementForm] = useState(false);
  const [newAchievement, setNewAchievement] = useState({ 
    name: '', 
    category: 'Technical', 
    level: 'College', 
    type: 'Participant', 
    description: '', 
    date: '' 
  });

  const go = (tab: StudentPortalTab) => { 
    setActiveTab(tab); 
    setMobileOpen(false); 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const completion = 82;
  const updateSurvey = (key: keyof SurveyResponse, value: string | string[]) => 
    setSurvey(prev => ({ ...prev, [key]: value }));
  const title = navItems.find(item => item.id === activeTab)?.label || 'Home';

  // 1. Home Tab
  const renderHome = () => (
    <div className="space-y-8">
      {/* Hero Welcome Banner aligned with LandingPage HeroSection */}
      <div className="portal-hero rounded-3xl p-8 sm:p-10 shadow-xl shadow-[#0C342C]/10 text-[#FFFDEE] relative overflow-hidden border border-[#E2FBCE]/20 bg-[#0C342C]">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-radial from-[#076653]/50 to-transparent pointer-events-none rounded-full blur-3xl"></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-[#E2FBCE]/70"></span>
              <span className="text-[#E2FBCE] font-bold tracking-[0.25em] text-[10px] uppercase">
                Institutional Academic Portal
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#FFFDEE] leading-tight font-normal">
              Good morning, <span className="italic font-light text-[#E2FBCE]">{student.name.split(' ')[0]}</span>
            </h1>
            <p className="text-sm sm:text-base text-[#FFFDEE]/85 mt-3 leading-relaxed font-light">
              Welcome to your Kumaraguru Institute of Agriculture workspace. Track academic performance, manage verified credentials, and shape your agricultural career roadmap.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E2FBCE]/15 text-[#E2FBCE] border border-[#E2FBCE]/30 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E3EF26]"></span>
                Enrolled · {student.academicYear}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#FFFDEE] border border-white/20 text-xs font-semibold">
                B.Sc. (Hons) Agriculture
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E2FBCE]/15 text-[#E2FBCE] border border-[#E2FBCE]/30 text-xs font-semibold">
                Roll No: {student.rollNo}
              </span>
            </div>
          </div>

          {/* Completion Ring Card */}
          <div className="flex items-center gap-5 bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-2xl shrink-0 shadow-lg">
            <div className="completion-ring">
              <strong>{completion}%</strong>
              <span>Profile</span>
            </div>
            <div className="text-left pr-2">
              <span className="text-[10px] uppercase tracking-widest text-[#E2FBCE] font-bold block">
                Verification Status
              </span>
              <span className="text-sm font-bold text-white block mt-0.5">
                Active Student
              </span>
              <span className="text-xs text-[#FFFDEE]/75 block mt-0.5">
                Batch: {student.batch}
              </span>
              <div className="mt-2.5">
                <button 
                  onClick={() => go('profile')}
                  className="text-[11px] font-bold text-[#E2FBCE] hover:text-white underline underline-offset-4 flex items-center gap-1 transition"
                >
                  Review Details <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary Stat Cards matching Landing Page feature stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Summary 
          label="Profile Completion" 
          value={`${completion}%`} 
          subtext="Institutional record"
          accent="gold"
        />
        <Summary 
          label="Academic Score" 
          value={`${student.marksPercentage}%`} 
          subtext="Aggregate percentage"
          accent="green"
        />
        <Summary 
          label="Achievements" 
          value={String(achievements.length)} 
          subtext="Verified milestones"
          accent="green"
        />
        <Summary 
          label="Survey Status" 
          value={surveyStatus} 
          subtext="Career direction"
          accent={surveyStatus === 'Submitted' ? 'green' : 'amber'}
        />
      </section>

      {/* Profile Completion Callout */}
      <section className="portal-status rounded-2xl border border-[#0C342C]/10 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-5 h-px bg-[#076653]/60"></span>
              <p className="portal-kicker">Profile Verification</p>
            </div>
            <h2 className="text-2xl font-serif text-[#0C342C] font-semibold">
              {completion}% Verified Information
            </h2>
            <p className="text-sm text-[#06231D]/70 mt-1 max-w-xl">
              Complete your student profile to assist the administration with official Anna University / TNAU records and examinations.
            </p>
          </div>
          <button 
            className="portal-primary shrink-0" 
            onClick={() => go('profile')}
          >
            <Pencil className="w-4 h-4" />
            Complete Profile
          </button>
        </div>
        <div className="completion-bar mt-6">
          <span style={{ width: `${completion}%` }} />
        </div>
      </section>

      {/* Aspiration Survey Callout */}
      <section className="portal-status rounded-2xl border border-[#0C342C]/10 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-5 h-px bg-[#076653]/60"></span>
              <p className="portal-kicker">Your Future Matters</p>
            </div>
            <h2 className="text-2xl font-serif text-[#0C342C] font-semibold">
              Share Your Career Aspiration
            </h2>
            <p className="text-sm text-[#06231D]/70 mt-1 max-w-xl">
              Tell us about your career ambitions, agricultural research areas, and higher studies plans so our faculty advisors can guide your journey.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className={`portal-badge ${surveyStatus === 'Submitted' ? 'green' : 'amber'}`}>
              {surveyStatus === 'Submitted' && <Check className="w-3.5 h-3.5" />}
              Survey {surveyStatus}
            </span>
            <button 
              className="portal-primary" 
              onClick={() => go('survey')}
            >
              Take Survey 
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Institutional Notices & Updates */}
      <section className="portal-status rounded-2xl border border-[#0C342C]/10 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-5 h-px bg-[#076653]/60"></span>
          <p className="portal-kicker">Campus Updates</p>
        </div>
        <h2 className="text-xl font-serif text-[#0C342C] font-semibold">
          Recent Institutional Activity
        </h2>
        <div className="mt-5 divide-y divide-[#0C342C]/10">
          <div className="py-3 flex items-start gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#076653] mt-1.5 shrink-0"></span>
            <div>
              <p className="text-sm font-semibold text-[#0C342C]">Student profile verification cycle open</p>
              <p className="text-xs text-[#06231D]/65 mt-0.5">Please review your contact address and phone number for upcoming semester communications.</p>
            </div>
          </div>
          <div className="py-3 flex items-start gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c8953e] mt-1.5 shrink-0"></span>
            <div>
              <p className="text-sm font-semibold text-[#0C342C]">Aspiration Survey 2026–27 is live</p>
              <p className="text-xs text-[#06231D]/65 mt-0.5">Submit your post-graduation intentions to assist the placement, research, and incubation cell.</p>
            </div>
          </div>
          <div className="py-3 flex items-start gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#076653] mt-1.5 shrink-0"></span>
            <div>
              <p className="text-sm font-semibold text-[#0C342C]">Academic performance ledger synchronized</p>
              <p className="text-xs text-[#06231D]/65 mt-0.5">Official board marks and cut-off scores have been confirmed by the Dean of Academics.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  // 2. Academics Tab
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

  // 3. Profile Tab
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

  // 4. Survey Tab
  const renderSurvey = () => (
    <div className="space-y-6">
      <PageIntro 
        kicker="Looking Ahead" 
        title="Aspiration Survey" 
        copy="Help the Kumaraguru Institute of Agriculture understand your career and research interests. You can save your draft and continue anytime." 
        action={
          surveyStatus === 'Submitted' ? (
            <span className="portal-badge green">
              <Check className="w-3.5 h-3.5" />
              Survey Submitted
            </span>
          ) : undefined
        } 
      />

      <Section title="1. Career Direction & Ambition">
        <div className="grid md:grid-cols-2 gap-5">
          <Field 
            label="Primary Career Goal" 
            value={survey.careerGoal} 
            onChange={v => updateSurvey('careerGoal', v)} 
          />
          <SelectField 
            label="Preferred Career Domain" 
            value={survey.careerDomain} 
            options={['Technology', 'Agricultural Research', 'Agribusiness & Finance', 'Public Service', 'Farm Management', 'Design & Planning']} 
            onChange={v => updateSurvey('careerDomain', v)} 
          />
          <RadioField 
            label="Higher Studies Interest" 
            value={survey.higherStudiesInterest} 
            options={['Interested', 'Considering', 'Not now']} 
            onChange={v => updateSurvey('higherStudiesInterest', v)} 
          />
          <Field 
            label="Preferred Higher Study Area" 
            value={survey.higherStudyArea} 
            onChange={v => updateSurvey('higherStudyArea', v)} 
          />
          <Field 
            label="Preferred Industry Sector" 
            value={survey.preferredIndustry} 
            onChange={v => updateSurvey('preferredIndustry', v)} 
          />
          <Field 
            label="Preferred Job Role" 
            value={survey.preferredJobRole} 
            onChange={v => updateSurvey('preferredJobRole', v)} 
          />
        </div>
      </Section>

      <Section title="2. Preferences & Skill Focus">
        <div className="grid md:grid-cols-2 gap-5">
          <RadioField 
            label="Agri-Entrepreneurship Interest" 
            value={survey.entrepreneurshipInterest} 
            options={['Yes', 'Maybe', 'No']} 
            onChange={v => updateSurvey('entrepreneurshipInterest', v)} 
          />
          <RadioField 
            label="Government / ICAR / Civil Services Interest" 
            value={survey.governmentJobInterest} 
            options={['Yes', 'Maybe', 'No']} 
            onChange={v => updateSurvey('governmentJobInterest', v)} 
          />
          <SelectField 
            label="Preferred Work Location" 
            value={survey.workLocation} 
            options={['Tamil Nadu', 'Anywhere in India', 'Outside India', 'Remote / Field-based']} 
            onChange={v => updateSurvey('workLocation', v)} 
          />
          <Field 
            label="Expected Career Path" 
            value={survey.expectedCareerPath} 
            onChange={v => updateSurvey('expectedCareerPath', v)} 
          />
        </div>

        <div className="mt-6 pt-5 border-t border-[#0C342C]/10">
          <span className="portal-label mb-3 block">Skills you want to cultivate at KIA</span>
          <div className="flex flex-wrap gap-2.5">
            {[
              'Precision Agriculture', 
              'Crop Genetics & Breeding', 
              'Data Analysis & Python', 
              'Agritech Prototyping', 
              'Agribusiness Strategy', 
              'Scientific Writing', 
              'Organic Certification'
            ].map(skill => (
              <label 
                key={skill} 
                className={`portal-choice ${survey.skills.includes(skill) ? 'selected' : ''}`}
              >
                <input 
                  type="checkbox" 
                  checked={survey.skills.includes(skill)} 
                  onChange={() => updateSurvey(
                    'skills', 
                    survey.skills.includes(skill) 
                      ? survey.skills.filter(s => s !== skill) 
                      : [...survey.skills, skill]
                  )} 
                />
                {skill}
              </label>
            ))}
          </div>
        </div>
      </Section>

      <Section title="3. Personal Goals & Notes">
        <div className="grid md:grid-cols-2 gap-5">
          <Field 
            label="Short-term Goal (Next 1–2 Years)" 
            value={survey.shortTermGoal} 
            onChange={v => updateSurvey('shortTermGoal', v)} 
            multiline 
          />
          <Field 
            label="Long-term Goal (5+ Years)" 
            value={survey.longTermGoal} 
            onChange={v => updateSurvey('longTermGoal', v)} 
            multiline 
          />
          <div className="md:col-span-2">
            <Field 
              label="Additional Comments or Mentorship Needs" 
              value={survey.additionalComments} 
              onChange={v => updateSurvey('additionalComments', v)} 
              multiline 
            />
          </div>
        </div>
      </Section>

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <button 
          className="portal-secondary" 
          onClick={() => setSurveyStatus('Draft saved')}
        >
          <Save className="w-4 h-4" />
          Save as Draft
        </button>
        <button 
          className="portal-primary" 
          onClick={() => setSurveyStatus('Submitted')}
        >
          <Check className="w-4 h-4" />
          Submit Aspiration Survey
        </button>
      </div>
    </div>
  );

  // 5. Achievements Tab
  const renderAchievements = () => (
    <div className="space-y-6">
      <PageIntro 
        kicker="Your Milestones" 
        title="Achievements" 
        copy="Record and track your competitions, publications, conferences, and student project honors." 
        action={
          <button 
            className="portal-primary" 
            onClick={() => setShowAchievementForm(!showAchievementForm)}
          >
            <Plus className="w-4 h-4" />
            Add Achievement
          </button>
        } 
      />

      {showAchievementForm && (
        <Section title="Record New Achievement">
          <div className="grid md:grid-cols-2 gap-5">
            <Field 
              label="Activity / Competition / Honor Name" 
              value={newAchievement.name} 
              onChange={v => setNewAchievement({ ...newAchievement, name: v })} 
            />
            <SelectField 
              label="Category" 
              value={newAchievement.category} 
              options={['Technical', 'Academic', 'Sports', 'Cultural', 'Leadership', 'Social Innovation']} 
              onChange={v => setNewAchievement({ ...newAchievement, category: v })} 
            />
            <SelectField 
              label="Achievement Level" 
              value={newAchievement.level} 
              options={['College', 'District', 'State', 'National', 'International']} 
              onChange={v => setNewAchievement({ ...newAchievement, level: v })} 
            />
            <Field 
              label="Award / Standing Type (e.g. Winner, Runner-up)" 
              value={newAchievement.type} 
              onChange={v => setNewAchievement({ ...newAchievement, type: v })} 
            />
            <Field 
              label="Description / Scope of Work" 
              value={newAchievement.description} 
              onChange={v => setNewAchievement({ ...newAchievement, description: v })} 
              multiline 
            />
            <Field 
              label="Date / Year" 
              value={newAchievement.date} 
              onChange={v => setNewAchievement({ ...newAchievement, date: v })} 
            />
          </div>
          <button 
            className="portal-primary mt-6" 
            onClick={() => { 
              if (newAchievement.name) { 
                setAchievements([
                  ...achievements, 
                  { ...newAchievement, id: `ACH-${Date.now()}` }
                ]); 
                setNewAchievement({ 
                  name: '', 
                  category: 'Technical', 
                  level: 'College', 
                  type: 'Participant', 
                  description: '', 
                  date: '' 
                }); 
                setShowAchievementForm(false); 
              } 
            }}
          >
            <Save className="w-4 h-4" />
            Save Achievement
          </button>
        </Section>
      )}

      <div className="space-y-4">
        {achievements.map(achievement => (
          <div className="portal-list" key={achievement.id}>
            <div className="portal-icon">
              <Award className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-2.5 items-center">
                <h3>{achievement.name}</h3>
                <span className="portal-badge font-semibold">{achievement.category}</span>
                <span className="portal-badge green font-semibold">
                  {achievement.level} · {achievement.type}
                </span>
              </div>
              <p className="text-sm text-[#06231D]/75 mt-1.5 leading-relaxed">
                {achievement.description}
              </p>
              <p className="text-xs text-[#076653] font-medium mt-3 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {achievement.date || 'Date not provided'}
              </p>
            </div>
            <button 
              title="Delete achievement" 
              className="icon-button" 
              onClick={() => setAchievements(achievements.filter(item => item.id !== achievement.id))}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="student-portal min-h-screen">
      {/* Sidebar Navigation */}
      <aside className={`student-sidebar ${mobileOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div className="p-5 border-b border-[#E2FBCE]/15 bg-[#06231D]/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <InstitutionLogo className="h-10 w-auto" />
            <div className="flex flex-col justify-center">
              <span className="text-[#FFFDEE] font-bold text-xs tracking-wide leading-none uppercase">
                Kumaraguru
              </span>
              <div className="h-[2px] w-full bg-[#c8953e] my-[2px] opacity-80"></div>
              <span className="text-[#E2FBCE] font-medium text-[8px] tracking-[0.2em] leading-none uppercase mb-[1px]">
                Institute of
              </span>
              <span className="text-[#FFFDEE] font-bold text-[10px] tracking-wide leading-none uppercase">
                Agriculture
              </span>
            </div>
          </div>
          <button 
            className="icon-button mobile-close text-[#E2FBCE] hover:text-[#FFFDEE]" 
            onClick={() => setMobileOpen(false)}
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
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-px bg-[#076653]/60 hidden sm:block"></span>
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
            <button className="admin-icon-button" title="Notifications">
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
              className="admin-icon-button" 
              onClick={onLogout}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="student-content">
          {activeTab === 'home' && renderHome()}
          {activeTab === 'profile' && renderProfile()}
          {activeTab === 'academics' && renderAcademics()}
          {activeTab === 'survey' && renderSurvey()}
          {activeTab === 'achievements' && renderAchievements()}
        </main>
      </div>
    </div>
  );
};

// Sub-components
const Summary = ({ 
  label, 
  value, 
  subtext,
  accent = 'green'
}: { 
  label: string; 
  value: string; 
  subtext?: string;
  accent?: 'green' | 'gold' | 'amber';
}) => (
  <div className="summary-item group relative overflow-hidden">
    <span>{label}</span>
    <strong>{value}</strong>
    {subtext && (
      <p className="text-[11px] text-[#06231D]/60 mt-1 font-medium">{subtext}</p>
    )}
    <div className={`absolute bottom-0 left-0 w-0 h-1 transition-all duration-300 group-hover:w-full ${
      accent === 'gold' ? 'bg-[#c8953e]' : accent === 'amber' ? 'bg-amber-500' : 'bg-[#E3EF26]'
    }`} />
  </div>
);

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

const SelectField = ({ 
  label, 
  value, 
  options, 
  onChange 
}: { 
  label: string; 
  value: string; 
  options: string[]; 
  onChange: (value: string) => void;
}) => (
  <label className="block">
    <span className="portal-label mb-2 block">{label}</span>
    <select 
      value={value} 
      onChange={e => onChange(e.target.value)} 
      className="portal-input"
    >
      {options.map(option => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  </label>
);

const RadioField = ({ 
  label, 
  value, 
  options, 
  onChange 
}: { 
  label: string; 
  value: string; 
  options: string[]; 
  onChange: (value: string) => void;
}) => (
  <fieldset>
    <legend className="portal-label mb-2 block">{label}</legend>
    <div className="flex flex-wrap gap-2.5">
      {options.map(option => (
        <label 
          key={option} 
          className={`portal-choice ${value === option ? 'selected' : ''}`}
        >
          <input 
            type="radio" 
            name={label} 
            checked={value === option} 
            onChange={() => onChange(option)} 
          />
          {option}
        </label>
      ))}
    </div>
  </fieldset>
);
