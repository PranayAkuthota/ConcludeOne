
const { ChromaClient, CloudClient } = require("chromadb");
const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");

const isCloudConfigured = Boolean(
  process.env.CHROMA_API_KEY &&
  process.env.CHROMA_TENANT &&
  process.env.CHROMA_DATABASE
);

const client = isCloudConfigured
  ? new CloudClient({
      apiKey: process.env.CHROMA_API_KEY,
      tenant: process.env.CHROMA_TENANT,
      database: process.env.CHROMA_DATABASE,
    })
  : new ChromaClient({
      path: process.env.CHROMA_URL || "http://localhost:8000",
    });

const getEmbeddings = () => {
  return new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004",
    apiKey: process.env.GEMINI_API_KEY,
  });
};

const initChroma = async () => {
  try {
    await client.heartbeat();
    console.log(
      `ChromaDB connected successfully (${isCloudConfigured ? "Cloud" : "Local"})`
    );
  } catch (error) {
    console.error("ChromaDB connection failed:", error.message);
  }
};

const queryKnowledge = async (queryText) => {
  try {
    const collection = await client.getCollection({
      name: "enterprise_knowledge",
    });

    const embeddings = getEmbeddings();
    const queryVector = await embeddings.embedQuery(queryText);

    const results = await collection.query({
      queryEmbeddings: [queryVector],
      nResults: 3,
    });

    const documents = results.documents?.[0] || [];

    if (documents.length === 0) {
      return "No relevant playbooks found.";
    }

    return documents.join("\n\n---\n\n");
  } catch (error) {
    console.error("ChromaDB query failed:", error.message);
    return "Knowledge retrieval is currently unavailable.";
  }
};

module.exports = { initChroma, queryKnowledge, client };
