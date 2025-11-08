'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Bitcoin } from 'lucide-react';

interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
}

export function Crypto() {
  const [cryptos, setCryptos] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCrypto = async () => {
      try {
        // CoinGecko free API - no key required
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,cardano&vs_currencies=usd&include_24hr_change=true'
        );

        if (!response.ok) {
          throw new Error('Failed to fetch crypto prices');
        }

        const data = await response.json();

        const cryptoData: CryptoPrice[] = [
          {
            id: 'bitcoin',
            symbol: 'BTC',
            name: 'Bitcoin',
            current_price: data.bitcoin.usd,
            price_change_percentage_24h: data.bitcoin.usd_24h_change,
          },
          {
            id: 'ethereum',
            symbol: 'ETH',
            name: 'Ethereum',
            current_price: data.ethereum.usd,
            price_change_percentage_24h: data.ethereum.usd_24h_change,
          },
          {
            id: 'solana',
            symbol: 'SOL',
            name: 'Solana',
            current_price: data.solana.usd,
            price_change_percentage_24h: data.solana.usd_24h_change,
          },
          {
            id: 'cardano',
            symbol: 'ADA',
            name: 'Cardano',
            current_price: data.cardano.usd,
            price_change_percentage_24h: data.cardano.usd_24h_change,
          },
        ];

        setCryptos(cryptoData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load crypto prices');
        setLoading(false);
      }
    };

    fetchCrypto();
    // Refresh every 60 seconds
    const interval = setInterval(fetchCrypto, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return `$${price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
    } else if (price >= 1) {
      return `$${price.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
    } else {
      return `$${price.toFixed(4)}`;
    }
  };

  const formatChange = (change: number) => {
    const isPositive = change >= 0;
    return (
      <span className={`flex items-center gap-0.5 text-xs ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {Math.abs(change).toFixed(2)}%
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-card border border-card-border rounded-lg p-2">
        <div className="flex items-center gap-1 mb-1">
          <Bitcoin className="w-3 h-3 text-muted" />
          <h2 className="text-xs font-semibold">Crypto</h2>
        </div>
        <div className="h-24 flex items-center justify-center">
          <div className="text-muted text-xs">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || cryptos.length === 0) {
    return (
      <div className="bg-card border border-card-border rounded-lg p-2">
        <div className="flex items-center gap-1 mb-1">
          <Bitcoin className="w-3 h-3 text-muted" />
          <h2 className="text-xs font-semibold">Crypto</h2>
        </div>
        <div className="h-24 flex items-center justify-center">
          <div className="text-muted text-xs">{error || 'No data'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-card-border rounded-lg p-2 hover:border-accent/50 transition-colors">
      <div className="flex items-center gap-1 mb-1.5">
        <Bitcoin className="w-3 h-3 text-muted" />
        <h2 className="text-xs font-semibold">Crypto</h2>
      </div>

      <div className="space-y-1">
        {cryptos.map((crypto) => (
          <div key={crypto.id} className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium">{crypto.symbol}</span>
              <span className="text-xs text-muted">{formatPrice(crypto.current_price)}</span>
            </div>
            {formatChange(crypto.price_change_percentage_24h)}
          </div>
        ))}
      </div>
    </div>
  );
}
