const generateRecommendationPrompt = (state) => {
  return `You are the Enterprise Recommendation Agent.
Based on the unified state, what is the single Next Best Action?

State Context:
Meeting Insights: ${JSON.stringify(state.meetingInsights)}
CRM Context: ${JSON.stringify(state.crmContext)}
Knowledge: ${JSON.stringify(state.enterpriseContext || state.knowledgeContext)}
Risk: ${JSON.stringify(state.riskAssessment)}
Historical Memory: ${state.historicalMemory || "No historical memory found."}

CRITICAL INSTRUCTION: Analyze the Historical Memory. If a similar recommendation was previously rejected or required human review, adjust your current recommendation to avoid repeating past mistakes. Use the memory to influence your confidence score.

Return a structured output with: recommendation (string), confidence (number 0-100), priority (string), and expectedBusinessImpact (string).`;
};

module.exports = { generateRecommendationPrompt };
