'use client';

import { useState, useCallback, useEffect } from 'react';
import { Sparkles, Download, RefreshCw, ImageIcon, Zap, AlertCircle, Loader2 } from 'lucide-react';

interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: number;
}

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [needsApiKey, setNeedsApiKey] = useState(false);

  const generateImage = useCallback(async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setModelLoading(true);
    setError(null);
    setNeedsApiKey(false);
    setLoadingMessage('Generating image... Model may be warming up (30-60s on first use)');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          setNeedsApiKey(true);
        }
        throw new Error(data.error || 'Failed to generate image');
      }

      const newImage: GeneratedImage = {
        url: data.image,
        prompt: data.prompt,
        timestamp: Date.now(),
      };

      setGeneratedImage(newImage);
      setHistory((prev) => [newImage, ...prev].slice(0, 10));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate image');
    } finally {
      setLoading(false);
      setModelLoading(false);
      setLoadingMessage('');
    }
  }, [prompt]);

  const downloadImage = useCallback(() => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage.url;
    link.download = `sdxl-turbo-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [generatedImage]);

  const clearHistory = () => {
    setHistory([]);
    setGeneratedImage(null);
  };

  const examplePrompts = [
    'A serene landscape with mountains and a lake at sunset, digital art',
    'Cyberpunk cityscape with neon lights and flying cars, 4k',
    'A cute corgi wearing a wizard hat, magical atmosphere',
    'Abstract geometric patterns in vibrant colors, modern art',
  ];

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              SDXL Turbo
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Generate stunning images instantly with SDXL Turbo via Hugging Face Inference API.
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-yellow-400">1-step inference • Lightning fast</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Enter your prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the image you want to generate..."
                className="w-full h-32 p-4 rounded-xl bg-gray-900 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
              />

              <button
                onClick={generateImage}
                disabled={!prompt.trim() || loading}
                className="w-full mt-4 py-4 px-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 animate-pulse-glow"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Image
                  </>
                )}
              </button>

              {error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}

              {needsApiKey && (
                <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <div>
                      <p className="text-yellow-400 font-medium text-sm mb-2">
                        API Key Required
                      </p>
                      <p className="text-gray-400 text-xs mb-2">
                        Get a free API key at{' '}
                        <a
                          href="https://huggingface.co/settings/tokens"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-violet-400 hover:underline"
                        >
                          huggingface.co/settings/tokens
                        </a>
                      </p>
                      <p className="text-gray-500 text-xs">
                        Then add it to your code or use a backend proxy.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-sm font-medium text-gray-400 mb-3">
                Try these examples
              </h3>
              <div className="space-y-2">
                {examplePrompts.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(example)}
                    className="w-full text-left p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 text-sm text-gray-300 transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 min-h-[400px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-violet-400" />
                  Generated Image
                </h3>
                {generatedImage && (
                  <button
                    onClick={downloadImage}
                    className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                    title="Download image"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-900">
                {loading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-shimmer w-64 h-64 rounded-xl mx-auto mb-4" />
                      {modelLoading && loadingMessage ? (
                        <>
                          <Loader2 className="w-8 h-8 text-violet-400 mx-auto mb-3 animate-spin" />
                          <p className="text-violet-400 font-medium animate-pulse">
                            {loadingMessage}
                          </p>
                          <p className="text-gray-500 text-xs mt-2">
                            This only happens on first use
                          </p>
                        </>
                      ) : (
                        <p className="text-gray-400 animate-pulse">
                          Creating your masterpiece...
                        </p>
                      )}
                    </div>
                  </div>
                ) : generatedImage ? (
                  <img
                    src={generatedImage.url}
                    alt={generatedImage.prompt}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>Your generated image will appear here</p>
                    </div>
                  </div>
                )}
              </div>

              {generatedImage && (
                <p className="mt-4 text-sm text-gray-400 line-clamp-2">
                  <span className="text-violet-400">Prompt:</span>{' '}
                  {generatedImage.prompt}
                </p>
              )}
            </div>

            {history.length > 0 && (
              <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-400">
                    Recent generations
                  </h3>
                  <button
                    onClick={clearHistory}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Clear all
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {history.map((img) => (
                    <button
                      key={img.timestamp}
                      onClick={() => setGeneratedImage(img)}
                      className="aspect-square rounded-lg overflow-hidden hover:ring-2 hover:ring-violet-500 transition-all"
                    >
                      <img
                        src={img.url}
                        alt={img.prompt}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>Powered by Stability AI SDXL Turbo via Hugging Face Inference API</p>
          <p className="mt-2 text-xs">
            Note: Running large AI models in browsers requires WebGPU support and significant memory.
            The Hugging Face Inference API provides free tier access with rate limits.
          </p>
        </footer>
      </div>
    </main>
  );
}
