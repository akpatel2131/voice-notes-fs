import React, { useState, useEffect, useCallback } from "react";
import styles from "./editModal.module.css";
import Button from "../uiComponents/Button/Button";
import Modal from "../uiComponents/Modal/Modal";

const EditModal = ({ note, isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setTranscript(note.transcript);
    }
  }, [note]);

  const handleSave = useCallback(async () => {
    await onSave(note._id, { title, transcript });
    onClose();
  }, [note, title, transcript, onSave, onClose]);

  return (
    <Modal title="Edit Note" onClose={onClose} isOpen={isOpen}>
      <div className={styles.modalBody}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.formInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Transcript:</label>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            className={styles.formInput}
            rows="8"
          />
        </div>
      </div>

      <div className={styles.modalFooter}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="primary">
          Save Changes
        </Button>
      </div>
    </Modal>
  );
};

export default EditModal;
