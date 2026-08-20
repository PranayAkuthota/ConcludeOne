const { ChromaClient } = require("chromadb");
const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");

const client = new ChromaClient({ path: process.env.CHROMA_URL || "http://localhost:8000" });

const getEmbeddings = () => {
  return new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004",
    apiKey: process.env.GEMINI_API_KEY,
  });
};

const initChroma = async () => {
  try {
    await client.heartbeat();
    console.log("ChromaDB connected successfully");
  } catch (error) {
    console.warn("ChromaDB not reachable. Falling back to mock retrieval for development.", error.message);
  }
};

const queryKnowledge = async (queryText) => {
  try {
    const collection = await client.getCollection({ name: "enterprise_knowledge" });
    const embeddings = getEmbeddings();
    const queryVector = await embeddings.embedQuery(queryText);

    const results = await collection.query({
      queryEmbeddings: [queryVector],
      nResults: 3,
    });
    
    if (results.documents[0].length === 0) return "No relevant playbooks found.";
    return results.documents[0].join("\n\n---\n\n");
  } catch (error) {
    // Fallback mock if chroma is not running
    console.warn("Chroma query failed. Using mock data.", error.message);
    return "Playbook: For Enterprise customers with Yellow health score and upcoming renewals, prioritize Executive Business Review (EBR) and escalate any open support tickets to Tier 3 immediately.";
  }
};

module.exports = { initChroma, queryKnowledge, client };
