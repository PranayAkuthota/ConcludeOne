const { GeminiProvider } = require("./gemini.provider");
const { OpenRouterProvider } = require("./openrouter.provider");
const { GroqProvider } = require("./groq.provider");
const { BaseProvider } = require("./base.provider");

class FallbackProvider extends BaseProvider {
  constructor(primary, fallbacks) {
    super(primary.name);
    this.primary = primary;
    this.fallbacks = fallbacks;
    this.lastUsedProviderName = primary.name;
  }

  async invoke(prompt, schema = null) {
    const providers = [this.primary, ...(this.fallbacks || [])];
    let lastError = null;

    for (const provider of providers) {
      if (!provider) continue;
      try {
        console.log(`[ORCHESTRATION] Invoking provider: ${provider.name}`);
        const result = await provider.invoke(prompt, schema);
        this.lastUsedProviderName = provider.name;
        return result;
      } catch (error) {
        lastError = error;
        console.warn(`[ORCHESTRATION] Provider [${provider.name}] failed: ${error.message}. Trying next fallback...`);
      }
    }

    console.error(`[FAILOVER] All configured AI providers failed. Last error: ${lastError?.message}`);
    throw lastError || new Error("All AI providers failed.");
  }
}

class ProviderFactory {
  static getProvider(modelEnvKey = "RECOMMENDATION_MODEL") {
    // 1. Determine configured providers
    const configuredProvider = process.env.AI_PROVIDER || "gemini";
    
    const geminiKey = process.env.GEMINI_API_KEY;
    const openrouterKey = process.env.OPENROUTER_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;

    const geminiModel = process.env[modelEnvKey] || (modelEnvKey === "MEETING_MODEL" ? "gemini-2.5-flash-lite" : "gemini-2.5-flash");
    const openrouterModel = process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash";
    const groqModel = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

    // Instantiators
    const makeGemini = () => new GeminiProvider(geminiKey, geminiModel);
    const makeOpenRouter = () => new OpenRouterProvider(openrouterKey, openrouterModel);
    const makeGroq = () => new GroqProvider(groqKey, groqModel);

    // Create the primary provider based on env configuration
    let primary;
    let chain = [];

    if (configuredProvider === "openrouter" && openrouterKey) {
      primary = makeOpenRouter();
      if (geminiKey) chain.push(makeGemini());
      if (groqKey) chain.push(makeGroq());
    } else if (configuredProvider === "groq" && groqKey) {
      primary = makeGroq();
      if (geminiKey) chain.push(makeGemini());
      if (openrouterKey) chain.push(makeOpenRouter());
    } else if (configuredProvider === "demo") {
      throw new Error("Demo Mode / Mock Provider is disabled. Only AI Providers are allowed.");
    } else {
      // Default to Gemini
      if (geminiKey && geminiKey !== "YOUR_API_KEY_HERE" && geminiKey !== "mock-key-for-development") {
        primary = makeGemini();
        if (openrouterKey) chain.push(makeOpenRouter());
        if (groqKey) chain.push(makeGroq());
      } else if (openrouterKey) {
        primary = makeOpenRouter();
        if (groqKey) chain.push(makeGroq());
      } else if (groqKey) {
        primary = makeGroq();
      } else {
        throw new Error("No active AI providers configured. Please set GEMINI_API_KEY, OPENROUTER_API_KEY, or GROQ_API_KEY in your .env.");
      }
    }

    console.log(`ProviderFactory: Primary [${primary.name}], Failover Chain [${chain.map(p => p.name).join(" -> ")}]`);
    return new FallbackProvider(primary, chain);
  }

  static getProviderName(modelEnvKey = "RECOMMENDATION_MODEL") {
    const modelName = process.env[modelEnvKey] || "gemini-2.5-flash";
    return modelName === "gemini-2.5-flash-lite" ? "Gemini 2.5 Flash-Lite" : "Gemini 2.5 Flash";
  }
}

module.exports = { ProviderFactory };
