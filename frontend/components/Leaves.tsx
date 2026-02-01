
import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, CheckCircle, XCircle, Plus, Filter, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { cn } from '../lib/utils';
import { LeaveService, Leave, LeaveRequest } from '../services/leaveService';
import { AuthService } from '../services/authService';
import { showToast } from '../utils/toast';

const Leaves: React.FC = () => {
    const [leaves, setLeaves] = useState<Leave[]>([]);
    const [loading, setLoading] = useState(true);
    const [showRequestDialog, setShowRequestDialog] = useState(false);
    const [formData, setFormData] = useState<LeaveRequest>({
        employee: '',
        employeeName: '',
        leaveType: 'Casual',
        startDate: '',
        endDate: '',
        reason: ''
    });
    
    // Calculate available balance based on approved leaves
    const calculateAvailableBalance = () => {
        const currentUser = AuthService.getUser();
        const currentUserId = currentUser.id || currentUser._id;
        
        if (!currentUserId) return '0 Days';
        
        // Get current year leave usage
        const currentYear = new Date().getFullYear();
        const userApprovedLeaves = leaves.filter(leave => {
            const employeeId = leave.employee?._id || leave.employee;
            return employeeId && 
                   employeeId.toString() === currentUserId.toString() && 
                   leave.status === 'Approved' && 
                   new Date(leave.startDate).getFullYear() === currentYear;
        });
        
        // Calculate total days used
        let totalDaysUsed = 0;
        userApprovedLeaves.forEach(leave => {
            totalDaysUsed += calculateDays(leave.startDate, leave.endDate);
        });
        
        // Standard annual leave entitlement (can be customized per company policy)
        const annualEntitlement = 21; // 21 days per year
        const availableDays = Math.max(0, annualEntitlement - totalDaysUsed);
        
        return `${availableDays} Days`;
    };

    const stats = [
        { label: 'Available Balance', value: calculateAvailableBalance(), icon: CalendarIcon, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
        { label: 'Pending Requests', value: leaves.filter(l => l.status === 'Pending').length.toString(), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
        { label: 'Approved', value: leaves.filter(l => l.status === 'Approved').length.toString(), icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
        { label: 'Rejected', value: leaves.filter(l => l.status === 'Rejected').length.toString(), icon: XCircle, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
    ];

    useEffect(() => {
        fetchLeaves();
    }, []);

    // Helper function to get employee display name
    const getEmployeeDisplayName = (leave: Leave) => {
        if (leave.employee?.name) {
            return leave.employee.name;
        }
        // Store the original employee ID before it gets overridden
        const employeeId = (leave as any)._doc?.employee || leave.employee;
        if (employeeId && typeof employeeId === 'string') {
            return `ID: ${employeeId.substring(employeeId.length - 6)}`;
        }
        if (employeeId && typeof employeeId === 'object' && employeeId._id) {
            return `ID: ${employeeId._id.toString().substring(employeeId._id.toString().length - 6)}`;
        }
        return 'Loading...';
    };

    const fetchLeaves = async () => {
        try {
            const token = AuthService.getToken();
            const leavesData = await LeaveService.getAllLeaves(token);
            console.log('Leaves data received:', leavesData);
        console.log('Sample leave structure:', leavesData[0]);
            setLeaves(leavesData);
        } catch (error) {
            console.error('Failed to fetch leaves:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLeaveRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = AuthService.getToken();
            const currentUser = AuthService.getUser();
            const leaveRequest = {
                ...formData,
                employee: currentUser.id || currentUser._id
            };
            await LeaveService.requestLeave(leaveRequest, token);
            showToast.success('Leave request submitted successfully!');
            setShowRequestDialog(false);
            setFormData({ employee: '', employeeName: '', leaveType: 'Casual', startDate: '', endDate: '', reason: '' });
            fetchLeaves(); // Refresh leaves list
        } catch (error: any) {
            showToast.error(error.message || 'Failed to submit leave request');
        }
    };

    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [leaveToCancel, setLeaveToCancel] = useState<string | null>(null);
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [leaveToReject, setLeaveToReject] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');

    const handleCancelLeave = (leaveId: string) => {
        setLeaveToCancel(leaveId);
        setShowCancelConfirm(true);
    };

    const confirmCancelLeave = async () => {
        if (!leaveToCancel) return;
        
        try {
            const token = AuthService.getToken();
            await LeaveService.updateLeaveStatus(leaveToCancel, 'Cancelled', undefined, token);
            showToast.success('Leave request cancelled successfully!');
            setShowCancelConfirm(false);
            setLeaveToCancel(null);
            fetchLeaves(); // Refresh leaves list
        } catch (error: any) {
            showToast.error(error.message || 'Failed to cancel leave request');
        }
    };

    const handleApproveLeave = async (leaveId: string) => {
        try {
            const token = AuthService.getToken();
            const currentUser = AuthService.getUser();
            await LeaveService.updateLeaveStatus(leaveId, 'Approved', 'Approved by manager', token);
            showToast.success('Leave request approved successfully!');
            fetchLeaves(); // Refresh leaves list
        } catch (error: any) {
            showToast.error(error.message || 'Failed to approve leave request');
        }
    };

    const handleRejectLeave = (leaveId: string) => {
        setLeaveToReject(leaveId);
        setShowRejectDialog(true);
        setRejectionReason('');
    };

    const confirmRejectLeave = async () => {
        if (!leaveToReject) return;
        
        try {
            const token = AuthService.getToken();
            await LeaveService.updateLeaveStatus(leaveToReject, 'Rejected', rejectionReason || 'Rejected by manager', token);
            showToast.success('Leave request rejected successfully!');
            setShowRejectDialog(false);
            setLeaveToReject(null);
            setRejectionReason('');
            fetchLeaves(); // Refresh leaves list
        } catch (error: any) {
            showToast.error(error.message || 'Failed to reject leave request');
        }
    };

    const calculateDays = (startDate: string, endDate: string) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays;
    };

    return (
        <>
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Leave Management</h1>
                    <p className="text-sm text-slate-500 mt-1">Track balances and request time off</p>
                </div>
                <Button 
                    className="h-11 bg-indigo-600 hover:bg-indigo-700 text-white gap-2 rounded-xl shadow-lg shadow-indigo-100 dark:shadow-none px-6 transition-all"
                    onClick={() => setShowRequestDialog(true)}
                >
                    <Plus size={18} />
                    <span>Request Leave</span>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index} className="border-none shadow-sm bg-white dark:bg-slate-900 group">
                        <CardContent className="p-6 flex items-center space-x-4">
                            <div className={cn("p-4 rounded-2xl transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{stat.value}</h3>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Leave History & Requests</CardTitle>
                        <CardDescription className="text-xs">Your recent activity and pending applications</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="border-t border-slate-100 dark:border-slate-800">
                        <Table>
                            <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                                <TableRow className="border-slate-100 dark:border-slate-800">
                                    <TableHead className="px-6 font-bold text-slate-500 text-xs uppercase tracking-wider h-14">Type</TableHead>
                                    <TableHead className="px-6 font-bold text-slate-500 text-xs uppercase tracking-wider h-14">Duration</TableHead>
                                    <TableHead className="px-6 font-bold text-slate-500 text-xs uppercase tracking-wider h-14 text-center">Days</TableHead>
                                    <TableHead className="px-6 font-bold text-slate-500 text-xs uppercase tracking-wider h-14">Status</TableHead>
                                    <TableHead className="px-6 font-bold text-slate-500 text-xs uppercase tracking-wider h-14">Reason</TableHead>
                                    <TableHead className="px-6 text-right h-14"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8">
                                            <div className="space-y-2">
                                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-3/4 mx-auto animate-pulse"></div>
                                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-1/2 mx-auto animate-pulse"></div>
                                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-5/6 mx-auto animate-pulse"></div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : leaves.length > 0 ? (
                                    leaves.map((leave) => (
                                        <TableRow key={leave._id} className="border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors h-16">
                                             <TableCell className="px-6">
                                                <div>
                                                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{leave.leaveType}</span>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                        {getEmployeeDisplayName(leave)}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 text-sm text-slate-600 dark:text-slate-400">
                                                {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="px-6 text-sm font-bold text-slate-900 dark:text-slate-100 text-center">
                                                {calculateDays(leave.startDate, leave.endDate)}
                                            </TableCell>
                                            <TableCell className="px-6">
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        "px-3 py-0.5 rounded-lg border-none text-[10px] font-bold uppercase",
                                                        leave.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' :
                                                            leave.status === 'Pending' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' :
                                                                'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                                                    )}
                                                >
                                                    {leave.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-6 text-sm text-slate-500 dark:text-slate-400 max-w-xs truncate">{leave.reason}</TableCell>
                                            <TableCell className="px-6 text-right">
                                                {leave.status === 'Pending' && (
                                                    <div className="flex gap-2 justify-end">
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 font-bold text-xs h-8"
                                                            onClick={() => handleApproveLeave(leave._id)}
                                                        >
                                                            Approve
                                                        </Button>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold text-xs h-8"
                                                            onClick={() => handleRejectLeave(leave._id)}
                                                        >
                                                            Reject
                                                        </Button>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            className="text-slate-600 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/20 font-bold text-xs h-8"
                                                            onClick={() => handleCancelLeave(leave._id)}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-sm text-slate-500">
                                            No leave requests found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Leave Request Dialog - Disabled */}
         <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CalendarIcon size={20} className="text-indigo-600" />
                        Request Leave
                    </DialogTitle>
                    <DialogDescription>
                        Fill in the details to request time off.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleLeaveRequest} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                            Employee Name
                        </label>
                        <Input
                            type="text"
                            placeholder="Enter employee name"
                            value={formData.employeeName || ''}
                            onChange={(e) => setFormData({...formData, employeeName: e.target.value})}
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                            Leave Type
                        </label>
                        <Select 
                            value={formData.leaveType} 
                            onValueChange={(value) => setFormData({...formData, leaveType: value as any})}
                            required
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select leave type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Casual">Casual Leave</SelectItem>
                                <SelectItem value="Sick">Sick Leave</SelectItem>
                                <SelectItem value="Paid">Paid Leave</SelectItem>
                                <SelectItem value="Unpaid">Unpaid Leave</SelectItem>
                                <SelectItem value="Maternity">Maternity Leave</SelectItem>
                                <SelectItem value="Paternity">Paternity Leave</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                                Start Date
                            </label>
                            <Input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                                End Date
                            </label>
                            <Input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                required
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                            Reason
                        </label>
                        <Input
                            placeholder="Enter reason for leave"
                            value={formData.reason}
                            onChange={(e) => setFormData({...formData, reason: e.target.value})}
                            required
                        />
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setShowRequestDialog(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                            Submit Request
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>

        {/* Cancel Confirmation Dialog */}
        <Dialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <XCircle size={20} />
                        Cancel Leave Request
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to cancel this leave request? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-3 pt-4">
                    <Button 
                        variant="outline" 
                        onClick={() => {
                            setShowCancelConfirm(false);
                            setLeaveToCancel(null);
                        }}
                    >
                        No, Keep Request
                    </Button>
                    <Button 
                        variant="destructive" 
                        onClick={confirmCancelLeave}
                    >
                        Yes, Cancel Request
                    </Button>
                </div>
            </DialogContent>
        </Dialog>

        {/* Rejection Dialog */}
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <XCircle size={20} />
                        Reject Leave Request
                    </DialogTitle>
                    <DialogDescription>
                        Please provide a reason for rejecting this leave request.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                            Rejection Reason
                        </label>
                        <Input
                            placeholder="Enter reason for rejection"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button 
                            variant="outline" 
                            onClick={() => {
                                setShowRejectDialog(false);
                                setLeaveToReject(null);
                                setRejectionReason('');
                            }}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={confirmRejectLeave}
                            disabled={!rejectionReason.trim()}
                        >
                            Reject Request
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
        </>
    );
};

export default Leaves;
