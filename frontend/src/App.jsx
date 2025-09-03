import React, { useState, useEffect } from 'react';
import VoiceRecorder from './components/VoiceRecorder';
import NoteCard from './components/NoteCard';
import EditModal from './components/EditModal';
import { notesAPI } from './services/api';
import styles from './app.module.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const fetchedNotes = await notesAPI.getAllNotes();
      setNotes(fetchedNotes);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNoteCreated = (newNote) => {
    setNotes(prev => [newNote, ...prev]);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (noteId, updatedData) => {
    try {
      const updatedNote = await notesAPI.updateNote(noteId, updatedData);
      setNotes(prev => prev.map(note => 
        note._id === noteId ? updatedNote : note
      ));
    } catch (error) {
      console.error('Error updating note:', error);
      alert('Failed to update note. Please try again.');
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await notesAPI.deleteNote(noteId);
        setNotes(prev => prev.filter(note => note._id !== noteId));
      } catch (error) {
        console.error('Error deleting note:', error);
        alert('Failed to delete note. Please try again.');
      }
    }
  };

  const handleUpdateNote = (noteId, updatedNote) => {
    setNotes(prev => prev.map(note => 
      note._id === noteId ? updatedNote : note
    ));
  };

  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <VoiceRecorder onNoteCreated={handleNoteCreated} />
        
        <div className={styles.notesSection}>
          {loading ? (
            <div className={styles.loading}>Loading notes...</div>
          ) : notes.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No voice notes yet. Record your first note above!</p>
            </div>
          ) : (
            <div className={styles.notesGrid}>
              {notes.map(note => (
                <NoteCard
                  key={note._id}
                  note={note}
                  onEdit={handleEditNote}
                  onDelete={handleDeleteNote}
                  onUpdate={handleUpdateNote}
                />
              ))}
            </div>
          )}
        </div>

        <EditModal
          note={editingNote}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveEdit}
        />
      </div>
    </div>
  );
}

export default App;