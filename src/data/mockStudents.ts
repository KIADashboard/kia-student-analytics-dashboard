import { Student, IncomeCategory, AgricultureBackground, SchoolType, QuotaType, Category, Gender } from '../types';

const INITIAL_DETAILED_STUDENTS: Student[] = [
  // --- 2021 BATCH ---
  {
    id: "21BCS042",
    rollNo: "7178211CS142",
    name: "Ananya Sundaram",
    email: "ananya.s.21cs@kct.ac.in",
    phone: "+91 98421 88210",
    gender: "Female",
    academicYear: 2021,
    batch: "2021–2025",
    admissionDate: "2021-08-18",
    currentSemester: 8,
    degree: "B.E. Computer Science & Engineering",
    department: "Computer Science & Engineering",
    departmentCode: "CSE",
    district: "Coimbatore",
    state: "Tamil Nadu",
    category: "OBC/BC",
    quota: "Merit (Govt Quota)",
    schoolType: "Private Matric",
    annualIncome: "₹4,50,000",
    incomeCategory: "₹3L – ₹6L",
    agricultureBackground: "No",
    hscMarks: 96.5,
    cutoffScore: 197.0,
    cgpa: 9.12,
    marksPercentage: 91.2,
    attendance: 96.4,
    status: "Active - Regular",
    dob: "2003-05-14",
    bloodGroup: "O+",
    residentialType: "Day Scholar",
    guardianName: "Sundaram Ramanathan",
    guardianPhone: "+91 94432 11092",
    guardianRelation: "Father",
    firstGenerationGraduate: false,
    scholarship: "Institutional Academic Merit Scholarship (₹40,000/yr)",
    backlogs: 0,
    creditsEarned: 168,
    totalCredits: 172,
    mentorName: "Dr. K. Senthil Kumar (Prof. CSE)",
    semesterGrades: [
      { semester: "Sem 1", gpa: 9.05, credits: 22, status: "Cleared with Distinction" },
      { semester: "Sem 2", gpa: 9.20, credits: 24, status: "Cleared with Distinction" },
      { semester: "Sem 3", gpa: 8.95, credits: 24, status: "Cleared with Distinction" },
      { semester: "Sem 4", gpa: 9.15, credits: 23, status: "Cleared with Distinction" },
      { semester: "Sem 5", gpa: 9.30, credits: 25, status: "Cleared with Distinction" },
      { semester: "Sem 6", gpa: 9.10, credits: 26, status: "Cleared with Distinction" },
      { semester: "Sem 7", gpa: 9.08, credits: 24, status: "Cleared with Distinction" }
    ],
    recentSubjects: [
      { code: "21CS701", name: "Cloud Computing & DevOps", credits: 4, grade: "O", gradePoint: 10 },
      { code: "21CS702", name: "Deep Learning Architectures", credits: 4, grade: "O", gradePoint: 10 },
      { code: "21CS703", name: "Information & Network Security", credits: 3, grade: "A+", gradePoint: 9 },
      { code: "21CS704", name: "Distributed Systems Lab", credits: 2, grade: "O", gradePoint: 10 },
      { code: "21CS705", name: "Capstone Phase-I Project", credits: 4, grade: "O", gradePoint: 10 }
    ],
    activities: ["President - Association of Computing Engineers", "Google Developer Student Club Core Lead", "Smart India Hackathon 2023 Finalist"],
    skills: ["Distributed Systems", "Kubernetes", "PyTorch", "TypeScript", "Microservices"],
    placementReadiness: 98
  },
  {
    id: "21BIT018",
    rollNo: "7178211IT118",
    name: "Dhanush Parthiban",
    email: "dhanush.p.21it@kct.ac.in",
    phone: "+91 97910 88231",
    gender: "Male",
    academicYear: 2021,
    batch: "2021–2025",
    admissionDate: "2021-08-20",
    currentSemester: 8,
    degree: "B.Tech. Information Technology",
    department: "Information Technology",
    departmentCode: "IT",
    district: "Erode",
    state: "Tamil Nadu",
    category: "OBC/BC",
    quota: "First Graduate Quota",
    schoolType: "Government",
    annualIncome: "₹1,80,000",
    incomeCategory: "₹1L – ₹3L",
    agricultureBackground: "Yes",
    hscMarks: 91.0,
    cutoffScore: 189.5,
    cgpa: 8.42,
    marksPercentage: 84.2,
    attendance: 94.0,
    status: "Active - Regular",
    dob: "2003-09-12",
    bloodGroup: "A+",
    residentialType: "Hosteler (Block A)",
    guardianName: "Parthiban K",
    guardianPhone: "+91 98422 99011",
    guardianRelation: "Father",
    firstGenerationGraduate: true,
    scholarship: "TN Govt First Graduate Tuition Fee Waiver (₹25,000/yr)",
    backlogs: 0,
    creditsEarned: 166,
    totalCredits: 172,
    mentorName: "Dr. M. Shanmugam (Prof. IT)",
    semesterGrades: [
      { semester: "Sem 1", gpa: 8.20, credits: 22, status: "Cleared with Distinction" },
      { semester: "Sem 2", gpa: 8.50, credits: 24, status: "Cleared with Distinction" },
      { semester: "Sem 3", gpa: 8.35, credits: 24, status: "Cleared with Distinction" },
      { semester: "Sem 4", gpa: 8.60, credits: 23, status: "Cleared with Distinction" },
      { semester: "Sem 5", gpa: 8.45, credits: 25, status: "Cleared with Distinction" },
      { semester: "Sem 6", gpa: 8.50, credits: 26, status: "Cleared with Distinction" },
      { semester: "Sem 7", gpa: 8.35, credits: 24, status: "Cleared with Distinction" }
    ],
    recentSubjects: [
      { code: "21IT701", name: "Full Stack Web Development", credits: 4, grade: "A+", gradePoint: 9 },
      { code: "21IT702", name: "Big Data Technologies", credits: 4, grade: "A", gradePoint: 8 },
      { code: "21IT703", name: "Cyber Forensics", credits: 3, grade: "A+", gradePoint: 9 }
    ],
    activities: ["Hackathon Coordinator", "NSS Volunteer Lead"],
    skills: ["React", "Node.js", "MongoDB", "Tailwind CSS", "Docker"],
    placementReadiness: 92
  },
  {
    id: "21BME055",
    rollNo: "7178211ME155",
    name: "Gowtham Ravichandran",
    email: "gowtham.r.21me@kct.ac.in",
    phone: "+91 94432 44102",
    gender: "Male",
    academicYear: 2021,
    batch: "2021–2025",
    admissionDate: "2021-08-25",
    currentSemester: 8,
    degree: "B.E. Mechanical Engineering",
    department: "Mechanical Engineering",
    departmentCode: "MECH",
    district: "Salem",
    state: "Tamil Nadu",
    category: "MBC",
    quota: "Merit (Govt Quota)",
    schoolType: "Govt-Aided",
    annualIncome: "₹2,20,000",
    incomeCategory: "₹1L – ₹3L",
    agricultureBackground: "Yes",
    hscMarks: 88.5,
    cutoffScore: 184.0,
    cgpa: 7.95,
    marksPercentage: 79.5,
    attendance: 91.2,
    status: "Active - Regular",
    dob: "2003-02-18",
    bloodGroup: "B+",
    residentialType: "Hosteler (Block B)",
    guardianName: "Ravichandran M",
    guardianPhone: "+91 94431 88019",
    guardianRelation: "Father",
    firstGenerationGraduate: false,
    scholarship: "None",
    backlogs: 0,
    creditsEarned: 165,
    totalCredits: 172,
    mentorName: "Dr. K. Arulmozhi (Assoc. Prof. Mech)",
    semesterGrades: [
      { semester: "Sem 1", gpa: 7.80, credits: 22, status: "Passed" },
      { semester: "Sem 2", gpa: 8.10, credits: 24, status: "Cleared with Distinction" },
      { semester: "Sem 3", gpa: 7.90, credits: 24, status: "Passed" },
      { semester: "Sem 4", gpa: 8.00, credits: 23, status: "Passed" }
    ],
    recentSubjects: [
      { code: "21ME701", name: "Automotive Dynamics & EV Tech", credits: 4, grade: "A", gradePoint: 8 },
      { code: "21ME702", name: "Robotics & Automation", credits: 4, grade: "A+", gradePoint: 9 }
    ],
    activities: ["SAE BAJA Racing Team Lead", "Design Thinking Workshop Speaker"],
    skills: ["SolidWorks", "ANSYS", "MATLAB", "CNC Programming"],
    placementReadiness: 88
  },
  {
    id: "21BCE012",
    rollNo: "7178211CE112",
    name: "Pavithra Murugesan",
    email: "pavithra.m.21ce@kct.ac.in",
    phone: "+91 96551 22901",
    gender: "Female",
    academicYear: 2021,
    batch: "2021–2025",
    admissionDate: "2021-08-22",
    currentSemester: 8,
    degree: "B.E. Civil Engineering",
    department: "Civil Engineering",
    departmentCode: "CIVIL",
    district: "Pudukkottai",
    state: "Tamil Nadu",
    category: "SC/ST",
    quota: "7.5% Govt School Quota",
    schoolType: "Government",
    annualIncome: "₹85,000",
    incomeCategory: "< ₹1 Lakh",
    agricultureBackground: "Yes",
    hscMarks: 89.2,
    cutoffScore: 186.0,
    cgpa: 8.10,
    marksPercentage: 81.0,
    attendance: 95.8,
    status: "Active - Regular",
    dob: "2003-11-25",
    bloodGroup: "O+",
    residentialType: "Hosteler (Block C)",
    guardianName: "Murugesan S",
    guardianPhone: "+91 97881 44521",
    guardianRelation: "Father",
    firstGenerationGraduate: true,
    scholarship: "TN SC/ST Full Higher Education Scheme",
    backlogs: 0,
    creditsEarned: 168,
    totalCredits: 172,
    mentorName: "Dr. S. Rajasekaran (Prof. Civil)",
    semesterGrades: [
      { semester: "Sem 1", gpa: 8.00, credits: 22, status: "Passed" },
      { semester: "Sem 2", gpa: 8.20, credits: 24, status: "Cleared with Distinction" }
    ],
    recentSubjects: [
      { code: "21CE701", name: "Structural Dynamics & Seismic Design", credits: 4, grade: "A+", gradePoint: 9 },
      { code: "21CE702", name: "GIS & Remote Sensing Applications", credits: 3, grade: "O", gradePoint: 10 }
    ],
    activities: ["Green Campus Initiative Secretary", "Youth Red Cross Coordinator"],
    skills: ["AutoCAD", "STAAD.Pro", "GIS Mapping", "Revit"],
    placementReadiness: 86
  },

  // --- 2022 BATCH ---
  {
    id: "22BEC015",
    rollNo: "7178221EC115",
    name: "Karthik Vijayakumar",
    email: "karthik.v.22ec@kct.ac.in",
    phone: "+91 97890 23114",
    gender: "Male",
    academicYear: 2022,
    batch: "2022–2026",
    admissionDate: "2022-08-14",
    currentSemester: 6,
    degree: "B.E. Electronics & Communication",
    department: "Electronics & Communication",
    departmentCode: "ECE",
    district: "Chennai",
    state: "Tamil Nadu",
    category: "General",
    quota: "Merit (Govt Quota)",
    schoolType: "CBSE/ICSE",
    annualIncome: "₹8,50,000",
    incomeCategory: "₹6L – ₹10L",
    agricultureBackground: "No",
    hscMarks: 94.8,
    cutoffScore: 194.5,
    cgpa: 8.65,
    marksPercentage: 86.5,
    attendance: 92.8,
    status: "Active - Regular",
    dob: "2004-08-22",
    bloodGroup: "B+",
    residentialType: "Hosteler (Block B)",
    guardianName: "Vijayakumar Narayanan",
    guardianPhone: "+91 98401 55621",
    guardianRelation: "Father",
    firstGenerationGraduate: false,
    scholarship: "None",
    backlogs: 0,
    creditsEarned: 130,
    totalCredits: 170,
    mentorName: "Dr. P. Manimegalai (Assoc. Prof. ECE)",
    semesterGrades: [
      { semester: "Sem 1", gpa: 8.40, credits: 22, status: "Cleared with Distinction" },
      { semester: "Sem 2", gpa: 8.70, credits: 24, status: "Cleared with Distinction" },
      { semester: "Sem 3", gpa: 8.55, credits: 23, status: "Cleared with Distinction" },
      { semester: "Sem 4", gpa: 8.80, credits: 25, status: "Cleared with Distinction" },
      { semester: "Sem 5", gpa: 8.75, credits: 24, status: "Cleared with Distinction" }
    ],
    recentSubjects: [
      { code: "22EC501", name: "VLSI Design & SystemVerilog", credits: 4, grade: "A+", gradePoint: 9 },
      { code: "22EC502", name: "Digital Signal Processors", credits: 4, grade: "A", gradePoint: 8 },
      { code: "22EC503", name: "Antennas & Microwave Propagation", credits: 3, grade: "A+", gradePoint: 9 },
      { code: "22EC504", name: "Embedded Systems Microcontroller Lab", credits: 2, grade: "O", gradePoint: 10 }
    ],
    activities: ["Robotics Club - Hardware Lead", "IEEE Student Branch Secretary", "Texas Instruments Innovation Challenge Participant"],
    skills: ["Embedded C", "SystemVerilog", "FPGA Programming", "Altium Designer", "MATLAB"],
    placementReadiness: 90
  },
  {
    id: "22BCS089",
    rollNo: "7178221CS189",
    name: "Sneha Ramakrishnan",
    email: "sneha.r.22cs@kct.ac.in",
    phone: "+91 94441 55670",
    gender: "Female",
    academicYear: 2022,
    batch: "2022–2026",
    admissionDate: "2022-08-16",
    currentSemester: 6,
    degree: "B.E. Computer Science & Engineering",
    department: "Computer Science & Engineering",
    departmentCode: "CSE",
    district: "Coimbatore",
    state: "Tamil Nadu",
    category: "OBC/BC",
    quota: "Management Quota",
    schoolType: "Private Matric",
    annualIncome: "₹12,00,000",
    incomeCategory: "> ₹10 Lakh",
    agricultureBackground: "No",
    hscMarks: 95.0,
    cutoffScore: 195.0,
    cgpa: 9.35,
    marksPercentage: 93.5,
    attendance: 97.2,
    status: "Active - Regular",
    dob: "2004-04-19",
    bloodGroup: "A+",
    residentialType: "Day Scholar",
    guardianName: "Ramakrishnan V",
    guardianPhone: "+91 98421 77651",
    guardianRelation: "Father",
    firstGenerationGraduate: false,
    scholarship: "None",
    backlogs: 0,
    creditsEarned: 132,
    totalCredits: 172,
    mentorName: "Dr. K. Senthil Kumar (Prof. CSE)",
    semesterGrades: [
      { semester: "Sem 1", gpa: 9.20, credits: 22, status: "Cleared with Distinction" },
      { semester: "Sem 2", gpa: 9.45, credits: 24, status: "Cleared with Distinction" },
      { semester: "Sem 3", gpa: 9.30, credits: 24, status: "Cleared with Distinction" }
    ],
    recentSubjects: [
      { code: "22CS501", name: "Design & Analysis of Algorithms", credits: 4, grade: "O", gradePoint: 10 },
      { code: "22CS502", name: "Database Management Systems", credits: 4, grade: "O", gradePoint: 10 }
    ],
    activities: ["Women in Tech Lead", "ACM Chapter Vice-Chair"],
    skills: ["Java", "C++", "Algorithms", "PostgreSQL", "AWS"],
    placementReadiness: 96
  },
  {
    id: "22BME034",
    rollNo: "7178221ME134",
    name: "Kishore Kumar S",
    email: "kishore.k.22me@kct.ac.in",
    phone: "+91 98409 33219",
    gender: "Male",
    academicYear: 2022,
    batch: "2022–2026",
    admissionDate: "2022-08-20",
    currentSemester: 6,
    degree: "B.E. Mechanical Engineering",
    department: "Mechanical Engineering",
    departmentCode: "MECH",
    district: "Tirunelveli",
    state: "Tamil Nadu",
    category: "OBC/BC",
    quota: "Sports Quota",
    schoolType: "Govt-Aided",
    annualIncome: "₹2,80,000",
    incomeCategory: "₹1L – ₹3L",
    agricultureBackground: "Yes",
    hscMarks: 86.4,
    cutoffScore: 182.0,
    cgpa: 7.60,
    marksPercentage: 76.0,
    attendance: 89.5,
    status: "Active - Regular",
    dob: "2004-06-11",
    bloodGroup: "AB+",
    residentialType: "Hosteler (Block A)",
    guardianName: "Subramanian A",
    guardianPhone: "+91 94433 12908",
    guardianRelation: "Father",
    firstGenerationGraduate: false,
    scholarship: "State Sports Excellence Award & Hostel Waiver",
    backlogs: 0,
    creditsEarned: 126,
    totalCredits: 172,
    mentorName: "Dr. K. Arulmozhi (Assoc. Prof. Mech)",
    semesterGrades: [
      { semester: "Sem 1", gpa: 7.50, credits: 22, status: "Passed" },
      { semester: "Sem 2", gpa: 7.70, credits: 24, status: "Passed" }
    ],
    recentSubjects: [
      { code: "22ME501", name: "Thermal Engineering & Heat Transfer", credits: 4, grade: "B+", gradePoint: 7 },
      { code: "22ME502", name: "Manufacturing Technology", credits: 4, grade: "A", gradePoint: 8 }
    ],
    activities: ["University Athletics Team Captain (400m Gold Medal)", "Sports Secretary"],
    skills: ["Athletics", "AutoCAD", "Lean Manufacturing"],
    placementReadiness: 84
  },
  {
    id: "22BAD022",
    rollNo: "7178221AD122",
    name: "Harini Balachandran",
    email: "harini.b.22ad@kct.ac.in",
    phone: "+91 97891 44520",
    gender: "Female",
    academicYear: 2022,
    batch: "2022–2026",
    admissionDate: "2022-08-18",
    currentSemester: 6,
    degree: "B.Tech. Artificial Intelligence & Data Science",
    department: "Artificial Intelligence & Data Science",
    departmentCode: "AI-DS",
    district: "Madurai",
    state: "Tamil Nadu",
    category: "General",
    quota: "Merit (Govt Quota)",
    schoolType: "CBSE/ICSE",
    annualIncome: "₹5,20,000",
    incomeCategory: "₹3L – ₹6L",
    agricultureBackground: "No",
    hscMarks: 93.5,
    cutoffScore: 193.0,
    cgpa: 8.85,
    marksPercentage: 88.5,
    attendance: 94.5,
    status: "Active - Regular",
    dob: "2004-10-05",
    bloodGroup: "O-",
    residentialType: "Hosteler (Block C)",
    guardianName: "Balachandran S",
    guardianPhone: "+91 94420 11984",
    guardianRelation: "Father",
    firstGenerationGraduate: false,
    scholarship: "None",
    backlogs: 0,
    creditsEarned: 130,
    totalCredits: 168,
    mentorName: "Dr. R. Kavitha (Head, AI & DS)",
    semesterGrades: [
      { semester: "Sem 1", gpa: 8.70, credits: 22, status: "Cleared with Distinction" },
      { semester: "Sem 2", gpa: 8.95, credits: 24, status: "Cleared with Distinction" }
    ],
    recentSubjects: [
      { code: "22AD501", name: "Machine Learning Algorithms", credits: 4, grade: "O", gradePoint: 10 },
      { code: "22AD502", name: "Data Warehousing & Mining", credits: 4, grade: "A+", gradePoint: 9 }
    ],
    activities: ["Data Science Club Editor", "Kaggle Bronze Medalist"],
    skills: ["Python", "TensorFlow", "Pandas", "Scikit-Learn", "SQL"],
    placementReadiness: 94
  },

  // --- 2023 BATCH ---
  {
    id: "23BAD008",
    rollNo: "7178231AD108",
    name: "Meenakshi Soundararajan",
    email: "meenakshi.s.23ad@kct.ac.in",
    phone: "+91 94421 77150",
    gender: "Female",
    academicYear: 2023,
    batch: "2023–2027",
    admissionDate: "2023-08-10",
    currentSemester: 4,
    degree: "B.Tech. Artificial Intelligence & Data Science",
    department: "Artificial Intelligence & Data Science",
    departmentCode: "AI-DS",
    district: "Madurai",
    state: "Tamil Nadu",
    category: "MBC",
    quota: "First Graduate Quota",
    schoolType: "Government",
    annualIncome: "₹1,40,000",
    incomeCategory: "₹1L – ₹3L",
    agricultureBackground: "Yes",
    hscMarks: 93.0,
    cutoffScore: 191.0,
    cgpa: 8.90,
    marksPercentage: 89.0,
    attendance: 95.0,
    status: "Active - Regular",
    dob: "2005-03-10",
    bloodGroup: "A+",
    residentialType: "Hosteler (Block C)",
    guardianName: "Soundararajan M",
    guardianPhone: "+91 97902 44109",
    guardianRelation: "Father",
    firstGenerationGraduate: true,
    scholarship: "TN Govt First Graduate Tuition Fee Waiver (₹25,000/yr)",
    backlogs: 0,
    creditsEarned: 88,
    totalCredits: 168,
    mentorName: "Dr. R. Kavitha (Head, AI & DS)",
    semesterGrades: [
      { semester: "Sem 1", gpa: 8.80, credits: 22, status: "Cleared with Distinction" },
      { semester: "Sem 2", gpa: 9.05, credits: 24, status: "Cleared with Distinction" },
      { semester: "Sem 3", gpa: 8.85, credits: 24, status: "Cleared with Distinction" }
    ],
    recentSubjects: [
      { code: "23AD301", name: "Data Structures & Modern C++", credits: 4, grade: "O", gradePoint: 10 },
      { code: "23AD302", name: "Probability & Inferential Statistics", credits: 4, grade: "A+", gradePoint: 9 },
      { code: "23AD303", name: "Object Oriented Design in Java", credits: 3, grade: "O", gradePoint: 10 }
    ],
    activities: ["Secretary - AI & DS Student Association", "Tamil Literary Society Member", "SIH 2024 College Qualifier"],
    skills: ["Python", "TensorFlow", "SQL", "Data Structures", "OpenCV"],
    placementReadiness: 94
  },
  {
    id: "23BCS054",
    rollNo: "7178231CS154",
    name: "Siddharth Nambiar",
    email: "siddharth.n.23cs@kct.ac.in",
    phone: "+91 98402 11980",
    gender: "Male",
    academicYear: 2023,
    batch: "2023–2027",
    admissionDate: "2023-08-12",
    currentSemester: 4,
    degree: "B.E. Computer Science & Engineering",
    department: "Computer Science & Engineering",
    departmentCode: "CSE",
    district: "Coimbatore",
    state: "Tamil Nadu",
    category: "General",
    quota: "Merit (Govt Quota)",
    schoolType: "Private Matric",
    annualIncome: "₹6,80,000",
    incomeCategory: "₹6L – ₹10L",
    agricultureBackground: "No",
    hscMarks: 97.2,
    cutoffScore: 198.0,
    cgpa: 9.45,
    marksPercentage: 94.5,
    attendance: 98.0,
    status: "Active - Regular",
    dob: "2005-01-20",
    bloodGroup: "B+",
    residentialType: "Day Scholar",
    guardianName: "Nambiar K",
    guardianPhone: "+91 94431 88029",
    guardianRelation: "Father",
    firstGenerationGraduate: false,
    scholarship: "Institutional Academic Merit Scholarship (₹40,000/yr)",
    backlogs: 0,
    creditsEarned: 90,
    totalCredits: 172,
    mentorName: "Dr. K. Senthil Kumar (Prof. CSE)",
    semesterGrades: [
      { semester: "Sem 1", gpa: 9.40, credits: 22, status: "Cleared with Distinction" },
      { semester: "Sem 2", gpa: 9.50, credits: 24, status: "Cleared with Distinction" }
    ],
    recentSubjects: [
      { code: "23CS301", name: "Operating Systems Principles", credits: 4, grade: "O", gradePoint: 10 },
      { code: "23CS302", name: "Computer Networks & Protocols", credits: 4, grade: "O", gradePoint: 10 }
    ],
    activities: ["Competitive Coding Lead", "CodeChef 5-Star Ranker"],
    skills: ["C++", "Go", "Distributed Systems", "Linux Kernel"],
    placementReadiness: 97
  },
  {
    id: "23BIT041",
    rollNo: "7178231IT141",
    name: "Kavya Senthilnathan",
    email: "kavya.s.23it@kct.ac.in",
    phone: "+91 94440 98211",
    gender: "Female",
    academicYear: 2023,
    batch: "2023–2027",
    admissionDate: "2023-08-15",
    currentSemester: 4,
    degree: "B.Tech. Information Technology",
    department: "Information Technology",
    departmentCode: "IT",
    district: "Tiruchirappalli",
    state: "Tamil Nadu",
    category: "OBC/BC",
    quota: "7.5% Govt School Quota",
    schoolType: "Government",
    annualIncome: "₹95,000",
    incomeCategory: "< ₹1 Lakh",
    agricultureBackground: "Yes",
    hscMarks: 92.4,
    cutoffScore: 190.5,
    cgpa: 8.75,
    marksPercentage: 87.5,
    attendance: 96.0,
    status: "Active - Regular",
    dob: "2005-07-14",
    bloodGroup: "O+",
    residentialType: "Hosteler (Block C)",
    guardianName: "Senthilnathan P",
    guardianPhone: "+91 97891 33201",
    guardianRelation: "Father",
    firstGenerationGraduate: true,
    scholarship: "TN Govt 7.5% Quota Full Tuition & Hostel Scholarship",
    backlogs: 0,
    creditsEarned: 88,
    totalCredits: 172,
    mentorName: "Dr. M. Shanmugam (Prof. IT)",
    semesterGrades: [
      { semester: "Sem 1", gpa: 8.60, credits: 22, status: "Cleared with Distinction" },
      { semester: "Sem 2", gpa: 8.90, credits: 24, status: "Cleared with Distinction" }
    ],
    recentSubjects: [
      { code: "23IT301", name: "Web Application Frameworks", credits: 4, grade: "A+", gradePoint: 9 },
      { code: "23IT302", name: "Data Structures & Algorithms", credits: 4, grade: "O", gradePoint: 10 }
    ],
    activities: ["Developer Circles Community Member", "Debate Society Lead"],
    skills: ["React", "TypeScript", "Node.js", "MySQL"],
    placementReadiness: 91
  },
  {
    id: "23BEC072",
    rollNo: "7178231EC172",
    name: "Pranav Venkatesan",
    email: "pranav.v.23ec@kct.ac.in",
    phone: "+91 98401 22910",
    gender: "Male",
    academicYear: 2023,
    batch: "2023–2027",
    admissionDate: "2023-08-22",
    currentSemester: 4,
    degree: "B.E. Electronics & Communication",
    department: "Electronics & Communication",
    departmentCode: "ECE",
    district: "Vellore",
    state: "Tamil Nadu",
    category: "General",
    quota: "Lateral Entry",
    schoolType: "Govt-Aided",
    annualIncome: "₹3,50,000",
    incomeCategory: "₹3L – ₹6L",
    agricultureBackground: "No",
    hscMarks: 85.0,
    cutoffScore: 180.0,
    cgpa: 7.80,
    marksPercentage: 78.0,
    attendance: 90.0,
    status: "Active - Regular",
    dob: "2004-12-08",
    bloodGroup: "A+",
    residentialType: "Hosteler (Block B)",
    guardianName: "Venkatesan R",
    guardianPhone: "+91 94432 11090",
    guardianRelation: "Father",
    firstGenerationGraduate: false,
    scholarship: "None",
    backlogs: 0,
    creditsEarned: 84,
    totalCredits: 170,
    mentorName: "Dr. P. Manimegalai (Assoc. Prof. ECE)",
    semesterGrades: [
      { semester: "Sem 1", gpa: 7.60, credits: 22, status: "Passed" },
      { semester: "Sem 2", gpa: 8.00, credits: 24, status: "Cleared with Distinction" }
    ],
    recentSubjects: [
      { code: "23EC301", name: "Analog Circuits Design", credits: 4, grade: "A", gradePoint: 8 }
    ],
    activities: ["Ham Radio Club Volunteer", "RoboWars Participant"],
    skills: ["Circuits", "KiCad", "Arduino", "Embedded C"],
    placementReadiness: 83
  },

  // --- 2024 BATCH ---
  {
    id: "24BCS019",
    rollNo: "7178241CS119",
    name: "Arjun Natarajan",
    email: "arjun.n.24cs@kct.ac.in",
    phone: "+91 98402 99182",
    gender: "Male",
    academicYear: 2024,
    batch: "2024–2028",
    admissionDate: "2024-08-08",
    currentSemester: 2,
    degree: "B.E. Computer Science & Engineering",
    department: "Computer Science & Engineering",
    departmentCode: "CSE",
    district: "Salem",
    state: "Tamil Nadu",
    category: "General",
    quota: "Merit (Govt Quota)",
    schoolType: "CBSE/ICSE",
    annualIncome: "₹7,20,000",
    incomeCategory: "₹6L – ₹10L",
    agricultureBackground: "No",
    hscMarks: 98.2,
    cutoffScore: 199.0,
    cgpa: 9.60,
    marksPercentage: 96.0,
    attendance: 98.5,
    status: "Active - Regular",
    dob: "2006-06-18",
    bloodGroup: "O+",
    residentialType: "Hosteler (Block A)",
    guardianName: "Natarajan S",
    guardianPhone: "+91 94432 55410",
    guardianRelation: "Father",
    firstGenerationGraduate: false,
    scholarship: "Institutional Chairman's Merit Fellowship (₹60,000/yr)",
    backlogs: 0,
    creditsEarned: 24,
    totalCredits: 172,
    mentorName: "Dr. K. Senthil Kumar (Prof. CSE)",
    semesterGrades: [
      { semester: "Sem 1", gpa: 9.60, credits: 24, status: "Cleared with Distinction" }
    ],
    recentSubjects: [
      { code: "24CS101", name: "Foundations of Computer Science & Python", credits: 4, grade: "O", gradePoint: 10 },
      { code: "24CS102", name: "Calculus & Discrete Mathematics", credits: 4, grade: "O", gradePoint: 10 },
      { code: "24CS103", name: "Digital Logic & Computer Organization", credits: 4, grade: "O", gradePoint: 10 },
      { code: "24CS104", name: "Python Programming Lab", credits: 2, grade: "O", gradePoint: 10 }
    ],
    activities: ["Competitive Programming Lead (1st Year)", "ACM-ICPC Aspirant Club", "Campus Math Olympiad Winner"],
    skills: ["C++", "Python", "Algorithms", "Linux", "Git"],
    placementReadiness: 96
  },
  {
    id: "24BAD031",
    rollNo: "7178241AD131",
    name: "Divya Bharathi K",
    email: "divya.b.24ad@kct.ac.in",
    phone: "+91 97899 33210",
    gender: "Female",
    academicYear: 2024,
    batch: "2024–2028",
    admissionDate: "2024-08-11",
    currentSemester: 2,
    degree: "B.Tech. Artificial Intelligence & Data Science",
    department: "Artificial Intelligence & Data Science",
    departmentCode: "AI-DS",
    district: "Coimbatore",
    state: "Tamil Nadu",
    category: "OBC/BC",
    quota: "Merit (Govt Quota)",
    schoolType: "Private Matric",
    annualIncome: "₹4,20,000",
    incomeCategory: "₹3L – ₹6L",
    agricultureBackground: "No",
    hscMarks: 94.0,
    cutoffScore: 194.0,
    cgpa: 9.15,
    marksPercentage: 91.5,
    attendance: 96.0,
    status: "Active - Regular",
    dob: "2006-09-24",
    bloodGroup: "B+",
    residentialType: "Day Scholar",
    guardianName: "Krishnan S",
    guardianPhone: "+91 98421 99081",
    guardianRelation: "Father",
    firstGenerationGraduate: false,
    scholarship: "None",
    backlogs: 0,
    creditsEarned: 24,
    totalCredits: 168,
    mentorName: "Dr. R. Kavitha (Head, AI & DS)",
    semesterGrades: [
      { semester: "Sem 1", gpa: 9.15, credits: 24, status: "Cleared with Distinction" }
    ],
    recentSubjects: [
      { code: "24AD101", name: "Python for Data Science", credits: 4, grade: "O", gradePoint: 10 },
      { code: "24AD102", name: "Linear Algebra & Matrices", credits: 4, grade: "A+", gradePoint: 9 }
    ],
    activities: ["AI Club Member", "College Choir Lead"],
    skills: ["Python", "Numpy", "Pandas", "Matplotlib"],
    placementReadiness: 92
  },
  {
    id: "24BCE045",
    rollNo: "7178241CE145",
    name: "Surya Prakash M",
    email: "surya.p.24ce@kct.ac.in",
    phone: "+91 94420 55190",
    gender: "Male",
    academicYear: 2024,
    batch: "2024–2028",
    admissionDate: "2024-08-16",
    currentSemester: 2,
    degree: "B.E. Civil Engineering",
    department: "Civil Engineering",
    departmentCode: "CIVIL",
    district: "Thanjavur",
    state: "Tamil Nadu",
    category: "MBC",
    quota: "First Graduate Quota",
    schoolType: "Government",
    annualIncome: "₹1,60,000",
    incomeCategory: "₹1L – ₹3L",
    agricultureBackground: "Yes",
    hscMarks: 87.0,
    cutoffScore: 183.5,
    cgpa: 7.75,
    marksPercentage: 77.5,
    attendance: 92.0,
    status: "Active - Regular",
    dob: "2006-03-15",
    bloodGroup: "O+",
    residentialType: "Hosteler (Block B)",
    guardianName: "Manickam K",
    guardianPhone: "+91 97891 00219",
    guardianRelation: "Father",
    firstGenerationGraduate: true,
    scholarship: "TN Govt First Graduate Tuition Fee Waiver (₹25,000/yr)",
    backlogs: 0,
    creditsEarned: 24,
    totalCredits: 172,
    mentorName: "Dr. S. Rajasekaran (Prof. Civil)",
    semesterGrades: [
      { semester: "Sem 1", gpa: 7.75, credits: 24, status: "Passed" }
    ],
    recentSubjects: [
      { code: "24CE101", name: "Engineering Mechanics", credits: 4, grade: "A", gradePoint: 8 }
    ],
    activities: ["Surveying Club Member", "Volleyball Team"],
    skills: ["Engineering Drawing", "AutoCAD", "Surveying"],
    placementReadiness: 81
  },
  {
    id: "24BME067",
    rollNo: "7178241ME167",
    name: "Varun Chandran",
    email: "varun.c.24me@kct.ac.in",
    phone: "+91 96552 11980",
    gender: "Male",
    academicYear: 2024,
    batch: "2024–2028",
    admissionDate: "2024-08-20",
    currentSemester: 2,
    degree: "B.E. Mechanical Engineering",
    department: "Mechanical Engineering",
    departmentCode: "MECH",
    district: "Chennai",
    state: "Tamil Nadu",
    category: "General",
    quota: "Management Quota",
    schoolType: "Private Matric",
    annualIncome: "₹14,00,000",
    incomeCategory: "> ₹10 Lakh",
    agricultureBackground: "No",
    hscMarks: 89.0,
    cutoffScore: 185.0,
    cgpa: 8.20,
    marksPercentage: 82.0,
    attendance: 91.0,
    status: "Active - Regular",
    dob: "2006-11-02",
    bloodGroup: "B-",
    residentialType: "Hosteler (Block A)",
    guardianName: "Chandran N",
    guardianPhone: "+91 98401 77291",
    guardianRelation: "Father",
    firstGenerationGraduate: false,
    scholarship: "None",
    backlogs: 0,
    creditsEarned: 24,
    totalCredits: 172,
    mentorName: "Dr. K. Arulmozhi (Assoc. Prof. Mech)",
    semesterGrades: [
      { semester: "Sem 1", gpa: 8.20, credits: 24, status: "Cleared with Distinction" }
    ],
    recentSubjects: [
      { code: "24ME101", name: "Engineering Graphics & Modeling", credits: 4, grade: "A+", gradePoint: 9 }
    ],
    activities: ["Automobile Club", "Model UN Delegate"],
    skills: ["SolidWorks", "3D Printing", "Physics Simulation"],
    placementReadiness: 85
  },

  // --- 2025 BATCH ---
  {
    id: "25BAD003",
    rollNo: "7178251AD103",
    name: "Roshini Jayakumar",
    email: "roshini.j.25ad@kct.ac.in",
    phone: "+91 94441 22890",
    gender: "Female",
    academicYear: 2025,
    batch: "2025–2029",
    admissionDate: "2025-08-05",
    currentSemester: 1,
    degree: "B.Tech. Artificial Intelligence & Data Science",
    department: "Artificial Intelligence & Data Science",
    departmentCode: "AI-DS",
    district: "Coimbatore",
    state: "Tamil Nadu",
    category: "OBC/BC",
    quota: "Merit (Govt Quota)",
    schoolType: "Private Matric",
    annualIncome: "₹5,50,000",
    incomeCategory: "₹3L – ₹6L",
    agricultureBackground: "No",
    hscMarks: 97.8,
    cutoffScore: 198.5,
    cgpa: 9.75,
    marksPercentage: 97.5,
    attendance: 98.0,
    status: "Active - Regular",
    dob: "2007-04-12",
    bloodGroup: "O+",
    residentialType: "Day Scholar",
    guardianName: "Jayakumar R",
    guardianPhone: "+91 98421 33490",
    guardianRelation: "Father",
    firstGenerationGraduate: false,
    scholarship: "Institutional Academic Merit Scholarship (₹40,000/yr)",
    backlogs: 0,
    creditsEarned: 0,
    totalCredits: 168,
    mentorName: "Dr. R. Kavitha (Head, AI & DS)",
    semesterGrades: [],
    recentSubjects: [
      { code: "25AD101", name: "Python for Data Science & AI Foundations", credits: 4, grade: "O", gradePoint: 10 },
      { code: "25AD102", name: "Linear Algebra & Computational Math", credits: 4, grade: "O", gradePoint: 10 },
      { code: "25AD103", name: "Digital Systems & Logic Design", credits: 3, grade: "O", gradePoint: 10 },
      { code: "25AD104", name: "AI Exploratory Lab", credits: 2, grade: "O", gradePoint: 10 }
    ],
    activities: ["Freshers Innovation Challenge Winner", "Rotaract Youth Club"],
    skills: ["Python", "Prompt Engineering", "C++", "Jupyter"],
    placementReadiness: 95
  },
  {
    id: "25BCS077",
    rollNo: "7178251CS177",
    name: "Mukesh Kumaravel",
    email: "mukesh.k.25cs@kct.ac.in",
    phone: "+91 98411 90214",
    gender: "Male",
    academicYear: 2025,
    batch: "2025–2029",
    admissionDate: "2025-08-08",
    currentSemester: 1,
    degree: "B.E. Computer Science & Engineering",
    department: "Computer Science & Engineering",
    departmentCode: "CSE",
    district: "Erode",
    state: "Tamil Nadu",
    category: "SC/ST",
    quota: "Merit (Govt Quota)",
    schoolType: "Government",
    annualIncome: "₹90,000",
    incomeCategory: "< ₹1 Lakh",
    agricultureBackground: "Yes",
    hscMarks: 94.2,
    cutoffScore: 193.5,
    cgpa: 9.05,
    marksPercentage: 90.5,
    attendance: 96.0,
    status: "Active - Regular",
    dob: "2007-02-14",
    bloodGroup: "B+",
    residentialType: "Hosteler (Block B)",
    guardianName: "Kumaravel M",
    guardianPhone: "+91 94432 77091",
    guardianRelation: "Father",
    firstGenerationGraduate: true,
    scholarship: "TN SC/ST Full Higher Education Scheme",
    backlogs: 0,
    creditsEarned: 0,
    totalCredits: 172,
    mentorName: "Dr. K. Senthil Kumar (Prof. CSE)",
    semesterGrades: [],
    recentSubjects: [
      { code: "25CS101", name: "Problem Solving & C++", credits: 4, grade: "O", gradePoint: 10 },
      { code: "25CS102", name: "Linear Algebra & Computational Math", credits: 4, grade: "O", gradePoint: 10 },
      { code: "25CS103", name: "Basic Electrical & Electronics", credits: 3, grade: "A+", gradePoint: 9 },
      { code: "25CS104", name: "C++ Programming Lab", credits: 2, grade: "O", gradePoint: 10 }
    ],
    activities: ["Tamil Literary Society Secretary", "Open Source Contributor"],
    skills: ["C++", "Python", "Data Structures", "Linux CLI"],
    placementReadiness: 85
  },
  {
    id: "25BEC024",
    rollNo: "7178251EC124",
    name: "Abinaya Soundar",
    email: "abinaya.s.25ec@kct.ac.in",
    phone: "+91 97890 11982",
    gender: "Female",
    academicYear: 2025,
    batch: "2025–2029",
    admissionDate: "2025-08-12",
    currentSemester: 1,
    degree: "B.E. Electronics & Communication",
    department: "Electronics & Communication",
    departmentCode: "ECE",
    district: "Dharmapuri",
    state: "Tamil Nadu",
    category: "MBC",
    quota: "7.5% Govt School Quota",
    schoolType: "Government",
    annualIncome: "₹75,000",
    incomeCategory: "< ₹1 Lakh",
    agricultureBackground: "Yes",
    hscMarks: 91.5,
    cutoffScore: 189.0,
    cgpa: 8.60,
    marksPercentage: 86.0,
    attendance: 94.0,
    status: "Active - Regular",
    dob: "2007-08-20",
    bloodGroup: "A+",
    residentialType: "Hosteler (Block C)",
    guardianName: "Soundar P",
    guardianPhone: "+91 94421 88902",
    guardianRelation: "Father",
    firstGenerationGraduate: true,
    scholarship: "TN Govt 7.5% Quota Full Tuition & Hostel Scholarship",
    backlogs: 0,
    creditsEarned: 0,
    totalCredits: 170,
    mentorName: "Dr. P. Manimegalai (Assoc. Prof. ECE)",
    semesterGrades: [],
    recentSubjects: [
      { code: "25EC101", name: "Engineering Physics & Semiconductor Devices", credits: 4, grade: "A+", gradePoint: 9 },
      { code: "25EC102", name: "Basic Circuit Theory", credits: 4, grade: "A", gradePoint: 8 }
    ],
    activities: ["Eco Club Member", "Science Forum Coordinator"],
    skills: ["Circuit Design", "Python", "Physics Simulations"],
    placementReadiness: 86
  },
  {
    id: "25BME019",
    rollNo: "7178251ME119",
    name: "Naveen Karthikeyan",
    email: "naveen.k.25me@kct.ac.in",
    phone: "+91 96551 88201",
    gender: "Male",
    academicYear: 2025,
    batch: "2025–2029",
    admissionDate: "2025-08-14",
    currentSemester: 1,
    degree: "B.E. Mechanical Engineering",
    department: "Mechanical Engineering",
    departmentCode: "MECH",
    district: "Coimbatore",
    state: "Tamil Nadu",
    category: "General",
    quota: "Management Quota",
    schoolType: "CBSE/ICSE",
    annualIncome: "₹15,00,000",
    incomeCategory: "> ₹10 Lakh",
    agricultureBackground: "No",
    hscMarks: 88.0,
    cutoffScore: 184.0,
    cgpa: 8.10,
    marksPercentage: 81.0,
    attendance: 92.5,
    status: "Active - Regular",
    dob: "2007-05-30",
    bloodGroup: "O+",
    residentialType: "Day Scholar",
    guardianName: "Karthikeyan S",
    guardianPhone: "+91 98401 44510",
    guardianRelation: "Father",
    firstGenerationGraduate: false,
    scholarship: "None",
    backlogs: 0,
    creditsEarned: 0,
    totalCredits: 172,
    mentorName: "Dr. K. Arulmozhi (Assoc. Prof. Mech)",
    semesterGrades: [],
    recentSubjects: [
      { code: "25ME101", name: "Introduction to CAD & Engineering Graphics", credits: 4, grade: "A+", gradePoint: 9 }
    ],
    activities: ["Go-Kart Design Club", "Drone Technology Club"],
    skills: ["Fusion 360", "Python", "Robotics"],
    placementReadiness: 83
  }
];

