import express from 'express';
import OpenAI from 'openai';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, 'data');

function readData(filename) {
  const filePath = path.join(dataDir, filename);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function writeData(filename, data) {
  const filePath = path.join(dataDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

async function getEarthquakeData() {
  try {
    const response = await fetch('https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&limit=1');
    if (!response.ok) throw new Error(`USGS API error: ${response.status}`);
    const usgs = await response.json();
    if (usgs.features && usgs.features.length > 0) {
      const eq = usgs.features[0];
      const props = eq.properties;
      const coords = eq.geometry.coordinates;
      return {
        type: 'Earthquake - Magnitude ' + props.mag,
        severity: props.mag >= 6 ? 'critical' : props.mag >= 4 ? 'limited' : 'operational',
        location: coords[1].toFixed(4) + '° N, ' + coords[0].toFixed(4) + '° W — ' + (props.place || 'Unknown'),
        startTime: new Date(props.time).toISOString(),
        affectedZones: ['Zone A - Downtown', 'Zone B - Westside', 'Zone C - Harbor', 'Zone D - Valley'],
        affectedCount: props.felt || 0
      };
    }
    return readData('incident.json');
  } catch (err) {
    console.warn('Live fetch failed, falling back to local file:', err.message);
    return readData('incident.json');
  }
}

const app = express();

// Middleware
app.use(cors({
  origin: '*',
}));
app.use(express.json());

// Serve static files from public directory
app.use(express.static('public', {
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
    }
  }
}));

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

// Current incident summary
app.get('/api/incident', async (req, res) => {
  try {
    const data = await getEarthquakeData();
    if (!data) return res.status(404).json({ error: 'No active incident' });
    res.json(data);
  } catch (error) {
    console.error('Incident fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch incident data' });
  }
});

// Resource counts and statuses
app.get('/api/resources', (req, res) => {
  const data = readData('resources.json');
  if (!data) return res.status(404).json({ error: 'No resource data' });
  res.json(data);
});

// Overview statistics
app.get('/api/stats', (req, res) => {
  const data = readData('stats.json');
  if (!data) return res.status(404).json({ error: 'No stats data' });
  res.json(data);
});

// Command log - GET
app.get('/api/command-log', (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const offset = parseInt(req.query.offset) || 0;
  const log = readData('command-log.json') || [];
  res.json(log.slice(offset, offset + limit));
});

// Command log - POST
app.post('/api/command-log', (req, res) => {
  const { type, text, actor } = req.body;
  if (!type || !text) {
    return res.status(400).json({ error: 'type and text are required' });
  }
  const log = readData('command-log.json') || [];
  const entry = {
    id: Date.now(),
    type,
    text,
    actor: actor || 'System',
    timestamp: new Date().toISOString()
  };
  log.unshift(entry);
  writeData('command-log.json', log);
  broadcastSSE({ type: 'new_log', entry });
  res.json(entry);
});

// Command actions
app.post('/api/actions/:type', (req, res) => {
  const { type } = req.params;
  const validTypes = ['broadcast', 'reallocate', 'evacuate', 'report', 'partners'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ success: false, message: 'Invalid action type' });
  }
  const log = readData('command-log.json') || [];
  log.unshift({
    id: Date.now(),
    type: 'dispatch',
    text: `Action executed: ${type}${req.body.zones ? ' for zones ' + req.body.zones.join(', ') : ''}`,
    actor: 'Command Dashboard',
    timestamp: new Date().toISOString()
  });
  writeData('command-log.json', log);
  broadcastSSE({ type: 'resource_update', action: type });
  res.json({ success: true, message: type + ' action completed' });
});

// Server-Sent Events for real-time dashboard updates
const sseClients = [];

app.get('/api/events', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  res.write('data: {"type":"connected"}\n\n');

  sseClients.push(res);
  req.on('close', () => {
    const idx = sseClients.indexOf(res);
    if (idx !== -1) sseClients.splice(idx, 1);
  });
});

function broadcastSSE(data) {
  const msg = `data: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach(client => client.write(msg));
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SafeHaven chatbot backend running on port ${PORT}`);
});
