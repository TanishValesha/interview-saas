"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Mic, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { apiUrl } from "@/components/libs/apiUrl";
import Image from "next/image";
import WebcamStream from "@/components/WebCamStream";
import { useDeepgram } from "@/components/useDeepgrm";

export default function InterviewPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [response, setResponse] = useState("");
  const [prevTranscript, setPrevTranscript] = useState("");
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState([{}] as {
    sender: string;
    text: string;
  }[]);

  const { start, stop, listening } = useDeepgram((newTranscript) => {
    const added = newTranscript.replace(prevTranscript, "").trim();
    if (added) {
      setResponse((prev) => prev + " " + added);
      setPrevTranscript(newTranscript);
    }
    setTranscript(newTranscript);
  });

  async function textToSpeech(TEXT: string) {
    console.log(TEXT);

    try {
      const response = await fetch("/api/convert-text-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: TEXT }),
      });

      if (!response.ok) {
        console.error("Error fetching audio:", await response.text());
        return;
      }

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audio.playbackRate = 1.25;
      audio.play();
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    const fetchInterviewData = async () => {
      try {
        const res = await fetch(`${apiUrl}/mock/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch interview data");
        }
        const data = await res.json();
        setMessages(
          data.data.mockQuestions.map(
            (mockModel: { text: string; sender: string }) => ({
              sender: mockModel.sender,
              text: mockModel.text,
            })
          )
        );
      } catch (error) {
        console.error("Error fetching interview data:", error);
      }
    };

    fetchInterviewData();
  }, [id]);

  useEffect(() => {
    const startInterview = async () => {
      try {
        const res = await fetch(`${apiUrl}/mock/start`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            slug: id,
          }),
        });

        const data: { sender: string; question: string } = await res.json();
        textToSpeech(data.question);
        setMessages([
          {
            sender: "interviewer",
            text: data.question,
          },
        ]);
      } catch (error) {
        console.error("Error starting interview:", error);
      }
    };
    if (messages.length === 0) {
      startInterview();
    }
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (response.trim()) {
      setMessages((prev) => [...prev, { sender: "candidate", text: response }]);
      setResponse("");
      try {
        const res = await fetch(`${apiUrl}/mock/reply`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            slug: id,
            userAnswer: response,
          }),
        });

        const data = await res.json();

        setMessages((prev) => [
          ...prev,
          { sender: "interviewer", text: data.question },
        ]);

        textToSpeech(data.question);
      } catch (error) {
        console.error("Error starting interview:", error);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen flex-col text-gray-100 overflow-hidden pl-32">
      <main className="flex flex-1 flex-col md:flex-row overflow-hidden">
        {/* Left Panel */}
        <div className="w-full border-b border-gray-800 p-4 md:w-2/5 md:border-b-0 md:border-r">
          {/* <div className=" w-full overflow-hidden rounded-lg bg-gray-800"></div> */}
          <WebcamStream />
          <div className="mt-4 flex justify-end">
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
            >
              End Interview
            </Button>
          </div>
        </div>

        {/* Right Chat Panel */}
        <div className="flex flex-1/3 flex-col relative h-full overflow-hidden">
          {/* Scrollable Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-[8rem]">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.sender === "candidate"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {message.sender === "interviewer" && (
                  <Avatar className="mr-2 h-8 w-8">
                    <Image
                      src="/robot.png"
                      alt="Interviewer"
                      width={32}
                      height={32}
                    />
                  </Avatar>
                )}

                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === "candidate"
                      ? "bg-neutral-900 text-gray-100"
                      : "bg-gray-800 text-gray-100"
                  }`}
                >
                  <p className="whitespace-pre-line">{message.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Fixed Input */}
          <div className="absolute bottom-0 left-0 right-0 border-t bg-gray-800 border-gray-800 p-4">
            <div className="flex items-end gap-2">
              <div className="relative flex-1">
                <textarea
                  placeholder="Type your response..."
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="min-h-[80px] w-full resize-none rounded-lg bg-gray-800 border border-gray-400 p-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-700"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={listening ? stop : start}
                  className={`text-gray-400 hover:text-gray-200 hover:bg-gray-800 ${
                    listening ? "bg-green-600 text-white animate-pulse" : ""
                  }`}
                >
                  <Mic className="h-5 w-5" />
                </Button>
                <Button
                  variant="default"
                  size="icon"
                  className="h-10 w-10 rounded-full bg-gray-700 hover:bg-gray-600"
                  onClick={handleSendMessage}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
              {/* <span className="text-sm text-gray-300">
                {listening && "Listening..."}
              </span> */}
            </div>

            {/* <div className="mt-4 flex items-center justify-end">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 rounded-md border border-gray-700 bg-gray-800 px-2 py-1">
                  <span className="text-sm text-gray-300">LeBron James</span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>

                <div className="flex items-center gap-1 rounded-md border border-gray-700 bg-gray-800 px-2 py-1">
                  <span className="text-sm text-gray-300">1.0x</span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </main>
    </div>
  );
}
