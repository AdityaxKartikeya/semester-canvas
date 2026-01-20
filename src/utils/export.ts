import jsPDF from 'jspdf';
import { SlotAssignment, DAYS, TIMETABLE_STRUCTURE, THEORY_TIMES, LAB_TIMES, Day } from '@/types/timetable';

// Configuration for timetable rendering
const CONFIG = {
  // Cell dimensions (in pixels for PNG, will be scaled for PDF)
  cellWidth: 90,
  cellHeight: 50,
  dayLabelWidth: 80,
  headerHeight: 50,
  lunchWidth: 30,
  // Colors
  backgroundColor: '#ffffff',
  headerBgColor: '#1e293b',
  headerTextColor: '#ffffff',
  theoryHeaderBgColor: '#3b82f6',
  labHeaderBgColor: '#8b5cf6',
  gridLineColor: '#e2e8f0',
  dayLabelBgColor: '#f8fafc',
  dayLabelTextColor: '#1e293b',
  lunchBgColor: '#fef3c7',
  lunchTextColor: '#92400e',
  emptySlotBgColor: '#f1f5f9',
  emptySlotTextColor: '#64748b',
  // Fonts
  titleFontSize: 18,
  headerFontSize: 10,
  cellFontSize: 9,
  smallFontSize: 7,
  // Title
  title: 'Freshers Winter Semester 2025-26 Slot Timetable',
};

// Helper to get contrasting text color
function getContrastColor(hexColor: string): string {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#1e293b' : '#ffffff';
}

// Helper to get column spans for lab slots
function getLabColSpan(idx: number, isMorning: boolean): number {
  if (isMorning) {
    return idx === 2 ? 1 : 2; // Morning: 2, 2, 1
  } else {
    return idx === 0 ? 1 : 2; // Afternoon (indices 3,4,5): 1, 2, 2
  }
}

// Calculate canvas dimensions
function getCanvasDimensions() {
  // 5 morning theory + 1 lunch + 5 afternoon theory = 11 columns
  const theoryColumns = 11;
  const width = CONFIG.dayLabelWidth + (theoryColumns * CONFIG.cellWidth);
  // 2 header rows + 6 days × 2 rows (theory + lab) = 14 rows
  const height = (CONFIG.headerHeight * 2) + (DAYS.length * 2 * CONFIG.cellHeight) + 60; // +60 for title
  return { width, height, theoryColumns };
}

