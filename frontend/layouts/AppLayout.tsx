
import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Bell, Search, ChevronDown, Moon, Sun, Settings } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { User } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '../components/ui/dropdown-menu';
import { cn } from '../lib/utils';

interface AppLayoutProps {
    currentUser: User | null;
    onLogout: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ currentUser, onLogout }) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const { theme, toggleTheme } = useTheme();

    const navigate = useNavigate();
    const location = useLocation();

    // Derive active tab from URL
    const currentPath = location.pathname.split('/')[1] || 'dashboard';

    const handleTabChange = (tabId: string) => {
        navigate(`/${tabId}`);
    };

    if (!currentUser) return null;

    return (
        <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 selection:bg-indigo-100 dark:selection:bg-indigo-900 selection:text-indigo-900 dark:selection:text-indigo-100 transition-colors duration-300">
            <Sidebar
                activeTab={currentPath}
                onTabChange={handleTabChange}
                collapsed={sidebarCollapsed}
                setCollapsed={setSidebarCollapsed}
                user={currentUser}
                onLogout={onLogout}
            />

            <main
                className={cn(
                    "flex-1 transition-all duration-300 ease-in-out",
                    sidebarCollapsed ? "ml-20" : "ml-64"
                )}
            >
                <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 py-4 flex items-center justify-between transition-colors duration-300">
                    <div className="flex items-center flex-1 max-w-xl">
                        <div className="relative w-full group">
                            <Search
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors cursor-pointer"
                                size={18}
                            />
                            <Input
                                type="text"
                                placeholder="Search for employees, tasks or files..."
                                className="w-full pl-12 h-10 bg-slate-50/50 dark:bg-slate-800/50 border-none rounded-2xl focus-visible:ring-indigo-500/10 dark:focus-visible:ring-indigo-500/20 focus:bg-white dark:focus:bg-slate-800 transition-all text-sm font-medium"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                            className="h-10 w-10 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all"
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </Button>

                        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>

                        <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl relative group">
                            <Bell size={20} />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 group-hover:scale-125 transition-transform"></span>
                        </Button>

                        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="flex items-center space-x-3 h-12 p-1.5 pl-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl transition-all group outline-none focus:ring-2 focus:ring-indigo-500/10"
                                >
                                    <div className="text-right hidden lg:block">
                                        <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200 leading-none">{currentUser.name}</p>
                                        <p className="text-[8px] text-indigo-500 font-bold uppercase mt-1 tracking-tighter">{currentUser.role}</p>
                                    </div>
                                    <Avatar className="w-9 h-9 rounded-xl overflow-hidden shadow-sm group-hover:ring-2 group-hover:ring-indigo-500 transition-all">
                                        <AvatarImage src={currentUser.avatar} className="object-cover" />
                                        <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">{currentUser.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <ChevronDown size={14} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 rounded-2xl border-slate-200 dark:border-slate-800 p-1 shadow-2xl">
                                <DropdownMenuLabel className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Details</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />
                                <DropdownMenuItem onClick={() => navigate('/settings')} className="rounded-xl gap-3 py-2.5 text-sm font-medium focus:bg-indigo-50 dark:focus:bg-indigo-900/20 focus:text-indigo-600 dark:focus:text-indigo-400 transition-colors">
                                    <Settings size={18} />
                                    Profile Settings
                                </DropdownMenuItem>
                                <DropdownMenuItem className="rounded-xl gap-3 py-2.5 text-sm font-medium focus:bg-indigo-50 dark:focus:bg-indigo-900/20 focus:text-indigo-600 dark:focus:text-indigo-400 transition-colors">
                                    <Bell size={18} />
                                    Notifications
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />
                                <DropdownMenuItem onClick={onLogout} className="rounded-xl gap-3 py-2.5 text-sm font-medium text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20 transition-colors">
                                    <Bell size={18} className="rotate-180" />
                                    Sign Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="mb-8 flex items-center gap-3">
                        <div className="w-1.5 h-8 bg-indigo-600 rounded-full shadow-lg shadow-indigo-200 dark:shadow-none"></div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 capitalize tracking-tight">
                            {currentPath.replace('-', ' ')}
                            <span className="ml-2 text-sm text-slate-400 font-medium">/ Workspace</span>
                        </h1>
                    </div>

                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AppLayout;
