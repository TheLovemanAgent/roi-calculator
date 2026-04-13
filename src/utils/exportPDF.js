import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { formatCurrency, formatPercent } from './calculations';

const C = {
  navy:      [26,  26,  46],
  blue:      [51,  153, 255],
  amber:     [245, 158, 11],
  gray:      [90,  96,  112],
  lightGray: [224, 226, 232],
  bgGray:    [244, 244, 246],
  green:     [29,  179, 126],
  greenBg:   [220, 247, 237],
  red:       [229, 20,  61],
  white:     [255, 255, 255],
  rowEven:   [249, 249, 251],
};

const PAGE_W = 210;
const MARGIN = 14;
const COL = PAGE_W - MARGIN * 2;

export async function exportPDF({ values, result, values2, result2, showComparison, chartElement }) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  let y = 0;

  // ── Helpers ──────────────────────────────────────────────────────
  function setColor(c)  { doc.setTextColor(...c); }
  function setFill(c)   { doc.setFillColor(...c); }
  function setDraw(c)   { doc.setDrawColor(...c); }
  function ln(h = 5)    { y += h; }

  function checkPage(needed = 20) {
    if (y + needed > 282) { doc.addPage(); y = MARGIN; }
  }

  function sectionLabel(text) {
    checkPage(10);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    setColor(C.gray);
    doc.text(text, MARGIN, y);
    ln(1.5);
    setDraw(C.lightGray);
    doc.setLineWidth(0.2);
    doc.line(MARGIN, y, PAGE_W - MARGIN, y);
    ln(4);
  }

  // ── Header bar ───────────────────────────────────────────────────
  setFill(C.navy);
  doc.rect(0, 0, PAGE_W, 18, 'F');

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  setColor(C.blue);
  doc.text('EPAM', MARGIN, 12);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  setColor([190, 200, 220]);
  doc.text('Business ROI Calculator', MARGIN + 19, 12);

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  doc.setFontSize(7.5);
  setColor([160, 170, 195]);
  doc.text(`${dateStr}  ${timeStr}`, PAGE_W - MARGIN, 12, { align: 'right' });

  // Blue accent line
  setFill(C.blue);
  doc.rect(0, 18, PAGE_W, 1.5, 'F');

  y = 25;

  // ── Scenario block renderer ──────────────────────────────────────
  function renderScenario(vals, res, label, accentColor) {
    checkPage(65);

    // Scenario header pill
    if (label) {
      setFill(accentColor === C.blue ? [235, 245, 255] : [255, 250, 235]);
      doc.roundedRect(MARGIN, y, COL, 7, 1.5, 1.5, 'F');
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      setColor(accentColor);
      doc.text(label, MARGIN + 3.5, y + 4.8);
      ln(10);
    }

    // Parameters — 2-column grid
    const params = [
      ['Initial Investment', formatCurrency(Number(vals.initialInvestment) || 0)],
      ['Monthly Revenue',    formatCurrency(Number(vals.monthlyRevenue)    || 0)],
      ['Monthly Costs',      formatCurrency(Number(vals.monthlyCosts)      || 0)],
      ['Period',             `${vals.period} months`],
    ];

    const cellW = (COL - 4) / 2;
    for (let i = 0; i < params.length; i += 2) {
      const left  = params[i];
      const right = params[i + 1];
      for (let col = 0; col < 2; col++) {
        const item = col === 0 ? left : right;
        if (!item) continue;
        const xBase = MARGIN + col * (cellW + 4);
        setFill(C.bgGray);
        setDraw(C.lightGray);
        doc.setLineWidth(0.15);
        doc.rect(xBase, y, cellW, 9, 'FD');
        doc.setFontSize(6);
        doc.setFont('helvetica', 'normal');
        setColor(C.gray);
        doc.text(item[0], xBase + 2.5, y + 3.5);
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'bold');
        setColor(C.navy);
        doc.text(item[1], xBase + 2.5, y + 7.5);
      }
      ln(11);
    }

    ln(2);

    // Results — 4-column metric tiles
    const isPos    = res.totalNetProfit >= 0;
    const metrics  = [
      ['ROI',               formatPercent(res.roi),                          isPos],
      ['Payback Period',    res.paybackPeriod === null ? 'Never' : `${res.paybackPeriod} mo`, null],
      ['Total Net Profit',  formatCurrency(res.totalNetProfit),               isPos],
      ['Monthly Net Profit',formatCurrency(res.monthlyNetProfit),             res.monthlyNetProfit >= 0],
    ];

    const mW = (COL - 6) / 4;
    for (let i = 0; i < 4; i++) {
      const [mLabel, mVal, mPos] = metrics[i];
      const xBase = MARGIN + i * (mW + 2);
      setFill(C.bgGray);
      setDraw(C.lightGray);
      doc.setLineWidth(0.15);
      doc.rect(xBase, y, mW, 11, 'FD');
      // coloured top bar
      setFill(accentColor);
      doc.rect(xBase, y, mW, 1.2, 'F');
      doc.setFontSize(5.5);
      doc.setFont('helvetica', 'bold');
      setColor(C.gray);
      doc.text(mLabel.toUpperCase(), xBase + 2, y + 5);
      const valColor = mPos === null ? C.navy : (mPos ? C.green : C.red);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      setColor(valColor);
      doc.text(mVal, xBase + 2, y + 9.5);
    }
    ln(14);
  }

  // ── Render scenario(s) ───────────────────────────────────────────
  sectionLabel('SCENARIO DETAILS');
  if (showComparison) {
    renderScenario(values,  result,  'Scenario 1', C.blue);
    ln(2);
    renderScenario(values2, result2, 'Scenario 2', C.amber);
  } else {
    renderScenario(values, result, null, C.blue);
  }

  // ── Chart image ──────────────────────────────────────────────────
  try {
    ln(2);
    sectionLabel('CUMULATIVE CASH FLOW');
    const canvas = await html2canvas(chartElement, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true,
    });
    const imgData = canvas.toDataURL('image/png');
    const chartH  = Math.min((canvas.height / canvas.width) * COL, 70);
    checkPage(chartH + 5);
    doc.addImage(imgData, 'PNG', MARGIN, y, COL, chartH);
    ln(chartH + 5);
  } catch {
    // Chart capture failed silently
  }

  // ── Monthly table renderer ───────────────────────────────────────
  function renderTable(cashFlowData, monthlyRevenue, monthlyCosts, label, accentColor) {
    checkPage(18);
    if (label) {
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      setColor(accentColor);
      doc.text(label, MARGIN, y);
      ln(5);
    }

    const monthlyNet  = monthlyRevenue - monthlyCosts;
    const breakevenMo = cashFlowData.find(d => d.cashFlow >= 0)?.month ?? null;
    const cW = [14, 38, 34, 34, 62]; // col widths
    const headers = ['Month', 'Monthly Revenue', 'Monthly Costs', 'Net Profit', 'Cumulative Cash Flow'];

    // Header row
    setFill(C.navy);
    doc.rect(MARGIN, y, COL, 6.5, 'F');
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    setColor(C.white);
    let xPos = MARGIN + 2;
    headers.forEach((h, i) => { doc.text(h, xPos, y + 4.5); xPos += cW[i]; });
    ln(6.5);

    // Data rows
    for (const { month, cashFlow } of cashFlowData) {
      checkPage(6);
      const isBreakeven = month === breakevenMo;
      const isEven = month % 2 === 0;

      setFill(isBreakeven ? C.greenBg : isEven ? C.rowEven : C.white);
      setDraw(C.lightGray);
      doc.setLineWidth(0.1);
      doc.rect(MARGIN, y, COL, 5.5, 'FD');

      doc.setFontSize(6.5);
      doc.setFont('helvetica', isBreakeven ? 'bold' : 'normal');

      const cells = [
        { text: `${month}${isBreakeven ? ' ★' : ''}`, color: isBreakeven ? C.green : C.navy },
        { text: formatCurrency(monthlyRevenue), color: C.navy },
        { text: formatCurrency(monthlyCosts),   color: C.navy },
        { text: formatCurrency(monthlyNet),     color: monthlyNet >= 0 ? C.green : C.red },
        { text: formatCurrency(cashFlow),       color: cashFlow   >= 0 ? C.green : C.red },
      ];

      xPos = MARGIN + 2;
      cells.forEach((cell, i) => {
        setColor(cell.color);
        doc.text(cell.text, xPos, y + 4);
        xPos += cW[i];
      });
      ln(5.5);
    }
    ln(4);
  }

  // ── Render table(s) ──────────────────────────────────────────────
  ln(2);
  sectionLabel('MONTHLY BREAKDOWN');
  if (showComparison) {
    renderTable(result.cashFlowData,  Number(values.monthlyRevenue)  || 0, Number(values.monthlyCosts)  || 0, 'Scenario 1', C.blue);
    renderTable(result2.cashFlowData, Number(values2.monthlyRevenue) || 0, Number(values2.monthlyCosts) || 0, 'Scenario 2', C.amber);
  } else {
    renderTable(result.cashFlowData, Number(values.monthlyRevenue) || 0, Number(values.monthlyCosts) || 0, null, C.blue);
  }

  // ── Footer on every page ─────────────────────────────────────────
  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    setDraw(C.lightGray);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, 289, PAGE_W - MARGIN, 289);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    setColor(C.gray);
    doc.text('EPAM Business ROI Calculator — Confidential', MARGIN, 294);
    doc.text(`Page ${p} of ${total}`, PAGE_W - MARGIN, 294, { align: 'right' });
  }

  // ── Save ─────────────────────────────────────────────────────────
  const stamp = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}`;
  doc.save(`ROI-Report-${stamp}.pdf`);
}
