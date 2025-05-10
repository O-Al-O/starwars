jest.mock('redis');

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getCharacterWithPlanetAndWeather } from '../../src/services/swapi.service';

const mock = new MockAdapter(axios);

describe('getCharacterWithPlanetAndWeather', () => {
  beforeEach(() => {
    const peopleResponse = {
      result: {
        properties: {
          name: 'Luke Skywalker',
          homeworld: 'https://www.swapi.tech/api/planets/1',
        },
      },
    };

    const planetResponse = { result: { properties: { name: 'Tatooine' } } };

    const weatherResponse = {
      name: 'Lima',
      weather: [{ description: 'cloudy' }],
      main: { temp: 17, humidity: 19 },
    };

    mock.reset();

    mock
      .onGet(/people\/1/).reply(200, peopleResponse)
      .onGet(/planets\/1/).reply(200, planetResponse)
      .onGet(/weather/).reply(200, weatherResponse);

  });

  it('Returns character with planet successfully', async () => {

    const result = await getCharacterWithPlanetAndWeather(1);

    expect(result.characterName).toBe('Luke Skywalker');

    expect(result.originPlanet.name).toBe('Tatooine');
  });
});