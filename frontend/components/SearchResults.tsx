import React, { useState, useMemo } from 'react';
import { Search, Filter, Clock, Users, FileText, X } from 'lucide-react';
import { MOCK_EMPLOYEES } from '../constants';

const SearchResults: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [resultType, setResultType] = useState<'all' | 'employees' | 'documents' | 'history'>('all');

  const results = useMemo(() => {
    let filtered = [];

    if (resultType === 'all' || resultType === 'employees') {
      const employees = MOCK_EMPLOYEES.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5);
      
      if (searchTerm) {
        filtered = [...filtered, ...employees.map(e => ({ ...e, type: 'employee' }))];
      }
    }

    if (resultType === 'all' || resultType === 'documents') {
      const docs = [
        { id: 'doc-1', title: 'Employee Handbook 2024', type: 'document', date: '2024-01-15' },
        { id: 'doc-2', title: 'Leave Policy Update', type: 'document', date: '2024-01-10' },
        { id: 'doc-3', title: 'Q1 Performance Review', type: 'document', date: '2024-01-05' },
      ].filter(d => d.title.toLowerCase().includes(searchTerm.toLowerCase()));

      if (searchTerm) {
        filtered = [...filtered, ...docs];
      }
    }

    return filtered;
  }, [searchTerm, resultType]);

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev =>
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search employees, documents, announcements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all text-sm font-medium"
            autoFocus
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-2 flex-wrap">
        {['all', 'employees', 'documents', 'history'].map(filter => (
          <button
            key={filter}
            onClick={() => setResultType(filter as any)}
            className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
              resultType === filter
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Advanced Filters */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={18} className="text-indigo-600" />
          <h3 className="font-bold text-slate-800">Filters</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['Active', 'On Leave', 'Engineering', 'Sales', 'Marketing', 'HR'].map(f => (
            <button
              key={f}
              onClick={() => toggleFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
                selectedFilters.includes(f)
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {searchTerm ? (
          <>
            <p className="text-sm text-slate-600 font-medium">
              Found {results.length} result{results.length !== 1 ? 's' : ''} for "{searchTerm}"
            </p>

            {results.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-sm text-center">
                <Users className="mx-auto mb-4 text-slate-300" size={40} />
                <p className="text-slate-600 font-medium mb-2">No results found</p>
                <p className="text-slate-400 text-sm">Try adjusting your search terms or filters</p>
              </div>
            ) : (
              results.map((result) => {
                if ('email' in result && result.type === 'employee') {
                  return (
                    <div
                      key={result.id}
                      className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={result.avatar}
                          alt={result.name}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                            {result.name}
                          </h4>
                          <p className="text-[10px] text-slate-500 font-medium">
                            {result.id} • {result.role} • {result.department}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">{result.email}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase ${
                            result.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {result.status}
                        </span>
                      </div>
                    </div>
                  );
                } else if ('title' in result) {
                  return (
                    <div
                      key={result.id}
                      className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                          <FileText size={20} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                            {result.title}
                          </h4>
                          <div className="flex items-center gap-4 mt-1 text-xs text-slate-500 font-medium">
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {result.date}
                            </span>
                            <span className="px-2 py-0.5 bg-slate-100 rounded">Document</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              })
            )}
          </>
        ) : (
          <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-sm text-center">
            <Search className="mx-auto mb-4 text-slate-300" size={40} />
            <p className="text-slate-600 font-medium mb-2">Start searching</p>
            <p className="text-slate-400 text-sm">
              Search for employees by name, ID, or email. Find documents and recent activities.
            </p>
          </div>
        )}
      </div>

      {/* Recent Searches */}
      {!searchTerm && (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Clock size={18} className="text-slate-400" />
            Recent Searches
          </h3>
          <div className="flex flex-wrap gap-2">
            {['Sarah Johnson', 'Q1 Report', 'Leave Policy'].map(search => (
              <button
                key={search}
                onClick={() => setSearchTerm(search)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
