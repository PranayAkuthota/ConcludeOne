require('dotenv').config({path: './.env'});
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

async function testModel(modelName) {
  try {
    const ai = new ChatGoogleGenerativeAI({
      model: modelName,
      apiKey: process.env.GEMINI_API_KEY,
      maxRetries: 0
    });
    const response = await ai.invoke("Reply with 'OK'");
    console.log(`[SUCCESS] ${modelName}:`, response.content);
  } catch(e) {
    console.log(`[ERROR] ${modelName}:`, e.message);
  }
}

async function run() {
  await testModel("gemini-1.5-flash");
  await testModel("gemini-1.5-flash-8b");
  await testModel("gemini-1.5-pro");
  await testModel("gemini-pro");
}
run();
