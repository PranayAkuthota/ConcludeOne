const { tool } = require("@langchain/core/tools");
const { z } = require("zod");
const Case = require("../../models/Case");

const memoryLookupTool = tool(
  async ({ customerId }) => {
    try {
      if (!customerId) return "No customer ID provided for memory lookup.";
      
      // Look up previous cases for this customer in MongoDB
      // Sort by creation date descending to get the most recent ones
      const pastCases = await Case.find({ customerId: customerId, status: "Completed" })
        .sort({ createdAt: -1 })
        .limit(3)
        .lean();

      if (!pastCases || pastCases.length === 0) {
        return `No previous memory found for customer ${customerId}.`;
      }

      let memorySummary = `Historical Memory for ${customerId}:\n`;
      pastCases.forEach((c, index) => {
        memorySummary += `\n--- Case ${index + 1} ---\n`;
        memorySummary += `- Recommendation: ${c.aiData?.recommendation?.recommendation || 'N/A'}\n`;
        memorySummary += `- Approval Status: ${c.approvalStatus || 'Auto-Approved'}\n`;
        memorySummary += `- Execution Date: ${c.createdAt}\n`;
      });

      return memorySummary;
    } catch (e) {
      console.error("Memory Lookup Tool Error:", e);
      return "Failed to retrieve historical memory.";
    }
  },
  {
    name: "memory_lookup",
    description: "Retrieves past interactions, recommendations, and approval outcomes for a specific customer from the database.",
    schema: z.object({
      customerId: z.string().describe("The unique customer ID to look up")
    })
  }
);

module.exports = { memoryLookupTool };
