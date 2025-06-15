"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";

type FeedbackData = {
  strengths: string[];
  weaknesses: string[];
  rating: string;
};

export default function FeedbackView({ id }: { id: string }) {
  const [data, setData] = useState<FeedbackData | null>(null);
  const [, setError] = useState(false);
  const [, setIsFeedback] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // Fetch question from API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/question/${id}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.data.aiAnswer == data.data.userAnswer) setIsFeedback(true);
      } else {
        console.error("Failed to fetch question");
      }
    }
    fetchData();
  }, [id]);

  useEffect(() => {
    async function getFeedback(id: string) {
      try {
        const res = await fetch(`/api/question/${id}/feedback`, {
          cache: "no-store",
        });

        if (!res.ok) {
          setError(true);
          return;
        }

        const { data } = await res.json();

        if (data) {
          if (data?.feedback) {
            const parsed =
              typeof data.feedback === "string"
                ? JSON.parse(
                    data.feedback.replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":')
                  )
                : data.feedback;

            if (parsed) {
              setData({
                strengths: parsed.strengths ?? [],
                weaknesses: parsed.weaknesses ?? [],
                rating: parsed.rating ?? "N/A",
              });
            } else {
              setError(true);
            }
          } else {
            setError(true);
          }
        }
      } catch (err) {
        console.error("Error fetching feedback:", err);
        setError(true);
      }
    }

    getFeedback(id);
  }, [id]);

  if (data) {
    return (
      <div className="dark text-white sm:p-6 rounded-lg">
        <div className="grid gap-6 md:grid-cols-2 grid-cols-1">
          {/* Strengths Column */}
          <Card className="border-none shadow-sm">
            <CardHeader className="bg-green-50 dark:bg-green-950/30 rounded-t-lg border-b border-green-100 dark:border-green-800/50 py-4">
              <CardTitle className="flex items-center text-green-700 dark:text-green-400">
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Strengths
              </CardTitle>
              <CardDescription>
                Positive points about the answer
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-4">
                {data.strengths.map((strength, index) => (
                  <li
                    key={index}
                    className="rounded-lg bg-green-50/50 dark:bg-green-900/20 p-4 border-none"
                  >
                    <p className="mt-1 text-sm text-white">{strength}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Weaknesses Column */}
          <Card className="border-none shadow-sm">
            <CardHeader className="bg-red-50 dark:bg-red-950/30 rounded-t-lg border-none py-4">
              <CardTitle className="flex items-center text-red-700 dark:text-red-400">
                <XCircle className="mr-2 h-5 w-5" />
                Weaknesses
              </CardTitle>
              <CardDescription>Areas for improvement</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-4">
                {data.weaknesses.map((weakness, index) => (
                  <li
                    key={index}
                    className="rounded-lg bg-red-50/50 dark:bg-red-900/20 p-4 border border-none"
                  >
                    <p className="mt-1 text-sm text-white">{weakness}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
}
