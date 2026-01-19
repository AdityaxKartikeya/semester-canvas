import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function exportToPNG(elementId: string, filename: string = 'ffcs-timetable.png') {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found:', elementId);
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('Failed to export PNG:', error);
  }
}

export async function exportToPDF(elementId: string, filename: string = 'ffcs-timetable.pdf') {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found:', elementId);
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    // Calculate PDF dimensions (landscape A4)
    const pdf = new jsPDF({
      orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
    const width = imgWidth * ratio;
    const height = imgHeight * ratio;
    
    const x = (pageWidth - width) / 2;
    const y = (pageHeight - height) / 2;

    pdf.addImage(imgData, 'PNG', x, y, width, height);
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
