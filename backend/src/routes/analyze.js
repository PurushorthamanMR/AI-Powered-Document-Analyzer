const express = require("express");
const upload = require("../middleware/upload");
const { getInputText } = require("../services/extractText");
const { analyzeDocument } = require("../services/analyzeDocument");

const router = express.Router();

router.post("/", upload.single("file"), async (req, res, next) => {
  try {
    const text = await getInputText({
      file: req.file,
      text: req.body?.text,
    });

    if (!text) {
      return res.status(400).json({
        error: "Provide a PDF file or paste text to analyze.",
      });
    }

    if (text.length < 50) {
      return res.status(400).json({
        error: "Input is too short. Please provide at least 50 characters.",
      });
    }

    const result = await analyzeDocument(text);

    return res.status(200).json({
      sourceType: req.file ? "pdf" : "text",
      inputLength: text.length,
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
