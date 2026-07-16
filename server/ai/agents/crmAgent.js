const { getLLM } = require("../utils/llm");

const run = async (state) => {
  const startTime = Date.now();
  
  const crmNotes = state.inputs?.crmNotes || "No CRM notes provided.";
  const emails = state.inputs?.emails || "No emails provided.";

  const llm = getLLM();
  let crmContext = "Unable to extract CRM context.";
  try {
    const prompt = `Extract a structured Customer Profile, Sales Stage, Opportunity Value, and Customer Health based on these notes and emails.\n\nCRM Notes: ${crmNotes}\nEmails: ${emails}`;
    const response = await llm.invoke(prompt);
    crmContext = response.content;
  } catch (e) {
    console.error(e);
  }

  return {
    crmContext: crmContext,
    agentLogs: [{
      agentName: "CRM Context Agent",
      status: "Success",
      executionTimeMs: Date.now() - startTime,
      outputSummary: "Extracted customer health and account data from inputs"
    }]
  };
};
module.exports = { run };
