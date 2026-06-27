const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema({
  nextBestAction: String,
  businessReasoning: String,
  confidenceScore: Number,
  evidence: [String],
  status: {
    type: String,
    enum: ["Pending Approval", "Approved", "Rejected", "Modified"],
    default: "Pending Approval"
  },
  modifiedAction: String
});

const caseSchema = new mongoose.Schema({
  title: String,
  customerId: String,
  status: {
    type: String,
    enum: ["Pending", "Processing", "Requires Approval", "Completed", "Rejected"],
    default: "Pending"
  },
  inputs: {
    meetingTranscript: String,
    additionalNotes: String
  },
  enterpriseContext: mongoose.Schema.Types.Mixed,
  historicalMemory: String,
  recommendation: recommendationSchema,
  agentLogs: [{
    agentName: String,
    status: String,
    executionTimeMs: Number,
    timestamp: { type: Date, default: Date.now },
    outputSummary: String
  }]
}, { timestamps: true });

module.exports = mongoose.model("Case", caseSchema);
