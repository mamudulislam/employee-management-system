
import React from 'react';
import {
  Users,
  LayoutDashboard,
  LayoutGrid,
  CreditCard,
  Calendar,
  BarChart3,
  Settings,
  TrendingUp,
  UserPlus,
  LogOut,
  ShieldCheck,
  Briefcase,
  GitBranch,
  Search,
  BookOpen,
  UserMinus,
  Shield
} from 'lucide-react';
import { Department, Employee, LeaveRequest, AttendanceRecord, Role, LeaveType } from './types';

export const DEPARTMENTS = Object.values(Department);

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  roles: Role[];
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, roles: [Role.HR_ADMIN, Role.MANAGER, Role.EMPLOYEE] },
  { id: 'employees', label: 'Directory', icon: <Users size={20} />, roles: [Role.HR_ADMIN, Role.MANAGER] },
  { id: 'workspace', label: 'Workspace', icon: <LayoutGrid size={20} />, roles: [Role.HR_ADMIN, Role.MANAGER, Role.EMPLOYEE] },
  { id: 'org-chart', label: 'Organization', icon: <GitBranch size={20} />, roles: [Role.HR_ADMIN, Role.MANAGER] },
  { id: 'attendance', label: 'Attendance', icon: <Calendar size={20} />, roles: [Role.HR_ADMIN, Role.MANAGER, Role.EMPLOYEE] },
  { id: 'leaves', label: 'Leaves', icon: <ShieldCheck size={20} />, roles: [Role.HR_ADMIN, Role.MANAGER, Role.EMPLOYEE] },
  { id: 'payroll', label: 'Payroll', icon: <CreditCard size={20} />, roles: [Role.HR_ADMIN, Role.EMPLOYEE] },
  { id: 'performance', label: 'Performance', icon: <TrendingUp size={20} />, roles: [Role.HR_ADMIN, Role.MANAGER, Role.EMPLOYEE] },
  { id: 'recruitment', label: 'Recruitment', icon: <UserPlus size={20} />, roles: [Role.HR_ADMIN, Role.MANAGER] },

  { id: 'projects', label: 'Projects', icon: <GitBranch size={20} />, roles: [Role.HR_ADMIN, Role.MANAGER, Role.EMPLOYEE] },
  { id: 'reports', label: 'Reports', icon: <BarChart3 size={20} />, roles: [Role.HR_ADMIN] },
  { id: 'settings', label: 'Settings', icon: <Settings size={20} />, roles: [Role.HR_ADMIN, Role.MANAGER, Role.EMPLOYEE] },
];


export const MOCK_EMPLOYEES: Employee[] = Array.from({ length: 1000 }).map((_, i) => ({
  id: `EMP-${10000 + i}`,
  name: `Employee ${i + 1}`,
  email: `emp${i + 1}@company.com`,
  role: i % 10 === 0 ? 'Team Leader' : 'Software Engineer',
  department: DEPARTMENTS[i % DEPARTMENTS.length],
  joinDate: new Date(2020, 0, 1 + (i % 365)).toISOString().split('T')[0],
  salary: 50000 + (Math.random() * 100000),
  status: i % 15 === 0 ? 'On Leave' : 'Active',
  avatar: `https://picsum.photos/seed/${i + 100}/40/40`,
}));

export const STAT_CARDS = [
  { label: 'Total Headcount', value: '100,234', change: '+12%', icon: <Users className="text-blue-600" />, roles: [Role.HR_ADMIN] },
  { label: 'Team Strength', value: '12', change: 'Stable', icon: <Users className="text-indigo-600" />, roles: [Role.MANAGER] },
  { label: 'My Remaining Leaves', value: '24 Days', change: 'PL/EL', icon: <Calendar className="text-emerald-600" />, roles: [Role.EMPLOYEE] },
];

// Added ATTENDANCE_STATS export to fix Dashboard.tsx error
export const ATTENDANCE_STATS: AttendanceRecord[] = [
  { date: 'Mon', present: 98, absent: 2, late: 5 },
  { date: 'Tue', present: 95, absent: 5, late: 8 },
  { date: 'Wed', present: 99, absent: 1, late: 2 },
  { date: 'Thu', present: 97, absent: 3, late: 4 },
  { date: 'Fri', present: 96, absent: 4, late: 6 },
  { date: 'Sat', present: 45, absent: 55, late: 1 },
  { date: 'Sun', present: 12, absent: 88, late: 0 },
];

// Added MOCK_LEAVES export to fix Dashboard.tsx error
export const MOCK_LEAVES: LeaveRequest[] = [
  {
    id: 'LR-1',
    employeeName: 'Sarah Johnson',
    type: LeaveType.CASUAL,
    startDate: '2024-06-12',
    endDate: '2024-06-14',
    status: 'Pending',
    reason: 'Family Event'
  },
  {
    id: 'LR-2',
    employeeName: 'David Miller',
    type: LeaveType.SICK,
    startDate: '2024-06-10',
    endDate: '2024-06-10',
    status: 'Approved',
    reason: 'Medical checkup'
  },
  {
    id: 'LR-3',
    employeeName: 'Amit Sharma',
    type: LeaveType.PRIVILEGE,
    startDate: '2024-07-01',
    endDate: '2024-07-10',
    status: 'Pending',
    reason: 'Annual leave'
  },
];
