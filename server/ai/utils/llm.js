const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

class MockLLM {
  async invoke(prompt) {
    // Simulate realistic AI processing network delay (300ms - 800ms)
    const delay = Math.floor(Math.random() * 500) + 300;
    await new Promise(resolve => setTimeout(resolve, delay));

    const p = prompt.toLowerCase();
    const isNeg = p.includes("evaluating competitor") || p.includes("expensive") || p.includes("cancel") || p.includes("high risk");
    
    if (prompt.includes("Analyze this B2B meeting")) {
      return { content: `Pain Points: ${isNeg ? "High platform costs, competitor threat." : "Needs faster onboarding for EU team."} Sentiment: ${isNeg ? "Anxious/Negative" : "Positive/Ready to Expand"}.` };
    } else if (prompt.includes("Extract a structured Customer Profile")) {
      const health = isNeg || p.includes("escalat") ? "Red (High Risk)" : "Green (Healthy)";
      return { content: `Extracted Profile: Enterprise SaaS Tier. Health: ${health}.` };
    } else if (prompt.includes("Analyze the risk")) {
      return { content: isNeg ? "High Deal Risk detected. The combined analysis indicates significant friction." : "Low Risk. Customer is satisfied and looking to expand usage." };
    } else if (prompt.includes("Next Best Action")) {
      if (isNeg) {
        return { content: JSON.stringify({ action: "Escalate to Tier 3 Support & Schedule EBR", confidence: 94 }) };
      } else {
        return { content: JSON.stringify({ action: "Pitch Enterprise Expansion Package", confidence: 88 }) };
      }
    } else if (prompt.includes("Explain the reasoning")) {
      if (isNeg) {
        return { content: JSON.stringify({ reasoning: "The customer has an upcoming renewal but is experiencing friction. Immediate escalation resolves the pain point while the EBR secures the renewal.", evidence: ["Found friction in recent notes/transcripts", "Opportunity is in renewal stage"] }) };
      } else {
        return { content: JSON.stringify({ reasoning: "The customer expressed satisfaction with the core platform and explicitly asked for faster onboarding for a new team, signaling readiness to buy more licenses.", evidence: ["Explicitly mentioned purchasing 50 additional licenses", "Zero open support tickets"] }) };
      }
    }
    return { content: "Processed successfully." };
  }
}

const getLLM = (temperature = 0.2) => {
  const apiKey = process.env.GEMINI_API_KEY || "YOUR_API_KEY_HERE";
  if (apiKey === "YOUR_API_KEY_HERE" || apiKey === "mock-key-for-development") {
    console.log("Using Mock LLM because API key is missing");
    return new MockLLM();
  }
  
  try {
    return new ChatGoogleGenerativeAI({
      modelName: "gemini-1.5-flash",
      maxOutputTokens: 2048,
      temperature,
      apiKey: apiKey
    });
  } catch (e) {
    console.warn("Failed to init Real LLM, falling back to mock");
    return new MockLLM();
  }
};

module.exports = { getLLM };
