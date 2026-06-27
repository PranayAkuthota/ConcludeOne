const { GeminiProvider } = require("./gemini.provider");
const { MockProvider } = require("./mock.provider");

class ProviderFactory {
  static getProvider() {
    const apiKey = process.env.GEMINI_API_KEY;
    
    // Check if key is missing or set to the default mock value
    if (!apiKey || apiKey === "YOUR_API_KEY_HERE" || apiKey === "mock-key-for-development") {
      console.log("ProviderFactory: Initializing Mock Provider");
      return new MockProvider();
    }

    try {
      console.log("ProviderFactory: Initializing Gemini Provider");
      return new GeminiProvider(apiKey);
    } catch (e) {
      console.warn("ProviderFactory: Failed to initialize Gemini, falling back to Mock. Error:", e.message);
      return new MockProvider();
    }
  }
}

module.exports = { ProviderFactory };
