
import React from 'react';
import { BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon, Download, Share2 } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import AdvancedFiltering from './AdvancedFiltering';

const data = [
  { month: 'Jan', headcount: 95000, revenue: 400 },
  { month: 'Feb', headcount: 96200, revenue: 420 },
  { month: 'Mar', headcount: 97500, revenue: 450 },
  { month: 'Apr', headcount: 98100, revenue: 480 },
  { month: 'May', headcount: 99400, revenue: 510 },
  { month: 'Jun', headcount: 100234, revenue: 540 },
];

const Reports: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Advanced Analytics</h2>
          <p className="text-sm text-slate-500">In-depth insights into enterprise workforce metrics.</p>
        </div>
        <div className="flex gap-2">
          <AdvancedFiltering />
          <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500">
            <Share2 size={18} />
          </button>
          <button className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-indigo-700">
            <Download size={18} />
            <span>Export full report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <LineChartIcon size={20} className="text-indigo-500" />
            <span>Growth & Scalability Trend</span>
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorHead" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Area type="monotone" dataKey="headcount" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorHead)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <BarChart3 size={20} className="text-emerald-500" />
            <span>Turnover vs Hiring Rate</span>
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Legend />
                <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} name="Hiring Velocity" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
