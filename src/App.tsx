import { useEffect, useMemo, useState } from 'react'

import { listPDFs, deletePDF } from './api'

import UploadCard from './components/UploadCard'
import ChatPanel from './components/ChatPanel'
import QuizPanel from './components/QuizPanel'
import AttemptsPanel from './components/AttemptsPanel'

type Tab = 'upload' | 'chat' | 'quiz' | 'attempts'

export default function App() {
  const [tab, setTab] = useState<Tab>('upload')
  const [pdfs, setPdfs] = useState<any[]>([])
  const [selected, setSelected] = useState<string[]>([])

  async function refresh() {
    const items = await listPDFs()
    setPdfs(items)
  }

  useEffect(() => { refresh() }, [])

  const canProceed = useMemo(() => selected.length > 0, [selected])

  return (
    <div className="min-h-screen">
      <header className="border-b border-neutral-800 bg-neutral-950/60 sticky top-0 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-2xl">📚</div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">StudyBuddy</h1>
              <p className="text-xs text-neutral-400">Upload • Chat • Quiz • Review</p>
            </div>
          </div>
          <div className="flex gap-2">
            <a className="badge" href={import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'} target="_blank">S</a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 grid gap-6">
        {/* Tabs */}
        <div className="card p-2 flex items-center gap-2">
          <button onClick={() => setTab('upload')} className={`tab ${tab==='upload' ? 'tab-active' : ''}`}>Upload</button>
          <button onClick={() => setTab('chat')} className={`tab ${tab==='chat' ? 'tab-active' : ''}`}>Chat</button>
          <button onClick={() => setTab('quiz')} className={`tab ${tab==='quiz' ? 'tab-active' : ''}`}>Quiz</button>
          <button onClick={() => setTab('attempts')} className={`tab ${tab==='attempts' ? 'tab-active' : ''}`}>Attempts</button>
          <div className="ml-auto text-sm text-neutral-400">Selected: {selected.length}</div>
        </div>

        {/* PDF selector */}
        <div className="card p-4">
          <div className="flex flex-wrap gap-2">
            {pdfs.map(p => (
              <label
                key={p._id}
                className={`px-3 py-2 rounded-xl border text-sm cursor-pointer select-none ${selected.includes(p._id) ? 'bg-brand-600/20 border-brand-700' : 'bg-neutral-900 border-neutral-800'}`}
              >
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={selected.includes(p._id)}
                  onChange={e => {
                    setSelected(s => e.target.checked ? [...new Set([...s, p._id])] : s.filter(x => x !== p._id))
                  }}
                />
                <span className="font-medium">{p.title}</span>
                <span className="ml-2 text-neutral-400">{p.pages || 0}p</span>
                <span className="ml-2 badge">{p.status}</span>

                {/* DELETE button (added) */}
                <button
                  type="button"
                  className="ml-2 text-red-400 hover:text-red-600"
                  title="Delete this PDF"
                  aria-label="Delete this PDF"
                  onClick={async (e) => {
                    e.preventDefault(); // don't toggle the checkbox
                    e.stopPropagation(); // don't trigger label click
                    if (confirm('Delete this PDF?')) {
                      await deletePDF(p._id || p.id);
                      setSelected(s => s.filter(x => x !== (p._id || p.id)));
                      await refresh();
                    }
                  }}
                >
                  ✕
                </button>
              </label>
            ))}
            {pdfs.length === 0 && <div className="text-neutral-400">No PDFs yet. Upload one below.</div>}
          </div>
        </div>

        {/* Panels */}
        {tab === 'upload' && <UploadCard onUploaded={refresh} />}
        {tab === 'chat' && <ChatPanel pdfIds={selected} disabled={!canProceed} />}
        {tab === 'quiz' && <QuizPanel pdfIds={selected} disabled={!canProceed} />}
        {tab === 'attempts' && <AttemptsPanel />}
      </main>

      <footer className="py-8 text-center text-sm text-neutral-500">
        Built for your StudyBuddy workflow — modern, fast, and friendly.
      </footer>
    </div>
  )
}
