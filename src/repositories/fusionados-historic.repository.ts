import * as dynamoose from 'dynamoose';
import * as crypto from 'crypto';
import { CharacterWithPlanet } from '../models/character-with-planet.interface';
import { SortOrder } from 'dynamoose/dist/General';
import { IndexType } from 'dynamoose/dist/Schema';
import { HistoricQueryIndexKey } from '../models/historic-query-index-key.interface';
import { logger } from '../utils/logger.util';

const SORTED_LIST_INDEX = 'sorted-list-index';
export const SORTED_LIST_INDEX_DEFAULT_VALUE = 'default-id';

const CHARACTER_ID_INDEX = 'character-index';

const HistoricSchema = new dynamoose.Schema(
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
    characterId: {
      type: String,
      required: true,
      index: {
        type: IndexType.global,
        name: CHARACTER_ID_INDEX,
        project: true,
      },
    },
    defaultQueryId: {
      type: String,
      required: false,
      default: () => SORTED_LIST_INDEX_DEFAULT_VALUE,
      index: {
        type: IndexType.global,
        name: SORTED_LIST_INDEX,
        rangeKey: 'createdAt',
        project: true,
      },
    },
  },
  {
    timestamps: true,
    saveUnknown: true,
  },
);

const HISTORIC_TABLE_NAME = 'st-test';

const Historic = dynamoose.model(HISTORIC_TABLE_NAME, HistoricSchema, { create: false });

export async function registerHistoric(characterId: string, data: CharacterWithPlanet) {
  try {
    logger.info('Saving historic on db...');
    await Historic.create({ data: data, characterId: characterId } as any);
    logger.info('Saved on db');
  } catch (error) {
    logger.error(error, 'Could not save item on DB: ');
  }
}

export async function listAllHistoricFromDb(lastKey: HistoricQueryIndexKey | null) {
  try {
    const DEFAULT_LIMIT = 2;

    let query = Historic.query('defaultQueryId')
      .eq(SORTED_LIST_INDEX_DEFAULT_VALUE)
      .using(SORTED_LIST_INDEX)
      .sort(SortOrder.descending);

    if (lastKey) {
      const parsedLastKey: HistoricQueryIndexKey = {
        defaultQueryId: SORTED_LIST_INDEX_DEFAULT_VALUE,
        id: lastKey.id,
        createdAt: lastKey.createdAt,
      };

      query.startAt(parsedLastKey);
    }

    query = query.limit(DEFAULT_LIMIT);

    const results = await query.exec();

    const newLastKey = results.lastKey as HistoricQueryIndexKey;

    return { lastKey: newLastKey, data: results.toJSON() };
  } catch (error) {
    logger.error(error, 'Could not retrieve items from DB: ');
  }
}

export async function isCharacterRegisteredOnDb(id: string) {
  try {
    const models = await Historic.query('characterId')
      .eq(id)
      .using(CHARACTER_ID_INDEX)
      .exec();

    const NO_ITEMS = 0;

    const fetched = models.count ?? NO_ITEMS;

    return fetched > NO_ITEMS;
  } catch (error) {
    logger.error(error, 'Could not retrieve items from DB: ');
  }
}