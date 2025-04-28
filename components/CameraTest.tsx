import React, { useRef, useEffect, useState } from "react";
import DeviceSelector from "./DeviceSelector";
import { Camera, RefreshCw } from "lucide-react";

interface CameraTestProps {
  devices: MediaDeviceInfo[];
  selectedDevice: string | null;
  onDeviceChange: (deviceId: string) => void;
}

const CameraTest: React.FC<CameraTestProps> = ({
  devices,
  selectedDevice,
  onDeviceChange,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    if (!selectedDevice) return;

    // Clean up previous stream if it exists
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    setIsLoading(true);
    setError(null);

    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: selectedDevice } },
      });

      setStream(newStream);

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError(
        "Could not access camera. Please check permissions and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Start camera when selected device changes
  useEffect(() => {
    if (selectedDevice) {
      startCamera();
    }

    // Cleanup on unmount
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [selectedDevice]);

  return (
    <div className="flex flex-col h-full ">
      <h3 className="text-lg font-medium text-white mb-2 flex items-center">
        <Camera className="mr-2 h-5 w-5 text-white" />
        Camera Test
      </h3>

      <div className="relative rounded-lg overflow-hidden aspect-video mb-4">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-70">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gray-200 bg-opacity-70">
            <p className="text-red-500 text-center mb-2">{error}</p>
            <button
              onClick={startCamera}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </button>
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover -scale-x-100"
        />
      </div>

      <DeviceSelector
        label="Select camera"
        devices={devices}
        selectedDevice={selectedDevice}
        onDeviceChange={onDeviceChange}
        className="mt-auto"
      />
    </div>
  );
};

export default CameraTest;
