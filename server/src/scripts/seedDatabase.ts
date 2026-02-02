import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';
import User from '../models/User';
import Employee from '../models/Employee';
import Leave from '../models/Leave';
import Attendance from '../models/Attendance';
import Payroll from '../models/Payroll';
import Performance from '../models/Performance';
import { JobPost, Candidate } from '../models/Recruitment';
import Training from '../models/Training';
import Asset from '../models/Asset';

// Setup dotenv to look for .env in the root server directory
dotenv.config({ path: path.join(__dirname, '../../.env') });

const clearDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('MONGO_URI is not defined in .env file');
      console.log('Current __dirname:', __dirname);
      process.exit(1);
    }

    console.log('Connecting to:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Clear all collections
    console.log('Clearing all collections...');
    await Promise.all([
      User.deleteMany({}),
      Employee.deleteMany({}),
      Leave.deleteMany({}),
      Attendance.deleteMany({}),
      Payroll.deleteMany({}),
      Performance.deleteMany({}),
      JobPost.deleteMany({}),
      Candidate.deleteMany({}),
      Training.deleteMany({}),
      Asset.deleteMany({})
    ]);

    console.log('Database cleared successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Database clearing failed:', error);
    process.exit(1);
  }
};

clearDatabase();