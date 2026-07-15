'use client';

import { useState, useEffect } from 'react';

type Status = 'operational' | 'degraded' | 'down';

type StatusInfo = {
  status: Status;
  affected: string;
  message: string;
  eta?: string;
};

export function StatusBanner() {
  const [status, setStatus] = useState<StatusInfo | null>(null);

  useEffect(() => {
    // In production, this would fetch from /api/status
    // For now, check if game embed is working
    const checkStatus = async () => {
      try {
        const res = await fetch('https://whisperwood-v2.vercel.app', { 
          method: 'HEAD',
          mode: 'no-cors'
        });
        // If we get here, game is up
        setStatus(null);
      } catch {
        setStatus({
          status: 'degraded',
          affected: 'Whisperwood game embed',
          message: 'The game is currently being updated. Check back soon!',
        });
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  if (!status) return null;

  const bgColor = status.status === 'down' 
    ? 'bg-red-500/10 border-red-500/20' 
    : 'bg-yellow-500/10 border-yellow-500/20';
  
  const textColor = status.status === 'down' 
    ? 'text-red-500' 
    : 'text-yellow-500';

  const icon = status.status === 'down' ? '🔴' : '⚠️';

  return (
    <div className={`${bgColor} border-b px-4 py-2 text-center`}>
      <p className={`text-sm ${textColor}`}>
        {icon} {status.message}
        {status.eta && (
          <span className="ml-2 text-xs opacity-75">
            ETA: {status.eta}
          </span>
        )}
        <a href="/status" className="ml-2 underline hover:no-underline">
          View status →
        </a>
      </p>
    </div>
  );
}