// Realistic Tamil Nadu institutional student cohort generator for 2021-2025 multi-year exploration
const FIRST_NAMES_MALE = [
  "Aarav", "Aditya", "Ajay", "Arun", "Ashwin", "Bharath", "Chandran", "Deepak", "Dinesh", 
  "Ganesh", "Gopinath", "Gowrishankar", "Harish", "Jayaram", "Karthik", "Kishore", "Lokesh",
  "Manikandan", "Manoj", "Mithun", "Naveen", "Nithish", "Pradeep", "Praveen", "Rahul",
  "Rajesh", "Ramanathan", "Ranjith", "Rithwik", "Sabareesh", "Sakthivel", "Sanjay", "Santosh",
  "Saravanan", "Sathish", "Siddharth", "Siva", "Subash", "Sudhakar", "Surya", "Tamilselvan",
  "Tharun", "Vasanth", "Vignesh", "Vijay", "Vinoth", "Yogesh"
];

const FIRST_NAMES_FEMALE = [
  "Aarthi", "Abirami", "Akshaya", "Ananya", "Anitha", "Archana", "Bavani", "Bhuvaneshwari",
  "Deepika", "Dharani", "Divya", "Geetha", "Harini", "Hemalatha", "Janani", "Jeevitha",
  "Kanimozhi", "Karthika", "Kavitha", "Kavya", "Keerthana", "Lavanya", "Madhumitha", "Mahalakshmi",
  "Manju", "Meenakshi", "Monisha", "Mythili", "Nandhini", "Nithya", "Pavithra", "Pooja",
  "Pratheepa", "Priyadharshini", "Punitha", "Radha", "Rajeshwari", "Rakshana", "Ramya", "Revathi",
  "Roshini", "Sandhya", "Sangeetha", "Saranya", "Sathya", "Shalini", "Sharmila", "Sindhu",
  "Sneha", "Sowmiya", "Subhashini", "Swathi", "Vaishnavi", "Varsha", "Vinodhini", "Yuvashree"
];

