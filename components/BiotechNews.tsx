'use client';

import { useEffect, useState } from 'react';
import { Microscope, ExternalLink } from 'lucide-react';

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
}

export function BiotechNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Using RSS2JSON to fetch biotech news from FierceBiotech
        const rssUrl = 'https://www.fiercebiotech.com/rss/xml';
        const response = await fetch(
          `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&count=8`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch biotech news');
        }

        const data = await response.json();

        if (data.status !== 'ok') {
          throw new Error('RSS feed error');
        }

        const newsItems: NewsItem[] = data.items.map((item: any) => ({
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          source: 'FierceBiotech',
        }));

        setNews(newsItems);
        setLoading(false);
      } catch (err) {
        console.error('Biotech news error:', err);
        setError('Failed to load news');
        setLoading(false);
      }
    };

    fetchNews();
    // Refresh every 30 minutes
    const interval = setInterval(fetchNews, 1800000);
    return () => clearInterval(interval);
  }, []);

  const getTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
      if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
      if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  if (loading) {
    return (
      <div className="bg-card border border-card-border rounded-lg p-2 col-span-1 sm:col-span-2 xl:col-span-1 2xl:col-span-2">
        <div className="flex items-center gap-1 mb-1">
          <Microscope className="w-3 h-3 text-muted" />
          <h2 className="text-xs font-semibold">Biotech News</h2>
        </div>
        <div className="h-32 flex items-center justify-center">
          <div className="text-muted text-xs">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || news.length === 0) {
    return (
      <div className="bg-card border border-card-border rounded-lg p-2 col-span-1 sm:col-span-2 xl:col-span-1 2xl:col-span-2">
        <div className="flex items-center gap-1 mb-1">
          <Microscope className="w-3 h-3 text-muted" />
          <h2 className="text-xs font-semibold">Biotech News</h2>
        </div>
        <div className="h-32 flex items-center justify-center">
          <div className="text-muted text-xs">{error || 'No news'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-card-border rounded-lg p-2 col-span-1 sm:col-span-2 xl:col-span-1 2xl:col-span-2 hover:border-accent/50 transition-colors">
      <div className="flex items-center gap-1 mb-1.5">
        <Microscope className="w-3 h-3 text-blue-500" />
        <h2 className="text-xs font-semibold">Biotech News - FierceBiotech</h2>
      </div>

      <div className="space-y-1.5">
        {news.map((item, index) => (
          <a
            key={index}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <div className="flex items-start gap-1">
              <ExternalLink className="w-3 h-3 text-muted mt-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium group-hover:text-accent transition-colors line-clamp-2 leading-snug">
                  {item.title}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted">{getTimeAgo(item.pubDate)}</span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
