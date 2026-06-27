const generateCrmPrompt = (customerId) => {
  return `You are the CRM Context Agent.
Extract a structured Customer Profile for Customer ID: ${customerId}.
If specific CRM data is missing, deduce the account health and sales stage based on generic enterprise context.
Provide: accountHealth, salesStage, opportunityValue.`;
};

module.exports = { generateCrmPrompt };
