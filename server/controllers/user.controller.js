import { User } from "../models/user.model.js";

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    // Check if the requesting user is an admin
    // Use req.user if available (from verifyToken/isAdmin), otherwise fetch
    const requestingUser = req.user || await User.findById(req.userId);

    if (!requestingUser || requestingUser.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required."
      });
    }

    // Get query parameters for filtering
    const { startDate, endDate } = req.query;

    // Build query
    const query = {};
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    // HOD Scope Restriction
    if (requestingUser.department && requestingUser.department !== 'Global') {
      query.department = requestingUser.department;
    }

    // Find all users, exclude sensitive fields
    const users = await User.find(query)
      .select('-password -resetPasswordToken -resetPasswordExpiresAt -verificationToken -verificationTokenExpiresAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({
      success: false,
      message: "Error getting users",
      error: error.message
    });
  }
};

// Get user by ID (admin only or own profile)
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const requestingUserId = req.userId;

    // Check if user is requesting their own profile or is an admin
    const requestingUser = await User.findById(requestingUserId);
    const isAdmin = requestingUser && requestingUser.role === 'admin';
    const isOwnProfile = id === requestingUserId;

    if (!isAdmin && !isOwnProfile) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only view your own profile unless you're an admin."
      });
    }

    const user = await User.findById(id)
      .select('-password -resetPasswordToken -resetPasswordExpiresAt -verificationToken -verificationTokenExpiresAt');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({
      success: false,
      message: "Error getting user",
      error: error.message
    });
  }
};

// Get user stats (admin only)
export const getUserStats = async (req, res) => {
  try {
    // Check if the requesting user is an admin
    const requestingUser = req.user || await User.findById(req.userId);
    if (!requestingUser || requestingUser.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required."
      });
    }

    // HOD Filter
    const filter = {};
    if (requestingUser.department && requestingUser.department !== 'Global') {
      filter.department = requestingUser.department;
    }

    // Get total user count
    const totalUsers = await User.countDocuments(filter);

    // Get verified users count
    const verifiedUsers = await User.countDocuments({ ...filter, isVerified: true });

    // Get users registered in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsers = await User.countDocuments({ ...filter, createdAt: { $gte: thirtyDaysAgo } });

    // Get users who logged in in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const activeUsers = await User.countDocuments({ ...filter, lastLogin: { $gte: sevenDaysAgo } });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        verifiedUsers,
        newUsers,
        activeUsers
      }
    });
  } catch (error) {
    console.error("Error getting user stats:", error);
    res.status(500).json({
      success: false,
      message: "Error getting user stats",
      error: error.message
    });
  }
};
