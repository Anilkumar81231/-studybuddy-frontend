import { useMemo, useState } from 'react'
import { generateQuiz, submitAttempt } from '../api'

type Item = { prompt: string; options: string[]; answerKey?: string; explanation?: string; page?: number }

export default function QuizPanel({ pdfIds, disabled }: { pdfIds: string[], disabled?: boolean }) {
  const [items, setItems] = useState<Item[]>([])
  const [quizId, setQuizId] = useState<string>('')
  const [answers, setAnswers] = useState<string[]>([])
  const [result, setResult] = useState<any>(null)
  const [busy, setBusy] = useState(false)

  async function gen() {
    if (!pdfIds.length) return
    setBusy(true)
    const r = await generateQuiz(pdfIds, 8)
    setItems(r.items || [])
    setQuizId(r.quizId)
    setAnswers(new Array(r.items?.length || 0).fill(''))
    setResult(null)
    setBusy(false)
  }

  async function submit() {
    setBusy(true)
  }
  return (
    <section className="card p-5 grid gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Generate & Take Quiz</h2>
        <span className="badge">Step 3</span>
      </div>

      <div className="flex items-center gap-2">
        <button className="btn btn-primary" onClick={gen} disabled={disabled || busy}>{busy ? 'Generating…' : 'Generate Quiz'}</button>
        {quizId && <span className="badge">Quiz ID: {quizId}</span>}
      </div>

      {items.length > 0 && (
        <div className="grid gap-4">
          {items.map((it, idx) => (
            <div className="border border-neutral-800 rounded-xl p-4 bg-neutral-900/60" key={idx}>
              <div className="font-medium mb-2">Q{idx+1}. {it.prompt}</div>
              <div className="grid gap-2">
                {it.options?.map((opt, j) => (
                  <label key={j} className="flex items-center gap-2">
                    <input type="radio" name={`q${idx}`} checked={answers[idx] === opt} onChange={() => {
                      setAnswers(a => { const c = [...a]; c[idx] = opt; return c })
                    }} />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
              {result && result.items?.[idx] && (
                <div className="mt-3 text-sm">
                  {result.items[idx].correct ? (
                    <span className="text-emerald-400">✅ Correct</span>
                  ) : (
                    <span className="text-rose-400">❌ Incorrect — Correct: {result.items[idx].correctAnswer}</span>
                  )}
                  {it.explanation && <div className="text-neutral-400 mt-1">Explanation: {it.explanation}</div>}
                </div>
              )}
            </div>
          ))}

          {!result ? (
            <button className="btn btn-primary w-fit" onClick={async () => {
              setBusy(true)
              const r = await submitAttempt(quizId, answers)
              setResult(r)
              setBusy(false)
            }} disabled={busy || !quizId}>Submit Answers</button>
          ) : (
            <div className="p-4 border border-neutral-800 rounded-xl bg-neutral-900/60">
              <div className="text-lg font-semibold">Score: {result.score} ({result.correct}/{result.total})</div>
              <div className="text-neutral-400 text-sm">Your attempt ID: {result.attemptId}</div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
