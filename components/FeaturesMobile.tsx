import React from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { Label } from "./ui/label";

const FeaturesMobile = () => {
  const features = [
    {
      title: "Real-Time AI Interview Simulation",
    },
    {
      title: "Role-Specific Question Generation",
    },
    {
      title: "Voice & Text Interaction Modes",
    },
    {
      title: "Smart Follow-Up Questions",
    },
    {
      title: "Practice Anytime, Anywhere",
    },
    {
      title: "Instant Performance Feedback",
    },
    {
      title: "Scenario-Based Questions",
    },
    {
      title: "Generate Questions, Answers and Practice",
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-start gap-3 rounded-lg hover:bg-white/5 transition-colors duration-200"
          >
            <IoMdCheckmarkCircleOutline className="text-white text-xl flex-shrink-0 mt-0.5" />
            <Label className="text-white text-sm sm:text-base leading-relaxed cursor-pointer">
              {feature.title}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesMobile;
