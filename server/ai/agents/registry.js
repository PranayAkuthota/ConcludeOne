const meetingAgent = require("./meetingAgent");
const crmContextAgent = require("./crmContextAgent");
const contextAgent = require("./contextAgent");
const riskAgent = require("./riskAgent");
const recommendationAgent = require("./recommendationAgent");
const explainabilityAgent = require("./explainabilityAgent");
const memoryAgent = require("./memoryAgent");

// The Agent Registry allows the Planner to dynamically discover available agents.
// New agents can be added here without modifying the core orchestration logic.
const agentRegistry = {
  meeting_node: {
    description: "Extracts sentiment, pain points, and requirements from meeting transcripts.",
    execute: meetingAgent.run
  },
  crm_node: {
    description: "Retrieves account health, sales stage, and ARR from the CRM system.",
    execute: crmContextAgent.run
  },
  context_node: {
    description: "Enterprise Context Agent: Retrieves playbooks, ranks them, removes duplicates, and summarizes enterprise context.",
    execute: contextAgent.run
  },
  risk_node: {
    description: "Evaluates churn and deal risk based on gathered context.",
    execute: riskAgent.run
  },
  recommendation_node: {
    description: "Generates the Next Best Action and a confidence score.",
    execute: recommendationAgent.run
  },
  explainability_node: {
    description: "Generates business reasoning and supporting evidence for the recommendation.",
    execute: explainabilityAgent.run
  },
  memory_node: {
    description: "Saves interaction context and workflow state to long-term memory.",
    execute: memoryAgent.run
  }
};

const getAvailableAgents = () => {
  return Object.keys(agentRegistry).map(key => ({
    name: key,
    description: agentRegistry[key].description
  }));
};

const getAgentExecutor = (agentName) => {
  const agent = agentRegistry[agentName];
  if (!agent) throw new Error(`Agent ${agentName} not found in registry.`);
  return agent.execute;
};

module.exports = { agentRegistry, getAvailableAgents, getAgentExecutor };