// Programmatically draw the timetable on a canvas
function drawTimetableOnCanvas(
  ctx: CanvasRenderingContext2D,
  assignments: Record<string, SlotAssignment>,
  scale: number = 2
): void {
  const { width, height } = getCanvasDimensions();
  
  ctx.scale(scale, scale);
  
  // Background
  ctx.fillStyle = CONFIG.backgroundColor;
  ctx.fillRect(0, 0, width, height);
  
  const theoryMorning = THEORY_TIMES.slice(0, 5);
  const theoryAfternoon = THEORY_TIMES.slice(6);
  
  let y = 0;
  
  // Title
  ctx.fillStyle = CONFIG.headerTextColor;
  ctx.font = `bold ${CONFIG.titleFontSize}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = CONFIG.dayLabelTextColor;
  ctx.fillText(CONFIG.title, width / 2, 25);
  y = 50;
  
  // Draw Theory Hours Header
  ctx.fillStyle = CONFIG.theoryHeaderBgColor;
  ctx.fillRect(0, y, CONFIG.dayLabelWidth, CONFIG.headerHeight);
  ctx.fillStyle = CONFIG.headerTextColor;
  ctx.font = `bold ${CONFIG.headerFontSize}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Theory', CONFIG.dayLabelWidth / 2, y + CONFIG.headerHeight / 2);
  
  let x = CONFIG.dayLabelWidth;
  
  // Morning theory time headers
  theoryMorning.forEach((time) => {
    ctx.fillStyle = CONFIG.theoryHeaderBgColor;
    ctx.fillRect(x, y, CONFIG.cellWidth, CONFIG.headerHeight);
    ctx.strokeStyle = CONFIG.gridLineColor;
    ctx.strokeRect(x, y, CONFIG.cellWidth, CONFIG.headerHeight);
    ctx.fillStyle = CONFIG.headerTextColor;
    ctx.font = `${CONFIG.headerFontSize}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(time as string, x + CONFIG.cellWidth / 2, y + CONFIG.headerHeight / 2);
    x += CONFIG.cellWidth;
  });
  
  // Lunch column header (spans both header rows)
  const lunchX = x;
  ctx.fillStyle = CONFIG.lunchBgColor;
  ctx.fillRect(lunchX, y, CONFIG.lunchWidth, CONFIG.headerHeight * 2);
  ctx.strokeStyle = CONFIG.gridLineColor;
  ctx.strokeRect(lunchX, y, CONFIG.lunchWidth, CONFIG.headerHeight * 2);
  ctx.save();
  ctx.translate(lunchX + CONFIG.lunchWidth / 2, y + CONFIG.headerHeight);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = CONFIG.lunchTextColor;
  ctx.font = `bold ${CONFIG.headerFontSize}px system-ui, -apple-system, sans-serif`;
  ctx.fillText('LUNCH', 0, 0);
  ctx.restore();
  x += CONFIG.lunchWidth;
  
  // Afternoon theory time headers
  theoryAfternoon.forEach((time) => {
    ctx.fillStyle = CONFIG.theoryHeaderBgColor;
    ctx.fillRect(x, y, CONFIG.cellWidth, CONFIG.headerHeight);
    ctx.strokeStyle = CONFIG.gridLineColor;
    ctx.strokeRect(x, y, CONFIG.cellWidth, CONFIG.headerHeight);
    ctx.fillStyle = CONFIG.headerTextColor;
    ctx.font = `${CONFIG.headerFontSize}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(time as string, x + CONFIG.cellWidth / 2, y + CONFIG.headerHeight / 2);
    x += CONFIG.cellWidth;
  });
  
  y += CONFIG.headerHeight;
  
  // Draw Lab Hours Header
  ctx.fillStyle = CONFIG.labHeaderBgColor;
  ctx.fillRect(0, y, CONFIG.dayLabelWidth, CONFIG.headerHeight);
  ctx.fillStyle = CONFIG.headerTextColor;
  ctx.font = `bold ${CONFIG.headerFontSize}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('Lab', CONFIG.dayLabelWidth / 2, y + CONFIG.headerHeight / 2);
  
  x = CONFIG.dayLabelWidth;
  const labMorning = LAB_TIMES.slice(0, 3);
  const labAfternoon = LAB_TIMES.slice(4);
  
  // Morning lab time headers
  labMorning.forEach((time, idx) => {
    const colSpan = getLabColSpan(idx, true);
    const cellW = CONFIG.cellWidth * colSpan;
    ctx.fillStyle = CONFIG.labHeaderBgColor;
    ctx.fillRect(x, y, cellW, CONFIG.headerHeight);
    ctx.strokeStyle = CONFIG.gridLineColor;
    ctx.strokeRect(x, y, cellW, CONFIG.headerHeight);
    ctx.fillStyle = CONFIG.headerTextColor;
    ctx.font = `${CONFIG.smallFontSize}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(time as string, x + cellW / 2, y + CONFIG.headerHeight / 2);
    x += cellW;
  });
  
  x = lunchX + CONFIG.lunchWidth; // Skip lunch
  
  // Afternoon lab time headers
  labAfternoon.forEach((time, idx) => {
    const colSpan = getLabColSpan(idx, false);
    const cellW = CONFIG.cellWidth * colSpan;
    ctx.fillStyle = CONFIG.labHeaderBgColor;
    ctx.fillRect(x, y, cellW, CONFIG.headerHeight);
    ctx.strokeStyle = CONFIG.gridLineColor;
    ctx.strokeRect(x, y, cellW, CONFIG.headerHeight);
    ctx.fillStyle = CONFIG.headerTextColor;
    ctx.font = `${CONFIG.smallFontSize}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(time as string, x + cellW / 2, y + CONFIG.headerHeight / 2);
    x += cellW;
  });
  
  y += CONFIG.headerHeight;
  
  // Draw each day's rows
  DAYS.forEach((day) => {
    const theorySlots = TIMETABLE_STRUCTURE[day].theory;
    const labSlots = TIMETABLE_STRUCTURE[day].lab;
    
    // Day label cell (spans both theory and lab rows)
    ctx.fillStyle = CONFIG.dayLabelBgColor;
    ctx.fillRect(0, y, CONFIG.dayLabelWidth, CONFIG.cellHeight * 2);
    ctx.strokeStyle = CONFIG.gridLineColor;
    ctx.strokeRect(0, y, CONFIG.dayLabelWidth, CONFIG.cellHeight * 2);
    ctx.fillStyle = CONFIG.dayLabelTextColor;
    ctx.font = `bold ${CONFIG.headerFontSize}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(day, CONFIG.dayLabelWidth / 2, y + CONFIG.cellHeight);
    
    // Theory row
    x = CONFIG.dayLabelWidth;
    
    // Morning theory slots (indices 0-4)
    for (let i = 0; i < 5; i++) {
      const slotCode = theorySlots[i];
      drawSlotCell(ctx, x, y, CONFIG.cellWidth, CONFIG.cellHeight, slotCode, assignments, 'theory');
      x += CONFIG.cellWidth;
    }
    
    // Lunch cell (spans theory and lab row)
    ctx.fillStyle = CONFIG.lunchBgColor;
    ctx.fillRect(lunchX, y, CONFIG.lunchWidth, CONFIG.cellHeight * 2);
    ctx.strokeStyle = CONFIG.gridLineColor;
    ctx.strokeRect(lunchX, y, CONFIG.lunchWidth, CONFIG.cellHeight * 2);
    
    x = lunchX + CONFIG.lunchWidth;
    
    // Afternoon theory slots (indices 5-9)
    for (let i = 5; i < 10; i++) {
      const slotCode = theorySlots[i];
      drawSlotCell(ctx, x, y, CONFIG.cellWidth, CONFIG.cellHeight, slotCode, assignments, 'theory');
      x += CONFIG.cellWidth;
    }
    
    y += CONFIG.cellHeight;
    
    // Lab row
    x = CONFIG.dayLabelWidth;
    
    // Morning lab slots (indices 0-2)
    for (let i = 0; i < 3; i++) {
      const slotCode = labSlots[i];
      const colSpan = getLabColSpan(i, true);
      const cellW = CONFIG.cellWidth * colSpan;
      drawSlotCell(ctx, x, y, cellW, CONFIG.cellHeight, slotCode, assignments, 'lab');
      x += cellW;
    }
    
    x = lunchX + CONFIG.lunchWidth; // Skip lunch
    
    // Afternoon lab slots (indices 3-5)
    for (let i = 3; i < 6; i++) {
      const slotCode = labSlots[i];
      const colSpan = getLabColSpan(i - 3, false);
      const cellW = CONFIG.cellWidth * colSpan;
      drawSlotCell(ctx, x, y, cellW, CONFIG.cellHeight, slotCode, assignments, 'lab');
      x += cellW;
    }
    
    y += CONFIG.cellHeight;
  });
}

