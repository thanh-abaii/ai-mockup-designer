
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { SceneSelector } from './components/SceneSelector';
import { MockupDisplay } from './components/MockupDisplay';
import { Footer } from './components/Footer';
import type { Scene } from './types';
import { generateMockup, generateCreativePrompt } from './services/geminiService';
import { SCENES } from './constants';
import { DownloadIcon } from './components/icons/DownloadIcon';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<{ file: File; base64: string; mimeType: string; } | null>(null);
  const [slogan, setSlogan] = useState<string>('');
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);
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

  const handleGenerateClick = useCallback(async () => {
    if (!originalImage || !selectedScene) {
      setError("Please upload an image and select a scene first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    setLastUsedPrompt(null);

    let finalPrompt = '';

    try {
      // Step 1: Generate a creative prompt
      setLoadingMessage('Brainstorming a creative concept...');
      finalPrompt = await generateCreativePrompt(
        originalImage.base64,
        originalImage.mimeType,
        selectedScene.prompt, // This is now scene context
        slogan
      );
    } catch (err) {
      console.warn("Creative prompt generation failed. Falling back to default prompt.", err);
      // Fallback to the original simple prompt logic
      finalPrompt = selectedScene.prompt;
       if (slogan.trim()) {
        finalPrompt += ` Please also tastefully incorporate the text "${slogan.trim()}" into the advertisement.`;
      }
    }

    setLastUsedPrompt(finalPrompt);

    try {
      // Step 2: Generate the mockup with the (potentially creative) prompt
      setLoadingMessage('Bringing the idea to life...');
      const result = await generateMockup(originalImage.base64, originalImage.mimeType, finalPrompt);
      setGeneratedImage(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during mockup generation.");
    } finally {
      setIsLoading(false);
      setLoadingMessage(null);
    }
  }, [originalImage, selectedScene, slogan]);

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
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">1. Provide Your Assets</h2>
               <div className="flex flex-col gap-4 p-4 bg-gray-800/50 rounded-lg">
                <ImageUploader onImageUpload={handleImageUpload} />
                 <div>
                  <label htmlFor="slogan-input" className="block text-sm font-medium text-gray-300 mb-2">
                    Add Slogan (Optional)
                  </label>
                  <input
                    id="slogan-input"
                    type="text"
                    value={slogan}
                    onChange={(e) => setSlogan(e.target.value)}
                    placeholder="e.g., 'Your slogan here...'"
                    className="w-full bg-gray-700 border-2 border-gray-600 rounded-lg py-2 px-3 text-white placeholder-gray-400 focus:ring-cyan-500 focus:border-cyan-500 transition"
                  />
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">2. Select a Scene</h2>
              <SceneSelector
                scenes={SCENES}
                selectedScene={selectedScene}
                onSceneSelect={handleSceneSelect}
              />
            </div>
            <button
              onClick={handleGenerateClick}
              disabled={!originalImage || !selectedScene || isLoading}
              className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 px-4 rounded-lg transition-all duration-300 ease-in-out shadow-lg hover:shadow-cyan-500/50 text-xl"
            >
              {isLoading ? 'Generating...' : '3. Create Mockup'}
            </button>
          </div>

          {/* Right Column: Display */}
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-cyan-400">Result</h2>
            <MockupDisplay
              isLoading={isLoading}
              loadingMessage={loadingMessage}
              error={error}
              generatedImage={generatedImage}
            />
            {generatedImage && !isLoading && !error && lastUsedPrompt && (
              <div className="p-4 bg-gray-800/50 rounded-lg space-y-2">
                <h3 className="font-semibold text-cyan-400">Prompt Used</h3>
                <p className="text-sm text-gray-300 bg-gray-900/50 p-3 rounded-md font-mono whitespace-pre-wrap break-words">
                  {lastUsedPrompt}
                </p>
              </div>
            )}
            {generatedImage && !isLoading && !error && (
              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out shadow-lg hover:shadow-green-500/50 text-lg"
              >
                <DownloadIcon className="h-6 w-6" />
                <span>Download Mockup</span>
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;