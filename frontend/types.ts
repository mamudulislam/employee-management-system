
export enum Role {
  HR_ADMIN = 'HR_ADMIN',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE'
}

export enum Department {
  ENGINEERING = 'Engineering',
  MARKETING = 'Marketing',
  SALES = 'Sales',
  HR = 'HR',
  FINANCE = 'Finance',
  OPERATIONS = 'Operations'
}

export enum LeaveType {
  CASUAL = 'Casual Leave (CL)',
  SICK = 'Sick Leave (SL)',
  PRIVILEGE = 'Privilege/Earned Leave (PL/EL)'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  department?: Department;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: Department;
  joinDate: string;
  salary: number;
  status: 'Active' | 'On Leave' | 'Terminated';
  avatar: string;
}

export interface LeaveRequest {
  id: string;
  employeeName: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reason?: string;
}

export interface AttendanceRecord {
  date: string;
  present: number;
  absent: number;
  late: number;
}
