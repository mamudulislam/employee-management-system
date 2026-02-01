import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend, ComposedChart
} from 'recharts';
import { Sparkles, ArrowUpRight, ArrowDownRight, Clock, AlertCircle, TrendingUp, Users } from 'lucide-react';
import { STAT_CARDS, ATTENDANCE_STATS, MOCK_LEAVES } from '../constants';
import { getHRInsights } from '../geminiService';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const EnhancedDashboard: React.FC = () => {
  const [aiInsight, setAiInsight] = useState<string>('Analyzing trends...');
  const [loadingInsight, setLoadingInsight] = useState(true);
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsight = async () => {
      const insight = await getHRInsights({
        headcount: 100234,
        turnover: 3.2,
        avgSalary: 84500,
        pendingLeaves: 45
      });
      setAiInsight(insight || '');
      setLoadingInsight(false);
    };
    fetchInsight();
  }, []);

  const pieData = [
    { name: 'Engineering', value: 45000 },
    { name: 'Sales', value: 25000 },
    { name: 'Marketing', value: 15000 },
    { name: 'Finance', value: 10000 },
    { name: 'Operations', value: 5234 },
  ];

  const departmentMetrics = [
    { dept: 'Engineering', headcount: 450, turnover: 2.3, salary: 95000 },
    { dept: 'Sales', headcount: 250, turnover: 4.1, salary: 75000 },
    { dept: 'Marketing', headcount: 150, turnover: 3.2, salary: 72000 },
  ];

  const handlePieClick = (entry: any) => {
    setSelectedDept(selectedDept === entry.name ? null : entry.name);
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Metrics Row with Hover Effects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((stat, i) => (
          <div
            key={i}
            onMouseEnter={() => setHoveredMetric(`stat-${i}`)}
            onMouseLeave={() => setHoveredMetric(null)}
            className={`bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4 transition-all duration-300 cursor-pointer group ${
              hoveredMetric === `stat-${i}` ? 'shadow-lg border-indigo-200 scale-105' : 'hover:shadow-md'
            }`}
          >
            <div className="p-3 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
              {stat.icon}
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              <div className="flex items-baseline space-x-2">
                <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
                <span
                  className={`text-xs font-bold transition-colors ${
                    stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            </div>
            <div className={`p-2 rounded-lg transition-opacity ${hoveredMetric === `stat-${i}` ? 'opacity-100' : 'opacity-0'}`}>
              <TrendingUp size={18} className="text-indigo-600" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Weekly Attendance Trend</h3>
            <select className="bg-slate-50 border-none text-sm rounded-lg p-1 px-2 focus:ring-2 focus:ring-indigo-500">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ATTENDANCE_STATS}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Bar dataKey="present" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Present %" />
                <Bar dataKey="late" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Late Arrivals" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          onClick={() => setSelectedDept(null)}
          className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 transition-all hover:shadow-md cursor-pointer"
        >
          <h3 className="text-lg font-bold text-slate-800 mb-6">Dept Headcount</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  onClick={(entry) => handlePieClick(entry)}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      opacity={selectedDept === null || selectedDept === entry.name ? 1 : 0.3}
                      style={{ cursor: 'pointer', transition: 'opacity 0.3s' }}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {pieData.map((d, i) => (
              <div
                key={i}
                onClick={() => handlePieClick(d)}
                className={`flex items-center justify-between text-xs p-2 rounded-lg cursor-pointer transition-all ${
                  selectedDept === d.name ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-slate-600 font-medium">{d.name}</span>
                </div>
                <span className="text-slate-800 font-bold">{((d.value / 100234) * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department Details (shown when selected) */}
      {selectedDept && (
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-200 shadow-sm animate-in slide-in-from-bottom-4">
          <h3 className="text-lg font-bold text-indigo-900 mb-4">{selectedDept} Department Details</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-indigo-100">
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-1">Headcount</p>
              <p className="text-2xl font-bold text-indigo-900">450</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-indigo-100">
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-1">Avg Salary</p>
              <p className="text-2xl font-bold text-indigo-900">$95K</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-indigo-100">
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-1">Turnover Rate</p>
              <p className="text-2xl font-bold text-indigo-900">2.3%</p>
            </div>
          </div>
        </div>
      )}

      {/* AI Insights & Pending Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-xl shadow-lg text-white transition-all hover:shadow-xl">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="text-amber-300" size={24} />
            <h3 className="text-lg font-bold">Gemini Smart Insights</h3>
          </div>
          {loadingInsight ? (
            <div className="animate-pulse flex space-y-4 flex-col">
              <div className="h-4 bg-white/20 rounded w-3/4"></div>
              <div className="h-4 bg-white/20 rounded w-1/2"></div>
              <div className="h-4 bg-white/20 rounded w-5/6"></div>
            </div>
          ) : (
            <div className="text-indigo-50 text-sm space-y-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: aiInsight }} />
          )}
          <button className="mt-6 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs font-semibold transition-all">
            Generate Detailed Report
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center space-x-2">
            <Clock size={20} className="text-slate-400" />
            <span>Recent Leave Requests</span>
          </h3>
          <div className="divide-y divide-slate-50 max-h-96 overflow-y-auto">
            {MOCK_LEAVES.map((leave) => (
              <div
                key={leave.id}
                className="py-4 flex items-center justify-between hover:bg-slate-50 transition-colors rounded px-2"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm hover:bg-indigo-100 transition-colors">
                    {leave.employeeName[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{leave.employeeName}</p>
                    <p className="text-xs text-slate-500">{leave.type} • {leave.startDate} to {leave.endDate}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${
                      leave.status === 'Pending'
                        ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {leave.status}
                  </span>
                  {leave.status === 'Pending' && (
                    <button className="text-xs text-indigo-600 hover:text-indigo-800 font-bold transition-colors">
                      Approve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm text-slate-500 hover:text-indigo-600 hover:bg-slate-50 font-medium border border-slate-100 rounded-lg transition-all">
            View All Requests
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;
