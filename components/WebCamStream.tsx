"use client";
import React, { useEffect, useRef } from "react";

const WebcamStream = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    };

    startVideo();
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto border rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-auto object-cover -scale-x-100"
      />
    </div>
  );
};

export default WebcamStream;
