import React from "react";
import { cn } from "@/lib/utils";

interface ProgressCircleProps {
  progress: number;
  size?: "sm" | "md" | "lg";
  color?: "teal" | "yellow" | "blue" | "coral" | "purple";
  children?: React.ReactNode;
  className?: string;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({ 
  progress, 
  size = "md", 
  color = "teal", 
  children, 
  className 
}) => {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-20 h-20", 
    lg: "w-24 h-24"
  };

  const strokeWidth = size === "sm" ? 4 : size === "md" ? 5 : 6;
  const radius = size === "sm" ? 26 : size === "md" ? 32.5 : 39;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const colorClasses = {
    teal: "text-health-teal",
    yellow: "text-health-yellow", 
    blue: "text-health-blue",
    coral: "text-health-coral",
    purple: "text-health-purple"
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center", sizeClasses[size], className)}>
      <svg 
        className="transform -rotate-90 w-full h-full"
        viewBox={`0 0 ${size === "sm" ? 60 : size === "md" ? 75 : 90} ${size === "sm" ? 60 : size === "md" ? 75 : 90}`}
      >
        {/* Background circle */}
        <circle
          cx={size === "sm" ? 30 : size === "md" ? 37.5 : 45}
          cy={size === "sm" ? 30 : size === "md" ? 37.5 : 45}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-muted/20"
        />
        {/* Progress circle */}
        <circle
          cx={size === "sm" ? 30 : size === "md" ? 37.5 : 45}
          cy={size === "sm" ? 30 : size === "md" ? 37.5 : 45}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn("transition-all duration-500 ease-in-out", colorClasses[color])}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (
          <span className={cn("font-bold", 
            size === "sm" ? "text-sm" : size === "md" ? "text-base" : "text-lg",
            colorClasses[color]
          )}>
            {progress}%
          </span>
        )}
      </div>
    </div>
  );
};

export default ProgressCircle;