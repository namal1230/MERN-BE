import express from "express";
import { getImages } from "../controllers/ImageController";

const unsplash = express.Router();

unsplash.get("/search", getImages);

export default unsplash;
