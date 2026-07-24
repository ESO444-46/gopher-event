const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Generates a 1536-dimensional embedding vector for text using Gemini.
 * 
 * @param {string} text - The content or search query to embed.
 * @param {'RETRIEVAL_DOCUMENT' | 'RETRIEVAL_QUERY'} taskType - Use 'RETRIEVAL_DOCUMENT' when saving items to DB, or 'RETRIEVAL_QUERY' when searching.
 * @returns {Promise<number[]>} Array of 1536 float values.
 */

async function generateEmbedding(text, taskType) {
    const response = await ai.models.embedContent({
        model: 'gemini-embedding-001',
        contents: text,
        config: {
            taskType: taskType,
            outputDimensionality: 1536,
        },
    });

    return response.embeddings[0].values

}

module.exports = { ai };