import User from '../models/User.js';
import AnalyticsEvent from '../models/AnalyticsEvent.js';

/**
 * Get user analytics for admin dashboard
 * Returns total users, new users in last 7 days, active users, and user distribution by plan
 */
export const getUserAnalytics = async (req, res) => {
  console.log('getUserAnalytics called by user:', req.user?._id);
  
  try {
    // Calculate date 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    // Calculate date 30 days ago for active users
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    console.log('Fetching analytics data...');
    
    // Run all analytics queries in parallel
    const [
      totalUsers,
      newUsersLast7Days,
      activeUsers,
      usersByRole
    ] = await Promise.all([
      // Total users count
      User.countDocuments({}).exec(),
      
      // New users in last 7 days
      User.countDocuments({
        createdAt: { $gte: sevenDaysAgo }
      }).exec(),
      
      // Active users (logged in within last 30 days)
      User.countDocuments({
        lastLogin: { $gte: thirtyDaysAgo }
      }).exec(),
      
      // Users by role (plan)
      User.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 }
          }
        }
      ]).exec()
    ]);

    console.log('Analytics data fetched:', {
      totalUsers,
      newUsersLast7Days,
      activeUsers,
      usersByRole
    });

    // Format users by role into the expected structure
    const roleMap = usersByRole.reduce((acc, { _id, count }) => ({
      ...acc,
      [_id]: count
    }), { customer: 0, admin: 0, driver: 0 });

    // Get recent user activity
    const recentActivity = await AnalyticsEvent.aggregate([
      {
        $match: {
          type: { $in: ['user_registered', 'login', 'purchase'] },
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          type: 1,
          userId: 1,
          userName: { $concat: ['$user.firstName', ' ', '$user.lastName'] },
          userEmail: '$user.email',
          timestamp: '$createdAt',
          productId: 1,
          orderId: 1,
          amount: 1
        }
      },
      { $sort: { timestamp: -1 } },
      { $limit: 10 }
    ]);

    // Format the response
    const response = {
      success: true,
      data: {
        totalUsers,
        newUsersLast7Days,
        activeUsers,
        usersByPlan: {
          free: roleMap.customer || 0,
          premium: roleMap.driver || 0, // Assuming drivers are premium users
          enterprise: roleMap.admin || 0 // Assuming admins are enterprise users
        },
        recentActivity: [] // We'll add this later
      }
    };

    console.log('Sending response:', response);
    res.json(response.data);
  } catch (error) {
    console.error('Error in getUserAnalytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Get detailed user list with pagination and filtering for admin
 */
export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const query = {};
    
    // Filter by search term
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { phone: searchRegex }
      ];
    }
    
    // Filter by role
    if (req.query.role) {
      query.role = req.query.role;
    }
    
    // Filter by status
    if (req.query.isActive) {
      query.isActive = req.query.isActive === 'true';
    }
    
    // Get total count for pagination
    const total = await User.countDocuments(query);
    
    // Get paginated users
    const users = await User.find(query)
      .select('-password -emailVerificationToken -passwordResetToken -passwordResetExpires')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    res.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

/**
 * Update user status (active/inactive)
 */
export const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;
    
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isActive must be a boolean value'
      });
    }
    
    // Prevent deactivating own account
    if (userId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update your own status'
      });
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true, runValidators: true }
    );
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        _id: user._id,
        email: user.email,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user status',
      error: error.message
    });
  }
};
