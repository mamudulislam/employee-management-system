import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp, TrendingDown, Eye, EyeOff } from 'lucide-react';

interface AnalyticsData {
  label: string;
  value: number;
  change?: number;
  color?: string;
}

interface ChartDataPoint {
  name: string;
  [key: string]: string | number;
}

interface AdvancedAnalyticsProps {
  title: string;
  subtitle?: string;
  data: ChartDataPoint[];
  type: 'line' | 'bar' | 'pie';
  xAxisKey?: string;
  dataKeys: Array<{ key: string; color: string }>;
  height?: number;
}

const COLORS = [
  '#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#6366f1',
];

/**
 * Metric Card for displaying KPIs
 */
interface MetricCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  change,
  icon,
  trend,
}) => {
  const isPositive = trend === 'up' || (change && change >= 0);
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  const trendColor = isPositive ? 'text-emerald-600' : 'text-red-600';
  const bgColor = isPositive ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{label}</p>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-2">
            {value}
          </p>
        </div>
        {icon && <div className="text-indigo-600">{icon}</div>}
      </div>

      {change !== undefined && (
        <div className={`flex items-center gap-1 ${trendColor}`}>
          <TrendIcon size={16} />
          <span className="text-sm font-semibold">
            {Math.abs(change)}%
          </span>
          <span className="text-xs text-slate-600 dark:text-slate-400 ml-1">vs last month</span>
        </div>
      )}
    </div>
  );
};

/**
 * Advanced Analytics Chart Component
 */
export const AdvancedAnalyticsChart: React.FC<AdvancedAnalyticsProps> = ({
  title,
  subtitle,
  data,
  type,
  xAxisKey = 'name',
  dataKeys,
  height = 300,
}) => {
  const [visibleKeys, setVisibleKeys] = useState(new Set(dataKeys.map(d => d.key)));

  const toggleVisibility = (key: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(key)) {
      newVisible.delete(key);
    } else {
      newVisible.add(key);
    }
    setVisibleKeys(newVisible);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
          {subtitle && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Legend with toggle */}
      <div className="flex flex-wrap gap-3 mb-6">
        {dataKeys.map(({ key, color }) => (
          <button
            key={key}
            onClick={() => toggleVisibility(key)}
            className="flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div
              className={`w-3 h-3 rounded-full ${visibleKeys.has(key) ? 'opacity-100' : 'opacity-30'}`}
              style={{ backgroundColor: color }}
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">{key}</span>
            {!visibleKeys.has(key) && <EyeOff size={14} className="text-slate-400" />}
          </button>
        ))}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={height}>
        {type === 'line' && (
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
              className="dark:stroke-slate-700"
            />
            <XAxis dataKey={xAxisKey} stroke="#64748b" className="dark:stroke-slate-400" />
            <YAxis stroke="#64748b" className="dark:stroke-slate-400" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px',
                color: '#f1f5f9',
              }}
            />
            {dataKeys.map(({ key, color }) =>
              visibleKeys.has(key) ? (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={color}
                  strokeWidth={2}
                  dot={{ fill: color, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ) : null
            )}
          </LineChart>
        )}

        {type === 'bar' && (
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
              className="dark:stroke-slate-700"
            />
            <XAxis dataKey={xAxisKey} stroke="#64748b" className="dark:stroke-slate-400" />
            <YAxis stroke="#64748b" className="dark:stroke-slate-400" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px',
                color: '#f1f5f9',
              }}
            />
            <Legend />
            {dataKeys.map(({ key, color }) =>
              visibleKeys.has(key) ? (
                <Bar key={key} dataKey={key} fill={color} radius={[8, 8, 0, 0]} />
              ) : null
            )}
          </BarChart>
        )}

        {type === 'pie' && visibleKeys.size > 0 && (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px',
                color: '#f1f5f9',
              }}
            />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

/**
 * Date Range Selector for analytics
 */
interface DateRangeSelectorProps {
  onRangeChange: (start: Date, end: Date) => void;
  presets?: Array<{ label: string; days: number }>;
}

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  onRangeChange,
  presets = [
    { label: 'Last 7 days', days: 7 },
    { label: 'Last 30 days', days: 30 },
    { label: 'Last 3 months', days: 90 },
    { label: 'Last 6 months', days: 180 },
  ],
}) => {
  const [selectedDays, setSelectedDays] = useState(7);

  const handlePresetClick = (days: number) => {
    setSelectedDays(days);
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    onRangeChange(start, end);
  };

  return (
    <div className="flex flex-wrap gap-2 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-2">
        <Calendar size={18} className="text-slate-600 dark:text-slate-400" />
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Date Range:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {presets.map(({ label, days }) => (
          <button
            key={days}
            onClick={() => handlePresetClick(days)}
            className={`px-3 py-1 text-sm rounded-lg font-medium transition-colors ${
              selectedDays === days
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default {
  MetricCard,
  AdvancedAnalyticsChart,
  DateRangeSelector,
};
