const Note = require("../models/Note");
const GeminiAIService = require("./aiService");
const fs = require("fs").promises;
const generateLocalSummary = require("../utils/summary");
const AppError = require("../utils/appError");

const getAllNotes = async () => {
  return await Note.find().sort({ createdAt: -1 });
};

const createNote = async (title, duration, transcript = null) => {
  try {
    const note = await Note.create({
      title: title?.trim(),
      transcript: transcript,
      duration: Number(duration),
    });
    return note;
  } catch (error) {
    throw AppError(error);
  }
};

const updateNote = async (id, { transcript, title }) => {
  try {
    const note = await Note.findById(id);
    if (!note) throw AppError("Note not found", 404);

    if (transcript) note.transcript = transcript;
    if (title) note.title = title;

    note.isEdited = true;
    note.summary = null;

    await note.save();
    return note;
  } catch (error) {
    throw AppError(error);
  }
};

const generateSummary = async (id) => {
  try {
    const note = await Note.findById(id);
    if (!note) throw AppError("Note not found", 404);

    if (note.summary && !note.isEdited) {
      return note.summary;
    }
    const summary = await GeminiAIService.generateSummary(note.transcript);

    note.summary = summary;
    note.isEdited = false;
    await note.save();

    return summary;
  } catch (error) {
    throw AppError(error);
  }
};

const deleteNote = async (id) => {
  try {
    const note = await Note.findById(id);
    if (!note) throw AppError("Note not found", 404);

    await Note.findByIdAndDelete(id);
    return true;
  } catch (error) {
    throw AppError(error);
  }
};

module.exports = {
  getAllNotes,
  createNote,
  updateNote,
  generateSummary,
  deleteNote,
};
