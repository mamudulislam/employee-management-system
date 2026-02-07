import React, { useState } from 'react';
import { Building2, Palette, Settings, Users2, Layers, Sparkles, CreditCard, LogOut, BookOpen, BarChart3 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import OrganizationChart from '../components/OrganizationChart';
import WorkspaceThemeManager from '../components/WorkspaceThemeManager';
import WorkspaceSettingsManager from '../components/WorkspaceSettingsManager';
import Payroll from '../components/Payroll';
import PerformanceEnhanced from '../components/PerformanceEnhanced';
import RecruitmentEnhanced from '../components/RecruitmentEnhanced';



import Reports from '../components/Reports';
import { cn } from '../lib/utils';

const WorkspacePage: React.FC = () => {
  const [activeView, setActiveView] = useState<'overview' | 'org-chart' | 'themes' | 'settings' | 'payroll' | 'performance' | 'recruitment' | 'reports'>('overview');

  const workspaceStats = [
    {
      title: 'Total Employees',
      value: '142',
      change: '+12%',
      icon: <Users2 size={20} className="text-indigo-600" />,
      description: 'Active workforce',
      color: 'indigo'
    },
    {
      title: 'Monthly Payroll',
      value: '$8.4M',
      change: '+2.1%',
      icon: <CreditCard size={20} className="text-emerald-600" />,
      description: 'Total compensation',
      color: 'emerald'
    },
    {
      title: 'Departments',
      value: '8',
      change: '+2',
      icon: <Layers size={20} className="text-purple-600" />,
      description: 'Organizational units',
      color: 'purple'
    },
    {
      title: 'Active Projects',
      value: '37',
      change: '+8',
      icon: <Sparkles size={20} className="text-amber-600" />,
      description: 'Current initiatives',
      color: 'amber'
    }
  ];

  const quickActions = [
    {
      title: 'View Org Chart',
      description: 'Explore company structure',
      icon: <Building2 size={18} />,
      action: () => setActiveView('org-chart'),
      color: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
    },
    {
      title: 'Manage Payroll',
      description: 'Salary & compensation',
      icon: <CreditCard size={18} />,
      action: () => setActiveView('payroll'),
      color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
    },
    {
      title: 'Customize Theme',
      description: 'Personalize workspace',
      icon: <Palette size={18} />,
      action: () => setActiveView('themes'),
      color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
    },
    {
      title: 'Workspace Settings',
      description: 'Configure preferences',
      icon: <Settings size={18} />,
      action: () => setActiveView('settings'),
      color: 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center">
              <Building2 size={20} className="text-white" />
            </div>
            Workspace Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Manage your organizational structure and customize your workspace experience
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button
            variant={activeView === 'overview' ? 'default' : 'outline'}
            onClick={() => setActiveView('overview')}
            className="gap-2"
          >
            <Layers size={16} />
            Overview
          </Button>
          <Button
            variant={activeView === 'org-chart' ? 'default' : 'outline'}
            onClick={() => setActiveView('org-chart')}
            className="gap-2"
          >
            <Building2 size={16} />
            Org Chart
          </Button>
          <Button
            variant={activeView === 'payroll' ? 'default' : 'outline'}
            onClick={() => setActiveView('payroll')}
            className="gap-2"
          >
            <CreditCard size={16} />
            Payroll
          </Button>
          <Button
            variant={activeView === 'themes' ? 'default' : 'outline'}
            onClick={() => setActiveView('themes')}
            className="gap-2"
          >
            <Palette size={16} />
            Themes
          </Button>
          <Button
            variant={activeView === 'performance' ? 'default' : 'outline'}
            onClick={() => setActiveView('performance')}
            className="gap-2"
          >
            <Sparkles size={16} />
            Performance
          </Button>
          <Button
            variant={activeView === 'recruitment' ? 'default' : 'outline'}
            onClick={() => setActiveView('recruitment')}
            className="gap-2"
          >
            <Users2 size={16} />
            Recruitment
          </Button>



          <Button
            variant={activeView === 'reports' ? 'default' : 'outline'}
            onClick={() => setActiveView('reports')}
            className="gap-2"
          >
            <BarChart3 size={16} />
            Reports
          </Button>
          <Button
            variant={activeView === 'settings' ? 'default' : 'outline'}
            onClick={() => setActiveView('settings')}
            className="gap-2"
          >
            <Settings size={16} />
            Settings
          </Button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeView === 'overview' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workspaceStats.map((stat, index) => (
              <Card key={index} className="border-none shadow-sm bg-white dark:bg-slate-900 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn(
                      "p-3 rounded-xl",
                      stat.color.includes('indigo') ? 'bg-indigo-50 dark:bg-indigo-900/20' :
                        stat.color.includes('emerald') ? 'bg-emerald-50 dark:bg-emerald-900/20' :
                          stat.color.includes('purple') ? 'bg-purple-50 dark:bg-purple-900/20' :
                            'bg-amber-50 dark:bg-amber-900/20'
                    )}>
                      {stat.icon}
                    </div>
                    <span className={cn(
                      "text-xs font-bold px-2 py-1 rounded-lg",
                      stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' :
                        'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    )}>
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">{stat.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md transition-all group"
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform",
                      action.color
                    )}>
                      {action.icon}
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">{action.title}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{action.description}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">Recent Organizational Changes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Sarah Johnson', action: 'Promoted to Head of HR', time: '2 days ago', type: 'promotion' },
                    { name: 'New Engineering Team', action: 'Team created with 5 members', time: '1 week ago', type: 'addition' },
                    { name: 'Marketing Department', action: 'Restructured into 3 teams', time: '2 weeks ago', type: 'restructure' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          item.type === 'promotion' ? 'bg-green-500' :
                            item.type === 'addition' ? 'bg-blue-500' :
                              'bg-amber-500'
                        )}></div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">{item.action}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{item.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">Workspace Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { metric: 'Theme Usage', value: 'Dark Mode', percentage: 67 },
                    { metric: 'Org Chart Views', value: '234 this week', percentage: 89 },
                    { metric: 'Customization Level', value: 'Medium', percentage: 45 },
                  ].map((insight, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{insight.metric}</span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{insight.value}</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${insight.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Organization Chart Tab */}
      {activeView === 'org-chart' && (
        <OrganizationChart />
      )}

      {/* Themes Tab */}
      {activeView === 'themes' && (
        <WorkspaceThemeManager />
      )}

      {/* Payroll Tab */}
      {activeView === 'payroll' && (
        <Payroll />
      )}

      {/* Performance Tab */}
      {activeView === 'performance' && (
        <PerformanceEnhanced />
      )}

      {/* Recruitment Tab */}
      {activeView === 'recruitment' && (
        <RecruitmentEnhanced />
      )}





      {/* Reports Tab */}
      {activeView === 'reports' && (
        <Reports />
      )}

      {/* Settings Tab */}
      {activeView === 'settings' && (
        <WorkspaceSettingsManager />
      )}
    </div>
  );
};

export default WorkspacePage;