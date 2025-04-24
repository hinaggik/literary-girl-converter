import { useState } from 'react';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setOutputText('');
    const response = await fetch('/api/convert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: inputText }),
    });
    const data = await response.json();
    setOutputText(data.output);
    setLoading(false);
  };
  return (
    <main style={{ maxWidth: 600, margin: '40px auto', padding: 24 }}>
      <h1>Literary Girl Converter</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          rows={5}
          style={{ width: '100%', marginBottom: 12 }}
          placeholder="あなたの言葉や感情を入力してください"
        />
        <button type="submit" disabled={loading} style={{ padding: '8px 24px' }}>
          {loading ? '変換中...' : '文学少女に変換'}
        </button>
      </form>
      <div style={{ marginTop: 24, minHeight: 60 }}>
        <h2>文学少女の返答：</h2>
        <div style={{ whiteSpace: 'pre-wrap', background: '#f7f7f7', padding: 16, borderRadius: 8 }}>
          {outputText}
        </div>
      </div>
    </main>
  );
}
