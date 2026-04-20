const { PDFParse } = require("pdf-parse");

async function extractTextFromPdfBuffer(buffer) {
  const parser = new PDFParse({ data: buffer });

  try {
    const parsed = await parser.getText();
    return normalizeText(parsed.text || "");
  } finally {
    await parser.destroy();
  }
}

function normalizeText(rawText) {
  return rawText.replace(/\s+/g, " ").trim();
}

function getInputText({ file, text }) {
  if (file?.buffer) {
    return extractTextFromPdfBuffer(file.buffer);
  }

  if (typeof text === "string") {
    return Promise.resolve(normalizeText(text));
  }

  return Promise.resolve("");
}

module.exports = {
  getInputText,
};
