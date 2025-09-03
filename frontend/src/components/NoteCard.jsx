import React, { useCallback, useState } from "react";
import { notesAPI } from "../services/api";
import styles from "./noteCard.module.css";
import Button from "../uiComponents/Button/Button";
import Modal from "../uiComponents/Modal/Modal";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { catchFormError } from "../uiComponents/catchFormError";
import { autoClose } from "../App";

const NoteCard = ({ note, onEdit, onDelete, onUpdate }) => {
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleGenerateSummary = useCallback(async () => {
    setIsGeneratingSummary(true);
    try {
      const response = await notesAPI.generateSummary(note._id);
      onUpdate(note._id, {
        ...note,
        summary: response.summary,
        isEdited: false,
      });
      toast.success("Summary generated successfully", {
        autoClose,
    });
    } catch (error) {
      toast.error(catchFormError(error).message, {
        autoClose,
    });
    } finally {
      setIsGeneratingSummary(false);
    }
  }, [note, onUpdate]);

  const handleDeleteModalClose = useCallback(() => {
    setIsDeleteModalOpen((prev) => !prev);
  }, [setIsDeleteModalOpen]);

  const handleDelete = useCallback(() => {
    onDelete(note._id);
    handleDeleteModalClose();
  }, [onDelete, note._id, handleDeleteModalClose]);

  return (
    <>
      <div className={styles.noteCard}>
        <div className={styles.noteCardHeader}>
          <div className={styles.noteTitle}>{note.title}</div>
          <div className={styles.noteMeta}>
            <span className={styles.noteMetaTime}>
              {format(note.createdAt, "dd MMM yyyy")}
            </span>
          </div>
        </div>

        <div className={styles.noteContent}>
          <div className={styles.transcriptAndSummary}>
            <div className={styles.transcriptAndSummaryLabel}>Transcript:</div>
            <div className={styles.transcriptAndSummaryText}>
              {note.transcript}
            </div>
          </div>

          {note.summary && (
            <div className={styles.transcriptAndSummary}>
              <div className={styles.transcriptAndSummaryLabel}>Summary:</div>
              <div className={styles.transcriptAndSummaryText}>
                {note.summary}
              </div>
            </div>
          )}
        </div>

        <div className={styles.noteCardActions}>
          <Button onClick={() => onEdit(note)} variant="outlined">
            Edit
          </Button>

          <Button onClick={handleDeleteModalClose} variant="negative">
            Delete
          </Button>

          <Button
            onClick={handleGenerateSummary}
            disabled={isGeneratingSummary || (note.summary && !note.isEdited)}
            className={styles.summaryButton}
            variant="primary"
          >
            {isGeneratingSummary ? "Generating..." : "Generate Summary"}
          </Button>
        </div>
      </div>
      <Modal
        title="Confirmation"
        onClose={handleDeleteModalClose}
        isOpen={isDeleteModalOpen}
      >
        <div className={styles.confirmationText}>
          Are you sure want to Delete {note.title} ?
        </div>
        <div className={styles.actionButton}>
          <Button onClick={handleDeleteModalClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleDelete} variant="negative">
            Delete
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default NoteCard;
