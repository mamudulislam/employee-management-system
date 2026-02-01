
import React from 'react';
import { NAV_ITEMS } from '../constants';
import { ChevronLeft, ChevronRight, LayoutGrid, LogOut } from 'lucide-react';
import { Role, User } from '../types';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: string;
  onTabChange: (id: string) => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  user: User;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, collapsed, setCollapsed, user, onLogout }) => {
  const filteredItems = NAV_ITEMS.filter(item => item.roles.includes(user.role));

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 transition-all duration-300 ease-in-out flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="p-6 flex items-center justify-between mb-4 relative">
        <div className={cn(
          "flex items-center space-x-3 transition-all duration-300",
          collapsed ? "opacity-0 scale-50" : "opacity-100 scale-100"
        )}>
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none">
            <LayoutGrid className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Elite EMS</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 absolute -right-4 top-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 z-50"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </Button>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto py-2">
        {filteredItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-3 py-3 rounded-2xl transition-all group relative",
                isActive
                  ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-none font-semibold"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400"
              )}
            >
              <div className={cn(
                "transition-transform duration-200 group-hover:scale-110",
                isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
              )}>
                {item.icon}
              </div>
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              {collapsed && (
                <div className="absolute left-16 bg-slate-900 text-white text-[10px] py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap shadow-xl">
                  {item.label}
                </div>
              )}
              {isActive && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/40" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
        <Button
          variant="ghost"
          onClick={onLogout}
          className={cn(
            "w-full flex items-center justify-start space-x-3 h-12 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 transition-all",
            collapsed ? "px-0 justify-center" : "px-3"
          )}
        >
          <LogOut size={20} />
          {!collapsed && <span className="text-sm font-bold">Sign Out</span>}
        </Button>

        <div className={cn(
          "bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-3 flex items-center space-x-3 border border-slate-100 dark:border-slate-800 transition-all",
          collapsed ? "px-2 justify-center" : ""
        )}>
          <Avatar className="w-10 h-10 rounded-xl">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
              <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider mt-0.5">{user.role}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
