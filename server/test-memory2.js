const { memoryLookupTool } = require("./ai/tools/memoryLookup.tool");
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/conclude_one").then(async () => {
  const result = await memoryLookupTool.invoke({ customerId: "CUST-99044" });
  console.log("TOOL RESULT TYPE:", typeof result);
  console.log("TOOL RESULT:", result);
  process.exit(0);
});
