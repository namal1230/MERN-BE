import { Request, Response } from "express";
import Phosts, { IBodyBlock } from "../models/PhostsModel";
import mongoose from "mongoose";
import { sendLoginEmails, sendReactionEmails } from "../services/email.service";
import Reaction from "../models/ReactionModel";
import Report from "../models/ReportedPhostModel"
export interface Draft {
  _id: string;
  title: string;
  createdAt: string;
  image?: string | null;
}

export const savePhost = async (req: Request, res: Response) => {

  try {
    console.log(req.body);
    const { title, body, code, name, email } = req.body;

    if (!title || !Array.isArray(body) || !name || !email) {
      return res.status(400).json({
        message: "Required fields are missing"
      });
    }

    const cleanedBody = body.filter(
      (block: any) => block.value && block.value.trim() !== ""
    );

    const newPhost = await Phosts.create({
      title,
      body: cleanedBody,
      code,
      username: name,
      email
    });

    if (typeof title !== "string") return;
    const status: string = "phost-upload";
    await sendLoginEmails({ email, description: title, status })

    res.status(200).json({ message: "Phosts saved Successfully", data: newPhost });

  } catch (err) {
    console.error("Phosts saved failed:", err);
    return res.status(500).json({
      message: "Internal Server Error",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
}

export const getDraftPhosts = async (req: Request, res: Response) => {
  console.log("request catched");
  try {
    let { name, email, status } = req.query;
    console.log("request catched", name, email,status);
    if (!name || !email || !status) {
      return res.status(400).json({
        message: "username and email and status are required"
      });
    }

    if(status === "unlisted"){
      status="archived";
    }
    const drafts = await Phosts.aggregate([
      {
        $match: {
          username: name,
          email,
          status
        }
      },

      {
        $addFields: {
          firstImage: {
            $first: {
              $filter: {
                input: "$body",
                as: "block",
                cond: {
                  $in: ["$$block.type", ["IMG", "UNSPLASH"]]
                }
              }
            }
          }
        }
      },

      {
        $project: {
          title: 1,
          createdAt: 1,
          image: "$firstImage.value"
        }
      },

      {
        $sort: { createdAt: -1 }
      }
    ]);

    res.status(200).json(drafts);
  } catch (error) {
    console.error("Failed to fetch draft phosts:", error);
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
}

export const getDraftPhost = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        message: "phost id is required"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "invalid phost id"
      });
    }

    const phost = await Phosts.findOne({
      _id: id
    });

    if (!phost) {
      return res.status(404).json({
        message: "phost not found"
      });
    }

    res.status(200).json(phost);

  } catch (error) {
    console.error("Failed to fetch draft phost:", error);
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

export const getReportByPhostId = async (req: Request, res: Response) => {
  try {
    const { phostId } = req.query;

    if (!phostId || typeof phostId !== "string") {
      return res.status(400).json({ message: "phostId is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(phostId)) {
      return res.status(400).json({ message: "invalid phostId" });
    }

    const report = await Report.findOne({ _id: phostId })
      .populate("phostId")
      .exec();

    if (!report) {
      return res.status(404).json({ message: "report not found for this phost" });
    }

    const phost = await Phosts.findById(report.phostId).exec();

    if (!phost) {
      return res.status(404).json({ message: "Phost not found for this report" });
    }

    res.status(200).json({
      title: phost.title,
      body: phost.body,
      code: phost.code || "",
      createdAt: phost.createdAt,
      updatedAt: phost.updatedAt,
      status: phost.status,
    });

  } catch (error) {
    console.error("Failed to fetch report:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deactivateReportedPhost = async (req: Request, res: Response) => {
  try {
    const { phostId } = req.query;

    if (!phostId || typeof phostId !== "string") {
      return res.status(400).json({ message: "phostId is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(phostId)) {
      return res.status(400).json({ message: "invalid phostId" });
    }

    const updatedReport = await Report.findOneAndUpdate(
      { _id: phostId },
      { $set: { status: false } },
      { new: true }
    );

    if (!updatedReport) {
      return res.status(404).json({ message: "Report not found for this phost" });
    }

    res.status(200).json({
      message: "Report status updated successfully",
      report: updatedReport,
    });

  } catch (error) {
    console.error("Failed to update report status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deletePhost = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        message: "phost id is required"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "invalid phost id"
      });
    }

    const deletedPhost = await Phosts.findOneAndDelete({
      _id: id,
      status: "pending"
    });

    if (!deletedPhost) {
      return res.status(404).json({
        message: "phost not found or already deleted"
      });
    }

    res.status(200).json({
      message: "phost deleted successfully",
      phostId: deletedPhost._id
    });

  } catch (error) {
    console.error("Failed to delete phost:", error);
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

export const editPhost = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const { title, body, code, name, email } = req.body;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        message: "phost id is required"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "invalid phost id"
      });
    }

    if (!title || !Array.isArray(body)) {
      return res.status(400).json({
        message: "title and body are required"
      });
    }

    const updatedPhost = await Phosts.findOneAndUpdate(
      {
        _id: id,
        status: "pending"
      },
      {
        $set: {
          title,
          body,
          code,
          username: name,
          email
        }
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedPhost) {
      return res.status(404).json({
        message: "phost not found or not editable"
      });
    }

    res.status(200).json({
      message: "phost updated successfully",
      phost: updatedPhost
    });

  } catch (error) {
    console.error("Failed to edit phost:", error);
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

export const getAllPendingPhosts = async (req: Request, res: Response) => {
  try {
    const phosts = await Phosts.find({ status: "pending" })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: phosts.length,
      data: phosts
    });
  } catch (error) {
    console.error("Error fetching pending phosts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pending phosts"
    });
  }
}

export const getPhostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        message: "phost id is required"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "invalid phost id"
      });
    }
    const phost = await Phosts.findById(id);

    if (!phost) {
      return res.status(404).json({
        message: "phost not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: phost
    });

  } catch (error) {
    console.error("Get phost error:", error);
    return res.status(500).json({
      message: "internal server error"
    });
  }
};

