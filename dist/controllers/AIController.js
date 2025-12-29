"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateImage = void 0;
const openai_1 = __importDefault(require("openai"));
const openai = new openai_1.default({
    apiKey: "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",
});
const generateImage = async (req, res) => {
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
            n: 1
        });
        const imageBase64 = result.data?.[0]?.b64_json;
        if (!imageBase64) {
            return res.status(500).json({ message: "No image returned" });
        }
        res.status(200).json({
            image: `data:image/png;base64,${imageBase64}`,
        });
    }
    catch (error) {
        console.error(error);
        if (error.status === 429) {
            return res.status(429).json({ message: "OpenAI quota exceeded" });
        }
        res.status(500).json({ message: "Image generation failed" });
    }
};
exports.generateImage = generateImage;
