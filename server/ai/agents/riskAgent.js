const run = async (state) => {
  const startTime = Date.now();
  
  // Deterministic Business Rule Engine
  let dealRisk = 10;
  let churnRisk = 10;
  const riskFactors = [];

  const healthStr = state.crmContext?.accountHealth || "";
  const isPoorHealth = healthStr.includes("At Risk") || healthStr.includes("Poor");
  
  const competitors = state.meetingInsights?.competitors || [];
  const hasCompetitor = competitors.length > 0;
  
  const painPoints = state.meetingInsights?.painPoints || [];
  
  if (isPoorHealth) {
    churnRisk += 40;
    riskFactors.push("Low CRM Health Score");
  }
  if (hasCompetitor) {
    dealRisk += 50;
    churnRisk += 30;
    riskFactors.push(`Evaluating competitors: ${competitors.join(", ")}`);
  }
  if (painPoints.length >= 3) {
    churnRisk += 20;
    riskFactors.push("Multiple pain points identified in meeting");
  }

  const result = {
    dealRisk: Math.min(100, dealRisk),
    churnRisk: Math.min(100, churnRisk),
    riskFactors
  };

  return {
    riskAssessment: result,
    agentLogs: [{
      agentName: "Risk Agent",
      status: "Success",
      executionTimeMs: Date.now() - startTime,
      outputSummary: "Evaluated deal and churn risk using deterministic rules engine (No LLM)"
    }]
  };
};
module.exports = { run };
