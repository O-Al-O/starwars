import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getCharacterWithPlanetAndWeather } from '../services/swapi.service';
import { isCharacterRegisteredOnDb, registerHistoric } from '../repositories/fusionados-historic.repository';
import { logger } from '../utils/logger.util';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.queryStringParameters?.id || '1';

    const data = await getCharacterWithPlanetAndWeather(Number(id));

    const isRegistered = await isCharacterRegisteredOnDb(id);

    if (!isRegistered)
      await registerHistoric(id, data);

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    logger.error(error, 'Error occurred on Fusionados handler:');

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'An error has been thrown for this service' }),
    };
  }
};