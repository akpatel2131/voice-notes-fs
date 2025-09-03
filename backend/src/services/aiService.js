// services/geminiAIService.js - Gemini AI Integration
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

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
              { text: "Summarize the following transcript in under 100 words. Focus on key points only." },
              { text: transcript },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 150,
          temperature: 0.3,
        },
      },
      { headers: { "Content-Type": "application/json" }, timeout: 30000 }
    );

    return (
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "No summary generated."
    );
  } catch (error) {
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

module.exports = {
  generateSummary,
};
