require('dotenv').config({path: './.env'});
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
async function test() {
  try {
    const ai = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      apiKey: process.env.GEMINI_API_KEY,
      maxRetries: 0
    });
    const response = await ai.invoke("Reply with exactly: 'Hello World'");
    console.log("SUCCESS:", response.content);
  } catch(e) {
    console.log("ERROR:", e.message);
  }
}
test();
