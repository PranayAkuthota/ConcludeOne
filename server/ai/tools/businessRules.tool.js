const { tool } = require("@langchain/core/tools");
const { z } = require("zod");

const businessRulesTool = tool(
  async ({ riskScore }) => {
    if (riskScore >= 80) return "Rule: Immediate Escalation to Tier 3 required.";
    return "Rule: Standard processing.";
  },
  {
    name: "business_rules",
    description: "Evaluates standard enterprise business policies based on risk score.",
    schema: z.object({
      riskScore: z.number().describe("The calculated risk score from 0-100")
    })
  }
);

module.exports = { businessRulesTool };
