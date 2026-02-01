import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Employee from '../models/Employee';
import dotenv from 'dotenv';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Employee.deleteMany({});

    // Create sample users
    const users = [
      {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@company.com',
        password: await bcrypt.hash('admin123', 12),
        role: 'HR_ADMIN',
        department: 'HR',
        avatar: ''
      },
      {
        name: 'David Miller',
        email: 'david.miller@company.com',
        password: await bcrypt.hash('manager123', 12),
        role: 'MANAGER',
        department: 'Engineering',
        avatar: ''
      },
      {
        name: 'Amit Sharma',
        email: 'amit.sharma@company.com',
        password: await bcrypt.hash('employee123', 12),
        role: 'EMPLOYEE',
        department: 'Engineering',
        avatar: ''
      }
    ];

    const createdUsers = await User.insertMany(users);
    console.log('Created users:', createdUsers.map((u: any) => ({ name: u.name, email: u.email, role: u.role })));

    // Create sample employees
    const employees = [
      {
        employeeId: 'EMP001',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@company.com',
        dob: new Date('1985-05-15'),
        gender: 'Female',
        phone: '+1-555-0123',
        address: '123 Main St, New York, NY 10001',
        department: 'HR',
        designation: 'HR Director',
        role: 'Admin',
        dateOfJoining: new Date('2020-01-15'),
        status: 'Active',
        emergencyContact: {
          name: 'John Johnson',
          relationship: 'Spouse',
          phone: '+1-555-0124'
        },
        salary: 95000,
        bankDetails: {
          accountName: 'Sarah Johnson',
          accountNumber: '123456789',
          bankName: 'First National Bank',
          ifscCode: 'FNB001'
        }
      },
      {
        employeeId: 'EMP002',
        name: 'David Miller',
        email: 'david.miller@company.com',
        dob: new Date('1982-08-22'),
        gender: 'Male',
        phone: '+1-555-0125',
        address: '456 Oak Ave, San Francisco, CA 94102',
        department: 'Engineering',
        designation: 'Engineering Manager',
        role: 'Manager',
        dateOfJoining: new Date('2019-03-10'),
        status: 'Active',
        emergencyContact: {
          name: 'Lisa Miller',
          relationship: 'Spouse',
          phone: '+1-555-0126'
        },
        salary: 120000,
        bankDetails: {
          accountName: 'David Miller',
          accountNumber: '987654321',
          bankName: 'Tech Bank',
          ifscCode: 'TBK001'
        }
      },
      {
        employeeId: 'EMP003',
        name: 'Amit Sharma',
        email: 'amit.sharma@company.com',
        dob: new Date('1990-12-10'),
        gender: 'Male',
        phone: '+1-555-0127',
        address: '789 Pine St, Boston, MA 02108',
        department: 'Engineering',
        designation: 'Senior Developer',
        role: 'Employee',
        dateOfJoining: new Date('2021-06-01'),
        status: 'Active',
        emergencyContact: {
          name: 'Priya Sharma',
          relationship: 'Spouse',
          phone: '+1-555-0128'
        },
        salary: 85000,
        bankDetails: {
          accountName: 'Amit Sharma',
          accountNumber: '456789123',
          bankName: 'Community Bank',
          ifscCode: 'CBK001'
        }
      }
    ];

    const createdEmployees = await Employee.insertMany(employees);
    console.log('Created employees:', createdEmployees.map((e: any) => ({ name: e.name, employeeId: e.employeeId, department: e.department })));

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();