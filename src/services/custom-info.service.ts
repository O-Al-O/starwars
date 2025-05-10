import { registerCustomInfoOnDb } from '../repositories/custom-info.repository';

export async function registerCustomInfo(data: Record<string, any>) {
  if (!data)
    throw new Error('No payload has been sent');

  return await registerCustomInfoOnDb(data);
}