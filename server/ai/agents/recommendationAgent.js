const { ProviderFactory } = require("../providers/providerFactory");
const { generateRecommendationPrompt } = require("../prompts/recommendation.prompt");
const { z } = require("zod");

const schema = z.object({
  recommendation: z.string(),
  confidence: z.number(),
  priority: z.string(),
  expectedBusinessImpact: z.string()
});

const run = async (state) => {
  const startTime = Date.now();
  const provider = ProviderFactory.getProvider();
  
  const result = await provider.invoke(generateRecommendationPrompt(state), schema);

  return {
    recommendation: result,
    agentLogs: [{
      agentName: "Recommendation Agent",
      status: "Success",
      executionTimeMs: Date.now() - startTime,
      outputSummary: "Generated Next Best Action and Confidence Score"
    }]
  };
};
module.exports = { run };
