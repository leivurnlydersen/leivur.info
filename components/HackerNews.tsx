'use client';

import { useEffect, useState } from 'react';
import { Flame, ExternalLink } from 'lucide-react';

interface Story {
  id: number;
  title: string;
  url: string;
  score: number;
  by: string;
  time: number;
}

export function HackerNews() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        // Fetch top 10 story IDs
        const topStoriesResponse = await fetch(
          'https://hacker-news.firebaseio.com/v0/topstories.json'
        );
        const storyIds = await topStoriesResponse.json();

        // Fetch details for first 8 stories
        const storyPromises = storyIds.slice(0, 8).map(async (id: number) => {
          const response = await fetch(
            `https://hacker-news.firebaseio.com/v0/item/${id}.json`
          );
          return response.json();
        });

        const storiesData = await Promise.all(storyPromises);
        setStories(storiesData.filter((story) => story && story.url)); // Only show stories with URLs
        setLoading(false);
      } catch (err) {
        setError('Failed to load stories');
        setLoading(false);
      }
    };

    fetchStories();
    // Refresh every 5 minutes
    const interval = setInterval(fetchStories, 300000);
    return () => clearInterval(interval);
  }, []);

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor(Date.now() / 1000 - timestamp);
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const getDomain = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return '';
    }
  };

  if (loading) {
    return (
      <div className="bg-card border border-card-border rounded-lg p-2 col-span-1 sm:col-span-2">
        <div className="flex items-center gap-1 mb-1">
          <Flame className="w-3 h-3 text-muted" />
          <h2 className="text-xs font-semibold">Hacker News</h2>
        </div>
        <div className="h-32 flex items-center justify-center">
          <div className="text-muted text-xs">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || stories.length === 0) {
    return (
      <div className="bg-card border border-card-border rounded-lg p-2 col-span-1 sm:col-span-2">
        <div className="flex items-center gap-1 mb-1">
          <Flame className="w-3 h-3 text-muted" />
          <h2 className="text-xs font-semibold">Hacker News</h2>
        </div>
        <div className="h-32 flex items-center justify-center">
          <div className="text-muted text-xs">{error || 'No stories'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-card-border rounded-lg p-2 col-span-1 sm:col-span-2 hover:border-accent/50 transition-colors">
      <div className="flex items-center gap-1 mb-1.5">
        <Flame className="w-3 h-3 text-orange-500" />
        <h2 className="text-xs font-semibold">Hacker News - Top Stories</h2>
      </div>

      <div className="space-y-1.5">
        {stories.slice(0, 8).map((story) => (
          <a
            key={story.id}
            href={story.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <div className="flex items-start gap-1">
              <ExternalLink className="w-3 h-3 text-muted mt-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium group-hover:text-accent transition-colors line-clamp-2 leading-snug">
                  {story.title}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted">{story.score} points</span>
                  <span className="text-xs text-muted">•</span>
                  <span className="text-xs text-muted">{getTimeAgo(story.time)}</span>
                  <span className="text-xs text-muted">•</span>
                  <span className="text-xs text-muted truncate">{getDomain(story.url)}</span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
