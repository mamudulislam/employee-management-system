
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

const Attendance: React.FC = () => {
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 5, 1)); // June 2024

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthName = currentMonth.toLocaleString('default', { month: 'long' });
  
  // Mock data for attendance status
  const getStatus = (day: number) => {
    if (day % 7 === 0 || day % 7 === 6) return 'weekend';
    if (day === 12 || day === 13) return 'leave';
    if (day === 5 || day === 19) return 'late';
    if (day > 21) return 'future';
    return 'present';
  };

  const dayCells = [];
  // Add empty cells for padding
  for (let i = 0; i < firstDayOfMonth; i++) {
    dayCells.push(<div key={`empty-${i}`} className="h-14 sm:h-20 bg-slate-50/30 rounded-lg"></div>);
  }
  // Add actual days
  for (let d = 1; d <= daysInMonth; d++) {
    const status = getStatus(d);
    dayCells.push(
      <div 
        key={d} 
        className={`group relative h-14 sm:h-20 p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
          status === 'weekend' ? 'bg-slate-50 border-slate-100 text-slate-400' :
          status === 'leave' ? 'bg-indigo-50 border-indigo-100 ring-1 ring-inset ring-indigo-200 shadow-sm shadow-indigo-100' :
          status === 'late' ? 'bg-amber-50 border-amber-100' :
          status === 'future' ? 'bg-white border-slate-100 text-slate-300' :
          'bg-white border-slate-100 hover:border-indigo-200 hover:bg-slate-50'
        }`}
      >
        <div className="flex justify-between items-start">
          <span className={`text-xs font-bold ${status === 'leave' ? 'text-indigo-600' : 'text-slate-500'}`}>{d}</span>
          {status === 'leave' && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>}
        </div>
        
        {status === 'present' && <span className="hidden sm:block text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">On Time</span>}
        {status === 'late' && <span className="hidden sm:block text-[9px] font-bold text-amber-500 uppercase tracking-tighter">Late</span>}
        {status === 'leave' && <span className="hidden sm:block text-[9px] font-bold text-indigo-500 uppercase tracking-tighter truncate">CL Request</span>}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Attendance Calendar</h2>
          <p className="text-sm text-slate-500 font-medium">Monthly view of your presence and leave schedule.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-white text-slate-700 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-sm transition-all shadow-sm group">
            <Clock size={18} className="text-indigo-600 group-hover:rotate-12 transition-transform" />
            <span>Punch In</span>
          </button>
          <button 
            onClick={() => setShowLeaveForm(true)}
            className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl hover:bg-indigo-700 font-bold text-sm shadow-lg shadow-indigo-100 transition-all active:scale-95"
          >
            <Plus size={18} />
            <span>Apply for Leave</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Calendar Section */}
        <div className="lg:col-span-3 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-bold text-slate-800">{monthName} {currentMonth.getFullYear()}</h3>
              <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-100">
                <button className="p-1.5 hover:bg-white rounded-md text-slate-400 hover:text-indigo-600 transition-all"><ChevronLeft size={16} /></button>
                <button className="p-1.5 hover:bg-white rounded-md text-slate-400 hover:text-indigo-600 transition-all"><ChevronRight size={16} /></button>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-emerald-500"></div> Present</span>
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-amber-400"></div> Late</span>
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-indigo-500"></div> Leave</span>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-3">
            {weekDays.map(day => (
              <div key={day} className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest pb-4">{day}</div>
            ))}
            {dayCells}
          </div>
        </div>

        {/* Sidebar Info Section */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-indigo-500/5 rounded-full transition-transform group-hover:scale-150"></div>
            <div className="flex items-center justify-between mb-4">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">My Quota</p>
               <Info size={14} className="text-slate-300" />
            </div>
            <div className="space-y-4">
               <div>
                  <div className="flex justify-between text-xs mb-1.5">
                     <span className="font-semibold text-slate-600">Casual (CL)</span>
                     <span className="font-bold text-indigo-600">08/12</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-indigo-500 w-[66%] rounded-full"></div>
                  </div>
               </div>
               <div>
                  <div className="flex justify-between text-xs mb-1.5">
                     <span className="font-semibold text-slate-600">Sick (SL)</span>
                     <span className="font-bold text-red-600">04/10</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-red-500 w-[40%] rounded-full"></div>
                  </div>
               </div>
               <div>
                  <div className="flex justify-between text-xs mb-1.5">
                     <span className="font-semibold text-slate-600">Earned (EL/PL)</span>
                     <span className="font-bold text-emerald-600">18/24</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-500 w-[75%] rounded-full"></div>
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
             <h3 className="text-xs font-bold text-slate-800 mb-5 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-indigo-600" />
                <span>Recent Leave Status</span>
             </h3>
             <div className="space-y-4">
                {[
                  { type: 'CL', days: 2, status: 'Approved', date: 'Jun 12', icon: 'bg-indigo-50 text-indigo-600' },
                  { type: 'SL', days: 1, status: 'Approved', date: 'May 05', icon: 'bg-red-50 text-red-600' },
                  { type: 'PL', days: 5, status: 'Reviewing', date: 'Jul 22', icon: 'bg-emerald-50 text-emerald-600' },
                ].map((h, i) => (
                  <div key={i} className="flex items-start space-x-3 p-3 bg-slate-50/50 rounded-2xl border border-slate-100 transition-all hover:bg-slate-50">
                     <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold ${h.icon}`}>
                        {h.type}
                     </div>
                     <div className="flex-1">
                        <div className="flex justify-between items-start">
                           <p className="text-xs font-bold text-slate-700">{h.type} Request</p>
                           <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-md uppercase ${
                             h.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                           }`}>
                             {h.status}
                           </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">{h.date} • {h.days} Day(s)</p>
                     </div>
                  </div>
                ))}
             </div>
             <button className="w-full mt-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-indigo-600 transition-all shadow-md active:scale-95">
                View Leave Policy
             </button>
          </div>
        </div>
      </div>

      {showLeaveForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-slate-100">
            <div className="p-8 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800 text-xl tracking-tight">Apply for Leave</h3>
                <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest mt-1">Corporate Leave Management</p>
              </div>
              <button 
                onClick={() => setShowLeaveForm(false)} 
                className="w-10 h-10 flex items-center justify-center rounded-2xl hover:bg-slate-100 text-slate-400 transition-all active:scale-90"
              >
                &times;
              </button>
            </div>
            <form className="p-8 space-y-5" onSubmit={(e) => {e.preventDefault(); setShowLeaveForm(false)}}>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Leave Category</label>
                <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all text-sm font-semibold text-slate-700 appearance-none cursor-pointer">
                  <option>{LeaveType.CASUAL}</option>
                  <option>{LeaveType.SICK}</option>
                  <option>{LeaveType.PRIVILEGE}</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Start Date</label>
                  <input type="date" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">End Date</label>
                  <input type="date" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all text-sm" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Comments/Reason</label>
                <textarea rows={3} placeholder="Provide context for HR/Managers..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all text-sm font-medium resize-none"></textarea>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowLeaveForm(false)} className="flex-1 py-4 rounded-2xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95">Discard</button>
                <button type="submit" className="flex-1 py-4 rounded-2xl bg-indigo-600 text-white text-sm font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95">Confirm Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
