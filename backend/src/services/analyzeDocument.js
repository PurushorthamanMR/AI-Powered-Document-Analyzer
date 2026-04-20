const { GoogleGenerativeAI } = require("@google/generative-ai");

const DEFAULT_MODEL = "gemini-2.5-pro";
const SYSTEM_PROMPT = `
You are a high-precision document analyst for business and technical content.
Your output must be factually grounded in the provided document text only.
Do not hallucinate, infer hidden facts, or introduce external knowledge.
If information is missing, be explicit and conservative.
Prioritize accuracy, clarity, and usefulness over verbosity.
Return ONLY valid JSON with this exact shape and no extra keys/text:
{
  "summary": "string",
  "keyPoints": ["string"],
  "actionItems": ["string"]
}
Summary rules:
- 3-5 sentences, neutral tone, no marketing language.
- Cover the main objective, scope, and important constraints/risks if present.
- Do not repeat the same idea in different wording.
Key points rules:
- 4-8 bullet points when possible.
- Each point must be specific, non-overlapping, and traceable to the source text.
- Include numbers, dates, owners, or decisions when available.
Action items rules:
- Include only if a concrete next step is implied by the document.
- Start with strong action verbs (e.g., Finalize, Review, Assign, Validate).
- Prefer clear owner/timeline details when present; do not invent them.
- If no real actions exist, return an empty array.
Quality checks before responding:
- Ensure JSON is parseable.
- Ensure each item is concise and not duplicated.
- Ensure every claim can be supported by the input text.
`.trim();

function createHttpError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function analyzeDocument(documentText) {
  const aiText = await runGeminiAnalysis(documentText);

  if (!aiText) {
    throw createHttpError("AI response was empty.", 502);
  }

  return parseStructuredOutput(aiText);
}

async function runGeminiAnalysis(documentText) {
  if (!process.env.GEMINI_API_KEY) {
    throw createHttpError("GEMINI_API_KEY is missing in environment configuration.", 500);
  }

  const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = client.getGenerativeModel({
    model: process.env.GEMINI_MODEL || DEFAULT_MODEL,
    generationConfig: {
      temperature: 0.2,
    },
  });

  const response = await model.generateContent([
    SYSTEM_PROMPT,
    `Analyze this document:\n\n${documentText}`,
  ]);

  return response.response?.text()?.trim();
}

function parseStructuredOutput(textOutput) {
  const cleaned = textOutput
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (_err) {
    throw createHttpError("AI output could not be parsed as JSON.", 502);
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
