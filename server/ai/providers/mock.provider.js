class MockProvider {
  async invoke(prompt, schema = null) {
    // Simulate AI network delay (300ms - 800ms)
    const delay = Math.floor(Math.random() * 500) + 300;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    const p = prompt.toLowerCase();
    const isNeg = p.includes("slower than expected") || p.includes("evaluated one of your competitors") || p.includes("flexible pricing") || p.includes("vertexai") || p.includes("cut costs");
    const isBlocker = p.includes("sso saml") || p.includes("azure ad") || p.includes("completely blocked") || p.includes("implementation blocked");
    
    // If schema is provided, return structured objects matching the agent intent
    if (schema) {
      if (p.includes("you are the dynamic orchestration planner")) {
        return {
          nextAgents: ["meeting_node", "crm_node", "context_node"],
          planningReasoning: "Evaluated initial state and dispatching parallel context gathering."
        };
      }
      
      if (p.includes("you are the enterprise context agent")) {
        return {
          playbookSummary: isBlocker 
            ? "Playbook 'Enterprise Integrations' requires routing critical technical blockers to Tier 3 Engineering Support immediately to prevent go-live delays."
            : "Relevant playbook instructions suggest prioritizing immediate resolution and discounting to save renewal.",
          confidence: 90
        };
      }
      
      if (p.includes("you are the meeting")) {
        return {
          sentiment: isNeg || isBlocker ? "Negative" : "Positive",
          painPoints: isBlocker ? ["SSO SAML Integration Failing", "Outdated documentation"] : isNeg ? ["High costs", "Competitor threat"] : ["Slow onboarding"],
          requirements: isBlocker ? ["Working Azure AD integration"] : ["Faster deployment"],
          timeline: isBlocker ? "Delayed by 2 weeks" : "Next quarter",
          budget: isNeg ? "Constrained" : "Available",
          competitors: isNeg ? ["Competitor X"] : [],
          objections: isBlocker ? ["Security team blocked go-live"] : isNeg ? ["Price is too high"] : []
        };
      }
      
      if (p.includes("you are the crm")) {
        return {
          accountHealth: isBlocker ? "At Risk - Deployment Blocked" : isNeg ? "High Risk" : "Healthy",
          salesStage: isBlocker ? "Implementation" : "Renewal",
          opportunityValue: "$50,000"
        };
      }
      
      if (p.includes("you are the risk")) {
        return {
          dealRisk: isBlocker ? 70 : isNeg ? 85 : 10,
          churnRisk: isBlocker ? 60 : isNeg ? 90 : 5,
          riskFactors: isBlocker ? ["Implementation blocked", "Security compliance"] : isNeg ? ["Pricing objections", "Competitor mentions"] : ["None"]
        };
      }
      
      if (p.includes("you are the enterprise recommendation")) {
        return {
          recommendation: isBlocker ? "Route to Tier 3 Engineering & Escalate Implementation Success Manager" : isNeg ? "Escalate to Tier 3 Support & Schedule EBR" : "Pitch Enterprise Expansion Package",
          confidence: isBlocker ? 98 : isNeg ? 94 : 88,
          priority: "High",
          expectedBusinessImpact: isBlocker ? "Unblock go-live and secure deployment" : "Secure renewal"
        };
      }
      
      if (p.includes("you are the explainability")) {
        return {
          reasoning: isBlocker 
            ? "The customer is in the critical implementation phase but is blocked by a technical SSO integration issue. Routing directly to Tier 3 Engineering is required to bypass outdated documentation and unblock the security team's go-live requirement."
            : isNeg 
              ? "The customer has an upcoming renewal but is experiencing friction. Immediate escalation resolves the pain point while the EBR secures the renewal."
              : "The customer expressed satisfaction with the core platform and explicitly asked for faster onboarding for a new team, signaling readiness to buy more licenses.",
          evidence: isBlocker 
            ? ["Customer explicitly states 'engineering team is completely blocked'", "Security team will not proceed without SSO Azure AD integration"]
            : isNeg 
              ? ["Found friction in recent notes/transcripts", "Opportunity is in renewal stage"]
              : ["Explicitly mentioned purchasing 50 additional licenses", "Zero open support tickets"],
          confidence: isBlocker ? 98 : isNeg ? 94 : 88,
          sources: ["CRM", "Meeting Transcript", "Playbook"]
        };
      }
      
      return {};
    }
    
    return "Processed successfully.";
  }
}

module.exports = { MockProvider };
