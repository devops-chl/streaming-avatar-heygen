// Proxies audio transcription to OpenAI so the API key stays on the server
module.exports = {
  async POST(request) {
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': request.headers.get('content-type'),
      },
      body: await request.arrayBuffer(),
    });

    // Log what was heard so it shows up in the Vercel project's Logs tab
    const body = await response.text();
    try {
      const data = JSON.parse(body);
      const segments = (data.segments || []).map(s => ({
        no_speech_prob: Number(s.no_speech_prob?.toFixed(2)),
        avg_logprob: Number(s.avg_logprob?.toFixed(2)),
      }));
      console.log('Transcription:', JSON.stringify(data.text), 'segments:', JSON.stringify(segments));
    } catch {
      console.log('Transcription failed:', response.status, body.slice(0, 200));
    }

    return new Response(body, {
      status: response.status,
      headers: { 'Content-Type': response.headers.get('content-type') || 'application/json' },
    });
  },
};
