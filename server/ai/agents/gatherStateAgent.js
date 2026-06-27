const run = async (state) => {
  const startTime = Date.now();
  
  // Simulated processing delay for the UI execution monitor
  await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 80) + 40));
  
  return {
    agentLogs: [{
      agentName: "Parallel Gather",
      status: "Success",
      executionTimeMs: Date.now() - startTime,
      outputSummary: "Gathered context from Meeting, CRM, and Knowledge in parallel"
    }]
  };
};
module.exports = { run };
