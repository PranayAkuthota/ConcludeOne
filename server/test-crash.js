require("dotenv").config({path:"./.env"});
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/conclude_one").then(async () => {
  try {
    const { runWorkflow } = require("./ai/orchestrator/langGraphWorkflow");
    const state = await runWorkflow({ caseId: "test-crash", customerId: "TEST-CRASH", inputs: { meetingTranscript: "test" } });
    console.log("SUCCESS!");
  } catch(e) {
    console.error("WORKFLOW CRASHED:", e);
  }
  process.exit(0);
});
