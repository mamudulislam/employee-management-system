"use client"

import React, { useState, useMemo } from 'react'
import { EMSAttendanceCalendar } from '../components/ui/ems-attendance-calendar'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns'
import { Users, Calendar, TrendingUp, TrendingDown, CheckCircle, XCircle, Clock, Coffee, AlertCircle, BarChart3, PieChart, Activity } from 'lucide-react'

export default function EMSAttendancePage() {
  const [currentDate] = useState(new Date())
  
  // Calculate statistics
  const stats = useMemo(() => {
    const totalEmployees = 8
    const presentToday = 6
    const absentToday = 1
    const lateToday = 1
    
    return {
      totalEmployees,
      presentToday,
      absentToday,
      lateToday,
      attendanceRate: ((presentToday + lateToday) / totalEmployees * 100).toFixed(1)
    }
  }, [])

  const departmentStats = [
    { department: 'Engineering', total: 4, present: 3, absent: 1, rate: 75 },
    { department: 'Sales', total: 2, present: 2, absent: 0, rate: 100 },
    { department: 'HR', total: 1, present: 1, absent: 0, rate: 100 },
    { department: 'Marketing', total: 1, present: 0, absent: 1, rate: 0 }
  ]

  const attendanceTrends = [
    { date: '2024-01-01', rate: 92 },
    { date: '2024-01-02', rate: 88 },
    { date: '2024-01-03', rate: 95 },
    { date: '2024-01-04', rate: 90 },
    { date: '2024-01-05', rate: 93 },
    { date: '2024-01-06', rate: 85 },
    { date: '2024-01-07', rate: 87 }
  ]

  const statusIcons = {
    present: { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100', label: 'Present' },
    absent: { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100', label: 'Absent' },
    late: { icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-100', label: 'Late' },
    'half-day': { icon: Coffee, color: 'text-orange-600', bgColor: 'bg-orange-100', label: 'Half Day' },
    leave: { icon: AlertCircle, color: 'text-purple-600', bgColor: 'bg-purple-100', label: 'Leave' }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
        <div className="max-w-full mx-auto">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">EMS Attendance Management</h1>
              <p className="text-blue-100">Comprehensive attendance tracking and analytics</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-full">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Employees</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalEmployees}</p>
                  <p className="text-xs text-gray-500 mt-1">Active workforce</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Present Today</p>
                  <p className="text-3xl font-bold text-green-600">{stats.presentToday}</p>
                  <p className="text-xs text-gray-500 mt-1">On time + Late</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Absent Today</p>
                  <p className="text-3xl font-bold text-red-600">{stats.absentToday}</p>
                  <p className="text-xs text-gray-500 mt-1">Unapproved absence</p>
                </div>
                <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Attendance Rate</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.attendanceRate}%</p>
                  <p className="text-xs text-gray-500 mt-1">Today's performance</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Department Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <PieChart className="h-5 w-5 text-indigo-600" />
                Department Attendance
              </h3>
              <div className="space-y-4">
                {departmentStats.map((dept, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium text-gray-700">{dept.department}</div>
                      <div className="text-xs text-gray-500">({dept.total} employees)</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-green-600">Present: {dept.present}</div>
                        <div className="text-sm text-red-600">Absent: {dept.absent}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full" 
                            style={{ width: `${dept.rate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-700 w-12 text-right">
                          {dept.rate}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-indigo-600" />
                Weekly Trend
              </h3>
              <div className="space-y-3">
                {attendanceTrends.slice(-5).map((trend, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {format(new Date(trend.date), 'EEEE')}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className={cn(
                            "h-2 rounded-full transition-all duration-300",
                            trend.rate >= 90 ? "bg-green-500" :
                            trend.rate >= 80 ? "bg-yellow-500" : "bg-red-500"
                          )}
                          style={{ width: `${trend.rate}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center gap-1">
                        {trend.rate > attendanceTrends[index - 1]?.rate ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : trend.rate < attendanceTrends[index - 1]?.rate ? (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        ) : null}
                        <span className="text-sm font-semibold text-gray-700 w-12 text-right">
                          {trend.rate}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="flex items-center justify-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors border border-blue-200">
                <Calendar className="h-5 w-5" />
                <span className="font-medium">Mark Attendance</span>
              </button>
              <button className="flex items-center justify-center gap-2 p-4 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors border border-green-200">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Bulk Present</span>
              </button>
              <button className="flex items-center justify-center gap-2 p-4 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors border border-purple-200">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">Approve Leave</span>
              </button>
              <button className="flex items-center justify-center gap-2 p-4 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg transition-colors border border-orange-200">
                <BarChart3 className="h-5 w-5" />
                <span className="font-medium">Generate Report</span>
              </button>
            </div>
          </div>

          {/* Main Calendar */}
          <EMSAttendanceCalendar className="w-full" />
        </div>
      </div>
    </div>
  )
}