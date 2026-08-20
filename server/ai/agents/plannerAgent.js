const { memoryLookupTool } = require("../tools/memoryLookup.tool");

const run = async (state) => {
  const startTime = Date.now();
  console.log("Planner Agent evaluating state, memory, and determining dynamic routing deterministically...");

  // 1. Memory Lookup
  const memoryContext = await memoryLookupTool.invoke({ customerId: state.customerId || "Unknown" });
  
  // 2. Deterministic Routing Strategy
  // For Conclude One, we always parallelize the gather phase.
  const nextAgents = ["meeting_node", "crm_node", "context_node"];

  return {
    historicalMemory: memoryContext,
    nextAgents: nextAgents,
    agentLogs: [{
      agentName: "Planner Agent",
      status: "Success",
      executionTimeMs: Date.now() - startTime,
      outputSummary: `Deterministically dispatched: ${nextAgents.join(", ")} | Reasoning: Standard Parallel Gather Pipeline`
    }]
  };
};
module.exports = { run };
