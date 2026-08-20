
const cases = [
  {
    title: "Pricing Objection & Commercial Renewal",
    customerId: "CUST-PRICE",
    inputs: {
      meetingTranscript: "Customer: We love the platform, but your new pricing tier is 20% more expensive than last year. We are exploring competitors that offer a more flexible commercial model. Can you do a pricing review?",
      crmNotes: "Upcoming renewal in 45 days. Healthy adoption but budget constrained this year."
    }
  },
  {
    title: "Technical Blocker: SSO Azure AD",
    customerId: "CUST-TECH",
    inputs: {
      meetingTranscript: "Customer: Our engineering team is completely blocked. The SSO SAML integration with Azure AD is failing and your documentation is outdated. Security will not let us go live.",
      crmNotes: "Implementation stage. Go-live delayed by 2 weeks already. High risk of churn."
    }
  },
  {
    title: "Expansion Opportunity: Analytics Suite",
    customerId: "CUST-GROW",
    inputs: {
      meetingTranscript: "Customer: We've had a great year using Conclude One. Our marketing team wants to onboard 50 new users next quarter. Do you have an advanced analytics suite we could look at?",
      crmNotes: "Account is very healthy. Zero support tickets. High product adoption."
    }
  },
  {
    title: "Feature Request: Custom Reporting",
    customerId: "CUST-FEAT",
    inputs: {
      meetingTranscript: "Customer: We really need a custom reporting feature to export these metrics to PDF. Is this on your roadmap? It's becoming a missing feature that our executives are asking about.",
      crmNotes: "Stable customer. No churn risk, but low engagement with current dashboard."
    }
  },
  {
    title: "Healthy Account: QBR Planning",
    customerId: "CUST-HLTH",
    inputs: {
      meetingTranscript: "Customer: Everything is going positive and happy. The team loves the tool. We just need to review our metrics for the quarter.",
      crmNotes: "Very healthy account. Steady usage. No immediate threats."
    }
  }
];

async function generateCases() {
  console.log("Generating 5 diverse test cases to validate Recommendation Engine...");
  
  for (const c of cases) {
    try {
      console.log(`Submitting Case: ${c.title}...`);
      const res = await fetch("http://localhost:3005/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(c)
      });
      const data = await res.json();
      console.log(`✅ Started Workflow for Case ID: ${data._id}`);
      // Wait 10 seconds between submitting cases so we don't spam the free-tier Gemini API
      await new Promise(resolve => setTimeout(resolve, 10000));
    } catch (e) {
      console.error(`❌ Failed to submit ${c.title}:`, e.message);
    }
  }
  
  console.log("\nAll cases submitted! Please wait ~30-60 seconds for LangGraph workflows to complete.");
  console.log("You can view the results in the Conclude One UI Dashboard.");
}

generateCases();
