# Backend - AI-Powered Document Analyzer

Express backend for handling:
- PDF upload or raw text input
- Text extraction from PDF
- Gemini AI analysis
- Structured response (summary, key points, action items)

## Tech Stack

- Node.js
- Express
- Multer (file upload)
- pdf-parse (PDF text extraction)
- Google Gemini API (`@google/generative-ai`)

## Setup

### 1) Install dependencies

```bash
cd backend
npm install
```

### 2) Configure environment

Create `backend/.env` (or copy from `.env.example`) with:

```env
PORT=5000
CORS_ORIGIN=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-pro
```

## Run

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

Backend runs on `http://localhost:5000` by default.

## API

### Health check

- `GET /api/health`

Response:

```json
{
  "ok": true,
  "message": "Document Analyzer API is running."
}
```

### Analyze document

- `POST /api/analyze`
- Content type: `multipart/form-data`
- Fields:
  - `file` (optional, PDF only)
  - `text` (optional, raw text)

At least one input (`file` or `text`) is required.

Example success response:

```json
{
  "sourceType": "pdf",
  "inputLength": 1532,
  "aiProvider": "gemini",
  "summary": "Concise summary...",
  "keyPoints": ["Point 1", "Point 2"],
  "actionItems": ["Action 1", "Action 2"]
}
```

## Error Handling

Basic validations included:
- Empty input
- Input too short
- Invalid file type (non-PDF)
- File too large (max 10MB)
- Missing Gemini API key
- Invalid AI output format
