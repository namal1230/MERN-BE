import Users from "../models/CustomerModel"
import {Request,Response} from "express"
import Phosts from "../models/PhostsModel"

export const getDashboardStats = async (req:Request, res:Response) => {
  try {
    const [validUsers, rejectedUsers, reportedUsers] = await Promise.all([
      Users.countDocuments({ status: 'VALID' }),
      Users.countDocuments({ status: 'REJECTED' }),
      Users.countDocuments({ status: 'Reported' }),
    ]);

    const phostStats = await Phosts.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const phosts = {
      published: 0,
      unlisted: 0,
      pending: 0,
    };

    phostStats.forEach((p) => {
      if (p._id === 'published') phosts.published = p.count;
      if (p._id === 'archived') phosts.unlisted = p.count;
      if (p._id === 'pending') phosts.pending = p.count;
    });

    res.json({
      users: {
        valid: validUsers,
        rejected: rejectedUsers,
        reported: reportedUsers
      },
      phosts,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
