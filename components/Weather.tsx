'use client';

import { useEffect, useState } from 'react';
import { Cloud, CloudRain, CloudSnow, Sun, Wind, Droplets, MapPin } from 'lucide-react';

interface WeatherData {
  temp: number;
  humidity: number;
  wind_speed: number;
  description: string;
  icon: string;
  city: string;
}

export function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Get user's location
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                const { latitude, longitude } = position.coords;

                // Fetch from MET.no API (no key required!)
                const response = await fetch(
                  `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${latitude.toFixed(2)}&lon=${longitude.toFixed(2)}`,
                  {
                    headers: {
                      'User-Agent': 'leivur.info personal-dashboard contact@leivur.info',
                    },
                  }
                );

                if (!response.ok) {
                  throw new Error(`Weather API error: ${response.status}`);
                }

                const data = await response.json();
                const current = data.properties.timeseries[0];
                const details = current.data.instant.details;
                const next1h = current.data.next_1_hours;

                // Get city name via reverse geocoding
                let cityName = 'Your Location';
                try {
                  const geoResponse = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
                    {
                      headers: {
                        'User-Agent': 'leivur.info personal-dashboard',
                      },
                    }
                  );
                  const geoData = await geoResponse.json();
                  cityName = geoData.address?.city || geoData.address?.town || geoData.address?.village || 'Your Location';
                } catch {
                  // If geocoding fails, just use default
                }

                const weatherCode = next1h?.summary?.symbol_code || 'cloudy';

                setWeather({
                  temp: Math.round(details.air_temperature),
                  humidity: Math.round(details.relative_humidity),
                  wind_speed: Math.round(details.wind_speed * 3.6), // Convert m/s to km/h
                  description: getWeatherDescription(weatherCode),
                  icon: weatherCode,
                  city: cityName,
                });
                setLoading(false);
              } catch (err) {
                console.error('Weather fetch error:', err);
                setError('Failed to fetch weather data');
                setLoading(false);
              }
            },
            async (geoError) => {
              console.error('Geolocation error:', geoError);

              // Try IP-based geolocation as fallback
              try {
                console.log('Trying IP-based geolocation fallback...');
                const ipResponse = await fetch('https://ipapi.co/json/');
                const ipData = await ipResponse.json();

                if (ipData.latitude && ipData.longitude) {
                  console.log('Got location from IP:', ipData.city);
                  const { latitude, longitude } = ipData;

                  // Fetch weather with IP-based location
                  const response = await fetch(
                    `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${latitude.toFixed(2)}&lon=${longitude.toFixed(2)}`,
                    {
                      headers: {
                        'User-Agent': 'leivur.info personal-dashboard contact@leivur.info',
                      },
                    }
                  );

                  if (!response.ok) {
                    throw new Error(`Weather API error: ${response.status}`);
                  }

                  const data = await response.json();
                  const current = data.properties.timeseries[0];
                  const details = current.data.instant.details;
                  const next1h = current.data.next_1_hours;
                  const weatherCode = next1h?.summary?.symbol_code || 'cloudy';

                  setWeather({
                    temp: Math.round(details.air_temperature),
                    humidity: Math.round(details.relative_humidity),
                    wind_speed: Math.round(details.wind_speed * 3.6),
                    description: getWeatherDescription(weatherCode),
                    icon: weatherCode,
                    city: ipData.city || 'Your Location',
                  });
                  setLoading(false);
                  return;
                }
              } catch (fallbackError) {
                console.error('IP geolocation fallback failed:', fallbackError);
              }

              // If fallback also fails, show error
              let errorMessage = 'Location error';
              switch (geoError.code) {
                case geoError.PERMISSION_DENIED:
                  errorMessage = 'Location access denied';
                  break;
                case geoError.POSITION_UNAVAILABLE:
                  errorMessage = 'Location unavailable';
                  break;
                case geoError.TIMEOUT:
                  errorMessage = 'Location timeout';
                  break;
              }
              setError(errorMessage);
              setLoading(false);
            },
            {
              timeout: 10000, // 10 second timeout
              enableHighAccuracy: false, // Faster, less accurate
              maximumAge: 300000, // Cache position for 5 minutes
            }
          );
        } else {
          setError('Geolocation not supported');
          setLoading(false);
        }
      } catch (err) {
        console.error('Weather component error:', err);
        setError('Failed to load weather');
        setLoading(false);
      }
    };

    fetchWeather();
    // Refresh every 10 minutes
    const interval = setInterval(fetchWeather, 600000);
    return () => clearInterval(interval);
  }, []);

  const getWeatherDescription = (code: string): string => {
    if (code.includes('clearsky')) return 'clear sky';
    if (code.includes('fair')) return 'fair';
    if (code.includes('partlycloudy')) return 'partly cloudy';
    if (code.includes('cloudy')) return 'cloudy';
    if (code.includes('rain')) return 'rain';
    if (code.includes('snow')) return 'snow';
    if (code.includes('sleet')) return 'sleet';
    if (code.includes('fog')) return 'fog';
    return 'cloudy';
  };

  const getWeatherIcon = (code: string) => {
    const iconClass = "w-8 h-8 text-accent";
    const icon = code.toLowerCase();

    if (icon.includes('clearsky') || icon.includes('fair')) {
      return <Sun className={iconClass} />;
    }
    if (icon.includes('rain') || icon.includes('drizzle')) {
      return <CloudRain className={iconClass} />;
    }
    if (icon.includes('snow') || icon.includes('sleet')) {
      return <CloudSnow className={iconClass} />;
    }
    return <Cloud className={iconClass} />;
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
        <MapPin className="w-3 h-3 text-muted" />
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
      </div>
    </div>
  );
}
