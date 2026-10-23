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

    return new Response(response.body, {
      status: response.status,
      headers: { 'Content-Type': response.headers.get('content-type') || 'application/json' },
    });
  },
};
