# AI-Powered Document Analyzer

This is a full-stack web app where users can upload a PDF or paste text and get:
- Summary
- Key Points
- Action Items

The app is intentionally simple and assignment-focused, with clean module structure and clear error handling.

## Tech Stack

- Frontend: React (Vite) + Tailwind CSS
- Backend: Node.js + Express
- PDF text extraction: `pdf-parse`
- AI model integration: Google Gemini API

## Approach and Design Decisions

- **Single-language stack:** JavaScript across frontend and backend for faster development and easier maintenance.
- **Modular backend:** separated into `routes`, `middleware`, and `services` for readability and testability.
- **Flexible input path:** one API endpoint supports both PDF upload and raw text input.
- **Structured AI output:** prompt enforces JSON output to reliably render Summary, Key Points, and Action Items in UI.
- **User feedback first:** loading, empty, and error states are explicit in the frontend to improve usability.

## Project Structure

```text
.
├─ frontend/
│  ├─ src/
│  │  ├─ components/
│  │  └─ lib/
├─ backend/
│  └─ src/
│     ├─ middleware/
│     ├─ routes/
│     └─ services/
```

## Setup Instructions

### 1) Install dependencies

```bash
# frontend
cd frontend
npm install

# backend
cd ../backend
npm install
```

### 2) Configure environment variables

Create env files from examples:
- `backend/.env` from `backend/.env.example`
- `frontend/.env` from `frontend/.env.example`

Backend variables:
- `PORT` (default: `5000`)
- `CORS_ORIGIN` (default: `http://localhost:5173`)
- `GEMINI_API_KEY` (required)
- `GEMINI_MODEL` (default: `gemini-2.5-pro`)

Frontend variables:
- `VITE_API_BASE_URL` (default: `http://localhost:5000`)

## How to Run the Project

Open two terminals.

### Terminal 1 - Backend

```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:5173` by default.

## API Contract

### `POST /api/analyze`

Request format: `multipart/form-data`
- `file` (optional, PDF)
- `text` (optional, raw text)

At least one input (`file` or `text`) is required.

Example success response:

```json
{
  "sourceType": "pdf",
  "inputLength": 1532,
  "aiProvider": "gemini",
  "summary": "Concise summary text...",
  "keyPoints": ["Point 1", "Point 2"],
  "actionItems": ["Action 1", "Action 2"]
}
```

## Notes

- This implementation targets assignment scope, not production hardening.
- Basic validations include empty input, invalid file type, max file size, short text, and AI response parsing errors.
