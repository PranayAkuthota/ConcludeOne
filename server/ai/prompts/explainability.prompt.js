const generateExplainabilityPrompt = (actionStr, crmContext, riskAssessment) => {
  return `You are the Explainability Agent.
Explain the reasoning behind this recommendation: "${actionStr}".
Context:
CRM: ${JSON.stringify(crmContext)}
Risk: ${JSON.stringify(riskAssessment)}

Provide a 2-3 sentence business reasoning and a list of evidence bullet points.
Return structured output with: reasoning, evidence (array of strings), confidence (number), and sources (array of strings).`;
};

module.exports = { generateExplainabilityPrompt };
