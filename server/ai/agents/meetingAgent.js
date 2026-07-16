const { ProviderFactory } = require("../providers/providerFactory");
const { generateMeetingPrompt } = require("../prompts/meeting.prompt");
const { z } = require("zod");

const schema = z.object({
  sentiment: z.string(),
  painPoints: z.array(z.string()),
  requirements: z.array(z.string()),
  timeline: z.string(),
  budget: z.string(),
  competitors: z.array(z.string()),
  objections: z.array(z.string())
});

const run = async (state) => {
  const startTime = Date.now();
  const provider = ProviderFactory.getProvider("MEETING_MODEL");
  
  const transcript = state.inputs?.meetingTranscript || "No transcript provided.";
  const result = await provider.invoke(generateMeetingPrompt(transcript), schema);

  return {
    meetingInsights: result,
    agentLogs: [{
      agentName: "Meeting Agent",
      status: "Success",
      executionTimeMs: Date.now() - startTime,
      outputSummary: "Extracted pain points and sentiment from transcript"
    }]
  };
};
module.exports = { run };
