const meetingAgent = require("./meetingAgent");
const crmAgent = require("./crmAgent");
const knowledgeAgent = require("./knowledgeAgent");

const run = async (state) => {
  const startTime = Date.now();
  
  const [meetingRes, crmRes, knowledgeRes] = await Promise.all([
    meetingAgent.run(state),
    crmAgent.run(state),
    knowledgeAgent.run(state)
  ]);

  return {
    meetingAnalysis: meetingRes.meetingAnalysis,
    crmContext: crmRes.crmContext,
    knowledgeContext: knowledgeRes.knowledgeContext,
    agentLogs: [
      ...meetingRes.agentLogs,
      ...crmRes.agentLogs,
      ...knowledgeRes.agentLogs,
      {
        agentName: "Parallel Gather",
        status: "Success",
        executionTimeMs: Date.now() - startTime,
        outputSummary: "Gathered context from Meeting, CRM, and Knowledge in parallel"
      }
    ]
  };
};
module.exports = { run };
