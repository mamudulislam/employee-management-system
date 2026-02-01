import React from 'react';
import { Users, Calendar, FileText, Search, Inbox, TrendingUp } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'search' | 'list' | 'chart' | 'inbox' | 'default';
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  variant = 'default',
}) => {
  const icons: Record<string, React.ReactNode> = {
    search: <Search className="mx-auto mb-4 text-slate-300" size={48} />,
    list: <Users className="mx-auto mb-4 text-slate-300" size={48} />,
    chart: <TrendingUp className="mx-auto mb-4 text-slate-300" size={48} />,
    inbox: <Inbox className="mx-auto mb-4 text-slate-300" size={48} />,
    default: <FileText className="mx-auto mb-4 text-slate-300" size={48} />,
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {icon || icons[variant]}
      <h3 className="text-lg font-bold text-slate-800 mb-2 mt-2">{title}</h3>
      <p className="text-sm text-slate-500 text-center max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700 transition-colors shadow-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export const EmptySearchResults: React.FC<{ searchTerm: string }> = ({ searchTerm }) => (
  <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-sm text-center">
    <Search className="mx-auto mb-4 text-slate-300" size={48} />
    <p className="text-slate-600 font-medium mb-2">No results found for "{searchTerm}"</p>
    <p className="text-slate-400 text-sm">Try adjusting your search terms or filters</p>
  </div>
);

export const EmptyEmployeeList: React.FC = () => (
  <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-sm text-center">
    <Users className="mx-auto mb-4 text-slate-300" size={48} />
    <p className="text-slate-600 font-medium mb-2">No employees found</p>
    <p className="text-slate-400 text-sm">Start by adding new employees to your organization</p>
  </div>
);

export const EmptyLeaveRequests: React.FC = () => (
  <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-sm text-center">
    <Calendar className="mx-auto mb-4 text-slate-300" size={48} />
    <p className="text-slate-600 font-medium mb-2">No pending leave requests</p>
    <p className="text-slate-400 text-sm">All leave requests have been processed</p>
  </div>
);

export const EmptyAnalytics: React.FC = () => (
  <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-sm text-center">
    <TrendingUp className="mx-auto mb-4 text-slate-300" size={48} />
    <p className="text-slate-600 font-medium mb-2">No data available</p>
    <p className="text-slate-400 text-sm">Data will appear here once it's collected</p>
  </div>
);

export default EmptyState;
