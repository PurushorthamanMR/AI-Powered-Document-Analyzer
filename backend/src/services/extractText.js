const { PDFParse } = require("pdf-parse");

function normalizeText(rawText = "") {
  return String(rawText).replace(/\s+/g, " ").trim();
}

async function extractTextFromPdfBuffer(buffer) {
  const parser = new PDFParse({ data: buffer });

  try {
    const result = await parser.getText();
    return normalizeText(result.text);
  } finally {
    await parser.destroy();
  }
}

async function getInputText({ file, text }) {
  if (file?.buffer) {
    return extractTextFromPdfBuffer(file.buffer);
  }

  return typeof text === "string" ? normalizeText(text) : "";
}

module.exports = {
  getInputText,
};
