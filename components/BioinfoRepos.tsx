'use client';

import { useEffect, useState } from 'react';
import { Dna, Star, GitFork } from 'lucide-react';

interface Repository {
  name: string;
  owner: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  language: string;
  languageColor: string;
}

export function BioinfoRepos() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        // Search for bioinformatics-related repositories
        // Using keywords in description/readme instead of topics
        const response = await fetch(
          `https://api.github.com/search/repositories?q=bioinformatics+genomics+in:description,readme&sort=stars&order=desc&per_page=6`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch bioinformatics repos');
        }

        const data = await response.json();

        const reposData: Repository[] = data.items.map((item: any) => ({
          name: item.name,
          owner: item.owner.login,
          description: item.description || 'No description',
          url: item.html_url,
          stars: item.stargazers_count,
          forks: item.forks_count,
          language: item.language || 'Unknown',
          languageColor: getLanguageColor(item.language),
        }));

        setRepos(reposData);
        setLoading(false);
      } catch (err) {
        console.error('Bioinformatics repos error:', err);
        setError('Failed to load repos');
        setLoading(false);
      }
    };

    fetchRepos();
    // Refresh every 30 minutes
    const interval = setInterval(fetchRepos, 1800000);
    return () => clearInterval(interval);
  }, []);

  const getLanguageColor = (language: string | null): string => {
    const colors: Record<string, string> = {
      Python: '#3572A5',
      R: '#198CE7',
      Java: '#b07219',
      'C++': '#f34b7d',
      C: '#555555',
      Rust: '#dea584',
      Julia: '#a270ba',
      Perl: '#0298c3',
      Shell: '#89e051',
      JavaScript: '#f1e05a',
    };
    return colors[language || ''] || '#8b949e';
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="bg-card border border-card-border rounded-lg p-2 col-span-1 sm:col-span-2 xl:col-span-1 2xl:col-span-2">
        <div className="flex items-center gap-1 mb-1">
          <Dna className="w-3 h-3 text-muted" />
          <h2 className="text-xs font-semibold">Bioinformatics</h2>
        </div>
        <div className="h-32 flex items-center justify-center">
          <div className="text-muted text-xs">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || repos.length === 0) {
    return (
      <div className="bg-card border border-card-border rounded-lg p-2 col-span-1 sm:col-span-2 xl:col-span-1 2xl:col-span-2">
        <div className="flex items-center gap-1 mb-1">
          <Dna className="w-3 h-3 text-muted" />
          <h2 className="text-xs font-semibold">Bioinformatics</h2>
        </div>
        <div className="h-32 flex items-center justify-center">
          <div className="text-muted text-xs">{error || 'No repos'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-card-border rounded-lg p-2 col-span-1 sm:col-span-2 xl:col-span-1 2xl:col-span-2 hover:border-accent/50 transition-colors">
      <div className="flex items-center gap-1 mb-1.5">
        <Dna className="w-3 h-3 text-green-500" />
        <h2 className="text-xs font-semibold">Bioinformatics - Top Repos</h2>
      </div>

      <div className="space-y-1.5">
        {repos.map((repo) => (
          <a
            key={`${repo.owner}/${repo.name}`}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium group-hover:text-accent transition-colors">
                  {repo.owner}/{repo.name}
                </span>
              </div>
              <div className="text-xs text-muted line-clamp-1 leading-snug">
                {repo.description}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: repo.languageColor }}
                  />
                  <span className="text-xs text-muted">{repo.language}</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <Star className="w-3 h-3 text-muted" />
                  <span className="text-xs text-muted">{formatNumber(repo.stars)}</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <GitFork className="w-3 h-3 text-muted" />
                  <span className="text-xs text-muted">{formatNumber(repo.forks)}</span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
