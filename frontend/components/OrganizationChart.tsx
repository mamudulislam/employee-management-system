import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Users, Maximize2, Minimize2, Building2, Users2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface OrgNode {
  id: string;
  name: string;
  role: string;
  avatar: string;
  team?: OrgNode[];
}

const mockOrgChart: OrgNode = {
  id: 'ceo',
  name: 'Rajesh Kumar',
  role: 'Chief Executive Officer',
  avatar: 'https://picsum.photos/seed/ceo/40/40',
  team: [
    {
      id: 'hr-head',
      name: 'Sarah Johnson',
      role: 'Head of HR',
      avatar: 'https://picsum.photos/seed/admin/40/40',
      team: [
        {
          id: 'emp-rec',
          name: 'Priya Patel',
          role: 'Recruitment Manager',
          avatar: 'https://picsum.photos/seed/rec/40/40',
        },
        {
          id: 'emp-comp',
          name: 'Michael Chen',
          role: 'Compensation Analyst',
          avatar: 'https://picsum.photos/seed/comp/40/40',
        },
      ],
    },
    {
      id: 'eng-head',
      name: 'David Miller',
      role: 'Head of Engineering',
      avatar: 'https://picsum.photos/seed/mgr/40/40',
      team: [
        {
          id: 'team-lead-1',
          name: 'Amit Sharma',
          role: 'Senior Team Lead',
          avatar: 'https://picsum.photos/seed/emp/40/40',
        },
        {
          id: 'team-lead-2',
          name: 'Lisa Wong',
          role: 'Team Lead',
          avatar: 'https://picsum.photos/seed/emp2/40/40',
        },
      ],
    },
    {
      id: 'sales-head',
      name: 'Jennifer Brown',
      role: 'VP of Sales',
      avatar: 'https://picsum.photos/seed/sales/40/40',
      team: [
        {
          id: 'sales-mgr',
          name: 'Carlos Rodriguez',
          role: 'Sales Manager',
          avatar: 'https://picsum.photos/seed/salesmgr/40/40',
        },
      ],
    },
  ],
};

interface OrgNodeProps {
  node: OrgNode;
  isExpanded: boolean;
  onToggle: (id: string) => void;
}

const OrgNodeComponent: React.FC<OrgNodeProps> = ({ node, isExpanded, onToggle }) => {
  const hasTeam = node.team && node.team.length > 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-600 transition-all">
        {hasTeam && (
          <button
            onClick={() => onToggle(node.id)}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            {isExpanded ? (
              <ChevronDown size={16} className="text-indigo-600 dark:text-indigo-400" />
            ) : (
              <ChevronRight size={16} className="text-slate-400 dark:text-slate-500" />
            )}
          </button>
        )}
        {!hasTeam && <div className="w-6" />}

        <img src={node.avatar} alt={node.name} className="w-10 h-10 rounded-lg object-cover" />

        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-900 dark:text-white truncate">{node.name}</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{node.role}</p>
        </div>

        {hasTeam && (
          <span className="text-xs font-bold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-lg whitespace-nowrap">
            <Users2 size={12} className="inline mr-1" />
            {node.team.length} member{node.team.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {hasTeam && isExpanded && (
        <div className="pl-6 border-l-2 border-slate-200 dark:border-slate-700 space-y-2 mt-3">
          {node.team.map((child) => (
            <OrgNodeComponent
              key={child.id}
              node={child}
              isExpanded={false}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const OrganizationChart: React.FC = () => {
  const { theme } = useTheme();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['ceo', 'hr-head', 'eng-head', 'sales-head']));
  const [viewMode, setViewMode] = useState<'compact' | 'expanded'>('compact');

  const expandAll = () => {
    const allIds = new Set<string>();
    const collectIds = (node: OrgNode) => {
      allIds.add(node.id);
      node.team?.forEach(collectIds);
    };
    collectIds(mockOrgChart);
    setExpandedNodes(allIds);
  };

  const collapseAll = () => {
    setExpandedNodes(new Set());
  };

  const countTeamSize = (node: OrgNode): number => {
    let count = 1;
    if (node.team) {
      node.team.forEach((child) => {
        count += countTeamSize(child);
      });
    }
    return count;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 size={24} className="text-indigo-600" />
              Organization Chart
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Total headcount: <span className="font-bold text-slate-900 dark:text-white">{countTeamSize(mockOrgChart)}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'compact' ? 'expanded' : 'compact')}
              className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
            >
              {viewMode === 'compact' ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
              {viewMode === 'compact' ? 'Expanded View' : 'Compact View'}
            </button>
            <button
              onClick={expandAll}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-bold transition-colors"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-bold transition-colors"
            >
              Collapse All
            </button>
          </div>
        </div>

        <div className={`space-y-4 ${viewMode === 'compact' ? 'max-w-2xl' : 'max-w-full'}`}>
          <OrgNodeComponent
            node={mockOrgChart}
            isExpanded={expandedNodes.has(mockOrgChart.id)}
            onToggle={(id) => {
              setExpandedNodes((prev) => {
                const newSet = new Set(prev);
                if (newSet.has(id)) {
                  newSet.delete(id);
                } else {
                  newSet.add(id);
                }
                return newSet;
              });
            }}
          />
        </div>
      </div>

      {/* Department Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { 
            dept: 'Engineering', 
            count: 45, 
            color: 'indigo',
            bgClass: theme === 'dark' ? 'bg-indigo-900/20' : 'bg-indigo-50',
            borderClass: theme === 'dark' ? 'border-indigo-800' : 'border-indigo-200',
            textClass: theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600',
            numberClass: theme === 'dark' ? 'text-indigo-200' : 'text-indigo-900',
            subTextClass: theme === 'dark' ? 'text-indigo-400' : 'text-indigo-700',
          },
          { 
            dept: 'HR & Administration', 
            count: 12, 
            color: 'emerald',
            bgClass: theme === 'dark' ? 'bg-emerald-900/20' : 'bg-emerald-50',
            borderClass: theme === 'dark' ? 'border-emerald-800' : 'border-emerald-200',
            textClass: theme === 'dark' ? 'text-emerald-300' : 'text-emerald-600',
            numberClass: theme === 'dark' ? 'text-emerald-200' : 'text-emerald-900',
            subTextClass: theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700',
          },
          { 
            dept: 'Sales & Marketing', 
            count: 28, 
            color: 'amber',
            bgClass: theme === 'dark' ? 'bg-amber-900/20' : 'bg-amber-50',
            borderClass: theme === 'dark' ? 'border-amber-800' : 'border-amber-200',
            textClass: theme === 'dark' ? 'text-amber-300' : 'text-amber-600',
            numberClass: theme === 'dark' ? 'text-amber-200' : 'text-amber-900',
            subTextClass: theme === 'dark' ? 'text-amber-400' : 'text-amber-700',
          },
        ].map((stat) => (
          <div key={stat.dept} className={`${stat.bgClass} p-6 rounded-2xl border ${stat.borderClass} transition-all hover:shadow-lg`}>
            <p className={`text-xs font-bold ${stat.textClass} uppercase tracking-wider mb-2`}>
              {stat.dept}
            </p>
            <p className={`text-3xl font-bold ${stat.numberClass}`}>{stat.count}</p>
            <p className={`text-xs ${stat.subTextClass} font-medium mt-1`}>Team members</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrganizationChart;