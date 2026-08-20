require("dotenv").config();
const mongoose = require("mongoose");
const { runWorkflow } = require("../ai/orchestrator/langGraphWorkflow");
const { ProviderFactory } = require("../ai/providers/providerFactory");

ProviderFactory.getProvider();

const scenarios = [
  {
    name: "1. RetailSphere Pricing Objection",
    customerId: "CUST-RETAIL",
    inputs: {
      meetingTranscript: "Customer: Everything technically is working perfectly. Our technical team loves the product and adoption is high. However, our CFO is mandating budget cuts. Competitor X has offered us a similar platform for 30% less. We really need a major discount to justify renewing with you.",
      crmNotes: "Successful implementation. Excellent technical experience. No support issues. High adoption. Pending renewal in 45 days. Budget constraints noted by AE."
    }
  },
  // {
  //   name: "2. Pricing Objection",
  //   customerId: "CUST-PRICE",
  //   inputs: {
  //     meetingTranscript: "Your pricing is too expensive. We need a budget review.",
  //     crmNotes: "Upcoming renewal. Exploring alternatives."
  //   }
  // },
  // {
  //   name: "3. Expansion Opportunity",
  //   customerId: "CUST-EXP",
  //   inputs: {
  //     meetingTranscript: "Customer: We want to upgrade and bring a new team of 50 users onto the platform. Can we get a demo of the analytics suite?",
  //     crmNotes: "Healthy adoption. $150k expansion opportunity."
  //   }
  // },
  // {
  //   name: "4. Feature Request",
  //   customerId: "CUST-FEAT",
  //   inputs: {
  //     meetingTranscript: "We need custom reporting features added to the product roadmap.",
  //     crmNotes: "Stable account, low engagement."
  //   }
  // },
  // {
  //   name: "5. Healthy Enterprise Customer",
  //   customerId: "CUST-HEALTH",
  //   inputs: {
  //     meetingTranscript: "Everything is going steady. Customer success playbook.",
  //     crmNotes: "Very healthy account. Steady usage."
  //   }
  // }
];

async function main() {
  global.isDemoMode = false;
  
  await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/conclude_one");
  console.log("Connected to MongoDB for testing.");

  for (const s of scenarios) {
    console.log(`\n\n======================================`);
    console.log(`Running Scenario: ${s.name}`);
    console.log(`======================================`);
    
    // Delay to avoid Gemini 15 RPM free tier rate limit
    await new Promise(res => setTimeout(res, 1000));
    
    const initialState = {
      caseId: `debug-${Date.now()}`,
      customerId: s.customerId,
      inputs: s.inputs
    };

    const finalState = await runWorkflow(initialState);
    
    console.log(`\n--- FINAL RECOMMENDATION ---`);
    console.log(JSON.stringify(finalState.recommendation, null, 2));

    console.log(`\n--- EXPLAINABILITY ---`);
    console.log(JSON.stringify(finalState.explanation, null, 2));
  }
  
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
