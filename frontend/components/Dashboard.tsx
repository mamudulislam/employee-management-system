
import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Clock, LayoutDashboard, TrendingUp, Users, Calendar, X, Plus } from 'lucide-react';
import { STAT_CARDS, ATTENDANCE_STATS } from '../constants';
import { LeaveService, Leave, LeaveRequest } from '../services/leaveService';
import { AuthService } from '../services/authService';
import QuickActions from './QuickActions';
import { User } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../utils/toast';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

// Leave Request Dialog Component
const LeaveRequestDialog: React.FC<{ isOpen: boolean; onClose: () => void; user: User; onSuccess?: () => void }> = ({ isOpen, onClose, user, onSuccess }) => {
  const [leaveType, setLeaveType] = useState('Casual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [employeeName] = useState(user.name || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const currentUser = AuthService.getUser();
      const leaveRequest: LeaveRequest = {
        employee: currentUser.id || currentUser._id,
        employeeName,
        leaveType: leaveType as any,
        startDate,
        endDate,
        reason
      };
      const token = AuthService.getToken();
      await LeaveService.requestLeave(leaveRequest, token);
      showToast.success('Leave request submitted successfully!');
      if (onSuccess) onSuccess();
      onClose();
      // Reset form
      setLeaveType('Casual');
      setStartDate('');
      setEndDate('');
      setReason('');
    } catch (error: any) {
      showToast.error(error.message || 'Failed to submit leave request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar size={20} className="text-indigo-600" />
            Request Leave
          </DialogTitle>
          <DialogDescription>
            Fill in the details to request time off.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
              Employee Name
            </label>
            <Input
              type="text"
              placeholder="Enter employee name"
              value={employeeName}
              readOnly
              className="bg-slate-50 dark:bg-slate-800/50 cursor-not-allowed opacity-80"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
              Leave Type
            </label>
            <Select value={leaveType} onValueChange={setLeaveType} required>
              <SelectTrigger>
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sick">Sick Leave</SelectItem>
                <SelectItem value="Casual">Casual Leave</SelectItem>
                <SelectItem value="Paid">Paid Leave</SelectItem>
                <SelectItem value="Maternity">Maternity Leave</SelectItem>
                <SelectItem value="Paternity">Paternity Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                Start Date
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                End Date
              </label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
              Reason
            </label>
            <Input
              placeholder="Enter reason for leave"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const navigate = useNavigate();
  const [showLeaveRequest, setShowLeaveRequest] = useState(false);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loadingLeaves, setLoadingLeaves] = useState(true);

  const pieData = [
    { name: 'Engineering', value: 45000 },
    { name: 'Sales', value: 25000 },
    { name: 'Marketing', value: 15000 },
    { name: 'Finance', value: 10000 },
    { name: 'Operations', value: 5234 },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const fetchDashboardLeaves = async () => {
    try {
      const token = AuthService.getToken();
      const leavesData = await LeaveService.getAllLeaves(token);
      setLeaves(leavesData.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch leaves:', error);
    } finally {
      setLoadingLeaves(false);
    }
  };

  // Fetch leaves from backend
  useEffect(() => {
    fetchDashboardLeaves();
  }, []);

  return (
    <>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex justify-between items-end mb-2">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{getGreeting()}, {user.name} 👋</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Here's what's happening in your workspace today.</p>
          </div>
          <div className="text-right hidden sm:block">
            <Badge variant="outline" className="px-3 py-1 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold bg-white dark:bg-slate-900">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </Badge>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STAT_CARDS.filter(s => s.roles.includes(user.role)).map((stat, i) => (
            <Card key={i} className="border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden group hover:shadow-md transition-all">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">{stat.label}</p>
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</h3>
                    <Badge variant={stat.change.startsWith('+') ? 'default' : 'destructive'} className={`${stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'} border-none shadow-none text-[10px] font-bold`}>
                      {stat.change}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <QuickActions />

        {/* Main Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-none shadow-sm bg-white dark:bg-slate-900">
            <CardHeader className="flex flex-row items-center justify-between pb-8">
              <div>
                <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">Weekly Attendance Trend</CardTitle>
                <CardDescription className="text-xs text-slate-500">Overview of staff check-ins</CardDescription>
              </div>
              <Select defaultValue="7d">
                <SelectTrigger className="w-[130px] h-9 rounded-xl bg-slate-50 dark:bg-slate-800 border-none text-xs font-semibold focus:ring-2 focus:ring-indigo-500">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last Quarter</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ATTENDANCE_STATS}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} />
                    <Tooltip
                      cursor={{ fill: 'hsl(var(--muted)/0.4)' }}
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="present" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} barSize={24} name="Present %" />
                    <Bar dataKey="late" fill="#f59e0b" radius={[6, 6, 0, 0]} barSize={24} name="Late Arrivals" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">Department Distribution</CardTitle>
              <CardDescription className="text-xs text-slate-500">Staff count by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={8}
                      dataKey="value"
                      cornerRadius={4}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {pieData.map((d, i) => (
                  <div key={i} className="flex flex-col p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <span className="text-[10px] text-slate-500 font-bold uppercase truncate">{d.name}</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {((d.value / pieData.reduce((acc, curr) => acc + curr.value, 0)) * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Actions */}
        <div className="grid grid-cols-1 gap-6">
          <Card className="border-none shadow-sm bg-white dark:bg-slate-900 h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <Clock size={20} className="text-slate-500" />
                </div>
                <CardTitle className="text-lg text-slate-900 dark:text-slate-100">Leave Requests</CardTitle>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="text-xs text-indigo-600 font-bold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800"
                  onClick={() => setShowLeaveRequest(true)}
                >
                  <Plus size={16} className="mr-1" />
                  Request
                </Button>
                <Button variant="ghost" className="text-xs text-indigo-600 font-bold hover:bg-indigo-50 dark:hover:bg-indigo-900/20" onClick={() => navigate('/leaves')}>View All</Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1">
                {loadingLeaves ? (
                  <div className="space-y-3">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-1/2 animate-pulse"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-5/6 animate-pulse"></div>
                  </div>
                ) : leaves.length > 0 ? (
                  leaves.map((leave) => (
                    <div key={leave._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-800 dark:text-slate-200 shadow-sm border border-white dark:border-slate-700">
                          {typeof leave.employee === 'object' && leave.employee?.name ? leave.employee.name[0] :
                            typeof leave.employee === 'string' ? leave.employee.substring(leave.employee.length - 1).toUpperCase() : '?'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                {typeof leave.employee === 'object' && leave.employee?.name ? leave.employee.name :
                                  typeof leave.employee === 'string' ? `ID: ${leave.employee.substring(leave.employee.length - 6)}` : 'Unknown Employee'}
                              </p>
                              <p className="text-[10px] text-slate-500 font-semibold">{leave.leaveType} • {new Date(leave.startDate).toLocaleDateString()}</p>
                            </div>
                            {typeof leave.employee === 'object' && leave.employee?.department && (
                              <p className="text-[10px] text-slate-400">{leave.employee.department}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg border-none ${leave.status === 'Pending' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                          }`}>
                          {leave.status}
                        </Badge>
                        {leave.status === 'Pending' && (
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <TrendingUp size={16} className="text-indigo-600" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-sm text-slate-500 py-8">No leave requests found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <LeaveRequestDialog
        isOpen={showLeaveRequest}
        onClose={() => setShowLeaveRequest(false)}
        user={user}
        onSuccess={fetchDashboardLeaves}
      />
    </>
  );
};

export default Dashboard;
