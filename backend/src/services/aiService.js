// services/geminiAIService.js - Gemini AI Integration
const axios = require("axios");

const API_KEY = process.env.GEMINI_API_KEY;
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

if (!API_KEY) {
  console.warn("GEMINI_API_KEY not found in environment variables");
}

// Generate summary using Gemini Pro
async function generateSummary(transcript) {
  if (!API_KEY) {
    throw new Error("Gemini API key not configured");
  }

  if (!transcript || transcript.trim().length === 0) {
    throw new Error("No transcript provided for summarization");
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Please create a concise and informative summary of the following voice note transcript. Keep it under 100 words and focus on the key points and main ideas:

Transcript: "${transcript}"`,
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 150,
          temperature: 0.3,
          topP: 0.8,
          topK: 40,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
        ],
      },
      { headers: { "Content-Type": "application/json" }, timeout: 30000 }
    );

    return (
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "No summary generated."
    );
  } catch (error) {
    console.error("Gemini API Error:", error.response?.data || error.message);

    if (error.response?.status === 429) {
      throw new Error("Rate limit exceeded. Please try again later.");
    } else if (error.response?.status === 403) {
      throw new Error("API key invalid or quota exceeded.");
    } else if (error.code === "ECONNABORTED") {
      throw new Error("Request timeout. Please try again.");
    } else {
      throw new Error(`Failed to generate summary: ${error.message}`);
    }
  }
}

// Transcribe audio - not supported
async function transcribeAudio() {
  throw new Error(
    "Audio transcription not supported by Gemini. Please use browser speech recognition or provide transcript manually."
  );
}

// Enhance transcript
async function enhanceTranscript(rawTranscript) {
  if (!API_KEY) {
    throw new Error("Gemini API key not configured");
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Please clean up and improve the following voice transcript by:
1. Correcting obvious speech-to-text errors
2. Adding proper punctuation
3. Organizing into clear sentences
4. Maintaining the original meaning and tone

Raw transcript: "${rawTranscript}"`,
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 2000,
          temperature: 0.2,
          topP: 0.8,
        },
      }
    );

    return (
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      rawTranscript
    );
  } catch (error) {
    console.error("Transcript enhancement failed:", error);
    return rawTranscript;
  }
}

// Generate title suggestions
async function generateTitle(transcript) {
  if (!API_KEY) {
    throw new Error("Gemini API key not configured");
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Based on the following voice note transcript, suggest a short, descriptive title (max 6 words):

Transcript: "${transcript}"`,
              },
            ],
          },
        ],
        generationConfig: { maxOutputTokens: 50, temperature: 0.4 },
      }
    );

    return (
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      `Voice Note ${Date.now()}`
    );
  } catch (error) {
    console.error("Title generation failed:", error);
    return `Voice Note ${Date.now()}`;
  }
}

// Check API status
async function checkAPIStatus() {
  if (!API_KEY) {
    return { status: "error", message: "API key not configured" };
  }

  try {
    await axios.post(
      `${BASE_URL}/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        contents: [{ parts: [{ text: "Hello, this is a test." }] }],
        generationConfig: { maxOutputTokens: 10 },
      }
    );

    return {
      status: "active",
      message: "Gemini API is working properly",
      model: "gemini-1.5-flash",
    };
  } catch (error) {
    return {
      status: "error",
      message: error.response?.data?.error?.message || error.message,
    };
  }
}

module.exports = {
  generateSummary,
  transcribeAudio,
  enhanceTranscript,
  generateTitle,
  checkAPIStatus,
};
