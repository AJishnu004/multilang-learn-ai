'use client';

import { useState } from 'react';

export default function Home() {
  const [text, setText] = useState('');
  const [goal, setGoal] = useState('');
  const [language, setLanguage] = useState('hi');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, goal, language }),
      });

      if (!res.ok) {
        throw new Error('API error');
      }

      const data = await res.json();
      setResult(data.result);
    } catch (e) {
      setError('Something went wrong. Check console and API key.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-6">
      <div className="w-full max-w-3xl space-y-4">
        <h1 className="text-3xl font-bold">MultiLingua LearnAI</h1>
        <p className="text-sm text-slate-300">
          Paste your notes, set a goal, and get personalized gaps + lessons in Hindi/Telugu.
        </p>

       <textarea
  className="w-full p-3 rounded-md bg-slate-800 text-white placeholder:text-slate-400"
          rows={6}
          placeholder="Paste your notes or transcript here..."
          value={text}
          onChange={e => setText(e.target.value)}
        />

        <input
  className="w-full p-3 rounded-md bg-slate-800 text-white placeholder:text-slate-400"
          placeholder="Your goal (e.g., crack JEE math, improve algebra)…"
          value={goal}
          onChange={e => setGoal(e.target.value)}
        />

        <select
  className="w-full p-3 rounded-md bg-slate-800 text-white placeholder:text-slate-400"
          value={language}
          onChange={e => setLanguage(e.target.value)}
        >
          <option value="hi">Hindi</option>
          <option value="te">Sanskrit</option>
          <option value="en">English</option>
        </select>

        <button
          onClick={handleAnalyze} 
          disabled={loading}
          className="px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 font-semibold disabled:opacity-60"
        >
          {loading ? 'Analyzing…' : 'Analyze Gaps'}
        </button>

        {error && (
          <p className="text-slate-100">
            {error}
          </p>
        )}

        {result && (
          <pre className="mt-4 bg-slate-800 p-4 rounded-md text-sm overflow-x-auto">
            {result}
          </pre>
        )}
      </div>
    </main>
  );
}
