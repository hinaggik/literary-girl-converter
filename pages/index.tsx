import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVertical, setIsVertical] = useState(false);

  // 文章変換API呼び出し
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    setLoading(true);
    setOutputText('');
    
    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });
      
      if (!response.ok) {
        throw new Error('API response was not ok');
      }
      
      const data = await response.json();
      setOutputText(data.output);
    } catch (error) {
      console.error('Error:', error);
      setOutputText('文学少女が言葉を見つけられませんでした...');
    } finally {
      setLoading(false);
    }
  };

  // 表示モード切り替え
  const setHorizontalMode = () => {
    console.log('Setting horizontal mode');
    setIsVertical(false);
  };

  const setVerticalMode = () => {
    console.log('Setting vertical mode');
    setIsVertical(true);
  };

  return (
    <>
      <Head>
        <title>Literary Girl Converter</title>
        <meta name="description" content="日常の言葉を文学少女風の詩的な文章に変換するツール" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main>
        <h1>Literary Girl Converter</h1>
        
        {/* 表示モード切替（常に表示） */}
        <div className="mode-toggle" style={{ marginBottom: '20px' }}>
          <button 
            onClick={setHorizontalMode}
            className={!isVertical ? 'active' : ''}
            type="button"
          >
            横書き
          </button>
          <button 
            onClick={setVerticalMode}
            className={isVertical ? 'active' : ''}
            type="button"
          >
            縦書き
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <textarea
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            rows={5}
            placeholder="今日は雨でもなんだか気分が沈んでた"
          />
          <div style={{ textAlign: 'center', marginTop: '12px' }}>
            <button type="submit" disabled={loading}>
              {loading ? '変換中...' : '文学少女に変換'}
            </button>
          </div>
        </form>

        {outputText && (
          <div style={{ marginTop: 24 }}>
            <h2>文学少女の返答：</h2>
            <div className={`poem-box ${isVertical ? 'poem-vertical' : 'poem-horizontal'}`}>
              {outputText}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
