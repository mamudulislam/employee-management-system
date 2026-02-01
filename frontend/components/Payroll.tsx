
import React from 'react';
import { CreditCard, FileDown, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { MOCK_EMPLOYEES } from '../constants';

const Payroll: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium">Next Payroll Cycle</p>
          <h3 className="text-2xl font-bold text-slate-800">June 30, 2024</h3>
          <p className="text-xs text-indigo-600 font-bold mt-2">Processing in 12 days</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium">Total Monthly Payout</p>
          <h3 className="text-2xl font-bold text-slate-800">$8.4M</h3>
          <div className="flex items-center text-xs text-green-500 font-bold mt-2">
            <TrendingUp size={14} className="mr-1" /> 2.1% from last month
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 font-medium">Pending Approvals</p>
          <h3 className="text-2xl font-bold text-slate-800">14</h3>
          <p className="text-xs text-amber-500 font-bold mt-2 flex items-center">
            <AlertCircle size={14} className="mr-1" /> Action required
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">Salary Disbursements</h2>
          <div className="flex gap-2">
            <button className="flex items-center space-x-2 bg-slate-50 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors text-xs font-bold border border-slate-200">
              <FileDown size={14} />
              <span>Bulk Export PDF</span>
            </button>
            <button className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-xs font-bold shadow-sm">
              <span>Run Payroll</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Base Salary</th>
                <th className="px-6 py-4">Deductions</th>
                <th className="px-6 py-4">Bonus</th>
                <th className="px-6 py-4">Net Pay</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_EMPLOYEES.slice(0, 8).map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs">
                      {emp.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{emp.name}</p>
                      <p className="text-[10px] text-slate-500">{emp.id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">${(emp.salary/12).toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-red-500">-$420.00</td>
                  <td className="px-6 py-4 text-sm text-green-600">+$250.00</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-800">${(emp.salary/12 - 420 + 250).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center space-x-1 text-emerald-600 font-bold text-[10px] uppercase">
                      <CheckCircle2 size={12} />
                      <span>Paid</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-indigo-600 hover:text-indigo-800 font-bold text-xs underline">
                      View Slips
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payroll;
