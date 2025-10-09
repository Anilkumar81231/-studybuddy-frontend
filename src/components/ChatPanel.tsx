import { useState } from 'react'
import { chat } from '../api'

export default function ChatPanel({ pdfIds, disabled }: { pdfIds: string[], disabled?: boolean }) {
  const [q, setQ] = useState('Summarize the key ideas.')
  const [mode, setMode] = useState<'simple'|'agentic'>('agentic')
  const [answer, setAnswer] = useState<string>('')
  const [citations, setCitations] = useState<{page:number; quote:string}[]>([])
  const [busy, setBusy] = useState(false)

  async function ask() {
    if (!pdfIds.length) return
    setBusy(true)
    const r = await chat(pdfIds, q, mode)
    setAnswer(r.answer || '')
    setCitations(r.citations || [])
    setBusy(false)
  }

  return (
    <section className="card p-5 grid gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Chat with your PDFs</h2>
        <span className="badge">Step 2</span>
      </div>
      <div className="flex gap-2">
        <input className="input w-full" value={q} onChange={e => setQ(e.target.value)} placeholder="Ask anything about the selected PDFs..." />
        <select className="input" value={mode} onChange={e => setMode(e.target.value as any)}>
          <option value="simple">Simple</option>
          <option value="agentic">Agentic</option>
        </select>
        <button className="btn btn-primary" onClick={ask} disabled={disabled || busy}>{busy ? 'Thinking…' : 'Ask'}</button>
      </div>

      {answer && (
        <div className="grid gap-3">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 leading-relaxed whitespace-pre-wrap">
            {answer}
          </div>
          {citations?.length > 0 && (
            <div className="text-sm text-neutral-400 grid gap-2">
              <div className="font-medium text-neutral-300">Citations</div>
              {citations.map((c, i) => (
                <div key={i} className="border border-neutral-800 rounded-lg p-3 bg-neutral-900/60">
                  <span className="badge mr-2">p.{c.page}</span>
                  <span className="opacity-90">{c.quote}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
