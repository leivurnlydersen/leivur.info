'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface Stock {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export function TechStocks() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_STOCK_API_KEY;

        if (!apiKey) {
          setError('API key not configured');
          setLoading(false);
          return;
        }

        const symbols = ['AAPL', 'GOOGL', 'MSFT', 'NVDA', 'TSLA'];

        const stockPromises = symbols.map(async (symbol) => {
          try {
            const response = await fetch(
              `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`
            );
            const data = await response.json();

            // Validate data exists
            if (data.c && data.d !== undefined && data.dp !== undefined) {
              return {
                symbol,
                price: data.c, // current price
                change: data.d, // change
                changePercent: data.dp, // change percent
              };
            }
            return null;
          } catch {
            return null;
          }
        });

        const results = await Promise.all(stockPromises);
        const stocksData = results.filter((s): s is Stock => s !== null);
        setStocks(stocksData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load stocks');
        setLoading(false);
      }
    };

    fetchStocks();
    // Refresh every 60 seconds
    const interval = setInterval(fetchStocks, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    if (price === undefined || price === null || isNaN(price)) {
      return '$-.--';
    }
    return `$${price.toFixed(2)}`;
  };

  const formatChange = (change: number, changePercent: number) => {
    if (changePercent === undefined || changePercent === null || isNaN(changePercent)) {
      return <span className="text-xs text-muted">-</span>;
    }
    const isPositive = change >= 0;
    return (
      <span className={`flex items-center gap-0.5 text-xs ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-card border border-card-border rounded-lg p-2">
        <div className="flex items-center gap-1 mb-1">
          <DollarSign className="w-3 h-3 text-muted" />
          <h2 className="text-xs font-semibold">Tech Stocks</h2>
        </div>
        <div className="h-24 flex items-center justify-center">
          <div className="text-muted text-xs">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || stocks.length === 0) {
    return (
      <div className="bg-card border border-card-border rounded-lg p-2">
        <div className="flex items-center gap-1 mb-1">
          <DollarSign className="w-3 h-3 text-muted" />
          <h2 className="text-xs font-semibold">Tech Stocks</h2>
        </div>
        <div className="h-24 flex items-center justify-center">
          <div className="text-muted text-xs">{error || 'No data'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-card-border rounded-lg p-2 hover:border-accent/50 transition-colors">
      <div className="flex items-center gap-1 mb-1">
        <DollarSign className="w-3 h-3 text-muted" />
        <h2 className="text-xs font-semibold">Tech Stocks</h2>
      </div>

      <div className="space-y-1">
        {stocks.map((stock) => (
          <div key={stock.symbol} className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium">{stock.symbol}</span>
              <span className="text-xs text-muted">{formatPrice(stock.price)}</span>
            </div>
            {formatChange(stock.change, stock.changePercent)}
          </div>
        ))}
      </div>
    </div>
  );
}
