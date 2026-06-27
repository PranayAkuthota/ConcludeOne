const { Annotation } = require("@langchain/langgraph");

const ConcludeOneState = Annotation.Root({
  caseId: Annotation({ reducer: (a, b) => b ?? a }),
  customerId: Annotation({ reducer: (a, b) => b ?? a }),
  inputs: Annotation({ reducer: (a, b) => b ?? a }),
  
  meetingInsights: Annotation({ reducer: (a, b) => b ?? a, default: () => null }),
  crmContext: Annotation({ reducer: (a, b) => b ?? a, default: () => null }),
  enterpriseContext: Annotation({ reducer: (a, b) => b ?? a, default: () => null }),
  riskAssessment: Annotation({ reducer: (a, b) => b ?? a, default: () => null }),
  recommendation: Annotation({ reducer: (a, b) => b ?? a, default: () => null }),
  explanation: Annotation({ reducer: (a, b) => b ?? a, default: () => null }),
  approvalStatus: Annotation({ reducer: (a, b) => b ?? a, default: () => "Pending" }),
  memory: Annotation({ reducer: (a, b) => b ?? a, default: () => null }),
  retryCount: Annotation({ reducer: (a, b) => b ?? a, default: () => 0 }),
  
  agentLogs: Annotation({
    reducer: (a, b) => a.concat(b),
    default: () => [],
  }),
  executionMetadata: Annotation({
    reducer: (a, b) => ({ ...a, ...b }),
    default: () => ({ startTime: Date.now(), totalRetries: 0, failedAgents: [] }),
  }),
  historicalMemory: Annotation({
    reducer: (a, b) => b !== undefined ? b : a,
    default: () => ""
  }),
  nextAgents: Annotation({
    reducer: (a, b) => b ?? a,
    default: () => ["meeting_node", "crm_node", "context_node"]
  })
});

module.exports = { ConcludeOneState };
