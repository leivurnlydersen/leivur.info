'use client';

import { useEffect, useState } from 'react';
import { Quote } from 'lucide-react';

interface QuoteData {
  text: string;
  author: string;
}

const quotes: QuoteData[] = [
  { text: "The best way to predict the future is to invent it.", author: "Alan Kay" },
  { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
  { text: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde" },
  { text: "The only way to learn a new programming language is by writing programs in it.", author: "Dennis Ritchie" },
  { text: "Programming isn't about what you know; it's about what you can figure out.", author: "Chris Pine" },
  { text: "The most disastrous thing that you can ever learn is your first programming language.", author: "Alan Kay" },
  { text: "Software is a great combination between artistry and engineering.", author: "Bill Gates" },
  { text: "Testing leads to failure, and failure leads to understanding.", author: "Burt Rutan" },
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { text: "Deleted code is debugged code.", author: "Jeff Sickel" },
  { text: "Fix the cause, not the symptom.", author: "Steve Maguire" },
];

export function TechQuote() {
  const [currentQuote, setCurrentQuote] = useState<QuoteData>(quotes[0]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Set random quote on mount
    setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);

    // Change quote every 30 seconds
    const interval = setInterval(() => {
      setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-card border border-card-border rounded-lg p-2">
        <div className="flex items-center gap-1 mb-1">
          <Quote className="w-3 h-3 text-muted" />
          <h2 className="text-xs font-semibold">Quote</h2>
        </div>
        <div className="h-20 flex items-center justify-center">
          <div className="text-muted text-xs">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-card-border rounded-lg p-2 hover:border-accent/50 transition-colors">
      <div className="flex items-center gap-1 mb-1">
        <Quote className="w-3 h-3 text-muted" />
        <h2 className="text-xs font-semibold">Quote of the Moment</h2>
      </div>

      <div>
        <p className="text-xs italic leading-tight text-foreground/90 line-clamp-3 mb-1">
          "{currentQuote.text}"
        </p>
        <p className="text-xs text-muted text-right">
          — {currentQuote.author}
        </p>
      </div>
    </div>
  );
}
