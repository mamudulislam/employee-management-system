
import React from 'react';
import { BookOpen, Award, Users, Play, Clock, CheckCircle } from 'lucide-react';

const Training: React.FC = () => {
    const courses = [
        { title: 'Security Awareness 2024', type: 'Mandatory', duration: '2 hours', completed: 85, progress: 92 },
        { title: 'Advanced React Patterns', type: 'Technical', duration: '8 hours', completed: 12, progress: 45 },
        { title: 'Leadership Essentials', type: 'Soft Skills', duration: '4 hours', completed: 5, progress: 100 },
        { title: 'Diversity & Inclusion', type: 'HR', duration: '1.5 hours', completed: 98, progress: 100 },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Training & Development</h1>
                <button className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-bold text-sm">
                    <BookOpen size={18} />
                    <span>New Course</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <p className="text-sm text-slate-500 font-medium text-center">Average Progress</p>
                    <div className="mt-4 flex flex-col items-center">
                        <div className="relative w-24 h-24">
                            <svg className="w-full h-full" viewBox="0 0 36 36">
                                <path
                                    className="stroke-slate-100 stroke-[3]"
                                    fill="none"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                                <path
                                    className="stroke-indigo-600 stroke-[3]"
                                    strokeDasharray="75, 100"
                                    fill="none"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xl font-bold text-slate-800">75%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-center">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Completed Courses</p>
                            <h3 className="text-2xl font-bold text-slate-800">248</h3>
                        </div>
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                            <Award size={24} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-xs text-green-600 font-bold">
                        <CheckCircle size={14} className="mr-1" /> 12 this month
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-center">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Active Learners</p>
                            <h3 className="text-2xl font-bold text-slate-800">42</h3>
                        </div>
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                            <Users size={24} />
                        </div>
                    </div>
                    <div className="mt-4 flex -space-x-2">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold">
                                {String.fromCharCode(64 + i)}
                            </div>
                        ))}
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                            +37
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800">Available Courses</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-y divide-slate-100 border-b border-slate-100">
                    {courses.map((course, index) => (
                        <div key={index} className="p-6 hover:bg-slate-50 transition-colors flex flex-col justify-between">
                            <div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${course.type === 'Mandatory' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                    {course.type}
                                </span>
                                <h4 className="font-bold text-slate-800 mt-2 line-clamp-2">{course.title}</h4>
                                <div className="flex items-center space-x-3 mt-3 text-xs text-slate-500">
                                    <div className="flex items-center">
                                        <Clock size={12} className="mr-1" /> {course.duration}
                                    </div>
                                    <div className="flex items-center">
                                        <Users size={12} className="mr-1" /> {course.completed}%
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6">
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${course.progress}%` }}></div>
                                </div>
                                <div className="flex justify-between items-center mt-3">
                                    <span className="text-[10px] font-bold text-slate-500">{course.progress}% Progress</span>
                                    <button className="flex items-center text-indigo-600 font-bold text-xs hover:underline">
                                        <Play size={12} className="mr-1" fill="currentColor" /> {course.progress === 100 ? 'Review' : 'Resume'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Training;
