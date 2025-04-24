import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // CORS設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS リクエストの場合は早期リターン
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 通常のAPIリクエスト処理
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  
  console.log('API Request received:', req.body);
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'No input text provided.' });
  }
  
  try {
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
    const output = completion.choices[0].message?.content || '';
    console.log('OpenAI API Response:', output);
    res.status(200).json({ output });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message || 'OpenAI API error' });
  }
}
