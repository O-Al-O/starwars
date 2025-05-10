import axios from 'axios';
import { CityCountry } from '../models/city-country.interface';
import { WeatherData } from '../models/weather-data.interface';
import { getFromCache, setToCache } from '../cache/cache.service';
import { SwapiCharacter } from '../models/swapi-character.interface';
import { logger } from '../utils/logger.util';

const API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export async function getWeatherForCity(cityAndCountry: CityCountry) {
  const cityCountry = `${cityAndCountry.city},${cityAndCountry.country}`;

  return await fetchWeather(cityCountry);
}

async function fetchWeather(cityCountry: string) {
  const CACHE_PREFIX = 'WEATHER';

  const weatherCacheKey = `${CACHE_PREFIX}:${cityCountry}`;

  try {
    const cachedWeather = await getFromCache<WeatherData>(weatherCacheKey);

    if (cachedWeather !== null) {
      logger.info('Returning cached Weather');

      return cachedWeather;
    }

    logger.info('Fetching Weather from OpenWeatherMap...');

    const weatherRawResponse = await axios.get(
      BASE_URL,
      {
        params: {
          q: cityCountry,
          appid: API_KEY,
          units: 'metric',
          lang: 'en',
        },
      },
    );

    const data = weatherRawResponse.data;

    const weatherResponse: WeatherData = {
      temperature: { current: `${data.main.temp}°C`, temp_max: `${data.main.temp_max}°C` },
      description: data.weather[0].description,
      city: data.name,
      humidity: data.main.humidity,
    };

    await setToCache(weatherCacheKey, weatherResponse);

    return weatherResponse;
  } catch (error) {
    logger.error(error, 'Error occurred on OpenWeatherMap request:');

    throw new Error('An error has been thrown when consuming OpenWeatherMap');
  }
}
