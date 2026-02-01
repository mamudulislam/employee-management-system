
import React from 'react';
import { TrendingUp, Award, MessageSquare, Star, Target } from 'lucide-react';

const Performance: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Target size={20} className="text-indigo-600" />
              <span>Current Goals (Q2 2024)</span>
            </h3>
            <div className="space-y-6">
              {[
                { title: 'Reduce system latency by 20%', progress: 75, color: 'bg-indigo-500' },
                { title: 'Launch Enterprise Dashboard', progress: 100, color: 'bg-emerald-500' },
                { title: 'Improve team satisfaction score', progress: 40, color: 'bg-amber-500' },
              ].map((goal, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-slate-700">{goal.title}</span>
                    <span className="font-bold text-slate-900">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className={`${goal.color} h-full transition-all duration-1000`} style={{width: `${goal.progress}%`}}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <MessageSquare size={20} className="text-indigo-600" />
              <span>360 Degree Feedback</span>
            </h3>
            <div className="divide-y divide-slate-50">
              {[
                { name: 'Mike Ross', role: 'Team Lead', msg: 'Exceptional attention to detail on the recent deployment.', rating: 5 },
                { name: 'Harvey Specter', role: 'Project Manager', msg: 'Good coordination during the cross-functional meet.', rating: 4 },
              ].map((feedback, i) => (
                <div key={i} className="py-4 flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold">
                    {feedback.name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="text-sm font-bold text-slate-800">{feedback.name} <span className="text-[10px] text-slate-400 font-medium px-2 py-0.5 bg-slate-50 rounded ml-2 uppercase tracking-wide">{feedback.role}</span></h4>
                      <div className="flex text-amber-400">
                        {Array.from({length: 5}).map((_, idx) => <Star key={idx} size={12} fill={idx < feedback.rating ? 'currentColor' : 'none'} />)}
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 mt-1 italic">"{feedback.msg}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-white/20 rounded-xl">
                <Award size={24} />
              </div>
              <div>
                <p className="text-indigo-100 text-xs font-bold uppercase tracking-wider">Overall Rating</p>
                <h3 className="text-2xl font-bold">4.8 / 5.0</h3>
              </div>
            </div>
            <div className="bg-white/10 p-4 rounded-xl border border-white/10">
              <p className="text-xs text-indigo-100 italic">"Consistently exceeds expectations in code quality and collaborative problem solving."</p>
            </div>
            <button className="w-full mt-6 py-2 bg-white text-indigo-600 rounded-lg text-sm font-bold hover:bg-indigo-50 transition-all">
              Schedule Appraisal
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Competency Radar</h3>
            <div className="space-y-4">
              {[
                { label: 'Technical Skills', value: 92 },
                { label: 'Communication', value: 85 },
                { label: 'Leadership', value: 70 },
                { label: 'Adaptability', value: 95 },
              ].map((c, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">{c.label}</span>
                    <span className="font-bold text-slate-800">{c.value}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full">
                    <div className="bg-indigo-400 h-full rounded-full" style={{width: `${c.value}%`}}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Performance;
