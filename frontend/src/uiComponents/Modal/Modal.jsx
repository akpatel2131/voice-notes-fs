import styles from "./modal.module.css";

export default function Modal({ title, onClose, children, isOpen }) {
  if (!isOpen) return null;
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderTitle}>{title}</div>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
