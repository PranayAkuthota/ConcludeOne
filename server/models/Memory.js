const mongoose = require("mongoose");

const memorySchema = new mongoose.Schema({
  customerId: { type: String, required: true, unique: true },
  interactions: [{
    caseId: String,
    date: { type: Date, default: Date.now },
    summary: String,
    recommendation: String
  }],
  historicalContext: String
});

module.exports = mongoose.model("Memory", memorySchema);
