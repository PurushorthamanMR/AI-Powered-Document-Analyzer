const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export async function analyzeDocument({ file, text }) {
  const formData = new FormData();

  if (file) {
    formData.append("file", file);
  }

  if (text?.trim()) {
    formData.append("text", text.trim());
  }

  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: "POST",
    body: formData,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || "Failed to analyze document.");
  }

  return payload;
}
