"use client";
import React from "react";
import { Spotlight } from "@/components/ui/spotlight-new";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Rocket } from "lucide-react";
import { FeaturesSectionDemo } from "@/components/Features";
import Header from "@/components/Header";
import FeaturesMobile from "@/components/FeaturesMobile";

const words = `Your Personal AI Interview Coach — Available 24/7`;

export default function SpotlightNewDemo() {
  return (
    <div className="w-full bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-auto overflow-x-hidden">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <div className="w-full py-10 rounded-md flex items-center justify-center relative px-4 sm:px-0 sm:py-28 sm:mt-10">
        <Spotlight />
        <div className="px-4 max-w-7xl mx-auto relative z-10 w-full sm:pt-32 md:pt-0">
          <div className="flex flex-col items-center text-center">
            <div className="w-full max-w-4xl sm:mt-0 mt-24">
              <TextGenerateEffect words={words} />
            </div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
              className="mt-4 sm:mt-6 font-normal text-sm sm:text-base lg:text-lg text-neutral-300 max-w-xs sm:max-w-lg lg:max-w-xl text-center mx-auto px-2 sm:px-0 leading-relaxed"
            >
              Prepare for job interviews anytime, anywhere. No awkward
              scheduling or human judgment. Just AI-driven, personalized
              practice sessions that help you improve with every round.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.8, ease: "easeOut" }}
              className="mt-6 sm:mt-10 sm:mb-10 w-full max-w-md sm:max-w-sm mx-auto"
            >
              <Button className="text-black bg-white text-sm sm:text-md hover:bg-neutral-300 font-semibold px-6 py-4 sm:px-8 sm:py-5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 flex items-center gap-2 w-full">
                <Rocket className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Get Started</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.8, ease: "easeOut" }}
        className="w-full px-4 sm:hidden"
      >
        <div className="max-w-sm mx-auto">
          <FeaturesMobile />
        </div>
      </motion.div>

      {/* Desktop Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 1.0, ease: "easeOut" }}
        className="w-full mt-[-80px] sm:mt-[-120px] lg:mt-[-175px] px-4 sm:px-6 lg:px-8 hidden sm:block"
      >
        <FeaturesSectionDemo />
      </motion.div>
    </div>
  );
}
