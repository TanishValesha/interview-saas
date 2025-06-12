"use client";

import React, { useState } from "react";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  User,
  MessageCircle,
  Brain,
  Star,
  Target,
  Clock,
} from "lucide-react";

const InterviewFeedbackDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data based on the conversation shown
  const feedbackData = {
    overallScore: 42,
    recommendation: "MAYBE",
    summary:
      "Tanish demonstrates solid technical knowledge of OOP principles but struggles with deeper explanations and providing concrete examples when pressed for details.",
    categoryScores: {
      communication: 7,
      technical: 6,
      behavioral: 8,
      answerQuality: 6,
      engagement: 7,
      pressureHandling: 5,
    },
    strengths: [
      {
        category: "Technical Knowledge",
        description: "Clear understanding of core OOP principles",
        example:
          "Correctly identified Encapsulation, Inheritance, Polymorphism, and Abstraction as the four pillars",
      },
      {
        category: "Communication",
        description: "Articulate and professional in responses",
        example:
          "Provided structured explanation with practical applications in Spring Boot projects",
      },
      {
        category: "Experience",
        description: "Demonstrates real-world application knowledge",
        example:
          "Mentioned using OOP principles in Java with Spring Boot services and models",
      },
    ],
    improvements: [
      {
        category: "Depth of Explanation",
        issue: "Struggled to provide deeper examples when asked",
        suggestion:
          "Prepare specific code examples demonstrating polymorphism implementation",
        example:
          "Could have explained method overriding vs overloading with concrete code snippets",
      },
      {
        category: "Pressure Handling",
        issue: "Appeared uncertain when asked for deeper dive",
        suggestion:
          "Practice explaining complex concepts step-by-step under pressure",
        example:
          "Take a moment to structure thoughts before responding to complex questions",
      },
    ],
    redFlags: [
      {
        concern: "Incomplete Response",
        impact: "Shows potential knowledge gaps under pressure",
        evidence:
          "Failed to complete the polymorphism explanation when pressed for details",
      },
    ],
    greenFlags: [
      {
        strength: "Professional Demeanor",
        impact: "Maintains composure and politeness throughout",
        evidence: "Responds professionally even when struggling with questions",
      },
      {
        strength: "Practical Experience",
        impact: "Shows real-world application of concepts",
        evidence: "References actual projects with Spring Boot and Java",
      },
    ],
    confidenceLevel: "BALANCED",
    communicationStyle: "APPROPRIATE",
    preparednessLevel: "WELL_PREPARED",
  };

  const getScoreColor = (score) => {
    if (score >= 8) return "text-green-400";
    if (score >= 6) return "text-yellow-400";
    return "text-red-400";
  };

  const getRecommendationColor = (rec) => {
    const colors = {
      STRONG_HIRE: "bg-green-600",
      HIRE: "bg-green-500",
      MAYBE: "bg-yellow-500",
      NO_HIRE: "bg-red-500",
      STRONG_NO_HIRE: "bg-red-600",
    };
    return colors[rec] || "bg-gray-500";
  };

  const ScoreCircle = ({ score, label }) => (
    <div className="flex flex-col items-center p-4 bg-gray-800/50 rounded-lg border border-gray-700">
      <div
        className={`relative w-16 h-16 rounded-full border-4 ${getScoreColor(score)} border-current flex items-center justify-center`}
      >
        <span className={`text-lg font-bold ${getScoreColor(score)}`}>
          {score}
        </span>
      </div>
      <span className="text-sm text-gray-300 mt-2 text-center">{label}</span>
    </div>
  );

  const TabButton = ({ id, label, icon: Icon, active, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
        active
          ? "bg-blue-600 text-white"
          : "text-gray-400 hover:text-white hover:bg-gray-700"
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-white">
              Interview Feedback
            </h1>
            <div
              className={`px-4 py-2 rounded-full text-white font-semibold ${getRecommendationColor(feedbackData.recommendation)}`}
            >
              {feedbackData.recommendation.replace("_", " ")}
            </div>
          </div>
          <p className="text-gray-300 text-lg">{feedbackData.summary}</p>
        </div>

        {/* Overall Score Card */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Overall Performance
              </h2>
              <div className="flex items-center space-x-4">
                <div className="text-4xl font-bold text-blue-400">
                  {feedbackData.overallScore}/60
                </div>
                <div className="text-gray-400">
                  <div>
                    Confidence: {feedbackData.confidenceLevel.replace("_", " ")}
                  </div>
                  <div>Communication: {feedbackData.communicationStyle}</div>
                  <div>
                    Preparedness:{" "}
                    {feedbackData.preparednessLevel.replace("_", " ")}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400 mb-2">
                Java OOP Developer Position
              </div>
              <div className="text-sm text-gray-400">Tanish Valesha</div>
            </div>
          </div>
        </div>

        {/* Category Scores */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
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
        <div className="flex space-x-2 mb-6 overflow-x-auto">
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
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold flex items-center">
                <User className="mr-2" size={20} />
                Performance Overview
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-green-400">
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
                        <span className="capitalize">
                          {category.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                        <span className={`font-bold ${getScoreColor(score)}`}>
                          {score}/10
                        </span>
                      </div>
                    ))}
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-yellow-400">
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
                        <span className="capitalize">
                          {category.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                        <span className={`font-bold ${getScoreColor(score)}`}>
                          {score}/10
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "strengths" && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold flex items-center text-green-400">
                <CheckCircle className="mr-2" size={20} />
                Key Strengths
              </h3>
              {feedbackData.strengths.map((strength, index) => (
                <div
                  key={index}
                  className="bg-green-900/20 border border-green-700 rounded-lg p-4"
                >
                  <h4 className="font-semibold text-green-400 mb-2">
                    {strength.category}
                  </h4>
                  <p className="text-gray-300 mb-3">{strength.description}</p>
                  <div className="bg-gray-700/50 rounded p-3">
                    <span className="text-sm text-gray-400">Example: </span>
                    <span className="text-gray-200 italic">
                      "{strength.example}"
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "improvements" && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold flex items-center text-yellow-400">
                <TrendingUp className="mr-2" size={20} />
                Areas for Improvement
              </h3>
              {feedbackData.improvements.map((improvement, index) => (
                <div
                  key={index}
                  className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4"
                >
                  <h4 className="font-semibold text-yellow-400 mb-2">
                    {improvement.category}
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-400">Issue: </span>
                      <span className="text-gray-300">{improvement.issue}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-400">
                        Suggestion:{" "}
                      </span>
                      <span className="text-gray-300">
                        {improvement.suggestion}
                      </span>
                    </div>
                    <div className="bg-gray-700/50 rounded p-3">
                      <span className="text-sm text-gray-400">
                        Better Approach:{" "}
                      </span>
                      <span className="text-gray-200 italic">
                        "{improvement.example}"
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "flags" && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold flex items-center">
                <AlertTriangle className="mr-2" size={20} />
                Key Insights
              </h3>

              {feedbackData.redFlags.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-red-400 flex items-center">
                    <XCircle className="mr-2" size={18} />
                    Areas of Concern
                  </h4>
                  {feedbackData.redFlags.map((flag, index) => (
                    <div
                      key={index}
                      className="bg-red-900/20 border border-red-700 rounded-lg p-4"
                    >
                      <h5 className="font-semibold text-red-400 mb-2">
                        {flag.concern}
                      </h5>
                      <p className="text-gray-300 mb-2">{flag.impact}</p>
                      <div className="bg-gray-700/50 rounded p-3">
                        <span className="text-sm text-gray-400">
                          Evidence:{" "}
                        </span>
                        <span className="text-gray-200 italic">
                          "{flag.evidence}"
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-4">
                <h4 className="font-semibold text-green-400 flex items-center">
                  <Star className="mr-2" size={18} />
                  Positive Highlights
                </h4>
                {feedbackData.greenFlags.map((flag, index) => (
                  <div
                    key={index}
                    className="bg-green-900/20 border border-green-700 rounded-lg p-4"
                  >
                    <h5 className="font-semibold text-green-400 mb-2">
                      {flag.strength}
                    </h5>
                    <p className="text-gray-300 mb-2">{flag.impact}</p>
                    <div className="bg-gray-700/50 rounded p-3">
                      <span className="text-sm text-gray-400">Evidence: </span>
                      <span className="text-gray-200 italic">
                        "{flag.evidence}"
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Items */}
        <div className="mt-8 bg-blue-900/20 border border-blue-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-blue-400 mb-4 flex items-center">
            <Target className="mr-2" size={20} />
            Next Steps
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-blue-300 mb-3">
                Immediate Actions
              </h4>
              <ul className="space-y-2 text-gray-300">
                <li>• Practice explaining polymorphism with code examples</li>
                <li>• Prepare STAR format stories for behavioral questions</li>
                <li>• Review common OOP design patterns</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-300 mb-3">
                Long-term Development
              </h4>
              <ul className="space-y-2 text-gray-300">
                <li>• Build portfolio with OOP design examples</li>
                <li>• Practice technical presentations</li>
                <li>• Study system design principles</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-300 mb-3">
                Interview Strategy
              </h4>
              <ul className="space-y-2 text-gray-300">
                <li>• Take time to structure complex answers</li>
                <li>• Ask clarifying questions when uncertain</li>
                <li>• Practice under timed conditions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewFeedbackDashboard;
