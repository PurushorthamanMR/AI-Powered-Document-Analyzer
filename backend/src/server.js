const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const analyzeRouter = require("./routes/analyze");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  })
);
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, message: "Document Analyzer API is running." });
});

app.use("/api/analyze", analyzeRouter);

app.use((error, _req, res, _next) => {
  if (error?.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "PDF file must be 10MB or less." });
  }

  if (error?.message === "Only PDF files are allowed.") {
    return res.status(400).json({ error: error.message });
  }

  const status = error.statusCode || 500;
  return res.status(status).json({
    error: error.message || "Unexpected server error.",
  });
});

const server = app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});

// Some local environments can unref handles unexpectedly; keep server referenced.
server.ref();

server.on("error", (error) => {
  console.error("Server failed to start:", error.message);
});
