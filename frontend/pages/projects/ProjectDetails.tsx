import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Layout, List, Calendar as CalendarIcon, Users, Settings, Paperclip, MoreHorizontal, CheckCircle2 } from 'lucide-react';

const ProjectDetails: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div className="space-y-6">
            {/* Breadcrumb / Header */}
            <div className="flex flex-col gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
                <button
                    onClick={() => navigate('/projects')}
                    className="flex items-center text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 w-fit transition-colors"
                >
                    <ArrowLeft size={16} className="mr-1" />
                    Back to Projects
                </button>

                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Website Redesign</h1>
                        <p className="text-slate-500 dark:text-slate-400">Revamping the corporate website with new branding and features.</p>
                    </div>

                    <div className="flex items-center -space-x-2">
                        {[1, 2, 3, 4].map(i => (
                            <img key={i} src={`https://picsum.photos/seed/${i}/40/40`} className="w-9 h-9 rounded-full border-2 border-white dark:border-slate-900" alt="Member" />
                        ))}
                        <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-900 flex items-center justify-center text-xs font-bold text-slate-500">
                            +3
                        </div>
                    </div>
                </div>

                {/* Nested Navigation */}
                <div className="flex items-center gap-1 mt-2">
                    {[
                        { id: 'overview', label: 'Overview', icon: <Layout size={16} /> },
                        { id: 'board', label: 'Board', icon: <List size={16} /> },
                        { id: 'timeline', label: 'Timeline', icon: <CalendarIcon size={16} /> },
                        { id: 'team', label: 'Team', icon: <Users size={16} /> },
                        { id: 'files', label: 'Files', icon: <Paperclip size={16} /> },
                        { id: 'settings', label: 'Settings', icon: <Settings size={16} /> },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Nested Content Area */}
            <div className="min-h-[400px]">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-2 space-y-6">
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                                <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4">Project Description</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                                    The main objective of this project is to completely overhaul our current legacy website...
                                </p>
                            </div>

                            {/* Task List Mock */}
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                                <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4">Pending Tasks</h3>
                                <div className="space-y-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                                            <div className="mt-0.5 text-slate-400 group-hover:text-indigo-500 transition-colors">
                                                <CheckCircle2 size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Update homepage hero section components</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-slate-400">Due tomorrow</span>
                                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold">FRONTEND</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                                <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4">Project Stats</h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-slate-500">Progress</span>
                                            <span className="font-bold text-slate-700 dark:text-slate-300">65%</span>
                                        </div>
                                        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full w-[65%] bg-indigo-500"></div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <div>
                                            <p className="text-xs text-slate-500">Budget</p>
                                            <p className="font-semibold text-slate-800 dark:text-slate-200">$24,000</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500">Deadline</p>
                                            <p className="font-semibold text-slate-800 dark:text-slate-200">Aug 12</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Other tabs would go here, simplified for this demo */}
                {activeTab !== 'overview' && (
                    <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                        <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm mb-4">
                            {activeTab === 'board' ? <List className="text-slate-400" /> : <Settings className="text-slate-400" />}
                        </div>
                        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Work in Progress</h3>
                        <p className="text-slate-500 dark:text-slate-400">The {activeTab} view is currently under development.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectDetails;
