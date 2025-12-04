const chrono = require('chrono-node');
const { Configuration, OpenAIApi } = require('openai');
const timezone = process.env.TZ || 'Asia/Kolkata';

function pickPriority(text) {
  const lower = text.toLowerCase();
  if (lower.includes('critical') || lower.includes('urgent') || lower.includes('high priority')) return 'critical';
  if (lower.includes('high')) return 'high';
  if (lower.includes('low')) return 'low';
  return 'medium';
}

function pickStatus(text) {
  const lower = text.toLowerCase();
  if (lower.includes('done') || lower.includes('completed')) return 'done';
  if (lower.includes('in progress') || lower.includes('working on')) return 'inprogress';
  return 'todo';
}

async function callOpenAI(transcript) {
  if (!process.env.OPENAI_API_KEY) return null;
  try {
    const cfg = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
    const client = new OpenAIApi(cfg);
    const prompt = `Extract a JSON object with keys: title, description, priority (low|medium|high|critical), status (todo|inprogress|done), dueDate (YYYY-MM-DD or empty) from the user transcript. Return only valid JSON.`;
    const response = await client.createChatCompletion({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that extracts structured tasks from short user transcripts.' },
        { role: 'user', content: `${prompt}\n\nTranscript: ${transcript}` }
      ],
      max_tokens: 400,
    });

    const text = response.data.choices?.[0]?.message?.content || '';
    // Try to parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  } catch (err) {
    console.warn('OpenAI parse failed', err?.message || err);
    return null;
  }
}

function toISODate(date) {
  if (!date) return '';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
  } catch (e) { return ''; }
}

async function parseTranscript(transcript) {
  const raw = transcript || '';
  // Attempt OpenAI if key provided
  const aiResult = await callOpenAI(raw);
  if (aiResult && typeof aiResult === 'object') {
    return {
      title: aiResult.title || raw.slice(0, 120),
      description: aiResult.description || raw,
      priority: aiResult.priority || pickPriority(raw),
      status: aiResult.status || pickStatus(raw),
      dueDate: aiResult.dueDate ? toISODate(aiResult.dueDate) : (toISODate(chrono.parseDate(raw)) || ''),
      raw: raw,
    };
  }

  // Heuristic fallback
  const parsedDates = chrono.parse(raw, new Date(), { timezone });
  const firstDate = parsedDates.length ? parsedDates[0].start.date() : null;

  const titleMatch = raw.match(/(?:create|add|new task|task to|please)\s+(.+?)(?:\s+by|\s+tomorrow|\s+today|$)/i);
  const title = titleMatch ? titleMatch[1] : raw.slice(0, 80);

  return {
    title: (title || raw).trim(),
    description: raw,
    priority: pickPriority(raw),
    status: pickStatus(raw),
    dueDate: firstDate ? toISODate(firstDate) : '',
    raw,
  };
}

module.exports = { parseTranscript };
