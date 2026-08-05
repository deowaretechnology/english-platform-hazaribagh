
function escapePdfString(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function buildPdfBlob(title: string, subtitle: string, metaInfo: string, highlights: string[], bodyParagraphs: string[]): Blob {
  const safeTitle = escapePdfString(title);
  const safeSubtitle = escapePdfString(subtitle);
  const safeMeta = escapePdfString(metaInfo);

  const streamLines: string[] = [];
  
  // Header Banner
  streamLines.push('0.11 0.38 0.89 rg'); // Blue color
  streamLines.push('40 760 515 40 re f'); // Rect header fill
  
  streamLines.push('BT');
  streamLines.push('/F1 18 Tf');
  streamLines.push('1 1 1 rg'); // White text
  streamLines.push('55 775 Td');
  streamLines.push(`(${safeTitle}) Tj`);
  streamLines.push('ET');

  // Subtitle
  streamLines.push('BT');
  streamLines.push('/F2 11 Tf');
  streamLines.push('0.15 0.23 0.37 rg');
  streamLines.push('40 730 Td');
  streamLines.push(`(${safeSubtitle}) Tj`);
  streamLines.push('ET');

  // Meta Info
  streamLines.push('BT');
  streamLines.push('/F2 9 Tf');
  streamLines.push('0.4 0.45 0.55 rg');
  streamLines.push('40 715 Td');
  streamLines.push(`(${safeMeta}) Tj`);
  streamLines.push('ET');

  // Divider Line
  streamLines.push('0.8 0.85 0.9 rg');
  streamLines.push('40 700 515 1 re f');

  // Highlights Section Header
  let currentY = 675;
  if (highlights.length > 0) {
    streamLines.push('BT');
    streamLines.push('/F1 12 Tf');
    streamLines.push('0.11 0.38 0.89 rg');
    streamLines.push(`40 ${currentY} Td`);
    streamLines.push('(KEY HIGHLIGHTS & SUMMARY NOTES:) Tj');
    streamLines.push('ET');
    currentY -= 20;

    for (const hl of highlights) {
      const safeHl = escapePdfString(hl.length > 85 ? hl.substring(0, 85) + '...' : hl);
      streamLines.push('BT');
      streamLines.push('/F2 10 Tf');
      streamLines.push('0.2 0.2 0.2 rg');
      streamLines.push(`50 ${currentY} Td`);
      streamLines.push(`(- ${safeHl}) Tj`);
      streamLines.push('ET');
      currentY -= 16;
    }
    currentY -= 10;
  }

  // Divider Line
  streamLines.push('0.8 0.85 0.9 rg');
  streamLines.push(`40 ${currentY} 515 1 re f`);
  currentY -= 25;

  // Body Content
  if (bodyParagraphs.length > 0) {
    streamLines.push('BT');
    streamLines.push('/F1 12 Tf');
    streamLines.push('0.11 0.38 0.89 rg');
    streamLines.push(`40 ${currentY} Td`);
    streamLines.push('(STUDY MATERIAL & EXPLANATION:) Tj');
    streamLines.push('ET');
    currentY -= 20;

    for (const para of bodyParagraphs) {
      // Chunk paragraph into lines of max ~80 chars
      const words = para.split(' ');
      let currentLine = '';
      for (const w of words) {
        if ((currentLine + ' ' + w).length > 80) {
          streamLines.push('BT');
          streamLines.push('/F2 10 Tf');
          streamLines.push('0.15 0.15 0.15 rg');
          streamLines.push(`40 ${currentY} Td`);
          streamLines.push(`(${escapePdfString(currentLine)}) Tj`);
          streamLines.push('ET');
          currentY -= 15;
          currentLine = w;
          if (currentY < 100) break;
        } else {
          currentLine = currentLine ? `${currentLine} ${w}` : w;
        }
      }
      if (currentLine && currentY >= 100) {
        streamLines.push('BT');
        streamLines.push('/F2 10 Tf');
        streamLines.push('0.15 0.15 0.15 rg');
        streamLines.push(`40 ${currentY} Td`);
        streamLines.push(`(${escapePdfString(currentLine)}) Tj`);
        streamLines.push('ET');
        currentY -= 20;
      }
      if (currentY < 100) break;
    }
  }

  // Footer
  streamLines.push('0.92 0.95 0.98 rg');
  streamLines.push('40 40 515 30 re f');
  streamLines.push('BT');
  streamLines.push('/F2 9 Tf');
  streamLines.push('0.3 0.4 0.6 rg');
  streamLines.push('50 50 Td');
  streamLines.push('(Official Study Material provided by English Platform Hazaribagh. Contact: +91 98765 43210) Tj');
  streamLines.push('ET');

  const streamContent = streamLines.join('\n');
  const streamLength = streamContent.length;

  const pdfString = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<<
  /Type /Page
  /Parent 2 0 R
  /MediaBox [0 0 595 842]
  /Resources <<
    /Font <<
      /F1 4 0 R
      /F2 5 0 R
    >>
  >>
  /Contents 6 0 R
>>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
6 0 obj
<< /Length ${streamLength} >>
stream
${streamContent}
endstream
endobj
xref
0 7
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000117 00000 n 
0000000270 00000 n 
0000000342 00000 n 
0000000409 00000 n 
trailer
<< /Size 7 /Root 1 0 R >>
startxref
${500 + streamLength}
%%EOF`;

  return new Blob([pdfString], { type: 'application/pdf' });
}

export function triggerAutoDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function downloadNotePdf(note: {
  title: string;
  class: string;
  subject: string;
  chapter: string;
  pages: number;
  fileSize: string;
  pdfUrl?: string;
  previewHighlights: string[];
}) {
  const cleanFileName = `Class_${note.class}_${note.subject}_${note.title}`
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_') + '.pdf';

  // If a real uploaded PDF URL exists (from Sanity CMS or server)
  if (note.pdfUrl && note.pdfUrl !== '#' && note.pdfUrl.startsWith('http')) {
    try {
      const response = await fetch(note.pdfUrl);
      if (response.ok) {
        const blob = await response.blob();
        triggerAutoDownload(blob, cleanFileName);
        return;
      }
    } catch (err) {
      console.warn('Direct fetch failed for pdfUrl, using direct link download:', err);
    }

    // Direct anchor fallback
    const link = document.createElement('a');
    link.href = note.pdfUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.download = cleanFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  // Fallback synthetic PDF generation if no uploaded PDF exists
  const title = 'ENGLISH PLATFORM HAZARIBAGH';
  const subtitle = `Class ${note.class} • ${note.subject}: ${note.title}`;
  const metaInfo = `Chapter: ${note.chapter} | Pages: ${note.pages} | Verified Faculty Notes`;
  const bodyParagraphs = [
    'CHAPTER OVERVIEW & CORE RULES:',
    '1. Key Definition: English Literature & Grammar patterns for Board Examination 2026.',
    '2. Core Formulas: Active to Passive Voice step-by-step conversion rules with practice examples.',
    '3. Direct to Indirect Speech rules for statements, questions, imperative, and exclamatory sentences.',
    '4. High-yield answer presentation techniques prepared by Senior Hazaribagh Faculty.'
  ];

  const blob = buildPdfBlob(title, subtitle, metaInfo, note.previewHighlights || [], bodyParagraphs);
  triggerAutoDownload(blob, cleanFileName);
}

export function downloadChapterPdf(chapterTitle: string, summary: string) {
  const title = 'ENGLISH PLATFORM HAZARIBAGH';
  const subtitle = `Lecture Supplement: ${chapterTitle}`;
  const metaInfo = `Verified Lecture Revision Notes`;
  const bodyParagraphs = [
    'CHAPTER SUMMARY:',
    summary,
    'REVISION CHECKLIST:',
    '1. Review character sketches and key dialogue quotes.',
    '2. Practice 5-mark answer structure for Board Exams.'
  ];

  const blob = buildPdfBlob(title, subtitle, metaInfo, [], bodyParagraphs);
  const cleanFileName = `Chapter_${chapterTitle}`
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_') + '.pdf';

  triggerAutoDownload(blob, cleanFileName);
}

export function downloadStudentCardPdf(user: {
  name: string;
  phone?: string;
  admissionId?: string;
  targetClass?: string;
}) {
  const title = 'ENGLISH PLATFORM HAZARIBAGH';
  const subtitle = 'OFFICIAL STUDENT ADMIT & IDENTITY PASS 2026';
  const metaInfo = `Admission ID: ${user.admissionId || 'EPH-2026-901'} | Issued Date: ${new Date().toLocaleDateString()}`;
  const bodyParagraphs = [
    'STUDENT DETAILS:',
    `Student Name: ${user.name}`,
    `Contact Mobile: ${user.phone || '+91 9876543210'}`,
    `Enrolled Target Class: ${user.targetClass || 'Competitive / Board Exams'}`,
    'INSTITUTE RULES:',
    '1. Carry this official pass to all Sunday OMR Test Series and offline batches.',
    '2. Adhere to classroom guidelines and test timing rules at Hazaribagh Center.'
  ];

  const blob = buildPdfBlob(title, subtitle, metaInfo, [], bodyParagraphs);
  const cleanFileName = `Student_ID_Card_${user.name}`
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_') + '.pdf';

  triggerAutoDownload(blob, cleanFileName);
}

export function downloadFeeReceiptPdf(user: {
  name: string;
  phone?: string;
  admissionId?: string;
}) {
  const title = 'ENGLISH PLATFORM HAZARIBAGH';
  const subtitle = 'OFFICIAL FEE PAYMENT RECEIPT';
  const metaInfo = `Receipt No: EPH-REC-${Math.floor(100000 + Math.random() * 900000)} | Date: ${new Date().toLocaleDateString()}`;
  const bodyParagraphs = [
    'PAYMENT BREAKDOWN:',
    `Received From: ${user.name}`,
    `Admission Ref: ${user.admissionId || 'EPH-2026-901'}`,
    'Batch Fee Status: PAID IN FULL (PAID)',
    'Payment Mode: Online / Center Desk',
    'Thank you for enrolling with English Platform Hazaribagh!'
  ];

  const blob = buildPdfBlob(title, subtitle, metaInfo, [], bodyParagraphs);
  const cleanFileName = `Fee_Receipt_${user.name}`
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_') + '.pdf';

  triggerAutoDownload(blob, cleanFileName);
}
