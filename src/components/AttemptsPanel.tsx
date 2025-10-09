import { useEffect, useState } from 'react'
import { listAttempts } from '../api'

export default function AttemptsPanel() {
  const [data, setData] = useState<any[]>([])

  async function refresh() {
    const r = await listAttempts()
    setData(r.items || [])
  }

  useEffect(() => { refresh() }, [])

  return (
    <section className="card p-5 grid gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Attempts Dashboard</h2>
        <button className="btn btn-outline" onClick={refresh}>Refresh</button>
      </div>
      <div className="grid gap-3">
        {data.map((a, i) => (
          <div key={i} className="border border-neutral-800 rounded-xl p-4 bg-neutral-900/60">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">Score: {a.score} ({a.correct}/{a.total})</div>
              <div className="badge">Attempt: {a._id}</div>
            </div>
            <div className="text-xs text-neutral-400 mt-1">
              {new Date((a.createdAt || 0) * 1000).toLocaleString()}
            </div>
          </div>
        ))}
        {data.length === 0 && <div className="text-neutral-400">No attempts yet.</div>}
      </div>
    </section>
  )
}
