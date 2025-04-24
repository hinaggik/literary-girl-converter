import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Script from 'next/script';

// ランダムな例文の配列
export const sampleTexts = [
  '今日は雨でもなんだか気分が沈んでた',
  '天気がいいと心も晴れやかになるような気がする',
  '夜の虹の上を歩くような気もちになるときがある',
  '水たまりに映る空が綺麗だった',
  '君と歩いた広場は今も変わらない',
];

// ランダムな例文を取得する関数
function getRandomSampleText() {
  return sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
}

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [placeholder, setPlaceholder] = useState(getRandomSampleText());
  // DOM参照
  const poemBoxRef = useRef<HTMLDivElement>(null);
  const horizontalBtnRef = useRef<HTMLButtonElement>(null);
  const verticalBtnRef = useRef<HTMLButtonElement>(null);
  const modeIndicatorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 直接DOMを操作する関数
  function setHorizontalMode() {
    console.log('Setting horizontal mode via direct DOM');
    if (poemBoxRef.current) {
      poemBoxRef.current.classList.remove('poem-vertical');
      poemBoxRef.current.classList.add('poem-horizontal');
    }
    if (horizontalBtnRef.current && verticalBtnRef.current) {
      horizontalBtnRef.current.classList.add('active');
      verticalBtnRef.current.classList.remove('active');
    }
    if (modeIndicatorRef.current) {
      modeIndicatorRef.current.textContent = 'Horizontal mode active';
    }
  }

  function setVerticalMode() {
    console.log('Setting vertical mode via direct DOM');
    if (poemBoxRef.current) {
      poemBoxRef.current.classList.remove('poem-horizontal');
      poemBoxRef.current.classList.add('poem-vertical');
    }
    if (horizontalBtnRef.current && verticalBtnRef.current) {
      horizontalBtnRef.current.classList.remove('active');
      verticalBtnRef.current.classList.add('active');
    }
    if (modeIndicatorRef.current) {
      modeIndicatorRef.current.textContent = 'Vertical mode active';
    }
  }

  // 新しいプレースホルダーをセットする関数
  const refreshPlaceholder = () => {
    setPlaceholder(getRandomSampleText());
  };

  // 初期化時にプレースホルダーをセット
  useEffect(() => {
    refreshPlaceholder();
  }, []);

  // 文章変換API呼び出し
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit button clicked!', inputText);
    
    // 入力のバリデーション
    if (!inputText.trim()) {
      console.log('Empty input, not sending request');
      setErrorMessage('あなたの言葉を教えてください……');
      return;
    }
    
    // エラーメッセージをクリア
    setErrorMessage('');
    
    setLoading(true);
    setOutputText('');
    
    try {
      console.log('Sending request to API...');
      // 絶対URLを使用してAPIを呼び出す
      const url = window.location.origin + '/api';
      console.log('API URL:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
        cache: 'no-cache', // キャッシュを使用しない
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`API response error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API response data:', data);
      
      if (data && data.output) {
        setOutputText(data.output);
      } else {
        throw new Error('API returned empty response');
      }
    } catch (error) {
      console.error('Error in API call:', error);
      setOutputText('文学少女が言葉を見つけられませんでした...');
      setErrorMessage('エラーが発生しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  // 初期化
  useEffect(() => {
    console.log('Initializing mode buttons');
    // 初期表示モードを横書きに設定
    setHorizontalMode();
  }, []);

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
          <div ref={modeIndicatorRef} style={{ fontSize: '12px', marginBottom: '5px', color: '#666' }}>
            Horizontal mode active
          </div>
          <button 
            ref={horizontalBtnRef}
            onClick={setHorizontalMode}
            className="active"
            type="button"
            id="horizontal-btn"
          >
            横書き
          </button>
          <button 
            ref={verticalBtnRef}
            onClick={setVerticalMode}
            className=""
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
          {/* エラーメッセージ表示エリア */}
          {errorMessage && (
            <div style={{ color: '#d9534f', marginBottom: '10px', fontSize: '0.9rem', textAlign: 'center' }}>
              {errorMessage}
            </div>
          )}
          
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            rows={5}
            placeholder={placeholder}
            style={{ fontSize: '1rem' }}
          />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', gap: '10px' }}>
            <button 
              type="button"
              style={{ 
                backgroundColor: '#e9e6f3', 
                color: '#6d5c7c',
                flex: '0 0 auto',
                padding: '8px 12px',
                fontSize: '0.85rem'
              }}
              onClick={() => {
                if (textareaRef.current) {
                  setInputText(placeholder);
                  textareaRef.current.focus();
                }
                refreshPlaceholder();
              }}
            >
              例文を使う
            </button>
            
            <button 
              type="button" 
              disabled={loading}
              style={{ flex: '1 1 auto' }}
              onClick={(e) => {
                console.log('Convert button clicked directly');
                handleSubmit(e as unknown as React.FormEvent);
              }}
            >
              {loading ? '変換中...' : '文学少女に変換'}
            </button>
          </div>
        </form>

        {outputText && (
          <div style={{ marginTop: 24 }}>
            <h2>文学少女の返答：</h2>
            <div ref={poemBoxRef} className="poem-box poem-horizontal">
              {outputText}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
