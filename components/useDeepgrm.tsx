// hooks/useDeepgram.ts
"use client";
import { useRef, useState } from "react";

export const useDeepgram = (onTranscript: (text: string) => void) => {
  const [listening, setListening] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const start = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;

    const socket = new WebSocket(
      "wss://api.deepgram.com/v1/listen?punctuate=true&language=en",
      ["token", "54ebf789f5771f09bb6c69a6fd3138ad0bb86d9e"]
    );
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ WebSocket connection established");
      setListening(true);
      recorder.start(100);

      recorder.ondataavailable = (e) => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(e.data);
        }
      };
    };

    socket.onmessage = (message) => {
      const data = JSON.parse(message.data);
      const transcript = data.channel?.alternatives?.[0]?.transcript;
      if (transcript) {
        onTranscript(transcript);
      }
    };

    socket.onerror = (err) => {
      console.error("❌ WebSocket error", err);
    };

    socket.onclose = (e) => {
      console.log("🚪 WebSocket closed", e.code, e.reason);
      setListening(false);
    };
  };

  const stop = () => {
    mediaRecorderRef.current?.stop();
    socketRef.current?.close();
    setListening(false);
  };

  return {
    start,
    stop,
    listening,
  };
};
