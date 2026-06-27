const { ProviderFactory } = require("../providers/providerFactory");
const { generateRiskPrompt } = require("../prompts/risk.prompt");
const { z } = require("zod");

const schema = z.object({
  dealRisk: z.number(),
  churnRisk: z.number(),
  riskFactors: z.array(z.string())
});

const run = async (state) => {
  const startTime = Date.now();
  const provider = ProviderFactory.getProvider();
  
  const result = await provider.invoke(generateRiskPrompt(state.meetingInsights, state.crmContext), schema);

  return {
    riskAssessment: result,
    agentLogs: [{
      agentName: "Risk Agent",
      status: "Success",
      executionTimeMs: Date.now() - startTime,
      outputSummary: "Evaluated deal and churn risk"
    }]
  };
};
module.exports = { run };
