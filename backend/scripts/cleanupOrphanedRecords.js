import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Attendance from '../models/Attendance.js';
import Payroll from '../models/Payroll.js';
import Staff from '../models/Staff.js';

dotenv.config();

const cleanupOrphanedRecords = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all staff IDs
    const staffIds = await Staff.find({}, '_id');
    const staffIdSet = new Set(staffIds.map(s => s._id.toString()));
    
    console.log(`Found ${staffIdSet.size} active staff members`);

    // Find attendance records with orphaned staffId references
    const orphanedAttendance = await Attendance.find({
      staffId: { $exists: true, $ne: null }
    });
    
    let orphanedCount = 0;
    for (const attendance of orphanedAttendance) {
      if (!staffIdSet.has(attendance.staffId.toString())) {
        orphanedCount++;
        console.log(`Orphaned attendance record: ${attendance._id} references staff ${attendance.staffId}`);
      }
    }
    
    console.log(`Found ${orphanedCount} orphaned attendance records`);

    // Find payroll records with orphaned staffId references
    const orphanedPayroll = await Payroll.find({
      staffId: { $exists: true, $ne: null }
    });
    
    let orphanedPayrollCount = 0;
    for (const payroll of orphanedPayroll) {
      if (!staffIdSet.has(payroll.staffId.toString())) {
        orphanedPayrollCount++;
        console.log(`Orphaned payroll record: ${payroll._id} references staff ${payroll.staffId}`);
      }
    }
    
    console.log(`Found ${orphanedPayrollCount} orphaned payroll records`);

    // Clean up orphaned records
    if (orphanedCount > 0) {
      const attendanceResult = await Attendance.deleteMany({
        staffId: { $nin: staffIds.map(s => s._id) }
      });
      console.log(`Deleted ${attendanceResult.deletedCount} orphaned attendance records`);
    }

    if (orphanedPayrollCount > 0) {
      const payrollResult = await Payroll.deleteMany({
        staffId: { $nin: staffIds.map(s => s._id) }
      });
      console.log(`Deleted ${payrollResult.deletedCount} orphaned payroll records`);
    }

    console.log('Cleanup completed successfully');
    
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the cleanup
cleanupOrphanedRecords();
