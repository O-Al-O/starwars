import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { registerCustomInfo } from '../services/custom-info.service';
import { logger } from '../utils/logger.util';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const payload = event.body;

    if (payload === null)
      throw new Error('No payload has been sent');

    if (Object.keys(payload).some(key => payload[key] === null || payload[key] === ''))
      throw new Error('Some properties are empty');

    await registerCustomInfo(JSON.parse(payload));

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Record created' }),
    };
  } catch (error) {
    logger.error(error, 'Error occurred on Almacenar handler:');

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'An error has been thrown for this service' }),
    };
  }
};