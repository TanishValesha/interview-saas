"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Mic, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";

export default function InterviewPage() {
  const [response, setResponse] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "interviewer",
      text: "Hello! Thanks for joining us today. I'm speaking with you about our Full Stack Intern position.",
    },
    {
      sender: "interviewer",
      text: "To start, could you tell me about how you approach security when developing web applications? What are some common web vulnerabilities, and how do you prevent them?",
    },
    {
      sender: "user",
      text: "Thanks for having me! When it comes to security, I follow a 'security by design' approach. I consider security at every stage of development rather than as an afterthought.",
    },
    {
      sender: "user",
      text: "Common vulnerabilities include XSS (Cross-Site Scripting), SQL Injection, CSRF (Cross-Site Request Forgery), and broken authentication. To prevent these, I use input validation, parameterized queries, CSRF tokens, and proper authentication practices like OAuth or JWT with proper expiration.",
    },
    {
      sender: "interviewer",
      text: "That's a good overview. Could you elaborate on how you would specifically prevent XSS attacks in a React application?",
    },
    {
      sender: "user",
      text: "In React, I prevent XSS by avoiding dangerouslySetInnerHTML when possible. React automatically escapes variables in JSX, which helps prevent most XSS attacks. For cases where I need to render HTML, I use libraries like DOMPurify to sanitize content before rendering.",
    },
    {
      sender: "interviewer",
      text: "Great answer. What is the purpose of a code review, and what do you look for when reviewing someone else's code? What kind of feedback would you consider to be most helpful?",
    },
    {
      sender: "user",
      text: "Code reviews serve multiple purposes: ensuring code quality, knowledge sharing, and catching bugs early. When reviewing code, I look for:",
    },
    {
      sender: "user",
      text: "1. Functionality: Does the code work as intended?\n2. Readability: Is the code easy to understand?\n3. Maintainability: Will it be easy to modify in the future?\n4. Performance: Are there any obvious performance issues?\n5. Security: Are there potential security vulnerabilities?",
    },
    {
      sender: "user",
      text: "The most helpful feedback is specific, actionable, and educational. Rather than just pointing out issues, I try to explain why something is problematic and suggest alternatives. I also make sure to highlight positive aspects of the code to encourage good practices.",
    },
    {
      sender: "interviewer",
      text: "Those are excellent points. How do you handle disagreements during code reviews?",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (response.trim()) {
      setMessages((prev) => [...prev, { sender: "user", text: response }]);
      setResponse("");
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
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-800">
            <img
              src="/placeholder.svg?height=400&width=600"
              alt="Video feed"
              className="h-full w-full object-cover"
            />
          </div>

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
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.sender === "interviewer" && (
                  <Avatar className="mr-2 h-8 w-8">
                    <img src="/robot.png" alt="Interviewer" />
                  </Avatar>
                )}

                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === "user"
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
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
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
