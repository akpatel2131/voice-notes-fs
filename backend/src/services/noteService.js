const Note = require('../models/Note');
const GeminiAIService = require('./aiService');
const fs = require('fs').promises;
const generateLocalSummary = require('../utils/summary');

const getAllNotes = async () => {
  return await Note.find().sort({ createdAt: -1 });
};


const createNote = async (title, duration, transcript = null) => {
  const note = await Note.create({
    title: title?.trim(),
    transcript: transcript,
    duration: Number(duration)
  });
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

module.exports = {
  getAllNotes,
  createNote,
  updateNote,
  generateSummary,
  deleteNote,
};
