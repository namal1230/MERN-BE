import Users from "../models/CustomerModel"
import { Request, Response } from "express"
import Phosts from "../models/PhostsModel"
import Email from "../models/EmailModel"
import { sendLoginResponse, sendRejectedAccount } from "../services/email.service"
import Report from "../models/ReportedPhostModel"

export const getDashboardStats = async (req: Request, res: Response) => {
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

export const getReportedUsers = async (req: Request, res: Response) => {
 try {
    const reportedUsers = await (Report as any).aggregate([

      {
        $match: {
          reportType: "USER",
          status: true
        }
      },

      {
        $lookup: {
          from: "phosts",
          localField: "phostId",
          foreignField: "_id",
          as: "phost"
        }
      },

      { $unwind: { path: "$phost", preserveNullAndEmptyArrays: false } },

      {
        $lookup: {
          from: "users",
          localField: "phost.username",
          foreignField: "name",
          as: "user"
        }
      },

      { $unwind: { path: "$user", preserveNullAndEmptyArrays: false } },

      {
        $group: {
          _id: "$user._id",
          user: { $first: "$user" },
          reportId: { $first: "$_id" }
        }
      },

      {
        $addFields: {
          "user.reportId": "$reportId"
        }
      },
      {
        $replaceRoot: { newRoot: "$user" }
      }
    ]);

    return res.status(200).json({
      count: reportedUsers.length,
      users: reportedUsers
    });
  } catch (error) {
    console.error("Aggregation Error:", error);
    return res.status(500).json({
      message: "Failed to fetch reported users"
    });
  }
};

export const rejectUserByName = async (req: Request, res: Response) => {
  try {
    const { name,reportId } = req.query;

    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "Name is required and must be a string" });
    }


    const user = await Users.findOneAndUpdate(
      { name: name },
      { $set: { status: "REJECTED" } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: `User with name "${name}" not found` });
    }

     if (!reportId) {
      return res.status(400).json({ message: "Report ID is required" });
    }

    const updatedReport = await Report.findOneAndUpdate(
      { _id: reportId },
      { $set: { status: false } },
      { new: true }
    );

     if (!updatedReport) {
      return res.status(404).json({ message: "Report not found" });
    }


    await sendRejectedAccount({ email: user.email, description:`Your Account Has Been Restricted BY ADMIN \n Date: ${new Date().getDate()}` });

    return res.status(200).json({ message: `User "${name}" rejected successfully`, user });
  } catch (error) {
    console.error("Error rejecting user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};