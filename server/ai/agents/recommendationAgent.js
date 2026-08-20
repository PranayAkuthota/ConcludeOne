const { ProviderFactory } = require("../providers/providerFactory");
const { generateRecommendationPrompt } = require("../prompts/recommendation.prompt");
const { z } = require("zod");

const schema = z.object({
  primaryRecommendation: z.string(),
  businessReasoning: z.string(),
  supportingEvidence: z.array(z.string()),
  executionPlan: z.array(z.string()),
  expectedBusinessImpact: z.string(),
  successMetrics: z.array(z.string()),
  risksIfIgnored: z.array(z.string()),
  confidence: z.number(),
  priority: z.string()
});

const run = async (state) => {
  const startTime = Date.now();
  const provider = ProviderFactory.getProvider("RECOMMENDATION_MODEL");
  
  console.log("\n[DEBUG] --- RECOMMENDATION AGENT INPUT STATE ---");
  console.log("Meeting Insights:", JSON.stringify(state.meetingInsights));
  console.log("CRM Context:", JSON.stringify(state.crmContext));
  console.log("Enterprise Context:", JSON.stringify(state.enterpriseContext));
  console.log("Risk Assessment:", JSON.stringify(state.riskAssessment));
  console.log("Historical Memory:", state.historicalMemory);
  
  const finalPrompt = generateRecommendationPrompt(state);
  console.log("\n[DEBUG] --- COMPLETE RESOLVED PROMPT ---");
  console.log(finalPrompt);
  console.log("------------------------------------------\n");

  const result = await provider.invoke(finalPrompt, schema);

  console.log("\n[DEBUG] --- RAW GEMINI RESPONSE (PARSED JSON) ---");
  console.log(JSON.stringify(result, null, 2));
  console.log("---------------------------------------------------\n");

  return {
    recommendation: {
      ...result,
      aiProvider: provider.lastUsedProviderName || provider.name
    },
    agentLogs: [{
      agentName: "Recommendation Agent",
      status: "Success",
      executionTimeMs: Date.now() - startTime,
      outputSummary: "Generated Next Best Action and Confidence Score"
    }]
  };
};
module.exports = { run };
