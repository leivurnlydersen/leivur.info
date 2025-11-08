'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface Mover {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export function StockMovers() {
  const [gainers, setGainers] = useState<Mover[]>([]);
  const [losers, setLosers] = useState<Mover[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showGainers, setShowGainers] = useState(true);

  useEffect(() => {
    const fetchMovers = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_STOCK_API_KEY;

        if (!apiKey) {
          setError('API key not configured');
          setLoading(false);
          return;
        }

        // Popular stocks to check for movers
        const symbols = [
          'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA', 'BRK.B',
          'UNH', 'JNJ', 'V', 'WMT', 'XOM', 'JPM', 'PG', 'MA', 'HD', 'CVX',
          'LLY', 'ABBV', 'AVGO', 'KO', 'MRK', 'PEP', 'COST', 'TMO', 'BAC'
        ];

        const stockPromises = symbols.map(async (symbol) => {
          try {
            const response = await fetch(
              `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`
            );
            const data = await response.json();

            if (data.c && data.d !== undefined && data.dp !== undefined) {
              return {
                symbol,
                price: data.c,
                change: data.d,
                changePercent: data.dp,
              };
            }
            return null;
          } catch {
            return null;
          }
        });

        const results = await Promise.all(stockPromises);
        const validStocks = results.filter((s): s is Mover => s !== null);

        // Sort by percent change
        const sorted = [...validStocks].sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));

        const topGainers = sorted.filter(s => s.changePercent > 0).slice(0, 3);
        const topLosers = sorted.filter(s => s.changePercent < 0).slice(0, 3);

        setGainers(topGainers);
        setLosers(topLosers);
        setLoading(false);
      } catch (err) {
        setError('Failed to load movers');
        setLoading(false);
      }
    };

    fetchMovers();
    // Refresh every 2 minutes
    const interval = setInterval(fetchMovers, 120000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    if (price === undefined || price === null || isNaN(price)) {
      return '$-.--';
    }
    return `$${price.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="bg-card border border-card-border rounded-lg p-2 col-span-1 sm:col-span-2 xl:col-span-1 2xl:col-span-2">
        <div className="flex items-center gap-1 mb-1">
          <Activity className="w-3 h-3 text-muted" />
          <h2 className="text-xs font-semibold">Stock Movers</h2>
        </div>
        <div className="h-32 flex items-center justify-center">
          <div className="text-muted text-xs">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card border border-card-border rounded-lg p-2 col-span-1 sm:col-span-2 xl:col-span-1 2xl:col-span-2">
        <div className="flex items-center gap-1 mb-1">
          <Activity className="w-3 h-3 text-muted" />
          <h2 className="text-xs font-semibold">Stock Movers</h2>
        </div>
        <div className="h-32 flex items-center justify-center">
          <div className="text-muted text-xs">{error}</div>
        </div>
      </div>
    );
  }

  const displayStocks = showGainers ? gainers : losers;

  return (
    <div className="bg-card border border-card-border rounded-lg p-2 col-span-1 sm:col-span-2 xl:col-span-1 2xl:col-span-2 hover:border-accent/50 transition-colors">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1">
          <Activity className="w-3 h-3 text-muted" />
          <h2 className="text-xs font-semibold">Today's Movers</h2>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setShowGainers(true)}
            className={`text-xs px-1.5 py-0.5 rounded transition-colors ${
              showGainers
                ? 'bg-green-500/20 text-green-500'
                : 'text-muted hover:bg-accent/10'
            }`}
          >
            Gainers
          </button>
          <button
            onClick={() => setShowGainers(false)}
            className={`text-xs px-1.5 py-0.5 rounded transition-colors ${
              !showGainers
                ? 'bg-red-500/20 text-red-500'
                : 'text-muted hover:bg-accent/10'
            }`}
          >
            Losers
          </button>
        </div>
      </div>

      <div className="space-y-0.5">
        {displayStocks.length === 0 ? (
          <div className="text-xs text-muted text-center py-4">
            No {showGainers ? 'gainers' : 'losers'} found
          </div>
        ) : (
          displayStocks.map((stock) => (
            <div key={stock.symbol} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {stock.changePercent >= 0 ? (
                  <TrendingUp className="w-3 h-3 text-green-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-500" />
                )}
                <span className="text-xs font-medium">{stock.symbol}</span>
                <span className="text-xs text-muted">{formatPrice(stock.price)}</span>
              </div>
              <span className={`text-xs font-medium ${stock.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