const LAST_NAMES = [
  "Balachandran", "Chandrasekar", "Dharmaraj", "Elangovan", "Ganesan", "Gunasekaran", "Hariharan",
  "Ilango", "Jayaraman", "Kannan", "Karthikeyan", "Krishnan", "Kumaravel", "Lakshmanan", "Manickam",
  "Murugesan", "Muthusamy", "Narayanan", "Natarajan", "Palani", "Parthiban", "Perumal", "Prabhu",
  "Radhakrishnan", "Raghavan", "Rajendran", "Ramachandran", "Ramanathan", "Ramasamy", "Rangarajan",
  "Ravichandran", "Sakthivel", "Sampath", "Sankaran", "Santhanam", "Saravanan", "Sathyanarayanan",
  "Selvakumar", "Senthil", "Shanmugam", "Sivakumar", "Soundararajan", "Subramanian", "Sundaram",
  "Thangaraj", "Thirunavukkarasu", "Venkatesan", "Vijayakumar"
];

const DISTRICTS = [
  "Coimbatore", "Chennai", "Madurai", "Salem", "Erode", "Tiruchirappalli",
  "Tirunelveli", "Vellore", "Thanjavur", "Pudukkottai", "Dharmapuri"
];

const DEPARTMENTS: { code: 'CSE' | 'ECE' | 'AI-DS' | 'MECH' | 'CIVIL' | 'IT'; name: string; degree: string }[] = [
  { code: "CSE", name: "Computer Science & Engineering", degree: "B.E. Computer Science & Engineering" },
  { code: "ECE", name: "Electronics & Communication", degree: "B.E. Electronics & Communication" },
  { code: "AI-DS", name: "Artificial Intelligence & Data Science", degree: "B.Tech. Artificial Intelligence & Data Science" },
  { code: "MECH", name: "Mechanical Engineering", degree: "B.E. Mechanical Engineering" },
  { code: "CIVIL", name: "Civil Engineering", degree: "B.E. Civil Engineering" },
  { code: "IT", name: "Information Technology", degree: "B.Tech. Information Technology" }
];

