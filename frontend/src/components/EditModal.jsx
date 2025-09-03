import React, { useState, useEffect } from 'react';
import styles from './editModal.module.css';

const EditModal = ({ note, isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setTranscript(note.transcript);
    }
  }, [note]);

  const handleSave = () => {
    onSave(note._id, { title, transcript });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>Edit Note</h3>
          <button onClick={onClose} className={styles.closeButton}>×</button>
        </div>
        
        <div className={styles.modalBody}>
          <div className={styles.formGroup}>
            <label>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.formInput}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Transcript:</label>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              className={styles.formTextarea}
              rows="8"
            />
          </div>
        </div>
        
        <div className={styles.modalFooter}>
          <button onClick={onClose} className={styles.cancelButton}>Cancel</button>
          <button onClick={handleSave} className={styles.saveButton}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;