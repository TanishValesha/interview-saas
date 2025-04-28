import { useState, useEffect, useCallback } from "react";

interface PermissionState {
  loading: boolean;
  audio: boolean;
  video: boolean;
  error: string | null;
}

export const useMediaDevices = () => {
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState<string | null>(
    null
  );
  const [selectedVideoDevice, setSelectedVideoDevice] = useState<string | null>(
    null
  );
  const [permissionState, setPermissionState] = useState<PermissionState>({
    loading: true,
    audio: false,
    video: false,
    error: null,
  });

  // Function to enumerate devices
  const enumerateDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();

      const audioInputs = devices.filter(
        (device) => device.kind === "audioinput"
      );
      const videoInputs = devices.filter(
        (device) => device.kind === "videoinput"
      );

      console.log("Available audio devices:", audioInputs);
      console.log("Available video devices:", videoInputs);

      setAudioDevices(audioInputs);
      setVideoDevices(videoInputs);

      // Set default audio device if available
      if (audioInputs.length > 0) {
        // Try to get device from localStorage first
        const savedAudioDevice = localStorage.getItem("selectedAudioDevice");

        // Check if the saved device still exists
        const audioDeviceExists =
          savedAudioDevice &&
          audioInputs.some((device) => device.deviceId === savedAudioDevice);

        // Only update if not already set or if saved device doesn't exist
        if (!selectedAudioDevice || !audioDeviceExists) {
          const deviceToUse = audioDeviceExists
            ? savedAudioDevice
            : audioInputs[0].deviceId;
          console.log("Setting audio device to:", deviceToUse);
          setSelectedAudioDevice(deviceToUse);
        }
      }

      // Set default video device if available
      if (videoInputs.length > 0) {
        // Try to get device from localStorage first
        const savedVideoDevice = localStorage.getItem("selectedVideoDevice");

        // Check if the saved device still exists
        const videoDeviceExists =
          savedVideoDevice &&
          videoInputs.some((device) => device.deviceId === savedVideoDevice);

        // Only update if not already set or if saved device doesn't exist
        if (!selectedVideoDevice || !videoDeviceExists) {
          const deviceToUse = videoDeviceExists
            ? savedVideoDevice
            : videoInputs[0].deviceId;
          console.log("Setting video device to:", deviceToUse);
          setSelectedVideoDevice(deviceToUse);
        }
      } else {
        console.warn("No video devices detected!");
      }
    } catch (error) {
      console.error("Error enumerating devices:", error);
    }
  }, [selectedAudioDevice, selectedVideoDevice]);

  // Request media permissions and enumerate devices
  const requestPermissions = useCallback(async () => {
    setPermissionState({
      loading: true,
      audio: false,
      video: false,
      error: null,
    });

    try {
      // Request both audio and video permissions
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      // Stop all tracks as we only needed them for permissions
      stream.getTracks().forEach((track) => track.stop());

      setPermissionState({
        loading: false,
        audio: true,
        video: true,
        error: null,
      });

      // Now that we have permissions, enumerate devices
      await enumerateDevices();
    } catch (error: any) {
      console.error("Error requesting permissions:", error);

      // Set appropriate error message
      let errorMessage =
        "An error occurred while requesting device permissions.";

      if (
        error.name === "NotAllowedError" ||
        error.name === "PermissionDeniedError"
      ) {
        errorMessage =
          "Permission to access camera and microphone was denied. Please allow access and try again.";
      } else if (
        error.name === "NotFoundError" ||
        error.name === "DevicesNotFoundError"
      ) {
        errorMessage =
          "No camera or microphone detected. Please connect devices and try again.";
      } else if (
        error.name === "NotReadableError" ||
        error.name === "TrackStartError"
      ) {
        errorMessage =
          "Your camera or microphone is already in use by another application.";
      }

      setPermissionState({
        loading: false,
        audio: false,
        video: false,
        error: errorMessage,
      });
    }
  }, [enumerateDevices]);

  // Make sure we run enumerateDevices on initial load
  useEffect(() => {
    // First check if we already have permissions
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        // If we get labeled devices, we already have permissions
        const hasPermissions = devices.some((device) => device.label !== "");
        if (hasPermissions) {
          setPermissionState({
            loading: false,
            audio: true,
            video: true,
            error: null,
          });
          enumerateDevices();
        } else {
          // We need to request permissions
          requestPermissions();
        }
      })
      .catch((error) => {
        console.error("Error checking device permissions:", error);
        requestPermissions();
      });
  }, [enumerateDevices, requestPermissions]);

  // Save selected devices to localStorage when they change
  useEffect(() => {
    if (selectedAudioDevice) {
      localStorage.setItem("selectedAudioDevice", selectedAudioDevice);
    }
  }, [selectedAudioDevice]);

  useEffect(() => {
    if (selectedVideoDevice) {
      localStorage.setItem("selectedVideoDevice", selectedVideoDevice);
    }
  }, [selectedVideoDevice]);

  // Listen for device changes
  useEffect(() => {
    const handleDeviceChange = () => {
      console.log("Device change detected");
      enumerateDevices();
    };

    navigator.mediaDevices.addEventListener("devicechange", handleDeviceChange);

    return () => {
      navigator.mediaDevices.removeEventListener(
        "devicechange",
        handleDeviceChange
      );
    };
  }, [enumerateDevices]);

  return {
    audioDevices,
    videoDevices,
    selectedAudioDevice,
    selectedVideoDevice,
    setSelectedAudioDevice,
    setSelectedVideoDevice,
    permissionState,
    requestPermissions,
  };
};
