const express = require('express');
const OpenAI = require('openai')
const path = require('path');
const app = express();
const axios = require('axios');
const fileUpload = require('express-fileupload');
const formData = require('form-data');
const fs = require('fs');
app.use(express.json());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, '.')));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemSetup = "You are an AI-assisted avatar of the living, real-life Chief Gary Batton."

app.post('/transcribe', async (req, res) => {
    if (!req.files || !req.files.audio) {
      return res.status(400).send('No audio file uploaded');
    }
  
    try {
      const audioFile = req.files.audio.data;
      const model = "whisper-1";
      const data = new formData();
      data.append("model", model);
      data.append("file", fs.createReadStream(audioFile.path));
  
      const response = await axios.post("https://api.openai.com/v1/audio/transcriptions", data, {
        headers: {
          Authorization: `Bearer ${openai.apiKey}`,
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        },
      });
  
      const transcription = response.data;
      res.json({ transcription });
    } catch (error) {
      console.error('Error transcribing audio:', error);
      res.status(500).send('Error transcribing audio');
    }
  });
  
  app.listen(3000, function () {
    console.log('App is listening on port 3000!');
  });
  
  module.exports = app;