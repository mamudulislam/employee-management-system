import React, { useState } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface FilterOption {
  id: string;
  label: string;
  type: 'select' | 'date-range' | 'multi-select';
  options?: { value: string; label: string }[];
  value: string | string[] | { start: string; end: string };
}

const AdvancedFiltering: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [filters, setFilters] = useState<FilterOption[]>([
    {
      id: 'department',
      label: 'Department',
      type: 'multi-select',
      options: [
        { value: 'engineering', label: 'Engineering' },
        { value: 'sales', label: 'Sales' },
        { value: 'marketing', label: 'Marketing' },
        { value: 'hr', label: 'HR' },
      ],
      value: [],
    },
    {
      id: 'date-range',
      label: 'Date Range',
      type: 'date-range',
      value: { start: '2024-01-01', end: '2024-06-30' },
    },
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'onLeave', label: 'On Leave' },
      ],
      value: 'active',
    },
  ]);

  const activeFilterCount = filters.filter(f => {
    if (f.type === 'multi-select') return Array.isArray(f.value) && f.value.length > 0;
    if (f.type === 'select') return f.value !== '';
    return false;
  }).length;

  const updateFilter = (id: string, value: any) => {
    setFilters(filters.map(f => f.id === id ? { ...f, value } : f));
  };

  const clearFilters = () => {
    setFilters(filters.map(f => ({
      ...f,
      value: f.type === 'multi-select' ? [] : f.type === 'select' ? '' : { start: '', end: '' },
    })));
  };

  return (
    <div className="relative">
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
          isOpen
            ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 shadow-md'
            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-600'
        }`}
      >
        <Filter size={18} />
        <span className="font-bold text-sm">Filters</span>
        {activeFilterCount > 0 && (
          <span className="ml-1 px-2 py-0.5 bg-indigo-600 text-white text-xs font-bold rounded-full">
            {activeFilterCount}
          </span>
        )}
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Filter Dropdown Panel */}
      {isOpen && (
<div className="absolute top-full mt-2 right-0 w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 dark:text-slate-200">Advanced Filters</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-6">
              {filters.map((filter) => (
                <div key={filter.id} className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">
                    {filter.label}
                  </label>

                  {filter.type === 'select' && (
                    <select
                      value={filter.value as string}
                      onChange={(e) => updateFilter(filter.id, e.target.value)}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-sm"
                    >
                      <option value="">All</option>
                      {filter.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  )}

                  {filter.type === 'multi-select' && (
                    <div className="space-y-2">
                      {filter.options?.map((opt) => (
                        <label key={opt.value} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors">
                          <input
                            type="checkbox"
                            checked={(filter.value as string[]).includes(opt.value)}
                            onChange={(e) => {
                              const current = filter.value as string[];
                              if (e.target.checked) {
                                updateFilter(filter.id, [...current, opt.value]);
                              } else {
                                updateFilter(filter.id, current.filter(v => v !== opt.value));
                              }
                            }}
                            className="w-4 h-4 rounded cursor-pointer"
                          />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {filter.type === 'date-range' && (
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="date"
                        value={(filter.value as any).start}
                        onChange={(e) =>
                          updateFilter(filter.id, {
                            ...(filter.value as any),
                            start: e.target.value,
                          })
                        }
                        className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-sm"
                      />
                      <input
                        type="date"
                        value={(filter.value as any).end}
                        onChange={(e) =>
                          updateFilter(filter.id, {
                            ...(filter.value as any),
                            end: e.target.value,
                          })
                        }
                        className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-sm"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800 flex gap-3 border-t border-slate-100 dark:border-slate-700">
            <button
              onClick={() => {
                clearFilters();
                setIsOpen(false);
              }}
              className="flex-1 px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 px-4 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFiltering;
