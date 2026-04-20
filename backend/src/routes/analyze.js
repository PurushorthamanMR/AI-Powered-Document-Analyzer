const express = require("express");
const upload = require("../middleware/upload");
const { getInputText } = require("../services/extractText");
const { analyzeDocument } = require("../services/analyzeDocument");

const router = express.Router();
const MIN_INPUT_LENGTH = 50;

function getValidationError(text) {
  if (!text) {
    return "Provide a PDF file or paste text to analyze.";
  }

  if (text.length < MIN_INPUT_LENGTH) {
    return "Input is too short. Please provide at least 50 characters.";
  }

  return "";
}

router.post("/", upload.single("file"), async (req, res, next) => {
  try {
    const inputText = await getInputText({
      file: req.file,
      text: req.body?.text,
    });

    const validationError = getValidationError(inputText);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const result = await analyzeDocument(inputText);

    return res.status(200).json({
      sourceType: req.file ? "pdf" : "text",
      inputLength: inputText.length,
      aiProvider: "gemini",
      ...result,
    });
  } catch (error) {
    if (error?.message === "Only PDF files are allowed.") {
      return res.status(400).json({ error: error.message });
    }

    if (error?.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "PDF file must be 10MB or less." });
    }

    return next(error);
  }
});

module.exports = router;
