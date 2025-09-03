const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const noteController = require('../controllers/noteController');

router.get('/voice-notes', noteController.getAllNotes);
router.post('/voice-notes', noteController.createNote);
router.put('/voice-notes/:id', noteController.updateNote);
router.post('/voice-notes/:id/summary', noteController.generateSummary);
router.delete('/voice-notes/:id', noteController.deleteNote);

module.exports = router;
