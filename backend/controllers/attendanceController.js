import Attendance from '../models/Attendance.js';
import Staff from '../models/Staff.js';

// Get all attendance records
const getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate('staffId', 'firstName lastName email role')
      .populate('approvedBy', 'firstName lastName')
      .sort({ date: -1 });
    
    // Filter out records with null staffId (orphaned records)
    const validAttendance = attendance.filter(a => a.staffId && a.staffId._id);
    
    res.json(validAttendance);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get attendance by staff ID
const getAttendanceByStaff = async (req, res) => {
  try {
    const { staffId } = req.params;
    const { startDate, endDate } = req.query;
    
    // Check permissions: Staff can only view their own records, admins can view any
    if (req.user.role === 'staff') {
      const staffMember = await Staff.findOne({ email: req.user.email });
      if (!staffMember || staffMember._id.toString() !== staffId) {
        return res.status(403).json({ message: 'You can only view your own attendance records' });
      }
    }
    
    let query = { staffId };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const attendance = await Attendance.find(query)
      .populate('staffId', 'firstName lastName email role')
      .populate('approvedBy', 'firstName lastName')
      .sort({ date: -1 });
    
    res.json(attendance);
  } catch (error) {
    console.error('Error fetching staff attendance:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get attendance by date range
const getAttendanceByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }
    
    const attendance = await Attendance.find({
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    })
      .populate('staffId', 'firstName lastName email role')
      .populate('approvedBy', 'firstName lastName')
      .sort({ date: -1 });
    
    // Filter out records with null staffId (orphaned records)
    const validAttendance = attendance.filter(a => a.staffId && a.staffId._id);
    
    res.json(validAttendance);
  } catch (error) {
    console.error('Error fetching attendance by date range:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create attendance record
const createAttendance = async (req, res) => {
  try {
    const { staffId, date, status, notes, checkIn, checkOut, totalHours } = req.body;
    
    console.log('Received request body:', req.body);
    console.log('Extracted fields:', { staffId, date, status, notes, checkIn, checkOut, totalHours });
    
    // Check if staff exists
    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    
    // Check permissions: Staff can only create records for themselves, admins can create for anyone
    if (req.user.role === 'staff') {
      const staffMember = await Staff.findOne({ email: req.user.email });
      if (!staffMember || staffMember._id.toString() !== staffId) {
        return res.status(403).json({ message: 'You can only create attendance records for yourself' });
      }
    }
    
    // Check if attendance record already exists for this staff and date
    const existingAttendance = await Attendance.findOne({ staffId, date: new Date(date) });
    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance record already exists for this date' });
    }
    
    const attendance = new Attendance({
      staffId,
      date: new Date(date),
      status,
      notes,
      checkIn,
      checkOut,
      totalHours
    });
    
    console.log('Creating attendance record:', attendance);
    
    await attendance.save();
    
    const populatedAttendance = await Attendance.findById(attendance._id)
      .populate('staffId', 'firstName lastName email role')
      .populate('approvedBy', 'firstName lastName');
    
    res.status(201).json(populatedAttendance);
  } catch (error) {
    console.error('Error creating attendance:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Attendance record already exists for this date' });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

// Update attendance record
const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    console.log('=== ATTENDANCE UPDATE DEBUG ===');
    console.log('Request params:', req.params);
    console.log('Request body:', req.body);
    console.log('User info:', req.user);
    console.log('User role:', req.user?.role);
    console.log('Update data:', updateData);
    
    // First, get the existing attendance record
    const existingAttendance = await Attendance.findById(id).populate('staffId');
    if (!existingAttendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    
    // Check permissions: Staff can only edit their own records, admins can edit any
    if (req.user.role === 'staff') {
      // For staff, check if they're editing their own attendance
      const staffMember = await Staff.findOne({ email: req.user.email });
      if (!staffMember || staffMember._id.toString() !== existingAttendance.staffId._id.toString()) {
        return res.status(403).json({ message: 'You can only edit your own attendance records' });
      }
    }
    
    // If updating check-in or check-out times, ensure they are Date objects
    if (updateData.checkIn && updateData.checkIn.time) {
      updateData.checkIn.time = new Date(updateData.checkIn.time);
    }
    if (updateData.checkOut && updateData.checkOut.time) {
      updateData.checkOut.time = new Date(updateData.checkOut.time);
    }
    
    console.log('Processed update data:', updateData);
    
    const attendance = await Attendance.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('staffId', 'firstName lastName email role')
     .populate('approvedBy', 'firstName lastName');
    
    res.json(attendance);
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete attendance record
const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    
    const attendance = await Attendance.findByIdAndDelete(id);
    
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    
    res.json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    console.error('Error deleting attendance:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Bulk create attendance records for multiple staff members
const bulkCreateAttendance = async (req, res) => {
  try {
    const { date, staffIds, status, notes } = req.body;
    
    if (!date || !staffIds || !Array.isArray(staffIds)) {
      return res.status(400).json({ message: 'Date and staff IDs array are required' });
    }
    
    const attendanceRecords = [];
    
    for (const staffId of staffIds) {
      // Check if staff exists
      const staff = await Staff.findById(staffId);
      if (!staff) {
        continue; // Skip if staff doesn't exist
      }
      
      // Check if attendance record already exists
      const existingAttendance = await Attendance.findOne({ 
        staffId, 
        date: new Date(date) 
      });
      
      if (!existingAttendance) {
        attendanceRecords.push({
          staffId,
          date: new Date(date),
          status,
          notes
        });
      }
    }
    
    if (attendanceRecords.length === 0) {
      return res.status(400).json({ message: 'No new attendance records to create' });
    }
    
    const createdAttendance = await Attendance.insertMany(attendanceRecords);
    
    const populatedAttendance = await Attendance.find({
      _id: { $in: createdAttendance.map(record => record._id) }
    }).populate('staffId', 'firstName lastName email role')
      .populate('approvedBy', 'firstName lastName');
    
    res.status(201).json(populatedAttendance);
  } catch (error) {
    console.error('Error bulk creating attendance:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get attendance statistics
const getAttendanceStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateQuery = {};
    if (startDate && endDate) {
      dateQuery = {
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }
    
    const stats = await Attendance.aggregate([
      { $match: dateQuery },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const totalStaff = await Staff.countDocuments({ isActive: true });
    const totalRecords = await Attendance.countDocuments(dateQuery);
    
    const statsObject = {
      totalStaff,
      totalRecords,
      byStatus: stats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      presentRate: totalRecords > 0 ? 
        ((stats.find(s => s._id === 'present')?.count || 0) / totalRecords * 100).toFixed(1) : 0
    };
    
    res.json(statsObject);
  } catch (error) {
    console.error('Error fetching attendance stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Check-in method
const checkIn = async (req, res) => {
  try {
    const { staffId, date, location } = req.body;
    
    // Check if staff exists
    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    
    // Find or create attendance record for the date
    let attendance = await Attendance.findOne({ 
      staffId, 
      date: new Date(date) 
    });
    
    if (!attendance) {
      // Create new attendance record if it doesn't exist
      attendance = new Attendance({
        staffId,
        date: new Date(date),
        status: 'present'
      });
    }
    
    // Check if already checked in
    if (attendance.checkIn.time) {
      return res.status(400).json({ message: 'Already checked in for this date' });
    }
    
    // Set check-in time and location
    attendance.checkIn = {
      time: new Date(),
      location: location || 'Office'
    };
    
    // Update status to present if it was absent
    if (attendance.status === 'absent') {
      attendance.status = 'present';
    }
    
    await attendance.save();
    
    const populatedAttendance = await Attendance.findById(attendance._id)
      .populate('staffId', 'firstName lastName email role')
      .populate('approvedBy', 'firstName lastName');
    
    res.json(populatedAttendance);
  } catch (error) {
    console.error('Error during check-in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Check-out method
const checkOut = async (req, res) => {
  try {
    const { staffId, date, location } = req.body;
    
    // Check if staff exists
    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    
    // Find attendance record for the date
    const attendance = await Attendance.findOne({ 
      staffId, 
      date: new Date(date) 
    });
    
    if (!attendance) {
      return res.status(404).json({ message: 'No attendance record found for this date' });
    }
    
    // Check if already checked out
    if (attendance.checkOut.time) {
      return res.status(400).json({ message: 'Already checked out for this date' });
    }
    
    // Check if checked in
    if (!attendance.checkIn.time) {
      return res.status(400).json({ message: 'Must check in before checking out' });
    }
    
    // Set check-out time and location
    attendance.checkOut = {
      time: new Date(),
      location: location || 'Office'
    };
    
    // Calculate total hours (this will be done automatically by the pre-save middleware)
    await attendance.save();
    
    const populatedAttendance = await Attendance.findById(attendance._id)
      .populate('staffId', 'firstName lastName email role')
      .populate('approvedBy', 'firstName lastName');
    
    res.json(populatedAttendance);
  } catch (error) {
    console.error('Error during check-out:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get current day attendance status for a staff member
const getCurrentDayStatus = async (req, res) => {
  try {
    const { staffId } = req.params;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const attendance = await Attendance.findOne({ 
      staffId, 
      date: today 
    }).populate('staffId', 'firstName lastName email role');
    
    if (!attendance) {
      return res.json({
        staffId,
        date: today,
        status: 'not_created',
        checkIn: null,
        checkOut: null,
        totalHours: 0
      });
    }
    
    res.json(attendance);
  } catch (error) {
    console.error('Error fetching current day status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get current user's attendance records
const getMyAttendance = async (req, res) => {
  try {
    // Find the staff member based on the current user's email
    const staffMember = await Staff.findOne({ email: req.user.email });
    if (!staffMember) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    
    const { startDate, endDate } = req.query;
    
    let query = { staffId: staffMember._id };
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const attendance = await Attendance.find(query)
      .populate('staffId', 'firstName lastName email role')
      .populate('approvedBy', 'firstName lastName')
      .sort({ date: -1 });
    
    res.json(attendance);
  } catch (error) {
    console.error('Error fetching my attendance:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Generate daily attendance report
const generateDailyReport = async (req, res) => {
  try {
    const { date } = req.query;
    const reportDate = date ? new Date(date) : new Date();
    
    // Set to start of day
    const startOfDay = new Date(reportDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    // Set to end of day
    const endOfDay = new Date(reportDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    // Get all attendance records for the day
    const attendance = await Attendance.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    }).populate('staffId', 'firstName lastName email role')
      .sort({ 'staffId.firstName': 1 });
    
    // Calculate summary statistics
    const totalStaff = attendance.length;
    const presentCount = attendance.filter(a => a.status === 'present').length;
    const absentCount = attendance.filter(a => a.status === 'absent').length;
    const lateCount = attendance.filter(a => a.status === 'late').length;
    const halfDayCount = attendance.filter(a => a.status === 'half-day').length;
    const leaveCount = attendance.filter(a => a.status === 'leave').length;
    
    const totalWorkingHours = attendance.reduce((sum, a) => sum + (a.totalHours || 0), 0);
    const averageWorkingHours = totalStaff > 0 ? (totalWorkingHours / totalStaff).toFixed(2) : 0;
    
    const reportData = {
      date: reportDate,
      totalStaff,
      presentCount,
      absentCount,
      lateCount,
      halfDayCount,
      leaveCount,
      totalWorkingHours: totalWorkingHours.toFixed(2),
      averageWorkingHours,
      attendance: attendance.map(a => ({
        staffName: `${a.staffId.firstName} ${a.staffId.lastName}`,
        role: a.staffId.role,
        status: a.status,
        checkIn: a.checkIn?.time ? a.checkIn.time.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }) : 'N/A',
        checkOut: a.checkOut?.time ? a.checkOut.time.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }) : 'N/A',
        totalHours: a.totalHours || 0,
        notes: a.notes || ''
      }))
    };
    
    res.json(reportData);
  } catch (error) {
    console.error('Error generating daily report:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Generate PDF daily attendance report
const generateDailyReportPDF = async (req, res) => {
  try {
    const { date } = req.query;
    const reportDate = date ? new Date(date) : new Date();
    
    // Set to start of day
    const startOfDay = new Date(reportDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    // Set to end of day
    const endOfDay = new Date(reportDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    // Get all attendance records for the day
    const attendance = await Attendance.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    }).populate('staffId', 'firstName lastName email role')
      .sort({ 'staffId.firstName': 1 });
    
    // Calculate summary statistics
    const totalStaff = attendance.length;
    const presentCount = attendance.filter(a => a.status === 'present').length;
    const absentCount = attendance.filter(a => a.status === 'absent').length;
    const lateCount = attendance.filter(a => a.status === 'late').length;
    const halfDayCount = attendance.filter(a => a.status === 'half-day').length;
    const leaveCount = attendance.filter(a => a.status === 'leave').length;
    
    const totalWorkingHours = attendance.reduce((sum, a) => sum + (a.totalHours || 0), 0);
    const averageWorkingHours = totalStaff > 0 ? (totalWorkingHours / totalStaff).toFixed(2) : 0;
    
    // Generate PDF
    const PDFDocument = (await import('pdfkit')).default;
    const doc = new PDFDocument();
    
    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="daily-attendance-${reportDate.toISOString().split('T')[0]}.pdf"`);
    
    // Pipe PDF to response
    doc.pipe(res);
    
    // Add content to PDF
    doc.fontSize(20).text('Daily Attendance Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Date: ${reportDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}`);
    doc.moveDown();
    
    // Summary section
    doc.fontSize(16).text('Summary', { underline: true });
    doc.fontSize(12).text(`Total Staff: ${totalStaff}`);
    doc.fontSize(12).text(`Present: ${presentCount}`);
    doc.fontSize(12).text(`Absent: ${absentCount}`);
    doc.fontSize(12).text(`Late: ${lateCount}`);
    doc.fontSize(12).text(`Half Day: ${halfDayCount}`);
    doc.fontSize(12).text(`Leave: ${leaveCount}`);
    doc.fontSize(12).text(`Total Working Hours: ${totalWorkingHours.toFixed(2)}`);
    doc.fontSize(12).text(`Average Working Hours: ${averageWorkingHours}`);
    doc.moveDown();
    
    // Detailed attendance table
    doc.fontSize(16).text('Detailed Attendance', { underline: true });
    doc.moveDown();
    
    if (attendance.length > 0) {
      // Table headers
      const tableTop = doc.y;
      let currentY = tableTop;
      
      // Headers
      doc.fontSize(10).text('Staff Name', 50, currentY);
      doc.text('Role', 150, currentY);
      doc.text('Status', 220, currentY);
      doc.text('Check In', 280, currentY);
      doc.text('Check Out', 350, currentY);
      doc.text('Hours', 420, currentY);
      doc.text('Notes', 480, currentY);
      
      currentY += 20;
      
      // Table rows
      attendance.forEach((record, index) => {
        if (currentY > 700) { // Check if we need a new page
          doc.addPage();
          currentY = 50;
        }
        
        const staffName = `${record.staffId.firstName} ${record.staffId.lastName}`;
        const checkIn = record.checkIn?.time ? record.checkIn.time.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }) : 'N/A';
        const checkOut = record.checkOut?.time ? record.checkOut.time.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }) : 'N/A';
        
        doc.fontSize(9).text(staffName, 50, currentY);
        doc.text(record.staffId.role, 150, currentY);
        doc.text(record.status, 220, currentY);
        doc.text(checkIn, 280, currentY);
        doc.text(checkOut, 350, currentY);
        doc.text((record.totalHours || 0).toString(), 420, currentY);
        doc.text(record.notes || '', 480, currentY);
        
        currentY += 15;
      });
    } else {
      doc.fontSize(12).text('No attendance records found for this date.');
    }
    
    // Finalize PDF
    doc.end();
    
  } catch (error) {
    console.error('Error generating PDF report:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export {
  getAllAttendance,
  getAttendanceByStaff,
  getAttendanceByDateRange,
  createAttendance,
  updateAttendance,
  deleteAttendance,
  bulkCreateAttendance,
  getAttendanceStats,
  checkIn,
  checkOut,
  getCurrentDayStatus,
  getMyAttendance,
  generateDailyReport,
  generateDailyReportPDF
};
