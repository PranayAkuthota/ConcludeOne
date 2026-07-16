const { ProviderFactory } = require("../providers/providerFactory");
const { generateExplainabilityPrompt } = require("../prompts/explainability.prompt");
const { z } = require("zod");

const schema = z.object({
  reasoning: z.string(),
  evidence: z.array(z.string()),
  confidence: z.number(),
  sources: z.array(z.string())
});

const run = async (state) => {
  const startTime = Date.now();
  const provider = ProviderFactory.getProvider("EXPLAINABILITY_MODEL");
  
  const actionStr = state.recommendation?.recommendation || "unknown action";
  const result = await provider.invoke(generateExplainabilityPrompt(actionStr, state), schema);

  return {
    explanation: result,
    agentLogs: [{
      agentName: "Explainability Agent",
      status: "Success",
      executionTimeMs: Date.now() - startTime,
      outputSummary: "Generated business reasoning and evidence tracing"
    }]
  };
};
module.exports = { run };
