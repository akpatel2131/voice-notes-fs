const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  transcript: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    default: null
  },
  audioPath: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 0
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

noteSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});


const Note = mongoose.model('Note', noteSchema);

module.exports = Note;