// Draw a single slot cell
function drawSlotCell(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  slotCode: string | null,
  assignments: Record<string, SlotAssignment>,
  type: 'theory' | 'lab'
): void {
  const assignment = slotCode ? assignments[slotCode] : undefined;
  
  if (assignment) {
    // Assigned slot
    ctx.fillStyle = assignment.colorTag;
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = CONFIG.gridLineColor;
    ctx.strokeRect(x, y, width, height);
    
    const textColor = getContrastColor(assignment.colorTag);
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Course code
    ctx.font = `bold ${CONFIG.cellFontSize}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(assignment.courseCode, x + width / 2, y + height / 2 - 10);
    
    // Slot code
    ctx.font = `${CONFIG.smallFontSize}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(slotCode || '', x + width / 2, y + height / 2 + 3);
    
    // Course name (truncated)
    const courseName = assignment.courseName.length > 15 
      ? assignment.courseName.substring(0, 12) + '...' 
      : assignment.courseName;
    ctx.fillText(courseName, x + width / 2, y + height / 2 + 15);
  } else if (slotCode) {
    // Empty slot with code
    ctx.fillStyle = CONFIG.emptySlotBgColor;
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = CONFIG.gridLineColor;
    ctx.strokeRect(x, y, width, height);
    
    ctx.fillStyle = CONFIG.emptySlotTextColor;
    ctx.font = `${CONFIG.cellFontSize}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(slotCode, x + width / 2, y + height / 2);
  } else {
    // Empty cell with no slot
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = CONFIG.gridLineColor;
    ctx.strokeRect(x, y, width, height);
  }
}

export async function exportToPNG(
  assignments: Record<string, SlotAssignment>,
  filename: string = 'ffcs-timetable.png'
): Promise<void> {
  try {
    const { width, height } = getCanvasDimensions();
    const scale = 3; // High resolution
    
    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }
    
    drawTimetableOnCanvas(ctx, assignments, scale);
    
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('Failed to export PNG:', error);
  }
}

export async function exportToPDF(
  assignments: Record<string, SlotAssignment>,
  filename: string = 'ffcs-timetable.pdf'
): Promise<void> {
  try {
    const { width, height } = getCanvasDimensions();
    const scale = 3;
    
    // Create high-res canvas
    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }
    
    drawTimetableOnCanvas(ctx, assignments, scale);
    
    // Create PDF
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });
    
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Convert canvas to image and add to PDF
    const imgData = canvas.toDataURL('image/png', 1.0);
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    // Calculate dimensions to fit the page with margins
    const margin = 10;
    const availableWidth = pageWidth - (margin * 2);
    const availableHeight = pageHeight - (margin * 2);
    
    const ratio = Math.min(availableWidth / imgWidth, availableHeight / imgHeight);
    const pdfWidth = imgWidth * ratio;
    const pdfHeight = imgHeight * ratio;
    
    const xOffset = (pageWidth - pdfWidth) / 2;
    const yOffset = (pageHeight - pdfHeight) / 2;
    
    pdf.addImage(imgData, 'PNG', xOffset, yOffset, pdfWidth, pdfHeight);
    pdf.save(filename);
  } catch (error) {
    console.error('Failed to export PDF:', error);
  }
}

export function exportToJSON(data: object, filename: string = 'ffcs-timetable.json') {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  link.click();
  
  URL.revokeObjectURL(url);
}

export function importFromJSON(): Promise<string | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) {
        resolve(null);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target?.result as string);
      };
      reader.onerror = () => resolve(null);
      reader.readAsText(file);
    };
    
    input.click();
  });
}
