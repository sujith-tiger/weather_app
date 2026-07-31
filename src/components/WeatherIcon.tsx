import React from "react";
import * as Icons from "lucide-react";

interface WeatherIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ name, className = "w-6 h-6", size }) => {
  const IconComponent = (Icons as Record<string, any>)[name] || Icons.Cloud;
  return <IconComponent className={className} size={size} />;
};
