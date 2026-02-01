import React, { useState } from 'react';
import { X, User, Mail, Phone, MapPin, Calendar, DollarSign, Briefcase, Building } from 'lucide-react';
import { EmployeeFormData } from '../services/employeeService';
import { Department } from '../types';
import { EmployeeService } from '../services/employeeService';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface CreateEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateEmployeeModal: React.FC<CreateEmployeeModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<EmployeeFormData>({
    employeeId: '',
    name: '',
    email: '',
    dob: '',
    gender: 'Male',
    phone: '',
    address: '',
    department: Department.ENGINEERING,
    designation: '',
    role: 'Employee',
    dateOfJoining: '',
    status: 'Active',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    },
    salary: 0,
    bankDetails: {
      accountName: '',
      accountNumber: '',
      bankName: '',
      ifscCode: ''
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await EmployeeService.createEmployee(formData);
      alert('Employee created successfully!');
      onSuccess();
      onClose();
    } catch (error: any) {
      alert(error.error || 'Failed to create employee');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof EmployeeFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (parent: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev as any)[parent],
        [field]: value
      }
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Create New Employee</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={20} />
          </Button>
        </CardHeader>
        
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Employee ID *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input
                    type="text"
                    placeholder="EMP-001"
                    value={formData.employeeId}
                    onChange={(e) => handleInputChange('employeeId', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input
                    type="email"
                    placeholder="john.doe@company.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Phone *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input
                    type="tel"
                    placeholder="+1-555-0123"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Date of Birth *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => handleInputChange('dob', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Gender *
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full h-10 bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Department *
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <select
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="w-full h-10 bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none pl-10"
                    required
                  >
                    {Object.values(Department).map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Designation *
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input
                    type="text"
                    placeholder="Software Engineer"
                    value={formData.designation}
                    onChange={(e) => handleInputChange('designation', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className="w-full h-10 bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  required
                >
                  <option value="Employee">Employee</option>
                  <option value="Manager">Manager</option>
                  <option value="HR">HR</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Date of Joining *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input
                    type="date"
                    value={formData.dateOfJoining}
                    onChange={(e) => handleInputChange('dateOfJoining', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Salary *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <Input
                    type="number"
                    placeholder="75000"
                    value={formData.salary}
                    onChange={(e) => handleInputChange('salary', parseInt(e.target.value) || 0)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Address *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <Input
                  type="text"
                  placeholder="123 Main St, City, State 12345"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Name *
                  </label>
                  <Input
                    type="text"
                    placeholder="Jane Doe"
                    value={formData.emergencyContact.name}
                    onChange={(e) => handleNestedChange('emergencyContact', 'name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Relationship *
                  </label>
                  <Input
                    type="text"
                    placeholder="Spouse"
                    value={formData.emergencyContact.relationship}
                    onChange={(e) => handleNestedChange('emergencyContact', 'relationship', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Phone *
                  </label>
                  <Input
                    type="tel"
                    placeholder="+1-555-0123"
                    value={formData.emergencyContact.phone}
                    onChange={(e) => handleNestedChange('emergencyContact', 'phone', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">
                {loading ? 'Creating...' : 'Create Employee'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateEmployeeModal;