// services/geminiAIService.js - Gemini AI Integration
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

// Generate summary using Gemini Pro
async function generateSummary(transcript) {
  if (!API_KEY) {
    throw AppError("Gemini API key not configured", 400);
  }

  if (!transcript || transcript.trim().length === 0) {
    throw AppError("No transcript provided for summarization", 400);
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
      throw AppError("Rate limit exceeded. Please try again later.", error.response?.status);
    } else if (error.response?.status === 403) {
      throw AppError("API key invalid or quota exceeded.", error.response?.status);
    } else if (error.code === "ECONNABORTED") {
      throw AppError("Request timeout. Please try again.", error.response?.status);
    } else {
      throw AppError(`Failed to generate summary: ${error.message}`, error.response?.status);
    }
  }
}

module.exports = {
  generateSummary,
};
