
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { SceneSelector } from './components/SceneSelector';
import { MockupDisplay } from './components/MockupDisplay';
import { Footer } from './components/Footer';
import type { Scene } from './types';
import { generateMockup, describeImage, generateCreativePrompt } from './services/geminiService';
import { SCENES, ASPECT_RATIOS } from './constants';
import { DownloadIcon } from './components/icons/DownloadIcon';
import { AspectRatioSelector } from './components/AspectRatioSelector';
import { padImageToAspectRatio } from './utils/imageUtils';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<{ file: File; base64: string; mimeType: string; } | null>(null);
  const [slogan, setSlogan] = useState<string>('');
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<string>('1:1');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUsedPrompt, setLastUsedPrompt] = useState<string | null>(null);

  const handleImageUpload = (file: File, base64: string, mimeType: string) => {
    setOriginalImage({ file, base64, mimeType });
    setGeneratedImage(null);
    setError(null);
  };

  const handleSceneSelect = (scene: Scene) => {
    setSelectedScene(scene);
    setGeneratedImage(null);
    setError(null);
  };

  const handleAspectRatioSelect = (ratio: string) => {
    setSelectedAspectRatio(ratio);
    setGeneratedImage(null);
    setError(null);
  };

  const handleGenerateClick = useCallback(async () => {
    if (!originalImage || !selectedScene) {
      setError("Please upload an image and select a scene first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    setLastUsedPrompt(null);

    try {
      // New Step 1: Analyze the input image
      setLoadingMessage('Analyzing your image...');
      const imageDescription = await describeImage(originalImage.base64, originalImage.mimeType);
      
      // New Step 2: Generate a creative prompt
      setLoadingMessage('Brainstorming a creative concept...');
      const creativePrompt = await generateCreativePrompt(imageDescription, selectedScene.prompt, slogan);
      setLastUsedPrompt(creativePrompt);

      // Step 3: Pad the image to the correct aspect ratio on the client-side
      setLoadingMessage('Preparing image for AI...');
      const { base64: paddedBase64, mimeType: paddedMimeType } = await padImageToAspectRatio(
        originalImage.base64,
        originalImage.mimeType,
        selectedAspectRatio
      );

      // Step 4: Generate the mockup with the padded image and new creative prompt
      setLoadingMessage('Generating the mockup scene...');
      const result = await generateMockup(paddedBase64, paddedMimeType, creativePrompt);
      setGeneratedImage(result);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during mockup generation.");
    } finally {
      setIsLoading(false);
      setLoadingMessage(null);
    }
  }, [originalImage, selectedScene, slogan, selectedAspectRatio]);

  const handleDownload = useCallback(() => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${generatedImage}`;
    link.download = 'ai-mockup.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [generatedImage]);


  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Controls */}
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="text-xl font-bold mb-3 text-cyan-400">1. Upload Your Image</h2>
              <ImageUploader onImageUpload={handleImageUpload} />
            </div>

            <div>
              <h2 className="text-xl font-bold mb-3 text-cyan-400">2. Add a Slogan (Optional)</h2>
              <input
                type="text"
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
                placeholder="e.g., 'Freshly Brewed Daily'"
                className="w-full bg-gray-800 border-2 border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                aria-label="Slogan for the mockup"
              />
            </div>

            <div>
              <h2 className="text-xl font-bold mb-3 text-cyan-400">3. Choose a Scene</h2>
              <SceneSelector scenes={SCENES} selectedScene={selectedScene} onSceneSelect={handleSceneSelect} />
            </div>
            
            <div>
                <h2 className="text-xl font-bold mb-3 text-cyan-400">4. Choose Aspect Ratio</h2>
                <AspectRatioSelector ratios={ASPECT_RATIOS} selectedRatio={selectedAspectRatio} onRatioSelect={handleAspectRatioSelect}/>
            </div>

            <button
              onClick={handleGenerateClick}
              disabled={isLoading || !originalImage || !selectedScene}
              className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 text-lg shadow-lg hover:shadow-cyan-500/30 disabled:shadow-none flex items-center justify-center gap-2"
            >
              {isLoading ? 'Creating...' : 'Create Mockup'}
            </button>
          </div>

          {/* Right Column: Display */}
          <div className="flex flex-col gap-4 items-center">
            <MockupDisplay
              isLoading={isLoading}
              loadingMessage={loadingMessage}
              error={error}
              generatedImage={generatedImage}
              aspectRatio={selectedAspectRatio}
            />
            {generatedImage && !isLoading && (
               <button onClick={handleDownload} className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-5 rounded-lg transition-colors">
                <DownloadIcon className="w-5 h-5" />
                Download
              </button>
            )}
             {lastUsedPrompt && !isLoading && !error && (
              <div className="w-full mt-4 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-300 mb-2">AI Prompt Used:</h3>
                <p className="text-xs text-gray-400 font-mono">{lastUsedPrompt}</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
