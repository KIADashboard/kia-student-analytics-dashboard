/**
 * Batch profile data taken from "2025 Batch Profile Analysis" (PPT).
 * Add another year to `batchProfiles` (same shape) and it appears in the Batch Profile tab automatically.
 * Aspiration survey slides are intentionally not included.
 */
export interface Slice { label: string; value: number }
export interface CutoffProfile { maximum: number; minimum: number; average: number; bands: Slice[] }
export interface FlowGender { gender: 'Male' | 'Female'; hosteller: number; dayScholar: number }
export interface FlowAdmission { type: string; genders: FlowGender[] }
export interface QuotaCutoff { quota: string; maximum: number; minimum: number; average: number }

export interface BatchProfile {
  year: string;
  total: number;
  source: string;
  gender: Slice[];
  community: Slice[];
  motherTongue: Slice[];
  firstGraduate: Slice[];
  familyBackground: Slice[];
  parentsOccupation: Slice[];
  hostel: Slice[];
  residentialArea: Slice[];
  admissionType: Slice[];
  quota: Slice[];
  admissionFlow: FlowAdmission[];
  boardOfStudy: Slice[];
  mediumOfEducation: Slice[];
  tamilMedium: { total: number; breakdown: { admission: string; quota: string; value: number }[] };
  school: Slice[];
  districts: { total: number; covered: number; notCovered: string[]; otherState: number; top: Slice[] };
  cutoff: { overall: CutoffProfile; counselling: CutoffProfile; management: CutoffProfile; byQuota: QuotaCutoff[] };
}

export const batchProfiles: Record<string, BatchProfile> = {
  '2025': {
    year: '2025',
    total: 180,
    source: '2025 Batch Profile Analysis report',
    gender: [{ label: 'Female', value: 111 }, { label: 'Male', value: 69 }],
    community: [
      { label: 'OC', value: 3 }, { label: 'BC', value: 70 }, { label: 'MBC', value: 59 }, { label: 'DNC', value: 3 },
      { label: 'SC', value: 32 }, { label: 'SCA', value: 8 }, { label: 'ST', value: 1 }, { label: 'BCM', value: 4 }
    ],
    motherTongue: [
      { label: 'Tamil', value: 172 }, { label: 'Kannada', value: 2 }, { label: 'Telugu', value: 2 },
      { label: 'Malayalam', value: 2 }, { label: 'Urdu', value: 2 }
    ],
    firstGraduate: [{ label: 'No', value: 112 }, { label: 'Yes', value: 68 }],
    familyBackground: [{ label: 'Others', value: 78 }, { label: 'Farming', value: 63 }, { label: 'Business', value: 39 }],
    // The PPT chart shows Others 90 / Private 45 / Government 45, while its table lists Private 90. The chart values are used here.
    parentsOccupation: [{ label: 'Others', value: 90 }, { label: 'Private employee', value: 45 }, { label: 'Government employee', value: 45 }],
    hostel: [{ label: 'Hosteller', value: 154 }, { label: 'Day Scholar', value: 26 }],
    residentialArea: [{ label: 'Rural', value: 118 }, { label: 'Urban', value: 43 }, { label: 'Semi-urban', value: 19 }],
    admissionType: [{ label: 'Counselling', value: 116 }, { label: 'Management', value: 64 }],
    quota: [
      { label: 'General Academic', value: 100 }, { label: 'Management', value: 64 },
      { label: '7.5% Academic', value: 8 }, { label: 'General Vocational', value: 8 }
    ],
    admissionFlow: [
      { type: 'Management', genders: [{ gender: 'Male', hosteller: 27, dayScholar: 6 }, { gender: 'Female', hosteller: 29, dayScholar: 2 }] },
      { type: 'Counselling', genders: [{ gender: 'Male', hosteller: 24, dayScholar: 12 }, { gender: 'Female', hosteller: 74, dayScholar: 6 }] }
    ],
    boardOfStudy: [{ label: 'State Board', value: 143 }, { label: 'CBSE', value: 36 }, { label: 'ICSE', value: 1 }],
    mediumOfEducation: [{ label: 'English', value: 157 }, { label: 'Tamil', value: 23 }],
    tamilMedium: {
      total: 23,
      breakdown: [
        { admission: 'Counselling', quota: 'General Academic', value: 12 },
        { admission: 'Counselling', quota: 'General Vocational', value: 4 },
        { admission: 'Counselling', quota: '7.5% Academic', value: 5 },
        { admission: 'Management', quota: 'Management', value: 2 }
      ]
    },
    school: [{ label: 'Private', value: 138 }, { label: 'Government', value: 30 }, { label: 'Aided', value: 12 }],
    districts: {
      total: 38,
      covered: 32,
      notCovered: ['Chengalpattu', 'Kanchipuram', 'Mayiladuthurai', 'Sivagangai', 'Tiruvallur', 'Vellore'],
      otherState: 0,
      top: [
        { label: 'Erode', value: 36 }, { label: 'Salem', value: 19 }, { label: 'Dharmapuri', value: 18 },
        { label: 'Namakkal', value: 12 }, { label: 'Dindigul', value: 10 }, { label: 'The Nilgiris', value: 10 }, { label: 'Tiruppur', value: 10 }
      ]
    },
    cutoff: {
      overall: {
        maximum: 189.5, minimum: 104, average: 158.8,
        bands: [
          { label: '100 - 120.5', value: 11 }, { label: '121 - 140.5', value: 26 }, { label: '141 - 160.5', value: 34 },
          { label: '161 - 165.5', value: 22 }, { label: '166 - 170.5', value: 26 }, { label: '171 - 175.5', value: 27 },
          { label: '176 - 180.5', value: 14 }, { label: '181 - 185.5', value: 13 }, { label: '186 - 190.5', value: 7 }
        ]
      },
      counselling: {
        maximum: 189.5, minimum: 104, average: 168.6,
        bands: [
          { label: '104 - 120.5', value: 2 }, { label: '121 - 140.5', value: 5 }, { label: '141 - 160.5', value: 10 },
          { label: '161 - 165.5', value: 15 }, { label: '166 - 170.5', value: 24 }, { label: '171 - 175.5', value: 26 },
          { label: '176 - 180.5', value: 14 }, { label: '181 - 185.5', value: 13 }, { label: '186 - 189.5', value: 7 }
        ]
      },
      management: {
        maximum: 174.5, minimum: 108, average: 141.1,
        bands: [
          { label: '108 - 120.5', value: 9 }, { label: '121 - 140.5', value: 21 }, { label: '141 - 150.5', value: 16 },
          { label: '151 - 160.5', value: 8 }, { label: '161 - 165.5', value: 7 }, { label: '166 - 175.5', value: 3 }
        ]
      },
      byQuota: [
        { quota: 'General', maximum: 189.5, minimum: 104, average: 167 },
        { quota: 'Vocational', maximum: 188, minimum: 154, average: 174.8 },
        { quota: '7.5%', maximum: 189, minimum: 173.5, average: 183.1 },
        { quota: 'Management', maximum: 174.5, minimum: 108, average: 141.1 }
      ]
    }
  }
};