import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Script from 'next/script';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVertical, setIsVertical] = useState(false);
  const horizontalBtnRef = useRef<HTMLButtonElement>(null);
  const verticalBtnRef = useRef<HTMLButtonElement>(null);

  // ページ読み込み後に直接DOMイベントをアタッチ
  useEffect(() => {
    console.log('Component mounted');
    
    // ボタンに直接イベントリスナーを追加
    const horizontalBtn = horizontalBtnRef.current;
    const verticalBtn = verticalBtnRef.current;
    
    // Horizontal button handler
    const handleHorizontalClick = function() {
      console.log('Horizontal button clicked via native event');
      const indicator = document.getElementById('mode-indicator');
      if (indicator) {
        indicator.textContent = 'Horizontal mode activated';
      }
      setIsVertical(false);
    };
    
    // Vertical button handler
    const handleVerticalClick = function() {
      console.log('Vertical button clicked via native event');
      const indicator = document.getElementById('mode-indicator');
      if (indicator) {
        indicator.textContent = 'Vertical mode activated';
      }
      setIsVertical(true);
    };
    
    if (horizontalBtn) {
      console.log('Attaching event to horizontal button');
      horizontalBtn.addEventListener('click', handleHorizontalClick);
    }
    
    if (verticalBtn) {
      console.log('Attaching event to vertical button');
      verticalBtn.addEventListener('click', handleVerticalClick);
    }
    
    return () => {
      // クリーンアップ
      if (horizontalBtn) {
        horizontalBtn.removeEventListener('click', handleHorizontalClick);
      }
      if (verticalBtn) {
        verticalBtn.removeEventListener('click', handleVerticalClick);
      }
    };
  }, []);

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

  // モード切り替え用のシンプルな関数
  function handleModeChange(mode: 'horizontal' | 'vertical') {
    console.log(`Mode change requested: ${mode}`);
    if (mode === 'horizontal') {
      console.log('Setting to horizontal mode');
      setIsVertical(false);
    } else {
      console.log('Setting to vertical mode');
      setIsVertical(true);
    }
  }

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
          <div id="mode-indicator" style={{ fontSize: '12px', marginBottom: '5px', color: '#666' }}>
            {isVertical ? 'Vertical mode active' : 'Horizontal mode active'}
          </div>
          <button 
            ref={horizontalBtnRef}
            onClick={() => {
              console.log('Horizontal React onClick fired');
              setIsVertical(false);
            }}
            className={!isVertical ? 'active' : ''}
            type="button"
            id="horizontal-btn"
          >
            横書き
          </button>
          <button 
            ref={verticalBtnRef}
            onClick={() => {
              console.log('Vertical React onClick fired');
              setIsVertical(true);
            }}
            className={isVertical ? 'active' : ''}
            type="button"
            id="vertical-btn"
          >
            縦書き
          </button>
        </div>
        
        {/* 直接JavaScriptをページに埋め込む */}
        <Script id="direct-js" strategy="afterInteractive">
          {`
            console.log('Direct script loaded');
            document.addEventListener('DOMContentLoaded', function() {
              console.log('DOM fully loaded');
              // 別アプローチで直接イベントをアタッチ
              const hBtn = document.getElementById('horizontal-btn');
              const vBtn = document.getElementById('vertical-btn');
              
              if (hBtn) {
                hBtn.onclick = function() {
                  console.log('Horizontal clicked via direct DOM');
                  document.getElementById('mode-indicator').textContent = 'Horizontal mode activated via direct JS';
                };
              }
              
              if (vBtn) {
                vBtn.onclick = function() {
                  console.log('Vertical clicked via direct DOM');
                  document.getElementById('mode-indicator').textContent = 'Vertical mode activated via direct JS';
                };
              }
            });
          `}
        </Script>
        
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
