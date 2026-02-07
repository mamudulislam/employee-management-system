import React, { useState } from 'react';
import { Globe, Mail, Bell, Lock, Eye, EyeOff, Save, Plus, Trash2, Moon, Sun, Shield, Download } from 'lucide-react';
import { User } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';

interface SettingsProps {
  currentUser: User;
  onLogout: () => void;
}

const Settings: React.FC<SettingsProps> = ({ currentUser, onLogout }) => {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    email: currentUser.email,
    phone: '+91-9876543210',
    timezone: 'IST (UTC+5:30)',
    notifications: {
      email: true,
      sms: true,
      push: false,
    },
    privacy: {
      profileVisibility: 'Public',
      emailVisible: true,
    },
  });

  const handleSave = () => {
    // Toast notification would go here
    console.log('Settings saved:', settings);
  };

return (
    <div className="space-y-6 max-w-4xl">
      {/* Header with Theme Toggle */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Settings</h1>
        <ThemeToggle />
      </div>
      
      {/* Profile Section */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6">Profile Information</h3>

        <div className="flex items-center gap-6 mb-8 p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
          <div className="relative group">
            <img
              src={currentUser.avatar}
              alt="Profile"
              className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white shadow-lg shadow-indigo-100"
            />
            <button className="absolute -bottom-2 -right-2 bg-white p-2 rounded-lg shadow-md border border-slate-100 text-indigo-600 hover:text-indigo-800 transition-colors hover:bg-indigo-50 active:scale-90">
              <Plus size={16} />
            </button>
          </div>

          <div className="flex-1">
            <h4 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{currentUser.name}</h4>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-lg uppercase tracking-wider">
                {currentUser.role}
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                {currentUser.department || 'Corporate'} Department
              </span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">Account ID: {currentUser.id}</p>
          </div>

          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700 transition-all shadow-sm">
            Edit Profile
          </button>
        </div>

        {/* Basic Info Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
            <input
              type="text"
              value={currentUser.name}
              className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Employee ID</label>
            <input
              type="text"
              value={currentUser.id}
              disabled
              className="w-full p-4 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl outline-none text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Phone Number</label>
            <input
              type="tel"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-sm"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Timezone</label>
            <select value={settings.timezone} onChange={(e) => setSettings({ ...settings, timezone: e.target.value })} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-sm">
              <option>IST (UTC+5:30)</option>
              <option>EST (UTC-5:00)</option>
              <option>PST (UTC-8:00)</option>
              <option>GMT (UTC+0:00)</option>
            </select>
          </div>
        </div>
      </div>


      {/* Appearance Section */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6">Appearance & Display</h3>

        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300">
              {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Dark Mode</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Easier on the eyes in low light</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className={`w-12 h-7 rounded-full relative transition-all ${isDarkMode ? 'bg-indigo-600' : 'bg-slate-300'}`}
          >
            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
          <Bell size={20} className="text-indigo-600" />
          Notification Preferences
        </h3>

        <div className="space-y-4">
          {[
            { label: 'Email Notifications', desc: 'Updates on payroll & leave status', key: 'email' },
            { label: 'SMS Alerts', desc: 'Critical alerts to your phone', key: 'sms' },
            { label: 'Push Notifications', desc: 'Real-time updates in browser', key: 'push' },
          ].map(({ label, desc, key }) => (
            <div key={key} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{label}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{desc}</p>
              </div>
              <button
                onClick={() => setSettings({
                  ...settings,
                  notifications: {
                    ...settings.notifications,
                    [key]: !settings.notifications[key as keyof typeof settings.notifications]
                  }
                })}
                className={`w-12 h-7 rounded-full relative transition-all ${settings.notifications[key as keyof typeof settings.notifications] ? 'bg-emerald-500' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${settings.notifications[key as keyof typeof settings.notifications] ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={handleSave}
          className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
        >
          <Save size={18} />
          Save Changes
        </button>
        <button
          onClick={onLogout}
          className="flex-1 flex items-center justify-center gap-2 text-red-500 font-bold bg-red-50 hover:bg-red-100 px-6 py-4 rounded-2xl transition-all active:scale-95"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Settings;
