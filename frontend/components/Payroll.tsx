import React, { useState, useEffect } from 'react';
import { CreditCard, FileDown, TrendingUp, AlertCircle, CheckCircle2, Calendar, Filter, Search, Download, Eye, DollarSign, Users, Clock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import PayrollService, { PayrollRecord, PayrollStats, PayrollFilter } from '../services/payrollService';
import { showToast } from '../utils/toast';

const Payroll: React.FC = () => {
  const { theme } = useTheme();
  const [payrollStats, setPayrollStats] = useState<PayrollStats | null>(null);
  const [payrolls, setPayrolls] = useState<PayrollRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [filter, setFilter] = useState<PayrollFilter>({});
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for development
  const mockPayrolls = PayrollService.getMockPayrolls();
  const mockStats = PayrollService.getMockPayrollStats();

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPayrollStats(mockStats);
      setPayrolls(mockPayrolls);
      setLoading(false);
    }, 1000);
  }, []);

  const handleExport = async (format: 'pdf' | 'excel' = 'pdf') => {
    try {
      showToast.info(`Exporting payroll as ${format.toUpperCase()}...`);
      // Simulate export
      setTimeout(() => {
        showToast.success('Payroll exported successfully!');
      }, 1500);
    } catch (error) {
      showToast.error('Failed to export payroll');
    }
  };

  const handleGeneratePayslip = async (payrollId: string) => {
    try {
      showToast.info('Generating payslip...');
      // Simulate payslip generation
      setTimeout(() => {
        showToast.success('Payslip generated successfully!');
      }, 1000);
    } catch (error) {
      showToast.error('Failed to generate payslip');
    }
  };

  const handleRunPayroll = async () => {
    try {
      showToast.info('Running payroll process...');
      // Simulate payroll run
      setTimeout(() => {
        showToast.success('Payroll processed successfully!');
      }, 2000);
    } catch (error) {
      showToast.error('Failed to run payroll');
    }
  };

  const filteredPayrolls = payrolls.filter(payroll => {
    if (typeof payroll.employee === 'object' && payroll.employee?.name) {
      return payroll.employee.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400';
      case 'Processed':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400';
      default:
        return 'bg-slate-50 text-slate-700 dark:bg-slate-900/20 dark:text-slate-400';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-none shadow-sm bg-white dark:bg-slate-900">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center">
              <CreditCard size={20} className="text-white" />
            </div>
            Payroll Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Manage employee compensation and salary disbursements
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport('pdf')}>
            <FileDown size={16} className="mr-2" />
            Export PDF
          </Button>
          <Button onClick={handleRunPayroll}>
            <DollarSign size={16} className="mr-2" />
            Run Payroll
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payroll">Payroll Details</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {payrollStats && [
              {
                title: 'Next Payroll Cycle',
                value: payrollStats.nextPayrollDate,
                change: `Processing in 12 days`,
                icon: <Calendar size={20} className="text-indigo-600" />,
                color: 'bg-indigo-50 dark:bg-indigo-900/20',
                changeColor: 'text-amber-600 dark:text-amber-400'
              },
              {
                title: 'Total Monthly Payout',
                value: `$${(payrollStats.totalPayout / 1000000).toFixed(1)}M`,
                change: `+${payrollStats.lastMonthGrowth}% from last month`,
                icon: <DollarSign size={20} className="text-emerald-600" />,
                color: 'bg-emerald-50 dark:bg-emerald-900/20',
                changeColor: 'text-emerald-600 dark:text-emerald-400'
              },
              {
                title: 'Pending Approvals',
                value: payrollStats.pendingApprovals.toString(),
                change: 'Action required',
                icon: <AlertCircle size={20} className="text-amber-600" />,
                color: 'bg-amber-50 dark:bg-amber-900/20',
                changeColor: 'text-amber-600 dark:text-amber-400'
              },
              {
                title: 'Total Employees',
                value: payrollStats.totalEmployees.toString(),
                change: 'Active workforce',
                icon: <Users size={20} className="text-purple-600" />,
                color: 'bg-purple-50 dark:bg-purple-900/20',
                changeColor: 'text-slate-500 dark:text-slate-400'
              },
            ].map((stat, index) => (
              <Card key={index} className="border-none shadow-sm bg-white dark:bg-slate-900 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.color}`}>
                      {stat.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
                  <p className={`text-sm font-medium ${stat.changeColor} mt-2`}>{stat.change}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{stat.title}</p>
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
                <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => handleExport('excel')}>
                  <Download size={20} />
                  <span>Export Excel</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => setActiveTab('payroll')}>
                  <Eye size={20} />
                  <span>View Details</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Clock size={20} />
                  <span>Schedule Reports</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payroll Details Tab */}
        <TabsContent value="payroll" className="space-y-6">
          {/* Filters */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input
                      placeholder="Search employees..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                </div>
                <Select value={filter.status || 'all'} onValueChange={(value) => setFilter(prev => ({ ...prev, status: value === 'all' ? undefined : value }))}>
                  <SelectTrigger className="w-full md:w-40 bg-slate-50 dark:bg-slate-800">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Processed">Processed</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filter.month?.toString() || 'all'} onValueChange={(value) => setFilter(prev => ({ ...prev, month: value === 'all' ? undefined : parseInt(value) }))}>
                  <SelectTrigger className="w-full md:w-40 bg-slate-50 dark:bg-slate-800">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Months</SelectItem>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {new Date(0, i).toLocaleString('default', { month: 'long' })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Payroll Table */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-slate-900 dark:text-white">Salary Disbursements</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => handleExport('pdf')}>
                    <FileDown size={16} className="mr-2" />
                    Bulk Export PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className={`bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider`}>
                      <th className="px-6 py-4">Employee</th>
                      <th className="px-6 py-4">Base Salary</th>
                      <th className="px-6 py-4">Deductions</th>
                      <th className="px-6 py-4">Bonus</th>
                      <th className="px-6 py-4">Net Pay</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {filteredPayrolls.map((payroll) => (
                      <tr key={payroll._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-600 dark:text-slate-300">
                              {typeof payroll.employee === 'object' && payroll.employee?.name ? payroll.employee.name[0] : 'E'}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                {typeof payroll.employee === 'object' && payroll.employee?.name || 'Unknown Employee'}
                              </p>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                {typeof payroll.employee === 'object' && payroll.employee?.department || 'No Department'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                          ${payroll.basicSalary.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-red-500 dark:text-red-400">
                          -${(payroll.deductions.tax + payroll.deductions.socialSecurity + payroll.deductions.insurance).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-emerald-600 dark:text-emerald-400">
                          +${payroll.bonus.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">
                          ${payroll.netSalary.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={getStatusColor(payroll.status)}>
                            {payroll.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleGeneratePayslip(payroll._id!)}
                            className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                          >
                            <Eye size={16} className="mr-1" />
                            View Slip
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">Monthly Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-slate-500 dark:text-slate-400">
                  <TrendingUp size={48} />
                  <span className="ml-2">Chart placeholder</span>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">Department Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { dept: 'Engineering', amount: '$3.2M', percentage: 38 },
                    { dept: 'HR & Admin', amount: '$1.8M', percentage: 21 },
                    { dept: 'Sales', amount: '$2.1M', percentage: 25 },
                    { dept: 'Other', amount: '$1.3M', percentage: 16 },
                  ].map((item) => (
                    <div key={item.dept} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.dept}</span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{item.amount}</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Payroll;