// Função do servidor (Vercel). As chaves ficam nas variáveis de ambiente, nunca no navegador.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST' });
  if (process.env.APP_SENHA && req.headers['x-senha'] !== process.env.APP_SENHA) {
    return res.status(401).json({ error: 'Senha incorreta' });
  }
  const { model, messages = [] } = req.body || {};
  try {
    let text = '';
    if (model === 'claude') {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
        body: JSON.stringify({ model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-5', max_tokens: 2048, messages })
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error?.message || 'Erro no Claude');
      text = j.content.map(c => c.text || '').join('');
    } else if (model === 'gpt') {
      const r = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'content-type': 'application/json' },
        body: JSON.stringify({ model: process.env.OPENAI_MODEL || 'gpt-4o-mini', messages })
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error?.message || 'Erro no ChatGPT');
      text = j.choices[0].message.content;
    } else if (model === 'gemini') {
      const m = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ contents: messages.map(x => ({ role: x.role === 'assistant' ? 'model' : 'user', parts: [{ text: x.content }] })) })
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error?.message || 'Erro no Gemini');
      text = j.candidates[0].content.parts.map(p => p.text || '').join('');
    } else {
      return res.status(400).json({ error: 'IA desconhecida' });
    }
    res.status(200).json({ text });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
