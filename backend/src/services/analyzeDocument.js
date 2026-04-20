const { GoogleGenerativeAI } = require("@google/generative-ai");

function getSystemPrompt() {
  return [
    "You are an assistant that analyzes business and technical documents.",
    "Return ONLY valid JSON with this exact shape:",
    "{",
    '  "summary": "string",',
    '  "keyPoints": ["string"],',
    '  "actionItems": ["string"]',
    "}",
    "Keep summary concise (3-5 sentences).",
    "Keep each key point and action item practical and specific.",
  ].join("\n");
}

async function analyzeDocument(documentText) {
  const textOutput = await runGeminiAnalysis(documentText);

  if (!textOutput) {
    const error = new Error("AI response was empty.");
    error.statusCode = 502;
    throw error;
  }

  return parseStructuredOutput(textOutput);
}

async function runGeminiAnalysis(documentText) {
  if (!process.env.GEMINI_API_KEY) {
    const error = new Error("GEMINI_API_KEY is missing in environment configuration.");
    error.statusCode = 500;
    throw error;
  }

  const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = client.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-2.5-pro",
    generationConfig: {
      temperature: 0.2,
    },
  });

  const response = await model.generateContent([
    getSystemPrompt(),
    `Analyze this document:\n\n${documentText}`,
  ]);

  return response.response?.text()?.trim();
}

function parseStructuredOutput(textOutput) {
  let parsed;
  const cleaned = textOutput
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  try {
    parsed = JSON.parse(cleaned);
  } catch (_err) {
    const error = new Error("AI output could not be parsed as JSON.");
    error.statusCode = 502;
    throw error;
  }

  return {
    summary: typeof parsed.summary === "string" ? parsed.summary.trim() : "",
    keyPoints: Array.isArray(parsed.keyPoints)
      ? parsed.keyPoints.map((item) => String(item).trim()).filter(Boolean)
      : [],
    actionItems: Array.isArray(parsed.actionItems)
      ? parsed.actionItems.map((item) => String(item).trim()).filter(Boolean)
      : [],
  };
}

module.exports = {
  analyzeDocument,
};
