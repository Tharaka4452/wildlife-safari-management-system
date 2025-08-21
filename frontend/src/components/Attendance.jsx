import React, { useState, useEffect } from 'react';
import { attendanceApi, staffApi } from '../services/api';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [staffLoading, setStaffLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddModal, setShowAddModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [formData, setFormData] = useState({
    staffId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'present',
    checkInDate: new Date().toISOString().split('T')[0],
    checkInTime: '',
    checkOutDate: new Date().toISOString().split('T')[0],
    checkOutTime: '',
    calculatedHours: 0,
    timeError: '',
    notes: ''
  });

  const [staffSessionStatus, setStaffSessionStatus] = useState({});
  const [checkingSession, setCheckingSession] = useState(false);
  
  // Daily report states
  const [dailyReport, setDailyReport] = useState(null);
  const [dailyReportDate, setDailyReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [showDailyReport, setShowDailyReport] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);


  useEffect(() => {
    loadAttendance();
    loadStaff();
    loadStats();
  }, []);

  // Refresh attendance when date changes
  useEffect(() => {
    if (selectedDate !== new Date().toISOString().split('T')[0]) {
      setSelectedDate(new Date().toISOString().split('T')[0]);
    }
  }, []);

  // Recalculate working hours when check-in/out times change
  useEffect(() => {
    if (formData.checkInDate && formData.checkInTime && formData.checkOutDate && formData.checkOutTime) {
      calculateWorkingHours();
    }
  }, [formData.checkInDate, formData.checkInTime, formData.checkOutDate, formData.checkOutTime]);

  // Check staff session status when staff member changes
  useEffect(() => {
    if (formData.staffId) {
      checkStaffSessionStatus(formData.staffId);
    }
  }, [formData.staffId]);

  const loadAttendance = async () => {
    setLoading(true);
    try {
      // Get all attendance and filter for selected date
      const allData = await attendanceApi.getAllAttendance();
      const selectedData = allData.filter(record => {
        const recordDate = new Date(record.date).toISOString().split('T')[0];
        return recordDate === selectedDate;
      });
      
      setAttendance(selectedData);
    } catch (error) {
      console.error('Error loading attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTodayAttendance = async () => {
    await loadAttendance();
    await loadStats();
  };

  const loadStaff = async () => {
    setStaffLoading(true);
    try {
      const data = await staffApi.getAllStaff();
      setStaff(data.filter(s => s.isActive));
    } catch (error) {
      console.error('Error loading staff:', error);
    } finally {
      setStaffLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await attendanceApi.getAttendanceStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadDailyReport = async () => {
    try {
      const data = await attendanceApi.getDailyReport(dailyReportDate);
      setDailyReport(data);
      setShowDailyReport(true);
    } catch (error) {
      console.error('Error loading daily report:', error);
      alert('Error loading daily report. Please try again.');
    }
  };

  const downloadDailyReportPDF = async () => {
    try {
      setGeneratingPDF(true);
      const blob = await attendanceApi.downloadDailyReportPDF(dailyReportDate);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `daily-attendance-${dailyReportDate}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      alert('PDF report downloaded successfully!');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error downloading PDF report. Please try again.');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if staff member has an active session
    const currentStatus = staffSessionStatus[formData.staffId];
    if (currentStatus?.hasActiveSession) {
      alert('Staff member is currently checked in. Must check out before adding new attendance record.');
      return;
    }
    
    // Validate time inputs
    if (formData.checkInTime && formData.checkOutTime) {
      const checkInDateTime = new Date(`${formData.checkInDate}T${formData.checkInTime}`);
      const checkOutDateTime = new Date(`${formData.checkOutDate}T${formData.checkOutTime}`);
      
      if (checkOutDateTime <= checkInDateTime) {
        alert('Check-out time must be after check-in time');
        return;
      }
      
      if (formData.calculatedHours <= 0) {
        alert('Working hours must be greater than 0');
        return;
      }
    }
    
    // Validate required fields
    if (!formData.staffId) {
      alert('Please select a staff member');
      return;
    }
    
    if (!formData.date) {
      alert('Please select a date');
      return;
    }
    
    if (formData.status === 'present' && (!formData.checkInTime || !formData.checkOutTime)) {
      alert('Check-in and check-out times are required for present status');
      return;
    }
    
    try {
      const payload = {
        ...formData,
        checkIn: formData.checkInTime ? {
          time: new Date(`${formData.checkInDate}T${formData.checkInTime}`),
          location: 'Office'
        } : undefined,
        checkOut: formData.checkOutTime ? {
          time: new Date(`${formData.checkOutDate}T${formData.checkOutTime}`),
          location: 'Office'
        } : undefined,
        totalHours: formData.calculatedHours
      };
      
      console.log('Submitting payload:', payload);
      console.log('Form data:', formData);
      
      await attendanceApi.createAttendance(payload);
      setShowAddModal(false);
      setFormData({
        staffId: '',
        date: new Date().toISOString().split('T')[0],
        status: 'present',
        checkInDate: new Date().toISOString().split('T')[0],
        checkInTime: '',
        checkOutDate: new Date().toISOString().split('T')[0],
        checkOutTime: '',
        calculatedHours: 0,
        timeError: '',
        notes: ''
      });
      loadAttendance();
      loadStats();
      
      // Refresh session status for the staff member
      if (payload.staffId) {
        checkStaffSessionStatus(payload.staffId);
      }
    } catch (error) {
      console.error('Error creating attendance:', error);
      alert('Failed to create attendance record');
    }
  };



  const handleUpdate = async (e) => {
    e.preventDefault();
    
    // Check if staff member has an active session (excluding current record being edited)
    const currentStatus = staffSessionStatus[formData.staffId];
    if (currentStatus?.hasActiveSession && currentStatus.currentRecord?._id !== selectedAttendance?._id) {
      alert('Staff member is currently checked in. Must check out before updating attendance record.');
      return;
    }
    
    // Validate time inputs
    if (formData.checkInTime && formData.checkOutTime) {
      const checkInDateTime = new Date(`${formData.checkInDate}T${formData.checkInTime}`);
      const checkOutDateTime = new Date(`${formData.checkOutDate}T${formData.checkOutTime}`);
      
      if (checkOutDateTime <= checkInDateTime) {
        alert('Check-out time must be after check-in time');
        return;
      }
      
      if (formData.calculatedHours <= 0) {
        alert('Working hours must be greater than 0');
        return;
      }
    }
    
    // Validate required fields
    if (!formData.staffId) {
      alert('Please select a staff member');
      return;
    }
    
    if (!formData.date) {
      alert('Please select a date');
      return;
    }
    
    if (formData.status === 'present' && (!formData.checkInTime || !formData.checkOutTime)) {
      alert('Check-in and check-out times are required for present status');
      return;
    }
    
    try {
      const payload = {
        ...formData,
        checkIn: formData.checkInTime ? {
          time: new Date(`${formData.checkInDate}T${formData.checkInTime}`),
          location: 'Office'
        } : undefined,
        checkOut: formData.checkOutTime ? {
          time: new Date(`${formData.checkOutDate}T${formData.checkOutTime}`),
          location: 'Office'
        } : undefined,
        totalHours: formData.calculatedHours
      };
      
      await attendanceApi.updateAttendance(selectedAttendance._id, payload);
      setShowEditModal(false);
      setSelectedAttendance(null);
      setFormData({
        staffId: '',
        date: new Date().toISOString().split('T')[0],
        status: 'present',
        checkInDate: new Date().toISOString().split('T')[0],
        checkInTime: '',
        checkOutDate: new Date().toISOString().split('T')[0],
        checkOutTime: '',
        calculatedHours: 0,
        timeError: '',
        notes: ''
      });
      loadAttendance();
      loadStats();
    } catch (error) {
      console.error('Error updating attendance:', error);
      alert('Failed to update attendance record');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this attendance record?')) {
      try {
        await attendanceApi.deleteAttendance(id);
        loadAttendance();
        loadStats();
      } catch (error) {
        console.error('Error deleting attendance:', error);
        alert('Failed to delete attendance record');
      }
    }
  };

  const handleEdit = (record) => {
    setSelectedAttendance(record);
    setFormData({
      staffId: record.staffId._id,
      date: new Date(record.date).toISOString().split('T')[0],
      status: record.status,
      checkInDate: record.checkIn?.time ? new Date(record.checkIn.time).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      checkInTime: record.checkIn?.time ? new Date(record.checkIn.time).toTimeString().slice(0, 5) : '',
      checkOutDate: record.checkOut?.time ? new Date(record.checkOut.time).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      checkOutTime: record.checkOut?.time ? new Date(record.checkOut.time).toTimeString().slice(0, 5) : '',
      calculatedHours: record.totalHours || 0,
      notes: record.notes || ''
    });
    setShowEditModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-500/20 text-green-400';
      case 'absent': return 'bg-red-500/20 text-red-400';
      case 'late': return 'bg-yellow-500/20 text-yellow-400';
      case 'half-day': return 'bg-orange-500/20 text-orange-400';
      case 'leave': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatTime = (time) => {
    if (!time) return 'Not set';
    return new Date(time).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Calculate working hours automatically
  const calculateWorkingHours = () => {
    console.log('calculateWorkingHours called with:', {
      checkInDate: formData.checkInDate,
      checkInTime: formData.checkInTime,
      checkOutDate: formData.checkOutDate,
      checkOutTime: formData.checkOutTime
    });
    
    if (formData.checkInDate && formData.checkInTime && formData.checkOutDate && formData.checkOutTime) {
      const checkInDateTime = new Date(`${formData.checkInDate}T${formData.checkInTime}`);
      const checkOutDateTime = new Date(`${formData.checkOutDate}T${formData.checkOutTime}`);
      
      if (checkOutDateTime > checkInDateTime) {
        const diffMs = checkOutDateTime - checkInDateTime;
        const diffHrs = diffMs / (1000 * 60 * 60);
        const hours = Math.round(diffHrs * 100) / 100; // Round to 2 decimal places
        console.log('Calculated hours:', hours);
        
        // Additional validation for working hours
        if (hours < 0.5) {
          setFormData(prev => ({ 
            ...prev, 
            calculatedHours: hours, 
            timeError: 'Working hours must be at least 30 minutes' 
          }));
        } else if (hours > 24) {
          setFormData(prev => ({ 
            ...prev, 
            calculatedHours: hours, 
            timeError: 'Working hours cannot exceed 24 hours' 
          }));
        } else if (formData.checkInDate === formData.checkOutDate && hours > 16) {
          // For same-day attendance, limit to 16 hours max
          setFormData(prev => ({ 
            ...prev, 
            calculatedHours: hours, 
            timeError: 'Same-day working hours cannot exceed 16 hours' 
          }));
        } else {
          setFormData(prev => ({ ...prev, calculatedHours: hours, timeError: '' }));
        }
      } else {
        console.log('Check-out time is before check-in time, setting hours to 0');
        setFormData(prev => ({ 
          ...prev, 
          calculatedHours: 0, 
          timeError: 'Check-out time must be after check-in time' 
        }));
      }
    } else {
      console.log('Missing required fields, setting hours to 0');
      setFormData(prev => ({ ...prev, calculatedHours: 0, timeError: '' }));
    }
  };

  // Convert decimal hours to hours and minutes format
  const formatHoursToHrsMins = (decimalHours) => {
    if (!decimalHours || decimalHours === 0) return '0 hrs 0 mins';
    
    const hours = Math.floor(decimalHours);
    const minutes = Math.round((decimalHours - hours) * 60);
    
    if (minutes === 0) {
      return `${hours} hrs`;
    } else if (hours === 0) {
      return `${minutes} mins`;
    } else {
      return `${hours} hrs ${minutes} mins`;
    }
  };

  // Update form data and recalculate hours
  const updateFormData = (updates) => {
    setFormData(prev => {
      const newData = { ...prev, ...updates };
      return newData;
    });
  };

  // Check if staff member has an active session (checked in but not checked out)
  const checkStaffSessionStatus = async (staffId) => {
    if (!staffId) return;
    
    setCheckingSession(true);
    try {
      const currentStatus = await attendanceApi.getCurrentDayStatus(staffId);
      
      // Check if staff has an active session (checked in but not checked out)
      const hasActiveSession = currentStatus.checkIn?.time && !currentStatus.checkOut?.time;
      
      setStaffSessionStatus(prev => ({
        ...prev,
        [staffId]: {
          hasActiveSession,
          currentRecord: currentStatus,
          message: hasActiveSession 
            ? 'Staff member is currently checked in. Must check out before adding new record.'
            : 'Staff member can add new attendance record.'
        }
      }));
    } catch (error) {
      console.error('Error checking staff session status:', error);
      setStaffSessionStatus(prev => ({
        ...prev,
        [staffId]: {
          hasActiveSession: false,
          currentRecord: null,
          message: 'Unable to check session status'
        }
      }));
    } finally {
      setCheckingSession(false);
    }
  };

  // Check if form should be disabled due to active session
  const isFormDisabled = () => {
    if (!formData.staffId) return false;
    const currentStatus = staffSessionStatus[formData.staffId];
    return currentStatus?.hasActiveSession || false;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
              <div className="flex justify-between items-center">
          <h3 className="text-xl font-abeze font-bold text-white">Attendance Management</h3>
          <div className="flex space-x-3 items-center">
            {/* Date Selector */}
            <div className="flex items-center space-x-2">
              <label className="text-gray-300 font-abeze text-sm">View Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  // Refresh attendance for selected date
                  setTimeout(() => loadAttendance(), 100);
                }}
                className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white font-abeze focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-abeze font-medium transition-colors duration-300 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add Record</span>
            </button>
            
            <button
              onClick={loadDailyReport}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-abeze font-medium transition-colors duration-300 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Daily Report</span>
            </button>
          </div>
        </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 font-abeze text-sm">
                  {selectedDate === new Date().toISOString().split('T')[0] ? "Today's Staff" : "Staff Count"}
                </p>
                <p className="text-3xl font-abeze font-bold text-white">{attendance.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 font-abeze text-sm">
                  {selectedDate === new Date().toISOString().split('T')[0] ? "Today's Present Rate" : "Present Rate"}
                </p>
                <p className="text-3xl font-abeze font-bold text-white">
                  {attendance.length > 0 
                    ? Math.round((attendance.filter(a => a.status === 'present').length / attendance.length) * 100)
                    : 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-200 font-abeze text-sm">
                  {selectedDate === new Date().toISOString().split('T')[0] ? "Today's Records" : "Records Count"}
                </p>
                <p className="text-3xl font-abeze font-bold text-white">{attendance.length}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-200 font-abeze text-sm">Avg Working Hours</p>
                                 <p className="text-3xl font-abeze font-bold text-white">
                   {attendance.filter(a => a.totalHours > 0).length > 0 
                     ? formatHoursToHrsMins((attendance.filter(a => a.totalHours > 0).reduce((sum, a) => sum + a.totalHours, 0) / 
                        attendance.filter(a => a.totalHours > 0).length))
                     : '0 hrs 0 mins'}
                 </p>
              </div>
              <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 font-abeze text-sm">
                  {selectedDate === new Date().toISOString().split('T')[0] ? "Today's Date" : "Selected Date"}
                </p>
                <p className="text-lg font-abeze font-bold text-white">{new Date(selectedDate).toLocaleDateString()}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Check-in/Check-out Section */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
        <h4 className="text-lg font-abeze font-bold text-white mb-4">Quick Check-in/Check-out</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-300 font-abeze text-sm mb-2">Staff Member</label>
            <select
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white font-abeze focus:outline-none focus:border-blue-500"
              onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
            >
              <option value="">Select Staff Member</option>
              {staff.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.firstName} {member.lastName} - {member.role}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-gray-300 font-abeze text-sm mb-2">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white font-abeze focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <div className="flex items-end space-x-2">
            <button
              onClick={async () => {
                if (!formData.staffId) {
                  alert('Please select a staff member');
                  return;
                }
                try {
                  await attendanceApi.checkIn({
                    staffId: formData.staffId,
                    date: formData.checkInDate,
                    location: 'Office'
                  });
                  loadAttendance();
                  loadStats();
                  alert('Check-in successful!');
                } catch (error) {
                  console.error('Error during check-in:', error);
                  alert('Check-in failed: ' + (error.response?.data?.message || error.message));
                }
              }}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-abeze font-medium transition-colors duration-300"
            >
              Check In
            </button>
            
            <button
              onClick={async () => {
                if (!formData.staffId) {
                  alert('Please select a staff member');
                  return;
                }
                try {
                  await attendanceApi.checkOut({
                    staffId: formData.staffId,
                    date: formData.checkOutDate,
                    location: 'Office'
                  });
                  loadAttendance();
                  loadStats();
                  alert('Check-out successful!');
                } catch (error) {
                  console.error('Error during check-out:', error);
                  alert('Check-out failed: ' + (error.response?.data?.message || error.message));
                }
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-abeze font-medium transition-colors duration-300"
            >
              Check Out
            </button>
          </div>
        </div>
      </div>

      {/* Attendance List */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
        <div className="p-6 border-b border-white/20">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-abeze font-bold text-white">
              {selectedDate === new Date().toISOString().split('T')[0] 
                ? "Today's Attendance Records" 
                : `Attendance Records for ${new Date(selectedDate).toLocaleDateString()}`
              }
            </h4>
            <button
              onClick={loadTodayAttendance}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg font-abeze font-medium transition-colors duration-300 flex items-center space-x-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="text-gray-300 font-abeze">Loading attendance records...</div>
          </div>
        ) : attendance.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-300 font-abeze">No attendance records found.</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Staff Member</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Date</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Check In</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Check Out</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Status</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Hours</th>
                  <th className="text-left py-4 px-6 text-green-200 font-abeze">Actions</th>
                </tr>
              </thead>
              <tbody>
                {attendance.slice(0, 10).map((record) => (
                  <tr key={record._id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6 text-white font-abeze">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <span className="text-blue-400 text-sm font-abeze">
                            {record.staffId?.firstName?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">
                            {record.staffId?.firstName} {record.staffId?.lastName}
                          </div>
                          <div className="text-sm text-gray-400">{record.staffId?.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-white font-abeze text-sm">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-white font-abeze text-sm">
                      {formatTime(record.checkIn?.time)}
                    </td>
                    <td className="py-4 px-6 text-white font-abeze text-sm">
                      {formatTime(record.checkOut?.time)}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-abeze ${getStatusColor(record.status)}`}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </td>
                                         <td className="py-4 px-6 text-white font-abeze text-sm">
                       <div className="flex items-center space-x-2">
                         <span className="font-medium">{formatHoursToHrsMins(record.totalHours || 0)}</span>
                         {record.checkIn?.time && record.checkOut?.time && (
                           <span className="text-xs text-gray-400">
                             ({formatTime(record.checkIn.time)} - {formatTime(record.checkOut.time)})
                           </span>
                         )}
                       </div>
                     </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(record)}
                          className="px-3 py-1 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded text-xs font-abeze transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(record._id)}
                          className="px-3 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded text-xs font-abeze transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Attendance Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] border border-gray-700 flex flex-col">
            {/* Modal Header - Fixed */}
            <div className="p-6 border-b border-gray-700 flex-shrink-0">
               <h3 className="text-xl font-abeze font-bold text-white">Add Attendance Record</h3>
               {isFormDisabled() && (
                 <div className="mt-2 p-2 bg-red-900/20 border border-red-500/50 rounded-lg">
                   <div className="flex items-center space-x-2">
                     <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                     </svg>
                     <span className="text-red-300 text-xs font-medium">
                       Form disabled: Staff member must check out before adding new record
                     </span>
                   </div>
                 </div>
               )}
             </div>
            
            {/* Modal Form - Scrollable */}
            <div className="flex-1 overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                             <div>
                 <label className="block text-gray-300 font-abeze text-sm mb-2">Staff Member</label>
                 <select
                   value={formData.staffId}
                   onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                   className={`w-full border rounded-lg px-4 py-2 text-white font-abeze focus:outline-none ${
                     isFormDisabled() 
                       ? 'bg-gray-700 border-gray-500 cursor-not-allowed' 
                       : 'bg-gray-800 border-gray-600 focus:border-blue-500'
                   }`}
                   required
                   disabled={isFormDisabled()}
                 >
                   <option value="">Select Staff Member</option>
                   {staff.map((member) => (
                     <option key={member._id} value={member._id}>
                       {member.firstName} {member.lastName} - {member.role}
                     </option>
                   ))}
                 </select>
                 
                 {/* Staff Session Status Display */}
                 {formData.staffId && staffSessionStatus[formData.staffId] && (
                   <div className={`mt-2 p-3 rounded-lg border ${
                     staffSessionStatus[formData.staffId].hasActiveSession 
                       ? 'bg-red-900/20 border-red-500/50' 
                       : 'bg-green-900/20 border-green-500/50'
                   }`}>
                     <div className="flex items-center space-x-2">
                       {checkingSession ? (
                         <svg className="w-4 h-4 text-blue-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                         </svg>
                       ) : staffSessionStatus[formData.staffId].hasActiveSession ? (
                         <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                         </svg>
                       ) : (
                         <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                         </svg>
                       )}
                       <span className={`text-xs font-medium ${
                         staffSessionStatus[formData.staffId].hasActiveSession 
                           ? 'text-red-300' 
                           : 'text-green-300'
                       }`}>
                         {checkingSession ? 'Checking session status...' : staffSessionStatus[formData.staffId].message}
                       </span>
                     </div>
                     
                     {/* Show current session details if active */}
                     {staffSessionStatus[formData.staffId].hasActiveSession && staffSessionStatus[formData.staffId].currentRecord && (
                       <div className="mt-2 text-xs text-red-200">
                         <p>Current session: {formatTime(staffSessionStatus[formData.staffId].currentRecord.checkIn.time)}</p>
                         <p>Date: {new Date(staffSessionStatus[formData.staffId].currentRecord.date).toLocaleDateString()}</p>
                       </div>
                     )}
                     
                     {/* Refresh button */}
                     <div className="mt-2 flex justify-end">
                       <button
                         type="button"
                         onClick={() => checkStaffSessionStatus(formData.staffId)}
                         disabled={checkingSession}
                         className="p-1 text-gray-400 hover:text-white transition-colors disabled:opacity-50 text-xs"
                         title="Refresh session status"
                       >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                         </svg>
                         Refresh
                       </button>
                     </div>
                   </div>
                 )}
               </div>
              
              <div>
                <label className="block text-gray-300 font-abeze text-sm mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white font-abeze focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-300 font-abeze text-sm mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    if (newStatus === 'absent') {
                      // Clear check-in/out times when status is absent
                      setFormData({ 
                        ...formData, 
                        status: newStatus,
                        checkInTime: '',
                        checkOutTime: '',
                        calculatedHours: 0,
                        timeError: ''
                      });
                    } else {
                      setFormData({ ...formData, status: newStatus });
                    }
                  }}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white font-abeze focus:outline-none focus:border-blue-500"
                  required
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                  <option value="half-day">Half Day</option>
                  <option value="leave">Leave</option>
                </select>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 font-abeze text-sm mb-2">Check In Date</label>
                    <input
                      type="date"
                      value={formData.checkInDate}
                      onChange={(e) => {
                        updateFormData({ checkInDate: e.target.value });
                      }}
                      className={`w-full border rounded-lg px-4 py-2 text-white font-abeze focus:outline-none ${
                        formData.status === 'absent' 
                          ? 'bg-gray-700 border-gray-500 cursor-not-allowed' 
                          : 'bg-gray-800 border-gray-600 focus:border-blue-500'
                      }`}
                      disabled={formData.status === 'absent'}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 font-abeze text-sm mb-2">Check In Time</label>
                    <input
                      type="time"
                      value={formData.checkInTime}
                      onChange={(e) => {
                        updateFormData({ checkInTime: e.target.value });
                      }}
                      className={`w-full border rounded-lg px-4 py-2 text-white font-abeze focus:outline-none ${
                        formData.status === 'absent' 
                          ? 'bg-gray-700 border-gray-500 cursor-not-allowed' 
                          : 'bg-gray-800 border-gray-600 focus:border-blue-500'
                      }`}
                      placeholder="HH:MM"
                      disabled={formData.status === 'absent'}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 font-abeze text-sm mb-2">Check Out Date</label>
                    <input
                      type="date"
                      value={formData.checkOutDate}
                      onChange={(e) => {
                        updateFormData({ checkOutDate: e.target.value });
                      }}
                      className={`w-full border rounded-lg px-4 py-2 text-white font-abeze focus:outline-none ${
                        formData.status === 'absent' 
                          ? 'bg-gray-700 border-gray-500 cursor-not-allowed' 
                          : 'bg-gray-800 border-gray-600 focus:border-blue-500'
                      }`}
                      disabled={formData.status === 'absent'}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 font-abeze text-sm mb-2">Check Out Time</label>
                    <input
                      type="time"
                      value={formData.checkOutTime}
                      onChange={(e) => {
                        updateFormData({ checkOutTime: e.target.value });
                      }}
                      className={`w-full border rounded-lg px-4 py-2 text-white font-abeze focus:outline-none ${
                        formData.status === 'absent' 
                          ? 'bg-gray-700 border-gray-500 cursor-not-allowed' 
                          : 'bg-gray-800 border-gray-600 focus:border-blue-500'
                      }`}
                      placeholder="HH:MM"
                      disabled={formData.status === 'absent'}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-300 font-abeze text-sm mb-2">Calculated Working Hours</label>
                  <input
                    type="text"
                    value={formatHoursToHrsMins(formData.calculatedHours)}
                    className={`w-full border rounded-lg px-4 py-2 text-white font-abeze focus:outline-none cursor-not-allowed ${
                      formData.timeError ? 'bg-red-900/20 border-red-500' : 'bg-gray-700 border-gray-600'
                    }`}
                    readOnly
                    disabled
                  />
                  <p className="text-xs text-gray-400 mt-1">Automatically calculated based on check-in and check-out times</p>
                  {formData.timeError && (
                    <p className="text-xs text-red-400 mt-1 font-medium">{formData.timeError}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-gray-300 font-abeze text-sm mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white font-abeze focus:outline-none focus:border-blue-500"
                  rows="3"
                  placeholder="Optional notes..."
                />
                </div>
              </form>
              </div>
              
            {/* Modal Footer - Fixed */}
            <div className="p-6 border-t border-gray-700 flex-shrink-0">
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-abeze font-medium transition-colors duration-300"
                >
                  Cancel
                </button>
                                 <button
                   type="submit"
                   disabled={isFormDisabled()}
                  onClick={handleSubmit}
                   className={`flex-1 px-4 py-2 rounded-lg font-abeze font-medium transition-colors duration-300 ${
                     isFormDisabled()
                       ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                       : 'bg-green-600 hover:bg-green-700 text-white'
                   }`}
                 >
                   Add Record
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

      

      {/* Edit Modal */}
      {showEditModal && selectedAttendance && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] border border-gray-700 flex flex-col">
            {/* Modal Header - Fixed */}
            <div className="p-6 border-b border-gray-700 flex-shrink-0">
              <h3 className="text-xl font-abeze font-bold text-white">Edit Attendance Record</h3>
            </div>
            
            {/* Modal Form - Scrollable */}
            <div className="flex-1 overflow-y-auto">
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
                             <div>
                 <label className="block text-gray-300 font-abeze text-sm mb-2">Staff Member</label>
                 <select
                   value={formData.staffId}
                   onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                   className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white font-abeze focus:outline-none focus:border-blue-500"
                   required
                 >
                   {staff.map((member) => (
                     <option key={member._id} value={member._id}>
                       {member.firstName} {member.lastName} - {member.role}
                     </option>
                   ))}
                 </select>
                 
                 {/* Staff Session Status Display */}
                 {formData.staffId && staffSessionStatus[formData.staffId] && (
                   <div className={`mt-2 p-3 rounded-lg border ${
                     staffSessionStatus[formData.staffId].hasActiveSession 
                       ? 'bg-red-900/20 border-red-500/50' 
                       : 'bg-green-900/20 border-green-500/50'
                   }`}>
                     <div className="flex items-center space-x-2">
                       {checkingSession ? (
                         <svg className="w-4 h-4 text-blue-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                         </svg>
                       ) : staffSessionStatus[formData.staffId].hasActiveSession ? (
                         <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                         </svg>
                       ) : (
                         <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                         </svg>
                       )}
                       <span className={`text-xs font-medium ${
                         staffSessionStatus[formData.staffId].hasActiveSession 
                           ? 'text-red-300' 
                           : 'text-green-300'
                       }`}>
                         {checkingSession ? 'Checking session status...' : staffSessionStatus[formData.staffId].message}
                       </span>
                     </div>
                     
                     {/* Show current session details if active */}
                     {staffSessionStatus[formData.staffId].hasActiveSession && staffSessionStatus[formData.staffId].currentRecord && (
                       <div className="mt-2 text-xs text-red-200">
                         <p>Current session: {formatTime(staffSessionStatus[formData.staffId].currentRecord.checkIn.time)}</p>
                         <p>Date: {new Date(staffSessionStatus[formData.staffId].currentRecord.date).toLocaleDateString()}</p>
                         <p className="text-yellow-300 mt-1">Note: You can edit this record to check out the staff member.</p>
                       </div>
                     )}
                   </div>
                 )}
               </div>
              
              <div>
                <label className="block text-gray-300 font-abeze text-sm mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white font-abeze focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-300 font-abeze text-sm mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    if (newStatus === 'absent') {
                      // Clear check-in/out times when status is absent
                      setFormData({ 
                        ...formData, 
                        status: newStatus,
                        checkInTime: '',
                        checkOutTime: '',
                        calculatedHours: 0,
                        timeError: ''
                      });
                    } else {
                      setFormData({ ...formData, status: newStatus });
                    }
                  }}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white font-abeze focus:outline-none focus:border-blue-500"
                  style={{
                    color: 'white',
                    backgroundColor: '#1f2937'
                  }}
                  required
                >
                  <option 
                    value="present"
                    style={{
                      backgroundColor: '#1f2937',
                      color: 'white'
                    }}
                  >
                    Present
                  </option>
                  <option 
                    value="absent"
                    style={{
                      backgroundColor: '#1f2937',
                      color: 'white'
                    }}
                  >
                    Absent
                  </option>
                  <option 
                    value="late"
                    style={{
                      backgroundColor: '#1f2937',
                      color: 'white'
                    }}
                  >
                    Late
                  </option>
                  <option 
                    value="half-day"
                    style={{
                      backgroundColor: '#1f2937',
                      color: 'white'
                    }}
                  >
                    Half Day
                  </option>
                  <option 
                    value="leave"
                    style={{
                      backgroundColor: '#1f2937',
                      color: 'white'
                    }}
                  >
                    Leave
                  </option>
                </select>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 font-abeze text-sm mb-2">Check In Date</label>
                    <input
                      type="date"
                      value={formData.checkInDate}
                      onChange={(e) => {
                        updateFormData({ checkInDate: e.target.value });
                      }}
                      className={`w-full border rounded-lg px-4 py-2 text-white font-abeze focus:outline-none ${
                        formData.status === 'absent' 
                          ? 'bg-gray-700 border-gray-500 cursor-not-allowed' 
                          : 'bg-gray-800 border-gray-600 focus:border-blue-500'
                      }`}
                      disabled={formData.status === 'absent'}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 font-abeze text-sm mb-2">Check In Time</label>
                    <input
                      type="time"
                      value={formData.checkInTime}
                      onChange={(e) => {
                        updateFormData({ checkInTime: e.target.value });
                      }}
                      className={`w-full border rounded-lg px-4 py-2 text-white font-abeze focus:outline-none ${
                        formData.status === 'absent' 
                          ? 'bg-gray-700 border-gray-500 cursor-not-allowed' 
                          : 'bg-gray-800 border-gray-600 focus:border-blue-500'
                      }`}
                      placeholder="HH:MM"
                      disabled={formData.status === 'absent'}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 font-abeze text-sm mb-2">Check Out Date</label>
                    <input
                      type="date"
                      value={formData.checkOutDate}
                      onChange={(e) => {
                        updateFormData({ checkOutDate: e.target.value });
                      }}
                      className={`w-full border rounded-lg px-4 py-2 text-white font-abeze focus:outline-none ${
                        formData.status === 'absent' 
                          ? 'bg-gray-700 border-gray-500 cursor-not-allowed' 
                          : 'bg-gray-800 border-gray-600 focus:border-blue-500'
                      }`}
                      disabled={formData.status === 'absent'}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 font-abeze text-sm mb-2">Check Out Time</label>
                    <input
                      type="time"
                      value={formData.checkOutTime}
                      onChange={(e) => {
                        updateFormData({ checkOutTime: e.target.value });
                      }}
                      className={`w-full border rounded-lg px-4 py-2 text-white font-abeze focus:outline-none ${
                        formData.status === 'absent' 
                          ? 'bg-gray-700 border-gray-500 cursor-not-allowed' 
                          : 'bg-gray-800 border-gray-600 focus:border-blue-500'
                      }`}
                      placeholder="HH:MM"
                      disabled={formData.status === 'absent'}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-300 font-abeze text-sm mb-2">Calculated Working Hours</label>
                  <input
                    type="text"
                    value={formatHoursToHrsMins(formData.calculatedHours)}
                    className={`w-full border rounded-lg px-4 py-2 text-white font-abeze focus:outline-none cursor-not-allowed ${
                      formData.timeError ? 'bg-red-900/20 border-red-500' : 'bg-gray-700 border-gray-600'
                    }`}
                    readOnly
                    disabled
                  />
                  <p className="text-xs text-gray-400 mt-1">Automatically calculated based on check-in and check-out times</p>
                  {formData.timeError && (
                    <p className="text-xs text-red-400 mt-1 font-medium">{formData.timeError}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-gray-300 font-abeze text-sm mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white font-abeze focus:outline-none focus:border-blue-500"
                  rows="3"
                  placeholder="Optional notes..."
                />
                </div>
              </form>
              </div>
              
            {/* Modal Footer - Fixed */}
            <div className="p-6 border-t border-gray-700 flex-shrink-0">
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-abeze font-medium transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleUpdate}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-abeze font-medium transition-colors duration-300"
                >
                  Update Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Daily Report Modal */}
      {showDailyReport && dailyReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full border border-gray-700 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-abeze font-bold text-white">Daily Attendance Report</h3>
                <div className="flex space-x-3">
                  <button
                    onClick={downloadDailyReportPDF}
                    disabled={generatingPDF}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white px-4 py-2 rounded-lg font-abeze font-medium transition-colors duration-300 flex items-center space-x-2"
                  >
                    {generatingPDF ? (
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                    <span>{generatingPDF ? 'Generating...' : 'Download PDF'}</span>
                  </button>
                  <button
                    onClick={() => setShowDailyReport(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-abeze font-medium transition-colors duration-300"
                  >
                    Close
                  </button>
                </div>
              </div>
              
              {/* Date Selector */}
              <div className="mt-4 flex items-center space-x-4">
                <label className="text-gray-300 font-abeze text-sm">Report Date:</label>
                <input
                  type="date"
                  value={dailyReportDate}
                  onChange={(e) => setDailyReportDate(e.target.value)}
                  className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white font-abeze focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={loadDailyReport}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-abeze font-medium transition-colors duration-300"
                >
                  Refresh
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Summary Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-600/20 border border-blue-500/50 rounded-lg p-4">
                  <p className="text-blue-200 font-abeze text-sm">Total Staff</p>
                  <p className="text-2xl font-abeze font-bold text-white">{dailyReport.totalStaff}</p>
                </div>
                <div className="bg-green-600/20 border border-green-500/50 rounded-lg p-4">
                  <p className="text-green-200 font-abeze text-sm">Present</p>
                  <p className="text-2xl font-abeze font-bold text-white">{dailyReport.presentCount}</p>
                </div>
                <div className="bg-red-600/20 border border-red-500/50 rounded-lg p-4">
                  <p className="text-red-200 font-abeze text-sm">Absent</p>
                  <p className="text-2xl font-abeze font-bold text-white">{dailyReport.absentCount}</p>
                </div>
                <div className="bg-yellow-600/20 border border-yellow-500/50 rounded-lg p-4">
                  <p className="text-yellow-200 font-abeze text-sm">Late</p>
                  <p className="text-2xl font-abeze font-bold text-white">{dailyReport.lateCount}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-orange-600/20 border border-orange-500/50 rounded-lg p-4">
                  <p className="text-orange-200 font-abeze text-sm">Half Day</p>
                  <p className="text-2xl font-abeze font-bold text-white">{dailyReport.halfDayCount}</p>
                </div>
                <div className="bg-purple-600/20 border border-purple-500/50 rounded-lg p-4">
                  <p className="text-purple-200 font-abeze text-sm">Leave</p>
                  <p className="text-2xl font-abeze font-bold text-white">{dailyReport.leaveCount}</p>
                </div>
                <div className="bg-indigo-600/20 border border-indigo-500/50 rounded-lg p-4">
                  <p className="text-indigo-200 font-abeze text-sm">Total Hours</p>
                  <p className="text-2xl font-abeze font-bold text-white">{dailyReport.totalWorkingHours}</p>
                </div>
                <div className="bg-teal-600/20 border border-teal-500/50 rounded-lg p-4">
                  <p className="text-teal-200 font-abeze text-sm">Avg Hours</p>
                  <p className="text-2xl font-abeze font-bold text-white">{dailyReport.averageWorkingHours}</p>
                </div>
              </div>
              
              {/* Detailed Attendance Table */}
              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-700">
                  <h4 className="text-lg font-abeze font-semibold text-white">Detailed Attendance</h4>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Staff Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Check In</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Check Out</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Hours</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                      {dailyReport.attendance.map((record, index) => (
                        <tr key={index} className="hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                            {record.staffName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {record.role}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              record.status === 'present' ? 'bg-green-500 text-white' :
                              record.status === 'absent' ? 'bg-red-500 text-white' :
                              record.status === 'late' ? 'bg-yellow-500 text-white' :
                              record.status === 'half-day' ? 'bg-orange-500 text-white' :
                              'bg-purple-500 text-white'
                            }`}>
                              {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {record.checkIn}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {record.checkOut}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                            {record.totalHours} hrs
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {record.notes}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
