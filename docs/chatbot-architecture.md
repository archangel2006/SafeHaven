# Context-Aware Popup Chatbot – Architecture & Working

## Overview
The Safe Haven chatbot is a **context-aware popup chatbot** designed to assist users with
disaster-related information and platform navigation.  
It replaces multiple standalone chatbot pages with a **single floating widget** that is
accessible across all main pages of the platform.

The chatbot is **not a general-purpose AI** and operates strictly within the Safe Haven
disaster-management context.

---

## Objectives
- Improve accessibility by providing a popup chatbot on all pages
- Assist users with disaster-related queries and Safe Haven features
- Maintain a calm, reassuring, and easy-to-understand tone
- Ensure secure and backend-only interaction with LLM services

---

## High-Level Architecture

    +-------------------+
    |       User        |
    +-------------------+
            |
            v
    +-------------------+
    |  Chatbot UI (JS)  |
    | - Floating Popup  |
    | - Collects Input  |
    +-------------------+
            |
            v
    +-------------------+
    |   Backend API     |
    | - /api/chat       |
    | - Adds context    |
    | - Handles secrets |
    +-------------------+
            |
            v
    +-------------------+
    |       LLM         |
    | - OpenAI / Gemini |
    | - Generates reply |
    +-------------------+
            |
            v
    +-------------------+
    |    Chatbot UI     |
    | - Displays reply  |
    +-------------------+


---

## 4. Components Explanation

### 4.1 Frontend (`chatbot.js`)
- Provides the popup floating UI on all main pages.
- Collects user input and displays chatbot responses.
- Sends input to the backend API without exposing API keys.
- Updates theme (dark/light) dynamically.

### 4.2 Backend (`server.js`)
- Exposes a REST API endpoint `/api/chat`.
- Receives user messages from the frontend.
- Adds platform context and system prompt before forwarding messages to the LLM.
- Returns the chatbot’s response to the frontend.

### 4.3 Environment (`.env`)
- Stores API keys securely.
- Ensures keys are not exposed in frontend code.
- Example:
```env
OPENAI_API_KEY=your_openai_api_key_here


## 5. Chatbot Logic

1. User types a query in the chatbot popup.
2. Frontend sends the message to the backend API (`/api/chat`).
3. Backend appends a predefined system prompt describing the platform and context.
4. Backend forwards the combined context and user message to the LLM (OpenAI / Gemini).
5. LLM generates a response with concise, simple language in 2–4 lines.
6. Backend sends the response back to the frontend.
7. Frontend displays the response in the popup widget.

**Notes:**
- Responses avoid long paragraphs.
- Bullet points are used only for listing steps or options.
- Chatbot always assumes disaster-management context.

---

## 6. System Prompt & Context Handling

The system prompt ensures the chatbot:

- Always operates within disaster management context.
- Does not give medical or legal advice.
- Provides simple, user-friendly guidance.
- Maintains a calm and reassuring tone.




---

## 7. Security Considerations

- API keys are **never exposed** in frontend code.
- All LLM interactions happen via backend APIs.
- Environment variables (`.env`) are used for sensitive secrets.
- Backend validates requests before sending them to LLM.

---

## 8. LLM Choice and Fallback

- **Currently:** OpenAI API is used.
- **Future-proof:** Architecture supports switching  other LLMs if needed.
- Only backend logic needs to be updated to point to a different LLM endpoint.
