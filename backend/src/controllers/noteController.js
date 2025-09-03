const noteService = require('../services/noteService');

const getAllNotes = async (req, res) => {
  try {
    console.log("Fetching all notes");
    const notes = await noteService.getAllNotes();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createNote = async (req, res) => {
  try {
    console.log("Creating note", req.body);

    const { title, duration, transcript } = req.body;
    const note = await noteService.createNote(title, duration, transcript);

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateNote = async (req, res) => {
  try {
    const note = await noteService.updateNote(req.params.id, req.body);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const generateSummary = async (req, res) => {
  try {
    const summary = await noteService.generateSummary(req.params.id);
    if (!summary) return res.status(404).json({ error: 'Note not found' });
    res.json({ summary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteNote = async (req, res) => {
  try {
    const deleted = await noteService.deleteNote(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Note not found' });
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
    getAllNotes,
    createNote,
    updateNote,
    generateSummary,
    deleteNote,
};
