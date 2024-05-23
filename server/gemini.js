import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/files";

const KEY = process.env["GEMINI_API_KEY"];
const fileManager = new GoogleAIFileManager(KEY);
const genAI = new GoogleGenerativeAI(KEY);

export const uploadVideo = async (file) => {
    // TODO check if it exists already ... how?

    try {
        const uploadResult = await fileManager.uploadFile(file.path, {
            displayName: file.originalname,
            mimeType: file.mimetype,
        })
        console.log(`uploadComplete: ${uploadResult.file}`)
        return uploadResult.file
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const checkProgress = async (uploadResult) => {
    try {
        const result = await fileManager.getFile(uploadResult.name);
        return result;
    } catch (error) {
        console.error(error);
        return { error };
    }
}

export const promptVideo = async (uploadResult, prompt, model) => {
    try {
        const req = [
            { text: prompt },
            {
                fileData: {
                    mimeType: uploadResult.mimeType,
                    fileUri: uploadResult.uri
                }
            },
        ];
        console.log(`promptVideo with ${model}`, req)
        const result = await genAI.getGenerativeModel({ model }).generateContent(req);
        console.log(`promptVideo response`, result.response.text())
        return {
            text: result.response.text(),
            candidates: result.response.candidates,
            feedback: result.response.promptFeedback
        }
    } catch (error) {
        console.error(error)
        return { error }
    }
}