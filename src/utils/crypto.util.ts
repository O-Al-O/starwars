import { createHash, createHmac } from 'crypto';

export function sha256(input: any): string {
  return createHash('sha256').update(input).digest('hex');
}

export function hmacSha256(secret: string, data: any): string {
  return createHmac('sha256', secret).update(data).digest('hex');
}