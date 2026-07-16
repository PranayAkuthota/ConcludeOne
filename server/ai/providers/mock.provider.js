const { BaseProvider } = require("./base.provider");

class DemoProvider extends BaseProvider {
  constructor() {
    super("Demo Provider");
  }

  async invoke(prompt, schema = null) {
    const delay = Math.floor(Math.random() * 200) + 100;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Only match against the user inputs and state to avoid matching system prompt instructions
    const stateStrMatch = prompt.match(/State Context:[\s\S]*?(?=CRITICAL INSTRUCTION|$)/i) || 
                          prompt.match(/{"meetingTranscript"[\s\S]*?}/i) || 
                          [prompt];
    const contextToMatch = stateStrMatch[0].toLowerCase();

    // Broader Regex Matching for Custom Scenarios - matching against state/inputs only
    const isHighChurn = /(canceling|competitor x|moving to competitor|leaving us|switching|retention playbook)/.test(contextToMatch);
    const isPricing = /(major discount|too expensive|budget review|pricing policy)/.test(contextToMatch);
    const isExpansion = /(new team|want to expand|upgrade and bring|expansion opportunity)/.test(contextToMatch);
    const isFeature = /(custom reporting|missing feature|product roadmap)/.test(contextToMatch);
    const isDelay = /(implementation is blocked|sso integration|missed internal deadlines|slower than expected)/.test(contextToMatch);
    const isSupport = /(support backlog|too many bugs|support escalation)/.test(contextToMatch);
    const isRenewalRisk = /(lack of roi|low engagement)/.test(contextToMatch);
    const isPositive = /(advocacy|positive feedback|testimonial|going great)/.test(contextToMatch);
    const isLowAdoption = /(struggling|low dau)/.test(contextToMatch);
    
    // Default to healthy ONLY if no negative risk factors are present
    const hasRisk = isHighChurn || isPricing || isDelay || isSupport || isRenewalRisk || isLowAdoption;
    const isHealthy = !hasRisk && (/(going steady|customer success playbook|healthy|going great)/.test(contextToMatch) || prompt.toLowerCase().includes("enterprise recommendation"));

    const p = prompt.toLowerCase();

    if (schema) {
      if (p.includes("dynamic orchestration planner")) {
        return {
          nextAgents: ["meeting_node", "crm_node", "context_node"],
          planningReasoning: "Evaluated state and orchestrating specialized agents for context gathering."
        };
      }
      
      if (p.includes("enterprise context agent")) {
        let summary = "Standard operating procedures applied.";
        if (isDelay) summary = "Implementation Playbook: Critical blockers require Solution Architect.";
        else if (isSupport) summary = "Support Escalation Playbook: Route to Tier 3 Engineering.";
        else if (isHighChurn) summary = "Retention Playbook: Executive escalation required.";
        else if (isRenewalRisk) summary = "Retention Playbook: Executive escalation required.";
        else if (isPricing) summary = "Pricing Policy: Commercial discounts authorized for multi-year renewals.";
        else if (isExpansion) summary = "Expansion Playbook: Pitch AI Analytics Suite and advocacy.";
        else if (isFeature) summary = "Product Playbook: Route validated requests to Product Management.";
        else if (isPositive) summary = "Expansion Playbook: Pitch AI Analytics Suite and advocacy.";
        else if (isLowAdoption) summary = "Adoption Playbook: Schedule training workshops.";
        else if (isHealthy) summary = "Customer Success Playbook: Conduct QBR.";
        return { playbookSummary: summary, confidence: 95 };
      }
      
      if (p.includes("you are the meeting")) {
        return {
          sentiment: (isHealthy || isExpansion || isPositive) ? "Positive" : "Negative",
          painPoints: isDelay ? ["Implementation delayed"] : isSupport ? ["Too many bugs"] : isHighChurn ? ["Competitor offering"] : isPricing ? ["High costs"] : isFeature ? ["Missing feature"] : isLowAdoption ? ["Hard to use"] : [],
          requirements: isDelay ? ["Technical support"] : isPricing ? ["Pricing review"] : isFeature ? ["Roadmap visibility"] : isExpansion ? ["More licenses"] : ["Continued support"],
          timeline: "Next 30 days",
          budget: isPricing ? "Constrained" : isExpansion ? "Growing" : "Stable",
          competitors: isHighChurn ? ["Competitor X"] : [],
          objections: isPricing ? ["Too expensive"] : []
        };
      }
      
      if (p.includes("you are the crm")) {
        return {
          accountHealth: (isHealthy || isExpansion || isPositive) ? "Healthy" : (isDelay || isSupport || isLowAdoption) ? "At Risk" : "Critical",
          salesStage: "Active Customer",
          opportunityValue: isExpansion ? "$150,000" : "$50,000"
        };
      }
      
      if (p.includes("you are the risk")) {
        const deal = (isHealthy || isExpansion || isPositive) ? 10 : isPricing ? 60 : (isDelay || isSupport) ? 75 : (isHighChurn || isRenewalRisk) ? 95 : 40;
        const churn = (isHealthy || isExpansion || isPositive) ? 5 : isPricing ? 50 : (isDelay || isSupport) ? 70 : (isHighChurn || isRenewalRisk) ? 90 : 35;
        return {
          dealRisk: deal,
          churnRisk: churn,
          riskFactors: deal > 50 ? ["Immediate action required"] : ["Stable account"]
        };
      }
      
      if (p.includes("enterprise recommendation")) {
        let action = "Continue standard monitoring";
        let impact = "Maintain customer health";
        let prio = "Low";
        let why = "Customer is healthy and engaged, with no immediate risks detected.";
        let evidence = ["Stable active usage", "No support escalations"];
        let immediate = ["Monitor usage metrics", "Check in next quarter"];
        let metrics = ["Stable active usage", "No support escalations"];
        let risks = ["Missed expansion opportunities"];
        
        if (isDelay) { 
          action = "Execute Technical Recovery Plan"; 
          impact = "Increase renewal from 40% → 85%. Protect $120,000 ARR."; prio = "Critical"; 
          why = "Implementation is severely delayed and customer is frustrated with blockers. High risk of churn before launch.";
          evidence = ["Missed internal deadlines", "Implementation is blocked"];
          immediate = ["Assign Dedicated Solution Architect within 24h", "Schedule executive alignment call", "Create revised 30-day rollout plan"];
          metrics = ["Blocker resolved in 7 days", "Go-live date confirmed"];
          risks = ["Customer cancels contract before launch", "Negative market reputation"];
        }
        else if (isSupport) { 
          action = "Priority Engineering Escalation"; impact = "Increase renewal from 60% → 90%. Protect $80,000 ARR."; prio = "High";
          why = "High volume of unresolved tickets is blocking the core workflow.";
          evidence = ["Too many bugs", "Support backlog"];
          immediate = ["Route tickets to Tier 3", "Daily sync with customer lead"];
          metrics = ["Zero critical bugs within 48h"];
          risks = ["Customer escalation to CEO"];
        }
        else if (isHighChurn || isRenewalRisk) { 
          action = "Executive Retention Strategy & Concession Plan"; impact = "Increase renewal from 20% → 75%. Protect $250,000 ARR."; prio = "Critical"; 
          why = "Customer explicitly evaluating competitor due to low perceived ROI from current deployment. Renewal due in 30 days.";
          evidence = ["Evaluating competitor X", "Low engagement"];
          immediate = ["CEO to CEO alignment call", "Offer 3 months free on renewal", "Deploy free architecture review"];
          metrics = ["Competitor evaluation halted", "Contract signed"];
          risks = ["Total loss of $250k ARR", "Competitor gains market share"];
        }
        else if (isPricing) { 
          action = "Prepare Commercial Proposal & Pricing Review"; impact = "Increase renewal from 72% → 91%. Protect $180,000 ARR."; prio = "Medium"; 
          why = "Customer is technically satisfied but budget-constrained. Competitor offering lower price point.";
          evidence = ["Too expensive", "Budget review requested"];
          immediate = ["Schedule commercial negotiation meeting", "Prepare revised pricing proposal", "Obtain Sales Director approval for discount range", "Share ROI comparison with competitors", "Follow up within 48 hours"];
          metrics = ["Customer accepts pricing discussion", "Commercial proposal delivered", "No competitor evaluation after 14 days"];
          risks = ["Customer migrates to cheaper alternative", "Revenue loss risk increases"];
        }
        else if (isExpansion || isPositive) { 
          action = "Pitch AI Analytics Suite & Upsell Strategy"; impact = "99% Renewal. Protect $150,000 ARR (+ $50k Expansion)."; prio = "High"; 
          why = "High user adoption metrics. Customer expressing need for advanced reporting and budget confirmed for Q3.";
          evidence = ["Positive feedback", "Want to expand"];
          immediate = ["Schedule AI product workshop", "Prepare customized demo using their data", "Draft expansion proposal"];
          metrics = ["Workshop completed", "Expansion contract signed"];
          risks = ["Competitor sells point solution for analytics"];
        }

        return {
          primaryRecommendation: action,
          businessReasoning: why,
          supportingEvidence: evidence,
          executionPlan: immediate,
          expectedBusinessImpact: impact,
          priority: prio,
          successMetrics: metrics,
          risksIfIgnored: risks,
          confidence: 96
        };
      }
      
      if (p.includes("you are the explainability")) {
        return {
          reasoning: "The multi-agent system evaluated the transcript, CRM data, and enterprise playbooks to arrive at a contextual business decision that maximizes retention and unblocks the customer.",
          evidence: ["Customer sentiment mapped", "Playbook guidelines applied", "Risk scores calculated"],
          confidence: 96,
          sources: ["CRM", "Meeting Transcript", "ChromaDB Playbooks"]
        };
      }
      
      return {};
    }
    
    return "Processed successfully.";
  }
}

module.exports = { DemoProvider };
