import React from 'react';
import { Calendar } from 'lucide-react';

const AttendanceHeatmap: React.FC = () => {
  // Generate 12 weeks of attendance data
  const weeks = Array.from({ length: 12 }).map((_, weekIndex) =>
    Array.from({ length: 7 }).map((_, dayIndex) => {
      const value = Math.random();
      let status: 'present' | 'absent' | 'late' | 'leave' | 'weekend';

      if ((weekIndex * 7 + dayIndex) % 7 === 5 || (weekIndex * 7 + dayIndex) % 7 === 6) {
        status = 'weekend';
      } else if (value > 0.8) {
        status = 'present';
      } else if (value > 0.6) {
        status = 'late';
      } else if (value > 0.3) {
        status = 'leave';
      } else {
        status = 'absent';
      }

      return { value, status, week: weekIndex, day: dayIndex };
    })
  );

  const getColor = (status: string): string => {
    switch (status) {
      case 'present':
        return 'bg-emerald-500 hover:bg-emerald-600';
      case 'late':
        return 'bg-amber-400 hover:bg-amber-500';
      case 'leave':
        return 'bg-indigo-400 hover:bg-indigo-500';
      case 'absent':
        return 'bg-red-400 hover:bg-red-500';
      case 'weekend':
        return 'bg-slate-100 hover:bg-slate-200';
      default:
        return 'bg-slate-200';
    }
  };

  const getLabel = (status: string): string => {
    switch (status) {
      case 'present':
        return 'Present';
      case 'late':
        return 'Late';
      case 'leave':
        return 'Leave';
      case 'absent':
        return 'Absent';
      case 'weekend':
        return 'Weekend';
      default:
        return 'Unknown';
    }
  };

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Calendar size={24} className="text-indigo-600" />
            Attendance Heatmap
          </h3>
          <p className="text-sm text-slate-500 mt-2">12-week attendance pattern visualization</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-6 mb-8 pb-6 border-b border-slate-200">
        {[
          { status: 'present', label: 'Present', color: 'bg-emerald-500' },
          { status: 'late', label: 'Late Arrival', color: 'bg-amber-400' },
          { status: 'leave', label: 'On Leave', color: 'bg-indigo-400' },
          { status: 'absent', label: 'Absent', color: 'bg-red-400' },
          { status: 'weekend', label: 'Weekend', color: 'bg-slate-100' },
        ].map(({ status, label, color }) => (
          <div key={status} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded border border-slate-300 ${color}`} />
            <span className="text-sm font-medium text-slate-600">{label}</span>
          </div>
        ))}
      </div>

      {/* Heatmap Grid */}
      <div className="space-y-2 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          <div className="w-20" />
          {dayLabels.map((day) => (
            <div key={day} className="w-12 h-12 flex items-center justify-center text-xs font-bold text-slate-500 uppercase">
              {day}
            </div>
          ))}
        </div>

        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex gap-2 min-w-max items-center">
            <div className="w-20 text-right pr-2">
              <span className="text-xs font-bold text-slate-500">W{weekIndex + 1}</span>
            </div>
            <div className="flex gap-2">
              {week.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`w-12 h-12 rounded-lg transition-all cursor-pointer group relative ${getColor(day.status)}`}
                  title={`${dayLabels[day.day]}, Week ${weekIndex + 1}: ${getLabel(day.status)}`}
                >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    {getLabel(day.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Statistics */}
      <div className="mt-8 pt-8 border-t border-slate-200 grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Present Days', value: '78', color: 'emerald' },
          { label: 'Late Arrivals', value: '12', color: 'amber' },
          { label: 'Leave Days', value: '8', color: 'indigo' },
          { label: 'Absent Days', value: '3', color: 'red' },
          { label: 'Attendance %', value: '92.3%', color: 'indigo' },
        ].map((stat) => (
          <div key={stat.label} className={`bg-${stat.color}-50 p-4 rounded-xl border border-${stat.color}-200`}>
            <p className={`text-[10px] font-bold text-${stat.color}-600 uppercase tracking-wider mb-1`}>
              {stat.label}
            </p>
            <p className={`text-2xl font-bold text-${stat.color}-900`}>{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceHeatmap;
