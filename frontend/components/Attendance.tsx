

import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Info,
  CalendarDays,
  UserCheck,
  UserX,
  AlertCircle,
  Timer
} from 'lucide-react';
import { Calendar } from './ui/calendar';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { cn } from '../lib/utils';

const Attendance: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Custom modifiers for attendance status
  const today = new Date();
  const currentMonth = today.getMonth();

  const modifiers = {
    weekend: (date: Date) => date.getDay() === 0 || date.getDay() === 6,
    present: (date: Date) => {
      const day = date.getDate();
      const month = date.getMonth();
      const isWeekday = date.getDay() !== 0 && date.getDay() !== 6;
      return isWeekday && month === currentMonth && ![5, 12, 19, 25].includes(day) && day <= today.getDate();
    },
    absent: (date: Date) => {
      const day = date.getDate();
      const month = date.getMonth();
      const isWeekday = date.getDay() !== 0 && date.getDay() !== 6;
      return isWeekday && month === currentMonth && [12].includes(day) && day <= today.getDate();
    },
    late: (date: Date) => {
      const day = date.getDate();
      const month = date.getMonth();
      return month === currentMonth && [5, 19].includes(day) && day <= today.getDate();
    },
    leave: (date: Date) => {
      const day = date.getDate();
      const month = date.getMonth();
      return month === currentMonth && [25].includes(day) && day <= today.getDate();
    },
  };

  const modifierStyles = {
    present: {
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      color: '#16a34a',
      border: '2px solid rgba(34, 197, 94, 0.2)',
      fontWeight: '700'
    },
    absent: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      color: '#dc2626',
      border: '2px solid rgba(239, 68, 68, 0.2)',
      fontWeight: '700'
    },
    late: {
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      color: '#d97706',
      border: '2px solid rgba(245, 158, 11, 0.2)',
      fontWeight: '700'
    },
    leave: {
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      color: '#4f46e5',
      border: '2px solid rgba(99, 102, 241, 0.2)',
      fontWeight: '700'
    },
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none">
              <CalendarDays className="text-white w-6 h-6" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Attendance <span className="text-indigo-600">Mastery</span></h2>
          </div>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-[0.1em]">Real-time shift tracking & Precision Scheduling</p>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="flex -space-x-3 overflow-hidden px-2">
            {[1, 2, 3, 4].map(i => (
              <img
                key={i}
                className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 shadow-sm"
                src={`https://picsum.photos/seed/${i + 50}/32/32`}
                alt="Team member"
              />
            ))}
            <div className="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 bg-indigo-600 text-[10px] font-bold text-white z-10 shadow-lg shadow-indigo-200 dark:shadow-none">+12</div>
          </div>
          <div className="pr-4 border-l border-slate-200 dark:border-slate-700 pl-4 py-1">
            <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-wider">Team Status</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] font-bold text-slate-400">16 Active Now</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Calendar Section */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-none shadow-2xl shadow-indigo-100 dark:shadow-none bg-white dark:bg-slate-900 overflow-hidden rounded-[2.5rem]">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl font-black text-slate-900 dark:text-white">Monthly Insights</CardTitle>
                  <CardDescription className="font-medium text-slate-500">Track your punctuality and presence</CardDescription>
                </div>
                <Badge variant="outline" className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/30 px-4 py-1.5 rounded-xl font-bold">
                  {today.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start py-4">
                <div className="flex-1 w-full scale-105 origin-top-left md:scale-110">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    modifiers={modifiers}
                    modifiersStyles={modifierStyles}
                    className="p-4 rounded-[2rem] border-none"
                    classNames={{
                      day_today: "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-xl",
                      day_selected: "bg-indigo-600 !text-white !opacity-100 shadow-lg shadow-indigo-200 ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900 rounded-xl",
                      day: "h-11 w-11 transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:rounded-xl active:scale-95 text-sm font-medium",
                      head_cell: "text-slate-400 font-bold text-xs uppercase tracking-widest h-11 w-11",
                    }}
                  />
                </div>

                <div className="w-full md:w-64 space-y-4 bg-slate-50/50 dark:bg-slate-800/30 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Legend</h4>
                  <div className="space-y-4">
                    <LegendItem icon={<UserCheck size={14} />} color="text-green-600" bg="bg-green-50 dark:bg-green-900/20" label="Present" />
                    <LegendItem icon={<UserX size={14} />} color="text-red-600" bg="bg-red-50 dark:bg-red-900/20" label="Absent" />
                    <LegendItem icon={<Timer size={14} />} color="text-amber-600" bg="bg-amber-50 dark:bg-amber-900/20" label="Late Arrival" />
                    <LegendItem icon={<AlertCircle size={14} />} color="text-indigo-600" bg="bg-indigo-50 dark:bg-indigo-900/20" label="On Leave" />
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-500">Punctuality Rate</span>
                      <span className="text-xs font-black text-indigo-600">92%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 w-[92%] rounded-full shadow-[0_0_10px_rgba(79,70,229,0.5)]" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Cards */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-xl shadow-slate-100 dark:shadow-none bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl text-emerald-600 group-hover:rotate-12 transition-transform">
                  <Clock className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg font-black text-slate-900 dark:text-white">Shift Summary</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-end justify-between">
                <div className="space-y-1">
                  <p className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter">08:42</p>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Work Time</p>
                </div>
                <div className="flex flex-col items-end">
                  <Badge className="bg-emerald-500 text-white border-none font-black text-[10px] px-2 py-0.5 rounded-lg mb-1 shadow-lg shadow-emerald-100 dark:shadow-none">ON TRACK</Badge>
                  <p className="text-[10px] text-slate-400 font-bold">+12m vs yesterday</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Check In</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">09:15 AM</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg Break</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">45 Mins</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl shadow-indigo-100 dark:shadow-none bg-indigo-600 rounded-[2.5rem] overflow-hidden relative group hover:scale-[1.02] transition-transform duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-400/20 rounded-full -ml-12 -mb-12 blur-2xl" />

            <CardHeader className="pb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/10 rounded-2xl text-white">
                  <Info className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg font-black text-white">Leave Analytics</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-black text-white px-1">
                    <span className="opacity-80 uppercase tracking-widest text-[10px]">Casual Leave Pool</span>
                    <span>08 / 12</span>
                  </div>
                  <div className="h-2.5 w-full bg-indigo-800 rounded-full overflow-hidden p-0.5 border border-indigo-500/30">
                    <div className="h-full bg-white rounded-full w-[66%] shadow-[0_0_15px_rgba(255,255,255,0.4)]" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-black text-white px-1">
                    <span className="opacity-80 uppercase tracking-widest text-[10px]">Sick Leave Balance</span>
                    <span>04 / 06</span>
                  </div>
                  <div className="h-2.5 w-full bg-indigo-800 rounded-full overflow-hidden p-0.5 border border-indigo-500/30">
                    <div className="h-full bg-emerald-400 rounded-full w-[66%] shadow-[0_0_15px_rgba(52,211,153,0.4)]" />
                  </div>
                </div>
              </div>

              <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-indigo-900/20 hover:bg-slate-50 transition-colors">
                Request Leave
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const LegendItem: React.FC<{ icon: React.ReactNode, color: string, bg: string, label: string }> = ({ icon, color, bg, label }) => (
  <div className="flex items-center gap-3 group/item">
    <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover/item:scale-110", bg, color)}>
      {icon}
    </div>
    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{label}</span>
  </div>
);

export default Attendance;

