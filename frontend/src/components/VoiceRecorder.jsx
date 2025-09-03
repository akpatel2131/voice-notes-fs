import React, { useState, useRef, useCallback } from "react";
import { notesAPI } from "../services/api";
import styles from "./voiceRecorder.module.css";
import { toast } from "react-toastify";
import { catchFormError } from "../uiComponents/catchFormError";
import { autoClose } from "../App";

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
        toast.error("Speech recognition not supported in this browser.", {
          autoClose,
        });
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
        toast.error(`Speech recognition error: ${event.error}`, {
          autoClose,
        });
      };

      recognition.start();
      setIsRecording(true);
      setTranscript("");

      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      toast.error(catchFormError(error).message, {
        autoClose,
      });
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);

      setIsProcessing(true);
      if (!transcript) {
        toast.error("No transcript available", {
          autoClose,
        });
        setIsProcessing(false);
        return;
      }
      try {
        const newNote = await notesAPI.createNote({
          title: title || `Voice Note ${Date.now()}`,
          transcript,
          duration: duration.toString(),
        });
        onNoteCreated(newNote);
        setTitle("");
        toast.success("Note created successfully", {
          autoClose,
        });
      } catch (error) {
        toast.error(catchFormError(error).message, {
          autoClose,
        });
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
          {isProcessing && (
            <div className={styles.processing}>Processing...</div>
          )}
        </div>

        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={
            styles.recordButton + " " + (isRecording ? styles.recording : "")
          }
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
      </div>
    </div>
  );
};

export default VoiceRecorder;
