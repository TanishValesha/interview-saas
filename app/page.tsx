"use client";
import React from "react";
import { Spotlight } from "@/components/ui/spotlight-new";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Rocket } from "lucide-react";
import { FeaturesSectionDemo } from "@/components/Features";
import Header from "@/components/Header";

const words = `Your Personal AI Interview Coach — Available 24/7
`;

export default function SpotlightNewDemo() {
  return (
    <div className="w-full bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <div className="h-[40rem] w-full rounded-md flex md:items-center md:justify-center relative">
        <Spotlight />
        <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-32 md:pt-0">
          <div className="flex flex-col items-center">
            <TextGenerateEffect words={words} />
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
              className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto"
            >
              Prepare for job interviews anytime, anywhere. No awkward
              scheduling or human judgment. Just AI-driven, personalized
              practice sessions that help you improve with every round.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.8, ease: "easeOut" }}
              className="mt-8"
            >
              <Button className="text-black bg-white text-md hover:bg-neutral-300 font-semibold px-8 py-5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0">
                <span>
                  <Rocket />
                </span>
                Get Started
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 1.0, ease: "easeOut" }}
        className="w-full mt-[-175px]"
      >
        <FeaturesSectionDemo />
      </motion.div>
    </div>
  );
}
