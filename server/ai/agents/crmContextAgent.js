const { ProviderFactory } = require("../providers/providerFactory");
const { generateCrmPrompt } = require("../prompts/crm.prompt");
const { crmLookupTool } = require("../tools/crmLookup.tool");
const { z } = require("zod");

const schema = z.object({
  accountHealth: z.string(),
  salesStage: z.string(),
  opportunityValue: z.string()
});

const run = async (state) => {
  const startTime = Date.now();
  const provider = ProviderFactory.getProvider();
  
  const customerId = state.customerId || "Unknown";
  await crmLookupTool.invoke({ customerId });
  
  const result = await provider.invoke(generateCrmPrompt(customerId), schema);

  return {
    crmContext: result,
    agentLogs: [{
      agentName: "CRM Context Agent",
      status: "Success",
      executionTimeMs: Date.now() - startTime,
      outputSummary: "Extracted customer health and account data"
    }]
  };
};
module.exports = { run };
