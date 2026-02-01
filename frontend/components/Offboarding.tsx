
import React from 'react';
import { UserMinus, FileCheck, Key, LogOut, CheckCircle2, Circle } from 'lucide-react';

const Offboarding: React.FC = () => {
    const offboardingProcess = [
        { name: 'Sarah Miller', date: 'Oct 30, 2024', status: 'In Progress', progress: 40, department: 'Marketing' },
        { name: 'James Wilson', date: 'Nov 15, 2024', status: 'Pending', progress: 10, department: 'Sales' },
        { name: 'David Brown', date: 'Oct 20, 2024', status: 'Completed', progress: 100, department: 'Engineering' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Exit / Offboarding</h1>
                <button className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-bold text-sm">
                    <UserMinus size={18} />
                    <span>Start Offboarding</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">Offboarding Checklist</h2>
                    <div className="space-y-4">
                        {[
                            { label: 'Asset Return (Laptop, Badge)', icon: Key, done: true },
                            { label: 'Final Settlement / Payroll', icon: FileCheck, done: true },
                            { label: 'System Access Revocation', icon: LogOut, done: false },
                            { label: 'Exit Interview', icon: Users, done: false },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className={`p-2 rounded-lg ${item.done ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                                        <item.icon size={18} />
                                    </div>
                                    <span className={`text-sm font-semibold ${item.done ? 'text-slate-800' : 'text-slate-500'}`}>{item.label}</span>
                                </div>
                                {item.done ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Circle size={18} className="text-slate-300" />}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-800">Active Exits</h2>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {offboardingProcess.map((item, index) => (
                            <div key={index} className="p-4 hover:bg-slate-50 transition-colors">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-bold text-slate-800">{item.name}</h4>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${item.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
                                            item.status === 'In Progress' ? 'bg-indigo-50 text-indigo-600' :
                                                'bg-amber-50 text-amber-600'
                                        }`}>
                                        {item.status}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 mb-3">{item.department} • Exit Date: {item.date}</p>
                                <div className="flex items-center space-x-4">
                                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${item.progress}%` }}></div>
                                    </div>
                                    <span className="text-xs font-bold text-slate-700">{item.progress}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Dummy users icon for the checklist
const Users = (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
);

export default Offboarding;
