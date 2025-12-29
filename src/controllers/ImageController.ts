import { Request, Response } from "express";
import { searchImages } from "../services/unsplash.service";

/**
 * GET /api/images?q=car&page=1
 */
export const getImages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { q, page } = req.query;

    if (!q || typeof q !== "string") {
      res.status(400).json({ message: "Query required" });
      return;
    }

    const pageNumber =
      typeof page === "string" ? parseInt(page, 10) : 1;

    const data = await searchImages(q, pageNumber);

    res.status(200).json(data);
  } catch (error) {
    console.error("Unsplash fetch error:", error);
    res.status(500).json({ message: "Failed to fetch images" });
  }
};
