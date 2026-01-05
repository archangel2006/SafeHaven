// server.js
import express from 'express';
import OpenAI from 'openai';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: '*', // restrict in production
}));
app.use(express.json());

// OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Chatbot endpoint
app.post('/chatbot', async (req, res) => {
  try {
    const { message } = req.body;

    // Validate user input
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({
        text: 'Please enter a valid message.'
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
• If user says "donation", explain SafeHaven’s donation process
• Do NOT act as a general-purpose AI
• Do NOT give medical or legal advice
• Do NOT ask follow-up questions unless absolutely required

RESPONSE STYLE (MANDATORY):
• Use short paragraphs (2–4 lines maximum)
• Use bullet points ONLY when listing steps or options
• only one point in one line with bullet other in next line 
• well structure

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


    // OpenAI API call
    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.3,   // focused replies
      max_tokens: 120     // prevents long text
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
  console.log(`✅ SafeHaven chatbot backend running on port ${PORT}`);
});
