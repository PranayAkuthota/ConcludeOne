const { BaseProvider } = require("./base.provider");

class OpenRouterProvider extends BaseProvider {
  constructor(apiKey, modelName = "google/gemini-2.5-flash") {
    super(`OpenRouter (${modelName})`);
    this.apiKey = apiKey;
    this.modelName = modelName;
  }

  async invoke(prompt, schema = null) {
    try {
      let finalPrompt = prompt;
      let bodyOptions = {
        model: this.modelName,
        messages: [{ role: "user", content: finalPrompt }],
        temperature: 0.1,
      };

      if (schema) {
        bodyOptions.response_format = { type: "json_object" };
        finalPrompt = `${prompt}\n\nIMPORTANT: You MUST return a valid JSON object matching the requested schema. Ensure all fields are fully populated and conform strictly to the expected types.`;
        bodyOptions.messages[0].content = finalPrompt;
      }

      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://conclude.one",
          "X-Title": "Conclude One"
        },
        body: JSON.stringify(bodyOptions)
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`OpenRouter HTTP ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error("Empty response from OpenRouter API");
      }

      if (schema) {
        try {
          const parsed = JSON.parse(content);
          return schema.parse(parsed);
        } catch (e) {
          console.error("OpenRouter schema parsing failed:", e.message, "\nContent was:", content);
          throw new Error(`Failed to parse structured output from OpenRouter: ${e.message}`);
        }
      }

      return content;
    } catch (error) {
      console.error("[CRITICAL ERROR] OpenRouter API Invocation Failed:", error.message);
      throw error;
    }
  }
}

module.exports = { OpenRouterProvider };
