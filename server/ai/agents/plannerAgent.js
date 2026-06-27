const { ProviderFactory } = require("../providers/providerFactory");
const { generatePlannerPrompt, plannerSchema } = require("../prompts/planner.prompt");
const { memoryLookupTool } = require("../tools/memoryLookup.tool");

const run = async (state) => {
  const startTime = Date.now();
  console.log("Planner Agent evaluating state, memory, and determining dynamic routing...");

  // 1. Memory Lookup
  const memoryContext = await memoryLookupTool.invoke({ customerId: state.customerId || "Unknown" });
  
  // 2. Add memory to state for the prompt
  const stateWithMemory = { ...state, historicalMemory: memoryContext };

  const provider = ProviderFactory.getProvider();
  const output = await provider.invoke(generatePlannerPrompt(stateWithMemory), plannerSchema);
  
  return {
    historicalMemory: memoryContext,
    nextAgents: output.nextAgents,
    agentLogs: [{
      agentName: "Planner Agent",
      status: "Success",
      executionTimeMs: Date.now() - startTime,
      outputSummary: `Dynamically dispatched: ${output.nextAgents.join(", ")} | Reasoning: ${output.planningReasoning}`
    }]
  };
};
module.exports = { run };
