import React, { useState } from 'react';
import { Save, RotateCcw, Download, Upload, Eye, EyeOff, Bell, Mail, Globe, Lock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { showToast } from '../utils/toast';

interface WorkspaceSettings {
  workspaceName: string;
  companyName: string;
  timezone: string;
  language: string;
  dateFormat: string;
  currency: string;
  notifications: {
    email: boolean;
    push: boolean;
    desktop: boolean;
  };
  privacy: {
    showProfilePhoto: boolean;
    showOnlineStatus: boolean;
    shareActivity: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    sessionTimeout: number;
    autoLock: boolean;
  };
}

const WorkspaceSettingsManager: React.FC = () => {
  const { theme, preset, primaryColor, resetTheme } = useTheme();
  const [settings, setSettings] = useState<WorkspaceSettings>({
    workspaceName: 'Enterprise EMS',
    companyName: 'TechCorp Solutions',
    timezone: 'Asia/Kolkata',
    language: 'English',
    dateFormat: 'DD/MM/YYYY',
    currency: 'INR',
    notifications: {
      email: true,
      push: true,
      desktop: false,
    },
    privacy: {
      showProfilePhoto: true,
      showOnlineStatus: true,
      shareActivity: false,
    },
    security: {
      twoFactorEnabled: false,
      sessionTimeout: 30,
      autoLock: true,
    },
  });

  const [showPasswords, setShowPasswords] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    showToast.success('Workspace settings saved successfully!');
    setSaving(false);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'workspace-settings.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          setSettings({ ...settings, ...imported });
          showToast.success('Settings imported successfully!');
        } catch (error) {
          showToast.error('Failed to import settings');
        }
      };
      reader.readAsText(file);
    }
  };

  const updateNotification = (type: keyof WorkspaceSettings['notifications'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [type]: value }
    }));
  };

  const updatePrivacy = (type: keyof WorkspaceSettings['privacy'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      privacy: { ...prev.privacy, [type]: value }
    }));
  };

  const updateSecurity = (field: keyof WorkspaceSettings['security'], value: any) => {
    setSettings(prev => ({
      ...prev,
      security: { ...prev.security, [field]: value }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Current Settings Overview */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
            <Globe size={20} className="text-indigo-600" />
            Workspace Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                Workspace Name
              </label>
              <Input
                value={settings.workspaceName}
                onChange={(e) => setSettings(prev => ({ ...prev, workspaceName: e.target.value }))}
                className="bg-slate-50 dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                Company Name
              </label>
              <Input
                value={settings.companyName}
                onChange={(e) => setSettings(prev => ({ ...prev, companyName: e.target.value }))}
                className="bg-slate-50 dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                Timezone
              </label>
              <select
                value={settings.timezone}
                onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (GMT+5:30)</option>
                <option value="America/New_York">America/New_York (GMT-5)</option>
                <option value="Europe/London">Europe/London (GMT+0)</option>
                <option value="Asia/Tokyo">Asia/Tokyo (GMT+9)</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                Currency
              </label>
              <select
                value={settings.currency}
                onChange={(e) => setSettings(prev => ({ ...prev, currency: e.target.value }))}
                className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              >
                <option value="INR">Indian Rupee (₹)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
                <option value="GBP">British Pound (£)</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
            <Bell size={20} className="text-indigo-600" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { key: 'email', label: 'Email Notifications', icon: <Mail size={16} />, description: 'Receive updates via email' },
              { key: 'push', label: 'Push Notifications', icon: <Bell size={16} />, description: 'Browser push notifications' },
              { key: 'desktop', label: 'Desktop Notifications', icon: <Eye size={16} />, description: 'Show desktop alerts' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{item.label}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => updateNotification(item.key as keyof WorkspaceSettings['notifications'], !settings.notifications[item.key as keyof WorkspaceSettings['notifications']])}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.notifications[item.key as keyof WorkspaceSettings['notifications']]
                      ? 'bg-indigo-600'
                      : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.notifications[item.key as keyof WorkspaceSettings['notifications']]
                      ? 'translate-x-6'
                      : 'translate-x-0.5'
                  }`}></div>
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
            <EyeOff size={20} className="text-indigo-600" />
            Privacy Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { key: 'showProfilePhoto', label: 'Show Profile Photos', description: 'Display profile pictures in team views' },
              { key: 'showOnlineStatus', label: 'Online Status', description: 'Let others see when you\'re active' },
              { key: 'shareActivity', label: 'Activity Sharing', description: 'Share your activity with team members' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{item.label}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
                </div>
                <button
                  onClick={() => updatePrivacy(item.key as keyof WorkspaceSettings['privacy'], !settings.privacy[item.key as keyof WorkspaceSettings['privacy']])}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.privacy[item.key as keyof WorkspaceSettings['privacy']]
                      ? 'bg-indigo-600'
                      : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.privacy[item.key as keyof WorkspaceSettings['privacy']]
                      ? 'translate-x-6'
                      : 'translate-x-0.5'
                  }`}></div>
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
            <Lock size={20} className="text-indigo-600" />
            Security Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Two-Factor Authentication</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Add an extra layer of security</p>
            </div>
            <Badge variant={settings.security.twoFactorEnabled ? 'default' : 'secondary'}>
              {settings.security.twoFactorEnabled ? 'Enabled' : 'Disabled'}
            </Badge>
          </div>
          
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
              Session Timeout (minutes)
            </label>
            <Input
              type="number"
              value={settings.security.sessionTimeout}
              onChange={(e) => updateSecurity('sessionTimeout', parseInt(e.target.value))}
              className="bg-slate-50 dark:bg-slate-800"
              min="5"
              max="120"
            />
          </div>
        </CardContent>
      </Card>

      {/* Theme Settings Overview */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white">Current Theme Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <p className="text-sm text-slate-500 dark:text-slate-400">Mode</p>
              <p className="font-bold text-slate-900 dark:text-white capitalize">{theme}</p>
            </div>
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <p className="text-sm text-slate-500 dark:text-slate-400">Preset</p>
              <p className="font-bold text-slate-900 dark:text-white capitalize">{preset.replace('-', ' ')}</p>
            </div>
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <p className="text-sm text-slate-500 dark:text-slate-400">Primary</p>
              <div className="flex items-center justify-center gap-2 mt-1">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: primaryColor }}></div>
                <p className="font-bold text-slate-900 dark:text-white text-xs">{primaryColor}</p>
              </div>
            </div>
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <p className="text-sm text-slate-500 dark:text-slate-400">Workspace</p>
              <p className="font-bold text-slate-900 dark:text-white">{settings.workspaceName}</p>
            </div>
          </div>
          
          <Button
            onClick={resetTheme}
            variant="outline"
            className="w-full"
          >
            <RotateCcw size={16} className="mr-2" />
            Reset Theme to Default
          </Button>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="flex-1"
        >
          <Save size={16} className="mr-2" />
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
        
        <Button variant="outline" onClick={handleExport}>
          <Download size={16} className="mr-2" />
          Export
        </Button>
        
        <div className="relative">
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Button variant="outline">
            <Upload size={16} className="mr-2" />
            Import
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceSettingsManager;