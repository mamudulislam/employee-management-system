// Utility functions for exporting data to various formats

export interface ExportOptions {
  filename: string;
  format: 'csv' | 'json' | 'pdf';
}

export interface TableData {
  headers: string[];
  rows: (string | number | boolean)[][];
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  salary: number;
  joinDate: string;
  status: string;
}

export interface AttendanceRecord {
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: string;
  hoursWorked?: number;
}

export interface PayrollRecord {
  employeeId: string;
  employeeName: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  month: string;
}

/**
 * Convert JSON to CSV format
 */
export const jsonToCSV = (data: TableData): string => {
  const headers = data.headers.map(h => `"${h}"`).join(',');
  const rows = data.rows
    .map(row =>
      row
        .map(cell => {
          const value = String(cell);
          return value.includes(',') || value.includes('"') || value.includes('\n')
            ? `"${value.replace(/"/g, '""')}"`
            : value;
        })
        .join(',')
    )
    .join('\n');

  return `${headers}\n${rows}`;
};

/**
 * Convert JSON to Excel-compatible CSV with UTF-8 BOM
 */
export const jsonToExcel = (data: TableData): string => {
  const csv = jsonToCSV(data);
  const bom = '\uFEFF';
  return bom + csv;
};

/**
 * Export data as CSV file
 */
export const exportAsCSV = (data: TableData, filename: string) => {
  const csv = jsonToCSV(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  downloadFile(blob, `${filename}.csv`);
};

/**
 * Export data as Excel file
 */
export const exportAsExcel = (data: TableData, filename: string) => {
  const excelData = jsonToExcel(data);
  const blob = new Blob([excelData], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;',
  });
  downloadFile(blob, `${filename}.xlsx`);
};

/**
 * Export data as JSON file
 */
export const exportAsJSON = (
  data: Record<string, any> | TableData,
  filename: string
) => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
  downloadFile(blob, `${filename}.json`);
};

/**
 * Generic function to download a file
 */
const downloadFile = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const exportRecords = <T>(
  records: T[],
  format: 'csv' | 'excel' | 'json',
  headers: string[],
  rowMapper: (record: T) => (string | number | boolean)[],
  recordType: string
) => {
  const data: TableData = {
    headers,
    rows: records.map(rowMapper),
  };
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${recordType}_${timestamp}`;

  switch (format) {
    case 'csv':
      exportAsCSV(data, filename);
      break;
    case 'excel':
      exportAsExcel(data, filename);
      break;
    case 'json':
      exportAsJSON(
        {
          exported: new Date().toISOString(),
          total: records.length,
          records,
        },
        filename
      );
      break;
  }
};

/**
 * Export employee records
 */
export const exportEmployeeRecords = (employees: Employee[], format: 'csv' | 'excel' | 'json') => {
  const headers = [
    'Employee ID',
    'Name',
    'Email',
    'Department',
    'Position',
    'Salary',
    'Join Date',
    'Status',
  ];

  const rowMapper = (emp: Employee) => [
    emp.id,
    emp.name,
    emp.email,
    emp.department,
    emp.position,
    emp.salary,
    emp.joinDate,
    emp.status,
  ];

  exportRecords(employees, format, headers, rowMapper, 'employees');
};

/**
 * Export attendance records
 */
export const exportAttendanceRecords = (
  records: AttendanceRecord[],
  format: 'csv' | 'excel' | 'json'
) => {
  const headers = [
    'Employee ID',
    'Name',
    'Date',
    'Check-in',
    'Check-out',
    'Status',
    'Hours Worked',
  ];

  const rowMapper = (rec: AttendanceRecord) => [
    rec.employeeId,
    rec.employeeName,
    rec.date,
    rec.checkIn || '-',
    rec.checkOut || '-',
    rec.status,
    rec.hoursWorked || '-',
  ];

  exportRecords(records, format, headers, rowMapper, 'attendance');
};

/**
 * Export payroll records
 */
export const exportPayrollRecords = (records: PayrollRecord[], format: 'csv' | 'excel' | 'json') => {
  const headers = [
    'Employee ID',
    'Name',
    'Basic Salary',
    'Allowances',
    'Deductions',
    'Net Salary',
    'Month',
  ];

  const rowMapper = (rec: PayrollRecord) => [
    rec.employeeId,
    rec.employeeName,
    rec.basicSalary,
    rec.allowances,
    rec.deductions,
    rec.netSalary,
    rec.month,
  ];

  exportRecords(records, format, headers, rowMapper, 'payroll');
};
