"use client";

import React, { use, useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  User,
  Star,
  Target,
  Loader,
} from "lucide-react";
import { FeedbackData } from "@/types/MockFeedback";

const InterviewFeedbackDashboard = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const [loading, setLoading] = useState(false);
  const [feedbackData, setFeedbackData] = useState<FeedbackData>({
    overallScore: 0,
    recommendation: "MAYBE",
    summary: "",
    categoryScores: {
      communication: 0,
      technical: 0,
      behavioral: 0,
      answerQuality: 0,
      engagement: 0,
      pressureHandling: 0,
    },
    strengths: [],
    improvements: [],
    redFlags: [],
    greenFlags: [],
    questionAnalysis: [],
    nextSteps: {
      immediate: [],
      longTerm: [],
      interviewStrategy: [],
    },
    confidenceLevel: "BALANCED",
    communicationStyle: "APPROPRIATE",
    preparednessLevel: "WELL_PREPARED",
  });
  const [activeTab, setActiveTab] = useState("overview");
  const { id } = use(params);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/feedback/${id}`
      );
      if (response.ok) {
        const data = await response.json();
        let raw = data.data;
        if (typeof raw === "string" && raw.startsWith("```")) {
          raw = raw.replace(/^```(\w*\n)?/, "").replace(/```$/, "");
        }
        const newData = typeof raw === "string" ? JSON.parse(raw) : raw;
        setFeedbackData(newData);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-400";
    if (score >= 6) return "text-yellow-400";
    return "text-red-400";
  };

  const getRecommendationColor = (
    rec: "STRONG_HIRE" | "HIRE" | "MAYBE" | "NO_HIRE" | "STRONG_NO_HIRE"
  ) => {
    const colors = {
      STRONG_HIRE: "bg-green-600",
      HIRE: "bg-green-500",
      MAYBE: "bg-yellow-500",
      NO_HIRE: "bg-red-500",
      STRONG_NO_HIRE: "bg-red-600",
    };
    return colors[rec] || "bg-gray-500";
  };

  const ScoreCircle = ({ score, label }: { score: number; label: string }) => (
    <div className="flex flex-col items-center p-3 sm:p-4 bg-neutral-900/50 rounded-lg border border-gray-700">
      <div
        className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-full border-4 ${getScoreColor(score)} border-current flex items-center justify-center`}
      >
        <span
          className={`text-base sm:text-lg font-bold ${getScoreColor(score)}`}
        >
          {score}
        </span>
      </div>
      <span className="text-xs sm:text-sm text-gray-300 mt-2 text-center leading-tight">
        {label}
      </span>
    </div>
  );

  const TabButton = ({
    id,
    label,
    icon: Icon,
    active,
    onClick,
  }: {
    id: string;
    label: string;
    icon: React.ElementType;
    active: boolean;
    onClick: (id: string) => void;
  }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
        active
          ? "bg-white text-black"
          : "text-white hover:text-white hover:bg-neutral-900"
      }`}
    >
      <Icon size={16} className="sm:w-[18px] sm:h-[18px]" />
      <span className="text-sm sm:text-base">{label}</span>
    </button>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen animate-spin text-white">
        <Loader className="w-7 h-7" />
      </div>
    );
  }

  return (
    <>
      {feedbackData.overallScore > 0 && (
        <div className="min-h-screen bg-transparent text-white p-3 sm:p-6 z-30 mt-14">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
                <h1 className="text-xl sm:text-3xl font-bold text-white">
                  Interview Feedback
                </h1>
                <div
                  className={`px-3 sm:px-4 py-2 rounded-full text-white font-semibold text-sm sm:text-base ${getRecommendationColor(feedbackData.recommendation)} z-30 text-center`}
                >
                  HIRING STATUS:{" "}
                  {feedbackData.recommendation?.replace("_", " ")}
                </div>
              </div>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                {feedbackData.summary}
              </p>
            </div>

            {/* Overall Score Card */}
            <div className="bg-neutral-900 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-transparent">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
                    Overall Performance
                  </h2>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0">
                    <div className="text-3xl sm:text-4xl font-bold text-white">
                      {feedbackData.overallScore}/60
                    </div>
                    <div className="text-gray-400 space-y-1 text-sm sm:text-base">
                      <div>
                        Confidence:{" "}
                        <span className="font-bold">
                          {feedbackData.confidenceLevel}
                        </span>
                      </div>
                      <div>
                        Communication:{" "}
                        <span className="font-bold">
                          {feedbackData?.communicationStyle}
                        </span>
                      </div>
                      <div>
                        Preparedness:{" "}
                        <span className="font-bold">
                          {feedbackData.preparednessLevel.replace("_", " ") ||
                            "WELL_PREPARED"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-left lg:text-right">
                  <div className="text-sm text-gray-400 mb-1">
                    Java OOP Developer Position
                  </div>
                  <div className="text-sm text-gray-400">Tanish Valesha</div>
                </div>
              </div>
            </div>

            {/* Category Scores */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 mb-6 sm:mb-8">
              <ScoreCircle
                score={feedbackData.categoryScores.communication}
                label="Communication"
              />
              <ScoreCircle
                score={feedbackData.categoryScores.technical}
                label="Technical"
              />
              <ScoreCircle
                score={feedbackData.categoryScores.behavioral}
                label="Behavioral"
              />
              <ScoreCircle
                score={feedbackData.categoryScores.answerQuality}
                label="Answer Quality"
              />
              <ScoreCircle
                score={feedbackData.categoryScores.engagement}
                label="Engagement"
              />
              <ScoreCircle
                score={feedbackData.categoryScores.pressureHandling}
                label="Pressure Handling"
              />
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-1 sm:space-x-2 mb-4 sm:mb-6 overflow-x-auto pb-2 scrollbar-hide">
              <TabButton
                id="overview"
                label="Overview"
                icon={User}
                active={activeTab === "overview"}
                onClick={setActiveTab}
              />
              <TabButton
                id="strengths"
                label="Strengths"
                icon={CheckCircle}
                active={activeTab === "strengths"}
                onClick={setActiveTab}
              />
              <TabButton
                id="improvements"
                label="Improvements"
                icon={TrendingUp}
                active={activeTab === "improvements"}
                onClick={setActiveTab}
              />
              <TabButton
                id="flags"
                label="Key Insights"
                icon={AlertTriangle}
                active={activeTab === "flags"}
                onClick={setActiveTab}
              />
            </div>

            {/* Tab Content */}
            <div className="bg-neutral-900 rounded-xl p-4 sm:p-6 border border-gray-700">
              {activeTab === "overview" && (
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-lg sm:text-xl font-semibold flex items-center">
                    <User className="mr-2 sm:w-5 sm:h-5" size={18} />
                    Performance Overview
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-3 sm:space-y-4">
                      <h4 className="font-semibold text-green-400 text-sm sm:text-base">
                        Top Performing Areas
                      </h4>
                      {Object.entries(feedbackData.categoryScores)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 3)
                        .map(([category, score]) => (
                          <div
                            key={category}
                            className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg"
                          >
                            <span className="capitalize text-sm sm:text-base">
                              {category.replace(/([A-Z])/g, " $1").trim()}
                            </span>
                            <span
                              className={`font-bold text-sm sm:text-base ${getScoreColor(score)}`}
                            >
                              {score}/10
                            </span>
                          </div>
                        ))}
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      <h4 className="font-semibold text-yellow-400 text-sm sm:text-base">
                        Areas Needing Attention
                      </h4>
                      {Object.entries(feedbackData.categoryScores)
                        .sort(([, a], [, b]) => a - b)
                        .slice(0, 3)
                        .map(([category, score]) => (
                          <div
                            key={category}
                            className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg"
                          >
                            <span className="capitalize text-sm sm:text-base">
                              {category.replace(/([A-Z])/g, " $1").trim()}
                            </span>
                            <span
                              className={`font-bold text-sm sm:text-base ${getScoreColor(score)}`}
                            >
                              {score}/10
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "strengths" && (
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-lg sm:text-xl font-semibold flex items-center text-green-400">
                    <CheckCircle className="mr-2 sm:w-5 sm:h-5" size={18} />
                    Key Strengths
                  </h3>
                  {feedbackData.strengths.map((strength, index) => (
                    <div
                      key={index}
                      className="bg-green-900/20 border border-green-700 rounded-lg p-4"
                    >
                      <h4 className="font-semibold text-green-400 mb-2 text-sm sm:text-base">
                        {strength.category.toUpperCase()}
                      </h4>
                      <p className="text-gray-300 mb-3 text-sm sm:text-base leading-relaxed">
                        {strength.description}
                      </p>
                      <div className="bg-gray-700/50 rounded p-3">
                        <span className="text-xs sm:text-sm text-gray-400">
                          Example:{" "}
                        </span>
                        <span className="text-gray-200 italic text-sm sm:text-base">
                          &quot;{strength.example}&quot;
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "improvements" && (
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-lg sm:text-xl font-semibold flex items-center text-yellow-400">
                    <TrendingUp className="mr-2 sm:w-5 sm:h-5" size={18} />
                    Areas for Improvement
                  </h3>
                  {feedbackData.improvements.map((improvement, index) => (
                    <div
                      key={index}
                      className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4"
                    >
                      <h4 className="font-semibold text-yellow-400 mb-2 text-sm sm:text-base">
                        {improvement.category.toUpperCase()}
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <span className="text-xs sm:text-sm text-gray-400">
                            Issue:{" "}
                          </span>
                          <span className="text-gray-300 text-sm sm:text-base">
                            {improvement.issue}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs sm:text-sm text-gray-400">
                            Suggestion:{" "}
                          </span>
                          <span className="text-gray-300 text-sm sm:text-base">
                            {improvement.suggestion}
                          </span>
                        </div>
                        <div className="bg-gray-700/50 rounded p-3">
                          <span className="text-xs sm:text-sm text-gray-400">
                            Better Approach:{" "}
                          </span>
                          <span className="text-gray-200 italic text-sm sm:text-base">
                            &quot;{improvement.example}&quot;
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "flags" && (
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-lg sm:text-xl font-semibold flex items-center">
                    <AlertTriangle className="mr-2 sm:w-5 sm:h-5" size={18} />
                    Key Insights
                  </h3>

                  {feedbackData.redFlags.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-red-400 flex items-center text-sm sm:text-base">
                        <XCircle
                          className="mr-2 sm:w-[18px] sm:h-[18px]"
                          size={16}
                        />
                        Areas of Concern
                      </h4>
                      {feedbackData.redFlags.map((flag, index) => (
                        <div
                          key={index}
                          className="bg-red-900/20 border border-red-700 rounded-lg p-4"
                        >
                          <h5 className="font-semibold text-red-400 mb-2 text-sm sm:text-base">
                            {flag.concern}
                          </h5>
                          <p className="text-gray-300 mb-2 text-sm sm:text-base leading-relaxed">
                            {flag.impact}
                          </p>
                          <div className="bg-gray-700/50 rounded p-3">
                            <span className="text-xs sm:text-sm text-gray-400">
                              Evidence:{" "}
                            </span>
                            <span className="text-gray-200 italic text-sm sm:text-base">
                              &quot;{flag.evidence}&quot;
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-4">
                    <h4 className="font-semibold text-green-400 flex items-center text-sm sm:text-base">
                      <Star
                        className="mr-2 sm:w-[18px] sm:h-[18px]"
                        size={16}
                      />
                    </h4>
                    {feedbackData.greenFlags.map((flag, index) => (
                      <div
                        key={index}
                        className="bg-green-900/20 border border-green-700 rounded-lg p-4"
                      >
                        <h5 className="font-semibold text-green-400 mb-2 text-sm sm:text-base">
                          {flag.strength}
                        </h5>
                        <p className="text-gray-300 mb-2 text-sm sm:text-base leading-relaxed">
                          {flag.impact}
                        </p>
                        <div className="bg-gray-700/50 rounded p-3">
                          <span className="text-xs sm:text-sm text-gray-400">
                            Evidence:{" "}
                          </span>
                          <span className="text-gray-200 italic text-sm sm:text-base">
                            &quot;{flag.evidence}&quot;
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Items */}
            <div className="mt-6 sm:mt-8 bg-blue-900/20 border border-blue-700 rounded-xl p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-blue-400 mb-4 flex items-center">
                <Target className="mr-2 sm:w-5 sm:h-5" size={18} />
                Next Steps
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <h4 className="font-semibold text-blue-300 mb-3 text-sm sm:text-base">
                    Immediate Actions
                  </h4>
                  <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
                    <li>
                      • Practice explaining polymorphism with code examples
                    </li>
                    <li>
                      • Prepare STAR format stories for behavioral questions
                    </li>
                    <li>• Review common OOP design patterns</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-300 mb-3 text-sm sm:text-base">
                    Long-term Development
                  </h4>
                  <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
                    <li>• Build portfolio with OOP design examples</li>
                    <li>• Practice technical presentations</li>
                    <li>• Study system design principles</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-300 mb-3 text-sm sm:text-base">
                    Interview Strategy
                  </h4>
                  <ul className="space-y-2 text-gray-300 text-sm sm:text-base">
                    <li>• Take time to structure complex answers</li>
                    <li>• Ask clarifying questions when uncertain</li>
                    <li>• Practice under timed conditions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InterviewFeedbackDashboard;
