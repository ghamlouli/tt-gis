import jsPDF from 'jspdf'; 
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

/**
 * Utilitaire d'export réutilisé par tous les tableaux de bord
 * (MetroEthernet, GSM, MSAN, SwitchOutdoor, FH, GIS Cloud).
 *
 * Nécessite : npm install jspdf jspdf-autotable xlsx
 */
export function exportToPdf(title: string, columns: string[], rows: (string | number)[][], fileName: string): void {
  const doc = new jsPDF({ orientation: columns.length > 6 ? 'landscape' : 'portrait' });
  doc.setFontSize(14);
  doc.text(title, 14, 15);

  autoTable(doc, {
    head: [columns],
    body: rows,
    startY: 22,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [37, 99, 235] }
  });

  doc.save(`${fileName}.pdf`);
}

export function exportToExcel(title: string, columns: string[], rows: (string | number)[][], fileName: string): void {
  const worksheet = XLSX.utils.aoa_to_sheet([columns, ...rows]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, title.slice(0, 31));
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}
