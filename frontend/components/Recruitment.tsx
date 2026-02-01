
import React from 'react';
import { Briefcase, Users, UserPlus, Search, Filter, MoreVertical, Calendar } from 'lucide-react';

const Recruitment: React.FC = () => {
    const jobs = [
        { title: 'Senior React Developer', dept: 'Engineering', applications: 24, status: 'Open', posted: '2 days ago' },
        { title: 'Product Designer', dept: 'Design', applications: 15, status: 'Open', posted: '5 days ago' },
        { title: 'HR Manager', dept: 'HR & Operations', applications: 8, status: 'Closed', posted: '2 weeks ago' },
        { title: 'Marketing Specialist', dept: 'Marketing', applications: 12, status: 'Open', posted: '1 week ago' },
    ];

    const candidates = [
        { name: 'John Doe', job: 'Senior React Developer', stage: 'Technical Interview', rating: 4.5, date: 'Today, 2:00 PM' },
        { name: 'Jane Smith', job: 'Product Designer', stage: 'HR Round', rating: 4.2, date: 'Tomorrow, 10:00 AM' },
        { name: 'Mike Ross', job: 'Senior React Developer', stage: 'Shortlisted', rating: 3.8, date: 'Oct 28' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Recruitment & Onboarding</h1>
                <div className="flex space-x-3">
                    <button className="flex items-center space-x-2 bg-white text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors border border-slate-200 shadow-sm font-bold text-sm">
                        <Briefcase size={18} />
                        <span>Post New Job</span>
                    </button>
                    <button className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-bold text-sm">
                        <UserPlus size={18} />
                        <span>Add Candidate</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Active Jobs */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-800">Active Job Postings</h2>
                        <button className="text-indigo-600 text-sm font-bold hover:underline">View All</button>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {jobs.map((job, index) => (
                            <div key={index} className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-center">
                                <div>
                                    <h4 className="font-bold text-slate-800">{job.title}</h4>
                                    <div className="flex items-center space-x-3 mt-1">
                                        <span className="text-xs text-slate-500">{job.dept}</span>
                                        <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold uppercase">
                                            {job.applications} Apps
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${job.status === 'Open' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                        {job.status}
                                    </span>
                                    <p className="text-[10px] text-slate-400 mt-1">{job.posted}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming Interviews */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-800">Upcoming Interviews</h2>
                        <button className="text-indigo-600 text-sm font-bold hover:underline">Schedule</button>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {candidates.map((cand, index) => (
                            <div key={index} className="p-4 hover:bg-slate-50 transition-colors flex items-center space-x-4">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                                    {cand.name[0]}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-800">{cand.name}</h4>
                                    <p className="text-xs text-slate-500">{cand.job}</p>
                                    <p className="text-[10px] text-indigo-600 font-bold mt-1 inline-flex items-center">
                                        <Calendar size={10} className="mr-1" /> {cand.date}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-bold uppercase">
                                        {cand.stage}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Recruitment;
