import { Employee } from '../types';

export interface PayrollRecord {
  _id?: string;
  employee: string | Employee;
  month: number;
  year: number;
  basicSalary: number;
  hra: number;
  allowances: {
    conveyance: number;
    medical: number;
    special: number;
    other: number;
  };
  deductions: {
    tax: number;
    socialSecurity: number;
    insurance: number;
    other: number;
  };
  bonus: number;
  netSalary: number;
  status: 'Pending' | 'Processed' | 'Paid';
  paymentDate?: Date;
  payslipUrl?: string;
  createdAt: Date;
}

export interface PayrollStats {
  totalPayout: number;
  totalEmployees: number;
  pendingApprovals: number;
  nextPayrollDate: string;
  lastMonthGrowth: number;
}

export interface PayrollFilter {
  month?: number;
  year?: number;
  department?: string;
  status?: string;
  search?: string;
}

class PayrollService {
  private static baseUrl = '/api/payroll';

  static async getAllPayrolls(filter?: PayrollFilter, token?: string): Promise<PayrollRecord[]> {
    const queryParams = new URLSearchParams();
    
    if (filter?.month) queryParams.append('month', filter.month.toString());
    if (filter?.year) queryParams.append('year', filter.year.toString());
    if (filter?.department) queryParams.append('department', filter.department);
    if (filter?.status) queryParams.append('status', filter.status);

    const url = queryParams.toString() ? `${this.baseUrl}?${queryParams}` : this.baseUrl;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch payroll records');
    }

    return response.json();
  }

  static async generatePayroll(data: Partial<PayrollRecord>, token?: string): Promise<PayrollRecord> {
    const response = await fetch(`${this.baseUrl}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to generate payroll');
    }

    return response.json();
  }

  static async updatePayrollStatus(id: string, status: string, paymentDate?: Date, token?: string): Promise<PayrollRecord> {
    const response = await fetch(`${this.baseUrl}/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status, paymentDate }),
    });

    if (!response.ok) {
      throw new Error('Failed to update payroll status');
    }

    return response.json();
  }

  static async getEmployeePayroll(employeeId: string, token?: string): Promise<PayrollRecord[]> {
    const response = await fetch(`${this.baseUrl}/employee/${employeeId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch employee payroll');
    }

    return response.json();
  }

  static async getPayrollStats(token?: string): Promise<PayrollStats> {
    const response = await fetch(`${this.baseUrl}/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch payroll stats');
    }

    return response.json();
  }

  static async exportPayroll(filter?: PayrollFilter, format: 'pdf' | 'excel' = 'pdf', token?: string): Promise<Blob> {
    const queryParams = new URLSearchParams();
    
    if (filter?.month) queryParams.append('month', filter.month.toString());
    if (filter?.year) queryParams.append('year', filter.year.toString());
    if (filter?.department) queryParams.append('department', filter.department);
    queryParams.append('format', format);

    const response = await fetch(`${this.baseUrl}/export?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to export payroll');
    }

    return response.blob();
  }

  static async generatePayslip(payrollId: string, token?: string): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/${payrollId}/payslip`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to generate payslip');
    }

    return response.blob();
  }

  // Mock data methods for development
  static getMockPayrollStats(): PayrollStats {
    return {
      totalPayout: 8400000,
      totalEmployees: 142,
      pendingApprovals: 14,
      nextPayrollDate: 'June 30, 2024',
      lastMonthGrowth: 2.1
    };
  }

  static getMockPayrolls(): PayrollRecord[] {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return [
      {
        _id: '1',
        employee: {
          id: 'EMP-10001',
          name: 'Rajesh Kumar',
          email: 'rajesh@company.com',
          role: 'HR_ADMIN',
          department: 'Engineering'
        },
        month: currentMonth,
        year: currentYear,
        basicSalary: 8000,
        hra: 2400,
        allowances: {
          conveyance: 200,
          medical: 150,
          special: 100,
          other: 0
        },
        deductions: {
          tax: 1200,
          socialSecurity: 400,
          insurance: 200,
          other: 0
        },
        bonus: 250,
        netSalary: 7200,
        status: 'Paid',
        paymentDate: new Date(),
        createdAt: new Date()
      },
      {
        _id: '2',
        employee: {
          id: 'EMP-10002',
          name: 'Sarah Johnson',
          email: 'sarah@company.com',
          role: 'MANAGER',
          department: 'HR'
        },
        month: currentMonth,
        year: currentYear,
        basicSalary: 6000,
        hra: 1800,
        allowances: {
          conveyance: 200,
          medical: 150,
          special: 50,
          other: 0
        },
        deductions: {
          tax: 900,
          socialSecurity: 300,
          insurance: 150,
          other: 0
        },
        bonus: 200,
        netSalary: 5400,
        status: 'Paid',
        paymentDate: new Date(),
        createdAt: new Date()
      }
    ];
  }
}

export default PayrollService;