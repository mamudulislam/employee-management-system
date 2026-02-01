
import React from 'react';
import { Monitor, Laptop, Smartphone, MousePointer, ShieldCheck, RefreshCw, Plus } from 'lucide-react';

const Assets: React.FC = () => {
    const assets = [
        { id: 'AST-001', name: 'MacBook Pro 16"', type: 'Laptop', user: 'Devin Thompson', status: 'Assigned', date: 'Jan 12, 2024' },
        { id: 'AST-082', name: 'Dell UltraSharp 27"', type: 'Monitor', user: 'Mila Kunis', status: 'Assigned', date: 'Mar 05, 2024' },
        { id: 'AST-104', name: 'iPhone 15 Pro', type: 'Smartphone', user: '-', status: 'Available', date: '-' },
        { id: 'AST-215', name: 'Logitech MX Master 3', type: 'Peripheral', user: 'Devin Thompson', status: 'Assigned', date: 'Jan 12, 2024' },
        { id: 'AST-042', name: 'MacBook Air M2', type: 'Laptop', user: '-', status: 'In Repair', date: '-' },
    ];

    const getIcon = (type: string) => {
        switch (type) {
            case 'Laptop': return Laptop;
            case 'Smartphone': return Smartphone;
            case 'Monitor': return Monitor;
            default: return MousePointer;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Asset Management</h1>
                <button className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-bold text-sm">
                    <Plus size={18} />
                    <span>Add Asset</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Assets', value: '1,240', icon: ShieldCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: 'Assigned', value: '1,102', icon: Smartphone, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'In Stock', value: '124', icon: RefreshCw, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Retired', value: '14', icon: RefreshCw, color: 'text-slate-600', bg: 'bg-slate-50' },
                ].map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className={`w-10 h-10 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center mb-3`}>
                            <stat.icon size={20} />
                        </div>
                        <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                        <h3 className="text-xl font-bold text-slate-800">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-800">Inventory Status</h2>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Search by ID or Name..."
                            className="px-4 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-none w-64"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                <th className="px-6 py-4">Asset ID</th>
                                <th className="px-6 py-4">Asset Name</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Assigned To</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {assets.map((asset) => {
                                const Icon = getIcon(asset.type);
                                return (
                                    <tr key={asset.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-xs font-bold text-indigo-600">{asset.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
                                                    <Icon size={16} />
                                                </div>
                                                <span className="text-sm font-semibold text-slate-800">{asset.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">{asset.type}</td>
                                        <td className="px-6 py-4 text-sm text-slate-800 font-medium">{asset.user}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${asset.status === 'Assigned' ? 'bg-emerald-50 text-emerald-600' :
                                                    asset.status === 'Available' ? 'bg-indigo-50 text-indigo-600' :
                                                        'bg-amber-50 text-amber-600'
                                                }`}>
                                                {asset.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">{asset.date}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-indigo-600 hover:underline font-bold text-xs">Manage</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Assets;
