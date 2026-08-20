const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema({
  primaryRecommendation: String,
  businessReasoning: String,
  supportingEvidence: [String],
  executionPlan: [String],
  expectedBusinessImpact: String,
  priority: { type: String, enum: ["Critical", "High", "Medium", "Low"] },
  successMetrics: [String],
  risksIfIgnored: [String],
  confidence: Number,
  status: {
    type: String,
    enum: ["Pending", "Pending Approval", "Approval Needed", "Approved", "Rejected", "Modified"],
    default: "Pending Approval"
  },
  aiProvider: String
});

const caseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: String,
  customerId: String,
  status: {
    type: String,
    enum: ["Pending", "Processing", "Requires Approval", "Completed", "Rejected", "Failed"],
    default: "Pending"
  },
  error: String,
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
