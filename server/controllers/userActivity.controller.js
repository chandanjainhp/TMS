import { UserActivity } from "../models/userActivity.model.js";
import { User } from "../models/user.model.js";

// Log user activity
export const logUserActivity = async (req, res) => {
  try {
    const { action, details, page } = req.body;
    const userId = req.userId;

    if (!userId || !action) {
      return res.status(400).json({
        success: false,
        message: "User ID and action are required",
      });
    }

    const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];

    const activity = new UserActivity({
      userId,
      action,
      details: details || {},
      page: page || "",
      ipAddress,
      userAgent,
    });

    await activity.save();

    res.status(201).json({
      success: true,
      message: "Activity logged successfully",
      activity,
    });
  } catch (error) {
    console.error("Error logging user activity:", error);
    res.status(500).json({
      success: false,
      message: "Error logging user activity",
      error: error.message,
    });
  }
};

// Get user activity logs
export const getUserActivities = async (req, res) => {
  try {
    const { startDate, endDate, action, userId } = req.query;

    // Build query
    const query = {};

    // Filter by date range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const endDateObj = new Date(endDate);
        endDateObj.setDate(endDateObj.getDate() + 1);
        query.createdAt.$lte = endDateObj;
      }
    }

    if (action) {
      query.action = action;
    }

    if (req.userId) {
      const user = await User.findById(req.userId);
      const isSuperAdmin = user.role === 'principal' || user.role === 'superAdmin';
      const isHOD = user.role === 'admin' && user.department && user.department !== 'Global';

      // 1. Scoping Logic
      if (isSuperAdmin) {
        // Can see all. If userId filter provided, use it.
        if (userId) query.userId = userId;
      } else if (isHOD) {
        // Can see Dept Users.
        // Find all users in Dept
        const deptUsers = await User.find({ department: user.department }).select('_id');
        const deptUserIds = deptUsers.map(u => u._id);

        // If specific userId requested, check if it's in dept
        if (userId) {
          // Check if string userId is in deptUserIds array (need string comparison)
          if (deptUserIds.some(id => id.toString() === userId)) {
            query.userId = userId;
          } else {
            return res.status(200).json({ success: true, count: 0, data: [] }); // Not authorized to see this user
          }
        } else {
          // Show all dept users
          query.userId = { $in: deptUserIds };
        }
      } else {
        // Regular user: Only own
        query.userId = req.userId;
      }
    }

    // Get activities with user details
    const activities = await UserActivity.find(query)
      .sort({ createdAt: -1 })
      .populate("userId", "name email department role") // Added department/role
      .lean();

    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (error) {
    console.error("Error getting user activities:", error);
    res.status(500).json({
      success: false,
      message: "Error getting user activities",
      error: error.message,
    });
  }
};

// Get activity statistics
export const getActivityStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Build date range filter
    const matchFilter = {};
    if (startDate || endDate) {
      matchFilter.createdAt = {};
      if (startDate) {
        matchFilter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const endDateObj = new Date(endDate);
        endDateObj.setDate(endDateObj.getDate() + 1);
        matchFilter.createdAt.$lte = endDateObj;
      }
    }

    // SCOPING
    if (req.userId) {
      const user = await User.findById(req.userId);
      const isSuperAdmin = user.role === 'principal' || user.role === 'superAdmin';
      const isHOD = user.role === 'admin' && user.department && user.department !== 'Global';

      if (!isSuperAdmin) {
        if (isHOD) {
          const deptUsers = await User.find({ department: user.department }).select('_id');
          const deptUserIds = deptUsers.map(u => u._id);
          matchFilter.userId = { $in: deptUserIds };
        } else {
          matchFilter.userId = user._id; // Regular user sees own stats
        }
      }
    }

    // Get count by action type
    const actionStats = await UserActivity.aggregate([
      { $match: matchFilter },
      { $group: { _id: "$action", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get count by day
    const dailyStats = await UserActivity.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get most active users
    const userStats = await UserActivity.aggregate([
      { $match: matchFilter },
      { $group: { _id: "$userId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Get user details for most active users
    const userIds = userStats.map(stat => stat._id);
    const users = await User.find({ _id: { $in: userIds } }, "name email");

    // Map user details to stats
    const userStatsWithDetails = userStats.map(stat => {
      const user = users.find(u => u._id.toString() === stat._id.toString());
      return {
        userId: stat._id,
        count: stat.count,
        name: user ? user.name : "Unknown",
        email: user ? user.email : "Unknown"
      };
    });

    res.status(200).json({
      success: true,
      data: {
        actionStats,
        dailyStats,
        userStats: userStatsWithDetails
      }
    });
  } catch (error) {
    console.error("Error getting activity statistics:", error);
    res.status(500).json({
      success: false,
      message: "Error getting activity statistics",
      error: error.message,
    });
  }
};
