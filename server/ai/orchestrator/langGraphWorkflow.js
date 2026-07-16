const { StateGraph, END, START } = require("@langchain/langgraph");
const { ConcludeOneState } = require("../agents/agentState");
const plannerAgent = require("../agents/plannerAgent");
const meetingAgent = require("../agents/meetingAgent");
const crmContextAgent = require("../agents/crmContextAgent");
const contextAgent = require("../agents/contextAgent");
const gatherStateAgent = require("../agents/gatherStateAgent");
const riskAgent = require("../agents/riskAgent");
const recommendationAgent = require("../agents/recommendationAgent");
const explainabilityAgent = require("../agents/explainabilityAgent");
const memoryAgent = require("../agents/memoryAgent");

const plannerNode = async (state) => {
  const result = await plannerAgent.run(state);
  return { ...result, retryCount: (state.retryCount || 0) + 1 };
};
const meetingNode = async (state) => await meetingAgent.run(state);
const crmNode = async (state) => await crmContextAgent.run(state);
const contextNode = async (state) => await contextAgent.run(state);
const gatherStateNode = async (state) => await gatherStateAgent.run(state);
const riskNode = async (state) => await riskAgent.run(state);
const recommendationNode = async (state) => await recommendationAgent.run(state);
const memoryNode = async (state) => await memoryAgent.run(state);

const routeRecommendation = (state) => {
  const conf = state.recommendation?.confidence || 0;
  const retries = state.retryCount || 0;
  
  if (conf >= 90 || retries >= 3) {
    return "memory_node";
  } else if (conf >= 70) {
    return "memory_node"; // The UI will flag it as 'Human Review Required'
  } else {
    // Confidence based loop-back
    return "planner_node";
  }
};

const routePlanner = (state) => {
  // Returns an array of node names for LangGraph to execute in parallel
  return state.nextAgents || ["meeting_node", "crm_node", "knowledge_node"];
};

const buildGraph = () => {
  const builder = new StateGraph(ConcludeOneState);

  builder.addNode("planner_node", plannerNode);
  builder.addNode("meeting_node", meetingNode);
  builder.addNode("crm_node", crmNode);
  builder.addNode("context_node", contextNode);
  builder.addNode("gather_state_node", gatherStateNode);
  builder.addNode("risk_node", riskNode);
  builder.addNode("recommendation_node", recommendationNode);
  builder.addNode("memory_node", memoryNode);

  builder.addEdge(START, "planner_node");
  
  // Dynamic parallel branching from Planner
  builder.addConditionalEdges("planner_node", routePlanner, {
    meeting_node: "meeting_node",
    crm_node: "crm_node",
    context_node: "context_node"
  });

  // Parallel join
  builder.addEdge("meeting_node", "gather_state_node");
  builder.addEdge("crm_node", "gather_state_node");
  builder.addEdge("context_node", "gather_state_node");

  // Sequential analysis
  builder.addEdge("gather_state_node", "risk_node");
  builder.addEdge("risk_node", "recommendation_node");

  // Conditional routing based on confidence
  builder.addConditionalEdges("recommendation_node", routeRecommendation);

  builder.addEdge("memory_node", END);

  return builder.compile();
};

const runWorkflow = async (initialState) => {
  const graph = buildGraph();
  return await graph.invoke(initialState);
};

module.exports = { buildGraph, runWorkflow };
