import React from "react";
import { ChevronDown } from "lucide-react";

interface DeviceSelectorProps {
  label: string;
  devices: MediaDeviceInfo[];
  selectedDevice: string | null;
  onDeviceChange: (deviceId: string) => void;
  className?: string;
}

const DeviceSelector: React.FC<DeviceSelectorProps> = ({
  label,
  devices,
  selectedDevice,
  onDeviceChange,
  className = "",
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-white mb-1">
        {label}
      </label>
      <div className="relative">
        <select
          value={selectedDevice || ""}
          onChange={(e) => onDeviceChange(e.target.value)}
          className="block w-full pl-3 pr-10 py-2 text-base text-white bg-neutral-900 rounded-md shadow-sm appearance-none"
        >
          <option value="" disabled>
            {devices.length === 0 ? "No devices found" : "Select a device"}
          </option>
          {devices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Device ${device.deviceId.substring(0, 8)}...`}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
      {devices.length === 0 && (
        <p className="mt-1 text-sm text-red-500">
          No devices found. Please connect a device and refresh.
        </p>
      )}
    </div>
  );
};

export default DeviceSelector;
