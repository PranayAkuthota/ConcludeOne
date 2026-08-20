require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { ChromaClient } = require("chromadb");
const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");

const client = new ChromaClient({ path: process.env.CHROMA_URL || "http://localhost:8000" });
const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004", // Latest Gemini embedding model
  apiKey: process.env.GEMINI_API_KEY,
});

async function readKnowledgeFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.resolve(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(await readKnowledgeFiles(filePath));
    } else if (file.endsWith('.md')) {
      const content = fs.readFileSync(filePath, 'utf8');
      results.push({ id: file, content, path: filePath });
    }
  }
  return results;
}

async function seed() {
  console.log("Seeding ChromaDB...");
  try {
    await client.heartbeat();
  } catch (e) {
    console.error("ChromaDB is not running. Please start it on port 8000.");
    return;
  }

  try {
    await client.deleteCollection({ name: "enterprise_knowledge" });
  } catch(e) {} // Ignore if doesn't exist

  const collection = await client.createCollection({ name: "enterprise_knowledge" });
  
  const knowledgeDir = path.join(__dirname, '..', 'knowledge');
  const documents = await readKnowledgeFiles(knowledgeDir);

  if (documents.length === 0) {
    console.log("No markdown files found in knowledge directory.");
    return;
  }

  console.log(`Found ${documents.length} documents. Generating embeddings...`);
  
  const texts = documents.map(d => d.content);
  const ids = documents.map(d => d.id);
  const metadatas = documents.map(d => ({ source: d.path }));

  // Generate embeddings using Gemini
  const vectors = await embeddings.embedDocuments(texts);

  await collection.add({
    ids: ids,
    embeddings: vectors,
    metadatas: metadatas,
    documents: texts,
  });

  console.log("Seeding completed successfully!");
}

seed();
