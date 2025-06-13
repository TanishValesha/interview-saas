"use client";

import type React from "react";
import { useState, useRef, useEffect, use } from "react";
import { Mic, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";
import WebcamStream from "@/components/WebCamStream";
import { useDeepgram } from "@/components/useDeepgrm";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Interview } from "@/types/Interview";
import Link from "next/link";

export default function InterviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [interview, setInterview] = useState<Interview>();
  const [response, setResponse] = useState("");
  const [prevTranscript, setPrevTranscript] = useState("");
  const [, setTranscript] = useState("");
  const [playbackRate, setPlaybackRate] = useState(1.25);
  const [, setLoading] = useState(false);
  const [messages, setMessages] = useState([{}] as {
    sender: string;
    text: string;
  }[]);
  const router = useRouter();

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
      audio.playbackRate = playbackRate;
      audio.play();
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    const fetchInterviewData = async () => {
      const response = await fetch(`/api/interview/${id}`);
      if (response.ok) {
        const data = await response.json();
        setInterview(data.data);
      }
    };
    fetchInterviewData();
  }, [id]);

  useEffect(() => {
    const fetchInterviewData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/mock/${id}`
        );
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
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/mock/start`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              slug: id,
            }),
          }
        );

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
        toast.loading("Thinking...");
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/mock/reply`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              slug: id,
              userAnswer: response,
            }),
          }
        );

        const data = await res.json();
        toast.dismiss();
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

  const questionsArray = messages.filter((msg) => msg.sender === "interviewer");
  console.log(questionsArray.length);

  const handleEndInterview = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/mock/end/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            slug: id,
          }),
        }
      );

      const data = await res.json();
      if (data.success) {
        toast.success("Interview Ended Successfully!");
        router.push(`/dashboard/feedback/${id}`);
      } else {
        toast.error(data.message || "Failed to end the interview.");
      }
    } catch (error) {
      console.error("Error ending interview:", error);
      toast.error("An error occurred while ending the interview.");
    }
  };

  return (
    <div className="flex h-screen flex-col text-gray-100 overflow-hidden pl-32">
      <main className="flex flex-1 flex-col md:flex-row overflow-hidden">
        {/* Left Panel */}
        <div className="w-full border-b border-gray-800 p-4 md:w-2/5 md:border-b-0 md:border-r">
          {/* <div className=" w-full overflow-hidden rounded-lg bg-gray-800"></div> */}
          <WebcamStream />
          <div className="mt-4 flex justify-start gap-3">
            <Label className="text-md bg-gray-800 px-3 rounded-4xl">
              Questions Left: {15 - questionsArray.length}
            </Label>
            <Button
              onClick={handleEndInterview}
              variant="destructive"
              disabled={interview?.feedback !== null}
              className="bg-red-600 hover:bg-red-700"
            >
              End Interview
            </Button>
            {interview?.feedback && (
              <Button className="bg-white text-black hover:bg-gray-300">
                <Link href={`/dashboard/feedback/${interview.id}`}>
                  View Feedback
                </Link>
              </Button>
            )}
          </div>
          <div className="mt-2 text-sm text-gray-400 text-left">
            <p className="mb-1 text-md">
              Note: Interview can only be ended once or will automatically end
              when questions reach 0
            </p>
          </div>
        </div>

        {/* Right Chat Panel */}
        <div className="flex flex-1/3 flex-col relative h-full overflow-hidden z-30">
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
                  disabled={interview?.feedback !== null}
                  onChange={(e) => setResponse(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="min-h-[80px] w-full resize-none rounded-lg disabled:cursor-not-allowed bg-gray-800 border border-gray-400 p-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-700"
                />
              </div>
              <div className="flex-col items-center justify-center gap-2">
                <div className="mb-2">
                  <Select
                    onValueChange={(value) => {
                      setPlaybackRate(parseFloat(value));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={playbackRate} />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 text-gray-100">
                      <SelectItem value="0.5">x0.5</SelectItem>
                      <SelectItem value="0.75">x0.75</SelectItem>
                      <SelectItem value="1.0">x1.0</SelectItem>
                      <SelectItem value="1.25">x1.25</SelectItem>
                      <SelectItem value="1.5">x1.5</SelectItem>
                      <SelectItem value="1.75">x1.75</SelectItem>
                      <SelectItem value="2.0">x2.0</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={
                      questionsArray.length >= 15 ||
                      interview?.feedback !== null
                    }
                    onClick={listening ? stop : start}
                    className={`text-gray-400 hover:text-gray-200 disabled:cursor-not-allowed hover:bg-gray-800 ${
                      listening ? "bg-green-600 text-white animate-pulse" : ""
                    }`}
                  >
                    <Mic className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="default"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-gray-700 hover:bg-gray-600 disabled:cursor-not-allowed"
                    disabled={
                      questionsArray.length >= 15 ||
                      interview?.feedback !== null
                    }
                    onClick={handleSendMessage}
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
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
