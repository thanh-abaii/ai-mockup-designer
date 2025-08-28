import React from 'react';

interface AspectRatioSelectorProps {
  ratios: string[];
  selectedRatio: string;
  onRatioSelect: (ratio: string) => void;
}

export const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ ratios, selectedRatio, onRatioSelect }) => {
  return (
    <div className="flex flex-wrap gap-3">
      {ratios.map((ratio) => (
        <button
          key={ratio}
          onClick={() => onRatioSelect(ratio)}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 border-2 ${
            selectedRatio === ratio
              ? 'bg-cyan-500 border-cyan-500 text-white shadow-md shadow-cyan-500/30'
              : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-cyan-400 hover:text-white'
          }`}
        >
          {ratio}
        </button>
      ))}
    </div>
  );
};
