import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'No input text provided.' });
  }
  try {
    const completion = await openai.chat.completions.create({
  model: 'gpt-3.5-turbo',
  messages: [
    { role: 'system', content: 'あなたは静かな文学少女です。ユーザーが入力した言葉や感情を、放課後の文芸部で綴るような、静かで詩的な日記文に変換してください。文末の表現は、「。」、「……」、「――」など、詩的な雰囲気を大切にして、内容に合った適切な表現を選んでください。文章全体が基調的で物思いな雰囲気になるようにしてください。' },
    { role: 'user', content: text },
  ],
  max_tokens: 200,
  temperature: 0.8,
});
const output = completion.choices[0].message?.content || '';
    res.status(200).json({ output });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'OpenAI API error' });
  }
}
