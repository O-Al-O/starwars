import { listAllHistoricFromDb } from '../repositories/fusionados-historic.repository';
import { decodeBase64, encodeBase64 } from '../utils/encode.util';
import { hmacSha256 } from '../utils/crypto.util';
import { HistoricQueryIndexKey } from '../models/historic-query-index-key.interface';
import { logger } from '../utils/logger.util';

const QUERY_SECRET = process.env.QUERY_PARAM_SIGNATURE_SECRET;

export async function listAllHistoric(nextPage: string | undefined) {
  try {
    let lastKey: HistoricQueryIndexKey | null = null;

    if (nextPage) {
      const decoded = decodeBase64(nextPage);

      const defaultError = new Error('nextPage has been tampered');

      const [key, signature] = decoded.split('/');

      if (!key || !signature)
        throw defaultError;

      const [id, createdAt] = key.split(':');

      if (!id || !createdAt)
        throw defaultError;

      const signedKey = hmacSha256(QUERY_SECRET, key);

      if (signature !== signedKey)
        throw defaultError;

      lastKey = {
        id: id,
        createdAt: Number(createdAt),
      };
    }

    const results = await listAllHistoricFromDb(lastKey);

    let newNextPage: string | undefined = undefined;

    if (results.lastKey) {
      const lastKey = results.lastKey;

      const concatKey = `${lastKey.id}:${lastKey.createdAt}`;

      const signature = hmacSha256(QUERY_SECRET, concatKey);

      const concatSignature = `${concatKey}/${signature}`;

      newNextPage = encodeBase64(concatSignature);
    }

    const mappedData = results?.data?.map(item => ({  requestedAt: item.createdAt, character: item.data })) || [];

    return { nextPage: newNextPage, data: mappedData };
  } catch (error) {
    logger.error(error, 'An error has occurred for Historic: ');

    throw new Error('An error has occurred');
  }
}