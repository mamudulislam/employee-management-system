"use client"

import React, { useState, useMemo, useCallback } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday, isWeekend } from 'date-fns'
import { ChevronLeft, ChevronRight, Users, Calendar, CheckCircle, XCircle, Clock, AlertCircle, Coffee, Filter, Download, Search } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Employee, AttendanceRecord, AttendanceSummary } from '../../types/attendance'

// Sample data
const sampleEmployees: Employee[] = [
  { id: '1', name: 'John Doe', email: 'john@company.com', department: 'Engineering', position: 'Senior Developer', employeeId: 'EMP001', joinDate: new Date('2022-01-15') },
  { id: '2', name: 'Jane Smith', email: 'jane@company.com', department: 'Engineering', position: 'Product Manager', employeeId: 'EMP002', joinDate: new Date('2021-03-20') },
  { id: '3', name: 'Mike Johnson', email: 'mike@company.com', department: 'Sales', position: 'Sales Executive', employeeId: 'EMP003', joinDate: new Date('2022-06-10') },
  { id: '4', name: 'Sarah Williams', email: 'sarah@company.com', department: 'HR', position: 'HR Manager', employeeId: 'EMP004', joinDate: new Date('2020-11-05') },
  { id: '5', name: 'Robert Brown', email: 'robert@company.com', department: 'Engineering', position: 'DevOps Engineer', employeeId: 'EMP005', joinDate: new Date('2023-02-28') },
  { id: '6', name: 'Lisa Davis', email: 'lisa@company.com', department: 'Marketing', position: 'Marketing Lead', employeeId: 'EMP006', joinDate: new Date('2021-08-12') },
  { id: '7', name: 'Tom Wilson', email: 'tom@company.com', department: 'Sales', position: 'Sales Manager', employeeId: 'EMP007', joinDate: new Date('2019-12-01') },
  { id: '8', name: 'Emma Martinez', email: 'emma@company.com', department: 'Engineering', position: 'UI/UX Designer', employeeId: 'EMP008', joinDate: new Date('2022-09-18') }
]

const generateSampleAttendance = (employees: Employee[], month: Date): AttendanceRecord[] => {
  const records: AttendanceRecord[] = []
  const monthStart = startOfMonth(month)
  const monthEnd = endOfMonth(month)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  employees.forEach(employee => {
    days.forEach(day => {
      // Skip weekends
      if (isWeekend(day)) return

      // Generate random attendance data
      const rand = Math.random()
      let status: AttendanceRecord['status'] = 'present'
      
      if (rand < 0.05) status = 'absent'
      else if (rand < 0.15) status = 'late'
      else if (rand < 0.20) status = 'half-day'
      else if (rand < 0.25) status = 'leave'

      const checkIn = status === 'present' || status === 'late' ? '09:00' : undefined
      const checkOut = status === 'present' || status === 'late' ? '17:30' : undefined
      const hours = status === 'present' ? 8.5 : status === 'half-day' ? 4 : status === 'late' ? 7.5 : 0

      records.push({
        employeeId: employee.id,
        date: day,
        status,
        checkIn,
        checkOut,
        hours
      })
    })
  })

  return records
}

interface EMSAttendanceCalendarProps {
  employees?: Employee[]
  attendanceRecords?: AttendanceRecord[]
  className?: string
}

