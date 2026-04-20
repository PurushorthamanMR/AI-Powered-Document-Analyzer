# Frontend - AI-Powered Document Analyzer

This frontend is built with React + Vite + Tailwind CSS.
It allows users to:
- Upload a PDF or paste text
- Trigger AI analysis
- View Summary, Key Points, and Action Items
- See loading and error states clearly

## Prerequisites

- Node.js 20+ (or compatible recent version)
- Running backend API (default: `http://localhost:5000`)

## Environment Setup

Create `frontend/.env` with:

```env
VITE_API_BASE_URL=http://localhost:5000
```

## Install and Run

```bash
cd frontend
npm install
npm run dev
```

The app runs on `http://localhost:5173` by default.

## Build and Lint

```bash
npm run lint
npm run build
```

## Notes

- This frontend expects backend endpoint: `POST /api/analyze`.
- Backend must be running for analysis requests to succeed.
