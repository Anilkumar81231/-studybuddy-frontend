import { useRef, useState } from 'react'
import { ingest, uploadPDF } from '../api'

export default function UploadCard({ onUploaded }: { onUploaded: () => void }) {
  const [busy, setBusy] = useState(false)
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  async function handleFile(f: File) {
    setBusy(true); setStatus('Uploading...')
    try {
      const up = await uploadPDF(f, title || f.name)
      setStatus('Ingesting...')
      await ingest(up.pdfId)
      setStatus('Done ✅')
      onUploaded()
      setTitle('')
      if (inputRef.current) inputRef.current.value = ''
    } catch (e:any) {
      setStatus(`Error: ${e.message || e}`)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="card p-5 grid gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Upload & Ingest PDF</h2>
        <span className="badge">Step 1</span>
      </div>
      <input
        className="input w-full"
        placeholder="Optional title (defaults to filename)"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <div className="flex items-center gap-3">
        <input ref={inputRef} type="file" accept="application/pdf" className="input w-full" onChange={(e) => {
          const f = e.target.files?.[0]; if (f) handleFile(f)
        }} />
        <button className="btn btn-outline" disabled>or Drag & Drop (soon)</button>
      </div>
      <div className="text-sm text-neutral-400 min-h-5">{busy ? status : status}</div>
    </section>
  )
}
