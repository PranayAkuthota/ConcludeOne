const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

let globalRateLimitUntil = 0;

class GeminiProvider {
  constructor(apiKey) {
    this.model = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      maxOutputTokens: 2048,
      temperature: 0.1,
      apiKey: apiKey,
      maxRetries: 0,
    });
  }

  async invoke(prompt, schema = null) {
    if (globalRateLimitUntil > Date.now()) {
      console.log("Global rate limit active. Instantly falling back to MockProvider.");
      const { MockProvider } = require("./mock.provider");
      const fallback = new MockProvider();
      return await fallback.invoke(prompt, schema);
    }
    
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Gemini API Timeout / Rate Limit Wait Exceeded")), 3500)
      );
      
      let aiPromise;
      if (schema) {
        const modelWithStructuredOutput = this.model.withStructuredOutput(schema);
        aiPromise = modelWithStructuredOutput.invoke(prompt);
      } else {
        aiPromise = this.model.invoke(prompt);
      }
      
      const response = await Promise.race([aiPromise, timeoutPromise]);
      return schema ? response : response.content;
    } catch (error) {
      if (error.message.includes("429") || error.message.includes("Rate Limit") || error.message.includes("Timeout")) {
        globalRateLimitUntil = Date.now() + 60000; // 60 seconds circuit breaker
      }
      
      console.warn("Gemini API Error (Rate Limit/Quota). Falling back to MockProvider for this node.", error.message);
      const { MockProvider } = require("./mock.provider");
      const fallback = new MockProvider();
      return await fallback.invoke(prompt, schema);
    }
  }
}

module.exports = { GeminiProvider };
