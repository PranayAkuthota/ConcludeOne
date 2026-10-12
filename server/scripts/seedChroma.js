
require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { ChromaClient, CloudClient } = require("chromadb");
const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");

const isCloudConfigured = Boolean(
  process.env.CHROMA_API_KEY &&
  process.env.CHROMA_TENANT &&
  process.env.CHROMA_DATABASE
);

if (!isCloudConfigured && !process.env.CHROMA_URL) {
  throw new Error(
    "Configure CHROMA_API_KEY, CHROMA_TENANT, CHROMA_DATABASE for Cloud, or CHROMA_URL for local ChromaDB."
  );
}

const client = isCloudConfigured
  ? new CloudClient({
      apiKey: process.env.CHROMA_API_KEY,
      tenant: process.env.CHROMA_TENANT,
      database: process.env.CHROMA_DATABASE,
    })
  : new ChromaClient({
      path: process.env.CHROMA_URL,
    });

const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004",
  apiKey: process.env.GEMINI_API_KEY,
});

async function readKnowledgeFiles(dir) {
  let results = [];

  if (!fs.existsSync(dir)) {
    throw new Error(`Knowledge directory not found: ${dir}`);
  }

  for (const file of fs.readdirSync(dir)) {
    const filePath = path.resolve(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      results = results.concat(await readKnowledgeFiles(filePath));
    } else if (file.endsWith(".md")) {
      const content = fs.readFileSync(filePath, "utf8").trim();

      if (content) {
        // Relative paths provide stable, unique IDs.
        const id = path.relative(dir, filePath).replace(/\\/g, "/");

        results.push({
          id,
          content,
          path: id,
        });
      }
    }
  }

  return results;
}

async function seed() {
  console.log(
    `Seeding ChromaDB (${isCloudConfigured ? "Cloud" : "Local"})...`
  );

  await client.heartbeat();
  console.log("ChromaDB connection successful.");

  const knowledgeDir = path.join(__dirname, "..", "knowledge");
  const documents = await readKnowledgeFiles(knowledgeDir);

  if (documents.length === 0) {
    throw new Error("No non-empty Markdown files found in server/knowledge.");
  }

  console.log(`Found ${documents.length} documents.`);

  // Reuse the collection; do not delete existing knowledge.
  let collection;

  try {
    collection = await client.getCollection({
      name: "enterprise_knowledge",
    });
    console.log("Using existing enterprise_knowledge collection.");
  } catch {
    collection = await client.createCollection({
      name: "enterprise_knowledge",
    });
    console.log("Created enterprise_knowledge collection.");
  }

  const texts = documents.map((document) => document.content);
  const ids = documents.map((document) => document.id);
  const metadatas = documents.map((document) => ({
    source: document.path,
  }));

  console.log("Generating Gemini embeddings...");
  const vectors = await embeddings.embedDocuments(texts);

  // Upsert makes repeated runs update matching IDs instead of duplicating them.
  await collection.upsert({
    ids,
    embeddings: vectors,
    metadatas,
    documents: texts,
  });

  console.log(
    `Seeding completed. Processed ${documents.length} documents.`
  );
}

seed().catch((error) => {
  console.error("ChromaDB seeding failed:", error.message);
  process.exitCode = 1;
});
