import pino from 'pino';

export const logger = pino({
  base: { pid: process.pid },
});