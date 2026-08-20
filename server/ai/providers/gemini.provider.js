const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { BaseProvider } = require("./base.provider");

class GeminiProvider extends BaseProvider {
  constructor(apiKey, modelName = "gemini-2.5-flash") {
    super(modelName === "gemini-2.5-flash-lite" ? "Gemini 2.5 Flash-Lite" : "Gemini 2.5 Flash");
    this.modelName = modelName;
    this.model = new ChatGoogleGenerativeAI({
      model: modelName,
      maxOutputTokens: 8192,
      temperature: 0.1,
      apiKey: apiKey,
      maxRetries: 0,
    });
  }

  async invoke(prompt, schema = null) {
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Gemini API Timeout Exceeded")), 30000)
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
      console.error("\n[CRITICAL ERROR] Gemini API Invocation Failed:");
      console.error(error.message);
      console.error("The system will NOT fall back to mock data. Throwing error upstream.");
      throw error;
    }
  }
}

module.exports = { GeminiProvider };
