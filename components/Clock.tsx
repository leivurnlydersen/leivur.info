'use client';

import { useEffect, useState } from 'react';
import { Clock as ClockIcon } from 'lucide-react';

export function Clock() {
  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-card border border-card-border rounded-lg p-2">
        <div className="flex items-center gap-1 mb-1">
          <ClockIcon className="w-3 h-3 text-muted" />
          <h2 className="text-xs font-semibold">Clock</h2>
        </div>
        <div className="h-16 flex items-center justify-center">
          <div className="text-muted text-xs">Loading...</div>
        </div>
      </div>
    );
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-card border border-card-border rounded-lg p-2 hover:border-accent/50 transition-colors">
      <div className="flex items-center gap-1 mb-1">
        <ClockIcon className="w-3 h-3 text-muted" />
        <h2 className="text-xs font-semibold">Clock</h2>
      </div>
      <div className="space-y-0.5">
        <div className="text-2xl font-mono font-bold tracking-tight leading-tight">
          {formatTime(time)}
        </div>
        <div className="text-xs text-muted leading-tight">
          {formatDate(time)}
        </div>
      </div>
    </div>
  );
}
