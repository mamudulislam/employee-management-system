import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Users } from 'lucide-react';

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
      <div className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-2xl hover:shadow-md hover:border-indigo-300 transition-all">
        {hasTeam && (
          <button
            onClick={() => onToggle(node.id)}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {isExpanded ? (
              <ChevronDown size={16} className="text-indigo-600" />
            ) : (
              <ChevronRight size={16} className="text-slate-400" />
            )}
          </button>
        )}
        {!hasTeam && <div className="w-6" />}

        <img src={node.avatar} alt={node.name} className="w-10 h-10 rounded-lg object-cover" />

        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-800 truncate">{node.name}</p>
          <p className="text-[10px] text-slate-500 font-medium">{node.role}</p>
        </div>

        {hasTeam && (
          <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-lg whitespace-nowrap">
            {node.team.length} member{node.team.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {hasTeam && isExpanded && (
        <div className="pl-6 border-l-2 border-slate-200 space-y-2 mt-3">
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
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['ceo', 'hr-head', 'eng-head', 'sales-head']));

  const toggleNode = (id: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
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
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Users size={24} className="text-indigo-600" />
              Organization Chart
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Total headcount: <span className="font-bold text-slate-800">{countTeamSize(mockOrgChart)}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-colors">
              Expand All
            </button>
            <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-colors">
              Collapse All
            </button>
          </div>
        </div>

        <div className="space-y-4 max-w-2xl">
          <OrgNodeComponent
            node={mockOrgChart}
            isExpanded={expandedNodes.has(mockOrgChart.id)}
            onToggle={toggleNode}
          />
        </div>
      </div>

      {/* Department Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { dept: 'Engineering', count: 45, color: 'indigo' },
          { dept: 'HR & Administration', count: 12, color: 'emerald' },
          { dept: 'Sales & Marketing', count: 28, color: 'amber' },
        ].map((stat) => (
          <div key={stat.dept} className={`bg-${stat.color}-50 p-6 rounded-2xl border border-${stat.color}-200`}>
            <p className={`text-xs font-bold text-${stat.color}-600 uppercase tracking-wider mb-2`}>
              {stat.dept}
            </p>
            <p className={`text-3xl font-bold text-${stat.color}-900`}>{stat.count}</p>
            <p className={`text-xs text-${stat.color}-700 font-medium mt-1`}>Team members</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrganizationChart;
