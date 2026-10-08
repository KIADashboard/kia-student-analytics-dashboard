import { jsPDF } from 'jspdf';
import { Student } from '../../types';

type ProfileSection = [string, [string, string][]];

export function downloadStudentProfilePdf(student: Student, profileSections: ProfileSection[]) {
  const pdf = new jsPDF({ format: 'a4', unit: 'mm' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const startPage = () => {
    pdf.addPage();
    y = margin;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(95, 108, 102);
    pdf.text(`${student.name} | ${student.rollNo}`, margin, y);
    y += 5;
    pdf.setDrawColor(220, 228, 223);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 8;
  };

  const ensureSpace = (height: number) => {
    if (y + height > pageHeight - margin) startPage();
  };

  pdf.setFillColor(38, 91, 73);
  pdf.rect(0, 0, pageWidth, 42, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.text('STUDENT PROFILE', margin, 15);
  pdf.setFontSize(20);
  pdf.text(student.name, margin, 25);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.text(`${student.rollNo}  |  ${student.degree}  |  Batch ${student.academicYear}`, margin, 33);
  y = 52;

  const summary = [
    ['CGPA', student.cgpa.toFixed(2)],
    ['Attendance', `${student.attendance.toFixed(1)}%`],
    ['Cut-off', student.cutoffScore.toFixed(1)],
    ['Arrears', String(student.backlogs)],
  ];
  const summaryGap = 4;
  const summaryWidth = (contentWidth - summaryGap * 3) / summary.length;
  summary.forEach(([label, value], index) => {
    const x = margin + index * (summaryWidth + summaryGap);
    pdf.setFillColor(242, 247, 244);
    pdf.roundedRect(x, y, summaryWidth, 18, 2, 2, 'F');
    pdf.setTextColor(95, 108, 102);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.text(label, x + 3, y + 6);
    pdf.setTextColor(28, 40, 34);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.text(value, x + 3, y + 13);
  });
  y += 27;

  profileSections.forEach(([title, fields]) => {
    ensureSpace(12);
    pdf.setFillColor(233, 243, 238);
    pdf.roundedRect(margin, y, contentWidth, 8, 1.5, 1.5, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(38, 91, 73);
    pdf.text(title, margin + 3, y + 5.5);
    y += 11;

    fields.forEach(([label, value]) => {
      const labelLines = pdf.splitTextToSize(label, 43) as string[];
      const valueLines = pdf.splitTextToSize(value || 'Not provided', contentWidth - 50) as string[];
      const rowHeight = Math.max(labelLines.length, valueLines.length) * 4.5 + 3;
      ensureSpace(rowHeight);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8.5);
      pdf.setTextColor(95, 108, 102);
      pdf.text(labelLines, margin, y + 3.5);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(28, 40, 34);
      pdf.text(valueLines, margin + 48, y + 3.5);
      y += rowHeight;
      pdf.setDrawColor(235, 239, 236);
      pdf.line(margin, y, pageWidth - margin, y);
    });
    y += 5;
  });

  const drawTable = (title: string, headers: string[], rows: string[][], widths: number[]) => {
    ensureSpace(18);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(28, 40, 34);
    pdf.text(title, margin, y + 4);
    y += 9;

    const drawHeader = () => {
      pdf.setFillColor(242, 247, 244);
      pdf.rect(margin, y, contentWidth, 8, 'F');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8);
      pdf.setTextColor(65, 82, 73);
      let x = margin;
      headers.forEach((header, index) => {
        pdf.text(header, x + 2, y + 5.3);
        x += widths[index];
      });
      y += 8;
    };

    drawHeader();
    rows.forEach(row => {
      const cellLines = row.map((cell, index) => pdf.splitTextToSize(cell, widths[index] - 4) as string[]);
      const rowHeight = Math.max(8, ...cellLines.map(lines => lines.length * 4 + 3));
      if (y + rowHeight > pageHeight - margin) {
        startPage();
        drawHeader();
      }
      let x = margin;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(35, 47, 41);
      cellLines.forEach((lines, index) => {
        pdf.text(lines, x + 2, y + 4.5);
        x += widths[index];
      });
      y += rowHeight;
      pdf.setDrawColor(235, 239, 236);
      pdf.line(margin, y, pageWidth - margin, y);
    });
    y += 8;
  };

  const semesterWidths = [contentWidth * 0.34, contentWidth * 0.18, contentWidth * 0.18, contentWidth * 0.3];
  drawTable(
    'Semester Performance',
    ['Semester', 'GPA', 'Credits', 'Status'],
    student.semesterGrades.map(semester => [
      semester.semester,
      semester.gpa.toFixed(2),
      String(semester.credits),
      semester.status,
    ]),
    semesterWidths,
  );

  const subjectWidths = [
    contentWidth * 0.2,
    contentWidth * 0.48,
    contentWidth * 0.12,
    contentWidth * 0.1,
    contentWidth * 0.1,
  ];
  drawTable(
    'Recent Subject Grades',
    ['Subject Code', 'Subject', 'Credits', 'Grade', 'Result'],
    student.recentSubjects.map(subject => [
      subject.code,
      subject.name,
      String(subject.credits),
      subject.grade,
      subject.grade === 'RA' ? 'Fail' : 'Pass',
    ]),
    subjectWidths,
  );

  const pageCount = pdf.getNumberOfPages();
  for (let page = 1; page <= pageCount; page += 1) {
    pdf.setPage(page);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(120, 130, 125);
    pdf.text(`Page ${page} of ${pageCount}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
  }

  const filename = student.rollNo.replace(/[^a-zA-Z0-9_-]+/g, '-') || 'student';
  pdf.save(`student-profile-${filename}.pdf`);
}
