const { z } = require("zod");

const generatePlannerPrompt = (state) => {
  return `You are the Dynamic Orchestration Planner Agent.
Your job is to read the current state (which now includes historical memory from past cases) and decide which agents need to execute in parallel next.
Current State: ${JSON.stringify(state)}

Historical Memory (if any) provides context on what worked or was rejected previously for this customer. Use this to refine your orchestration strategy.

Available Agents:
- "meeting_node": Extracts transcript insights.
- "crm_node": Retrieves customer CRM data.
- "context_node": Enterprise Context Agent (queries ChromaDB, ranks, and summarizes playbooks).

If this is the first run (retryCount = 0), you should typically execute all three. If this is a retry due to low confidence, you may only need to re-run the "context_node" or specific nodes.`;
};

const plannerSchema = z.object({
  nextAgents: z.array(z.string()).describe("List of node names to execute next in parallel (e.g., ['meeting_node', 'crm_node', 'context_node'])."),
  planningReasoning: z.string().describe("Your reasoning for selecting these agents.")
});

module.exports = { generatePlannerPrompt, plannerSchema };
