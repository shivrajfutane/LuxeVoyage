import axios from 'axios';
import NodeCache from 'node-cache';

// Cache weather responses for 1 hour
const weatherCache = new NodeCache({ stdTTL: 3600 });

// Weather codes mapping for Open-Meteo
const weatherCodeMap = {
  0: 'Clear sky',
  1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Depositing rime fog',
  51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
  61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
  71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow',
  95: 'Thunderstorm'
};

export const getForecast = async (destination) => {
  const cacheKey = destination.toLowerCase().trim();
  const cachedData = weatherCache.get(cacheKey);
  
  if (cachedData) {
    console.log(`[Weather] Using CACHED forecast for ${destination}`);
    return cachedData;
  }

  try {
    console.log(`[Weather] Fetching NEW forecast for ${destination} using Open-Meteo`);
    
    // 1. Get coordinates using Open-Meteo Free Geocoding API
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(destination)}&count=1&language=en&format=json`;
    const geoRes = await axios.get(geoUrl);
    
    if (!geoRes.data || !geoRes.data.results || geoRes.data.results.length === 0) {
      return `Could not determine exact weather for ${destination}.`;
    }

    const { latitude, longitude } = geoRes.data.results[0];

    // 2. Fetch daily forecast 
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
    const weatherRes = await axios.get(weatherUrl);

    const daily = weatherRes.data.daily;
    if (!daily || !daily.time) return "Weather data unavailable.";

    let summary = `5-Day Weather Forecast for ${destination}:\n`;
    for (let i = 0; i < Math.min(5, daily.time.length); i++) {
      const code = daily.weather_code[i];
      const desc = weatherCodeMap[code] || 'Variable conditions';
      summary += `- Day ${i + 1} (${daily.time[i]}): ${desc}. High: ${daily.temperature_2m_max[i]}°C, Low: ${daily.temperature_2m_min[i]}°C\n`;
    }

    // Save to cache
    weatherCache.set(cacheKey, summary);

    return summary;
  } catch (error) {
    console.error('[Weather Error]', error.message);
    return "Error retrieving weather context. Ignore weather constraints.";
  }
};