const SCHOOL_TYPES: SchoolType[] = ["Government", "Govt-Aided", "Private Matric", "CBSE/ICSE"];
const QUOTAS: QuotaType[] = [
  "Merit (Govt Quota)",
  "First Graduate Quota",
  "7.5% Govt School Quota",
  "Sports Quota",
  "Management Quota",
  "Lateral Entry"
];
const CATEGORIES: Category[] = ["General", "OBC/BC", "MBC", "SC/ST", "Management/NRI"];
const BLOOD_GROUPS = ["A+", "B+", "O+", "AB+", "A-", "B-", "O-"];

function generateDeterministicCohort(): Student[] {
  const generated: Student[] = [];
  let studentCounter = 101;

  for (let year = 2021; year <= 2025; year++) {
    const studentsInBatch = 20; // 20 per year = 100 students + 15 detailed = 115 total
    const currentSem = year === 2021 ? 8 : year === 2022 ? 6 : year === 2023 ? 4 : year === 2024 ? 2 : 1;
    const batchStr = `${year}–${year + 4}`;

    for (let i = 0; i < studentsInBatch; i++) {
      const seed = year * 100 + i;
      const isFemale = (seed % 2 === 0);
      const gender: Gender = isFemale ? 'Female' : 'Male';
      const firstName = isFemale 
        ? FIRST_NAMES_FEMALE[(seed + i * 3) % FIRST_NAMES_FEMALE.length]
        : FIRST_NAMES_MALE[(seed + i * 3) % FIRST_NAMES_MALE.length];
      const lastName = LAST_NAMES[(seed + i * 5) % LAST_NAMES.length];
      const fullName = `${firstName} ${lastName}`;

      const deptObj = DEPARTMENTS[(seed + i) % DEPARTMENTS.length];
      const district = DISTRICTS[(seed + i * 2) % DISTRICTS.length];
      const schoolType = SCHOOL_TYPES[(seed + i * 7) % SCHOOL_TYPES.length];
      
      // Quota logic correlated with school type
      let quota: QuotaType = QUOTAS[(seed + i) % QUOTAS.length];
      if (schoolType === 'Government' && i % 3 === 0) {
        quota = '7.5% Govt School Quota';
      }

      const category = CATEGORIES[(seed + i * 4) % CATEGORIES.length];
      const isFirstGen = (quota === 'First Graduate Quota' || (schoolType === 'Government' && seed % 2 === 0));
      const hasAgriBg = (district === 'Erode' || district === 'Salem' || district === 'Pudukkottai' || district === 'Thanjavur' || district === 'Dharmapuri') && (seed % 3 !== 0);

      // Income logic
      let incomeStr = "₹3,50,000";
      let incomeCat: IncomeCategory = "₹3L – ₹6L";
      if (quota === '7.5% Govt School Quota' || category === 'SC/ST') {
        incomeStr = `₹${75000 + (seed % 20) * 1000}`;
        incomeCat = "< ₹1 Lakh";
      } else if (quota === 'First Graduate Quota' || hasAgriBg) {
        incomeStr = `₹${150000 + (seed % 12) * 10000}`;
        incomeCat = "₹1L – ₹3L";
      } else if (quota === 'Management Quota') {
        incomeStr = `₹${1100000 + (seed % 5) * 100000}`;
        incomeCat = "> ₹10 Lakh";
      } else if (seed % 4 === 0) {
        incomeStr = `₹${700000 + (seed % 3) * 50000}`;
        incomeCat = "₹6L – ₹10L";
      }

      // Academic Marks (Normal distribution 68 - 98%)
      const marksPercentage = parseFloat((70 + (seed % 28) + (isFemale ? 1.5 : 0)).toFixed(1));
      const cgpa = parseFloat((marksPercentage / 10).toFixed(2));
      const hscMarks = parseFloat((marksPercentage + 2.5).toFixed(1));
      const cutoffScore = parseFloat((160 + (marksPercentage / 100) * 38).toFixed(1));
      const attendance = parseFloat((88 + (seed % 11)).toFixed(1));
      const backlogs = marksPercentage < 65 ? (seed % 2) + 1 : 0;

      const yearShort = year.toString().slice(2);
      const studentId = `${yearShort}B${deptObj.code.replace('-', '')}${studentCounter.toString().slice(1)}`;
      const rollNo = `7178${yearShort}1${deptObj.code.replace('-', '')}${studentCounter}`;
      studentCounter++;

      const email = `${firstName.toLowerCase()}.${lastName.slice(0, 1).toLowerCase()}.${yearShort}${deptObj.code.toLowerCase().replace('-', '')}@kct.ac.in`;
      const phone = `+91 ${94000 + (seed % 5999)} ${10000 + (seed % 89999)}`;
      const dobYear = year - 18;
      const dobMonth = String((seed % 12) + 1).padStart(2, '0');
      const dobDay = String((seed % 27) + 1).padStart(2, '0');
      const dob = `${dobYear}-${dobMonth}-${dobDay}`;

      // Scholarships
      let scholarship = "None";
      if (quota === '7.5% Govt School Quota') {
        scholarship = "TN Govt 7.5% Quota Full Tuition & Hostel Scholarship";
      } else if (quota === 'First Graduate Quota') {
        scholarship = "TN Govt First Graduate Tuition Fee Waiver (₹25,000/yr)";
      } else if (category === 'SC/ST') {
        scholarship = "TN SC/ST Full Higher Education Scheme";
      } else if (marksPercentage >= 92) {
        scholarship = "Institutional Academic Merit Scholarship (₹40,000/yr)";
      }

      generated.push({
        id: studentId,
        rollNo: rollNo,
        name: fullName,
        email: email,
        phone: phone,
        gender: gender,
        academicYear: year,
        batch: batchStr,
        admissionDate: `${year}-08-${String(10 + (seed % 15)).padStart(2, '0')}`,
        currentSemester: currentSem,
        degree: deptObj.degree,
        department: deptObj.name,
        departmentCode: deptObj.code,
        district: district,
        state: "Tamil Nadu",
        category: category,
        quota: quota,
        schoolType: schoolType,
        annualIncome: incomeStr,
        incomeCategory: incomeCat,
        agricultureBackground: hasAgriBg ? 'Yes' : 'No',
        hscMarks: Math.min(hscMarks, 100),
        cutoffScore: Math.min(cutoffScore, 200),
        cgpa: cgpa,
        marksPercentage: marksPercentage,
        attendance: attendance,
        status: "Active - Regular",
        dob: dob,
        bloodGroup: BLOOD_GROUPS[seed % BLOOD_GROUPS.length],
        residentialType: district === 'Coimbatore' ? 'Day Scholar' : ((seed % 3 === 0) ? 'Hosteler (Block A)' : (seed % 3 === 1) ? 'Hosteler (Block B)' : 'Hosteler (Block C)'),
        guardianName: `${lastName} ${firstName[0]}`,
        guardianPhone: `+91 94432 ${String(10000 + seed).slice(0, 5)}`,
        guardianRelation: "Father",
        firstGenerationGraduate: isFirstGen,
        scholarship: scholarship,
        backlogs: backlogs,
        creditsEarned: currentSem === 8 ? 168 : currentSem === 6 ? 130 : currentSem === 4 ? 88 : currentSem === 2 ? 24 : 0,
        totalCredits: deptObj.code === 'AI-DS' ? 168 : deptObj.code === 'ECE' ? 170 : 172,
        mentorName: `Dr. Prof. Faculty Advisor (${deptObj.code})`,
        semesterGrades: currentSem > 1 ? [
          { semester: "Sem 1", gpa: parseFloat((cgpa - 0.2).toFixed(2)), credits: 22, status: "Cleared with Distinction" },
          ...(currentSem >= 4 ? [{ semester: "Sem 2", gpa: cgpa, credits: 24, status: "Cleared with Distinction" }] : []),
          ...(currentSem >= 6 ? [{ semester: "Sem 3", gpa: parseFloat((cgpa + 0.1).toFixed(2)), credits: 24, status: "Cleared with Distinction" }] : []),
          ...(currentSem >= 8 ? [{ semester: "Sem 4", gpa: cgpa, credits: 25, status: "Cleared with Distinction" }] : [])
        ] as any : [],
        recentSubjects: [
          { code: `${yearShort}${deptObj.code.slice(0, 2)}101`, name: `${deptObj.name} Core Principles`, credits: 4, grade: cgpa > 8.5 ? 'O' : cgpa > 7.5 ? 'A+' : 'A', gradePoint: cgpa > 8.5 ? 10 : cgpa > 7.5 ? 9 : 8 },
          { code: `${yearShort}${deptObj.code.slice(0, 2)}102`, name: `Applied Engineering Analysis`, credits: 4, grade: cgpa > 8 ? 'A+' : 'A', gradePoint: cgpa > 8 ? 9 : 8 }
        ] as any,
        activities: ["Technical Association Member", "Department Student Coordinator"],
        skills: deptObj.code === 'CSE' || deptObj.code === 'AI-DS' || deptObj.code === 'IT' 
          ? ["Python", "Algorithms", "C++", "Web Development"] 
          : ["MATLAB", "Engineering Design", "Simulation", "Analytics"],
        placementReadiness: Math.min(Math.round(marksPercentage * 0.95), 99)
      });
    }
  }

  return generated;
}

