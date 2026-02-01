
import React, { useState } from 'react';
import { LayoutGrid, Mail, ShieldCheck, Chrome, Briefcase, UserCircle } from 'lucide-react';
import { Role, User } from '../types';
import { AuthService } from '../services/authService';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { showToast } from '../utils/toast';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [method, setMethod] = useState<'sso' | 'email' | 'id'>('email');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>(Role.HR_ADMIN);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      const data = Object.fromEntries(formData.entries());

      let credentials: any = {};

      if (method === 'email') {
        credentials = { 
          email: data.email, 
          password: data.password 
        };
        if (isRegistering) {
          credentials = { 
            ...credentials, 
            name: data.name, 
            role: selectedRole 
          };
        }
      } else if (method === 'id') {
        showToast.info("ID Login not yet implemented fully on backend. Please use Email.");
        setLoading(false);
        return;
      }

      if (method === 'sso') {
        showToast.info("SSO not implemented yet.");
        setLoading(false);
        return;
      }

      if (isRegistering) {
        const response = await AuthService.register(credentials);
        showToast.success("Registration successful! Please login.");
        setIsRegistering(false);
      } else {
        const response = await AuthService.login(credentials);
        
        // Convert backend user format to frontend User type
        const user: User = {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          role: response.user.role as Role,
          avatar: '',
          department: response.user.department
        };
        
        showToast.success(`Welcome back, ${user.name}!`);
        onLogin(user);
      }
    } catch (err: any) {
      console.error(err);
      showToast.error(err.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-300">
      <Card className="max-w-md w-full overflow-hidden border-none shadow-2xl rounded-3xl">
        <div className="p-10 text-center bg-gradient-to-br from-indigo-600 to-violet-700 text-white relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <LayoutGrid size={120} />
          </div>
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-xl border border-white/20">
            <ShieldCheck size={32} />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-white mb-2">Enterprise EMS Portal</CardTitle>
          <CardDescription className="text-indigo-100/70 text-sm font-medium">India Regional HQ • Secure Access</CardDescription>
        </div>

        <CardContent className="p-8">
          <Tabs defaultValue="email" onValueChange={(v) => setMethod(v as any)} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
              <TabsTrigger value="email" className="rounded-lg text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-indigo-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-indigo-400">Email</TabsTrigger>
              <TabsTrigger value="sso" className="rounded-lg text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-indigo-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-indigo-400">SSO</TabsTrigger>
              <TabsTrigger value="id" className="rounded-lg text-xs font-bold data-[state=active]:bg-white data-[state=active]:text-indigo-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-indigo-400">ID</TabsTrigger>
            </TabsList>

            <div className="p-3 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-900/30 mb-6">
              <p className="text-[10px] font-bold text-indigo-400 dark:text-indigo-500 uppercase mb-2 tracking-widest">{isRegistering ? 'Register as' : 'Select Demo Persona'}</p>
              <div className="grid grid-cols-3 gap-2">
                {Object.values(Role).map(r => (
                  <Button
                    key={r}
                    type="button"
                    variant={selectedRole === r ? 'default' : 'outline'}
                    onClick={() => setSelectedRole(r)}
                    className={`h-9 text-[10px] font-bold transition-all ${selectedRole === r ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800'}`}
                  >
                    {r}
                  </Button>
                ))}
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <TabsContent value="email" className="space-y-3 mt-0">
                {isRegistering && (
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input name="name" placeholder="Full Name" required className="pl-10 h-12 bg-slate-50 dark:bg-slate-900 rounded-xl border-none focus-visible:ring-indigo-500/20" />
                  </div>
                )}
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input name="email" type="email" placeholder="Work Email" required className="pl-10 h-12 bg-slate-50 dark:bg-slate-900 rounded-xl border-none focus-visible:ring-indigo-500/20" />
                </div>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input name="password" type="password" placeholder="Password" required className="pl-10 h-12 bg-slate-50 dark:bg-slate-900 rounded-xl border-none focus-visible:ring-indigo-500/20" />
                </div>
              </TabsContent>

              <TabsContent value="sso" className="space-y-3 mt-0">
                <Button variant="outline" className="w-full h-12 rounded-xl flex items-center justify-center space-x-3 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                  <Chrome size={20} className="text-red-500" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Google Workspace</span>
                </Button>
                <Button variant="outline" className="w-full h-12 rounded-xl flex items-center justify-center space-x-3 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                  <UserCircle size={20} className="text-indigo-600" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Okta Identity</span>
                </Button>
              </TabsContent>

              <TabsContent value="id" className="mt-0">
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input name="employeeId" placeholder="Employee ID (e.g. EMP-101)" required className="pl-10 h-12 bg-slate-50 dark:bg-slate-900 rounded-xl border-none focus-visible:ring-indigo-500/20" />
                </div>
              </TabsContent>

              {method !== 'sso' && (
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all mt-4"
                >
                  {loading ? 'Processing...' : (isRegistering ? 'Create Account' : `Login as ${selectedRole}`)}
                </Button>
              )}
            </form>
          </Tabs>

          <CardFooter className="p-0 mt-8 flex justify-center">
            <p className="text-center text-xs text-slate-400">
              {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
              <button onClick={() => setIsRegistering(!isRegistering)} className="underline text-indigo-600 font-bold hover:text-indigo-700 transition-colors">
                {isRegistering ? 'Login' : 'Register'}
              </button>
            </p>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
