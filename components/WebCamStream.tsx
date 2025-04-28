"use client";
import { useMediaDevices } from "@/hooks/useMediaDevices";
import React, { useEffect, useRef } from "react";

const WebcamStream = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { selectedVideoDevice } = useMediaDevices();
  console.log("selectedVideoDevice", selectedVideoDevice);

  useEffect(() => {
    const startVideo = async () => {
      if (!selectedVideoDevice) return; // make sure a device is selected

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: selectedVideoDevice } },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    };

    startVideo();

    return () => {
      // Cleanup stream when component unmounts or device changes
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [selectedVideoDevice]); // re-run when selected device changes

  return (
    <div className="w-full aspect-video mx-auto border rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-auto object-cover -scale-x-100 aspect-video"
      />
    </div>
  );
};

export default WebcamStream;
