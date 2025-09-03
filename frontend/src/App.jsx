import React, { useState, useEffect, useCallback } from "react";
import VoiceRecorder from "./components/VoiceRecorder";
import NoteCard from "./components/NoteCard";
import EditModal from "./components/EditModal";
import { notesAPI } from "./services/api";
import styles from "./app.module.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { catchFormError } from "./uiComponents/catchFormError";

export const autoClose = 5000;

function Home() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = useCallback(async () => {
    try {
      const fetchedNotes = await notesAPI.getAllNotes();
      setNotes(fetchedNotes);
      toast.success("Notes fetched successfully", {
        autoClose,
    });
    } catch (error) {
      toast.error(catchFormError(error).message, {
        autoClose,
    });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleNoteCreated = useCallback((newNote) => {
    setNotes((prev) => [newNote, ...prev]);
  }, []);

  const handleEditNote = (note) => {
    setEditingNote(note);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = useCallback(async (noteId, updatedData) => {
    try {
      const updatedNote = await notesAPI.updateNote(noteId, updatedData);
      setNotes((prev) =>
        prev.map((note) => (note._id === noteId ? updatedNote : note))
      );
    } catch (error) {
      toast.error(catchFormError(error).message, {
        autoClose,
    });
    }
  }, []);

  const handleDeleteNote = useCallback(async (noteId) => {
    try {
      await notesAPI.deleteNote(noteId);
      setNotes((prev) => prev.filter((note) => note._id !== noteId));
    } catch (error) {
      toast.error(catchFormError(error).message, {
        autoClose,
    });
    }
  }, []);

  const handleUpdateNote = useCallback((noteId, updatedNote) => {
    setNotes((prev) =>
      prev.map((note) => (note._id === noteId ? updatedNote : note))
    );
  }, []);

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
          ) : notes ?(
            <div className={styles.notesGrid}>
              {notes.map((note) => (
                <NoteCard
                  key={note._id}
                  note={note}
                  onEdit={handleEditNote}
                  onDelete={handleDeleteNote}
                  onUpdate={handleUpdateNote}
                />
              ))}
            </div>
          ) : (
           null
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

function App() {
  return (
    <>
      <Home />
      <ToastContainer closeButton={false} closeOnClick />
    </>
  );
}

export default App;
