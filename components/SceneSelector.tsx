import React from 'react';
import type { Scene } from '../types';

interface SceneSelectorProps {
  scenes: Scene[];
  selectedScene: Scene | null;
  onSceneSelect: (scene: Scene) => void;
}

export const SceneSelector: React.FC<SceneSelectorProps> = ({ scenes, selectedScene, onSceneSelect }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {scenes.map((scene) => (
        <div
          key={scene.id}
          onClick={() => onSceneSelect(scene)}
          className={`relative rounded-lg overflow-hidden cursor-pointer group transition-all duration-300 ${
            selectedScene?.id === scene.id ? 'ring-4 ring-cyan-500' : 'ring-2 ring-transparent hover:ring-cyan-400'
          }`}
        >
          <img
            src={scene.previewImage}
            alt={scene.name}
            className="w-full h-32 object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-30 transition-all duration-300 flex items-end p-2">
            <p className="text-white font-semibold text-sm">{scene.name}</p>
          </div>
        </div>
      ))}
    </div>
  );
};