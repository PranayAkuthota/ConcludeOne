# System Architecture: Conclude One

This document details the architectural decisions and underlying multi-agent AI system powering Conclude One.

---

## 1. Multi-Agent Orchestration (LangGraph)

Conclude One does not rely on a single, monolithic LLM prompt. Instead, it utilizes **LangGraph**, a state machine framework, to organize discrete, specialized agents. Each agent acts as a node in the graph, reading from and writing to a shared global state.

### The Planner Agent (Dynamic Routing)
The workflow always begins with the **Planner Agent**. It receives the initial inputs (transcript and CRM notes) and dynamically determines which specialized agents need to be invoked. It outputs a routing decision, allowing the system to bypass unnecessary steps if the context is missing, or execute multiple agents in parallel.

### Parallel Execution Node
For maximum efficiency, the LangGraph workflow features a `parallel_gather` node that concurrently executes:
- **Meeting Agent**: Extracts key pain points, sentiment, and objections from the raw transcript.
- **CRM Agent**: Synthesizes customer health, ARR, and sales stage from CRM logs.
- **Enterprise Context Agent (RAG)**: Connects to a local ChromaDB instance to retrieve relevant business playbooks and policies using semantic vector search.

---

## 2. Decision Intelligence Pipeline

Once the raw data is extracted and synthesized, it is passed down the pipeline for high-order reasoning.

### Risk Agent
Computes deterministic risk scores (0-100) for **Deal Risk** and **Churn Risk** based on the aggregated intelligence. This forces the LLM to quantify its abstract reasoning before generating recommendations.

### Recommendation Agent
Synthesizes the output of all prior agents to generate the **Next Best Action**. It is strictly prompted with a "Diversity Rule" and "Consultant Persona" to ensure it produces actionable, executive-level briefs rather than generic AI platitudes.

### Explainability Agent
Enterprise systems require trust. The Explainability Agent inspects the Recommendation Agent's output and traces it back to the original evidence (e.g., specific lines in a playbook or CRM notes) to provide transparent business reasoning.

---

## 3. Human-in-the-Loop & Reasoning Memory

Conclude One operates under a **Human-in-the-Loop (HITL)** paradigm. 
1. The orchestrator pauses execution at the "Requires Approval" stage.
2. The user reviews the Executive Brief and the Evidence in the UI.
3. Upon approval, the workflow finalizes, and the **Memory Agent** engages.

The Memory Agent persists the interaction, the context, and the approved decision into MongoDB as "Long-Term Memory". Future interactions with the same `customerId` automatically inject this memory into the workflow state, allowing the agents to "remember" past escalations or retention strategies.

---

## 4. The Tool & Provider Abstraction Layer

To ensure resilience and presentation stability, the application features a robust **Provider Factory**.

### Gemini Provider
The default production provider uses the `google/gemini-1.5-pro` model to dynamically parse natural language instructions.

### Mock Provider (Demo Mode)
For live presentations, hackathons, or environments without internet access, a `MockProvider` bypasses the network entirely. It utilizes exact string matching and context detection to instantly simulate the LangGraph execution, guaranteeing zero rate limits and lightning-fast demo capabilities.
