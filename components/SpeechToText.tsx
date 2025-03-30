"use client";
import React, { useEffect, useRef, useState } from "react";

export default function RawSpeechRecognitionTest() {
  const recognitionRef = useRef<any>(null);
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        interim += event.results[i][0].transcript;
      }
      console.log("Transcript:", interim);
      setTranscript(interim);
    };

    recognition.onstart = () => {
      console.log("Started listening");
      setListening(true);
    };

    recognition.onend = () => {
      console.log("Stopped listening");
      setListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Recognition error", event.error);
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    recognitionRef.current?.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
  };

  return (
    <div className="bg-white">
      <p>Listening: {listening ? "on" : "off"}</p>
      <button onClick={startListening}>Start</button>
      <button onClick={stopListening}>Stop</button>
      <p>Transcript: {transcript}</p>
    </div>
  );
}
