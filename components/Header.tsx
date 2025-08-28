
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm shadow-lg w-full">
      <div className="container mx-auto px-4 py-4 flex items-center gap-4">
        <div className="text-3xl">🖼️</div>
        <h1 className="text-2xl font-bold text-white tracking-wider">
          AI <span className="text-cyan-400">Mockup Designer</span>
        </h1>
      </div>
    </header>
  );
};
