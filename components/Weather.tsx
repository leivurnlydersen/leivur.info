'use client';

import { useEffect, useState } from 'react';
import { Cloud, CloudRain, CloudSnow, Sun, Wind, Droplets, Eye } from 'lucide-react';

interface WeatherData {
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  description: string;
  icon: string;
  city: string;
  visibility: number;
}

export function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

        if (!apiKey) {
          setError('API key not configured');
          setLoading(false);
          return;
        }

        // Get user's location
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;

              const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
              );

              if (!response.ok) {
                throw new Error('Failed to fetch weather');
              }

              const data = await response.json();

              setWeather({
                temp: Math.round(data.main.temp),
                feels_like: Math.round(data.main.feels_like),
                humidity: data.main.humidity,
                wind_speed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
                description: data.weather[0].description,
                icon: data.weather[0].main,
                city: data.name,
                visibility: Math.round(data.visibility / 1000), // Convert to km
              });
              setLoading(false);
            },
            (error) => {
              setError('Location access denied');
              setLoading(false);
            }
          );
        } else {
          setError('Geolocation not supported');
          setLoading(false);
        }
      } catch (err) {
        setError('Failed to load weather');
        setLoading(false);
      }
    };

    fetchWeather();
    // Refresh every 10 minutes
    const interval = setInterval(fetchWeather, 600000);
    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = (icon: string) => {
    const iconClass = "w-8 h-8 text-accent";
    switch (icon.toLowerCase()) {
      case 'clear':
        return <Sun className={iconClass} />;
      case 'clouds':
        return <Cloud className={iconClass} />;
      case 'rain':
      case 'drizzle':
        return <CloudRain className={iconClass} />;
      case 'snow':
        return <CloudSnow className={iconClass} />;
      default:
        return <Cloud className={iconClass} />;
    }
  };

  if (loading) {
    return (
      <div className="bg-card border border-card-border rounded-lg p-2">
        <div className="flex items-center gap-1 mb-1">
          <Cloud className="w-3 h-3 text-muted" />
          <h2 className="text-xs font-semibold">Weather</h2>
        </div>
        <div className="h-24 flex items-center justify-center">
          <div className="text-muted text-xs">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="bg-card border border-card-border rounded-lg p-2">
        <div className="flex items-center gap-1 mb-1">
          <Cloud className="w-3 h-3 text-muted" />
          <h2 className="text-xs font-semibold">Weather</h2>
        </div>
        <div className="h-24 flex items-center justify-center">
          <div className="text-muted text-xs">{error || 'Failed to load'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-card-border rounded-lg p-2 hover:border-accent/50 transition-colors">
      <div className="flex items-center gap-1 mb-1">
        <Cloud className="w-3 h-3 text-muted" />
        <h2 className="text-xs font-semibold">{weather.city}</h2>
      </div>

      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="text-3xl font-bold leading-none">{weather.temp}°C</div>
          <div className="text-xs text-muted mt-0.5 capitalize">{weather.description}</div>
        </div>
        {getWeatherIcon(weather.icon)}
      </div>

      <div className="grid grid-cols-2 gap-1 text-xs">
        <div className="flex items-center gap-1">
          <Droplets className="w-3 h-3 text-muted" />
          <span className="text-muted">{weather.humidity}%</span>
        </div>
        <div className="flex items-center gap-1">
          <Wind className="w-3 h-3 text-muted" />
          <span className="text-muted">{weather.wind_speed} km/h</span>
        </div>
        <div className="flex items-center gap-1">
          <Eye className="w-3 h-3 text-muted" />
          <span className="text-muted">{weather.visibility} km</span>
        </div>
        <div className="text-muted">
          Feels {weather.feels_like}°C
        </div>
      </div>
    </div>
  );
}
