import React, { useState, useEffect } from "react";
import { useMediaDevices } from "../hooks/useMediaDevices";
import CameraTest from "../components/CameraTest";
import MicrophoneTest from "../components/MicrophoneTest";
import { ArrowRight, Loader } from "lucide-react";
import { Button } from "./ui/button";

const DeviceTest: React.FC<{
  onComplete: () => void;
  className?: string;
}> = ({ onComplete, className = "" }) => {
  const {
    audioDevices,
    videoDevices,
    selectedAudioDevice,
    selectedVideoDevice,
    setSelectedAudioDevice,
    setSelectedVideoDevice,
    permissionState,
    requestPermissions,
  } = useMediaDevices();

  const [isReady, setIsReady] = useState(false);

  // Request permissions when component mounts
  useEffect(() => {
    requestPermissions();
  }, [requestPermissions]);

  // Determine if user is ready to proceed
  useEffect(() => {
    setIsReady(
      permissionState.audio &&
        permissionState.video &&
        !!selectedAudioDevice &&
        !!selectedVideoDevice
    );
  }, [permissionState, selectedAudioDevice, selectedVideoDevice]);

  if (permissionState.loading) {
    return (
      <div className="flex justify-center items-center animate-spin text-white ">
        <Loader className="w-7 h-7" />
      </div>
    );
  }

  if (permissionState.error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-transparent rounded-lg shadow-md">
        <div className="w-16 h-16 flex items-center justify-center bg-red-100 rounded-full mb-4">
          <span className="text-red-500 text-2xl">!</span>
        </div>
        <h3 className="text-lg font-medium text-white mb-2">
          Permission Error
        </h3>
        <p className="text-gray-500 text-center mb-4">
          {permissionState.error ||
            "We need permission to access your camera and microphone for the interview."}
        </p>
        <Button
          onClick={requestPermissions}
          className="bg-white text-black hover:bg-gray-100"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg shadow-lg overflow-hidden max-w-4xl w-full ${className}`}
    >
      <div className="bg-neutral-900 px-6 py-4 border-b border-neutral-800">
        <h2 className="text-xl font-semibold text-white">Test Your Devices</h2>
        <p className="text-blue-100">
          Make sure your camera and microphone are working properly before the
          interview
        </p>
      </div>

      <div className="p-6 bg-neutral-900">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <CameraTest
            devices={videoDevices}
            selectedDevice={selectedVideoDevice}
            onDeviceChange={setSelectedVideoDevice}
          />

          <MicrophoneTest
            devices={audioDevices}
            selectedDevice={selectedAudioDevice}
            onDeviceChange={setSelectedAudioDevice}
          />
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            onClick={onComplete}
            disabled={!isReady}
            className="bg-white text-black hover:bg-gray-100"
            // className={`f${
            //   isReady
            //     ? "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
            //     : "bg-gray-400 cursor-not-allowed"
            // }`}
          >
            Continue to Interview
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeviceTest;
