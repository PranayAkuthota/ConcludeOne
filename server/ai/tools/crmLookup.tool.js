const { tool } = require("@langchain/core/tools");
const { z } = require("zod");

const crmLookupTool = tool(
  async ({ customerId }) => {
    // Simulate a database/Salesforce lookup
    return `Customer ${customerId} is an Enterprise Tier client active for 3 years.`;
  },
  {
    name: "crm_lookup",
    description: "Looks up detailed customer profile information from the CRM.",
    schema: z.object({
      customerId: z.string().describe("The unique customer ID")
    })
  }
);

module.exports = { crmLookupTool };
