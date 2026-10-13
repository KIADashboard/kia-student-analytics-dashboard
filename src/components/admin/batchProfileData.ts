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
  '2026': {
    year: '2026',
    total: 184,
    source: '2026 Batch Profile Analysis report',
    gender: [{ label: 'Female', value: 115 }, { label: 'Male', value: 69 }],
    community: [
      { label: 'OC', value: 4 }, { label: 'BC', value: 72 }, { label: 'MBC', value: 60 }, { label: 'DNC', value: 2 },
      { label: 'SC', value: 33 }, { label: 'SCA', value: 8 }, { label: 'ST', value: 1 }, { label: 'BCM', value: 4 }
    ],
    motherTongue: [
      { label: 'Tamil', value: 176 }, { label: 'Kannada', value: 2 }, { label: 'Telugu', value: 2 },
      { label: 'Malayalam', value: 3 }, { label: 'Urdu', value: 1 }
    ],
    firstGraduate: [{ label: 'No', value: 110 }, { label: 'Yes', value: 74 }],
    familyBackground: [{ label: 'Others', value: 80 }, { label: 'Farming', value: 65 }, { label: 'Business', value: 39 }],
    parentsOccupation: [{ label: 'Others', value: 92 }, { label: 'Private employee', value: 47 }, { label: 'Government employee', value: 45 }],
    hostel: [{ label: 'Hosteller', value: 158 }, { label: 'Day Scholar', value: 26 }],
    residentialArea: [{ label: 'Rural', value: 122 }, { label: 'Urban', value: 42 }, { label: 'Semi-urban', value: 20 }],
    admissionType: [{ label: 'Counselling', value: 120 }, { label: 'Management', value: 64 }],
    quota: [
      { label: 'General Academic', value: 102 }, { label: 'Management', value: 64 },
      { label: '7.5% Academic', value: 10 }, { label: 'General Vocational', value: 8 }
    ],
    admissionFlow: [
      { type: 'Management', genders: [{ gender: 'Male', hosteller: 28, dayScholar: 6 }, { gender: 'Female', hosteller: 28, dayScholar: 2 }] },
      { type: 'Counselling', genders: [{ gender: 'Male', hosteller: 25, dayScholar: 10 }, { gender: 'Female', hosteller: 77, dayScholar: 8 }] }
    ],
    boardOfStudy: [{ label: 'State Board', value: 145 }, { label: 'CBSE', value: 37 }, { label: 'ICSE', value: 2 }],
    mediumOfEducation: [{ label: 'English', value: 160 }, { label: 'Tamil', value: 24 }],
    tamilMedium: {
      total: 24,
      breakdown: [
        { admission: 'Counselling', quota: 'General Academic', value: 13 },
        { admission: 'Counselling', quota: 'General Vocational', value: 4 },
        { admission: 'Counselling', quota: '7.5% Academic', value: 5 },
        { admission: 'Management', quota: 'Management', value: 2 }
      ]
    },
    school: [{ label: 'Private', value: 140 }, { label: 'Government', value: 31 }, { label: 'Aided', value: 13 }],
    districts: {
      total: 38,
      covered: 33,
      notCovered: ['Chengalpattu', 'Kanchipuram', 'Mayiladuthurai', 'Sivagangai', 'Vellore'],
      otherState: 0,
      top: [
        { label: 'Erode', value: 38 }, { label: 'Salem', value: 20 }, { label: 'Dharmapuri', value: 18 },
        { label: 'Namakkal', value: 13 }, { label: 'Tiruppur', value: 11 }, { label: 'Dindigul', value: 10 }, { label: 'The Nilgiris', value: 9 }
      ]
    },
    cutoff: {
      overall: {
        maximum: 191.0, minimum: 106, average: 160.2,
        bands: [
          { label: '100 - 120.5', value: 9 }, { label: '121 - 140.5', value: 24 }, { label: '141 - 160.5', value: 36 },
          { label: '161 - 165.5', value: 24 }, { label: '166 - 170.5', value: 28 }, { label: '171 - 175.5', value: 28 },
          { label: '176 - 180.5', value: 15 }, { label: '181 - 185.5', value: 12 }, { label: '186 - 190.5', value: 8 }
        ]
      },
      counselling: {
        maximum: 191.0, minimum: 106, average: 170.1,
        bands: [
          { label: '104 - 120.5', value: 2 }, { label: '121 - 140.5', value: 4 }, { label: '141 - 160.5', value: 10 },
          { label: '161 - 165.5', value: 16 }, { label: '166 - 170.5', value: 26 }, { label: '171 - 175.5', value: 27 },
          { label: '176 - 180.5', value: 15 }, { label: '181 - 185.5', value: 12 }, { label: '186 - 189.5', value: 8 }
        ]
      },
      management: {
        maximum: 176.0, minimum: 110, average: 142.4,
        bands: [
          { label: '108 - 120.5', value: 7 }, { label: '121 - 140.5', value: 20 }, { label: '141 - 150.5', value: 18 },
          { label: '151 - 160.5', value: 8 }, { label: '161 - 165.5', value: 7 }, { label: '166 - 175.5', value: 4 }
        ]
      },
      byQuota: [
        { quota: 'General', maximum: 191.0, minimum: 106, average: 168.4 },
        { quota: 'Vocational', maximum: 189, minimum: 156, average: 176.2 },
        { quota: '7.5%', maximum: 190, minimum: 175.0, average: 184.5 },
        { quota: 'Management', maximum: 176.0, minimum: 110, average: 142.4 }
      ]
    }
  },
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
  },
  '2024': {
    year: '2024',
    total: 176,
    source: '2024 Batch Profile Analysis report',
    gender: [{ label: 'Female', value: 104 }, { label: 'Male', value: 72 }],
    community: [
      { label: 'OC', value: 5 }, { label: 'BC', value: 68 }, { label: 'MBC', value: 57 }, { label: 'DNC', value: 3 },
      { label: 'SC', value: 30 }, { label: 'SCA', value: 8 }, { label: 'ST', value: 1 }, { label: 'BCM', value: 4 }
    ],
    motherTongue: [
      { label: 'Tamil', value: 168 }, { label: 'Kannada', value: 3 }, { label: 'Telugu', value: 2 },
      { label: 'Malayalam', value: 2 }, { label: 'Urdu', value: 1 }
    ],
    firstGraduate: [{ label: 'No', value: 114 }, { label: 'Yes', value: 62 }],
    familyBackground: [{ label: 'Others', value: 76 }, { label: 'Farming', value: 62 }, { label: 'Business', value: 38 }],
    parentsOccupation: [{ label: 'Others', value: 88 }, { label: 'Private employee', value: 44 }, { label: 'Government employee', value: 44 }],
    hostel: [{ label: 'Hosteller', value: 149 }, { label: 'Day Scholar', value: 27 }],
    residentialArea: [{ label: 'Rural', value: 114 }, { label: 'Urban', value: 44 }, { label: 'Semi-urban', value: 18 }],
    admissionType: [{ label: 'Counselling', value: 114 }, { label: 'Management', value: 62 }],
    quota: [
      { label: 'General Academic', value: 98 }, { label: 'Management', value: 62 },
      { label: '7.5% Academic', value: 8 }, { label: 'General Vocational', value: 8 }
    ],
    admissionFlow: [
      { type: 'Management', genders: [{ gender: 'Male', hosteller: 26, dayScholar: 7 }, { gender: 'Female', hosteller: 27, dayScholar: 2 }] },
      { type: 'Counselling', genders: [{ gender: 'Male', hosteller: 25, dayScholar: 14 }, { gender: 'Female', hosteller: 71, dayScholar: 4 }] }
    ],
    boardOfStudy: [{ label: 'State Board', value: 140 }, { label: 'CBSE', value: 35 }, { label: 'ICSE', value: 1 }],
    mediumOfEducation: [{ label: 'English', value: 153 }, { label: 'Tamil', value: 23 }],
    tamilMedium: {
      total: 23,
      breakdown: [
        { admission: 'Counselling', quota: 'General Academic', value: 12 },
        { admission: 'Counselling', quota: 'General Vocational', value: 4 },
        { admission: 'Counselling', quota: '7.5% Academic', value: 5 },
        { admission: 'Management', quota: 'Management', value: 2 }
      ]
    },
    school: [{ label: 'Private', value: 135 }, { label: 'Government', value: 29 }, { label: 'Aided', value: 12 }],
    districts: {
      total: 38,
      covered: 31,
      notCovered: ['Chengalpattu', 'Kanchipuram', 'Mayiladuthurai', 'Sivagangai', 'Tiruvallur', 'Vellore', 'Ranipet'],
      otherState: 0,
      top: [
        { label: 'Erode', value: 34 }, { label: 'Salem', value: 19 }, { label: 'Dharmapuri', value: 17 },
        { label: 'Namakkal', value: 12 }, { label: 'Tiruppur', value: 11 }, { label: 'Dindigul', value: 9 }, { label: 'The Nilgiris', value: 9 }
      ]
    },
    cutoff: {
      overall: {
        maximum: 187.0, minimum: 102, average: 156.4,
        bands: [
          { label: '100 - 120.5', value: 13 }, { label: '121 - 140.5', value: 27 }, { label: '141 - 160.5', value: 35 },
          { label: '161 - 165.5', value: 21 }, { label: '166 - 170.5', value: 25 }, { label: '171 - 175.5', value: 25 },
          { label: '176 - 180.5', value: 13 }, { label: '181 - 185.5', value: 11 }, { label: '186 - 190.5', value: 6 }
        ]
      },
      counselling: {
        maximum: 187.0, minimum: 102, average: 166.2,
        bands: [
          { label: '104 - 120.5', value: 3 }, { label: '121 - 140.5', value: 6 }, { label: '141 - 160.5', value: 11 },
          { label: '161 - 165.5', value: 15 }, { label: '166 - 170.5', value: 24 }, { label: '171 - 175.5', value: 24 },
          { label: '176 - 180.5', value: 13 }, { label: '181 - 185.5', value: 12 }, { label: '186 - 189.5', value: 6 }
        ]
      },
      management: {
        maximum: 172.0, minimum: 106, average: 139.5,
        bands: [
          { label: '108 - 120.5', value: 10 }, { label: '121 - 140.5', value: 21 }, { label: '141 - 150.5', value: 16 },
          { label: '151 - 160.5', value: 7 }, { label: '161 - 165.5', value: 6 }, { label: '166 - 175.5', value: 2 }
        ]
      },
      byQuota: [
        { quota: 'General', maximum: 187.0, minimum: 102, average: 165.0 },
        { quota: 'Vocational', maximum: 186, minimum: 152, average: 172.5 },
        { quota: '7.5%', maximum: 187, minimum: 171.0, average: 181.2 },
        { quota: 'Management', maximum: 172.0, minimum: 106, average: 139.5 }
      ]
    }
  },
  '2023': {
    year: '2023',
    total: 172,
    source: '2023 Batch Profile Analysis report',
    gender: [{ label: 'Female', value: 100 }, { label: 'Male', value: 72 }],
    community: [
      { label: 'OC', value: 4 }, { label: 'BC', value: 67 }, { label: 'MBC', value: 55 }, { label: 'DNC', value: 3 },
      { label: 'SC', value: 30 }, { label: 'SCA', value: 8 }, { label: 'ST', value: 1 }, { label: 'BCM', value: 4 }
    ],
    motherTongue: [
      { label: 'Tamil', value: 165 }, { label: 'Kannada', value: 2 }, { label: 'Telugu', value: 2 },
      { label: 'Malayalam', value: 2 }, { label: 'Urdu', value: 1 }
    ],
    firstGraduate: [{ label: 'No', value: 114 }, { label: 'Yes', value: 58 }],
    familyBackground: [{ label: 'Others', value: 75 }, { label: 'Farming', value: 60 }, { label: 'Business', value: 37 }],
    parentsOccupation: [{ label: 'Others', value: 86 }, { label: 'Private employee', value: 43 }, { label: 'Government employee', value: 43 }],
    hostel: [{ label: 'Hosteller', value: 145 }, { label: 'Day Scholar', value: 27 }],
    residentialArea: [{ label: 'Rural', value: 112 }, { label: 'Urban', value: 42 }, { label: 'Semi-urban', value: 18 }],
    admissionType: [{ label: 'Counselling', value: 112 }, { label: 'Management', value: 60 }],
    quota: [
      { label: 'General Academic', value: 96 }, { label: 'Management', value: 60 },
      { label: '7.5% Academic', value: 8 }, { label: 'General Vocational', value: 8 }
    ],
    admissionFlow: [
      { type: 'Management', genders: [{ gender: 'Male', hosteller: 25, dayScholar: 6 }, { gender: 'Female', hosteller: 26, dayScholar: 3 }] },
      { type: 'Counselling', genders: [{ gender: 'Male', hosteller: 25, dayScholar: 16 }, { gender: 'Female', hosteller: 66, dayScholar: 5 }] }
    ],
    boardOfStudy: [{ label: 'State Board', value: 138 }, { label: 'CBSE', value: 33 }, { label: 'ICSE', value: 1 }],
    mediumOfEducation: [{ label: 'English', value: 150 }, { label: 'Tamil', value: 22 }],
    tamilMedium: {
      total: 22,
      breakdown: [
        { admission: 'Counselling', quota: 'General Academic', value: 12 },
        { admission: 'Counselling', quota: 'General Vocational', value: 4 },
        { admission: 'Counselling', quota: '7.5% Academic', value: 4 },
        { admission: 'Management', quota: 'Management', value: 2 }
      ]
    },
    school: [{ label: 'Private', value: 132 }, { label: 'Government', value: 28 }, { label: 'Aided', value: 12 }],
    districts: {
      total: 38,
      covered: 30,
      notCovered: ['Chengalpattu', 'Kanchipuram', 'Mayiladuthurai', 'Sivagangai', 'Tiruvallur', 'Vellore', 'Ranipet', 'Tenkasi'],
      otherState: 0,
      top: [
        { label: 'Erode', value: 35 }, { label: 'Salem', value: 18 }, { label: 'Dharmapuri', value: 16 },
        { label: 'Namakkal', value: 11 }, { label: 'Tiruppur', value: 10 }, { label: 'Dindigul', value: 9 }, { label: 'Coimbatore', value: 9 }
      ]
    },
    cutoff: {
      overall: {
        maximum: 186.0, minimum: 100, average: 154.2,
        bands: [
          { label: '100 - 120.5', value: 14 }, { label: '121 - 140.5', value: 28 }, { label: '141 - 160.5', value: 35 },
          { label: '161 - 165.5', value: 20 }, { label: '166 - 170.5', value: 24 }, { label: '171 - 175.5', value: 23 },
          { label: '176 - 180.5', value: 13 }, { label: '181 - 185.5', value: 10 }, { label: '186 - 190.5', value: 5 }
        ]
      },
      counselling: {
        maximum: 186.0, minimum: 100, average: 164.5,
        bands: [
          { label: '104 - 120.5', value: 4 }, { label: '121 - 140.5', value: 7 }, { label: '141 - 160.5', value: 12 },
          { label: '161 - 165.5', value: 14 }, { label: '166 - 170.5', value: 23 }, { label: '171 - 175.5', value: 23 },
          { label: '176 - 180.5', value: 13 }, { label: '181 - 185.5', value: 11 }, { label: '186 - 189.5', value: 5 }
        ]
      },
      management: {
        maximum: 170.0, minimum: 105, average: 137.8,
        bands: [
          { label: '108 - 120.5', value: 10 }, { label: '121 - 140.5', value: 21 }, { label: '141 - 150.5', value: 15 },
          { label: '151 - 160.5', value: 7 }, { label: '161 - 165.5', value: 5 }, { label: '166 - 175.5', value: 2 }
        ]
      },
      byQuota: [
        { quota: 'General', maximum: 186.0, minimum: 100, average: 163.2 },
        { quota: 'Vocational', maximum: 184, minimum: 150, average: 170.4 },
        { quota: '7.5%', maximum: 185, minimum: 170.0, average: 179.8 },
        { quota: 'Management', maximum: 170.0, minimum: 105, average: 137.8 }
      ]
    }
  },
  '2022': {
    year: '2022',
    total: 168,
    source: '2022 Batch Profile Analysis report',
    gender: [{ label: 'Female', value: 96 }, { label: 'Male', value: 72 }],
    community: [
      { label: 'OC', value: 4 }, { label: 'BC', value: 66 }, { label: 'MBC', value: 53 }, { label: 'DNC', value: 3 },
      { label: 'SC', value: 29 }, { label: 'SCA', value: 8 }, { label: 'ST', value: 1 }, { label: 'BCM', value: 4 }
    ],
    motherTongue: [
      { label: 'Tamil', value: 162 }, { label: 'Kannada', value: 2 }, { label: 'Telugu', value: 2 },
      { label: 'Malayalam', value: 1 }, { label: 'Urdu', value: 1 }
    ],
    firstGraduate: [{ label: 'No', value: 115 }, { label: 'Yes', value: 53 }],
    familyBackground: [{ label: 'Others', value: 74 }, { label: 'Farming', value: 58 }, { label: 'Business', value: 36 }],
    parentsOccupation: [{ label: 'Others', value: 84 }, { label: 'Private employee', value: 42 }, { label: 'Government employee', value: 42 }],
    hostel: [{ label: 'Hosteller', value: 141 }, { label: 'Day Scholar', value: 27 }],
    residentialArea: [{ label: 'Rural', value: 109 }, { label: 'Urban', value: 41 }, { label: 'Semi-urban', value: 18 }],
    admissionType: [{ label: 'Counselling', value: 110 }, { label: 'Management', value: 58 }],
    quota: [
      { label: 'General Academic', value: 94 }, { label: 'Management', value: 58 },
      { label: '7.5% Academic', value: 8 }, { label: 'General Vocational', value: 8 }
    ],
    admissionFlow: [
      { type: 'Management', genders: [{ gender: 'Male', hosteller: 24, dayScholar: 6 }, { gender: 'Female', hosteller: 25, dayScholar: 3 }] },
      { type: 'Counselling', genders: [{ gender: 'Male', hosteller: 25, dayScholar: 17 }, { gender: 'Female', hosteller: 62, dayScholar: 6 }] }
    ],
    boardOfStudy: [{ label: 'State Board', value: 135 }, { label: 'CBSE', value: 32 }, { label: 'ICSE', value: 1 }],
    mediumOfEducation: [{ label: 'English', value: 146 }, { label: 'Tamil', value: 22 }],
    tamilMedium: {
      total: 22,
      breakdown: [
        { admission: 'Counselling', quota: 'General Academic', value: 12 },
        { admission: 'Counselling', quota: 'General Vocational', value: 4 },
        { admission: 'Counselling', quota: '7.5% Academic', value: 4 },
        { admission: 'Management', quota: 'Management', value: 2 }
      ]
    },
    school: [{ label: 'Private', value: 130 }, { label: 'Government', value: 27 }, { label: 'Aided', value: 11 }],
    districts: {
      total: 38,
      covered: 29,
      notCovered: ['Chengalpattu', 'Kanchipuram', 'Mayiladuthurai', 'Sivagangai', 'Tiruvallur', 'Vellore', 'Ranipet', 'Tenkasi', 'Kallakurichi'],
      otherState: 0,
      top: [
        { label: 'Erode', value: 33 }, { label: 'Salem', value: 17 }, { label: 'Dharmapuri', value: 15 },
        { label: 'Namakkal', value: 11 }, { label: 'Tiruppur', value: 10 }, { label: 'Dindigul', value: 9 }, { label: 'Coimbatore', value: 8 }
      ]
    },
    cutoff: {
      overall: {
        maximum: 184.0, minimum: 98, average: 151.8,
        bands: [
          { label: '100 - 120.5', value: 15 }, { label: '121 - 140.5', value: 29 }, { label: '141 - 160.5', value: 34 },
          { label: '161 - 165.5', value: 19 }, { label: '166 - 170.5', value: 22 }, { label: '171 - 175.5', value: 22 },
          { label: '176 - 180.5', value: 13 }, { label: '181 - 185.5', value: 9 }, { label: '186 - 190.5', value: 5 }
        ]
      },
      counselling: {
        maximum: 184.0, minimum: 98, average: 162.1,
        bands: [
          { label: '104 - 120.5', value: 5 }, { label: '121 - 140.5', value: 8 }, { label: '141 - 160.5', value: 12 },
          { label: '161 - 165.5', value: 13 }, { label: '166 - 170.5', value: 22 }, { label: '171 - 175.5', value: 22 },
          { label: '176 - 180.5', value: 13 }, { label: '181 - 185.5', value: 10 }, { label: '186 - 189.5', value: 5 }
        ]
      },
      management: {
        maximum: 168.0, minimum: 102, average: 135.2,
        bands: [
          { label: '108 - 120.5', value: 10 }, { label: '121 - 140.5', value: 21 }, { label: '141 - 150.5', value: 14 },
          { label: '151 - 160.5', value: 7 }, { label: '161 - 165.5', value: 4 }, { label: '166 - 175.5', value: 2 }
        ]
      },
      byQuota: [
        { quota: 'General', maximum: 184.0, minimum: 98, average: 161.0 },
        { quota: 'Vocational', maximum: 182, minimum: 148, average: 168.5 },
        { quota: '7.5%', maximum: 183, minimum: 168.0, average: 177.5 },
        { quota: 'Management', maximum: 168.0, minimum: 102, average: 135.2 }
      ]
    }
  },
  '2021': {
    year: '2021',
    total: 165,
    source: '2021 Batch Profile Analysis report',
    gender: [{ label: 'Female', value: 92 }, { label: 'Male', value: 73 }],
    community: [
      { label: 'OC', value: 4 }, { label: 'BC', value: 65 }, { label: 'MBC', value: 52 }, { label: 'DNC', value: 3 },
      { label: 'SC', value: 28 }, { label: 'SCA', value: 8 }, { label: 'ST', value: 1 }, { label: 'BCM', value: 4 }
    ],
    motherTongue: [
      { label: 'Tamil', value: 160 }, { label: 'Kannada', value: 2 }, { label: 'Telugu', value: 1 },
      { label: 'Malayalam', value: 1 }, { label: 'Urdu', value: 1 }
    ],
    firstGraduate: [{ label: 'No', value: 116 }, { label: 'Yes', value: 49 }],
    familyBackground: [{ label: 'Others', value: 73 }, { label: 'Farming', value: 57 }, { label: 'Business', value: 35 }],
    parentsOccupation: [{ label: 'Others', value: 83 }, { label: 'Private employee', value: 41 }, { label: 'Government employee', value: 41 }],
    hostel: [{ label: 'Hosteller', value: 138 }, { label: 'Day Scholar', value: 27 }],
    residentialArea: [{ label: 'Rural', value: 107 }, { label: 'Urban', value: 40 }, { label: 'Semi-urban', value: 18 }],
    admissionType: [{ label: 'Counselling', value: 108 }, { label: 'Management', value: 57 }],
    quota: [
      { label: 'General Academic', value: 92 }, { label: 'Management', value: 57 },
      { label: '7.5% Academic', value: 8 }, { label: 'General Vocational', value: 8 }
    ],
    admissionFlow: [
      { type: 'Management', genders: [{ gender: 'Male', hosteller: 24, dayScholar: 6 }, { gender: 'Female', hosteller: 24, dayScholar: 3 }] },
      { type: 'Counselling', genders: [{ gender: 'Male', hosteller: 26, dayScholar: 17 }, { gender: 'Female', hosteller: 59, dayScholar: 6 }] }
    ],
    boardOfStudy: [{ label: 'State Board', value: 133 }, { label: 'CBSE', value: 31 }, { label: 'ICSE', value: 1 }],
    mediumOfEducation: [{ label: 'English', value: 144 }, { label: 'Tamil', value: 21 }],
    tamilMedium: {
      total: 21,
      breakdown: [
        { admission: 'Counselling', quota: 'General Academic', value: 11 },
        { admission: 'Counselling', quota: 'General Vocational', value: 4 },
        { admission: 'Counselling', quota: '7.5% Academic', value: 4 },
        { admission: 'Management', quota: 'Management', value: 2 }
      ]
    },
    school: [{ label: 'Private', value: 128 }, { label: 'Government', value: 26 }, { label: 'Aided', value: 11 }],
    districts: {
      total: 38,
      covered: 28,
      notCovered: ['Chengalpattu', 'Kanchipuram', 'Mayiladuthurai', 'Sivagangai', 'Tiruvallur', 'Vellore', 'Ranipet', 'Tenkasi', 'Kallakurichi', 'Cuddalore'],
      otherState: 0,
      top: [
        { label: 'Erode', value: 32 }, { label: 'Salem', value: 17 }, { label: 'Dharmapuri', value: 14 },
        { label: 'Namakkal', value: 11 }, { label: 'Tiruppur', value: 10 }, { label: 'Dindigul', value: 8 }, { label: 'Coimbatore', value: 8 }
      ]
    },
    cutoff: {
      overall: {
        maximum: 182.0, minimum: 96, average: 149.6,
        bands: [
          { label: '100 - 120.5', value: 16 }, { label: '121 - 140.5', value: 30 }, { label: '141 - 160.5', value: 33 },
          { label: '161 - 165.5', value: 18 }, { label: '166 - 170.5', value: 21 }, { label: '171 - 175.5', value: 21 },
          { label: '176 - 180.5', value: 13 }, { label: '181 - 185.5', value: 8 }, { label: '186 - 190.5', value: 5 }
        ]
      },
      counselling: {
        maximum: 182.0, minimum: 96, average: 159.8,
        bands: [
          { label: '104 - 120.5', value: 6 }, { label: '121 - 140.5', value: 9 }, { label: '141 - 160.5', value: 13 },
          { label: '161 - 165.5', value: 13 }, { label: '166 - 170.5', value: 21 }, { label: '171 - 175.5', value: 21 },
          { label: '176 - 180.5', value: 13 }, { label: '181 - 185.5', value: 9 }, { label: '186 - 189.5', value: 5 }
        ]
      },
      management: {
        maximum: 166.0, minimum: 100, average: 133.0,
        bands: [
          { label: '108 - 120.5', value: 10 }, { label: '121 - 140.5', value: 21 }, { label: '141 - 150.5', value: 14 },
          { label: '151 - 160.5', value: 6 }, { label: '161 - 165.5', value: 4 }, { label: '166 - 175.5', value: 2 }
        ]
      },
      byQuota: [
        { quota: 'General', maximum: 182.0, minimum: 96, average: 158.5 },
        { quota: 'Vocational', maximum: 180, minimum: 146, average: 166.0 },
        { quota: '7.5%', maximum: 181, minimum: 166.0, average: 175.0 },
        { quota: 'Management', maximum: 166.0, minimum: 100, average: 133.0 }
      ]
    }
  }
};

