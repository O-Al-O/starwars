import { defineFeature, loadFeature } from 'jest-cucumber';
import axios from 'axios';
import nock from 'nock';

const feature = loadFeature('./fusionados.feature', { loadRelativePath: true, errors: true });

defineFeature(feature, test => {
  let response: any;

  test('Fetch data successfully', ({ given, when, then, and }) => {
    given('character with "1" as ID exists', async () => {
      nock('https://www.swapi.tech')
        .get('/api/people/1')
        .reply(200, {
          result: {
            properties: {
              name: 'Luke Skywalker',
              homeworld: 'https://www.swapi.tech/api/planets/1',
            },
          },
        });

      nock('https://www.swapi.tech')
        .get('/api/planets/1')
        .reply(200, {
          result: {
            properties: {
              name: 'Tatooine',
            },
          },
        });

      nock('https://api.openweathermap.org')
        .get('/data/2.5/weather')
        .query(true)
        .reply(200, {
          name: 'Cairo',
          weather: [{ description: 'sunny' }],
          main: { temp: 32, humidity: 20 },
        });
    });

    when('GET request is made upon /fusionados?id=1', async () => {
      response = await axios.get('http://localhost:3000/dev/fusionados?id=1');
    });

    then('response status code must be 200', () => {
      expect(response.status).toBe(200);
    });

    and(/^response body property 'characterName' must contain '(.*)'$/, () => {
      expect(response.data.characterName).toBe("Luke Skywalker");
    });
  });
});
