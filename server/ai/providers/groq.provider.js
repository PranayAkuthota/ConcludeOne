const { BaseProvider } = require("./base.provider");

class GroqProvider extends BaseProvider {
  constructor(apiKey, modelName = "llama3-8b-8192") {
    super(`Groq (${modelName})`);
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

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bodyOptions)
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Groq HTTP ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error("Empty response from Groq API");
      }

      if (schema) {
        try {
          const parsed = JSON.parse(content);
          return schema.parse(parsed);
        } catch (e) {
          console.error("Groq schema parsing failed:", e.message, "\nContent was:", content);
          throw new Error(`Failed to parse structured output from Groq: ${e.message}`);
        }
      }

      return content;
    } catch (error) {
      console.error("[CRITICAL ERROR] Groq API Invocation Failed:", error.message);
      throw error;
    }
  }
}

module.exports = { GroqProvider };