export const publishPhost = async (req: Request, res: Response) => {
  const { id } = req.query;
  console.log("trigger phost");
  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Valid phost id is required" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid phost id" });
  }

  try {
    const phost = await Phosts.findByIdAndUpdate(
      id,
      { status: "published" },
      { new: true }
    );

    if (!phost) {
      return res.status(404).json({ message: "Phost not found" });
    }

    const status: string = "phost-published";
    const email: string = phost.email;
    const description: string = phost.title;

    if (email && description) {
      await sendLoginEmails({ email, description, status })
    }

    console.log(phost.email, phost.title);

    res.status(200).json({
      success: true,
      message: "Phost published successfully",
      data: phost
    });

  } catch (error) {
    console.error("Publish error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to publish phost"
    });
  }
};

export const rejectPhost = async (req: Request, res: Response) => {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Valid report id is required" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid report id" });
  }

  try {

    const phost = await Phosts.findByIdAndUpdate(
      id,
      { status: "archived" },
      { new: true }
    );

    if (!phost) {
      return res.status(404).json({ message: "Phost not found" });
    }

    const status: string = "phost-rejected";
    const email: string = phost.email;
    const description: string = phost.title;

    if (email && description) {
      await sendLoginEmails({ email, description, status });
    }

    res.status(200).json({
      success: true,
      message: "Phost rejected successfully",
      data: phost,
    });
  } catch (error) {
    console.error("Reject error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reject phost",
    });
  }
};

export const getAllReportPhosts = async (req: Request, res: Response) => {
  try {
    const reports = await Report.find({ reportType: "POST", status: true })
      .populate("phostId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    console.error("Error fetching reported phosts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reported phosts",
    });
  }
}

