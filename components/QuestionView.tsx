"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ChevronDown, Loader, Mic } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Question } from "@/types/Question";
import { apiUrl } from "./libs/apiUrl";
import { toast } from "sonner";
import { createInterviewAnswerPrompt } from "./prompts/questionAnswerPrompt";
import { createAnswerEvaluationPrompt } from "./prompts/answerEvluationPrompt";

export default function QuestionView({ id }: { id: string }) {
  const [answer, setAnswer] = useState("");
  const [questionData, setQuestionData] = useState<Question>();
  const [b1loading, setb1Loading] = useState(false);
  const [b2loading, setb2Loading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    async function fetchData() {
      // Fetch question from API
      const response = await fetch(`${apiUrl}/question/${id}`);
      if (response.ok) {
        const data = await response.json();
        setQuestionData(data.data);
        if (data.data.aiAnswer) setAnswer(data.data.aiAnswer);
        else setAnswer(data.data.userAnswer ?? "");
      } else {
        console.error("Failed to fetch question");
      }
    }
    fetchData();
  }, [id, questionData?.userAnswer]);

  const handleUserSubmit = async () => {
    setb1Loading(true);
    const response = await fetch(`${apiUrl}/question/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userAnswer: answer }),
    });
    let data;
    if (response.ok) {
      data = await response.json();
      setQuestionData(data.data);
      toast.success(data.message);
      setb1Loading(false);
    } else {
      console.error("Failed to submit answer");
      toast.error("Failed to submit answer");
      setb1Loading(false);
    }
    console.log(questionData);

    if (data.data?.text != "" && data.data?.userAnswer) {
      console.log("Triggered!");

      const response = await fetch(`${apiUrl}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: createAnswerEvaluationPrompt(
            data.data?.text || "",
            data.data?.userAnswer || "",
            "Easy" // Try to implement this dynamically
          ),
        }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data.data);
        setb1Loading(false);
        toast.success("Feedback Generated Successfully");
      } else {
        console.error("Failed to generate feedback");
        toast.error("Failed to generate feedback");
        setb1Loading(false);
      }
    }
  };

  const handleGenerateAnswer = async () => {
    setb2Loading(true);
    const response = await fetch(`${apiUrl}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: createInterviewAnswerPrompt(questionData?.text || ""),
      }),
    });
    let data;
    if (response.ok) {
      data = await response.json();
      setAnswer(data.data);
      toast.success("Answer generated successfully");
    } else {
      console.error("Failed to generate answer");
      toast.error("Failed to generate answer");
    }
    const responseSave = await fetch(`${apiUrl}/question/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ aiAnswer: data.data }),
    });

    if (responseSave.ok) {
      const data = await responseSave.json();
      toast.success(data.message);
      setb2Loading(false);
    } else {
      console.error("Failed to save generated answer");
      setb2Loading(false);
      toast.error("Failed to save generated answer");
    }
  };

  {
    if (questionData === undefined)
      return (
        <div className="flex justify-center items-center h-screen animate-spin text-white ">
          <Loader className="w-7 h-7" />
        </div>
      );
  }
  return (
    <div className="min-h-screen font-sans text-gray-100 ">
      <div className="max-w-7xl mx-auto p-4">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-neutral-950 hover:text-white"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-10" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Question Card */}
          <div className="rounded-lg bg-neutral-900 shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-100">Question</h2>
              </div>

              <div className="border-t border-gray-800 my-4"></div>

              <p className="text-gray-200 mb-6 font-bold">
                {questionData?.text}
              </p>

              <div className="border-t border-gray-800 my-4"></div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-300">Your Answer</h3>
                  <div className="flex items-center gap-2 ">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                    >
                      <Mic className="h-5 w-5" />
                    </Button>
                    <Button
                      disabled={b2loading || questionData?.aiAnswer === answer}
                      className="bg-violet-600 hover:bg-violet-700 text-white font-bold"
                      onClick={handleGenerateAnswer}
                    >
                      {b2loading && <Loader className="w-5 h-5 animate-spin" />}
                      <span className="mr-2">✨</span>
                      Generate Answer
                    </Button>
                  </div>
                </div>

                <Textarea
                  value={answer}
                  placeholder="Type your answer here..."
                  onChange={(e) => setAnswer(e.target.value)}
                  className="min-h-[200px]  bg-neutral-900 border-gray-800 text-gray-200 focus:border-gray-700 focus:ring-gray-700"
                />

                <div>
                  <Button
                    variant="secondary"
                    disabled={b1loading || questionData?.aiAnswer === answer}
                    className="bg-black hover:bg-neutral-950 cursor-pointer font-bold text-white"
                    onClick={handleUserSubmit}
                  >
                    {b1loading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        {"Generating Feedback..."}
                      </>
                    ) : (
                      "Generate Feedback"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Card */}
          {/* <div className="rounded-lg border border-gray-800 bg-gray-900 shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-100 mb-4">Feedback</h2>
            <p className="text-gray-200">
              Great answer! No improvements needed 😊
            </p>
          </div> */}

          {/* Guidelines Card */}
          {/* <div className="rounded-lg border border-gray-800 bg-gray-900 shadow-sm overflow-hidden">
            <Collapsible>
              <CollapsibleTrigger className="flex justify-between items-center w-full p-6">
                <h2 className="text-xl font-bold text-gray-100">
                  Answer Guidelines
                </h2>
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-6 pb-6">
                <p className="text-gray-300">
                  Guidelines content would appear here when expanded.
                </p>
              </CollapsibleContent>
            </Collapsible>
          </div> */}
        </div>
      </div>
    </div>
  );
}
