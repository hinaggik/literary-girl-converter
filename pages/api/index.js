import OpenAI from 'openai';

// APIキーの存在確認とデバッグ情報
const apiKey = process.env.OPENAI_API_KEY;
console.log('API Key exists:', !!apiKey);
if (!apiKey) {
  console.error('OPENAI_API_KEY is not set in environment variables!');
}

// OpenAI初期化
const openai = new OpenAI({
  apiKey: apiKey,
});

// ダミー応答用の詩的な文章配列
const poeticResponses = [
  '雨音の窓辺に何気なく花瓶を置いてみた。晴れの日とは違う光の濃彩が、部屋の雲を染めていく。',
  '柔らかな光が泉のように湧き出す頃、私はページのあいだに心を潜ませる。',
  '吊り橢の花が風に揺れるように、私の心もまたぼんやりと揺れ動く。',
  '鴬の羽のような雲が空を漂うとき、目を閉じて風の音を聞く。',
  '時計の音も聞こえない静かな部屋で、私は言葉の深海へと潜む。'
];

// ダミー応答生成
function generateDummyResponse() {
  return poeticResponses[Math.floor(Math.random() * poeticResponses.length)];
}

// APIハンドラー
export default async function handler(req, res) {
  // バックエンドデバッグ情報
  console.log('==== API REQUEST ====');
  console.log('Request method:', req.method);
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  console.log('====================');
  
  // CORS設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONSリクエスト処理
  if (req.method === 'OPTIONS') {
    console.log('OPTIONS request - responding with 200');
    return res.status(200).end();
  }

  // GETリクエストを許可（テスト用）
  if (req.method === 'GET') {
    console.log('GET request - responding with test message');
    return res.status(200).json({ message: 'API is working!' });
  }

  // POST以外のメソッドを拒否
  if (req.method !== 'POST') {
    console.log(`Invalid method ${req.method} - responding with 405`);
    res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
  
  // データバリデーション
  const { text } = req.body || {};
  if (!text) {
    console.log('No text provided - responding with 400');
    return res.status(400).json({ error: 'No input text provided.' });
  }
  
  try {
    // APIキーがない場合はダミーレスポンスを返す
    if (!apiKey) {
      console.log('No API key - returning dummy response');
      const dummyOutput = generateDummyResponse();
      return res.status(200).json({ output: dummyOutput });
    }
    
    console.log('Calling OpenAI API with text:', text);
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'あなたは静かな文学少女です。ユーザーが入力した言葉や感情を、放課後の文芸部で綴るような、静かで詩的な日記文に変換してください。' },
        { role: 'user', content: text },
      ],
      max_tokens: 200,
      temperature: 0.8,
    });
    
    // レスポンス確認
    console.log('OpenAI API Response:', completion);
    const output = completion.choices[0].message?.content || '';
    console.log('Extracted output:', output);
    
    // 最終レスポンス
    return res.status(200).json({ output });
  } catch (error) {
    console.error('API Error:', error);
    
    // エラー発生時はダミーレスポンスを返す
    const dummyOutput = generateDummyResponse();
    return res.status(200).json({ output: dummyOutput });
  }

}
