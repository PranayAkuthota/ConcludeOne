const { vectorSearchTool } = require("../tools/vectorSearch.tool");

const run = async (state) => {
  const startTime = Date.now();
  
  // 1. Retrieve raw documents using the Vector Search Tool deterministically
  const retrieval = await vectorSearchTool.invoke({ query: JSON.stringify(state.inputs) });
  
  // In a real app, vectorSearchTool would return an array of objects. We'll simulate structuring it here.
  const isString = typeof retrieval === 'string';
  const synthesizedOutput = {
    relevantPlaybookNames: isString && retrieval.includes("No enterprise context") ? [] : ["Enterprise Churn Playbook", "Standard Pricing Policy"],
    synthesizedContext: isString ? retrieval : "Retrieved relevant internal policies via semantic vector search."
  };
  
  return {
    enterpriseContext: synthesizedOutput,
    agentLogs: [{
      agentName: "Enterprise Context Agent",
      status: "Success",
      executionTimeMs: Date.now() - startTime,
      outputSummary: "Retrieved relevant business playbooks directly from ChromaDB (No LLM)"
    }]
  };
};
module.exports = { run };
