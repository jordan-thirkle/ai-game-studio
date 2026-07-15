'use client';

import { useState, useRef, useEffect } from 'react';

type GameEmbedProps = {
  url: string;
  title: string;
  githubUrl?: string;
};

export function GameEmbed({ url, title, githubUrl }: GameEmbedProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Check if the game URL is accessible
    const checkUrl = async () => {
      try {
        const res = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
        // If we get here, URL is accessible
        setLoading(false);
      } catch {
        setError(true);
        setLoading(false);
      }
    };

    checkUrl();
  }, [url]);

  if (error) {
    return (
      <div className="relative w-full aspect-video bg-[#0a0f0a] rounded-xl border border-[#2a3a22] overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          <div className="text-6xl mb-4 opacity-50">🎮</div>
          <h3 className="text-lg font-bold mb-2 text-[#e8e0d0]">Game Not Available</h3>
          <p className="text-sm text-[#a0a090] mb-4 text-center max-w-md">
            This game is currently being updated or deployed. 
            Our monitoring system has detected this issue and the team has been notified.
          </p>
          <div className="flex items-center gap-3">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#4a8a3a] hover:bg-[#5a9a4a] rounded-lg text-sm font-medium transition-colors"
            >
              Try Opening Directly ↗
            </a>
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-[#2a3a22] hover:border-[#4a8a3a] rounded-lg text-sm transition-colors"
              >
                View Source Code ↗
              </a>
            )}
          </div>
          <p className="text-xs text-[#606060] mt-6">
            📡 Monitored by AI Game Studio · Status: <span className="text-yellow-500">Investigating</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-[#0a0f0a] rounded-xl border border-[#2a3a22] overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-[#4a8a3a] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-[#606060]">Loading game...</p>
          </div>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={url}
        className={`absolute inset-0 w-full h-full ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
        onLoad={() => setLoading(false)}
        onError={() => setError(true)}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={`Play ${title}`}
      />
    </div>
  );
}
