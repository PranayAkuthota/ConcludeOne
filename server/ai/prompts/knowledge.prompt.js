const { z } = require("zod");

const generateKnowledgePrompt = (inputs, rawRetrieval) => {
  return `You are the Enterprise Context Agent.
Your responsibilities are to:
1. Perform semantic evaluation of the raw retrieved documents based on the inputs.
2. Rank the documents by relevance.
3. Remove duplicate or conflicting playbooks.
4. Summarize the context into a clean Enterprise Context assembly for downstream agents.

User Inputs:
${JSON.stringify(inputs, null, 2)}

Raw Retrieved Documents from ChromaDB:
${rawRetrieval}

Filter out irrelevant information and duplicates. Provide a clean summary of the exact playbooks, rules, and guidelines that apply to this case.`;
};

const knowledgeSchema = z.object({
  synthesizedContext: z.string().describe("A clean, ranked, deduplicated summary of the relevant enterprise playbooks and rules that apply to this specific case."),
  relevantPlaybookNames: z.array(z.string()).describe("List of playbook names referenced.")
});

module.exports = { generateKnowledgePrompt, knowledgeSchema };
