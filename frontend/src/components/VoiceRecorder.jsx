import React, { useState, useRef, useCallback } from "react";
import { notesAPI } from "../services/api";
import styles from "./voiceRecorder.module.css";

const VoiceRecorder = ({ onNoteCreated }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [duration, setDuration] = useState(0);
  const [title, setTitle] = useState("");
  const [transcript, setTranscript] = useState("");

  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  const startRecording = useCallback(() => {
    try {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        alert("Speech recognition not supported in this browser.");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognitionRef.current = recognition;

      recognition.onresult = (event) => {
        const speechTranscript = event.results[0][0].transcript;
        setTranscript(speechTranscript);
      };

      recognition.onerror = (event) => {
        alert("Speech recognition error:", event.error);
      };

      recognition.start();
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      alert("Could not start speech recognition.");
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);

      setIsProcessing(true);
      try {
        const newNote = await notesAPI.createNote({
          title: title || `Voice Note ${Date.now()}`,
          transcript,
          duration: duration.toString(),
        });
        onNoteCreated(newNote);
        setTitle("");
      } catch (error) {
        alert("Failed to save voice note. Please try again.");
      } finally {
        setDuration(0);
        setIsProcessing(false);
      }
    }
  }, [isRecording, transcript, title, duration, onNoteCreated]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={styles.voiceRecorder}>
      <div className={styles.recorderHeader}>
        <h2>Voice Notes</h2>
      </div>

      <div className={styles.recorderControls}>
        <div className={styles.recordingStatus}>
          {isRecording && (
            <div className={styles.recordingIndicator}>
              <span className={styles.recordingDot}></span>
              Recording: {formatTime(duration)}
            </div>
          )}
          {isProcessing && <div className={styles.processing}>Processing...</div>}
        </div>

        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={styles.recordButton + " " + (isRecording ? styles.recording : "")}
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
      </div>
    </div>
  );
};

export default VoiceRecorder;