export const getAllPublishedPhosts = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const lastId = req.query.lastId as string | undefined;
    const userEmail = req.query.userEmail as string | undefined;

    const matchStage: any = {
      status: "published",
    };

    if (userEmail) {
      matchStage.email = { $ne: userEmail };
    }

    if (lastId) {
      if (!mongoose.Types.ObjectId.isValid(lastId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid lastId",
        });
      }

      matchStage._id = { $lt: new mongoose.Types.ObjectId(lastId) };
    }

    const phosts = await Phosts.aggregate([
      { $match: matchStage },
      { $sort: { _id: -1 } },
      { $limit: limit },


      {
        $lookup: {
          from: "phostreactions",
          localField: "_id",
          foreignField: "phostId",
          as: "reactions",
        },
      },

      {
        $addFields: {
          likeCount: {
            $size: {
              $filter: {
                input: "$reactions",
                as: "r",
                cond: { $eq: ["$$r.liked", true] },
              },
            },
          },
          commentCount: {
            $size: {
              $filter: {
                input: "$reactions",
                as: "r",
                cond: {
                  $and: [
                    { $ne: ["$$r.comment", ""] },
                    { $ne: ["$$r.comment", null] },
                  ],
                },
              },
            },
          },
        },
      },

      {
        $project: {
          title: 1,
          body: 1,
          createdAt: 1,
          username: 1,
          likeCount: 1,
          commentCount: 1,
        },
      },
    ]);

    const data = phosts.map((p) => {
      const firstImage = p.body.find(
        (b: IBodyBlock) => b.type === "IMG" || b.type === "UNSPLASH"
      );

      return {
        _id: p._id.toString(),
        title: p.title,
        createdAt: p.createdAt.toISOString(),
        username: p.username,
        image: firstImage ? firstImage.value : null,
        likeCount: p.likeCount,
        commentCount: p.commentCount,
      };
    });

    const lastPhost = phosts.at(-1);

    res.status(200).json({
      success: true,
      count: data.length,
      nextCursor: lastPhost ? lastPhost._id.toString() : null,
      data,
    });
  } catch (error) {
    console.error("Error fetching published phosts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch published phosts",
    });
  }
};


