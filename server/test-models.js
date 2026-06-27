require('dotenv').config();
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

async function testModel(modelName) {
  try {
    const model = new ChatGoogleGenerativeAI({
      model: modelName,
      apiKey: process.env.GEMINI_API_KEY
    });
    console.log(`Testing ${modelName}...`);
    const res = await model.invoke("say hi");
    console.log(`Success for ${modelName}! Output: ${res.content}`);
  } catch(e) {
    console.error(`Failed for ${modelName}:`, e.message);
  }
}

async function run() {
  await testModel("gemini-1.5-flash");
  await testModel("gemini-2.0-flash");
  await testModel("gemini-2.5-flash");
}
run();
