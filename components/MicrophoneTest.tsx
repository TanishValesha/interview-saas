import React, { useRef, useEffect, useState } from "react";
import DeviceSelector from "../components/DeviceSelector";
import VolumeIndicator from "./VolumeIndicator";
import { Mic } from "lucide-react";

interface MicrophoneTestProps {
  devices: MediaDeviceInfo[];
  selectedDevice: string | null;
  onDeviceChange: (deviceId: string) => void;
}

const MicrophoneTest: React.FC<MicrophoneTestProps> = ({
  devices,
  selectedDevice,
  onDeviceChange,
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [volume, setVolume] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const startMicrophone = async () => {
    if (!selectedDevice) return;

    // Clean up previous stream if it exists
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    // Clean up audio processing
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
      analyserRef.current = null;
    }

    // Clean up animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    setIsLoading(true);
    setError(null);

    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: { exact: selectedDevice } },
      });

      setStream(newStream);

      // Create audio context for volume analysis
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(newStream);
      const analyser = audioContext.createAnalyser();
      analyserRef.current = analyser;

      analyser.fftSize = 256;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      // Function to continually update volume level
      const updateVolume = () => {
        if (!analyserRef.current) return;

        analyserRef.current.getByteFrequencyData(dataArray);

        // Calculate average volume level
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;

        // Normalize to 0-100 range
        setVolume(Math.min(100, average / 2.55));

        animationFrameRef.current = requestAnimationFrame(updateVolume);
      };

      updateVolume();
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError(
        "Could not access microphone. Please check permissions and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Start microphone when selected device changes
  useEffect(() => {
    if (selectedDevice) {
      startMicrophone();
    }

    // Cleanup on unmount
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      if (audioContextRef.current) {
        audioContextRef.current.close();
      }

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [selectedDevice]);

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-medium text-white mb-2 flex items-center">
        <Mic className="mr-2 h-5 w-5 text-white" />
        Microphone Test
      </h3>

      <div className="bg-neutral-900 rounded-lg p-6 mb-4 flex flex-col items-center justify-center min-h-[200px]">
        {isLoading ? (
          <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"></div>
        ) : error ? (
          <div className="text-center">
            <p className="text-red-500 mb-2">{error}</p>
            <button
              onClick={startMicrophone}
              className="px-4 py-2 bg-neutral-900 text-white rounde"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <VolumeIndicator volume={volume} />
            <p className="text-sm text-gray-500 mt-4 text-center">
              {volume < 10
                ? "No sound detected. Please speak into your microphone."
                : volume < 30
                ? "Sound detected. Speak a bit louder to test your microphone properly."
                : "Good! Your microphone is working correctly."}
            </p>
          </>
        )}
      </div>

      <DeviceSelector
        label="Select microphone"
        devices={devices}
        selectedDevice={selectedDevice}
        onDeviceChange={onDeviceChange}
        className="mt-auto"
      />
    </div>
  );
};

export default MicrophoneTest;
