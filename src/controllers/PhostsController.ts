import { Request, Response } from "express";
import Phosts from "../models/PhostsModel";
import mongoose from "mongoose";
import { sendLoginEmails } from "../services/email.service";
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

        if(typeof title !== "string") return;
        const status:string = "phost-upload";
        await sendLoginEmails({email,description:title,status})

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
        const { name, email, status } = req.query;
        console.log("request catched",name, email);
        if (!name || !email || !status) {
            return res.status(400).json({
                message: "username and email and status are required"
            });
        }

        const drafts = await Phosts.aggregate([
            {
                $match: {
                    username:name,
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

    // validate ObjectId
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

export const deletePhost = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        message: "phost id is required"
      });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "invalid phost id"
      });
    }

    const deletedPhost = await Phosts.findOneAndDelete({
      _id: id,
      status: "pending" // only allow deleting drafts
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

    // 1️⃣ Validate id
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

    // 2️⃣ Basic validation
    if (!title || !Array.isArray(body)) {
      return res.status(400).json({
        message: "title and body are required"
      });
    }

    // 3️⃣ Update draft phost
    const updatedPhost = await Phosts.findOneAndUpdate(
      {
        _id: id,
        status: "pending" // only editable drafts
      },
      {
        $set: {
          title,
          body,
          code,
          username:name,
          email
        }
      },
      {
        new: true,          // return updated document
        runValidators: true // schema validation
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
      .sort({ createdAt: -1 }); // newest first

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

export const publishPhost = async (req: Request, res: Response) => {
  const { id } = req.query;

  // 1️⃣ Validate presence & type
  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Valid phost id is required" });
  }

  // 2️⃣ Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid phost id" });
  }

  try {
    // 3️⃣ Update status
    const phost = await Phosts.findByIdAndUpdate(
      id,
      { status: "published" },
      { new: true }
    );

    if (!phost) {
      return res.status(404).json({ message: "Phost not found" });
    }

    const status:string = "phost-published";
    const email:string = phost.email;
    const description:string = phost.title;

    if(email && description) {
       await sendLoginEmails({email,description,status})
    }

        console.log(phost.email,phost.title);
        
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

  // 1️⃣ Validate presence & type
  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Valid phost id is required" });
  }

  // 2️⃣ Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid phost id" });
  }

  try {
    // 3️⃣ Update status
    const phost = await Phosts.findByIdAndUpdate(
      id,
      { status: "archived" },
      { new: true }
    );

    if (!phost) {
      return res.status(404).json({ message: "Phost not found" });
    }

     const status:string = "phost-rejected";
    const email:string = phost.email;
    const description:string = phost.title;

    if(email && description) {
       await sendLoginEmails({email,description,status})
    }

    res.status(200).json({
      success: true,
      message: "Phost rejected successfully",
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

export const getAllReportPhosts = async (req: Request, res: Response) => {
    try {
    const phosts = await Phosts.find({ status: "archived" })
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json({
      success: true,
      count: phosts.length,
      data: phosts
    });
  } catch (error) {
    console.error("Error fetching reported phosts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reported phosts"
    });
  }
}