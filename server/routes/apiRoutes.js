const express = require('express');
const router = express.Router();
const Case = require('../models/Case');
const { runWorkflow } = require('../ai/orchestrator/langGraphWorkflow');

// Create a new case (triggers workflow)
router.post('/cases', async (req, res) => {
  try {
    const { title, customerId, inputs } = req.body;
    const newCase = await Case.create({
      title,
      customerId,
      inputs,
      status: 'Processing'
    });
    
    // Trigger LangGraph workflow asynchronously
    runWorkflow({
      caseId: newCase._id.toString(),
      customerId,
      inputs,
    }).then(async (finalState) => {
      console.log("FINAL STATE:", JSON.stringify(finalState, null, 2));
      newCase.recommendation = {
        nextBestAction: finalState.recommendation?.recommendation || "Review manually",
        confidenceScore: finalState.recommendation?.confidence || 50,
        businessReasoning: finalState.explanation?.reasoning || "",
        evidence: finalState.explanation?.evidence || [],
        status: "Pending Approval"
      };
      newCase.agentLogs = finalState.agentLogs;
      newCase.enterpriseContext = finalState.enterpriseContext;
      newCase.historicalMemory = finalState.historicalMemory;
      newCase.status = "Requires Approval";
      await newCase.save();
      console.log(`Case ${newCase._id} workflow completed.`);
    }).catch(err => console.error("Workflow error:", err));
    
    res.status(201).json(newCase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all cases
router.get('/cases', async (req, res) => {
  try {
    const cases = await Case.find().sort({ createdAt: -1 });
    res.json(cases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get case details
router.get('/cases/:id', async (req, res) => {
  try {
    const caseItem = await Case.findById(req.params.id);
    if (!caseItem) return res.status(404).json({ error: 'Case not found' });
    res.json(caseItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve recommendation
router.post('/approvals/:caseId/approve', async (req, res) => {
  try {
    const caseItem = await Case.findById(req.params.caseId);
    if (!caseItem) return res.status(404).json({ error: 'Case not found' });
    
    caseItem.status = 'Completed';
    if (caseItem.recommendation) {
      caseItem.recommendation.status = 'Approved';
    }
    
    await caseItem.save();
    res.json(caseItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get agent statuses and metrics
router.get('/agents', (req, res) => {
  res.json([
    { name: "Planner Agent", status: "Active", executionTime: "45ms", description: "Orchestrates workflow" },
    { name: "Meeting Agent", status: "Active", executionTime: "1200ms", description: "Extracts insights from transcripts" },
    { name: "CRM Context Agent", status: "Active", executionTime: "150ms", description: "Retrieves customer profile" },
    { name: "Knowledge Retrieval Agent", status: "Active", executionTime: "300ms", description: "Queries ChromaDB" },
    { name: "Risk Analysis Agent", status: "Active", executionTime: "900ms", description: "Evaluates churn and deal risk" },
    { name: "Recommendation Agent", status: "Active", executionTime: "1500ms", description: "Generates Next Best Action" },
    { name: "Explainability Agent", status: "Active", executionTime: "1800ms", description: "Provides business reasoning" },
    { name: "Memory Agent", status: "Active", executionTime: "50ms", description: "Stores conversation history" }
  ]);
});

// Get connected knowledge sources
router.get('/knowledge', (req, res) => {
  res.json([
    { source: "CRM", status: "Connected", items: "14,500 Profiles", lastSync: "10 mins ago" },
    { source: "Product Docs", status: "Connected", items: "1,200 Articles", lastSync: "1 hour ago" },
    { source: "Business Policies", status: "Connected", items: "45 Policies", lastSync: "1 day ago" },
    { source: "Playbooks", status: "Connected", items: "12 Playbooks", lastSync: "2 days ago" }
  ]);
});

// Get analytics
router.get('/analytics', (req, res) => {
  res.json({
    recommendationsGenerated: 1245,
    approvalRate: "87%",
    averageConfidence: "92%",
    averageProcessingTime: "4.2s"
  });
});

module.exports = router;
