import { Clock } from '@/components/Clock';
import { Weather } from '@/components/Weather';
import { Crypto } from '@/components/Crypto';
import { HackerNews } from '@/components/HackerNews';
import { GitHubTrending } from '@/components/GitHubTrending';
import { TechQuote } from '@/components/TechQuote';
import { TechStocks } from '@/components/TechStocks';
import { StockMovers } from '@/components/StockMovers';

export default function Home() {
  return (
    <main className="min-h-screen p-2 md:p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-2 auto-rows-min">
        {/* Components will be added here */}
        <Clock />
        <Weather />
        <Crypto />
        <TechStocks />
        <TechQuote />
        <StockMovers />
        <HackerNews />
        <GitHubTrending />
      </div>
    </main>
  );
}