const statusConfig = {
  present: { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100', label: 'Present' },
  absent: { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100', label: 'Absent' },
  late: { icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-100', label: 'Late' },
  'half-day': { icon: Coffee, color: 'text-orange-600', bgColor: 'bg-orange-100', label: 'Half Day' },
  leave: { icon: AlertCircle, color: 'text-purple-600', bgColor: 'bg-purple-100', label: 'Leave' },
  holiday: { icon: Calendar, color: 'text-blue-600', bgColor: 'bg-blue-100', label: 'Holiday' }
}

export function EMSAttendanceCalendar({ 
  employees = sampleEmployees, 
  className 
}: EMSAttendanceCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(
    generateSampleAttendance(employees, currentMonth)
  )

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const monthDays = useMemo(() => eachDayOfInterval({ start: monthStart, end: monthEnd }), [monthStart, monthEnd])

  // Update attendance when month changes
  React.useEffect(() => {
    setAttendanceRecords(generateSampleAttendance(employees, currentMonth))
  }, [currentMonth, employees])

  // Filter employees
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesDept = selectedDepartment === 'all' || emp.department === selectedDepartment
      const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesDept && matchesSearch
    })
  }, [employees, selectedDepartment, searchTerm])

  // Get attendance for specific employee and date
  const getAttendanceForEmployee = useCallback((employeeId: string, date: Date) => {
    return attendanceRecords.find(record => 
      record.employeeId === employeeId && isSameDay(record.date, date)
    )
  }, [attendanceRecords])

  // Calculate attendance summary for employee
  const getEmployeeSummary = useCallback((employeeId: string): AttendanceSummary => {
    const employeeRecords = attendanceRecords.filter(record => record.employeeId === employeeId)
    const totalDays = monthDays.filter(day => !isWeekend(day)).length
    
    const presentDays = employeeRecords.filter(r => r.status === 'present').length
    const absentDays = employeeRecords.filter(r => r.status === 'absent').length
    const lateDays = employeeRecords.filter(r => r.status === 'late').length
    const halfDays = employeeRecords.filter(r => r.status === 'half-day').length
    const leaveDays = employeeRecords.filter(r => r.status === 'leave').length
    const holidayDays = employeeRecords.filter(r => r.status === 'holiday').length
    
    const attendancePercentage = totalDays > 0 ? ((presentDays + halfDays) / totalDays) * 100 : 0
    const averageHours = employeeRecords.reduce((sum, r) => sum + (r.hours || 0), 0) / totalDays

    return {
      employeeId,
      totalDays,
      presentDays,
      absentDays,
      lateDays,
      halfDays,
      leaveDays,
      holidayDays,
      attendancePercentage,
      averageHours
    }
  }, [attendanceRecords, monthDays])

  // Department statistics
  const departments = useMemo(() => {
    const depts = ['all', ...new Set(employees.map(emp => emp.department))]
    return depts
  }, [employees])

  const handlePrevMonth = useCallback(() => setCurrentMonth(prev => subMonths(prev, 1)), [])
  const handleNextMonth = useCallback(() => setCurrentMonth(prev => addMonths(prev, 1)), [])

  const getStatusIcon = (status: AttendanceRecord['status']) => {
    const Icon = statusConfig[status].icon
    return <Icon className="h-4 w-4" />
  }

  return (
    <div className={cn("w-full bg-white rounded-xl shadow-lg overflow-hidden", className)}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">EMS Attendance Calendar</h1>
              <p className="text-blue-100">Track and monitor all employee attendance</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors backdrop-blur-sm">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-semibold px-4">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-200" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>

          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            {departments.map(dept => (
              <option key={dept} value={dept} className="text-gray-900">
                {dept === 'all' ? 'All Departments' : dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="flex items-center gap-6 flex-wrap">
          {Object.entries(statusConfig).map(([status, config]) => (
            <div key={status} className="flex items-center gap-2">
              <div className={cn("p-1 rounded", config.bgColor)}>
                {React.createElement(config.icon, { className: cn("h-4 w-4", config.color) })}
              </div>
              <span className="text-sm text-gray-600">{config.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Attendance Table */}
      <div className="overflow-x-auto">
        <div className="min-w-[1200px]">
          {/* Table Header */}
          <div className="grid bg-gray-50 border-b border-gray-200 font-semibold text-sm text-gray-700 sticky top-0 z-10">
            <div className="p-4 border-r border-gray-200 min-w-[200px]">Employee</div>
            <div className="p-4 border-r border-gray-200 text-center min-w-[80px]">Present</div>
            <div className="p-4 border-r border-gray-200 text-center min-w-[80px]">Absent</div>
            <div className="p-4 border-r border-gray-200 text-center min-w-[80px]">Late</div>
            <div className="p-4 border-r border-gray-200 text-center min-w-[80px]">Half Day</div>
            <div className="p-4 border-r border-gray-200 text-center min-w-[80px]">Leave</div>
            <div className="p-4 border-r border-gray-200 text-center min-w-[100px]">Attendance %</div>
            {monthDays.map((day, index) => (
              <div 
                key={index} 
                className={cn(
                  "p-3 text-center border-r border-gray-200 min-w-[50px]",
                  isWeekend(day) && "bg-gray-100"
                )}
              >
                <div className={cn("text-xs", isToday(day) && "font-bold text-blue-600")}>
                  {format(day, 'EEE')}
                </div>
                <div className={cn(
                  "text-sm font-medium",
                  isToday(day) && "text-blue-600 font-bold",
                  isWeekend(day) && "text-gray-400"
                )}>
                  {format(day, 'd')}
                </div>
              </div>
            ))}
          </div>

          {/* Employee Rows */}
          <div className="divide-y divide-gray-200">
            {filteredEmployees.map(employee => {
              const summary = getEmployeeSummary(employee.id)
              
              return (
                <div key={employee.id} className="grid hover:bg-gray-50 transition-colors">
                  {/* Employee Info */}
                  <div className="p-4 border-r border-gray-200 min-w-[200px]">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {employee.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{employee.name}</div>
                        <div className="text-sm text-gray-500">{employee.employeeId} • {employee.department}</div>
                      </div>
                    </div>
                  </div>

                  {/* Statistics */}
                  <div className="p-4 border-r border-gray-200 text-center min-w-[80px]">
                    <span className="text-green-600 font-semibold">{summary.presentDays}</span>
                  </div>
                  <div className="p-4 border-r border-gray-200 text-center min-w-[80px]">
                    <span className="text-red-600 font-semibold">{summary.absentDays}</span>
                  </div>
                  <div className="p-4 border-r border-gray-200 text-center min-w-[80px]">
                    <span className="text-yellow-600 font-semibold">{summary.lateDays}</span>
                  </div>
                  <div className="p-4 border-r border-gray-200 text-center min-w-[80px]">
                    <span className="text-orange-600 font-semibold">{summary.halfDays}</span>
                  </div>
                  <div className="p-4 border-r border-gray-200 text-center min-w-[80px]">
                    <span className="text-purple-600 font-semibold">{summary.leaveDays}</span>
                  </div>
                  <div className="p-4 border-r border-gray-200 text-center min-w-[100px]">
                    <span className={cn(
                      "font-bold text-lg",
                      summary.attendancePercentage >= 90 ? "text-green-600" :
                      summary.attendancePercentage >= 75 ? "text-yellow-600" : "text-red-600"
                    )}>
                      {summary.attendancePercentage.toFixed(1)}%
                    </span>
                  </div>

                  {/* Daily Attendance */}
                  {monthDays.map((day, index) => {
                    const attendance = getAttendanceForEmployee(employee.id, day)
                    const config = attendance ? statusConfig[attendance.status] : null
                    
                    return (
                      <div 
                        key={index}
                        className={cn(
                          "p-3 text-center border-r border-gray-200 min-w-[50px] flex items-center justify-center",
                          isWeekend(day) && "bg-gray-100"
                        )}
                      >
                        {attendance && config ? (
                          <div className={cn("p-1 rounded", config.bgColor)} title={config.label}>
                            {React.createElement(config.icon, { className: cn("h-4 w-4", config.color) })}
                          </div>
                        ) : (
                          <div className="h-4 w-4 rounded bg-gray-200"></div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}