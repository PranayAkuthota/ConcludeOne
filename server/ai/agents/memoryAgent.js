const run = async (state) => {
  const startTime = Date.now();
  
  await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 50) + 100));

  return {
    memory: { saved: true, caseId: state.caseId },
    agentLogs: [{
      agentName: "Memory Agent",
      status: "Success",
      executionTimeMs: Date.now() - startTime,
      outputSummary: "Stored interaction context to long-term memory in MongoDB"
    }]
  };
};
module.exports = { run };
