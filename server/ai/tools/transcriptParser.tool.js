const { tool } = require("@langchain/core/tools");
const { z } = require("zod");

const transcriptParserTool = tool(
  async ({ transcript }) => {
    // In a real scenario, this might use Whisper API or chunking
    return `Parsed Transcript Length: ${transcript.length} characters`;
  },
  {
    name: "parse_transcript",
    description: "Parses a raw meeting transcript to normalize it before LLM analysis.",
    schema: z.object({
      transcript: z.string().describe("The raw text of the meeting transcript")
    })
  }
);

module.exports = { transcriptParserTool };
