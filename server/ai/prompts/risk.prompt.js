const generateRiskPrompt = (meetingInsights, crmContext) => {
  return `You are the Risk Analysis Agent.
Analyze the risk using the unified context.
Meeting Insights: ${JSON.stringify(meetingInsights)}
CRM Context: ${JSON.stringify(crmContext)}

Evaluate the deal risk and churn risk factors.
Provide: dealRisk (0-100), churnRisk (0-100), and a list of riskFactors.`;
};

module.exports = { generateRiskPrompt };