export const MOCK_STUDENTS: Student[] = [
  ...INITIAL_DETAILED_STUDENTS,
  ...generateDeterministicCohort()
];

export const INSTITUTION_METRICS = {
  totalStudents: 2450,
  newAdmissions: 480,
  averageMarks: 78.4,
  activePeriod: "2021–2025",
  attendanceRate: 92.6,
  placementRate: 94.2,
  facultyCount: 184,
  programsCount: 14,
  distinctionRate: 38.5,
  firstClassRate: 46.2,
  secondClassRate: 12.8,
  passRate: 2.5
};

export const DISTRICT_LIST = [
  "All Districts",
  "Coimbatore",
  "Chennai",
  "Madurai",
  "Salem",
  "Erode",
  "Tiruchirappalli",
  "Tirunelveli",
  "Vellore",
  "Thanjavur",
  "Pudukkottai",
  "Dharmapuri",
  "Bangalore"
];

export const DEPARTMENT_LIST = [
  { code: "ALL", name: "All Departments" },
  { code: "CSE", name: "Computer Science & Engineering" },
  { code: "ECE", name: "Electronics & Communication" },
  { code: "AI-DS", name: "Artificial Intelligence & Data Science" },
  { code: "MECH", name: "Mechanical Engineering" },
  { code: "CIVIL", name: "Civil Engineering" },
  { code: "IT", name: "Information Technology" }
];

export const ACADEMIC_YEARS = ["All Years", "2021", "2022", "2023", "2024", "2025"];

export const CATEGORY_LIST = ["All Categories", "General", "OBC/BC", "MBC", "SC/ST", "Management/NRI"];

export const SCHOOL_TYPE_LIST = ["All School Types", "Government", "Govt-Aided", "Private Matric", "CBSE/ICSE"];

export const QUOTA_LIST = [
  "All Quotas",
  "Merit (Govt Quota)",
  "First Graduate Quota",
  "7.5% Govt School Quota",
  "Sports Quota",
  "Management Quota",
  "Lateral Entry"
];

export const INCOME_RANGES = [
  "All Incomes",
  "< ₹1 Lakh",
  "₹1L – ₹3L",
  "₹3L – ₹6L",
  "₹6L – ₹10L",
  "> ₹10 Lakh"
];
