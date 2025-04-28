import React from "react";

interface VolumeIndicatorProps {
  volume: number; // 0-100
}

const VolumeIndicator: React.FC<VolumeIndicatorProps> = ({ volume }) => {
  // Number of bars to display
  const totalBars = 20;
  const activeBars = Math.round((volume / 100) * totalBars);

  // Generate an array of bar heights based on a curve
  const bars = Array.from({ length: totalBars }, (_, i) => {
    // Create a bell curve-like effect
    const position = i / (totalBars - 1); // 0 to 1
    const curve = Math.sin(position * Math.PI);
    const maxHeight = 50; // Max height in pixels
    const height = Math.max(8, Math.round(curve * maxHeight));

    // Determine if this bar should be active based on volume
    const isActive = i < activeBars;

    // Determine color based on position
    let color;
    if (position < 0.4) {
      color = "bg-green-400"; // Lower range (green)
    } else if (position < 0.7) {
      color = "bg-yellow-400"; // Middle range (yellow)
    } else {
      color = "bg-red-400"; // Upper range (red)
    }

    return { height, isActive, color };
  });

  return (
    <div className="flex items-end justify-center space-x-1 h-20 w-full">
      {bars.map((bar, i) => (
        <div
          key={i}
          className={`w-2 rounded-t-sm transition-all duration-100 ${
            bar.isActive ? bar.color : "bg-gray-300"
          }`}
          style={{
            height: `${bar.height}px`,
            transform: bar.isActive ? "scaleY(1.05)" : "scaleY(1)",
          }}
        ></div>
      ))}
    </div>
  );
};

export default VolumeIndicator;
