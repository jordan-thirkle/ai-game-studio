'use client';

import { useState } from 'react';

export function ShareButton({ text, url, small = false }: { text: string; url: string; small?: boolean }) {
  const [copied, setCopied] = useState(false);

  const shareToX = () => {
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(tweetUrl, '_blank', 'width=600,height=400');
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(`${text}\n\n${url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (small) {
    return (
      <button
        onClick={shareToX}
        className="px-3 py-2 border border-[#2a3a22] hover:border-[#1da1f2] rounded-lg text-sm transition-colors"
        title="Share on X"
      >
        𝕏
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={shareToX}
        className="px-4 py-2 bg-[#1da1f2] hover:bg-[#0d8bd9] rounded-lg text-sm font-medium text-white transition-colors"
      >
        Share on 𝕏
      </button>
      <button
        onClick={copyLink}
        className="px-4 py-2 border border-[#2a3a22] hover:border-[#4a8a3a] rounded-lg text-sm transition-colors"
      >
        {copied ? '✓ Copied' : 'Copy Link'}
      </button>
    </div>
  );
}
