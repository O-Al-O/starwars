import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { listAllHistoric } from '../services/fusionados-historic.service';
import { logger } from '../utils/logger.util';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const data = await listAllHistoric(event.queryStringParameters?.nextPage);

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    logger.error(error, 'Error occurred on Historial handler:');

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'An error has been thrown for this service' }),
    };
  }
};