const { ProviderFactory } = require("../providers/providerFactory");
const { generateKnowledgePrompt, knowledgeSchema } = require("../prompts/knowledge.prompt");
const { vectorSearchTool } = require("../tools/vectorSearch.tool");

const run = async (state) => {
  const startTime = Date.now();
  const provider = ProviderFactory.getProvider();
  
  // 1. Retrieve raw documents using the Vector Search Tool
  const retrieval = await vectorSearchTool.invoke({ query: JSON.stringify(state.inputs) });
  
  // 2. Synthesize and rank results using Gemini
  const prompt = generateKnowledgePrompt(state.inputs, retrieval);
  const synthesizedOutput = await provider.invoke(prompt, knowledgeSchema);
  
  return {
    enterpriseContext: synthesizedOutput,
    agentLogs: [{
      agentName: "Enterprise Context Agent",
      status: "Success",
      executionTimeMs: Date.now() - startTime,
      outputSummary: "Retrieved relevant business playbooks from ChromaDB"
    }]
  };
};
module.exports = { run };
