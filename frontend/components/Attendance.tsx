
import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react';
import { LeaveType } from '../types';

import { Calendar } from './ui/calendar';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const Attendance: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Custom modifiers for attendance status
  const modifiers = {
    weekend: (date: Date) => date.getDay() === 0 || date.getDay() === 6,
    present: (date: Date) => {
      const day = date.getDate();
      const month = date.getMonth();
      // Just mock logic for demo
      return month === 5 && ![12, 13, 5, 19, 0, 6].includes(day % 7) && day <= 21 && day > 0;
    },
    leave: (date: Date) => date.getMonth() === 5 && (date.getDate() === 12 || date.getDate() === 13),
    late: (date: Date) => date.getMonth() === 5 && (date.getDate() === 5 || date.getDate() === 19),
  };

  const modifierStyles = {
    weekend: { color: '#cbd5e1' },
    present: { backgroundColor: '#f0fdf4', color: '#16a34a', border: '2px solid #bbf7d0', boxShadow: '0 0 15px rgba(22, 163, 74, 0.1)' },
    leave: { backgroundColor: '#eef2ff', color: '#4f46e5', border: '2px solid #ddd6fe', boxShadow: '0 0 15px rgba(79, 70, 229, 0.1)' },
    late: { backgroundColor: '#fffbeb', color: '#d97706', border: '2px solid #fef3c7', boxShadow: '0 0 15px rgba(217, 119, 6, 0.1)' },
  };

  return (
    <div className="space-y-6">
      <div className="xl:flex justify-between items-end gap-4 mb-2">
        <div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Attendance <span className="text-indigo-600">Mastery</span></h2>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-[0.1em]">Real-time shift tracking & Precision Scheduling</p>
        </div>
        <div className="hidden xl:flex gap-2">
          <div className="flex -space-x-3 overflow-hidden p-1">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 bg-slate-200 dark:bg-slate-800"></div>
            ))}
            <div className="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 bg-indigo-500 text-[10px] font-bold text-white">+12</div>
          </div>
          <p className="text-[10px] font-bold text-slate-400 self-center ml-2">Team online now</p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-12 max-w-5xl mx-auto">
        {/* Shadcn Calendar */}
        <div className="w-full max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                modifiers={modifiers}
                modifiersStyles={modifierStyles}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </div>

        {/* Support Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Shift Summary</span>
            </h3>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">8.5 Hours</p>
                <p className="text-xs text-slate-500 font-medium tracking-tight">Total work time recorded today</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600">
                <CheckCircle2 size={18} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Info className="w-4 h-4" />
              <span>Leave Pool</span>
            </h3>
            <div className="space-y-4 text-sm font-semibold">
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Casual Leave</span>
                <span className="text-slate-900 dark:text-slate-100">08 / 12</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-[66%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
