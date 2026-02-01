import React from 'react';
import { Plus, MoreVertical, Calendar, Users, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MOCK_PROJECTS = [
    { id: 1, title: 'Website Redesign', status: 'In Progress', progress: 65, team: 4, deadline: '2024-08-01', color: 'bg-indigo-500' },
    { id: 2, title: 'Mobile App Launch', status: 'Planning', progress: 15, team: 8, deadline: '2024-09-15', color: 'bg-emerald-500' },
    { id: 3, title: 'Q3 Marketing Campaign', status: 'In Review', progress: 90, team: 3, deadline: '2024-07-20', color: 'bg-amber-500' },
    { id: 4, title: 'Internal CRM Updates', status: 'In Progress', progress: 45, team: 2, deadline: '2024-08-30', color: 'bg-rose-500' },
    { id: 5, title: 'Server Migration', status: 'Blocked', progress: 30, team: 5, deadline: '2024-07-15', color: 'bg-red-500' },
    { id: 6, title: 'AI Integration', status: 'Planning', progress: 0, team: 6, deadline: '2024-10-01', color: 'bg-violet-500' },
];

const ProjectList: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div>
            {/* Actions Bar */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex space-x-2">
                    <span className="px-3 py-1 text-sm font-semibold rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">All Projects</span>
                    <span className="px-3 py-1 text-sm font-semibold rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">Active</span>
                    <span className="px-3 py-1 text-sm font-semibold rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">Completed</span>
                </div>
                <button className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-bold shadow-sm">
                    <Plus size={18} />
                    <span>New Project</span>
                </button>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_PROJECTS.map((project) => (
                    <div
                        key={project.id}
                        onClick={() => navigate(`/projects/${project.id}`)}
                        className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-6 hover:shadow-lg dark:hover:shadow-slate-900/50 hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-all cursor-pointer relative overflow-hidden"
                    >
                        <div className={`absolute top-0 left-0 w-1 h-full ${project.color}`}></div>

                        <div className="flex justify-between items-start mb-4">
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${project.status === 'In Progress' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' :
                                    project.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                        project.status === 'Blocked' ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' :
                                            'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                }`}>
                                {project.status}
                            </span>
                            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                <MoreVertical size={18} />
                            </button>
                        </div>

                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-indigo-600 transition-colors">{project.title}</h3>

                        <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400 mb-6">
                            <div className="flex items-center space-x-1">
                                <Calendar size={14} />
                                <span>{project.deadline}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Users size={14} />
                                <span>{project.team} members</span>
                            </div>
                        </div>

                        <div className="mt-auto">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Progress</span>
                                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{project.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${project.color} transition-all duration-1000`}
                                    style={{ width: `${project.progress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* New Project Card Mock */}
                <button className="flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all group">
                    <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                        <Plus className="text-indigo-500" size={24} />
                    </div>
                    <p className="font-bold text-slate-700 dark:text-slate-300">Create New Project</p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Start a new initiatives</p>
                </button>
            </div>
        </div>
    );
};

export default ProjectList;
