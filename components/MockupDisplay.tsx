
import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface MockupDisplayProps {
  isLoading: boolean;
  loadingMessage: string | null;
  error: string | null;
  generatedImage: string | null;
}

export const MockupDisplay: React.FC<MockupDisplayProps> = ({ isLoading, loadingMessage, error, generatedImage }) => {
  const renderContent = () => {
    if (isLoading) {
      return (
          <div className="flex flex-col items-center justify-center gap-4">
            <LoadingSpinner />
            <p className="text-cyan-300">{loadingMessage || 'Generating your masterpiece...'}</p>
            <p className="text-sm text-gray-400">This can take a moment.</p>
          </div>
      );
    }

    if (error) {
      return (
        <div className="text-center text-red-400 p-4 border border-red-400 bg-red-900/20 rounded-lg">
          <p className="font-bold">An Error Occurred</p>
          <p className="text-sm">{error}</p>
        </div>
      );
    }

    if (generatedImage) {
      return (
        <img
          src={`data:image/png;base64,${generatedImage}`}
          alt="Generated Mockup"
          className="w-full h-full object-contain rounded-lg shadow-2xl"
        />
      );
    }

    return (
      <div className="text-center text-gray-500">
        <div className="text-5xl mb-4">✨</div>
        <p className="font-semibold">Your mockup will appear here</p>
        <p className="text-sm">Upload an image and select a scene to get started.</p>
      </div>
    );
  };

  return (
    <div className="w-full aspect-square bg-gray-800 rounded-lg flex items-center justify-center p-4 border-2 border-dashed border-gray-700">
      {renderContent()}
    </div>
  );
};
