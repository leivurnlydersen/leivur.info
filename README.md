# leivur.info - Personal Dashboard

A minimalistic, information-dense personal dashboard built with Next.js 14, featuring real-time data updates and a clean, responsive design.

## 🚀 Features

### Live Data Widgets

- **Clock** - Real-time clock with date and day of week
- **Weather** - Location-based weather using MET.no API (Norwegian Meteorological Institute)
- **Crypto Prices** - Live BTC, ETH, SOL, ADA prices via CoinGecko
- **Tech Stocks** - Real-time AAPL, GOOGL, MSFT, NVDA, TSLA prices
- **Stock Movers** - Daily top gainers/losers with toggle
- **Hacker News** - Top 8 tech stories from HN
- **GitHub Trending** - Top 6 trending tech repositories
- **Bioinformatics Repos** - Top bioinformatics/genomics repositories
- **Biotech News** - Latest biotech news from FierceBiotech
- **Tech Quote** - Rotating programming quotes

### Design Features

- ✨ **Dark/Light Mode Toggle** - Automatic theme switching
- 📱 **Fully Responsive** - Optimized for mobile, tablet, desktop, and ultrawide displays
- 🎯 **Information Dense** - Tight spacing, maximum data per screen
- 🔄 **Auto-Updating** - All widgets refresh automatically
- 🚫 **No Unnecessary API Keys** - Most features work without authentication

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Theme**: next-themes
- **Icons**: lucide-react
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ and npm
- (Optional) Finnhub API key for stock data
- (Optional) OpenWeatherMap API key (alternative to MET.no)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/leivurnlydersen/leivur.info.git
cd leivur.info
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:

```env
# Optional: Stock API from https://finnhub.io/ (free tier: 60 calls/min)
NEXT_PUBLIC_STOCK_API_KEY=your_finnhub_key_here

# Optional: GitHub token for higher rate limits
GITHUB_TOKEN=your_github_token_here
```

**Note**: Most widgets work without any API keys! Only stock data requires a Finnhub key.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🌐 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/leivurnlydersen/leivur.info)

1. Push your code to GitHub
2. Import your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Connect Custom Domain

1. Go to your Vercel project → Settings → Domains
2. Add your domain (e.g., `leivur.info`)
3. Follow Vercel's DNS configuration instructions

## 🎨 Customization

### Adding New Widgets

Create a new component in `components/`:

```tsx
'use client';

export function MyWidget() {
  return (
    <div className="bg-card border border-card-border rounded-lg p-2 hover:border-accent/50 transition-colors">
      <div className="flex items-center gap-1 mb-1">
        <Icon className="w-3 h-3 text-muted" />
        <h2 className="text-xs font-semibold">Widget Title</h2>
      </div>
      {/* Your content */}
    </div>
  );
}
```

Add to `app/page.tsx`:

```tsx
import { MyWidget } from '@/components/MyWidget';
// ... add to grid
```

### Responsive Breakpoints

```
Mobile:      1 column
Tablet:      2 columns (640px+)
Desktop:     3-4 columns (1024px+)
Ultrawide:   6 columns (1536px+)
```

Adjust column spans for wider widgets:
```tsx
className="col-span-1 sm:col-span-2 xl:col-span-1 2xl:col-span-2"
```

## 📡 APIs Used

| Service | Purpose | Key Required | Rate Limit |
|---------|---------|--------------|------------|
| [MET.no](https://api.met.no) | Weather data | ❌ No | Reasonable use |
| [CoinGecko](https://coingecko.com) | Crypto prices | ❌ No | 10-50/min |
| [Hacker News](https://github.com/HackerNews/API) | Tech news | ❌ No | None |
| [GitHub](https://docs.github.com/en/rest) | Trending repos | ⚠️ Optional | 60/hr (5000 with token) |
| [Finnhub](https://finnhub.io) | Stock prices | ✅ Yes | 60/min (free) |
| [RSS2JSON](https://rss2json.com) | Biotech RSS | ❌ No | 10,000/day |
| [ipapi.co](https://ipapi.co) | IP geolocation | ❌ No | 1,000/day |

## 🏗 Project Structure

```
leivur.info/
├── app/
│   ├── layout.tsx          # Root layout with theme provider
│   ├── page.tsx            # Main dashboard page
│   ├── globals.css         # Global styles & CSS variables
│   └── api/                # API routes (if needed)
├── components/
│   ├── Clock.tsx           # Real-time clock widget
│   ├── Weather.tsx         # Weather widget
│   ├── Crypto.tsx          # Cryptocurrency prices
│   ├── TechStocks.tsx      # Tech stock prices
│   ├── StockMovers.tsx     # Daily stock movers
│   ├── HackerNews.tsx      # Hacker News feed
│   ├── GitHubTrending.tsx  # GitHub trending repos
│   ├── BioinfoRepos.tsx    # Bioinformatics repos
│   ├── BiotechNews.tsx     # Biotech news feed
│   ├── TechQuote.tsx       # Programming quotes
│   ├── ThemeProvider.tsx   # Theme context provider
│   └── ThemeToggle.tsx     # Dark/light mode toggle
├── lib/                    # Utility functions
├── .env.local              # Environment variables (not committed)
├── .env.example            # Example env file
└── package.json
```

## 🎯 Design Philosophy

- **Information Density**: Maximum useful data, minimum wasted space
- **Performance**: Fast loading, efficient updates
- **Simplicity**: Clean design, no clutter
- **Accessibility**: Proper semantics, keyboard navigation
- **Privacy**: No tracking, minimal external dependencies

## 🤝 Contributing

This is a personal project, but suggestions and improvements are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-widget`)
3. Commit your changes (`git commit -m 'Add amazing widget'`)
4. Push to the branch (`git push origin feature/amazing-widget`)
5. Open a Pull Request

## 📝 License

MIT License - feel free to use this project as a starting point for your own dashboard!

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Icons from [Lucide](https://lucide.dev/)
- Weather data from [MET Norway](https://www.met.no/)
- Inspired by minimalist dashboard designs

## 📧 Contact

- Website: [leivur.info](https://leivur.info)
- GitHub: [@leivurnlydersen](https://github.com/leivurnlydersen)

---

**🤖 Built with [Claude Code](https://claude.com/claude-code)**
