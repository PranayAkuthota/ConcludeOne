const generateMeetingPrompt = (transcript) => {
  return `You are the Meeting Analysis Agent.
Analyze this B2B meeting transcript.
Transcript:
"${transcript}"

Extract the following structured insights: sentiment, painPoints, requirements, timeline, budget, competitors, objections.`;
};

module.exports = { generateMeetingPrompt };
