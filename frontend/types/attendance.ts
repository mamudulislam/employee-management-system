export interface Employee {
  id: string
  name: string
  email: string
  department: string
  position: string
  employeeId: string
  avatar?: string
  joinDate: Date
}

export interface AttendanceRecord {
  employeeId: string
  date: Date
  status: 'present' | 'absent' | 'late' | 'half-day' | 'leave' | 'holiday'
  checkIn?: string
  checkOut?: string
  hours?: number
  notes?: string
  approvedBy?: string
}

export interface AttendanceSummary {
  employeeId: string
  totalDays: number
  presentDays: number
  absentDays: number
  lateDays: number
  halfDays: number
  leaveDays: number
  holidayDays: number
  attendancePercentage: number
  averageHours: number
}

export interface DepartmentStats {
  department: string
  totalEmployees: number
  presentToday: number
  absentToday: number
  attendanceRate: number
}

export type AttendanceStatus = AttendanceRecord['status']

export type FilterOptions = {
  department: string
  status: AttendanceStatus[]
  dateRange: {
    start: Date
    end: Date
  }
}