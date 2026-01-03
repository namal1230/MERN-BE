import Users from "../models/CustomerModel"
import {Request,Response} from "express"
import Phosts from "../models/PhostsModel"
import Email from "../models/EmailModel"
import { sendLoginResponse } from "../services/email.service"

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

export const deactivateEmail = async (req: Request, res: Response) => {
  try {
    const emailId = req.query.emailId as string;
    const message = (req.query.message as string) || "";

    if (!emailId) {
      return res.status(400).json({ message: "Email ID is required" });
    }

    const updatedEmail = await Email.findByIdAndUpdate(
      emailId,
      { status: false },
      { new: true }
    );

    if (!updatedEmail) {
      return res.status(404).json({ message: "Email not found" });
    }

    if (message.trim() && updatedEmail.email) {
      await sendLoginResponse({
        email: updatedEmail.email,
        description: message.trim(),
      });
    }

    res.status(200).json({
      message: "Email status set to false",
      email: updatedEmail,
    });
  } catch (error) {
    console.error("Error deactivating email:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
