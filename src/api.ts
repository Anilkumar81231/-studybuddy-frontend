const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export type PdfItem = { _id: string; title: string; filename: string; pages: number; status: string };
export type Citation = { pdfId: string; page: number; quote: string };

export async function listPDFs() {
  const r = await fetch(`${API}/pdfs`);
  return (await r.json()).items as any[];
}

export async function uploadPDF(file: File, title: string) {
  const form = new FormData();
  form.append('file', file);
  form.append('title', title || file.name);
  const r = await fetch(`${API}/pdfs/upload`, { method: 'POST', body: form });
  return await r.json();
}

export async function ingest(pdfId: string) {
  const r = await fetch(`${API}/ingest/${pdfId}`, { method: 'POST' });
  return await r.json();
}

export async function chat(pdfIds: string[], question: string, mode: 'simple' | 'agentic' = 'simple') {
  const r = await fetch(`${API}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pdfIds, question, mode })
  });
  return await r.json() as { answer: string; citations: Citation[]; mode: string };
}

export async function generateQuiz(pdfIds: string[], count = 8) {
  const r = await fetch(`${API}/quiz/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pdfIds, count })
  });
  return await r.json() as { quizId: string; items: any[] };
}

export async function submitAttempt(quizId: string, answers: string[]) {
  const r = await fetch(`${API}/quiz/attempt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quizId, answers })
  });
  return await r.json();
}

export async function listAttempts() {
  const r = await fetch(`${API}/attempts`);
  return await r.json();
}


export async function deletePDF(id: string) {
  const r = await fetch(`${API}/pdfs/${id}`, { method: 'DELETE' });
  return await r.json();
}

                