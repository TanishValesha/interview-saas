"use client";

import React, { useState, use } from "react";
import DeviceTest from "../../../../components/DeviceTest";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SetupPagepp({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [testCompleted, setTestCompleted] = useState(false);
  const router = useRouter();
  const { id } = use(params);
  const handleDeviceTestComplete = () => {
    setTestCompleted(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 mt-14 sm:mt-0">
      {!testCompleted ? (
        <DeviceTest onComplete={handleDeviceTestComplete} />
      ) : (
        <div className="bg-transparent border-transparent rounded-lg shadow-lg p-8 max-w-lg w-full text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Ready for Your Interview
          </h1>
          <p className="text-gray-600 mb-6">
            Your camera and microphone are set up and working properly.
            You&apos;re all set to begin your interview!
          </p>
          <Button
            className="bg-white text-black hover:bg-gray-200"
            onClick={() => {
              router.push(`/dashboard/mock/${id}`);
            }}
          >
            Start Interview
          </Button>
        </div>
      )}
    </div>
  );
}