export const saveReaction = async (req: Request, res: Response) => {
  try {
    const phostId = req.query.id as string;
    const { like, comment, username, profile } = req.body;

    if (!phostId || !mongoose.Types.ObjectId.isValid(phostId)) {
      return res.status(400).json({ message: "Invalid or missing phost ID" });
    }

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    if (typeof like !== "boolean") {
      return res.status(400).json({ message: "'like' must be a boolean" });
    }

    const hasComment = comment && comment.trim().length > 0;

    if (like === true && !hasComment) {
      const alreadyLiked = await Reaction.findOne({
        phostId,
        username,
        liked: true,
      });

      if (alreadyLiked) {
        return res.status(409).json({
          message: "User has already liked this post",
        });
      }
    }

    const reaction = await Reaction.create({
      phostId,
      liked: like,
      comment: hasComment ? comment : "",
      username,
      profilePicture: profile,
    });

    await sendReactionEmails({
      phostId,
      reactedBy: username,
      reactionType: hasComment ? "comment" : "like",
      comment: hasComment ? comment : undefined,
    });


    return res.status(200).json({ success: true, reaction });
  } catch (error: any) {
    console.error("Error saving reaction:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const getReactionsStats = async (req: any, res: any) => {
  try {
    const phostId = req.query.id as string;
    const userName = req.query.name;

    if (!phostId || !mongoose.Types.ObjectId.isValid(phostId)) {
      return res.status(400).json({ message: "Invalid or missing phost ID" });
    }

    const reactions = await Reaction.aggregate([
      {
        $facet: {
          withComments: [
            {
              $match: {
                phostId: new mongoose.Types.ObjectId(phostId),
                comment: { $ne: "" }
              }
            },
            { $sort: { createdAt: -1 } }
          ],
          likedCount: [
            {
              $match: {
                phostId: new mongoose.Types.ObjectId(phostId),
                liked: true
              }
            },
            { $count: "totalLikes" }
          ],
          userLiked: [
            {
              $match: {
                phostId: new mongoose.Types.ObjectId(phostId),
                liked: true,
                username: userName
              }
            },
            { $limit: 1 }
          ]
        }
      }
    ]);

    const totalLikes = reactions[0].likedCount[0]?.totalLikes || 0;
    const isLikedByUser = reactions[0].userLiked.length > 0;

    res.json({
      comments: reactions[0].withComments,
      totalLikes,
      isLikedByUser
    });

  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const searchPhosts = async (req: Request, res: Response) => {
  try {
    const searchText = req.query.search as string | undefined;
    const excludeEmail = req.query.excludeEmail as string | undefined;

    const query: any = {};

    if (searchText) {
      query.$or = [
        { title: { $regex: searchText, $options: "i" } },
        { "body.value": { $regex: searchText, $options: "i" } },
      ];
    }

    if (excludeEmail) {
      query.email = { $ne: excludeEmail };
    }

    const phosts = await Phosts.find(query).sort({ createdAt: -1 });

    const mapped = await Promise.all(
      phosts.map(async (p) => {
        const firstImage = p.body.find((b) => b.type === "IMG");

        const likeCount = await Reaction.countDocuments({
          phostId: p._id,
          liked: true,
        });

        const commentCount = await Reaction.countDocuments({
          phostId: p._id,
          comment: { $exists: true, $ne: "" },
        });

        return {
          _id: p._id.toString(),
          title: p.title,
          createdAt: p.createdAt.toISOString(),
          username: p.username,
          image: firstImage ? firstImage.value : null,
          likeCount,
          commentCount,
        };
      })
    );

    res.status(200).json(mapped);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserReactions = async (req: Request, res: Response) => {
  try {
    const { username } = req.query;

    if (!username || typeof username !== "string") {
      return res.status(400).json({ message: "Username is required" });
    }

    const userPhosts = await Phosts.find({ username }).select("_id title");

    if (!userPhosts.length) {
      return res.status(404).json({ message: "No posts found for this user" });
    }

    const phostIds = userPhosts.map((p) => p._id);

    const reactions = await Reaction.find({ phostId: { $in: phostIds }, status: true });


    const result = userPhosts.map((post) => {
      const postReactions = reactions.filter(
        (r) => r.phostId.toString() === post._id.toString()
      );

      const totalLikes = postReactions.filter((r) => r.liked).length;
      const totalComments = postReactions.filter((r) => r.comment).length;

      return {
        phostId: post._id,
        title: post.title,
        totalReactions: postReactions.length,
        totalLikes,
        totalComments,
        reactions: postReactions.map((r) => ({
          username: r.username,
          profilePicture: r.profilePicture,
          liked: r.liked,
          comment: r.comment,
          createdAt: r.createdAt,
        })),
      };
    });

    return res.status(200).json({ data: result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err });
  }
}

export const setNotificationStatus = async (req: Request, res: Response) => {
  try {
    const { username } = req.query;

    if (!username || typeof username !== "string") {
      return res.status(400).json({ message: "Username is required" });
    }

    const result = await Reaction.updateMany(
      {
        status: true,
        username: { $ne: username }
      },
      {
        $set: { status: false }
      }
    );

    return res.status(200).json({
      message: "All notifications marked as read",
      modifiedCount: result.modifiedCount
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to clear notifications",
      error
    });
  }
}

export const getArchivedPhostsByUsername = async (
  req: Request,
  res: Response
) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Username is required"
      });
    }

    const archivedPhosts = await Phosts.find({
      status: "archived",
      username
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: archivedPhosts.length,
      data: archivedPhosts
    });
  } catch (error) {
    console.error("Error fetching archived phosts by username:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch archived phosts"
    });
  }
};