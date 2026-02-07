import React, { useState } from 'react';
import { Palette, Monitor, Moon, Sun, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface ThemePreset {
  name: string;
  mode: 'light' | 'dark' | 'auto';
  primary: string;
  description: string;
  preview: {
    bg: string;
    border: string;
    text: string;
    accent: string;
  };
}

const WorkspaceThemeManager: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [selectedPreset, setSelectedPreset] = useState<string>('default');

  const themePresets: ThemePreset[] = [
    {
      name: 'Default',
      mode: theme === 'dark' ? 'dark' : 'light',
      primary: 'indigo',
      description: 'Clean and professional',
      preview: {
        bg: theme === 'dark' ? 'bg-slate-900' : 'bg-white',
        border: theme === 'dark' ? 'border-slate-700' : 'border-slate-200',
        text: theme === 'dark' ? 'text-slate-100' : 'text-slate-900',
        accent: 'bg-indigo-600',
      },
    },
    {
      name: 'Midnight Blue',
      mode: 'dark',
      primary: 'blue',
      description: 'Deep blue for night owls',
      preview: {
        bg: 'bg-blue-950',
        border: 'border-blue-800',
        text: 'text-blue-100',
        accent: 'bg-blue-600',
      },
    },
    {
      name: 'Forest Green',
      mode: 'dark',
      primary: 'green',
      description: 'Natural and calming',
      preview: {
        bg: 'bg-green-950',
        border: 'border-green-800',
        text: 'text-green-100',
        accent: 'bg-green-600',
      },
    },
    {
      name: 'Warm Sunset',
      mode: 'light',
      primary: 'orange',
      description: 'Warm and energetic',
      preview: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        text: 'text-orange-900',
        accent: 'bg-orange-600',
      },
    },
    {
      name: 'Royal Purple',
      mode: 'dark',
      primary: 'purple',
      description: 'Elegant and creative',
      preview: {
        bg: 'bg-purple-950',
        border: 'border-purple-800',
        text: 'text-purple-100',
        accent: 'bg-purple-600',
      },
    },
    {
      name: 'Minimal Light',
      mode: 'light',
      primary: 'gray',
      description: 'Simple and focused',
      preview: {
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        text: 'text-gray-900',
        accent: 'bg-gray-700',
      },
    },
  ];

  const customColors = [
    { name: 'Indigo', value: 'indigo', hex: '#6366f1' },
    { name: 'Blue', value: 'blue', hex: '#3b82f6' },
    { name: 'Emerald', value: 'emerald', hex: '#10b981' },
    { name: 'Purple', value: 'purple', hex: '#a855f7' },
    { name: 'Rose', value: 'rose', hex: '#f43f5e' },
    { name: 'Amber', value: 'amber', hex: '#f59e0b' },
  ];

  const applyThemePreset = (preset: ThemePreset) => {
    setSelectedPreset(preset.name);
    
    // Apply theme mode
    if (preset.mode !== theme) {
      toggleTheme();
    }
    
    // Here you would apply the primary color changes
    // This would require updating CSS variables or Tailwind config
    console.log(`Applying theme preset: ${preset.name}`);
  };

  return (
    <div className="space-y-6">
      {/* Current Theme Display */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
            <Palette size={20} className="text-indigo-600" />
            Workspace Theme
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                {theme === 'dark' ? <Moon size={20} className="text-white" /> : <Sun size={20} className="text-white" />}
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Current Theme</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {theme === 'dark' ? 'Dark Mode' : 'Light Mode'} • Default
                </p>
              </div>
            </div>
            <Button
              onClick={toggleTheme}
              variant="outline"
              className="border-slate-200 dark:border-slate-700"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              <span className="ml-2">Switch</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Theme Presets */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
            <Monitor size={20} className="text-indigo-600" />
            Theme Presets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {themePresets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyThemePreset(preset)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedPreset === preset.name
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-slate-900 dark:text-white">{preset.name}</span>
                  {selectedPreset === preset.name && (
                    <Check size={16} className="text-indigo-600" />
                  )}
                </div>
                
                {/* Preview */}
                <div className={`p-3 rounded-lg border ${preset.preview.bg} ${preset.preview.border} mb-3`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-6 h-6 rounded ${preset.preview.accent}`}></div>
                    <div className={`h-2 flex-1 rounded ${preset.preview.accent} opacity-60`}></div>
                  </div>
                  <div className={`h-1 rounded ${preset.preview.text} opacity-20 mb-1`}></div>
                  <div className={`h-1 rounded ${preset.preview.text} opacity-20 w-3/4`}></div>
                </div>
                
                <p className={`text-xs ${preset.preview.text} opacity-70`}>{preset.description}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Colors */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white">Custom Colors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">
                Primary Color
              </label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {customColors.map((color) => (
                  <button
                    key={color.value}
                    className="p-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all"
                    title={color.name}
                  >
                    <div
                      className="w-full h-8 rounded mb-2"
                      style={{ backgroundColor: color.hex }}
                    ></div>
                    <span className="text-xs text-slate-600 dark:text-slate-400">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">
                Theme Mode
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => theme !== 'light' && toggleTheme()}
                  className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                    theme === 'light'
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <Sun size={20} className="mx-auto mb-2 text-amber-500" />
                  <span className="text-sm font-medium text-slate-900 dark:text-white">Light</span>
                </button>
                
                <button
                  onClick={() => theme !== 'dark' && toggleTheme()}
                  className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                    theme === 'dark'
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <Moon size={20} className="mx-auto mb-2 text-indigo-500" />
                  <span className="text-sm font-medium text-slate-900 dark:text-white">Dark</span>
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkspaceThemeManager;