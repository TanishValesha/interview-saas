"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export default function ListView({ slug }: { slug: string }) {
  const router = useRouter();
  const [completedQuestions, setCompletedQuestions] = useState<number[]>([1]);
  const [questions, setQuestions] = useState<{ id: number; text: string }[]>(
    []
  );
  useEffect(() => {
    async function fetchData() {
      // Fetch questions from API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/interview/${slug}`,
        {
          cache: "force-cache",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setQuestions(data.data.generatedQuestions);
      } else {
        console.error("Failed to fetch questions");
      }
    }
    fetchData();
  }, []);

  const toggleCompleted = (id: number) => {
    if (completedQuestions.includes(id)) {
      setCompletedQuestions(completedQuestions.filter((qId) => qId !== id));
    } else {
      setCompletedQuestions([...completedQuestions, id]);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen animate-spin text-white ">
        <Loader className="w-7 h-7" />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-100 dark">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold mb-6">Interview Questions</h1>
          <Button
            className="z-30"
            onClick={() => {
              router.push(`/dashboard/setup/${slug}`);
            }}
          >
            Mock Interview
          </Button>
        </div>
        <div className="space-y-4">
          {questions.map((question, index) => (
            <Link
              href={`/dashboard/question/${question.id}`}
              key={question.id}
              className="flex items-start gap-4 p-6 bg-neutral-900 rounded-lg hover:bg-neutral-950 hover:scale-101 duration-200 cursor-pointer"
              onClick={() => toggleCompleted(question.id)}
            >
              <div className="text-gray-500 font-mono text-sm pt-1 w-8">
                {index != 9 ? "0" : ""}
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="text-gray-100 font-medium">{question.text}</p>
              </div>
              {/* <div className="w-8 flex justify-center">
                {completedQuestions.includes(question.id) && (
                  <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="h-4 w-4 text-green-500" />
                  </div>
                )}
              </div> */}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
