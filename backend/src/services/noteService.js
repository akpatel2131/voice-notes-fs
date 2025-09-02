// services/notesService.js - Modified for Gemini AI
const Note = require('../models/Note');
const GeminiAIService = require('./aiService');
const fs = require('fs').promises;
const path = require('path');

const createUploadsDir = async () => {
  const uploadDir = path.join(__dirname, '../uploads/audio');
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }
};
createUploadsDir();

const getAllNotes = async () => {
  return await Note.find().sort({ createdAt: -1 });
};


const createNote = async (audioPath, title, duration, transcript = null) => {
  let finalTranscript;

  if (transcript && transcript.trim().length > 0) {
    finalTranscript = transcript;
  } else {
    try {
      finalTranscript = await GeminiAIService.transcribeAudio(audioPath);
    } catch (error) {
      console.error('Transcription failed:', error.message || error);
      throw new Error(
        'Could not transcribe audio. Please provide transcript manually or use browser speech recognition.'
      );
    }
  }

  const note = new Note({
    title: title?.trim() || `Voice Note ${Date.now()}`,
    transcript: finalTranscript,
    audioPath: audioPath || 'browser-speech',
    duration: Number(duration) || 0,
  });

  await note.save();
  return note;
};

const createNoteFromTranscript = async (title, transcript, duration) => {
  if (!transcript || transcript.trim().length === 0) {
    throw new Error('Transcript is required to create a note');
  }

  const note = new Note({
    title: title?.trim() || `Voice Note ${Date.now()}`,
    transcript,
    audioPath: 'browser-speech',
    duration: Number(duration) || 0,
    source: 'browser-speech',
  });

  await note.save();
  return note;
};

const updateNote = async (id, { transcript, title }) => {
  const note = await Note.findById(id);
  if (!note) return null;

  if (transcript) note.transcript = transcript;
  if (title) note.title = title;

  note.isEdited = true;
  note.summary = null;

  await note.save();
  return note;
};

const generateSummary = async (id) => {
  const note = await Note.findById(id);
  if (!note) return null;

  if (note.summary && !note.isEdited) {
    return note.summary;
  }

  try {
    const summary = await GeminiAIService.generateSummary(note.transcript);

    note.summary = summary;
    note.isEdited = false;
    await note.save();

    return summary;
  } catch (error) {
    console.error('Summary generation failed, using fallback:', error.message || error);

    const fallbackSummary = generateLocalSummary(note.transcript);

    note.summary = fallbackSummary;
    note.isEdited = false;
    await note.save();

    return fallbackSummary;
  }
};

const generateLocalSummary = (transcript) => {
  if (!transcript) return '';
  if (transcript.length < 100) return transcript;

  const sentences = transcript
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 10);

  if (sentences.length <= 2) {
    return transcript;
  }

  // Word frequency map
  const words = transcript.toLowerCase().split(/\s+/);
  const wordFreq = {};
  for (const word of words) {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  }

  // Score sentences
  const scoredSentences = sentences.map((sentence, index) => {
    const sentenceWords = sentence.toLowerCase().split(/\s+/);
    let score = 0;
    for (const word of sentenceWords) {
      score += wordFreq[word] || 0;
    }
    // Boost early sentences
    if (index < 2) score *= 1.5;

    return { sentence, score: score / sentenceWords.length };
  });

  // Pick top 3
  const topSentences = scoredSentences
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.min(3, sentences.length))
    .map(item => item.sentence);

  return topSentences.join('. ') + '.';
};

const deleteNote = async (id) => {
  const note = await Note.findById(id);
  if (!note) return null;

  if (note.audioPath && note.audioPath !== 'browser-speech') {
    try {
      await fs.unlink(note.audioPath);
    } catch (fileError) {
      console.error('Error deleting audio file:', fileError.message || fileError);
    }
  }

  await Note.findByIdAndDelete(id);
  return true;
};

const getNotesStats = async () => {
  const totalNotes = await Note.countDocuments();
  const notesWithSummaries = await Note.countDocuments({ summary: { $ne: null } });
  const browserNotes = await Note.countDocuments({ audioPath: 'browser-speech' });

  return {
    total: totalNotes,
    withSummaries: notesWithSummaries,
    browserBased: browserNotes,
    fileBased: totalNotes - browserNotes,
  };
};

module.exports = {
  getAllNotes,
  createNote,
  createNoteFromTranscript,
  updateNote,
  generateSummary,
  deleteNote,
  getNotesStats,
};
