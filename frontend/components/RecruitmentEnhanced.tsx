import React, { useState, useEffect } from 'react';
import { UserPlus, Briefcase, Calendar, Search, Filter, Download, Eye, Mail, Phone, MapPin, Building, Users, Clock, CheckCircle, AlertCircle, XCircle, TrendingUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { showToast } from '../utils/toast';

interface JobPost {
  _id: string;
  title: string;
  department: string;
  description: string;
  requirements: string[];
  salaryRange: string;
  status: 'Open' | 'Closed' | 'Draft';
  createdAt: Date;
  applicationsCount?: number;
}

interface Candidate {
  _id: string;
  jobPost: {
    title: string;
    department: string;
  };
  name: string;
  email: string;
  phone: string;
  resumeUrl: string;
  status: 'Applied' | 'Shortlisted' | 'Interview' | 'Offered' | 'Hired' | 'Rejected';
  interviews: Array<{
    date: Date;
    type: 'Technical' | 'HR' | 'Management';
    feedback: string;
    rating: number;
  }>;
  appliedDate: Date;
  avatar?: string;
  experience?: string;
  location?: string;
}

interface RecruitmentStats {
  totalJobs: number;
  activeApplications: number;
  interviewsScheduled: number;
  positionsFilled: number;
  averageTimeToHire: number;
}

const Recruitment: React.FC = () => {
  const { theme } = useTheme();
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [stats, setStats] = useState<RecruitmentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
  const [showJobDialog, setShowJobDialog] = useState(false);

  // Mock data for development
  const mockJobPosts: JobPost[] = [
    {
      _id: '1',
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      description: 'We are looking for an experienced Frontend Developer to join our growing team. You will be responsible for building responsive web applications using React, TypeScript, and modern CSS frameworks.',
      requirements: ['5+ years React experience', 'Strong TypeScript skills', 'Experience with state management', 'UI/UX design sense'],
      salaryRange: '$80,000 - $120,000',
      status: 'Open',
      createdAt: new Date('2024-01-15'),
      applicationsCount: 45
    },
    {
      _id: '2',
      title: 'Product Manager',
      department: 'Product',
      description: 'Join our product team to drive product strategy and development. You will work closely with engineering, design, and business teams to deliver exceptional user experiences.',
      requirements: ['Product management experience', 'Technical background', 'Strong communication skills', 'Data-driven approach'],
      salaryRange: '$100,000 - $150,000',
      status: 'Open',
      createdAt: new Date('2024-01-10'),
      applicationsCount: 32
    },
    {
      _id: '3',
      title: 'UX Designer',
      department: 'Design',
      description: 'We are seeking a talented UX Designer to create intuitive and beautiful user interfaces. You will work on web and mobile applications.',
      requirements: ['3+ years UX experience', 'Portfolio of work', 'Figma proficiency', 'User research skills'],
      salaryRange: '$70,000 - $110,000',
      status: 'Open',
      createdAt: new Date('2024-01-08'),
      applicationsCount: 28
    }
  ];

  const mockCandidates: Candidate[] = [
    {
      _id: '1',
      jobPost: {
        title: 'Senior Frontend Developer',
        department: 'Engineering'
      },
      name: 'Alex Thompson',
      email: 'alex.thompson@email.com',
      phone: '+1 (555) 123-4567',
      resumeUrl: '/resumes/alex-thompson.pdf',
      status: 'Interview',
      experience: '5 years',
      location: 'San Francisco, CA',
      avatar: 'https://picsum.photos/seed/candidate1/40/40'
    },
    {
      _id: '2',
      jobPost: {
        title: 'Senior Frontend Developer',
        department: 'Engineering'
      },
      name: 'Sarah Chen',
      email: 'sarah.chen@email.com',
      phone: '+1 (555) 987-6543',
      resumeUrl: '/resumes/sarah-chen.pdf',
      status: 'Shortlisted',
      experience: '6 years',
      location: 'New York, NY',
      avatar: 'https://picsum.photos/seed/candidate2/40/40'
    },
    {
      _id: '3',
      jobPost: {
        title: 'Product Manager',
        department: 'Product'
      },
      name: 'Michael Rodriguez',
      email: 'michael.rodriguez@email.com',
      phone: '+1 (555) 456-7890',
      resumeUrl: '/resumes/michael-rodriguez.pdf',
      status: 'Offered',
      experience: '8 years',
      location: 'Austin, TX',
      avatar: 'https://picsum.photos/seed/candidate3/40/40'
    }
  ];

  const mockStats: RecruitmentStats = {
    totalJobs: 12,
    activeApplications: 156,
    interviewsScheduled: 23,
    positionsFilled: 8,
    averageTimeToHire: 28
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setJobPosts(mockJobPosts);
      setCandidates(mockCandidates);
      setStats(mockStats);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
      case 'Applied':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400';
      case 'Closed':
      case 'Rejected':
        return 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      case 'Shortlisted':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Interview':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400';
      case 'Offered':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
      case 'Hired':
        return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400';
      case 'Draft':
        return 'bg-slate-50 text-slate-700 dark:bg-slate-900/20 dark:text-slate-400';
      default:
        return 'bg-slate-50 text-slate-700 dark:bg-slate-900/20 dark:text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open':
      case 'Applied':
        return <CheckCircle size={14} />;
      case 'Closed':
      case 'Rejected':
        return <XCircle size={14} />;
      case 'Shortlisted':
        return <Briefcase size={14} />;
      case 'Interview':
        return <Calendar size={14} />;
      case 'Offered':
        return <TrendingUp size={14} />;
      case 'Hired':
        return <Users size={14} />;
      default:
        return <Clock size={14} />;
    }
  };

  const filteredJobs = jobPosts.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    const matchesDept = filterDepartment === 'all' || job.department === filterDepartment;
    return matchesSearch && matchesStatus && matchesDept;
  });

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.jobPost.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || candidate.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleScheduleInterview = (candidateId: string) => {
    showToast.success('Interview scheduled successfully!');
  };

  const handleUpdateCandidateStatus = (candidateId: string, newStatus: string) => {
    showToast.success(`Candidate status updated to ${newStatus}`);
  };

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
              <UserPlus size={20} className="text-white" />
            </div>
            Recruitment Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Manage job postings, candidates, and hiring process
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => showToast.info('Exporting recruitment data...')}>
            <Download size={16} className="mr-2" />
            Export Data
          </Button>
          <Button onClick={() => setShowJobDialog(true)}>
            <Briefcase size={16} className="mr-2" />
            Post Job
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="jobs">Job Postings</TabsTrigger>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Grid */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card className="border-none shadow-sm bg-white dark:bg-slate-900 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20">
                      <Briefcase size={20} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalJobs}</h3>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">Active Job Postings</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm bg-white dark:bg-slate-900 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
                      <Users size={20} className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.activeApplications}</h3>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">Total Applications</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm bg-white dark:bg-slate-900 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20">
                      <Calendar size={20} className="text-amber-600 dark:text-amber-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.interviewsScheduled}</h3>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">Interviews Scheduled</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm bg-white dark:bg-slate-900 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20">
                      <CheckCircle size={20} className="text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.positionsFilled}</h3>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">Positions Filled</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm bg-white dark:bg-slate-900 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                      <Clock size={20} className="text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats.averageTimeToHire}</h3>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">Avg. Days to Hire</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">Recent Job Postings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobPosts.slice(0, 3).map((job) => (
                    <div key={job._id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{job.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{job.department}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(job.status)}>
                          {job.status}
                        </Badge>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{job.applicationsCount} applications</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">Recent Candidates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {candidates.slice(0, 3).map((candidate) => (
                    <div key={candidate._id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <div className="flex items-center gap-3 flex-1">
                        <img src={candidate.avatar} alt={candidate.name} className="w-8 h-8 rounded-lg object-cover" />
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{candidate.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{candidate.jobPost.title}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(candidate.status)}>
                        {candidate.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Job Postings Tab */}
        <TabsContent value="jobs" className="space-y-6">
          {/* Filters */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input
                      placeholder="Search jobs..."
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
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                  <SelectTrigger className="w-full md:w-40 bg-slate-50 dark:bg-slate-800">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Jobs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <Card key={job._id} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-slate-900 dark:text-white mb-2">{job.title}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <Building size={14} />
                        <span>{job.department}</span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(job.status)}>
                      {job.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                    {job.description}
                  </p>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">Requirements:</p>
                      <div className="flex flex-wrap gap-1">
                        {job.requirements.slice(0, 3).map((req, index) => (
                          <span key={index} className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                            {req}
                          </span>
                        ))}
                        {job.requirements.length > 3 && (
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            +{job.requirements.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-700">
                      <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{job.salaryRange}</span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setSelectedJob(job)}>
                          <Eye size={14} className="mr-1" />
                          View
                        </Button>
                        <Button size="sm" onClick={() => showToast.info(`Opening ${job.title}...`)}>
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Candidates Tab */}
        <TabsContent value="candidates" className="space-y-6">
          {/* Filters */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input
                      placeholder="Search candidates..."
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
                    <SelectItem value="Applied">Applied</SelectItem>
                    <SelectItem value="Shortlisted">Shortlisted</SelectItem>
                    <SelectItem value="Interview">Interview</SelectItem>
                    <SelectItem value="Offered">Offered</SelectItem>
                    <SelectItem value="Hired">Hired</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Candidates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCandidates.map((candidate) => (
              <Card key={candidate._id} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <img src={candidate.avatar} alt={candidate.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1">
                      <CardTitle className="text-slate-900 dark:text-white">{candidate.name}</CardTitle>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{candidate.jobPost.title}</p>
                    </div>
                    <Badge className={getStatusColor(candidate.status)}>
                      {getStatusIcon(candidate.status)}
                      <span className="ml-1">{candidate.status}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Mail size={14} />
                      <span>{candidate.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Phone size={14} />
                      <span>{candidate.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <MapPin size={14} />
                      <span>{candidate.location}</span>
                    </div>
                    {candidate.experience && (
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        <span className="font-medium">Experience:</span> {candidate.experience}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                    <Button variant="outline" size="sm" onClick={() => showToast.info(`Opening ${candidate.name}'s resume...`)}>
                      <Eye size={14} className="mr-1" />
                      Resume
                    </Button>
                    {candidate.status === 'Shortlisted' && (
                      <Button size="sm" onClick={() => handleScheduleInterview(candidate._id)}>
                        <Calendar size={14} className="mr-1" />
                        Schedule Interview
                      </Button>
                    )}
                    {(candidate.status === 'Interview' || candidate.status === 'Applied') && (
                      <Select onValueChange={(value) => handleUpdateCandidateStatus(candidate._id, value)}>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Update Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Shortlisted">Shortlist</SelectItem>
                          <SelectItem value="Interview">Schedule Interview</SelectItem>
                          <SelectItem value="Rejected">Reject</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Job Posting Dialog */}
      <Dialog open={showJobDialog} onOpenChange={setShowJobDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Post New Job</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Job Title</label>
              <Input placeholder="Enter job title" className="bg-slate-50 dark:bg-slate-800" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Department</label>
              <Select>
                <SelectTrigger className="bg-slate-50 dark:bg-slate-800">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Description</label>
              <textarea
                placeholder="Enter job description"
                rows={4}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Salary Range</label>
              <Input placeholder="e.g. $80,000 - $120,000" className="bg-slate-50 dark:bg-slate-800" />
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowJobDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                showToast.success('Job posted successfully!');
                setShowJobDialog(false);
              }}>
                Post Job
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Recruitment;