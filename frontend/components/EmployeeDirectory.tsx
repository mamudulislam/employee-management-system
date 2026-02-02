
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Plus, MoreVertical, FileDown, Upload, Trash2, Mail, Users as UsersIcon } from 'lucide-react';
import { Employee, Department } from '../types';
import { EmployeeService } from '../services/employeeService';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '../lib/utils';
import CreateEmployeeModal from './CreateEmployeeModal';
import { showToast } from '../utils/toast';

const EmployeeDirectory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployees, setSelectedEmployees] = useState<Set<string>>(new Set());
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const itemsPerPage = 12;

  useEffect(() => {
    loadEmployees();
  }, [currentPage, searchTerm, selectedDept]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: any = {
        page: currentPage,
        limit: itemsPerPage,
      };
      
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      if (selectedDept !== 'All') {
        params.department = selectedDept;
      }
      
      const response = await EmployeeService.getEmployees(params);
      setEmployees(response.data);
      setTotalEmployees(response.total);
    } catch (err: any) {
      const errorMessage = err.error || 'Failed to load employees';
      setError(errorMessage);
      showToast.error(errorMessage);
      console.error('Load employees error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = useMemo(() => {
    return employees;
  }, [employees]);

  const paginatedEmployees = useMemo(() => {
    return filteredEmployees;
  }, [filteredEmployees]);

  const totalPages = Math.ceil((totalEmployees || 0) / itemsPerPage);

  const toggleEmployee = (empId: string) => {
    setSelectedEmployees(prev => {
      const newSet = new Set(prev);
      if (newSet.has(empId)) {
        newSet.delete(empId);
      } else {
        newSet.add(empId);
      }
      return newSet;
    });
  };

  const toggleAllOnPage = () => {
    const pageIds = paginatedEmployees.map(e => e.id);
    const allSelected = pageIds.every(id => selectedEmployees.has(id));

    setSelectedEmployees(prev => {
      const newSet = new Set(prev);
      if (allSelected) {
        pageIds.forEach(id => newSet.delete(id));
      } else {
        pageIds.forEach(id => newSet.add(id));
      }
      return newSet;
    });
  };

  const selectAllEmployees = async () => {
    try {
      const response = await EmployeeService.getEmployees({
        page: 1,
        limit: 10000
      });
      
      const allEmployeeIds = response.data.map(emp => emp.id);
      setSelectedEmployees(new Set(allEmployeeIds));
      showToast.success(`Selected ${allEmployeeIds.length} employees`);
    } catch (error) {
      console.error('Select all failed:', error);
      showToast.error('Failed to select all employees');
    }
  };

  const clearAllSelections = () => {
    setSelectedEmployees(new Set());
    showToast.success('Selection cleared');
  };

  const exportEmployees = async (selectedOnly = false) => {
    try {
      let dataToExport = employees;
      
      if (selectedOnly && selectedEmployees.size > 0) {
        dataToExport = employees.filter(emp => selectedEmployees.has(emp.id));
      }
      
      // Create CSV content
      const headers = ['ID', 'Name', 'Email', 'Department', 'Role', 'Join Date', 'Salary', 'Status'];
      const csvContent = [
        headers.join(','),
        ...dataToExport.map(emp => [
          emp.id,
          `"${emp.name}"`,
          emp.email,
          emp.department,
          emp.role,
          new Date(emp.joinDate).toLocaleDateString(),
          emp.salary,
          emp.status
        ].join(','))
      ].join('\n');
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `employees_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      showToast.success(`${selectedOnly ? 'Selected' : 'All'} employees exported successfully`);
    } catch (error) {
      console.error('Export failed:', error);
      showToast.error('Failed to export employees');
    }
  };

  return (
    <Card className="border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden">
      {/* Bulk Actions Bar */}
      {selectedEmployees.size > 0 && (
        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-100 dark:border-indigo-900/30 flex items-center justify-between animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-bold px-3">
              {selectedEmployees.size} selected
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-9 gap-2 rounded-xl bg-white dark:bg-slate-900"
              onClick={selectAllEmployees}
            >
              <UsersIcon size={16} />
              <span className="hidden sm:inline">Select All</span>
            </Button>
            <Button variant="outline" size="sm" className="h-9 gap-2 rounded-xl bg-white dark:bg-slate-900">
              <Mail size={16} />
              <span className="hidden sm:inline">Send Email</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-9 gap-2 rounded-xl bg-white dark:bg-slate-900"
              onClick={() => exportEmployees(true)}
            >
              <FileDown size={16} />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={clearAllSelections}
              className="h-9 gap-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border-none"
            >
              <Trash2 size={16} />
              <span className="hidden sm:inline">Clear</span>
            </Button>
          </div>
        </div>
      )}

      {/* Header / Toolbar */}
      <CardHeader className="p-6 pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <UsersIcon size={20} className="text-indigo-600" />
            </div>
            Employee Directory
          </CardTitle>
          <p className="text-sm text-slate-500 mt-1">
            {loading ? 'Loading...' : `Managing ${(totalEmployees || 0).toLocaleString()} total staff members`}
          </p>
          {error && (
            <p className="text-sm text-red-500 mt-1">{error}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800 border-none transition-all">
            <Upload size={18} className="text-slate-500" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800 border-none transition-all"
            onClick={() => exportEmployees(false)}
            title="Export all employees"
          >
            <FileDown size={18} className="text-slate-500" />
          </Button>
          <Button 
            className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white gap-2 rounded-xl shadow-lg shadow-indigo-100 dark:shadow-none px-6 transition-all"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={18} />
            <span>Add Employee</span>
          </Button>
        </div>
      </CardHeader>

      {/* Filters */}
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
            <Input
              placeholder="Search by name, ID or email..."
              className="w-full pl-10 h-11 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl focus-visible:ring-indigo-500/20"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              className="h-11 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl px-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-700 dark:text-slate-200"
              value={selectedDept}
              onChange={(e) => { setSelectedDept(e.target.value); setCurrentPage(1); }}
            >
              <option value="All">All Departments</option>
              {Object.values(Department).map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-none">
              <Filter size={18} className="text-slate-500" />
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
              <TableRow className="border-slate-100 dark:border-slate-800">
                <TableHead className="w-[50px] px-6">
                  <input
                    type="checkbox"
                    checked={paginatedEmployees.length > 0 && paginatedEmployees.every(e => selectedEmployees.has(e.id))}
                    onChange={toggleAllOnPage}
                    className="w-4 h-4 rounded-md border-slate-300 accent-indigo-600 cursor-pointer"
                  />
                </TableHead>
                <TableHead className="px-6 font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider h-14">Employee</TableHead>
                <TableHead className="px-6 font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider h-14">Department</TableHead>
                <TableHead className="px-6 font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider h-14">Role</TableHead>
                <TableHead className="px-6 font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider h-14">Join Date</TableHead>
                <TableHead className="px-6 font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider h-14">Salary</TableHead>
                <TableHead className="px-6 font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider h-14">Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // Loading skeleton
                Array.from({ length: itemsPerPage }).map((_, index) => (
                  <TableRow key={index} className="border-slate-100 dark:border-slate-800">
                    <TableCell className="px-6">
                      <div className="w-4 h-4 bg-slate-200 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell className="px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-slate-200 rounded-full animate-pulse"></div>
                        <div>
                          <div className="h-4 w-32 bg-slate-200 rounded animate-pulse mb-1"></div>
                          <div className="h-3 w-16 bg-slate-200 rounded animate-pulse"></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6">
                      <div className="h-6 w-20 bg-slate-200 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell className="px-6">
                      <div className="h-4 w-16 bg-slate-200 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell className="px-6">
                      <div className="h-4 w-20 bg-slate-200 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell className="px-6">
                      <div className="h-4 w-16 bg-slate-200 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell className="px-6">
                      <div className="h-6 w-16 bg-slate-200 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell className="px-6">
                      <div className="w-8 h-8 bg-slate-200 rounded animate-pulse"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                paginatedEmployees.map((emp) => (
                <TableRow
                  key={emp.id}
                  className={cn(
                    "border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors h-16",
                    selectedEmployees.has(emp.id) && "bg-indigo-50/30 dark:bg-indigo-900/10"
                  )}
                >
                  <TableCell className="px-6">
                    <input
                      type="checkbox"
                      checked={selectedEmployees.has(emp.id)}
                      onChange={() => toggleEmployee(emp.id)}
                      className="w-4 h-4 rounded-md border-slate-300 accent-indigo-600 cursor-pointer"
                    />
                  </TableCell>
                  <TableCell className="px-6">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={emp.avatar} alt={emp.name} />
                        <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">{emp.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{emp.name}</span>
                        <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-0.5">{emp.id}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6">
                    <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold border-none">
                      {emp.department}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{emp.role}</span>
                  </TableCell>
                  <TableCell className="px-6">
                    <span className="text-sm text-slate-500 font-medium">{new Date(emp.joinDate).toLocaleDateString()}</span>
                  </TableCell>
                  <TableCell className="px-6">
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">${emp.salary.toLocaleString()}</span>
                  </TableCell>
                  <TableCell className="px-6">
                    <Badge
                      variant="outline"
                      className={cn(
                        "px-2.5 py-0.5 rounded-lg border-none text-[10px] font-bold uppercase",
                        emp.status === 'Active' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
                      )}
                    >
                      {emp.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-200 dark:hover:bg-slate-700">
                          <MoreVertical size={16} className="text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-xl border-slate-200 dark:border-slate-800 px-1 py-1 shadow-xl">
                        <DropdownMenuLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-2">Quick Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />
                        <DropdownMenuItem className="rounded-lg gap-3 py-2 text-sm font-medium focus:bg-indigo-50 focus:text-indigo-600 dark:focus:bg-indigo-900/20 dark:focus:text-indigo-400">
                          <Mail size={16} />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-lg gap-3 py-2 text-sm font-medium focus:bg-indigo-50 focus:text-indigo-600 dark:focus:bg-indigo-900/20 dark:focus:text-indigo-400">
                          <FileDown size={16} />
                          Download Profile
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />
                        <DropdownMenuItem 
                          className="rounded-lg gap-3 py-2 text-sm font-medium text-red-600 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-900/20"
                          onClick={async () => {
                            if (confirm(`Are you sure you want to terminate ${emp.name}?`)) {
                              try {
                                await EmployeeService.deleteEmployee(emp.id);
                                await loadEmployees(); // Reload the data
                                showToast.success('Employee removed successfully');
                              } catch (err: any) {
                                showToast.error(err.error || 'Failed to remove employee');
                              }
                            }
                          }}
                        >
                          <Trash2 size={16} />
                          Terminate Contract
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-900 dark:text-slate-100">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-bold text-slate-900 dark:text-slate-100">{Math.min(currentPage * itemsPerPage, filteredEmployees.length || 0)}</span> of {filteredEmployees.length || 0} employees
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="h-9 gap-2 rounded-xl bg-slate-50 dark:bg-slate-800 border-none hover:bg-slate-100"
            >
              Previous
            </Button>
            <div className="flex items-center space-x-1">
              {[...Array(Math.min(5, Math.max(0, totalPages)))].map((_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? 'default' : 'ghost'}
                  onClick={() => setCurrentPage(i + 1)}
                  className={cn(
                    "w-9 h-9 p-0 rounded-xl text-sm font-bold transition-all",
                    currentPage === i + 1 ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  {i + 1}
                </Button>
              ))}
              {totalPages > 5 && <span className="text-slate-400 font-bold px-2">...</span>}
            </div>
            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="h-9 gap-2 rounded-xl bg-slate-50 dark:bg-slate-800 border-none hover:bg-slate-100"
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Create Employee Modal */}
      <CreateEmployeeModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          loadEmployees();
          setShowCreateModal(false);
        }}
      />
    </Card>
  );
};

export default EmployeeDirectory;
