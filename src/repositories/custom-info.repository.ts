import * as dynamoose from 'dynamoose';
import * as crypto from 'crypto';
import { logger } from '../utils/logger.util';

const CustomInfoSchema = new dynamoose.Schema(
  {
    id: {
      type: String,
      hashKey: true,
      default: () => crypto.randomUUID(),
    },
    data: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
    saveUnknown: true,
  },
);

const CUSTOM_INFO_TABLE_NAME = 'cu-test';

const CustomInfo = dynamoose.model(CUSTOM_INFO_TABLE_NAME, CustomInfoSchema, { create: false });

export async function registerCustomInfoOnDb(data: Record<string, any>) {
  try {
    logger.info('Saving Custom info on db...');
    await CustomInfo.create({ data: data } as any);
    logger.info('Saved on db');
  } catch (error) {
    logger.error(error, 'Could not save item on DB: ');
  }
}