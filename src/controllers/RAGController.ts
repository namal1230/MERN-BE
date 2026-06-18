import { Request, Response } from "express";
import Phosts, { IBodyBlock } from "../models/PhostsModel";
import { VoyageAIClient } from "voyageai";
import { HfInference } from "@huggingface/inference";
import dotenv from "dotenv";

dotenv.config();

const voyage = new VoyageAIClient({ apiKey: process.env.VOYAGEAI_API_KEY! });
const hf = new HfInference(process.env.HF_API_KEY!);

export const askQuestion = async (req: any, res: Response) => {
    console.log("ask question request catched: ", voyage);
    try {
        const { question } = req.body;

        // Embed the question
        const embedRes = await voyage.embed({
            input: [question],
            model: 'voyage-3.5',
            inputType: 'query',
        });

        if (!embedRes?.data?.[0]?.embedding) {
            throw new Error("Embedding failed: no data returned");
        }

        const queryVector = embedRes.data[0].embedding;

        const results = await Phosts.aggregate([
            {
                $vectorSearch: {
                    index: 'posts_vector_index',
                    path: 'embedding',
                    queryVector: queryVector,
                    numCandidates: 50,
                    limit: 3,
                },
            },
            {
                $project: { title: 1, body: 1, username: 1, score: { $meta: 'vectorSearchScore' } }
            }
        ]);


        const documents = results.map((r: any) =>
            `Title: ${r.title}
            Author: ${r.username}
            Content: ${r.body
            .filter((b: any) => b.type === 'TEXT')
            .map((b: any) => b.value)
            .join(' ')}`
        );

        const reranked = await voyage.rerank({
            query: question,
            documents,
            model: 'rerank-2',
            topK: 3,
        });

        if (!reranked?.data) {
            throw new Error("Embedding failed: no data returned");
        }

        const topDocs = reranked.data
            .map((r: any) => documents[r.index])
            .join('\n\n');


        console.log("Top docs for question:", topDocs);
        const hfResult = await hf.chatCompletion({
            model: "Qwen/Qwen2.5-7B-Instruct",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant for a blog website. Answer based ONLY on the blog posts provided. If the answer is not found, say 'I couldn't find that in the blog posts.'"
                },
                {
                    role: "user",
                    content: `Blog Posts:\n${topDocs}\n\nQuestion: ${question}`
                }
            ],
            max_tokens: 500,
        });

         if (!hfResult?.choices?.[0]?.message?.content) {
            throw new Error("Embedding failed: no data returned");
        }

        const answer = hfResult.choices[0].message.content;

        res.status(200).json({
            question,
            answer,
            sources: reranked.data.map((r: any) => ({
                title: results[r.index]?.title,
                username: results[r.index]?.username,
                score: r.relevanceScore,
            })),
        });
    } catch (error) {
        console.error('Error in askQuestion:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
