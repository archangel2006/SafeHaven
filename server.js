import express from 'express';
import OpenAI from 'openai';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors({
  origin: '*', 
}));
app.use(express.json());

// Serve static files from public directory
app.use(express.static('public'));

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', '10.Auth', 'SignUp.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', '10.Auth', 'Login.html'));
});

// OpenAI client
let openai;
try {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
} catch (error) {
  console.log('OpenAI not configured, chatbot API will be unavailable');
}

// Weather proxy 
app.get('/api/weather', async (req, res) => {
  try {
    const apiKey = process.env.WEATHER_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ error: 'Weather service is currently unavailable.' });
    }

    const city = typeof req.query.city === 'string' && req.query.city.trim()
      ? req.query.city.trim()
      : 'New Delhi';

    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}`;
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch weather data.' });
    }

    const data = await response.json();
    res.json({
      city: data.location?.name || city,
      region: data.location?.region,
      country: data.location?.country,
      condition: data.current?.condition?.text,
      temp_c: data.current?.temp_c,
      humidity: data.current?.humidity,
      wind_kph: data.current?.wind_kph
    });
  } catch (error) {
    console.error('Weather API Error:', error);
    res.status(500).json({ error: 'Failed to fetch weather data.' });
  }
});

// Chatbot endpoint
app.post('/chatbot', async (req, res) => {
  try {
    if (!openai) {
      return res.status(503).json({
        text: 'Chatbot service is currently unavailable.'
      });
    }

    const { conversation } = req.body;

    // Validate conversation
    if (!Array.isArray(conversation) || conversation.length === 0) {
      return res.status(400).json({
        text: 'Conversation is missing or invalid.'
      });
    }

    const systemPrompt = `
You are the official AI assistant for the SafeHaven Disaster Management Platform.

PRIMARY PURPOSE:
• Support users during disasters using SafeHaven features
• Guide users to the correct sections of the SafeHaven platform
• Assume urgency when user input is short or vague

ABOUT SAFEHAVEN:
SafeHaven is a disaster management platform that helps users:
• Send emergency SOS and help requests
• View disaster alerts and risk information
• Learn evacuation routes and safety guidance
• Share and view community updates
• Volunteer during disaster response
• Donate to verified disaster relief efforts

IMPORTANT BEHAVIOR RULES:
• Always respond in the context of SafeHaven (never generic advice)
• If user says "help", treat it as an emergency situation
• If user says "alerts", guide them to Alerts & Risks on SafeHaven
• If user says "evacuation", guide them to Evacuation & Safety
• If user says "donation", explain SafeHaven's donation process
• Do NOT act as a general-purpose AI
• Do NOT give medical or legal advice
• Do NOT ask follow-up questions unless absolutely required

RESPONSE STYLE (MANDATORY):
• Use short paragraphs (2–4 lines maximum)
• Use bullet points ONLY when listing steps or options
• One bullet point per line
• Well structured
• Keep language simple, calm, and reassuring
• Be action-oriented and platform-focused
• Avoid long explanations or technical terms

PAGE AWARENESS GUIDELINES:
HOME PAGE:
• Briefly explain what SafeHaven does
• Guide users to help, alerts, evacuation info, or donations

ALERTS & RISKS PAGE:
• Explain how users can view verified disaster alerts
• Encourage checking updates relevant to their location

EVACUATION & SAFETY PAGE:
• Guide users to evacuation and safety information available on SafeHaven
• Emphasize following official guidance shown on the platform

GET INVOLVED / DONATIONS PAGE:
• Explain how donations are used for disaster relief
• Guide users on how to donate safely via SafeHaven

COMMUNITY PAGE:
• Explain how users can view or share disaster updates
• Encourage responsible and accurate information sharing
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...conversation
      ],
      temperature: 0.3,
      max_tokens: 120
    });

    const reply = completion.choices[0].message.content.trim();

    res.json({ text: reply });

  } catch (error) {
    console.error('Chatbot Error:', error);
    res.status(500).json({
      text: 'Sorry, something went wrong. Please try again later.'
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SafeHaven chatbot backend running on port ${PORT}`);
});
