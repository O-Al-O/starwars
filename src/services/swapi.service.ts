import axios from 'axios';
import { getWeatherForCity } from './weather.service';
import { PLANET_TO_CITY_MAP } from '../models/planet-city-map.constant';
import { SwapiCharacter } from '../models/swapi-character.interface';
import { SwapiPlanet } from '../models/swapi-planet.interface';
import { CharacterWithPlanet } from '../models/character-with-planet.interface';
import { getFromCache, setToCache } from '../cache/cache.service';
import { sha256 } from '../utils/crypto.util';
import { logger } from '../utils/logger.util';

const SWAPI_BASE_URL = 'https://www.swapi.tech/api';

export async function getCharacterWithPlanetAndWeather(id: number): Promise<CharacterWithPlanet> {
  try {
    const character = await fetchCharacter(id);

    const planet = await fetchPlanet(character.homeworld)

    const cityAndCountry = PLANET_TO_CITY_MAP[planet.name];

    const weather = await getWeatherForCity(cityAndCountry);

    return {
      characterName: character.name,
      originPlanet: {
        name: planet.name,
        climate: planet.climate,
        population: planet.population,
        weather: {
          description: weather.description,
          temperature: { current: weather.temperature.current, max: weather.temperature.temp_max },
          humidity: weather.humidity,
        },
      },
    };
  } catch (error) {
    logger.error(error, 'Error occurred on SWAPI request:');

    throw new Error('An error has been thrown when consuming SWAPI');
  }
}

async function fetchCharacter(id: number) {
  const CACHE_PREFIX = 'CHARACTER';

  const character_cache_key = `${CACHE_PREFIX}:${id}`;

  const cachedCharacter = await getFromCache<SwapiCharacter>(character_cache_key);

  if (cachedCharacter !== null) {
    logger.info('Returning cached Character');

    return cachedCharacter;
  }

  logger.info('Fetching Character from SWAPI...');

  const characterResponse = await axios.get(`${SWAPI_BASE_URL}/people/${id}`);

  const character: SwapiCharacter = characterResponse.data.result.properties;

  await setToCache(character_cache_key, character);

  return character;
}

async function fetchPlanet(planetUrl: string) {
  const CACHE_PREFIX = 'CHARACTER_PLANET';

  const planetUrlHash = sha256(planetUrl);

  const planet_cache_key = `${CACHE_PREFIX}:${planetUrlHash}`;

  const cachedPlanet = await getFromCache<SwapiPlanet>(planet_cache_key);

  if (cachedPlanet !== null) {
    logger.info('Returning cached Planet');

    return cachedPlanet;
  }

  logger.info('Fetching Planet from SWAPI...');

  const planetResponse = await axios.get(planetUrl);

  const planet: SwapiPlanet = planetResponse.data.result.properties;

  await setToCache(planet_cache_key, planet);

  return planet;
}
