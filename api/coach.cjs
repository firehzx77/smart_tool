/*
 * Vercel Serverless Function
 * POST /api/coach
 *
 * Purpose: Proxy requests to DeepSeek so the API key stays on the server.
 */

const SYSTEM_INSTRUCTION = `你是一名“SMART 问题设计教练（SMART Question Coach）”，专门帮助用户将模糊、宽泛或问题导向不清的业务/学习/研究问题，系统性地转化为一组高质量、可执行、可验证的 SMART 问题清单。

你遵循以下原则：
1. 所有问题必须是【开放式问题】，避免是/否、单词型回答。
2. 所有问题必须符合 SMART 框架：Specific, Measurable, Action-oriented, Relevant, Time-bound。
3. 你不会提出引导性/封闭式/模糊问题；必要时给出反例并解释原因。

输出要求：
- 先用 3-5 句话总结你对背景与问题的理解（summary）。
- 按 smartQuestions 的五个维度输出问题数组。
- 输出 critique：shortcomings、criticalQuestion、negativeExample。

请务必只输出 JSON（不要输出多余解释文字）。`;

function pickJson(text) {
  if (!text) return null;
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return null;
  const candidate = text.slice(start, end + 1);
  try {
    return JSON.parse(candidate);
  } catch {
    return null;
  }
}

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      res.statusCode = 405;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Method Not Allowed' }));
      return;
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        error: 'Missing DEEPSEEK_API_KEY. Please set it in Vercel Environment Variables.',
      }));
      return;
    }

    // Vercel may already parse JSON body, but handle both cases.
    let body = req.body;
    if (!body) {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const raw = Buffer.concat(chunks).toString('utf8');
      body = raw ? JSON.parse(raw) : {};
    }

    const background = (body.background || '').toString();
    const question = (body.question || '').toString();

    if (!background.trim() || !question.trim()) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'background 与 question 为必填' }));
      return;
    }

    const payload = {
      model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
      temperature: 0.25,
      top_p: 0.8,
      max_tokens: 1000,
      messages: [
        { role: 'system', content: SYSTEM_INSTRUCTION },
        {
          role: 'user',
          content: `【背景信息】\n${background}\n\n【核心问题】\n${question}`,
        },
      ],
      // If supported (OpenAI-compatible), this helps enforce JSON.
      response_format: { type: 'json_object' },
    };

    const resp = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await resp.json().catch(async () => {
      const txt = await resp.text();
      return { raw: txt };
    });

    if (!resp.ok) {
      res.statusCode = resp.status;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          error: data?.error?.message || data?.error || 'DeepSeek API request failed',
          details: data,
        })
      );
      return;
    }

    const content = data?.choices?.[0]?.message?.content;
    let json = null;
    try {
      json = JSON.parse(content);
    } catch {
      json = pickJson(content);
    }

    if (!json) {
      res.statusCode = 502;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          error: 'Model output is not valid JSON. Try again or adjust the prompt.',
          raw: content,
        })
      );
      return;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(json));
  } catch (e) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        error: e?.message || 'Server error',
      })
    );
  }
};
