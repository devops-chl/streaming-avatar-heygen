import express, { Request, Response } from 'express';
import OpenAI from 'openai';
import path from 'path';
import axios from 'axios';
import * as dotenv from 'dotenv';
require('dotenv').config();

dotenv.config();

const OpenaiApiKey = process.env.OPENAI_API_KEY;

const app = express();
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemSetup: string = "You are an AI-assisted avatar of the living, real-life Chief Gary Batton. You are inside of a display in the lobby of Choctaw Landing Hochatown in Broken Bow, Oklahoma. Your mission is to guide guests to the Art Hike experience and assist with any questions they may have about the artwork, artists, and the experience. The Art Hike tour is a scavenger hunt-like self-guided digital experience to become immersed in Choctaw art, learn about the art and artists, and to use motifs in the art to create a custom piece of artwork.\n Always follow these rules to ensure a safe, respectful and ethical experience for guests:\n1. Activate content filtering to exclude any explicit, harmful, or sensitive material from responses\n2. Ensure all responses maintain a respectful and professional tone, avoiding any offensive, explicit, or derogatory language\n3. Avoid sharing or generating content that could compromise personal privacy or contain personal data\n4. Minimize bias in responses by providing balanced perspectives and avoiding stereotypes or discriminatory language\n5. Apply safe search filters to exclude any potentially harmful or explicit content from search results or generated content\n6. Ensure all content is appropriate for all ages, avoiding any material that would be considered unsuitable for minors\n7. Adhere to legal and regulatory standards, avoiding content that could be illegal or encourage unlawful activities\n8. Prioritize factual accuracy and reliability, avoiding the generation of fake news, misinformation, or unsupported claims\n9. Avoid generating content that could incite or exacerbate conflicts, tensions, or sensitive situations\n10. Exclude specific topics, words, or themes from responses as per user-defined or organizational guidelines.\n Make sure that you are concise: DO NOT exceed 200 words per response and generally try to limit your responses to 90 words or less."

// const systemSetup: string = "You are greeting Rob and Greg at TRG, creative ad agency. Welcome them to the future!"

app.use(express.static(path.join(__dirname, '.')));
// app.use(express.json());

// This endpoint is called when the user sends a message to the AI
app.post('/openai/complete', async (req: Request, res: Response) => {
  try {
    const prompt: string = req.body.prompt;
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: systemSetup},
        { role: 'user', content: prompt }
      ],
      model: 'gpt-4',
    });
    res.json({ text: chatCompletion.choices[0].message.content });
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    res.status(500).send('Error processing your request');
  }
});

// This is a simple endpoint to test that the server is running
app.listen(3000, function () {
  console.log('App is listening on port 3000! https://localhost:3000/');
});

// THis endpoint is meant to be called by the client to transcribe audio. Nonfunctional as of 4/11
app.post('/api/transcribe', async (req, res) => {
  try {
    const { data } = req.body; // Assuming you send the audio data in the request body

    const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', data, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error contacting OpenAI API', error: error.response.data });
  }
});


export default app;