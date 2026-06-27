const { tool } = require("@langchain/core/tools");
const { z } = require("zod");

const chromaClient = require("../vector/chromaClient");

const vectorSearchTool = tool(
  async ({ query }) => {
    try {
      const result = await chromaClient.queryKnowledge(query);
      return result;
    } catch(e) {
      return "No enterprise context found.";
    }
  },
  {
    name: "vector_search",
    description: "Performs a semantic search against the ChromaDB vector store to retrieve enterprise knowledge.",
    schema: z.object({
      query: z.string().describe("The semantic search query based on current context")
    })
  }
);

module.exports = { vectorSearchTool };
