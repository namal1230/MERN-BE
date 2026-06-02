import { Request, Response } from "express";
import OpenAI from "openai";

export const generateImage = async (req: Request, res: Response) => {
    
    try {
        console.log("API KEY EXISTS:", !!process.env.OPENAI_API_KEY);
        console.log(process.env.OPENAI_API_KEY, process.env.OPENAI_API_KEY?.length);

        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ message: "Prompt is required" });
        }

        const result = await openai.images.generate({
            prompt,
            size: "1024x1024",
            n:1
        });



        const imageBase64 = result.data?.[0]?.b64_json;

        if (!imageBase64) {
            return res.status(500).json({ message: "No image returned" });
        }

        res.status(200).json({
            image: `data:image/png;base64,${imageBase64}`,
        });
    } catch (error: any) {
        console.error(error);

        if (error.status === 429) {
            return res.status(429).json({ message: "OpenAI quota exceeded" });
        }

        res.status(500).json({ message: "Image generation failed" });
    }
};
