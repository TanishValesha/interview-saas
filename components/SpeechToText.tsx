"use client";
import { useState, useRef } from "react";

const LiveTranscriber = () => {
  const [transcript, setTranscript] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks: Blob[] = [];

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.start();

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };
  };

  const stopRecording = async () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/flac" });

      console.log("Recorded Audio Blob:", audioBlob); // Debugging

      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = reader.result?.toString().split(",")[1];

        console.log("Base64 Audio Data:", base64Audio?.substring(0, 100)); // Log first 100 chars

        const response = await fetch("/api/audio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ audioData: base64Audio }),
        });

        const data = await response.json();
        console.log("API Response:", data); // Log the response

        setTranscript(data.text || "No transcript found");
      };
    };
  };

  return (
    <div className="p-4 bg-white">
      <h2 className="text-lg font-bold">Live Transcription (Groq Whisper)</h2>
      <button
        onClick={startRecording}
        className="mr-2 p-2 bg-green-500 text-white"
      >
        Start
      </button>
      <button onClick={stopRecording} className="p-2 bg-red-500 text-white">
        Stop
      </button>
      <p className="mt-2">{transcript || "Listening..."}</p>
    </div>
  );
};

export default LiveTranscriber;
