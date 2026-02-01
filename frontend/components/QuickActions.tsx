
import React from 'react';
import { UserPlus, Users, DollarSign, FileText, Calendar, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

const actions = [
    { label: 'Add Employee', icon: <UserPlus size={18} />, color: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400', path: '/employees' },
    { label: 'Create Team', icon: <Users size={18} />, color: 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400', path: '/projects' },
    { label: 'Run Payroll', icon: <DollarSign size={18} />, color: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400', path: '/payroll' },
    { label: 'New Request', icon: <FileText size={18} />, color: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400', path: '/attendance' },
    { label: 'Schedule Event', icon: <Calendar size={18} />, color: 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400', path: '/attendance' },
    { label: 'Security Audit', icon: <Shield size={18} />, color: 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400', path: '/settings' },
];

const QuickActions: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {actions.map((action, index) => (
                <Button
                    key={index}
                    variant="outline"
                    onClick={() => navigate(action.path)}
                    className="h-auto flex flex-col items-center justify-center p-5 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow-lg hover:-translate-y-1 transition-all group group border-none shadow-sm"
                >
                    <div className={cn(
                        "p-4 rounded-2xl shadow-sm mb-3 group-hover:scale-110 transition-transform",
                        action.color
                    )}>
                        {action.icon}
                    </div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 tracking-tight">{action.label}</span>
                </Button>
            ))}
        </div>
    );
};

export default QuickActions;
