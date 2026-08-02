import * as XLSX from 'xlsx';

export const API_BASE_URL = 'http://localhost:8081/api';
export function exportToExcel(title: string, columns: string[], rows: (string | number)[][], fileName: string): void {
  const worksheet = XLSX.utils.aoa_to_sheet([columns, ...rows]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, title.slice(0, 31));
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}
