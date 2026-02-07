import React, { useState, useEffect } from 'react';
import { TrendingUp, Target, Award, Users, Calendar, Filter, Search, Download, Star, BarChart3, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { showToast } from '../utils/toast';

interface PerformanceRecord {
  _id: string;
  employee: {
    id: string;
    name: string;
    email: string;
    department: string;
    avatar?: string;
  };
  reviewer: {
    id: string;
    name: string;
    role: string;
  };
  reviewPeriod: {
    startDate: Date;
    endDate: Date;
  };
  kpis: Array<{
    name: string;
    target: string;
    achieved: string;
    rating: number; // 1-5
  }>;
  overallRating: number;
  feedback: string;
  goals: Array<{
    description: string;
    deadline: Date;
    status: 'Not Started' | 'In Progress' | 'Completed';
  }>;
  status: 'Draft' | 'Submitted' | 'Finalized';
  createdAt: Date;
}

interface PerformanceStats {
  averageRating: number;
  totalReviews: number;
  pendingReviews: number;
  completedGoals: number;
}

const Performance: React.FC = () => {
  const { theme } = useTheme();
  const [performanceRecords, setPerformanceRecords] = useState<PerformanceRecord[]>([]);
  const [stats, setStats] = useState<PerformanceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock data for development
  const mockPerformanceRecords: PerformanceRecord[] = [
    {
      _id: '1',
      employee: {
        id: 'EMP-001',
        name: 'Rajesh Kumar',
        email: 'rajesh@company.com',
        department: 'Engineering',
        avatar: 'https://picsum.photos/seed/emp1/40/40'
      },
      reviewer: {
        id: 'MGR-001',
        name: 'David Miller',
        role: 'Head of Engineering'
      },
      reviewPeriod: {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-03-31')
      },
      kpis: [
        { name: 'Code Quality', target: '95%', achieved: '92%', rating: 4 },
        { name: 'Project Delivery', target: 'On Time', achieved: 'On Time', rating: 5 },
        { name: 'Team Collaboration', target: '4.5', achieved: '4.2', rating: 4 },
        { name: 'Innovation', target: '3 Ideas', achieved: '5 Ideas', rating: 5 }
      ],
      overallRating: 4.5,
      feedback: 'Excellent performance with strong project delivery and innovative contributions. Areas for improvement include documentation quality and mentoring junior team members.',
      goals: [
        { description: 'Complete React certification', deadline: new Date('2024-06-30'), status: 'Completed' },
        { description: 'Mentor 2 junior developers', deadline: new Date('2024-09-30'), status: 'In Progress' },
        { description: 'Lead at least one major project', deadline: new Date('2024-12-31'), status: 'Not Started' }
      ],
      status: 'Finalized',
      createdAt: new Date('2024-04-01')
    },
    {
      _id: '2',
      employee: {
        id: 'EMP-002',
        name: 'Sarah Johnson',
        email: 'sarah@company.com',
        department: 'HR',
        avatar: 'https://picsum.photos/seed/emp2/40/40'
      },
      reviewer: {
        id: 'MGR-002',
        name: 'Lisa Wong',
        role: 'Head of HR'
      },
      reviewPeriod: {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-03-31')
      },
      kpis: [
        { name: 'Recruitment Quality', target: '90%', achieved: '88%', rating: 4 },
        { name: 'Employee Engagement', target: '85%', achieved: '82%', rating: 3 },
        { name: 'Process Improvement', target: '4 Initiatives', achieved: '3 Initiatives', rating: 4 },
        { name: 'Budget Management', target: 'Within Budget', achieved: 'Within Budget', rating: 5 }
      ],
      overallRating: 4.0,
      feedback: 'Strong performance in employee engagement and recruitment. Opportunity for improvement in process automation and metrics tracking.',
      goals: [
        { description: 'Implement new performance tracking system', deadline: new Date('2024-07-31'), status: 'In Progress' },
        { description: 'Reduce recruitment time by 20%', deadline: new Date('2024-12-31'), status: 'Not Started' }
      ],
      status: 'Finalized',
      createdAt: new Date('2024-04-01')
    }
  ];

  const mockStats: PerformanceStats = {
    averageRating: 4.2,
    totalReviews: 45,
    pendingReviews: 8,
    completedGoals: 67
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPerformanceRecords(mockPerformanceRecords);
      setStats(mockStats);
      setLoading(false);
    }, 1000);
  }, []);

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400';
    if (rating >= 3.5) return 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
    if (rating >= 2.5) return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400';
    return 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Finalized':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400';
      case 'Submitted':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Draft':
        return 'bg-slate-50 text-slate-700 dark:bg-slate-900/20 dark:text-slate-400';
      default:
        return 'bg-slate-50 text-slate-700 dark:bg-slate-900/20 dark:text-slate-400';
    }
  };

  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400';
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Not Started':
        return 'bg-slate-50 text-slate-700 dark:bg-slate-900/20 dark:text-slate-400';
      default:
        return 'bg-slate-50 text-slate-700 dark:bg-slate-900/20 dark:text-slate-400';
    }
  };

  const filteredRecords = performanceRecords.filter(record => {
    const matchesSearch = record.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.employee.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
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
              <TrendingUp size={20} className="text-white" />
            </div>
            Performance Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Track employee performance, reviews, and development goals
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => showToast.info('Exporting performance reports...')}>
            <Download size={16} className="mr-2" />
            Export Reports
          </Button>
          <Button onClick={() => showToast.info('Opening performance review form...')}>
            <Target size={16} className="mr-2" />
            New Review
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reviews">Performance Reviews</TabsTrigger>
          <TabsTrigger value="goals">Goals & Development</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Grid */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-none shadow-sm bg-white dark:bg-slate-900 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20">
                      <Star size={20} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span className="text-xs font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 px-2 py-1 rounded-lg">
                      +0.3 from last quarter
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.averageRating}</h3>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">Average Rating</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm bg-white dark:bg-slate-900 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
                      <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalReviews}</h3>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">Total Reviews</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm bg-white dark:bg-slate-900 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20">
                      <Clock size={20} className="text-amber-600 dark:text-amber-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.pendingReviews}</h3>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">Pending Reviews</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm bg-white dark:bg-slate-900 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20">
                      <Target size={20} className="text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.completedGoals}%</h3>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">Goals Completed</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Top Performers */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white">Top Performers This Quarter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredRecords.slice(0, 3).map((record, index) => (
                  <div key={record._id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={record.employee.avatar} alt={record.employee.name} className="w-10 h-10 rounded-lg object-cover" />
                        <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${getRatingColor(record.overallRating)}`}>
                          {record.overallRating}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{record.employee.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{record.employee.department}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getRatingColor(record.overallRating)}>
                        {record.overallRating} / 5.0
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Reviews Tab */}
        <TabsContent value="reviews" className="space-y-6">
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
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full md:w-40 bg-slate-50 dark:bg-slate-800">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Submitted">Submitted</SelectItem>
                    <SelectItem value="Finalized">Finalized</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Reviews Table */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white">Performance Reviews</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className={`bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider`}>
                      <th className="px-6 py-4">Employee</th>
                      <th className="px-6 py-4">Review Period</th>
                      <th className="px-6 py-4">Reviewer</th>
                      <th className="px-6 py-4">Overall Rating</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {filteredRecords.map((record) => (
                      <tr key={record._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={record.employee.avatar} alt={record.employee.name} className="w-8 h-8 rounded-lg object-cover" />
                            <div>
                              <p className="text-sm font-semibold text-slate-900 dark:text-white">{record.employee.name}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{record.employee.department}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                          {new Date(record.reviewPeriod.startDate).toLocaleDateString()} - {new Date(record.reviewPeriod.endDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                          {record.reviewer.name}
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={getRatingColor(record.overallRating)}>
                            {record.overallRating} / 5.0
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={getStatusColor(record.status)}>
                            {record.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Button variant="ghost" size="sm" className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                            View Details
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

        {/* Goals Tab */}
        <TabsContent value="goals" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredRecords.map((record) => (
              <Card key={record._id} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <img src={record.employee.avatar} alt={record.employee.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <CardTitle className="text-slate-900 dark:text-white">{record.employee.name}</CardTitle>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{record.employee.department}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Development Goals</h4>
                      <div className="space-y-3">
                        {record.goals.map((goal, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-slate-900 dark:text-white">{goal.description}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Due: {new Date(goal.deadline).toLocaleDateString()}</p>
                            </div>
                            <Badge className={getGoalStatusColor(goal.status)}>
                              {goal.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                      <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Overall Rating</h4>
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                            <div
                              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(record.overallRating / 5) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-lg font-bold text-slate-900 dark:text-white">{record.overallRating}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Performance;