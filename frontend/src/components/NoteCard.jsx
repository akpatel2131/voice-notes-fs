import React, { useState } from 'react';
import { notesAPI } from '../services/api';
import styles from './noteCard.module.css';
import Button from '../uiComponents/Button/Button';

const NoteCard = ({ note, onEdit, onDelete, onUpdate }) => {
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const response = await notesAPI.generateSummary(note._id);
      onUpdate(note._id, { ...note, summary: response.summary, isEdited: false });
    } catch (error) {
      console.error('Error generating summary:', error);
      alert('Failed to generate summary. Please try again.');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.noteCard}>
      <div className={styles.noteHeader}>
        <h3>{note.title}</h3>
        <div className={styles.noteMeta}>
          <span>{formatDate(note.createdAt)}</span>
          {note.duration > 0 && <span>Duration: {formatDuration(note.duration)}</span>}
        </div>
      </div>

      <div className={styles.noteContent}>
        <div className={styles.transcript}>
          <h4>Transcript:</h4>
          <p>{note.transcript}</p>
        </div>

        {note.summary && (
          <div className={styles.summary}>
            <h4>Summary:</h4>
            <p>{note.summary}</p>
          </div>
        )}
      </div>

      <div className={styles.noteActions}>
        <Button onClick={() => onEdit(note)} variant="outlined">
          Edit
        </Button>
        
        <Button onClick={() => onDelete(note._id)} variant="negative">
          Delete
        </Button>
        
        <Button
          onClick={handleGenerateSummary}
          disabled={isGeneratingSummary || (note.summary && !note.isEdited)}
          className={styles.summaryButton}
          variant="primary"
        >
          {isGeneratingSummary ? 'Generating...' : 'Generate Summary'}
        </Button>
      </div>
    </div>
  );
};

export default NoteCard;