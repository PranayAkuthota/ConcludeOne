const generateRiskPrompt = (meetingInsights, crmContext) => {
  return `You are the Risk Analysis Agent.
Analyze the risk using the unified context.
Meeting Insights: ${JSON.stringify(meetingInsights)}
CRM Context: ${JSON.stringify(crmContext)}

Evaluate the deal risk and churn risk factors.
CRITICAL INSTRUCTION: Scale the risk scores appropriately.
- If the account is healthy or looking to expand, churn and deal risk should be Low (0-20).
- If there are feature or pricing concerns, risk should be Medium (30-60).
- If there is a critical technical blocker or competitor threat, risk should be High (70-100).

Provide: dealRisk (0-100), churnRisk (0-100), and a list of riskFactors.`;
};

module.exports = { generateRiskPrompt };
