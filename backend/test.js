const { GoogleGenAI } = require('@google/genai');
const GEMINI_API_KEY = "AQ.Ab8RN6Kxgosf3JpowwmN-QzrAdAFXMkh7HqrWjkpYRK_rVntNg"


// Read key safely from environment variable
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

async function getEmbedding(text, taskType) {
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

const contents = `
  Title: Campus 3v3 Basketball Tournament
  Location/Venue: Rec Center Gym
  Date & Time: Saturday, July 25, 2026 at 2:00 PM
  Description: Join us at the Rec Center for a fast-paced 3v3 tournament. All skill levels are welcome!
`;

getEmbedding(contents, 'RETRIEVAL_DOCUMENT')
    .then((data) => {
        console.log(data)
        console.log('Embedding dimension length:', data.length);
        console.log('First 5 floats:', data.slice(0, 5));
    })
    .catch(console.error);
