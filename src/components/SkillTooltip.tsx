'use client';

import { useState } from 'react';

interface SkillTooltipProps {
  skillName: string;
  description?: string[];
  children: React.ReactNode;
}

export function SkillTooltip({ skillName, description, children }: SkillTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Don't show tooltip if no description
  if (!description || description.length === 0) {
    return <>{children}</>;
  }

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      
      {isVisible && (
        <div className="absolute z-50 w-80 p-4 mt-2 bg-gray-900 text-white rounded-lg shadow-lg border border-gray-700">
          <div className="absolute -top-2 left-4 w-4 h-4 bg-gray-900 transform rotate-45 border-l border-t border-gray-700"></div>
          
          <h3 className="font-semibold text-lg mb-3 text-blue-300">{skillName}</h3>
          
          <ul className="space-y-2">
            {description.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-400 mr-2 mt-1">•</span>
                <span className="text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
