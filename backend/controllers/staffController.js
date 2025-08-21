import mongoose from "mongoose";
import Staff from "../models/Staff.js";
import { uploadToImgBB } from "../config/imgbb.js";
import jwt from "jsonwebtoken";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET || "dev_secret_change_me";
  return secret;
};

// Get all staff (admin only)
export const getAllStaff = async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const staff = await Staff.find({}).select('-passwordHash').sort({ createdAt: -1 });
    return res.json(staff);
  } catch (err) {
    next(err);
  }
};

// Get staff by ID
export const getStaffById = async (req, res, next) => {
  try {
    const staffData = await Staff.findById(req.params.id).select('-passwordHash');
    if (!staffData) {
      return res.status(404).json({ message: "Staff not found" });
    }
    return res.json(staffData);
  } catch (err) {
    next(err);
  }
};

// Create new staff member (admin only)
export const createStaff = async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      role,
      specialization,
      experience,
      licenseNumber,
      basicSalary
    } = req.body;

    console.log('Received staff creation data:', {
      role,
      basicSalary,
      basicSalaryType: typeof basicSalary,
      basicSalaryFalsy: !basicSalary,
      basicSalaryUndefined: basicSalary === undefined,
      basicSalaryNull: basicSalary === null,
      basicSalaryZero: basicSalary === 0
    });

    if (!firstName || !lastName || !email || !password || !phone || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if email already exists
    const existingStaff = await Staff.findOne({ email });
    if (existingStaff) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Set basic salary based on role if not provided
    let finalBasicSalary = basicSalary;
    
    // Only override if basicSalary is truly undefined or null
    if (basicSalary === undefined || basicSalary === null) {
      finalBasicSalary = role === 'driver' ? 75000 : 50000;
      console.log('Salary was undefined/null, set to:', finalBasicSalary);
    } else {
      console.log('Salary was provided, keeping as:', finalBasicSalary);
    }

    console.log('Final basic salary calculation:', {
      originalBasicSalary: basicSalary,
      finalBasicSalary,
      role,
      willUseProvided: finalBasicSalary === basicSalary,
      willUseCalculated: finalBasicSalary !== basicSalary
    });

    const newStaff = await Staff.create({
      firstName,
      lastName,
      email,
      passwordHash: password, // Will be hashed by pre-save middleware
      phone,
      role,
      specialization,
      experience: Number(experience) || 0,
      licenseNumber,
      basicSalary: finalBasicSalary
      // createdBy field is optional and will be null by default
    });

    // Return staff data without password
    const staffData = newStaff.toObject();
    delete staffData.passwordHash;

    return res.status(201).json(staffData);
  } catch (err) {
    next(err);
  }
};

// Update staff member (admin only)
export const updateStaff = async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      role,
      specialization,
      experience,
      licenseNumber,
      isActive,
      basicSalary
    } = req.body;

    const staffData = await Staff.findById(req.params.id);
    if (!staffData) {
      return res.status(404).json({ message: "Staff not found" });
    }

    // Check if email is being changed and if it already exists
    if (email && email !== staffData.email) {
      const existingStaff = await Staff.findOne({ email });
      if (existingStaff) {
        return res.status(400).json({ message: "Email already registered" });
      }
    }

    // Set basic salary based on role if not provided
    let finalBasicSalary = basicSalary;
    if (finalBasicSalary === undefined || finalBasicSalary === null) {
      finalBasicSalary = role === 'driver' ? 75000 : 50000;
    }

    const updatedStaff = await Staff.findByIdAndUpdate(
      req.params.id,
      {
        firstName,
        lastName,
        email,
        phone,
        role,
        specialization,
        experience: Number(experience) || 0,
        licenseNumber,
        isActive,
        basicSalary: finalBasicSalary
      },
      { new: true, runValidators: true }
    ).select('-passwordHash');

    return res.json(updatedStaff);
  } catch (err) {
    next(err);
  }
};

// Delete staff member (admin only)
export const deleteStaff = async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const staffData = await Staff.findById(req.params.id);
    if (!staffData) {
      return res.status(404).json({ message: "Staff not found" });
    }

    // Import required models for cleanup
    const Attendance = (await import("../models/Attendance.js")).default;
    const Payroll = (await import("../models/Payroll.js")).default;
    const Booking = (await import("../models/Booking.js")).default;

    // Clean up related records before deleting staff
    await Promise.all([
      // Delete attendance records
      Attendance.deleteMany({ staffId: req.params.id }),
      // Delete payroll records
      Payroll.deleteMany({ staffId: req.params.id }),
      // Remove staff assignments from bookings
      Booking.updateMany(
        { assignedDriver: req.params.id },
        { $unset: { assignedDriver: "" } }
      ),
      Booking.updateMany(
        { assignedTourGuide: req.params.id },
        { $unset: { assignedTourGuide: "" } }
      )
    ]);

    // Now delete the staff member
    await Staff.findByIdAndDelete(req.params.id);
    
    return res.json({ message: "Staff deleted successfully along with all related records" });
  } catch (err) {
    next(err);
  }
};

// Staff login
export const staffLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }



    // Check in Staff collection first
    let staff = await Staff.findOne({ email });
    let userType = 'staff';

    // If not found in Staff, check in User collection for admin/staff roles
    if (!staff) {
      const User = (await import("../models/User.js")).default;
      const bcrypt = (await import("bcryptjs")).default;
      
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check if user is staff or admin
      if (user.role !== 'admin' && user.role !== 'staff') {
        return res.status(403).json({ message: "Access denied. Staff login only." });
      }

      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Convert user to staff format
      staff = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        isActive: true,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
      userType = user.role;
    } else {
      // Staff found in Staff collection
      if (!staff.isActive) {
        return res.status(401).json({ message: "Account is deactivated" });
      }

      const isPasswordValid = await staff.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: staff._id, 
        email: staff.email, 
        role: staff.role,
        userType: userType
      },
      getJwtSecret(),
      { expiresIn: '24h' }
    );

    // Return staff data without password
    const staffData = staff.toObject ? staff.toObject() : staff;
    if (staffData.passwordHash) {
      delete staffData.passwordHash;
    }

    return res.json({
      token,
      user: staffData
    });
  } catch (err) {
    next(err);
  }
};

// Upload staff profile picture
export const uploadStaffProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const staffId = req.params.id;
    const staffData = await Staff.findById(staffId);
    if (!staffData) {
      return res.status(404).json({ message: "Staff not found" });
    }

    // Upload image to ImgBB
    const filename = `staff_${staffId}_${Date.now()}`;
    const uploadResult = await uploadToImgBB(req.file.buffer, filename);

    // Update staff with new image
    const updatedStaff = await Staff.findByIdAndUpdate(
      staffId,
      {
        profilePicture: {
          url: uploadResult.url,
          deleteUrl: uploadResult.deleteUrl,
          id: uploadResult.id,
        }
      },
      { new: true, runValidators: true }
    ).select('-passwordHash');

    return res.json({
      staff: updatedStaff,
      message: "Profile picture uploaded successfully"
    });
  } catch (err) {
    console.error('Error in uploadStaffProfilePicture:', err);
    next(err);
  }
};

// Toggle staff active status
export const toggleStaffStatus = async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const staffData = await Staff.findById(req.params.id);
    if (!staffData) {
      return res.status(404).json({ message: "Staff not found" });
    }

    staffData.isActive = !staffData.isActive;
    await staffData.save();

    const updatedStaff = staffData.toObject();
    delete updatedStaff.passwordHash;

    return res.json(updatedStaff);
  } catch (err) {
    next(err);
  }
};
