"use client"

import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { CalendarWithTime } from './ui/calendar-with-time';

export default function EnhancedCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Custom modifiers for attendance status
  const modifiers = {
    weekend: (date: Date) => date.getDay() === 0 || date.getDay() === 6,
    present: (date: Date) => {
      const day = date.getDate();
      const month = date.getMonth();
      // Just mock logic for demo
      return month === 1 && ![12, 13, 5, 19, 0, 6].includes(day % 7) && day <= 21 && day > 0;
    },
    leave: (date: Date) => date.getMonth() === 1 && (date.getDate() === 12 || date.getDate() === 13),
    late: (date: Date) => date.getMonth() === 1 && (date.getDate() === 5 || date.getDate() === 19),
  };

  const modifierStyles = {
    weekend: { color: '#cbd5e1' },
    present: { backgroundColor: '#f0fdf4', color: '#16a34a', border: '2px solid #bbf7d0', boxShadow: '0 0 15px rgba(22, 163, 74, 0.1)' },
    leave: { backgroundColor: '#eef2ff', color: '#4f46e5', border: '2px solid #ddd6fe', boxShadow: '0 0 15px rgba(79, 70, 229, 0.1)' },
    late: { backgroundColor: '#fffbeb', color: '#d97706', border: '2px solid #fef3c7', boxShadow: '0 0 15px rgba(217, 119, 6, 0.1)' },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
            Employee Calendar
          </h1>
          <p className="text-slate-600 font-medium">
            Advanced scheduling and attendance management system
          </p>
        </div>

        <div className="flex justify-center">
          <CalendarWithTime modifiers={modifiers} modifiersStyles={modifierStyles} />
        </div>

        {/* Additional Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Attendance Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Present Days</span>
                <span className="text-2xl font-black text-emerald-600">18</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Leave Days</span>
                <span className="text-2xl font-black text-amber-600">2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Late Days</span>
                <span className="text-2xl font-black text-orange-600">2</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Team Schedule</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-sm text-slate-600">Morning Shift</span>
                <span className="text-sm font-bold text-slate-900 ml-auto">12:00 - 20:00</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-slate-600">Evening Shift</span>
                <span className="text-sm font-bold text-slate-900 ml-auto">20:00 - 04:00</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-sm text-slate-600">Remote Work</span>
                <span className="text-sm font-bold text-slate-900 ml-auto">Flexible</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full py-3 px-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">
                Request Leave
              </button>
              <button className="w-full py-3 px-4 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors">
                View Reports
              </button>
              <button className="w-full py-3 px-4 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors">
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}